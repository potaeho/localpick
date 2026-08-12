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
 * 레이아웃: 데스크탑은 좌측 이미지 + 우측 sticky 구매 패널(마켓컬리 패턴),
 * 모바일은 세로 스택 + 하단 고정 구매 바(스마트스토어 패턴).
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
    <div className="mx-auto max-w-6xl px-4 pb-8 lg:px-6">
      {/* 상세 도달 — 구매 버튼 클릭률의 분모가 되는 이벤트 */}
      <TrackView
        type="product_view"
        productSlug={product.slug}
        utmSource={firstQueryValue(query.utm_source)}
        utmMedium={firstQueryValue(query.utm_medium)}
        utmCampaign={firstQueryValue(query.utm_campaign)}
        utmContent={firstQueryValue(query.utm_content)}
      />

      <div className="grid gap-8 py-6 lg:grid-cols-2 lg:gap-12">
        {/* 1. 이미지 + 생산지역 뱃지. 우측 구매 패널이 이미지형 상세설명까지
            sticky로 따라오도록, 그 설명도 이 좌측 컬럼 안에 함께 둔다
            (스마트스토어 패턴) */}
        <div>
          <div className="relative overflow-hidden rounded-xl bg-lp-gray-100">
            <ProductImage
              slug={product.slug}
              kind={product.imageKind}
              label={product.name}
              className="aspect-square w-full"
            />
            {region && (
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-medium text-lp-green">
                {region.province} {region.name}
              </span>
            )}
          </div>

          {/* 스펙 테이블 다음, 신뢰 카드보다 앞 — 스마트스토어의 "상품정보 표
              다음 이미지형 상세설명" 위치를 그대로 따른다 */}
          <ProductDetailImages
            images={product.detailImages}
            productName={product.name}
          />
        </div>

        {/* 구매 패널 */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          {category && (
            <Link
              href={`/categories/${category.id}`}
              className="text-xs text-lp-gray-500 underline underline-offset-4 hover:text-lp-green"
            >
              {category.name}
            </Link>
          )}

          {/* 2. 상품명 · 한 줄 설명 · 원산지 */}
          {product.badges.length > 0 && (
            <ul className="mb-3 flex flex-wrap gap-1.5">
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

          <h1 className="text-2xl font-bold leading-snug text-lp-ink">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-lp-gray-700">{product.tagline}</p>
          <p className="mt-3 text-sm">
            <span className="text-lp-gray-500">원산지 </span>
            <span className="font-medium text-lp-ink">{product.origin}</span>
          </p>

          {/* 3. 가격 */}
          <div className="mt-5 border-t border-lp-gray-100 pt-5">
            <PriceDisplay product={product} size="detail" />
            <p className="mt-2 text-sm text-lp-gray-700">
              배송비 {formatPrice(product.shippingFee)}원 ·{" "}
              {formatPrice(product.freeShippingOver)}원 이상 무료배송
            </p>
          </div>

          {/* 4. 스펙 테이블 */}
          <div className="mt-5">
            <SpecTable product={product} />
          </div>

          {/* 옵션 선택 + 구매하기 — 데스크탑에서는 패널 안, 모바일은 하단
              고정 바가 구매하기를 대신한다 */}
          <div className="hidden md:block">
            <OptionSelector product={product} />
            <div className="mt-3">
              <BuyButton productSlug={product.slug} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. 생산자 */}
      {creator && (
        <div className="mt-4">
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
        </div>
      )}

      {/* 6. 생산·가공 방식 */}
      <section className="mt-4 rounded-xl border border-lp-gray-300 bg-white p-5">
        <h2 className="text-xs font-medium text-lp-gray-500">
          어떻게 만드나요
        </h2>
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

      {/* 7. 생산지역 */}
      {region && (
        <div className="mt-4">
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
        </div>
      )}

      {/* 8. 교환·환불 */}
      <section className="mt-4 rounded-xl border border-lp-gray-300 bg-white p-5">
        <h2 className="text-xs font-medium text-lp-gray-500">교환 · 환불</h2>
        <p className="mt-3 text-sm leading-relaxed text-lp-gray-900">
          {product.refundPolicy}
        </p>
      </section>

      <MobileBuyBar product={product} />
    </div>
  );
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
