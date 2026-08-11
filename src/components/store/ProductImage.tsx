/**
 * 상품 이미지 자리를 채우는 결정적 SVG 일러스트.
 *
 * 실물 사진이 아직 없으므로 사진처럼 보이는 이미지를 쓰지 않는다. 대신 로고의
 * 산·해·밭 모티프를 브랜드 컬러로 변주한 일러스트를 slug 해시로 결정해 그린다.
 * 같은 상품은 항상 같은 그림이 나오고, 실제 사진을 확보하면 이 컴포넌트만
 * 교체하면 된다.
 */

const PALETTES = [
  { bg: "#E8F2EC", hill: "#1B5E3F", far: "#8FBCA5", sun: "#F08019" },
  { bg: "#FEF1E3", hill: "#D96F0E", far: "#F5C395", sun: "#1B5E3F" },
  { bg: "#F2F0E6", hill: "#5B7A52", far: "#B6C6A8", sun: "#F08019" },
  { bg: "#E6EEF0", hill: "#3D6470", far: "#A3BEC6", sun: "#F08019" },
  { bg: "#F7EDE6", hill: "#A65E3C", far: "#DDBBA4", sun: "#1B5E3F" },
  { bg: "#EDF0E4", hill: "#6B7A2F", far: "#C0CB94", sun: "#F08019" },
] as const;

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
  label,
  className = "",
}: {
  slug: string;
  /** 스크린리더용 설명 — 보통 상품명 */
  label: string;
  className?: string;
}) {
  const h = hash(slug);
  const palette = PALETTES[h % PALETTES.length];

  // 해시로 능선 높이와 해의 위치를 흔들어 상품마다 다른 그림이 되게 한다
  const farPeak = 44 + (h % 5) * 3;
  const nearPeak = 62 + ((h >> 3) % 5) * 3;
  const sunX = 62 + ((h >> 6) % 4) * 8;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={`${label} 이미지 준비 중`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="120" height="120" fill={palette.bg} />
      <circle cx={sunX} cy="30" r="9" fill={palette.sun} opacity="0.9" />
      <path
        d={`M0 ${farPeak + 20} L26 ${farPeak} L48 ${farPeak + 14} L72 ${farPeak - 6} L98 ${farPeak + 12} L120 ${farPeak - 2} L120 120 L0 120 Z`}
        fill={palette.far}
      />
      <path
        d={`M0 ${nearPeak + 16} C24 ${nearPeak - 4}, 44 ${nearPeak + 10}, 66 ${nearPeak} C88 ${nearPeak - 8}, 104 ${nearPeak + 6}, 120 ${nearPeak - 2} L120 120 L0 120 Z`}
        fill={palette.hill}
      />
      {/* 밭이랑 */}
      <g stroke={palette.bg} strokeWidth="1.5" opacity="0.35">
        <path d={`M10 ${nearPeak + 26} C40 ${nearPeak + 16}, 80 ${nearPeak + 22}, 112 ${nearPeak + 14}`} fill="none" />
        <path d={`M4 ${nearPeak + 38} C36 ${nearPeak + 28}, 78 ${nearPeak + 34}, 116 ${nearPeak + 26}`} fill="none" />
      </g>
    </svg>
  );
}
