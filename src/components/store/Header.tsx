import Link from "next/link";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";

/**
 * 스토어 헤더.
 *
 * 마켓컬리의 헤더 구조(로고 → 검색 → 카테고리 네비)를 따르되, 로그인·회원가입·
 * 장바구니는 두지 않는다. 이 실험에는 계정도 장바구니도 존재하지 않으므로
 * 동작하지 않는 진입점을 노출하면 소비자를 오도하게 된다.
 *
 * 검색은 실제로 동작한다 — GET 폼으로 홈의 `q` 파라미터를 채운다. 레이아웃은
 * searchParams를 받지 못하므로 입력값을 미리 채우지는 않고, 대신 홈에서 현재
 * 검색어를 안내한다.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-lp-gray-300 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:h-16 lg:px-6">
        <Link href="/" aria-label="LOCAL PICK 홈">
          <Logo className="shrink-0" />
        </Link>

        <SearchBox />
      </div>
    </header>
  );
}
