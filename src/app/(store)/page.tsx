import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { RegionChips } from "@/components/store/RegionChips";
import { products, regions, searchProducts } from "@/lib/products";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const results = query ? searchProducts(query) : products;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      {/*
        히어로 문구는 의도적으로 서술적으로 둔다. 어떤 가치 제안(신뢰 / 발견 /
        지역 연결)이 통하는지는 2차 실험에서 메시지를 나눠 검증할 대상이므로,
        1차 실험 단계에서 특정 가치 제안을 단정하지 않는다.
      */}
      <section className="overflow-hidden rounded-xl bg-lp-green px-6 py-10 text-white sm:px-10 sm:py-14">
        <h1 className="text-2xl font-bold leading-snug sm:text-3xl">
          지역에서 만든 것들
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
          전국 각지의 생산자가 직접 기르고 만든 상품입니다. 누가 어디서 어떻게
          만들었는지 상품마다 확인할 수 있습니다.
        </p>
        <p className="mt-6 text-sm text-white/70">
          {regions.length}개 지역 · 상품 {products.length}개
        </p>
      </section>

      <RegionChips />

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-bold text-lp-ink">
            {query ? (
              <>
                &lsquo;{query}&rsquo; 검색 결과{" "}
                <span className="text-lp-gray-500">{results.length}개</span>
              </>
            ) : (
              "전체 상품"
            )}
          </h2>
          {query && (
            <Link
              href="/"
              className="shrink-0 text-sm text-lp-gray-700 underline underline-offset-4 hover:text-lp-green"
            >
              검색 초기화
            </Link>
          )}
        </div>

        {results.length === 0 ? (
          <p className="mt-10 text-center text-sm text-lp-gray-500">
            검색 결과가 없습니다. 다른 지역이나 상품명으로 찾아보세요.
          </p>
        ) : (
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {results.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
