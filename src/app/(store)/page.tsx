import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { CategoryChips } from "@/components/store/CategoryChips";
import {
  categories,
  getProductsByCategory,
  getRegion,
  products,
  regions,
  searchProducts,
} from "@/lib/products";

/** 히어로에 실제 산지 사진과 함께 보여줄 지역 — 사진과 문구가 짝을 이루도록 고정한다 */
const HERO_REGION_ID = "gokseong";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const results = query ? searchProducts(query) : [];
  const heroRegion = getRegion(HERO_REGION_ID);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      {/*
        히어로 문구는 의도적으로 서술적으로 둔다. 어떤 가치 제안(신뢰 / 발견 /
        지역 연결)이 통하는지는 2차 실험에서 메시지를 나눠 검증할 대상이므로,
        1차 실험 단계에서 특정 가치 제안을 단정하지 않는다.

        배경 사진은 실제 산지 사진(곡성 섬진강변)이고, 그 아래 캡션도 같은
        지역의 실제 소개 문구(regions 데이터)를 그대로 가져와 사진과 정보가
        짝을 이루게 한다 — 임의의 배경 이미지가 아니라는 뜻이다.
      */}
      <section className="relative isolate overflow-hidden rounded-xl text-white">
        <Image
          src="/hero/gokseong-valley.jpg"
          alt="전라남도 곡성, 섬진강을 따라 펼쳐진 산과 논"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1152px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lp-green/95 via-lp-green/55 to-lp-green/20" />

        <div className="relative px-6 py-12 sm:px-10 sm:py-20 lg:py-24">
          <h1 className="text-2xl font-bold leading-snug sm:text-4xl">
            지역에서 만든 것들
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
            전국 각지의 생산자가 직접 기르고 만든 상품입니다. 누가 어디서 어떻게
            만들었는지 상품마다 확인할 수 있습니다.
          </p>
          <p className="mt-6 text-sm text-white/75">
            {categories.length}개 카테고리 · {regions.length}개 지역 · 상품{" "}
            {products.length}개
          </p>

          {heroRegion && (
            <p className="mt-8 max-w-lg border-t border-white/20 pt-4 text-xs leading-relaxed text-white/70 sm:text-sm">
              사진 속 {heroRegion.province} {heroRegion.name} — {heroRegion.description}
            </p>
          )}
        </div>
      </section>

      <CategoryChips />

      {query ? (
        <section className="mt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-bold text-lp-ink">
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
        /* 카테고리별 섹션 — 소비자가 "무엇을 살까"부터 훑도록 한다 */
        categories.map((category) => {
          const items = getProductsByCategory(category.id);
          if (items.length === 0) return null;

          return (
            <section key={category.id} className="mt-12">
              <div className="flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-lp-ink">
                    {category.name}
                  </h2>
                  <p className="mt-1 text-sm text-lp-gray-500">
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
