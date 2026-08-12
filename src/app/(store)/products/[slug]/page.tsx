import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { TrackView } from "@/components/experiment/TrackView";
import { TrackedLink } from "@/components/experiment/TrackedLink";
import { ProductImage } from "@/components/store/ProductImage";
import { PriceDisplay } from "@/components/store/PriceDisplay";
import { SpecTable } from "@/components/store/SpecTable";
import { ProductDetailImages } from "@/components/store/ProductDetailImages";
import { OptionSelector } from "@/components/store/OptionSelector";
import { CreatorCard } from "@/components/store/CreatorCard";
import { RegionCard } from "@/components/store/RegionCard";
import { BuyButton } from "@/components/store/BuyButton";
import { MobileBuyBar } from "@/components/store/MobileBuyBar";
import {
  getCategory,
  getCreator,
  getProduct,
  getRegion,
  formatPrice,
  products,
} from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} - LOCAL PICK`,
    description: product.tagline,
  };
}

/**
 * 상품 상세 — 이 실험의 핵심 측정 지점.
 *
 * 섹션 순서와 정보 항목이 전 상품 동일하게 고정되어 있다. 상품마다 다른
 * 상세 페이지를 만들면 구매 버튼 클릭률 차이가 상품 수요 때문인지 페이지
 * 구성 때문인지 구분할 수 없게 되기 때문이다(기획서 5장).
 *
 * 레이아웃: 대표 이미지와 구매 요약을 하나의 상단 세트로 묶고, 상세 이미지와
 * 전체 상품 정보는 구분된 하단 섹션에 둔다. 데스크탑은 하단 섹션의 우측
 * 구매 패널이 스크롤을 따라가고, 모바일은 하단 고정 구매 바를 사용한다.
 */
export default async function ProductDetailPage({
  params,
  searchParams,
}: PageProps<"/products/[slug]">) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const product = getProduct(slug);
  if (!product) notFound();

  const region = getRegion(product.regionId);
  const creator = getCreator(product.creatorId);
  const category = getCategory(product.categoryId);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 lg:px-6 lg:pb-10">
      {/* 상세 도달 — 구매 버튼 클릭률의 분모가 되는 이벤트 */}
      <TrackView
        type="product_view"
        productSlug={product.slug}
        utmSource={firstQueryValue(query.utm_source)}
        utmMedium={firstQueryValue(query.utm_medium)}
        utmCampaign={firstQueryValue(query.utm_campaign)}
        utmContent={firstQueryValue(query.utm_content)}
      />

      {/* 1. 대표 이미지 + 핵심 구매 정보: 첫 화면에서 하나의 세트로 인식되도록
          같은 섹션에 두고, 양쪽 높이가 과도하게 벌어지지 않게 요약 정보만 둔다. */}
      <section className="py-6 lg:py-8" aria-labelledby="product-title">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-12">
          <div className="relative overflow-hidden rounded-xl bg-lp-gray-100">
            <ProductImage
              slug={product.slug}
              kind={product.imageKind}
              label={product.name}
              imageSrc={product.detailImages?.[0]}
              sizes="(max-width: 1024px) 100vw, 55vw"
              loading="eager"
              className="aspect-square w-full"
            />
            {region && (
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-medium text-lp-green">
                {region.province} {region.name}
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-col lg:max-w-md lg:self-stretch lg:py-1">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {category && (
                  <Link
                    href={`/categories/${category.id}`}
                    className="text-xs text-lp-gray-500 underline underline-offset-4 hover:text-lp-green"
                  >
                    {category.name}
                  </Link>
                )}
                {product.badges.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {product.badges.map((badge) => (
                      <li
                        key={badge}
                        className="rounded border border-lp-green-light bg-lp-green-light px-2 py-0.5 text-xs text-lp-green"
                      >
                        {badge}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <h1
                id="product-title"
                className="mt-4 text-2xl font-bold leading-snug text-lp-ink lg:text-[1.75rem]"
              >
                {product.name}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-lp-gray-700">
                {product.tagline}
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                <span className="text-lp-gray-500">원산지 </span>
                <span className="font-medium text-lp-ink">{product.origin}</span>
              </p>

              <div className="mt-5 border-t border-lp-gray-100 pt-5">
                <PriceDisplay product={product} size="detail" />
                <p className="mt-2 text-sm text-lp-gray-700">
                  배송비 {formatPrice(product.shippingFee)}원 ·{" "}
                  {formatPrice(product.freeShippingOver)}원 이상 무료배송
                </p>
              </div>

              <dl className="mt-5 divide-y divide-lp-gray-100 border-y border-lp-gray-100 text-sm">
                <CompactSpecRow label="배송" value={product.deliveryMethod} />
                <CompactSpecRow label="발송" value={product.deliveryEta} />
                <CompactSpecRow
                  label="구성"
                  value={`${product.unit} · ${product.weight}`}
                />
              </dl>
            </div>

            {/* PC 첫 화면의 구매 액션. 모바일은 화면 하단 고정 바를 사용한다. */}
            <div className="mt-auto hidden pt-5 lg:block">
              <PurchaseActions product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 상세 콘텐츠: 상단 상품 세트와 충분한 여백·구분선으로 분리한다. */}
      <section
        className="mt-8 border-t border-lp-gray-300 pt-9 lg:mt-14 lg:pt-12"
        aria-labelledby="product-details-title"
      >
        <header className="mb-7 lg:mb-9">
          <p className="text-xs font-semibold tracking-[0.18em] text-lp-green">
            PRODUCT DETAILS
          </p>
          <h2
            id="product-details-title"
            className="mt-2 text-xl font-bold text-lp-ink lg:text-2xl"
          >
            상품 상세정보
          </h2>
          <p className="mt-2 text-sm text-lp-gray-500">
            상품의 구성과 만드는 과정, 생산지 정보를 확인해 보세요.
          </p>
        </header>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div className="min-w-0 space-y-8">
            <ProductDetailImages
              images={product.detailImages}
              productName={product.name}
            />

            <section className="rounded-xl border border-lp-gray-300 bg-white p-5 lg:p-6">
              <h3 className="text-base font-bold text-lp-ink">상품 기본 정보</h3>
              <div className="mt-4">
                <SpecTable product={product} />
              </div>
            </section>

            {/* 생산자 */}
            {creator && (
              <CreatorCard creator={creator} region={region}>
                <TrackedLink
                  href={`/creators/${creator.id}`}
                  eventType="creator_story_click"
                  productSlug={product.slug}
                  creatorId={creator.id}
                  className="inline-flex min-h-11 items-center rounded-lg border border-lp-green px-4 text-sm font-medium text-lp-green hover:bg-lp-green-light focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
                >
                  생산자 이야기 보기
                </TrackedLink>
              </CreatorCard>
            )}

            {/* 생산·가공 방식 */}
            <section className="rounded-xl border border-lp-gray-300 bg-white p-5">
              <h3 className="text-xs font-medium text-lp-gray-500">
                어떻게 만드나요
              </h3>
              <ol className="mt-3 space-y-3">
                {product.process.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lp-green-light text-xs font-bold text-lp-green">
                      {index + 1}
                    </span>
                    <span className="text-lp-gray-900">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* 생산지역 */}
            {region && (
              <RegionCard region={region}>
                <TrackedLink
                  href={`/regions/${region.id}`}
                  eventType="region_info_click"
                  productSlug={product.slug}
                  regionId={region.id}
                  className="inline-flex min-h-11 items-center rounded-lg border border-lp-green px-4 text-sm font-medium text-lp-green hover:bg-lp-green-light focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
                >
                  {region.name} 알아보기
                </TrackedLink>
              </RegionCard>
            )}

            {/* 교환·환불 */}
            <section className="rounded-xl border border-lp-gray-300 bg-white p-5">
              <h3 className="text-xs font-medium text-lp-gray-500">
                교환 · 환불
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-lp-gray-900">
                {product.refundPolicy}
              </p>
            </section>
          </div>

          {/* PC에서는 상세 내용을 읽는 동안 구매 옵션이 우측에서 따라온다. */}
          <aside className="sticky top-28 hidden rounded-xl border border-lp-gray-300 bg-white p-5 shadow-sm lg:block">
            <p className="text-xs text-lp-gray-500">현재 보고 있는 상품</p>
            <p className="mt-1 font-bold leading-snug text-lp-ink">
              {product.name}
            </p>
            <div className="mt-4 border-t border-lp-gray-100 pt-4">
              <PriceDisplay product={product} size="card" />
            </div>
            <PurchaseActions product={product} />
          </aside>
        </div>
      </section>

      <MobileBuyBar product={product} />
    </div>
  );
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function CompactSpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-3 py-3">
      <dt className="text-lp-gray-500">{label}</dt>
      <dd className="leading-relaxed text-lp-gray-900">{value}</dd>
    </div>
  );
}

function PurchaseActions({
  product,
}: {
  product: NonNullable<ReturnType<typeof getProduct>>;
}) {
  return (
    <>
      <OptionSelector product={product} />
      <div className="mt-3">
        <BuyButton productSlug={product.slug} />
      </div>
    </>
  );
}
