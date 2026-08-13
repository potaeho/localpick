"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories, regions, getProductsByCategory, getProductsByRegion } from "@/lib/products";

type ViewMode = "product" | "region";

function resolveViewMode(pathname: string): ViewMode {
  if (pathname.startsWith("/regions")) return "region";
  return "product";
}

function resolveActiveId(pathname: string): string | undefined {
  const categoryMatch = pathname.match(/^\/categories\/(.+)/);
  if (categoryMatch) return categoryMatch[1];
  const regionMatch = pathname.match(/^\/regions\/(.+)/);
  if (regionMatch) return regionMatch[1];
  return undefined;
}

export function FilterNav() {
  const pathname = usePathname();
  const viewMode = resolveViewMode(pathname);
  const activeId = resolveActiveId(pathname);
  const isHome = pathname === "/";

  return (
    <nav aria-label="필터" className="mt-lp-section space-y-lp-md">
      {/* 1차: 상품별 / 지역별 토글 */}
      <div className="flex items-center gap-lp-xs">
        <Link
          href="/"
          className={`inline-flex min-h-9 items-center rounded-lp-circle px-lp-lg text-lp-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2 ${
            viewMode === "product"
              ? "bg-lp-ink text-white"
              : "bg-lp-gray-100 text-lp-gray-700 hover:bg-lp-gray-300"
          }`}
        >
          상품별
        </Link>
        <Link
          href="/regions"
          className={`inline-flex min-h-9 items-center rounded-lp-circle px-lp-lg text-lp-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2 ${
            viewMode === "region"
              ? "bg-lp-ink text-white"
              : "bg-lp-gray-100 text-lp-gray-700 hover:bg-lp-gray-300"
          }`}
        >
          지역별
        </Link>
      </div>

      {/* 2차: 세부 칩 */}
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        <ul className="flex w-max gap-lp-sm pb-lp-xs">
          {viewMode === "product" ? (
            <>
              <li>
                <Link
                  href="/"
                  aria-current={isHome ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-lp-circle border px-lp-lg text-lp-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2 ${
                    isHome
                      ? "border-lp-green bg-lp-green text-white"
                      : "border-lp-gray-300 bg-white text-lp-gray-700 hover:border-lp-green hover:text-lp-green"
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
                      className={`inline-flex min-h-10 items-center gap-lp-xs rounded-lp-circle border px-lp-lg text-lp-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2 ${
                        active
                          ? "border-lp-green bg-lp-green text-white"
                          : "border-lp-gray-300 bg-white text-lp-gray-700 hover:border-lp-green hover:text-lp-green"
                      }`}
                    >
                      {category.name}
                      <span className={active ? "text-white/70" : "text-lp-gray-500"}>
                        {getProductsByCategory(category.id).length}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/regions"
                  aria-current={pathname === "/regions" ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-lp-circle border px-lp-lg text-lp-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2 ${
                    pathname === "/regions"
                      ? "border-lp-green bg-lp-green text-white"
                      : "border-lp-gray-300 bg-white text-lp-gray-700 hover:border-lp-green hover:text-lp-green"
                  }`}
                >
                  전체
                </Link>
              </li>
              {regions.map((region) => {
                const active = region.id === activeId;
                return (
                  <li key={region.id}>
                    <Link
                      href={`/regions/${region.id}`}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex min-h-10 items-center gap-lp-xs rounded-lp-circle border px-lp-lg text-lp-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2 ${
                        active
                          ? "border-lp-green bg-lp-green text-white"
                          : "border-lp-gray-300 bg-white text-lp-gray-700 hover:border-lp-green hover:text-lp-green"
                      }`}
                    >
                      {region.name}
                      <span className={active ? "text-white/70" : "text-lp-gray-500"}>
                        {getProductsByRegion(region.id).length}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
