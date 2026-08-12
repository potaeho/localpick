import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { CategoryChips } from "@/components/store/CategoryChips";
import { HeroBanner, type HeroSlide } from "@/components/store/HeroBanner";
import {
  categories,
  getProductsByCategory,
  products,
  regions,
  searchProducts,
} from "@/lib/products";

/*
 * 배너는 여러 메시지를 번갈아 보여준다. 어떤 가치 제안(명절 선물 / 지역
 * 환원 / 신뢰 / 제철 / 방문 / 발견)이 통하는지는 2차 실험에서 나눠 검증할
 * 대상이므로, 1차 실험 단계에서는 하나로 단정하지 않고 로테이션으로 함께
 * 노출한다.
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    id: "chuseok",
    theme: "orange",
    eyebrow: "추석 선물 미리 준비하기",
    title: "올 추석, 뜻깊은 선물을 미리 예약하세요",
    subtitle:
      "받는 분의 고향을 떠올리게 하는 로컬 상품으로 명절 인사를 전해보세요.",
    cta: { label: "추석 선물 둘러보기", href: "/categories/cheong" },
    image: { src: "/hero/chuseok.jpg", alt: "홍천 아까시 벌꿀을 담은 유리병" },
  },
  {
    id: "trust",
    theme: "soil",
    eyebrow: "생산자 이야기",
    title: "이 상품, 누가 만들었는지 압니다",
    subtitle:
      "레시피가 아니라 사람을 소개합니다. 상품마다 생산자의 이름과 이야기를 확인할 수 있습니다.",
    cta: { label: "정재훈님 이야기 보기", href: "/creators/gokseong-rice" },
    image: { src: "/hero/trust.jpg", alt: "나무 그릇에 담긴 곡성 유기농 흑미" },
  },
  {
    id: "give-back",
    theme: "green",
    eyebrow: "LOCAL PICK의 약속",
    title: "구매 금액의 일부, 그 지역으로 돌아갑니다",
    subtitle:
      "여기서 산 만큼, 만든 이의 마을에 힘이 됩니다. 소비가 곧 지역을 응원하는 방법입니다.",
    cta: { label: "산지 이야기 보러가기", href: "/regions" },
    image: { src: "/hero/give-back.jpg", alt: "섬진강을 따라 펼쳐진 곡성의 논과 산" },
  },
  {
    id: "seasonal",
    theme: "gold",
    eyebrow: "지금 제철",
    title: "지금 아니면 못 만나는 산지 소식",
    subtitle:
      "통영 굴은 11월부터 3월까지만 거둡니다. 제철에만 나는 맛을 놓치지 마세요.",
    cta: { label: "통영 굴 보러가기", href: "/products/tongyeong-oyster-oil" },
    image: { src: "/hero/seasonal.jpg", alt: "통영 굴을 올린 오일 파스타" },
  },
  {
    id: "visit",
    theme: "green",
    eyebrow: "가보고 싶은 지역",
    title: "먹어보고, 다녀오세요",
    subtitle: "감귤 따기 체험부터 올레길까지 — 서귀포에서 만날 수 있는 것들.",
    cta: { label: "서귀포 소개 보기", href: "/regions/jeju" },
    image: { src: "/hero/visit.jpg", alt: "반으로 자른 제주 노지감귤" },
  },
  {
    id: "newcomer",
    theme: "slate",
    eyebrow: "처음이신가요",
    title: "첫 로컬픽, 이렇게 시작하세요",
    subtitle: "카테고리별로 나뉜 상품을 훑어보고, 관심 가는 지역부터 골라보세요.",
    cta: { label: "카테고리 전체 보기", href: "/categories" },
    image: { src: "/hero/newcomer.jpg", alt: "속을 반으로 가른 경주 찰보리빵" },
  },
  {
    id: "intro",
    theme: "ink",
    eyebrow: "LOCAL PICK",
    title: "지역에서 만든 것들",
    subtitle:
      "전국 각지의 생산자가 직접 기르고 만든 상품입니다. 누가 어디서 어떻게 만들었는지 상품마다 확인할 수 있습니다.",
    note: `${categories.length}개 카테고리 · ${regions.length}개 지역 · 상품 ${products.length}개`,
    cta: { label: "카테고리 둘러보기", href: "/categories" },
    image: { src: "/hero/intro.jpg", alt: "대바구니에 담긴 완도 다시마" },
  },
];

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const results = query ? searchProducts(query) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <HeroBanner slides={HERO_SLIDES} />

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
