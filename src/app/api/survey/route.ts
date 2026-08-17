import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import {
  isSurveyTrigger,
  type SurveyAnswers,
  type SurveyResponse,
  type SurveyTrigger,
  type TrackedEvent,
} from "@/lib/types";
import { storage } from "@/lib/store";
import { SESSION_COOKIE } from "@/proxy";
import {
  NO_PURCHASE_EXPERIENCE,
  REGION_ATTENTION_LOW,
  questionsForAnswers,
  questionsForTrigger,
  type Question,
} from "@/lib/survey-questions";
import { getVerifiedAnonymousSessionId } from "@/lib/anonymous-session";
import { getProduct } from "@/lib/products";

function str(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
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
  trigger: SurveyTrigger,
  id: keyof SurveyResponse,
): string[] {
  const question = questionsForTrigger(trigger).find((item) => item.id === id);
  return question && (question.kind === "single" || question.kind === "multi")
    ? question.options
    : [];
}

function validQuestionAnswer(
  question: Question,
  answers: Partial<SurveyResponse>,
): boolean {
  const value = answers[question.id];
  if (question.kind === "boolean") return typeof value === "boolean";
  if (question.kind === "multi") {
    return Array.isArray(value) && onlyAllowed(value, question.options);
  }
  if (question.kind === "single") {
    return typeof value === "string" && question.options.includes(value);
  }
  return question.optional || (typeof value === "string" && value.length > 0);
}

function onlyAllowed(values: string[], allowed: string[]): boolean {
  return values.length > 0 && values.every((value) => allowed.includes(value));
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

  if (!isSurveyTrigger(input.trigger)) {
    return new Response("invalid survey trigger", { status: 400 });
  }
  const trigger = input.trigger;
  const device = input.device === "mobile" ? "mobile" : "desktop";
  const productSlug = str(input.productSlug, 120) || undefined;
  if ((trigger === "buy_click" && !productSlug) || (productSlug && !getProduct(productSlug))) {
    return new Response("invalid product context", { status: 400 });
  }

  const ts = new Date().toISOString();

  const purchaseExperience = str(input.purchaseExperience);
  const hasExperience = purchaseExperience !== NO_PURCHASE_EXPERIENCE;
  const regionAttention = str(input.regionAttention);
  const hasLowRegionAttention = REGION_ATTENTION_LOW.includes(regionAttention);
  const candidate: Partial<SurveyResponse> = {
    purchaseExperience,
    channels: hasExperience ? strList(input.channels) : [],
    productCategories: hasExperience ? strList(input.productCategories) : [],
    purchaseFrequency: hasExperience ? str(input.purchaseFrequency) : "",
    typicalSpend: hasExperience ? str(input.typicalSpend) : "",
    purchasePurposes: hasExperience ? strList(input.purchasePurposes) : [],
    trustFactors: hasExperience ? strList(input.trustFactors) : [],
    purchaseProblems: hasExperience ? strList(input.purchaseProblems) : [],
    purchaseBarriers: hasExperience ? [] : strList(input.purchaseBarriers),
    offlineChannels: hasExperience ? [] : strList(input.offlineChannels),
    purchaseConditions: hasExperience ? [] : strList(input.purchaseConditions),
    prospectiveChannels: hasExperience ? [] : strList(input.prospectiveChannels),
    purchaseConcerns: hasExperience ? [] : strList(input.purchaseConcerns),
    regionAttention,
    regionReasons: hasLowRegionAttention ? [] : strList(input.regionReasons),
    regionNonReasons: hasLowRegionAttention ? strList(input.regionNonReasons) : [],
    producerStoryHelp: str(input.producerStoryHelp),
    processInfoTrust: str(input.processInfoTrust),
    regionInterest: str(input.regionInterest),
    travelInfoInterest: str(input.travelInfoInterest),
    regionalImpactInfluence: str(input.regionalImpactInfluence),
    preferredStoryFocus: str(input.preferredStoryFocus),
    ageGroup: str(input.ageGroup),
    gender: str(input.gender),
    interviewWilling:
      typeof input.interviewWilling === "boolean"
        ? input.interviewWilling
        : undefined,
  };
  const visibleQuestions = questionsForAnswers(
    trigger,
    candidate as Partial<SurveyResponse>,
  );
  if (
    !optionValues(trigger, "purchaseExperience").includes(purchaseExperience) ||
    !visibleQuestions.every((question) => validQuestionAnswer(question, candidate))
  ) {
    return new Response("incomplete or invalid survey", { status: 400 });
  }

  const response: SurveyResponse = {
    id: crypto.randomUUID(),
    dedupeKey: [sessionId, "survey", trigger, productSlug ?? ""].join(":"),
    sessionId,
    ts,
    productSlug,
    trigger,
    device,
    utmSource: str(input.utmSource, 120) || undefined,
    utmMedium: str(input.utmMedium, 120) || undefined,
    utmCampaign: str(input.utmCampaign, 120) || undefined,
    utmContent: str(input.utmContent, 120) || undefined,

    ...(candidate as SurveyAnswers),
  };

  const surveyId = await storage.saveSurvey(response);
  // The event has its own unique key, so a retried survey request cannot add a
  // second funnel completion even when it races with the first delivery.
  const event: TrackedEvent = {
    id: crypto.randomUUID(),
    dedupeKey: [sessionId, "survey_complete", productSlug ?? "", "", "", trigger].join(":"),
    type: "survey_complete", sessionId, ts, device, productSlug, trigger,
    utmSource: response.utmSource, utmMedium: response.utmMedium,
    utmCampaign: response.utmCampaign, utmContent: response.utmContent,
  };
  await storage.appendEvent(event);

  return Response.json({ surveyId }, { status: 201 });
}
