"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * 옵션 선택 UI — 마켓컬리·스마트스토어 구매 패널의 "옵션 선택하기" 박스를
 * 재현한다. 네이버 스마트스토어는 이 박스를 클릭해서 펼치는 토글이 아니라
 * 처음부터 항상 펼쳐진 카드로 보여준다 — 상세 이미지를 스크롤하는 동안에도
 * 우측 패널에 계속 떠 있으므로, 펼쳐야만 보이는 UI는 그 효과를 죽인다.
 *
 * 이 실험은 상품별로 옵션(중량·구성)이 하나뿐이라 애플케어+ 같은 "추가
 * 옵션" 드롭다운은 없다 — 존재하지 않는 옵션을 드롭다운으로 만들면 실제로
 * 존재하는 것처럼 보여 기만이 된다. 수량만 조절해 총 금액을 보여준다.
 * 구매하기는 이 실험의 핵심 지표이므로 수량과 무관하게 항상 동일하게
 * 동작한다(실제 결제 없음).
 */
export function OptionSelector({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);

  return (
    <Card className="mt-lp-lg rounded-lp-control border-lp-gray-300 bg-lp-cream shadow-none [--card-spacing:--spacing(3)]">
      <CardContent>
        <p className="mb-lp-sm text-xs font-medium text-lp-gray-500">옵션 선택</p>
        <div className="flex items-center justify-between gap-lp-md">
          <span className="text-sm text-lp-ink">{product.unit}</span>
          <div className="flex items-center gap-lp-sm">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => setQty((v) => Math.max(1, v - 1))}
              aria-label="수량 감소"
              className="rounded border-lp-gray-300 bg-transparent text-lp-ink hover:bg-white"
            >
              −
            </Button>
            <span className="w-6 text-center text-sm font-medium text-lp-ink">
              {qty}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => setQty((v) => v + 1)}
              aria-label="수량 증가"
              className="rounded border-lp-gray-300 bg-transparent text-lp-ink hover:bg-white"
            >
              +
            </Button>
          </div>
        </div>
        <div className="mt-lp-md flex items-center justify-between border-t border-lp-gray-300 pt-lp-md text-sm">
          <span className="text-lp-gray-500">총 {qty}개</span>
          <span className="font-bold text-lp-ink">
            {formatPrice(product.priceSale * qty)}원
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
