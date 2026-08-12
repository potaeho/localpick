"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";

/**
 * 옵션 선택 UI — 마켓컬리·스마트스토어 구매 패널의 "옵션 선택하기" 박스를
 * 재현한다. 이 실험은 상품별로 옵션(중량·구성)이 하나뿐이므로 실제 옵션
 * 분기는 없고, 수량만 조절해 총 금액을 보여준다. 구매하기는 이 실험의
 * 핵심 지표이므로 수량과 무관하게 항상 동일하게 동작한다(실제 결제 없음).
 */
export function OptionSelector({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-12 w-full items-center justify-between rounded-lg border border-lp-gray-300 px-4 text-sm font-medium text-lp-ink hover:border-lp-green focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
      >
        옵션 선택
        <span className="text-lp-gray-500">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-2 rounded-lg border border-lp-gray-300 bg-lp-cream p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-lp-ink">{product.unit}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                aria-label="수량 감소"
                className="flex h-8 w-8 items-center justify-center rounded border border-lp-gray-300 text-lp-ink hover:bg-white"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-medium text-lp-ink">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((v) => v + 1)}
                aria-label="수량 증가"
                className="flex h-8 w-8 items-center justify-center rounded border border-lp-gray-300 text-lp-ink hover:bg-white"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-lp-gray-300 pt-3 text-sm">
            <span className="text-lp-gray-500">총 {qty}개</span>
            <span className="font-bold text-lp-ink">
              {formatPrice(product.priceSale * qty)}원
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
