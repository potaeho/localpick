import Image from "next/image";

import type { ProductImageKind } from "@/lib/types";

/**
 * 상품 이미지를 대신하는 벡터 일러스트.
 *
 * 실물 사진이 아직 없으므로 사진처럼 보이는 이미지를 쓰지 않는다. 대신 상품의
 * 형태(병·항아리·파우치·빵·찻잎…)를 브랜드 컬러로 그린다. 사진인 척하지 않으면서
 * 카드에서 무엇을 파는지 한눈에 구분되게 하는 것이 목적이다.
 *
 * 실제 사진을 확보하면 이 컴포넌트만 <Image>로 교체하면 된다.
 */

type Palette = {
  bg: string;
  body: string;
  bodyDark: string;
  accent: string;
  line: string;
};

const PALETTES: Record<ProductImageKind, Palette> = {
  jar: { bg: "#F6EFE4", body: "#C4562F", bodyDark: "#A3421F", accent: "#F0A44E", line: "#1B5E3F" },
  bottle: { bg: "#F0E9F0", body: "#7B3F63", bodyDark: "#5E2C4B", accent: "#C78BB0", line: "#1B5E3F" },
  pouch: { bg: "#EDF0E4", body: "#5B7A52", bodyDark: "#44603C", accent: "#A8C08F", line: "#1B5E3F" },
  grain: { bg: "#F2EFE6", body: "#4A3F63", bodyDark: "#33294A", accent: "#C7B58F", line: "#1B5E3F" },
  kelp: { bg: "#E4EEEC", body: "#2E5D50", bodyDark: "#1E463B", accent: "#7FAEA0", line: "#1B5E3F" },
  citrus: { bg: "#FEF1E0", body: "#F08019", bodyDark: "#D3660A", accent: "#FFC77D", line: "#1B5E3F" },
  persimmon: { bg: "#FBEDE1", body: "#D9701F", bodyDark: "#B4560F", accent: "#F3B074", line: "#1B5E3F" },
  bread: { bg: "#F7F0E2", body: "#C8964F", bodyDark: "#A5762F", accent: "#E8C68A", line: "#1B5E3F" },
  tea: { bg: "#E9F1E5", body: "#3F7A3C", bodyDark: "#2C5C2A", accent: "#8FBE7E", line: "#1B5E3F" },
  mealkit: { bg: "#FBEAE4", body: "#C0392B", bodyDark: "#95271C", accent: "#EE9179", line: "#1B5E3F" },
  honey: { bg: "#FDF2D9", body: "#E0A21C", bodyDark: "#B87F0C", accent: "#F7CF74", line: "#1B5E3F" },
  greens: { bg: "#EBF0E3", body: "#4E7A3A", bodyDark: "#3A5C29", accent: "#9BBF7C", line: "#1B5E3F" },
  garlic: { bg: "#EFEBE6", body: "#4A4340", bodyDark: "#302B29", accent: "#B9A99C", line: "#1B5E3F" },
};

