import type { Region } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

/**
 * 상품 상세의 생산지역 카드.
 *
 * 이 카드의 클릭률이 "상품 관심이 생산지역 관심으로 이어지는가"라는
 * 팀 비전 연결 가설의 행동 신호가 된다.
 */
export function RegionCard({
  region,
  children,
}: {
  region: Region;
  /** 지역 페이지로 가는 링크 — 클릭 추적을 위해 부모가 주입한다 */
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-lp-card border-lp-gray-300 shadow-none [--card-spacing:--spacing(5)]">
      <CardContent>
        <h2 className="text-xs font-medium text-lp-gray-500">만든 곳</h2>

        <p className="mt-lp-md text-lp-card-title text-lp-ink">
          {region.province} {region.name}
        </p>
        <p className="mt-lp-sm line-clamp-3 text-sm leading-relaxed text-lp-gray-700">
          {region.description}
        </p>

        <div className="mt-lp-lg">{children}</div>
      </CardContent>
    </Card>
  );
}
