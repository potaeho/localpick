import Link from "next/link";
import type { ProductImageKind, Region } from "@/lib/types";
import { getProductsByRegion } from "@/lib/products";
import { PALETTES } from "./ProductImage";

/**
 * 지역 핀 좌표 — 실제 위경도가 아니라, 일러스트 지도 안에서 각 지역이 있는
 * 방향(강원은 우상단, 경북은 우측, 경남은 우하단, 전북·전남은 좌측,
 * 제주는 남쪽 섬)을 살린 근사 배치다. `KOREA_PATH`/`JEJU_PATH`와 같은
 * viewBox(0 0 300 460) 좌표계를 쓴다.
 */
const REGION_PINS: Record<string, { x: number; y: number; labelSide?: "left" | "right" }> = {
  chuncheon: { x: 197, y: 66, labelSide: "right" },
  hongcheon: { x: 168, y: 100, labelSide: "left" },
  yeongwol: { x: 206, y: 136, labelSide: "right" },
  yeongdeok: { x: 228, y: 186, labelSide: "right" },
  uiseong: { x: 190, y: 210, labelSide: "left" },
  gyeongju: { x: 215, y: 258, labelSide: "right" },
  gochang: { x: 88, y: 236, labelSide: "left" },
  sunchang: { x: 122, y: 264, labelSide: "right" },
  gokseong: { x: 104, y: 302, labelSide: "left" },
  wando: { x: 82, y: 350, labelSide: "left" },
  sancheong: { x: 168, y: 290, labelSide: "right" },
  hadong: { x: 140, y: 316, labelSide: "left" },
  tongyeong: { x: 190, y: 337, labelSide: "right" },
  jeju: { x: 114, y: 428, labelSide: "right" },
};

const KOREA_PATH =
  "M 128.0 18.0 C 138.5 19.0, 155.2 21.8, 168.0 28.0 C 180.8 34.2, 194.3 43.8, 205.0 55.0 C 215.7 66.2, 226.5 80.8, 232.0 95.0 C 237.5 109.2, 238.0 124.2, 238.0 140.0 C 238.0 155.8, 231.7 175.0, 232.0 190.0 C 232.3 205.0, 241.7 215.8, 240.0 230.0 C 238.3 244.2, 224.0 260.8, 222.0 275.0 C 220.0 289.2, 230.8 302.5, 228.0 315.0 C 225.2 327.5, 213.3 341.7, 205.0 350.0 C 196.7 358.3, 187.2 361.3, 178.0 365.0 C 168.8 368.7, 159.7 371.5, 150.0 372.0 C 140.3 372.5, 129.7 371.7, 120.0 368.0 C 110.3 364.3, 100.7 358.0, 92.0 350.0 C 83.3 342.0, 73.7 332.5, 68.0 320.0 C 62.3 307.5, 59.0 290.8, 58.0 275.0 C 57.0 259.2, 62.5 241.7, 62.0 225.0 C 61.5 208.3, 54.5 191.7, 55.0 175.0 C 55.5 158.3, 64.2 140.8, 65.0 125.0 C 65.8 109.2, 56.7 93.3, 60.0 80.0 C 63.3 66.7, 77.5 54.7, 85.0 45.0 C 92.5 35.3, 97.8 26.5, 105.0 22.0 C 112.2 17.5, 117.5 17.0, 128.0 18.0 Z";

const JEJU_PATH =
  "M 95.0 410.0 C 101.0 407.0, 110.5 401.7, 118.0 402.0 C 125.5 402.3, 135.0 407.3, 140.0 412.0 C 145.0 416.7, 149.3 424.0, 148.0 430.0 C 146.7 436.0, 139.2 444.7, 132.0 448.0 C 124.8 451.3, 112.7 451.7, 105.0 450.0 C 97.3 448.3, 89.8 443.0, 86.0 438.0 C 82.2 433.0, 80.5 424.7, 82.0 420.0 C 83.5 415.3, 89.0 413.0, 95.0 410.0 Z";

/** 지역을 대표하는 상품 한 종류를 골라 핀 아이콘 모양을 정한다 */
function representativeKind(regionId: string): ProductImageKind | null {
  const [first] = getProductsByRegion(regionId);
  return first?.imageKind ?? null;
}

