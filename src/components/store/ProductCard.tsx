import Link from "next/link";
import type { Product } from "@/lib/types";
import { getCreator, getRegion } from "@/lib/products";
import { ProductImage } from "./ProductImage";
import { PriceDisplay } from "./PriceDisplay";

/**
 * 상품 카드.
 *
 * 후기 수·재구매 수·판매량은 표시하지 않는다. 실제로 판매한 적이 없어
 * 어떤 숫자를 적어도 조작이 되기 때문이다(기획서 9장).
 */
export function ProductCard({ product }: { product: Product }) {
  const region = getRegion(product.regionId);
  const creator = getCreator(product.creatorId);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
    >
      <div className="relative overflow-hidden rounded-lg bg-lp-gray-100">
        <ProductImage
          slug={product.slug}
          kind={product.imageKind}
          label={product.name}
          className="aspect-square w-full transition-transform duration-300 group-hover:scale-105"
        />
        {region && (
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-xs font-medium text-lp-green">
            {region.name}
          </span>
        )}
      </div>

      <div className="mt-2.5">
        <h3 className="line-clamp-2 text-sm leading-snug text-lp-gray-900 group-hover:text-lp-green">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-lp-gray-500">
          {product.tagline}
        </p>
        {creator && (
          <p className="mt-1 text-xs text-lp-gray-700">{creator.name}</p>
        )}
        <div className="mt-1.5">
          <PriceDisplay product={product} />
        </div>
        {product.badges.length > 0 && (
          <ul className="mt-1.5 flex flex-wrap gap-1">
            {product.badges.map((badge) => (
              <li
                key={badge}
                className="rounded border border-lp-green-light bg-lp-green-light px-1.5 py-0.5 text-[11px] text-lp-green"
              >
                {badge}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
