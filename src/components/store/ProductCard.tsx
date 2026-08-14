import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, getRegion } from "@/lib/products";
import { ProductImage } from "./ProductImage";
import { PriceDisplay } from "./PriceDisplay";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * 상품 카드.
 *
 * 후기 수·재구매 수·판매량은 표시하지 않는다. 실제로 판매한 적이 없어
 * 어떤 숫자를 적어도 조작이 되기 때문이다(기획서 9장). 생산자 이름은 카드
 * 단계에서는 굳이 필요하지 않은 정보라 상세 페이지에서만 보여준다.
 */
export function ProductCard({
  product,
  eagerImage = false,
}: {
  product: Product;
  eagerImage?: boolean;
}) {
  const region = getRegion(product.regionId);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
    >
      <Card
        size="sm"
        className="rounded-lp-card border border-lp-gray-200 p-lp-sm shadow-none ring-0"
      >
        <div className="relative overflow-hidden rounded-lp-card bg-lp-gray-100">
          <ProductImage
            slug={product.slug}
            kind={product.imageKind}
            label={product.name}
            imageSrc={product.cardImage ?? product.detailImages?.[0]}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            loading={eagerImage ? "eager" : undefined}
            className="aspect-square w-full transition-transform duration-300 group-hover:scale-105"
          />
          {region && (
            <Badge className="absolute left-2 top-2 bg-white/95 text-lp-green hover:bg-white/95">
              {region.name}
            </Badge>
          )}
        </div>

        <CardContent className="px-lp-xs pt-lp-md">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-lp-gray-900 group-hover:text-lp-green">
            {product.name}
          </h3>
          <p className="mt-lp-sm line-clamp-1 text-xs leading-relaxed text-lp-gray-500">
            {product.tagline}
          </p>

          <div className="mt-lp-lg">
            <PriceDisplay product={product} />
          </div>

          <p className="mt-lp-xs line-clamp-1 text-xs text-lp-gray-500">
            {product.shippingFee === 0
              ? "무료배송"
              : `배송비 ${formatPrice(product.shippingFee)}원`}
            {" · "}
            {product.deliveryEta}
          </p>

          {product.badges.length > 0 && (
            <ul className="mt-lp-md flex flex-wrap gap-1">
              {product.badges.map((badge) => (
                <li key={badge}>
                  <Badge
                    variant="outline"
                    className="border-lp-green-light bg-lp-green-light text-[11px] text-lp-green"
                  >
                    {badge}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
