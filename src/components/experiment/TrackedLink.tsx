"use client";

import Link from "next/link";
import { track, trackClick } from "@/lib/events";
import type { EventType } from "@/lib/types";

/**
 * 클릭을 기록하는 링크.
 *
 * 생산자 이야기 · 지역 정보 클릭률은 기획서 6장의 2차 보조 지표이자,
 * "상품 관심이 생산자와 지역 관심으로 이어지는가"라는 팀 미션 연결 질문의
 * 유일한 행동 증거다.
 *
 * 서버 컴포넌트(Header, Footer, CategoryChips, ProductCard 등)에서도 그대로
 * 쓸 수 있도록 이 파일만 "use client"다 — onClick 핸들러를 서버 컴포넌트가
 * 직접 넘길 수 없기 때문에, 클릭 추적이 필요한 모든 링크가 이 컴포넌트를
 * 거친다. eventType이 지정된 전용 타입("creator_story_click" 등)이 아니면
 * ui_click으로 label과 함께 남긴다 — 아직 전용 지표가 없는 클릭(로고, 검색
 * 제안, 카테고리 칩 등)도 전부 여기로 들어온다.
 */
export function TrackedLink({
  href,
  eventType,
  label,
  productSlug,
  regionId,
  creatorId,
  className,
  onClick,
  children,
  ...linkProps
}: {
  href: string;
  eventType?: Extract<
    EventType,
    "creator_story_click" | "region_info_click" | "visit_info_click"
  >;
  /** eventType을 생략하면 ui_click으로 남기는 클릭 라벨 (예: "header_logo") */
  label?: string;
  productSlug?: string;
  regionId?: string;
  creatorId?: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  "aria-label"?: string;
  "aria-current"?: React.AriaAttributes["aria-current"];
}) {
  return (
    <Link
      href={href}
      className={className}
      {...linkProps}
      onClick={() => {
        if (eventType) {
          void track({ type: eventType, productSlug, regionId, creatorId });
        } else {
          trackClick(label ?? href, { productSlug, regionId, creatorId });
        }
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
