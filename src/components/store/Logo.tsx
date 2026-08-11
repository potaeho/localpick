/**
 * LOCAL PICK 로고.
 * 아치 테두리 안에 산·해·시골집·밭길을 담은 팀 로고를 SVG로 옮긴 것.
 */
export function LogoMark({ className = "h-8 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 64"
      fill="none"
      className={className}
      role="img"
      aria-label="LOCAL PICK"
    >
      {/* 아치 테두리 */}
      <rect
        x="3"
        y="3"
        width="42"
        height="58"
        rx="21"
        stroke="currentColor"
        strokeWidth="3"
      />
      {/* 해 */}
      <circle cx="34" cy="19" r="3.5" stroke="var(--color-lp-orange)" strokeWidth="2.5" />
      {/* 산등성이 */}
      <path
        d="M9 31 L17 20 L23.5 27.5 L28 22.5 L38 33"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 차양 */}
      <path
        d="M15.5 33.5 L18 29.5 L30 29.5 L32.5 33.5 Z"
        fill="var(--color-lp-orange)"
      />
      {/* 집 */}
      <path
        d="M18 33.5 V44 H30 V33.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M21.5 44 V38 H24" stroke="currentColor" strokeWidth="2" />
      {/* 밭 */}
      <path
        d="M7 47 C13 43 18 43 21 45.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M41 47 C35 43 30 43 27 45.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* 밭길 */}
      <path
        d="M24 45 C21 50 27 52.5 23.5 58"
        stroke="var(--color-lp-orange)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 text-lp-green ${className}`}>
      <LogoMark className="h-9 w-7 shrink-0" />
      <span className="text-xl font-bold tracking-tight">LOCAL PICK</span>
    </span>
  );
}
