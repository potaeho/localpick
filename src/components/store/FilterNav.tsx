"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories, regions, getProductsByCategory, getProductsByRegion } from "@/lib/products";
import { Badge } from "@/components/ui/badge";

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
    <nav aria-label="필터" className="mt-lp-lg space-y-lp-md">
      {/* 1차: 상품별 / 지역별 토글 */}
      <div className="flex items-center gap-lp-xs">
        <Badge
          asChild
          variant={viewMode === "product" ? "default" : "secondary"}
          className={`min-h-9 rounded-lp-circle px-lp-lg text-lp-label focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2 ${
            viewMode === "product" ? "bg-lp-ink hover:bg-lp-ink" : ""
          }`}
        >
          <Link href="/">상품별</Link>
        </Badge>
        <Badge
          asChild
          variant={viewMode === "region" ? "default" : "secondary"}
          className={`min-h-9 rounded-lp-circle px-lp-lg text-lp-label focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2 ${
            viewMode === "region" ? "bg-lp-ink hover:bg-lp-ink" : ""
          }`}
        >
          <Link href="/regions">지역별</Link>
        </Badge>
      </div>

      {/* 2차: 세부 칩 */}
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        <ul className="flex w-max gap-lp-sm pb-lp-xs">
          {viewMode === "product" ? (
            <>
              <li>
                <Badge
                  asChild
                  variant={isHome ? "default" : "outline"}
                  className="min-h-10 rounded-lp-circle px-lp-lg text-lp-label focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
                >
                  <Link href="/" aria-current={isHome ? "page" : undefined}>
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
                      className="min-h-10 gap-lp-xs rounded-lp-circle px-lp-lg text-lp-label focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
                    >
                      <Link
                        href={`/categories/${category.id}`}
                        aria-current={active ? "page" : undefined}
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
            </>
          ) : (
            <>
              <li>
                <Badge
                  asChild
                  variant={pathname === "/regions" ? "default" : "outline"}
                  className="min-h-10 rounded-lp-circle px-lp-lg text-lp-label focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
                >
                  <Link
                    href="/regions"
                    aria-current={pathname === "/regions" ? "page" : undefined}
                  >
                    전체
                  </Link>
                </Badge>
              </li>
              {regions.map((region) => {
                const active = region.id === activeId;
                return (
                  <li key={region.id}>
                    <Badge
                      asChild
                      variant={active ? "default" : "outline"}
                      className="min-h-10 gap-lp-xs rounded-lp-circle px-lp-lg text-lp-label focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
                    >
                      <Link
                        href={`/regions/${region.id}`}
                        aria-current={active ? "page" : undefined}
                      >
                        {region.name}
                        <span className={active ? "text-white/70" : "text-lp-gray-500"}>
                          {getProductsByRegion(region.id).length}
                        </span>
                      </Link>
                    </Badge>
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
