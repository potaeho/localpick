import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { FilterNav } from "@/components/store/FilterNav";
import { HeroBanner } from "@/components/store/HeroBanner";
import { HERO_SLIDES } from "@/lib/hero-slides";
import { categories, getProductsByCategory, searchProducts } from "@/lib/products";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const results = query ? searchProducts(query) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <HeroBanner slides={HERO_SLIDES} />

      <FilterNav />

      {query ? (
        <section className="mt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lp-heading text-lp-ink">
              &lsquo;{query}&rsquo; 검색 결과{" "}
              <span className="text-lp-gray-500">{results.length}개</span>
            </h2>
            <Link
              href="/"
              className="shrink-0 text-sm text-lp-gray-700 underline underline-offset-4 hover:text-lp-green"
            >
              검색 초기화
            </Link>
          </div>

          {results.length === 0 ? (
            <p className="mt-10 text-center text-sm text-lp-gray-500">
              검색 결과가 없습니다. 다른 상품명이나 지역으로 찾아보세요.
            </p>
          ) : (
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {results.map((product, index) => (
                <li key={product.slug}>
                  <ProductCard product={product} eagerImage={index < 4} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        categories.map((category) => {
          const items = getProductsByCategory(category.id);
          if (items.length === 0) return null;

          return (
            <section key={category.id} className="mt-12">
              <div className="flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lp-heading text-lp-ink">
                    {category.name}
                  </h2>
                  <p className="mt-lp-xs text-sm text-lp-gray-500">
                    {category.description}
                  </p>
                </div>
                <Link
                  href={`/categories/${category.id}`}
                  className="shrink-0 text-sm text-lp-gray-700 underline underline-offset-4 hover:text-lp-green"
                >
                  전체보기
                </Link>
              </div>

              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                {items.map((product, index) => (
                  <li key={product.slug}>
                    <ProductCard
                      product={product}
                      eagerImage={category.id === categories[0]?.id && index < 4}
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
