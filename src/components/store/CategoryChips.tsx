import Link from "next/link";

import { categories, getProductsByCategory } from "@/lib/products";

/**
 * 카테고리 칩 — 스토어를 훑는 1차 축.
 *
 * 소비자가 장을 볼 때 먼저 찾는 것은 "무엇을 살까"이지 "어느 지역 것을 살까"가
 * 아니다. 지역은 상품 안에서 드러나고, 지역 페이지는 방문 관심 측정을 위해
 * 따로 남겨둔다.
 */
export function CategoryChips({ activeId }: { activeId?: string }) {
  return (
    <nav aria-label="카테고리" className="mt-6">
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        <ul className="flex w-max gap-2 pb-1">
          <li>
            <Link
              href="/"
              aria-current={activeId ? undefined : "page"}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2 ${
                activeId
                  ? "border-lp-gray-300 bg-white text-lp-gray-700 hover:border-lp-green hover:text-lp-green"
                  : "border-lp-green bg-lp-green text-white"
              }`}
            >
              전체
            </Link>
          </li>
          {categories.map((category) => {
            const active = category.id === activeId;
            return (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.id}`}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2 ${
                    active
                      ? "border-lp-green bg-lp-green text-white"
                      : "border-lp-gray-300 bg-white text-lp-gray-700 hover:border-lp-green hover:text-lp-green"
                  }`}
                >
                  {category.name}
                  <span
                    className={
                      active ? "text-white/70" : "text-lp-gray-500"
                    }
                  >
                    {getProductsByCategory(category.id).length}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
