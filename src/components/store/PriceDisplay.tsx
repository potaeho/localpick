import type { Product } from "@/lib/types";
import { discountRate, formatPrice } from "@/lib/products";

/**
 * 가격 3단 표기 — 할인율 → 판매가 → 정가(취소선).
 * 마켓컬리·스마트스토어가 공통으로 쓰는 배치라, 소비자가 가격을 판단하는
 * 조건을 기존 대안과 동일하게 맞춘다.
 */
export function PriceDisplay({
  product,
  size = "card",
}: {
  product: Product;
  size?: "card" | "detail";
}) {
  const rate = discountRate(product);
  const detail = size === "detail";

  return (
    <div>
      <div className="flex items-baseline gap-lp-xs">
        {rate > 0 && (
          <span
            className={`font-bold text-lp-orange ${detail ? "text-2xl" : "text-sm"}`}
          >
            {rate}%
          </span>
        )}
        <span
          className={`font-bold text-lp-ink ${detail ? "text-2xl" : "text-sm"}`}
        >
          {formatPrice(product.priceSale)}
          <span className={detail ? "text-xl" : "text-sm"}>원</span>
        </span>
      </div>
      {rate > 0 && (
        <div
          className={`text-lp-gray-500 line-through ${detail ? "mt-1 text-base" : "text-xs"}`}
        >
          {formatPrice(product.priceList)}원
        </div>
      )}
    </div>
  );
}
