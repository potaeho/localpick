"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "홈" },
  { href: "/categories", label: "카테고리" },
  { href: "/regions", label: "지역" },
  { href: "/creators", label: "생산자" },
] as const;

/**
 * 모바일 하단 탭바.
 *
 * 상품 상세에서는 하단 고정 구매 바가 같은 자리를 차지하므로 숨긴다.
 * 구매 버튼이 이 실험의 핵심 측정 지점이라, 자리 경쟁이 생기면 구매 바가 이긴다.
 */
export function MobileTabBar() {
  const pathname = usePathname();

  if (pathname.startsWith("/products/")) return null;

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-lp-gray-300 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-14 items-center justify-center text-sm font-medium ${
                  active ? "text-lp-green" : "text-lp-gray-500"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
