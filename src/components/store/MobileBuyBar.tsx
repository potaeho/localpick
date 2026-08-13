import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";
import { BuyButton } from "./BuyButton";

/**
 * 모바일 하단 고정 구매 바 (네이버 스마트스토어 패턴).
 * 상품 상세에서는 하단 탭바 대신 이 바가 자리를 차지한다.
 */
export function MobileBuyBar({ product }: { product: Product }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-lp-gray-300 bg-white px-lp-lg pb-[env(safe-area-inset-bottom)] pt-lp-md shadow-[0_-8px_24px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="flex items-center gap-lp-md pb-lp-md">
        <div className="min-w-0 shrink-0">
          <p className="text-xs text-lp-gray-500">판매가</p>
          <p className="text-lg font-bold text-lp-ink">
            {formatPrice(product.priceSale)}원
          </p>
        </div>
        <div className="flex-1">
          <BuyButton productSlug={product.slug} />
        </div>
      </div>
    </div>
  );
}
