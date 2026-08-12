import Link from "next/link";
import type { Region } from "@/lib/types";

/**
 * 지역 핀 좌표 — 실제 위경도가 아니라, 일러스트 지도 안에서 각 지역이 있는
 * 방향(강원은 우상단, 경북은 우측, 경남은 우하단, 전북·전남은 좌측,
 * 제주는 남쪽 섬)을 살린 근사 배치다. `KOREA_PATH`/`JEJU_PATH`와 같은
 * viewBox(0 0 300 460) 좌표계를 쓴다.
 */
const REGION_PINS: Record<string, { x: number; y: number }> = {
  chuncheon: { x: 197, y: 68 },
  hongcheon: { x: 172, y: 100 },
  yeongwol: { x: 202, y: 138 },
  yeongdeok: { x: 226, y: 188 },
  uiseong: { x: 193, y: 208 },
  gyeongju: { x: 213, y: 258 },
  gochang: { x: 92, y: 238 },
  sunchang: { x: 118, y: 262 },
  gokseong: { x: 108, y: 300 },
  wando: { x: 86, y: 348 },
  sancheong: { x: 165, y: 292 },
  hadong: { x: 143, y: 312 },
  tongyeong: { x: 188, y: 335 },
  jeju: { x: 114, y: 428 },
};

const KOREA_PATH =
  "M 128.0 18.0 C 138.5 19.0, 155.2 21.8, 168.0 28.0 C 180.8 34.2, 194.3 43.8, 205.0 55.0 C 215.7 66.2, 226.5 80.8, 232.0 95.0 C 237.5 109.2, 238.0 124.2, 238.0 140.0 C 238.0 155.8, 231.7 175.0, 232.0 190.0 C 232.3 205.0, 241.7 215.8, 240.0 230.0 C 238.3 244.2, 224.0 260.8, 222.0 275.0 C 220.0 289.2, 230.8 302.5, 228.0 315.0 C 225.2 327.5, 213.3 341.7, 205.0 350.0 C 196.7 358.3, 187.2 361.3, 178.0 365.0 C 168.8 368.7, 159.7 371.5, 150.0 372.0 C 140.3 372.5, 129.7 371.7, 120.0 368.0 C 110.3 364.3, 100.7 358.0, 92.0 350.0 C 83.3 342.0, 73.7 332.5, 68.0 320.0 C 62.3 307.5, 59.0 290.8, 58.0 275.0 C 57.0 259.2, 62.5 241.7, 62.0 225.0 C 61.5 208.3, 54.5 191.7, 55.0 175.0 C 55.5 158.3, 64.2 140.8, 65.0 125.0 C 65.8 109.2, 56.7 93.3, 60.0 80.0 C 63.3 66.7, 77.5 54.7, 85.0 45.0 C 92.5 35.3, 97.8 26.5, 105.0 22.0 C 112.2 17.5, 117.5 17.0, 128.0 18.0 Z";

const JEJU_PATH =
  "M 95.0 410.0 C 101.0 407.0, 110.5 401.7, 118.0 402.0 C 125.5 402.3, 135.0 407.3, 140.0 412.0 C 145.0 416.7, 149.3 424.0, 148.0 430.0 C 146.7 436.0, 139.2 444.7, 132.0 448.0 C 124.8 451.3, 112.7 451.7, 105.0 450.0 C 97.3 448.3, 89.8 443.0, 86.0 438.0 C 82.2 433.0, 80.5 424.7, 82.0 420.0 C 83.5 415.3, 89.0 413.0, 95.0 410.0 Z";

/**
 * 한반도(남한) 일러스트 지도 — 지역별 보기의 시각적 진입점.
 *
 * 실측 지도가 아니라 브랜드 톤에 맞춘 단순화된 실루엣이다. 각 핀은 실제
 * `/regions/[region]` 페이지로 연결되며, 그 페이지에서 지역 소개와 상품
 * 목록을 보여주고, 상품 카드는 다시 `/products/[slug]` 상세로 이어진다 —
 * 이 지도는 그 흐름의 시작점 역할만 한다.
 */
export function KoreaMap({
  regions,
  productCounts,
  activeRegionId,
}: {
  regions: Region[];
  productCounts: Record<string, number>;
  activeRegionId?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-sm select-none">
      <svg
        viewBox="0 0 300 460"
        role="img"
        aria-label="지역별 상품 지도"
        className="w-full"
      >
        <path
          d={KOREA_PATH}
          className="fill-lp-green-light stroke-lp-green"
          strokeWidth={1.5}
        />
        <path
          d={JEJU_PATH}
          className="fill-lp-green-light stroke-lp-green"
          strokeWidth={1.5}
        />

        {regions.map((region) => {
          const pin = REGION_PINS[region.id];
          if (!pin) return null;
          const isActive = region.id === activeRegionId;

          return (
            <Link
              key={region.id}
              href={`/regions/${region.id}`}
              aria-label={`${region.province} ${region.name} 상품 보기 (${
                productCounts[region.id] ?? 0
              }개)`}
              className="group cursor-pointer outline-none"
            >
              {/* 실제 클릭 판정 영역 — 시각적 점보다 넓게 잡아 터치하기 쉽게 한다 */}
              <circle cx={pin.x} cy={pin.y} r={14} className="fill-transparent" />
              <circle
                cx={pin.x}
                cy={pin.y}
                r={isActive ? 7 : 5}
                className={
                  isActive
                    ? "fill-lp-orange transition-all"
                    : "fill-lp-green transition-all group-hover:fill-lp-orange group-focus-visible:fill-lp-orange"
                }
                stroke="white"
                strokeWidth={1.5}
              />
              <text
                x={pin.x}
                y={pin.y - 11}
                textAnchor="middle"
                className={
                  isActive
                    ? "fill-lp-orange text-[10px] font-bold"
                    : "fill-lp-ink text-[10px] font-medium transition-colors group-hover:fill-lp-orange group-focus-visible:fill-lp-orange"
                }
              >
                {region.name}
              </text>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
