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

      {/* 보기 모드 — 상품별 / 지역별 */}
      <nav aria-label="보기 모드" className="border-t border-lp-gray-100">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <ul className="flex items-center gap-lp-xs py-lp-sm">
            <li>
              <Link
                href="/"
                className="block whitespace-nowrap rounded-lp-circle px-lp-md py-lp-xs text-lp-label text-lp-gray-700 hover:bg-lp-green-light hover:text-lp-green"
              >
                상품별
              </Link>
            </li>
            <li aria-hidden="true" className="mx-lp-xs h-4 w-px bg-lp-gray-300" />
            <li>
              <Link
                href="/regions"
                className="block whitespace-nowrap rounded-lp-circle px-lp-md py-lp-xs text-lp-label text-lp-gray-700 hover:bg-lp-green-light hover:text-lp-green"
              >
                지역별
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
