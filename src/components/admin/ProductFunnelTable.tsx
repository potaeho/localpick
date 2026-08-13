import { products } from "@/lib/products";
import type { ProductFunnelMetric } from "@/lib/types";

export function ProductFunnelTable({ rows }: { rows: ProductFunnelMetric[] }) {
  const names = new Map(products.map((product) => [product.slug, product.name]));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-170 text-left text-sm">
        <thead className="border-b border-lp-gray-300 text-lp-gray-700"><tr><th className="p-lp-md">상품</th><th className="p-lp-md text-right">상세 도달</th><th className="p-lp-md text-right">구매 클릭</th><th className="p-lp-md text-right">CTR</th><th className="p-lp-md text-right">설문 완료</th><th className="p-lp-md text-right">인터뷰 동의</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.productSlug} className="border-b border-lp-gray-100"><td className="p-lp-md font-medium">{names.get(row.productSlug) ?? row.productSlug}</td><td className="p-lp-md text-right">{row.detailViews}</td><td className="p-lp-md text-right">{row.buyClicks}</td><td className="p-lp-md text-right"><span className="font-semibold text-lp-green">{row.clickThroughRate.toFixed(1)}%</span><span className="ml-2 inline-block h-1.5 w-12 overflow-hidden rounded bg-lp-gray-100 align-middle"><span className="block h-full bg-lp-orange" style={{ width: `${Math.min(row.clickThroughRate, 100)}%` }} /></span></td><td className="p-lp-md text-right">{row.surveyCompletes}</td><td className="p-lp-md text-right">{row.interviewConsents}</td></tr>)}</tbody>
      </table>
      {!rows.length && <p className="p-6 text-center text-sm text-lp-gray-500">아직 상품별 이벤트가 없습니다.</p>}
    </div>
  );
}
