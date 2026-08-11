import Link from "next/link";

import { regions } from "@/lib/products";

export function RegionChips() {
  return (
    <section className="mt-5" aria-labelledby="region-chips-heading">
      <h2 id="region-chips-heading" className="sr-only">
        지역별 상품 둘러보기
      </h2>
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        <ul className="flex w-max gap-2 pb-1">
          {regions.map((region) => (
            <li key={region.id}>
              <Link
                href={`/regions/${region.id}`}
                className="inline-flex min-h-11 items-center rounded-full border border-lp-gray-300 bg-white px-4 text-sm font-medium text-lp-gray-700 transition-colors hover:border-lp-green hover:text-lp-green focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
              >
                {region.province} {region.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
