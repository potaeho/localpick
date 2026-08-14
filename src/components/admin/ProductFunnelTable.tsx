import { products } from "@/lib/products";
import type { ProductFunnelMetric } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ProductFunnelTable({ rows }: { rows: ProductFunnelMetric[] }) {
  const names = new Map(products.map((product) => [product.slug, product.name]));
  return (
    <div className="min-w-170">
      <Table>
        <TableHeader>
          <TableRow className="border-lp-gray-300 text-lp-gray-700">
            <TableHead>상품</TableHead>
            <TableHead className="text-right">상세 도달</TableHead>
            <TableHead className="text-right">구매 클릭</TableHead>
            <TableHead className="text-right">CTR</TableHead>
            <TableHead className="text-right">설문 완료</TableHead>
            <TableHead className="text-right">인터뷰 동의</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.productSlug} className="border-lp-gray-100">
              <TableCell className="font-medium whitespace-normal">
                {names.get(row.productSlug) ?? row.productSlug}
              </TableCell>
              <TableCell className="text-right">{row.detailViews}</TableCell>
              <TableCell className="text-right">{row.buyClicks}</TableCell>
              <TableCell className="text-right">
                <span className="font-semibold text-lp-green">
                  {row.clickThroughRate.toFixed(1)}%
                </span>
                <span className="ml-2 inline-block h-1.5 w-12 overflow-hidden rounded bg-lp-gray-100 align-middle">
                  <span
                    className="block h-full bg-lp-orange"
                    style={{ width: `${Math.min(row.clickThroughRate, 100)}%` }}
                  />
                </span>
              </TableCell>
              <TableCell className="text-right">{row.surveyCompletes}</TableCell>
              <TableCell className="text-right">{row.interviewConsents}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!rows.length && (
        <p className="p-6 text-center text-sm text-lp-gray-500">
          아직 상품별 이벤트가 없습니다.
        </p>
      )}
    </div>
  );
}
