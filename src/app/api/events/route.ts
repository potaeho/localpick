import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import {
  EVENT_TYPES,
  MULTI_FIRE_EVENT_TYPES,
  type EventType,
  type TrackedEvent,
} from "@/lib/types";
import { storage } from "@/lib/store";
import { SESSION_COOKIE } from "@/proxy";
import { getVerifiedAnonymousSessionId } from "@/lib/anonymous-session";
import { getCreator, getProduct, getRegion } from "@/lib/products";

const PRODUCT_EVENT_TYPES = new Set<EventType>([
  "product_view",
  "buy_click",
  "fakedoor_shown",
]);

/** 자유 입력이 아닌 값들이지만, 조작된 요청이 집계를 오염시키지 않도록 잘라둔다 */
function clamp(value: unknown, max = 120): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function clampNumber(value: unknown, min: number, max: number): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const type = input.type;

  if (!EVENT_TYPES.includes(type as EventType)) {
    return new Response("unknown event type", { status: 400 });
  }

  const sessionId = await getVerifiedAnonymousSessionId(
    (await cookies()).get(SESSION_COOKIE)?.value,
  );
  if (!sessionId) {
    // proxy가 쿠키를 발급하므로 정상 흐름에서는 도달하지 않는다.
    // 세션을 묶을 수 없는 이벤트는 집계를 왜곡하므로 저장하지 않는다.
    return new Response("no session", { status: 400 });
  }

  const requestedProductSlug = clamp(input.productSlug);
  const requestedCreatorId = clamp(input.creatorId);
  const requestedRegionId = clamp(input.regionId);
  const product = requestedProductSlug ? getProduct(requestedProductSlug) : undefined;
  const creator = requestedCreatorId ? getCreator(requestedCreatorId) : undefined;
  const region = requestedRegionId ? getRegion(requestedRegionId) : undefined;

  if ((requestedProductSlug && !product) || (requestedCreatorId && !creator) || (requestedRegionId && !region)) {
    return new Response("unknown catalog context", { status: 400 });
  }
  if (product && ((creator && creator.id !== product.creatorId) || (region && region.id !== product.regionId))) {
    return new Response("inconsistent catalog context", { status: 400 });
  }
  if (!product && creator && region && creator.regionId !== region.id) {
    return new Response("inconsistent creator region", { status: 400 });
  }

  // Request fields are only context hints. Canonical relationships always come
  // from the local catalogue so a forged creator/region pair cannot affect KPIs.
  const productSlug = product?.slug;
  const creatorId = product?.creatorId ?? creator?.id;
  const regionId = product?.regionId ?? creator?.regionId ?? region?.id;
  const trigger = input.trigger === "buy_click" || input.trigger === "browse_3" ? input.trigger : undefined;

  // 클릭 로그·이탈 이벤트는 같은 세션에서 여러 번 일어나는 게 정상이라,
  // dedupe_key에 매번 다른 값을 섞어야 서버가 두 번째부터를 중복으로 보고
  // 버리지 않는다. 나머지 이벤트는 지금처럼 세션당 한 번만 남는 게 맞다.
  const dedupeSuffix = MULTI_FIRE_EVENT_TYPES.has(type as EventType)
    ? (clamp(input.clientEventId, 64) ?? crypto.randomUUID())
    : "";
  const dedupeKey = [
    sessionId,
    type,
    productSlug ?? "",
    creatorId ?? "",
    regionId ?? "",
    trigger ?? "",
    dedupeSuffix,
  ].join(":");

  const event: TrackedEvent = {
    id: crypto.randomUUID(),
    dedupeKey,
    type: type as EventType,
    sessionId,
    ts: new Date().toISOString(),
    device: input.device === "mobile" ? "mobile" : "desktop",
    productSlug,
    regionId,
    creatorId,
    utmSource: clamp(input.utmSource),
    utmMedium: clamp(input.utmMedium),
    utmCampaign: clamp(input.utmCampaign),
    utmContent: clamp(input.utmContent),
    trigger,
    label: clamp(input.label, 200),
    referrer: clamp(input.referrer, 300),
    landingPath: clamp(input.landingPath, 300),
    path: clamp(input.path, 300),
    durationMs: clampNumber(input.durationMs, 0, 1000 * 60 * 60 * 6),
    scrollDepth: clampNumber(input.scrollDepth, 0, 100),
  };

  if (PRODUCT_EVENT_TYPES.has(event.type) && !event.productSlug) {
    return new Response("product event requires productSlug", { status: 400 });
  }
  if (event.type === "creator_story_click" && !event.creatorId) {
    return new Response("creator event requires creatorId", { status: 400 });
  }
  if (
    (event.type === "region_info_click" || event.type === "visit_info_click") &&
    !event.regionId
  ) {
    return new Response("region event requires regionId", { status: 400 });
  }

  // Supabase uses a unique(dedupe_key) index and atomic conflict-ignore write;
  // the JSONL development adapter is append-only and relies on client guards.
  await storage.appendEvent(event);

  return new Response(null, { status: 204 });
}
