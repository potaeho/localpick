import Image from "next/image";

/**
 * LOCAL PICK 로고.
 *
 * 팀이 제공한 실제 로고 원본(public/logo/mark.png — 흰 배경을 투명 처리해
 * 잘라낸 아이콘)을 그대로 쓴다. 문구("LOCAL PICK")는 원본 이미지에 박힌
 * 세로 조합형이 헤더 같은 가로 좁은 공간에 안 맞아, 아이콘만 이미지로 쓰고
 * 옆의 글자는 텍스트로 둔다.
 */
export function LogoMark({ className = "h-8 w-6" }: { className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <Image
        src="/logo/mark.png"
        alt="LOCAL PICK"
        fill
        sizes="48px"
        className="object-contain"
      />
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex items-center gap-2 ${className}`}
      style={{ color: "#1b5e3f" }}
    >
      <LogoMark className="h-9 w-7 shrink-0" />
      <span className="text-xl font-bold tracking-tight">LOCAL PICK</span>
    </span>
  );
}
