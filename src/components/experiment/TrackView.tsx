"use client";

import { useEffect, useRef } from "react";
import { trackOnce } from "@/lib/events";
import type { EventType, UtmParams } from "@/lib/types";
import { useExperiment } from "./ExperimentProvider";

/**
 * 페이지 도달을 기록한다. 서버 컴포넌트인 페이지에 얹어 쓴다.
 *
 * 개발 모드의 StrictMode는 effect를 두 번 실행하므로 ref로 한 번만 보내도록
 * 막는다. 같은 세션의 같은 상품은 퍼널에서 한 번만 분모에 넣는다.
 */
export function TrackView({
  type,
  productSlug,
  regionId,
  creatorId,
  utmSource,
  utmMedium,
  utmCampaign,
  utmContent,
}: {
  type: Extract<EventType, "product_view">;
  productSlug?: string;
  regionId?: string;
  creatorId?: string;
} & UtmParams) {
  const sent = useRef(false);
  const { noteProductViewed } = useExperiment();

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const identity = productSlug ?? regionId ?? creatorId ?? "page";
    void trackOnce(`${type}:${identity}`, {
      type,
      productSlug,
      regionId,
      creatorId,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
    });
    if (productSlug) noteProductViewed(productSlug);
  }, [
    type,
    productSlug,
    regionId,
    creatorId,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    noteProductViewed,
  ]);

  return null;
}
