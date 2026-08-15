"use client";

import Link from "next/link";

import { categories, getProductsByCategory } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { trackClick } from "@/lib/events";

/**
 * 카테고리 칩 — 스토어를 훑는 1차 축.
 *
 * 소비자가 장을 볼 때 먼저 찾는 것은 "무엇을 살까"이지 "어느 지역 것을 살까"가
 * 아니다. 지역은 상품 안에서 드러나고, 지역 페이지는 방문 관심 측정을 위해
 * 따로 남겨둔다.
 */
export function CategoryChips({ activeId }: { activeId?: string }) {
  return (
    <nav aria-label="카테고리" className="mt-lp-xxl">
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        <ul className="flex w-max gap-lp-sm pb-lp-xs">
          <li>
            <Badge
              asChild
              variant={activeId ? "outline" : "default"}
              className="min-h-11 rounded-lp-circle px-lp-lg text-lp-label focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
            >
              <Link
                href="/"
                aria-current={activeId ? undefined : "page"}
                onClick={() => trackClick("category_chip_all")}
              >
                전체
              </Link>
            </Badge>
          </li>
          {categories.map((category) => {
            const active = category.id === activeId;
            return (
              <li key={category.id}>
                <Badge
                  asChild
                  variant={active ? "default" : "outline"}
                  className="min-h-11 gap-lp-xs rounded-lp-circle px-lp-lg text-lp-label focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
                >
                  <Link
                    href={`/categories/${category.id}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => trackClick(`category_chip:${category.id}`)}
                  >
                    {category.name}
                    <span className={active ? "text-white/70" : "text-lp-gray-500"}>
                      {getProductsByCategory(category.id).length}
                    </span>
                  </Link>
                </Badge>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
