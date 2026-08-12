import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import type { SurveyAnswers, SurveyProgress } from "@/lib/types";
import { storage } from "@/lib/store";
import { SESSION_COOKIE } from "@/proxy";
import { QUESTIONS } from "@/lib/survey-questions";
import { getVerifiedAnonymousSessionId } from "@/lib/anonymous-session";
import { getProduct } from "@/lib/products";

/**
 * 설문 도중 답변 스냅샷 저장.
 *
 * `/api/survey`(최종 제출)와 달리 이 라우트는 **완결성을 요구하지 않는다.**
 * 사용자가 몇 번째 문항에서 멈추든, 그때까지 고른 값을 있는 그대로 받아들인다
 * — 다만 값 자체는 실제 선택지에 있는 것만 받아 조작된 데이터가 섞이지 않게
 * 거른다. 잘못된 개별 값은 조용히 버리고 나머지는 저장한다(자동저장이 사용자
 * 흐름을 막아서는 안 되기 때문).
 *
 * dedupeKey는 `/api/survey`와 **같은 공식**을 쓴다: 같은 시도(세션+트리거+
 * 상품)를 가리키는 값이 완료되면 그 문자열이 lp_surveys.dedupe_key로도
 * 쓰이므로, 두 테이블의 값이 논리적으로 이어진다.
 */
function str(value: unknown, max = 500): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed || undefined;
}

function strList(value: unknown, max = 12): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .slice(0, max)
    .map((item) => item.trim().slice(0, 200))
    .filter(Boolean);
}

function optionValues(
  id: "buyReason" | "purchaseExperience" | "channels" | "trustFactors" | "regionInterest",
): string[] {
  const question = QUESTIONS.find((item) => item.id === id);
  return question && (question.kind === "single" || question.kind === "multi")
    ? question.options
    : [];
}

const QUESTION_IDS = new Set(QUESTIONS.map((question) => question.id));

/** 이미 알려진 선택지에 있는 값만 통과시킨다. 나머지는 자동저장이라 조용히 버린다. */
function sanitizeAnswers(input: unknown): Partial<SurveyAnswers> {
  if (!input || typeof input !== "object") return {};
  const raw = input as Record<string, unknown>;
  const answers: Partial<SurveyAnswers> = {};

  const buyReason = str(raw.buyReason, 120);
  if (buyReason && optionValues("buyReason").includes(buyReason)) {
    answers.buyReason = buyReason;
  }
  const buyReasonDetail = str(raw.buyReasonDetail, 1000);
  if (buyReasonDetail) answers.buyReasonDetail = buyReasonDetail;

  const useContext = str(raw.useContext, 1000);
  if (useContext) answers.useContext = useContext;

  const purchaseExperience = str(raw.purchaseExperience, 120);
  if (purchaseExperience && optionValues("purchaseExperience").includes(purchaseExperience)) {
    answers.purchaseExperience = purchaseExperience;
  }

  const channels = strList(raw.channels).filter((v) => optionValues("channels").includes(v));
  if (channels.length > 0) answers.channels = channels;

  const trustFactors = strList(raw.trustFactors).filter((v) => optionValues("trustFactors").includes(v));
  if (trustFactors.length > 0) answers.trustFactors = trustFactors;

  const regionInterest = str(raw.regionInterest, 120);
  if (regionInterest && optionValues("regionInterest").includes(regionInterest)) {
    answers.regionInterest = regionInterest;
  }

  if (typeof raw.interviewWilling === "boolean") {
    answers.interviewWilling = raw.interviewWilling;
  }

  return answers;
}

function computeDedupeKey(sessionId: string, trigger: string, productSlug?: string): string {
  return [sessionId, "survey", trigger, productSlug ?? ""].join(":");
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const input = body as Record<string, unknown>;

  const sessionId = await getVerifiedAnonymousSessionId(
    (await cookies()).get(SESSION_COOKIE)?.value,
  );
  if (!sessionId) return new Response("no session", { status: 400 });

  if (input.trigger !== "buy_click" && input.trigger !== "browse_3") {
    return new Response("invalid survey trigger", { status: 400 });
  }
  const trigger = input.trigger;
  const device = input.device === "mobile" ? "mobile" : "desktop";

  const rawProductSlug = str(input.productSlug, 120);
  const productSlug =
    rawProductSlug && getProduct(rawProductSlug) ? rawProductSlug : undefined;

  const answers = sanitizeAnswers(input.answers);
  // 아무것도 안 골랐으면 저장할 게 없다 — 빈 스냅샷을 쌓아 upsert 트래픽만
  // 늘릴 이유가 없다.
  if (Object.keys(answers).length === 0) {
    return new Response(null, { status: 204 });
  }

  const lastQuestionId =
    typeof input.lastQuestionId === "string" && QUESTION_IDS.has(input.lastQuestionId as keyof SurveyAnswers)
      ? (input.lastQuestionId as keyof SurveyAnswers)
      : undefined;

  const progress: SurveyProgress = {
    dedupeKey: computeDedupeKey(sessionId, trigger, productSlug),
    sessionId,
    ts: new Date().toISOString(),
    trigger,
    productSlug,
    device,
    answers,
    lastQuestionId,
    utmSource: str(input.utmSource, 120),
    utmMedium: str(input.utmMedium, 120),
    utmCampaign: str(input.utmCampaign, 120),
    utmContent: str(input.utmContent, 120),
  };

  await storage.saveProgress(progress);
  return new Response(null, { status: 204 });
}

/**
 * 설문을 끝까지 완료했을 때 초안을 정리한다. dedupeKey는 클라이언트가 직접
 * 보내지 않고 서버가 검증된 세션으로 다시 계산한다 — 그래야 다른 사람의
 * 진행 기록을 지우도록 조작할 수 없다.
 */
export async function DELETE(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const input = body as Record<string, unknown>;

  const sessionId = await getVerifiedAnonymousSessionId(
    (await cookies()).get(SESSION_COOKIE)?.value,
  );
  if (!sessionId) return new Response("no session", { status: 400 });

  if (input.trigger !== "buy_click" && input.trigger !== "browse_3") {
    return new Response("invalid survey trigger", { status: 400 });
  }
  const productSlug = str(input.productSlug, 120);

  await storage.deleteProgress(computeDedupeKey(sessionId, input.trigger, productSlug));
  return new Response(null, { status: 204 });
}
