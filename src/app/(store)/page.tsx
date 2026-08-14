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
    image: { src: "/hero/chuseok.png", alt: "대나무 트레이에 담긴 곶감, 흑마늘 진액, 벌꿀 추석 선물 세트" },
    sideLabel: "추석 선물 세트",
    featuredProducts: [
      { name: "산청 곶감", href: "/products/sancheong-gotgam", cardImage: "/product-cards/sancheong-gotgam.jpg" },
      { name: "곶감정과", href: "/products/sancheong-gotgam-jeonggwa", cardImage: "/product-cards/sancheong-gotgam-jeonggwa.jpg" },
      { name: "흑마늘 진액", href: "/products/uiseong-black-garlic", cardImage: "/product-cards/uiseong-black-garlic.jpg" },
      { name: "벌꿀", href: "/products/hongcheon-acacia-honey", cardImage: "/product-cards/hongcheon-acacia-honey.jpg" },
    ],
  },
  {
    id: "summer-meal",
    eyebrow: "여름 보양식",
    title: "무더운 여름,\n기운 나는 한 끼",
    subtitle: "집에서 간편하게 즐기는 보양 한상을 준비했습니다.",
    cta: { label: "보양식 보러가기", href: "/categories/processed" },
    image: { src: "/hero/summer-meal.png", alt: "치즈 닭갈비와 흑미, 곤드레나물 보양 한상" },
    sideLabel: "여름 보양 한상",
    featuredProducts: [
      { name: "닭갈비 밀키트", href: "/products/chuncheon-dakgalbi-kit", cardImage: "/product-cards/chuncheon-dakgalbi-kit.jpg" },
      { name: "유기농 흑미", href: "/products/gokseong-black-rice", cardImage: "/product-cards/gokseong-black-rice.jpg" },
      { name: "건조 곤드레", href: "/products/yeongwol-gondre", cardImage: "/product-cards/yeongwol-gondre.jpg" },
    ],
  },
  {
    id: "fermented",
    eyebrow: "전통 발효 기획전",
    title: "시간이 빚어낸\n깊은 맛",
    subtitle: "장인의 손끝에서 천천히 발효된 전통 식품을 만나보세요.",
    cta: { label: "발효 식품 보기", href: "/categories/processed" },
    image: { src: "/hero/fermented.png", alt: "순창 고추장 항아리와 복분자 식초, 복분자잼", position: "70% center" },
    sideLabel: "전통 발효 기획전",
    featuredProducts: [
      { name: "순창 고추장", href: "/products/sunchang-gochujang", cardImage: "/product-cards/sunchang-gochujang.jpg" },
      { name: "복분자 식초", href: "/products/gochang-bokbunja-vinegar", cardImage: "/product-cards/gochang-bokbunja-vinegar.jpg" },
      { name: "복분자잼", href: "/products/gochang-bokbunja-jam", cardImage: "/product-cards/gochang-bokbunja-jam.jpg" },
    ],
  },
  {
    id: "sea",
    eyebrow: "산지 직송",
    title: "바다에서 식탁까지,\n산지 직송 해산물",
    subtitle: "완도 앞바다, 영덕 갯바위, 통영 앞바다에서 온 맛.",
    cta: { label: "해산물 보러가기", href: "/categories/seafood" },
    image: { src: "/hero/sea.png", alt: "얼음 위 완도 다시마, 돌미역, 통영 굴 해산물" },
    sideLabel: "바다의 맛",
    featuredProducts: [
      { name: "완도 다시마", href: "/products/wando-dasima", cardImage: "/product-cards/wando-dasima.jpg" },
      { name: "영덕 돌미역", href: "/products/yeongdeok-dolmiyeok", cardImage: "/product-cards/yeongdeok-dolmiyeok.jpg" },
      { name: "통영 굴", href: "/products/tongyeong-oyster-oil", cardImage: "/product-cards/tongyeong-oyster-oil.jpg" },
    ],
  },
  {
    id: "drink",
    eyebrow: "차 · 꿀 · 청",
    title: "하루 한 잔,\n자연이 담긴 여유",
    subtitle: "하동의 녹차, 홍천의 벌꿀, 제주의 감귤청으로 한 잔의 여유를.",
    cta: { label: "음료 보러가기", href: "/categories/cheong" },
    image: { src: "/hero/drink.png", alt: "아까시 벌꿀, 감귤청, 하동 녹차 한 잔", position: "60% center" },
    sideLabel: "차·꿀·청",
    featuredProducts: [
      { name: "하동 녹차", href: "/products/hadong-woojeon-tea", cardImage: "/product-cards/hadong-woojeon-tea.jpg" },
      { name: "아까시 벌꿀", href: "/products/hongcheon-acacia-honey", cardImage: "/product-cards/hongcheon-acacia-honey.jpg" },
      { name: "감귤청", href: "/products/jeju-citrus-cheong", cardImage: "/product-cards/jeju-citrus-cheong.jpg" },
    ],
  },
  {
    id: "intro",
    eyebrow: "LOCAL PICK",
    title: "지역에서 만든 것들",
    subtitle: "전국 각지의 생산자가 직접 기르고 만든 상품입니다.",
    note: `${categories.length}개 카테고리 · ${regions.length}개 지역 · 상품 ${products.length}개`,
    cta: { label: "카테고리 둘러보기", href: "/categories" },
    image: { src: "/hero/intro.png", alt: "한국 시골 마을 풍경과 로컬 농산물 장터" },
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
