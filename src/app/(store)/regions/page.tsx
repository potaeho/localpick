import Link from "next/link";
import type { Metadata } from "next";
import { FilterNav } from "@/components/store/FilterNav";
import { HeroBanner } from "@/components/store/HeroBanner";
import { ProductCard } from "@/components/store/ProductCard";
import { HERO_SLIDES } from "@/lib/hero-slides";
import { getProductsByRegion, regions } from "@/lib/products";

export const metadata: Metadata = {
  title: "지역별 보기 - LOCAL PICK",
  description: "LOCAL PICK이 상품을 가져오는 지역들을 소개합니다.",
};

export default function RegionsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <HeroBanner slides={HERO_SLIDES} />

      <FilterNav />

      {regions.map((region) => {
        const items = getProductsByRegion(region.id);
        if (items.length === 0) return null;

        return (
          <section key={region.id} className="mt-12">
            <div className="flex items-baseline justify-between gap-lp-lg">
              <div className="min-w-0">
                <h2 className="text-lp-heading text-lp-ink">
                  {region.name}
                </h2>
                <p className="mt-1 text-sm text-lp-gray-500">
                  {region.province}
                </p>
              </div>
              <Link
                href={`/regions/${region.id}`}
                className="shrink-0 text-sm text-lp-gray-700 underline underline-offset-4 hover:text-lp-green"
              >
                전체보기
              </Link>
            </div>

            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {items.map((product) => (
                <li key={product.slug}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