/** 핀 안에 들어가는 작은 단색 아이콘 — 24x24 기준, currentColor를 쓴다 */
function PinIcon({ kind }: { kind: ProductImageKind }) {
  switch (kind) {
    case "jar":
      return <path d="M8 4h8v2.5l1.5 3V19a1 1 0 0 1-1 1H7.5a1 1 0 0 1-1-1V9.5L8 6.5Z" />;
    case "bottle":
      return <path d="M10.5 3h3v3.2c0 .9.4 1.7 1 2.4.8 1 1.5 2.1 1.5 3.6V19a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-6.8c0-1.5.7-2.6 1.5-3.6.6-.7 1-1.5 1-2.4Z" />;
    case "pouch":
      return <path d="M7 5h10l-1 15H8Z" />;
    case "grain":
      return <path d="M8 6c3-2 5-2 8 0-1 5 0 9-1 13H9c-1-4 0-8-1-13Z" />;
    case "kelp":
      return (
        <path
          d="M6 3c1.5 3.5-1.5 5.5 0 9 1.5 3.5-1.5 5.5 0 9m6-18c1.5 3.5-1.5 5.5 0 9 1.5 3.5-1.5 5.5 0 9m6-18c1.5 3.5-1.5 5.5 0 9 1.5 3.5-1.5 5.5 0 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      );
    case "citrus":
      return (
        <>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 5c1-2 3-3 5-2-1 2-3 3-5 2Z" />
        </>
      );
    case "persimmon":
      return <path d="M12 4c4 4 7 8 7 11.5A7 7 0 0 1 5 15.5C5 12 8 8 12 4Z" />;
    case "bread":
      return <path d="M4 13c0-4 3.5-7 8-7s8 3 8 7-3.5 6-8 6-8-2-8-6Z" />;
    case "tea":
      return (
        <path d="M12 20V9M12 9C9 8 6 9 4 6c3-1 7-1 8 3ZM12 9c3-1 6 0 8-3-3-1-7-1-8 3Z" />
      );
    case "mealkit":
      return <path d="M4 8h16l-1.5 11a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2Z" />;
    case "honey":
      return <path d="M12 3 20 8v8l-8 5-8-5V8Z" />;
    case "greens":
      return (
        <path d="M12 21V11M12 11C8 10 5 11 3 7c4-1 8 0 9 4ZM12 11c4-1 7 0 9-4-4-1-8 0-9 4Z" />
      );
    case "garlic":
      return <path d="M12 3c2 2 3 4 3 6.5A3 3 0 0 1 9 9.5C9 7 10 5 12 3Zm0 8v10" />;
  }
}

/** 지역 이름 옆에 곁들이는 작은 나무 장식 — 빈 공간을 채우는 용도 */
function TreeDot({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.55">
      <line x1={x} y1={y + 3} x2={x} y2={y + 9} stroke="#3F7A3C" strokeWidth="1.4" />
      <circle cx={x} cy={y} r="4" fill="#5B9457" />
    </g>
  );
}

function Boat({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.9">
      <path d="M-11 6 L11 6 L7 12 L-7 12 Z" fill="#F0653E" />
      <path d="M-1 6 V-14 L11 6 Z" fill="#FCFCF9" stroke="#1B5E3F" strokeWidth="0.6" />
      <path d="M-1 6 V-10 L-9 6 Z" fill="#F0A44E" />
      <line x1="-1" y1="-14" x2="-1" y2="6" stroke="#1B5E3F" strokeWidth="1" />
    </g>
  );
}

function Wave({ y, opacity = 0.35 }: { y: number; opacity?: number }) {
  return (
    <path
      d={`M -10 ${y} Q 15 ${y - 6} 40 ${y} T 90 ${y} T 140 ${y} T 190 ${y} T 240 ${y} T 290 ${y} T 340 ${y}`}
      fill="none"
      stroke="#FCFCF9"
      strokeWidth="2"
      opacity={opacity}
      strokeLinecap="round"
    />
  );
}

/**
 * 한반도(남한) 일러스트 지도 — 지역별 보기의 시각적 진입점.
 *
 * 실측 지도가 아니라 브랜드 톤에 맞춘 장식적 일러스트다. 각 핀은 그 지역의
 * 대표 상품 아이콘으로 그려지고, 실제 `/regions/[region]` 페이지(그 지역의
 * 상품 목록)로 바로 연결된다 — 생산자 프로필로 보내지 않는다. 지도는 어디까지나
 * "이 지역 상품을 보러 가는" 흐름의 시작점이다.
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
    <div className="relative mx-auto w-full max-w-md select-none">
      <svg
        viewBox="0 0 300 460"
        role="img"
        aria-label="지역별 상품 지도"
        className="w-full overflow-visible rounded-2xl"
      >
        <defs>
          <linearGradient id="lp-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8FC3D6" />
            <stop offset="100%" stopColor="#5FA6C0" />
          </linearGradient>
          <clipPath id="lp-ocean-clip">
            <rect x="0" y="0" width="300" height="460" rx="20" />
          </clipPath>
        </defs>

        <g clipPath="url(#lp-ocean-clip)">
          <rect width="300" height="460" fill="url(#lp-ocean)" />
          <Wave y={30} />
          <Wave y={70} opacity={0.22} />
          <Wave y={410} opacity={0.28} />
          <Wave y={440} opacity={0.2} />
          <Boat x={258} y={38} scale={0.8} />
          <Boat x={30} y={340} scale={0.7} />

          {/* 랜드마스 — 두꺼운 테두리로 감싸 종이 위 스티커처럼 보이게 한다 */}
          <path
            d={KOREA_PATH}
            fill="#FCFCF9"
            stroke="#1B5E3F"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <path
            d={JEJU_PATH}
            fill="#FCFCF9"
            stroke="#1B5E3F"
            strokeWidth="7"
            strokeLinejoin="round"
          />

          {[
            [110, 42], [214, 74], [70, 150], [200, 170], [130, 200],
            [90, 275], [190, 300], [150, 335],
          ].map(([x, y], i) => (
            <TreeDot key={i} x={x} y={y} />
          ))}

          {regions.map((region) => {
            const pin = REGION_PINS[region.id];
            if (!pin) return null;
            const isActive = region.id === activeRegionId;
            const kind = representativeKind(region.id);
            const palette = kind ? PALETTES[kind] : null;
            const side = pin.labelSide ?? "right";
            const labelX = pin.x + (side === "right" ? 15 : -15);

            return (
              <Link
                key={region.id}
                href={`/regions/${region.id}`}
                aria-label={`${region.province} ${region.name} 상품 보기 (${
                  productCounts[region.id] ?? 0
                }개)`}
                className="group cursor-pointer outline-none"
              >
                {/* 실제 클릭 판정 영역 — 시각적 크기보다 넓게 잡아 터치하기 쉽게 한다 */}
                <circle cx={pin.x} cy={pin.y} r={20} className="fill-transparent" />

                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={isActive ? 15 : 12.5}
                  fill={palette?.body ?? "#1B5E3F"}
                  stroke="#FCFCF9"
                  strokeWidth={isActive ? 3 : 2}
                  className="transition-all group-hover:opacity-90"
                />
                <g
                  transform={`translate(${pin.x - 8} ${pin.y - 8}) scale(${
                    isActive ? 0.72 : 0.6
                  })`}
                  fill="#FCFCF9"
                  className="pointer-events-none"
                >
                  {kind && <PinIcon kind={kind} />}
                </g>

                <text
                  x={labelX}
                  y={pin.y + 4}
                  textAnchor={side === "right" ? "start" : "end"}
                  className={
                    isActive
                      ? "fill-lp-orange text-[11px] font-bold"
                      : "fill-lp-ink text-[10px] font-bold transition-colors group-hover:fill-lp-orange group-focus-visible:fill-lp-orange"
                  }
                  style={{ paintOrder: "stroke", stroke: "#FCFCF9", strokeWidth: 3 }}
                >
                  {region.name}
                </text>
              </Link>
            );
          })}

          {/* 브랜드 배지 — 참고 지도의 하트 배지 자리를 리본으로 옮겨 담았다 */}
          <g transform="translate(226 400) rotate(-6)">
            <rect x="-46" y="-16" width="92" height="32" rx="16" fill="#F08019" stroke="#FCFCF9" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" className="fill-white text-[12px] font-bold">
              LOCAL PICK
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
