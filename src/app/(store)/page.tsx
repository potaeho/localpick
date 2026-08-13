import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { FilterNav } from "@/components/store/FilterNav";
import { HeroBanner, type HeroSlide } from "@/components/store/HeroBanner";
import {
  categories,
  getProductsByCategory,
  products,
  regions,
  searchProducts,
} from "@/lib/products";

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "chuseok",
    eyebrow: "추석 선물 세트",
    title: "올 추석,\n정성을 담아 전하세요",
    subtitle: "어르신께 드리기 좋은 건강 먹거리를 미리 준비하세요.",
    cta: { label: "추석 선물 둘러보기", href: "/categories/produce" },
    image: { src: "/hero/chuseok.jpg", alt: "홍천 아까시 벌꿀을 담은 유리병" },
    sideLabel: "추석 선물 세트",
    featuredProducts: [
      { name: "산청 곶감", slug: "sancheong-gotgam", href: "/products/sancheong-gotgam", imageKind: "persimmon" },
      { name: "곶감정과", slug: "sancheong-gotgam-jeonggwa", href: "/products/sancheong-gotgam-jeonggwa", imageKind: "persimmon" },
      { name: "흑마늘 진액", slug: "uiseong-black-garlic", href: "/products/uiseong-black-garlic", imageKind: "garlic" },
      { name: "벌꿀", slug: "hongcheon-acacia-honey", href: "/products/hongcheon-acacia-honey", imageKind: "honey" },
    ],
  },
  {
    id: "summer-meal",
    eyebrow: "여름 보양식",
    title: "무더운 여름,\n기운 나는 한 끼",
    subtitle: "집에서 간편하게 즐기는 보양 한상을 준비했습니다.",
    cta: { label: "보양식 보러가기", href: "/categories/processed" },
    image: { src: "/hero/trust.jpg", alt: "나무 그릇에 담긴 곡성 유기농 흑미" },
    sideLabel: "여름 보양 한상",
    featuredProducts: [
      { name: "닭갈비 밀키트", slug: "chuncheon-dakgalbi-kit", href: "/products/chuncheon-dakgalbi-kit", imageKind: "mealkit" },
      { name: "유기농 흑미", slug: "gokseong-black-rice", href: "/products/gokseong-black-rice", imageKind: "grain" },
      { name: "건조 곤드레", slug: "yeongwol-gondre", href: "/products/yeongwol-gondre", imageKind: "greens" },
    ],
  },
  {
    id: "fermented",
    eyebrow: "전통 발효 기획전",
    title: "시간이 빚어낸\n깊은 맛",
    subtitle: "장인의 손끝에서 천천히 발효된 전통 식품을 만나보세요.",
    cta: { label: "발효 식품 보기", href: "/categories/processed" },
    image: { src: "/hero/give-back.jpg", alt: "섬진강을 따라 펼쳐진 곡성의 논과 산" },
    sideLabel: "전통 발효 기획전",
    featuredProducts: [
      { name: "순창 고추장", slug: "sunchang-gochujang", href: "/products/sunchang-gochujang", imageKind: "jar" },
      { name: "복분자 식초", slug: "gochang-bokbunja-vinegar", href: "/products/gochang-bokbunja-vinegar", imageKind: "bottle" },
      { name: "복분자잼", slug: "gochang-bokbunja-jam", href: "/products/gochang-bokbunja-jam", imageKind: "jar" },
    ],
  },
  {
    id: "sea",
    eyebrow: "산지 직송",
    title: "바다에서 식탁까지,\n산지 직송 해산물",
    subtitle: "완도 앞바다, 영덕 갯바위, 통영 앞바다에서 온 맛.",
    cta: { label: "해산물 보러가기", href: "/categories/seafood" },
    image: { src: "/hero/intro.jpg", alt: "대바구니에 담긴 완도 다시마" },
    sideLabel: "바다의 맛",
    featuredProducts: [
      { name: "완도 다시마", slug: "wando-dasima", href: "/products/wando-dasima", imageKind: "kelp" },
      { name: "영덕 돌미역", slug: "yeongdeok-dolmiyeok", href: "/products/yeongdeok-dolmiyeok", imageKind: "kelp" },
      { name: "통영 굴", slug: "tongyeong-oyster-oil", href: "/products/tongyeong-oyster-oil", imageKind: "jar" },
    ],
  },
  {
    id: "drink",
    eyebrow: "차 · 꿀 · 청",
    title: "하루 한 잔,\n자연이 담긴 여유",
    subtitle: "하동의 녹차, 홍천의 벌꿀, 제주의 감귤청으로 한 잔의 여유를.",
    cta: { label: "음료 보러가기", href: "/categories/cheong" },
    image: { src: "/hero/visit.jpg", alt: "반으로 자른 제주 노지감귤" },
    sideLabel: "차·꿀·청",
    featuredProducts: [
      { name: "하동 녹차", slug: "hadong-woojeon-tea", href: "/products/hadong-woojeon-tea", imageKind: "tea" },
      { name: "아까시 벌꿀", slug: "hongcheon-acacia-honey", href: "/products/hongcheon-acacia-honey", imageKind: "honey" },
      { name: "감귤청", slug: "jeju-citrus-cheong", href: "/products/jeju-citrus-cheong", imageKind: "citrus" },
    ],
  },
  {
    id: "intro",
    eyebrow: "LOCAL PICK",
    title: "지역에서 만든 것들",
    subtitle: "전국 각지의 생산자가 직접 기르고 만든 상품입니다.",
    note: `${categories.length}개 카테고리 · ${regions.length}개 지역 · 상품 ${products.length}개`,
    cta: { label: "카테고리 둘러보기", href: "/categories" },
    image: { src: "/hero/newcomer.jpg", alt: "속을 반으로 가른 경주 찰보리빵" },
    sideLabel: "LOCAL PICK 소개",
  },
];

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
