import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import type { SurveyResponse, TrackedEvent } from "@/lib/types";
import { storage } from "@/lib/store";
import { SESSION_COOKIE } from "@/proxy";
import { QUESTIONS } from "@/lib/survey-questions";
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
  id:
    | "buyReason"
    | "purchaseExperience"
    | "channels"
    | "trustFactors"
    | "regionInterest",
): string[] {
  const question = QUESTIONS.find((item) => item.id === id);
  return question && (question.kind === "single" || question.kind === "multi")
    ? question.options
    : [];
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

  if (input.trigger !== "buy_click" && input.trigger !== "browse_3") {
    return new Response("invalid survey trigger", { status: 400 });
  }
  const trigger = input.trigger;
  const device = input.device === "mobile" ? "mobile" : "desktop";
  const productSlug = str(input.productSlug, 120) || undefined;
  if ((trigger === "buy_click" && !productSlug) || (productSlug && !getProduct(productSlug))) {
    return new Response("invalid product context", { status: 400 });
  }

  const ts = new Date().toISOString();

  const buyReason = str(input.buyReason);
  const buyReasonDetail = str(input.buyReasonDetail, 1000);
  const purchaseExperience = str(input.purchaseExperience);
  const channels = strList(input.channels);
  const trustFactors = strList(input.trustFactors);
  const regionInterest = str(input.regionInterest);

  if (
    !optionValues("buyReason").includes(buyReason) ||
    (buyReason === "기타" && !buyReasonDetail) ||
    !optionValues("purchaseExperience").includes(purchaseExperience) ||
    !onlyAllowed(channels, optionValues("channels")) ||
    !onlyAllowed(trustFactors, optionValues("trustFactors")) ||
    !optionValues("regionInterest").includes(regionInterest) ||
    typeof input.interviewWilling !== "boolean"
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

    buyReason,
    buyReasonDetail: buyReasonDetail || undefined,
    useContext: str(input.useContext, 1000),
    purchaseExperience,
    channels,
    trustFactors,
    regionInterest,
    interviewWilling: input.interviewWilling === true,
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
