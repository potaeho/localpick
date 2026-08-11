import Link from "next/link";
import { Logo } from "./Logo";
import { categories } from "@/lib/products";

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

        <form action="/" className="ml-auto w-full max-w-md">
          <div className="relative">
            <label htmlFor="store-search" className="sr-only">
              상품 검색
            </label>
            <input
              id="store-search"
              type="search"
              name="q"
              placeholder="지역이나 상품을 검색해보세요"
              className="h-10 w-full rounded-full border border-lp-gray-300 bg-lp-gray-100 pl-4 pr-11 text-sm placeholder:text-lp-gray-500 focus:border-lp-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-lp-green"
            />
            <button
              type="submit"
              aria-label="검색"
              className="absolute right-1 top-1 flex h-8 w-9 items-center justify-center rounded-full text-lp-gray-700 hover:text-lp-green"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M13.5 13.5 L17 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* 카테고리 네비 — 가로 스크롤로 모바일에서도 전체 접근 가능 */}
      <nav aria-label="카테고리" className="border-t border-lp-gray-100">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 lg:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex items-center gap-1 py-2">
            <li>
              <Link
                href="/"
                className="block whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-lp-gray-700 hover:bg-lp-green-light hover:text-lp-green"
              >
                전체
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.id}`}
                  className="block whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-lp-gray-700 hover:bg-lp-green-light hover:text-lp-green"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