function Art({ kind, p }: { kind: ProductImageKind; p: Palette }) {
  switch (kind) {
    case "jar": // 항아리 (고추장·잼·오일절임)
      return (
        <g>
          <ellipse cx="60" cy="94" rx="30" ry="4" fill={p.bodyDark} opacity="0.15" />
          <path d="M38 46 Q30 62 32 78 Q34 94 60 94 Q86 94 88 78 Q90 62 82 46 Z" fill={p.body} />
          <path d="M60 46 Q86 46 82 46 Q90 62 88 78 Q86 94 60 94 Z" fill={p.bodyDark} opacity="0.25" />
          <rect x="34" y="40" width="52" height="8" rx="4" fill={p.bodyDark} />
          <rect x="42" y="60" width="36" height="20" rx="3" fill={p.bg} opacity="0.85" />
          <path d="M48 70 h24" stroke={p.line} strokeWidth="2" strokeLinecap="round" />
          <path d="M48 76 h14" stroke={p.line} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </g>
      );

    case "bottle": // 유리병 (식초)
      return (
        <g>
          <ellipse cx="60" cy="96" rx="22" ry="4" fill={p.bodyDark} opacity="0.15" />
          <rect x="54" y="24" width="12" height="16" rx="2" fill={p.bodyDark} />
          <path d="M54 40 Q54 50 46 58 Q42 64 42 74 L42 90 Q42 96 48 96 L72 96 Q78 96 78 90 L78 74 Q78 64 74 58 Q66 50 66 40 Z" fill={p.body} />
          <path d="M60 40 L66 40 Q66 50 74 58 Q78 64 78 74 L78 90 Q78 96 72 96 L60 96 Z" fill={p.bodyDark} opacity="0.25" />
          <rect x="46" y="66" width="28" height="20" rx="2" fill={p.bg} opacity="0.9" />
          <path d="M52 74 h16" stroke={p.line} strokeWidth="2" strokeLinecap="round" />
          <path d="M52 80 h10" stroke={p.line} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <rect x="52" y="20" width="16" height="6" rx="2" fill={p.accent} />
        </g>
      );

    case "pouch":
      return (
        <g>
          <ellipse cx="60" cy="94" rx="26" ry="4" fill={p.bodyDark} opacity="0.15" />
          <path d="M38 34 L82 34 L78 94 L42 94 Z" fill={p.body} />
          <path d="M60 34 L82 34 L78 94 L60 94 Z" fill={p.bodyDark} opacity="0.22" />
          <path d="M38 34 L82 34 L80 42 L40 42 Z" fill={p.bodyDark} />
          <rect x="48" y="56" width="24" height="22" rx="3" fill={p.bg} opacity="0.9" />
          <circle cx="60" cy="64" r="4" fill={p.accent} />
          <path d="M52 72 h16" stroke={p.line} strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case "grain": // 쌀자루
      return (
        <g>
          <ellipse cx="60" cy="94" rx="30" ry="4" fill={p.bodyDark} opacity="0.15" />
          <path d="M40 42 Q36 68 40 94 L80 94 Q84 68 80 42 Z" fill={p.body} />
          <path d="M60 42 L80 42 Q84 68 80 94 L60 94 Z" fill={p.bodyDark} opacity="0.22" />
          <path d="M40 42 Q50 32 60 38 Q70 32 80 42 Z" fill={p.bodyDark} />
          <rect x="48" y="58" width="24" height="24" rx="3" fill={p.bg} opacity="0.9" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <ellipse
                key={`${row}-${col}`}
                cx={54 + col * 6}
                cy={64 + row * 7}
                rx="2.2"
                ry="3.4"
                fill={p.body}
                transform={`rotate(-20 ${54 + col * 6} ${64 + row * 7})`}
              />
            )),
          )}
        </g>
      );

    case "kelp": // 다시마·미역
      return (
        <g>
          <path d="M44 20 Q34 44 44 62 Q54 80 46 100" stroke={p.body} strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M62 16 Q74 42 62 64 Q52 84 62 102" stroke={p.bodyDark} strokeWidth="13" strokeLinecap="round" fill="none" />
          <path d="M80 24 Q90 48 80 68 Q72 84 78 98" stroke={p.accent} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M44 34 Q52 38 44 44" stroke={p.bg} strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M62 40 Q54 46 62 54" stroke={p.bg} strokeWidth="2" fill="none" opacity="0.5" />
        </g>
      );

    case "citrus": // 감귤
      return (
        <g>
          <circle cx="52" cy="62" r="26" fill={p.body} />
          <circle cx="52" cy="62" r="26" fill={p.bodyDark} opacity="0.18" clipPath="url(#half)" />
          <circle cx="78" cy="78" r="16" fill={p.accent} />
          <path d="M78 78 m-11 0 a11 11 0 0 1 22 0 z" fill={p.bg} opacity="0.55" />
          {[0, 45, 90, 135].map((deg) => (
            <path
              key={deg}
              d="M78 68 L78 88"
              stroke={p.bg}
              strokeWidth="1.5"
              opacity="0.7"
              transform={`rotate(${deg} 78 78)`}
            />
          ))}
          <path d="M52 36 Q56 28 64 28 Q58 34 56 38 Z" fill={p.line} />
          <circle cx="44" cy="54" r="5" fill={p.bg} opacity="0.35" />
        </g>
      );

    case "persimmon": // 곶감
      return (
        <g>
          <ellipse cx="60" cy="96" rx="26" ry="4" fill={p.bodyDark} opacity="0.15" />
          <ellipse cx="46" cy="64" rx="17" ry="21" fill={p.body} />
          <ellipse cx="74" cy="72" rx="15" ry="19" fill={p.bodyDark} />
          <ellipse cx="46" cy="64" rx="9" ry="12" fill={p.accent} opacity="0.45" />
          <path d="M38 44 h16 M46 40 v8" stroke={p.line} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M67 54 h14 M74 50 v8" stroke={p.line} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        </g>
      );

    case "bread": // 찰보리빵
      return (
        <g>
          <ellipse cx="60" cy="94" rx="30" ry="4" fill={p.bodyDark} opacity="0.15" />
          <ellipse cx="48" cy="62" rx="22" ry="18" fill={p.body} />
          <ellipse cx="74" cy="74" rx="19" ry="16" fill={p.bodyDark} />
          <ellipse cx="48" cy="58" rx="14" ry="9" fill={p.accent} opacity="0.55" />
          <path d="M40 62 q8 5 16 0" stroke={p.bodyDark} strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="70" cy="72" r="6" fill={p.line} opacity="0.35" />
        </g>
      );

    case "tea": // 찻잎
      return (
        <g>
          <path d="M60 96 Q60 70 60 44" stroke={p.bodyDark} strokeWidth="3" strokeLinecap="round" />
          <path d="M60 66 Q40 62 32 44 Q52 40 60 66 Z" fill={p.body} />
          <path d="M60 54 Q80 50 88 32 Q68 28 60 54 Z" fill={p.bodyDark} />
          <path d="M60 80 Q42 78 34 62 Q54 58 60 80 Z" fill={p.accent} />
          <path d="M42 50 Q52 56 58 64" stroke={p.bg} strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M78 38 Q68 44 62 52" stroke={p.bg} strokeWidth="1.5" fill="none" opacity="0.5" />
        </g>
      );

    case "mealkit": // 밀키트 트레이
      return (
        <g>
          <ellipse cx="60" cy="94" rx="32" ry="4" fill={p.bodyDark} opacity="0.15" />
          <rect x="26" y="44" width="68" height="46" rx="6" fill={p.body} />
          <rect x="26" y="44" width="68" height="12" rx="6" fill={p.bodyDark} />
          <rect x="34" y="62" width="24" height="20" rx="3" fill={p.bg} opacity="0.9" />
          <rect x="62" y="62" width="24" height="20" rx="3" fill={p.bg} opacity="0.9" />
          <circle cx="42" cy="70" r="4" fill={p.accent} />
          <circle cx="50" cy="75" r="3.5" fill={p.bodyDark} />
          <path d="M68 68 q6 4 12 0 M68 76 q6 4 12 0" stroke={p.body} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );

    case "honey": // 꿀단지
      return (
        <g>
          <ellipse cx="60" cy="94" rx="26" ry="4" fill={p.bodyDark} opacity="0.15" />
          <path d="M42 48 Q38 70 42 94 L78 94 Q82 70 78 48 Z" fill={p.body} />
          <path d="M60 48 L78 48 Q82 70 78 94 L60 94 Z" fill={p.bodyDark} opacity="0.22" />
          <rect x="38" y="40" width="44" height="9" rx="4" fill={p.bodyDark} />
          <rect x="46" y="62" width="28" height="22" rx="3" fill={p.bg} opacity="0.9" />
          {[[60, 68], [53, 74], [67, 74], [60, 80]].map(([cx, cy]) => (
            <path
              key={`${cx}-${cy}`}
              d={`M${cx} ${cy - 4} l3.5 2 v4 l-3.5 2 l-3.5 -2 v-4 z`}
              fill={p.body}
              opacity="0.75"
            />
          ))}
        </g>
      );

    case "greens": // 나물 다발
      return (
        <g>
          <path d="M60 96 Q58 76 56 56" stroke={p.bodyDark} strokeWidth="3" strokeLinecap="round" />
          <path d="M56 60 Q36 54 30 34 Q52 34 56 60 Z" fill={p.body} />
          <path d="M58 48 Q78 42 84 24 Q62 24 58 48 Z" fill={p.bodyDark} />
          <path d="M58 74 Q40 70 34 54 Q54 52 58 74 Z" fill={p.accent} />
          <rect x="46" y="84" width="28" height="7" rx="3.5" fill={p.line} opacity="0.8" />
        </g>
      );

    case "garlic": // 흑마늘 진액 포
      return (
        <g>
          <ellipse cx="60" cy="94" rx="28" ry="4" fill={p.bodyDark} opacity="0.15" />
          <rect x="36" y="34" width="48" height="58" rx="4" fill={p.body} />
          <rect x="36" y="34" width="48" height="9" rx="4" fill={p.bodyDark} />
          <path d="M60 34 L84 34 L84 92 L60 92 Z" fill={p.bodyDark} opacity="0.2" />
          <circle cx="60" cy="60" r="13" fill={p.bg} opacity="0.9" />
          <path
            d="M60 50 q7 6 7 12 a7 7 0 0 1 -14 0 q0 -6 7 -12 z"
            fill={p.body}
          />
          <path d="M48 80 h24" stroke={p.accent} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
  }
}

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function ProductImage({
  slug,
  kind,
  label,
  imageSrc,
  sizes = "(max-width: 768px) 50vw, 25vw",
  loading,
  className = "",
}: {
  slug: string;
  kind: ProductImageKind;
  /** 스크린리더용 설명 — 보통 상품명 */
  label: string;
  /** 실제 상품 사진. 없으면 기존 일러스트를 사용한다. */
  imageSrc?: string;
  sizes?: string;
  loading?: "eager" | "lazy";
  className?: string;
}) {
  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt={`${label} 대표 사진`}
        width={960}
        height={960}
        sizes={sizes}
        loading={loading}
        className={`object-cover ${className}`}
      />
    );
  }

  const palette = PALETTES[kind];

  /*
   * 같은 종류를 쓰는 상품(다시마와 미역, 고추장과 잼처럼)이 격자 안에서 똑같은
   * 그림으로 보이면 서로 다른 상품이라는 게 읽히지 않는다. slug로 기울기와
   * 좌우 반전을 조금씩 흔들어 구분되게 한다.
   */
  const h = hash(slug);
  const tilt = ((h >> 2) % 5) - 2;
  const flip = h % 2 === 1;
  const transform = [
    `rotate(${tilt} 60 60)`,
    flip ? "translate(120 0) scale(-1 1)" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={`${label} 일러스트`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="120" height="120" fill={palette.bg} />
      {/* 바닥 선 — 상품이 놓인 자리 */}
      <path d="M0 98 H120" stroke={palette.line} strokeWidth="1" opacity="0.12" />
      <g transform={transform}>
        <Art kind={kind} p={palette} />
      </g>
    </svg>
  );
}
