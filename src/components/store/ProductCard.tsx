import Link from "next/link";
import type { Product } from "@/lib/types";
import { getCreator, getRegion } from "@/lib/products";
import { ProductImage } from "./ProductImage";
import { PriceDisplay } from "./PriceDisplay";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * 상품 카드.
 *
 * 후기 수·재구매 수·판매량은 표시하지 않는다. 실제로 판매한 적이 없어
 * 어떤 숫자를 적어도 조작이 되기 때문이다(기획서 9장).
 */
export function ProductCard({
  product,
  eagerImage = false,
}: {
  product: Product;
  eagerImage?: boolean;
}) {
  const region = getRegion(product.regionId);
  const creator = getCreator(product.creatorId);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
    >
      <Card size="sm" className="rounded-lp-card p-0 shadow-none">
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

        <CardContent className="px-0 pt-2.5">
          <h3 className="line-clamp-2 text-sm leading-snug text-lp-gray-900 group-hover:text-lp-green">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-lp-gray-500">
            {product.tagline}
          </p>
          {creator && (
            <p className="mt-1 text-xs text-lp-gray-700">{creator.name}</p>
          )}
          <div className="mt-lp-xs">
            <PriceDisplay product={product} />
          </div>
          {product.badges.length > 0 && (
            <ul className="mt-lp-xs flex flex-wrap gap-1">
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
