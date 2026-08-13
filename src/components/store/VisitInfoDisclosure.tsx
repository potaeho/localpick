"use client";

import { useState } from "react";
import { track } from "@/lib/events";

/**
 * 지역 방문 정보 펼치기.
 *
 * 이 클릭이 기획서 6장의 "방문 정보 요청률" — 상품 관심이 실제 지역 방문
 * 관심으로 이어지는지 보는 신호다. 팀 비전(연 100만 명의 지역 방문)과 가장
 * 직접 연결되는 측정 지점이라, 클릭 시 실제 방문 정보를 보여준다.
 */
export function VisitInfoDisclosure({
  regionId,
  regionName,
  items,
}: {
  regionId: string;
  regionName: string;
  items: string[];
}) {
  const [open, setOpen] = useState(false);
  const contentId = `visit-info-${regionId}`;

  const toggleVisitInfo = () => {
    if (!open) {
      void track({ type: "visit_info_click", regionId });
    }
    setOpen((current) => !current);
  };

  return (
    <section className="mt-8 rounded-lp-card border border-lp-green-light bg-lp-green-light p-lp-xl sm:p-lp-xxl">
      <h2 className="text-lp-heading text-lp-green">
        {regionName}에 가면 무엇을 할 수 있나요
      </h2>
      <p className="mt-lp-sm text-sm leading-relaxed text-lp-gray-900">
        이 상품을 만든 곳을 직접 가볼 수 있습니다.
      </p>

      <button
        type="button"
        onClick={toggleVisitInfo}
        aria-controls={contentId}
        aria-expanded={open}
        className="mt-lp-lg min-h-11 rounded-lp-control bg-lp-green px-lp-xl py-2.5 text-lp-button text-white hover:bg-lp-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
      >
        {open ? "방문 정보 접기" : "방문 정보 받아보기"}
      </button>

      {open && (
        <ul id={contentId} className="mt-lp-lg space-y-lp-md">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-lp-md rounded-lp-control bg-white p-lp-lg text-sm leading-relaxed text-lp-gray-900"
            >
              <span aria-hidden="true" className="text-lp-orange">
                ●
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
