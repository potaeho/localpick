import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import type { ConsentPurpose, InterviewConsent, TrackedEvent } from "@/lib/types";
import { storage } from "@/lib/store";
import { PRIVACY_CONTACT, PRIVACY_NOTICE_VERSION } from "@/lib/consent";
import { SESSION_COOKIE } from "@/proxy";
import { getVerifiedAnonymousSessionId } from "@/lib/anonymous-session";

const VALID_PURPOSES = new Set<ConsentPurpose>(["interview", "raffle"]);

/**
 * 인터뷰·추첨 연락처 저장.
 *
 * 설문 응답과 **별도 엔드포인트 · 별도 파일**로 분리한다. 기획서 5단계가
 * 요구하는 분리 수집이자, 대시보드에서 연락처만 따로 접근 통제하기 위한
 * 구조이기도 하다.
 *
 * 실제 인터뷰 참여자만 상품 추첨 대상이므로, 인터뷰 참여 의사를 밝힌 완료
 * 설문만 연락처를 남길 수 있고 interview·raffle 두 목적을 함께 동의받는다.
 */
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
  if (!PRIVACY_CONTACT) {
    return new Response("privacy contact is not configured", { status: 503 });
  }

  const surveyId =
    typeof input.surveyId === "string" ? input.surveyId.slice(0, 60) : "";
  const name = typeof input.name === "string" ? input.name.trim().slice(0, 60) : "";
  const contact =
    typeof input.contact === "string" ? input.contact.trim().slice(0, 200) : "";

  if (!surveyId || !contact) {
    return new Response("surveyId and contact are required", { status: 400 });
  }

  if (input.agreed !== true) {
    return new Response("privacy consent is required", { status: 400 });
  }

  const purposes = Array.isArray(input.purposes)
    ? [...new Set(input.purposes.filter((p): p is ConsentPurpose =>
        typeof p === "string" && VALID_PURPOSES.has(p as ConsentPurpose),
      ))]
    : [];
  if (
    purposes.length !== 2 ||
    !purposes.includes("interview") ||
    !purposes.includes("raffle")
  ) {
    return new Response("interview and raffle purposes are required", { status: 400 });
  }

  const contactType = input.contactType === "phone" ? "phone" : "email";
  const contactIsValid =
    contactType === "email"
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
      : /^[0-9+()\-\s]{7,30}$/.test(contact);
  if (!contactIsValid) {
    return new Response("invalid contact", { status: 400 });
  }

  const survey = await storage.findSurveyForConsent(surveyId, sessionId);
  if (!survey) {
    return new Response("eligible survey not found", { status: 400 });
  }
  if (!survey.interviewWilling) {
    return new Response("survey did not opt into interview", { status: 400 });
  }

  const ts = new Date().toISOString();

  const consent: InterviewConsent = {
    id: crypto.randomUUID(),
    dedupeKey: [sessionId, "interview_consent", surveyId].join(":"),
    sessionId,
    ts,
    surveyId,
    name,
    contact,
    contactType,
    purposes,
    noticeVersion: PRIVACY_NOTICE_VERSION,
  };

  const inserted = await storage.saveConsent(consent);
  if (inserted) {
    const event: TrackedEvent = {
      id: crypto.randomUUID(),
      dedupeKey: [sessionId, "interview_consent", survey.productSlug ?? "", "", "", survey.trigger].join(":"),
      type: "interview_consent",
      sessionId,
      ts,
      // The consent request is deliberately minimal. Use the already verified
      // survey as the source of funnel and campaign context instead of trusting
      // request-controlled attribution fields.
      device: survey.device,
      productSlug: survey.productSlug,
      trigger: survey.trigger,
      utmSource: survey.utmSource,
      utmMedium: survey.utmMedium,
      utmCampaign: survey.utmCampaign,
      utmContent: survey.utmContent,
    };
    await storage.appendEvent(event);
  }

  return new Response(null, { status: 204 });
}
