"use client";

import { Button } from "@/components/ui/button";
import { useExperiment } from "@/components/experiment/ExperimentProvider";

/**
 * 구매하기 버튼.
 *
 * 이 클릭이 실험의 핵심 지표다. 상세 페이지에는 이 버튼이 하나만 노출되도록,
 * 데스크탑용(panel)과 모바일용(bar)을 반응형으로 배타 렌더링한다.
 */
export function BuyButton({ productSlug }: { productSlug: string }) {
  const { buyClick } = useExperiment();

  return (
    <Button
      type="button"
      onClick={() => buyClick(productSlug)}
      className="h-14 w-full rounded-lp-control text-lp-button"
    >
      구매하기
    </Button>
  );
}
