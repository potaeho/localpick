"use client";

import Link from "next/link";
import { track } from "@/lib/events";
import type { EventType } from "@/lib/types";

/**
 * 클릭을 기록하는 링크.
 *
 * 생산자 이야기 · 지역 정보 클릭률은 기획서 6장의 2차 보조 지표이자,
 * "상품 관심이 생산자와 지역 관심으로 이어지는가"라는 팀 미션 연결 질문의
 * 유일한 행동 증거다.
 */
export function TrackedLink({
  href,
  eventType,
  productSlug,
  regionId,
  creatorId,
  className,
  children,
}: {
  href: string;
  eventType: Extract<
    EventType,
    "creator_story_click" | "region_info_click" | "visit_info_click"
  >;
  productSlug?: string;
  regionId?: string;
  creatorId?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        void track({ type: eventType, productSlug, regionId, creatorId });
      }}
    >
      {children}
    </Link>
  );
}
