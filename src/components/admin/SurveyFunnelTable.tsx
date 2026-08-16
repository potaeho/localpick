import type { SurveyFunnelMetric } from "@/lib/types";

function percentLabel(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function SurveyFunnelTable({ rows }: { rows: SurveyFunnelMetric[] }) {
  return (
    <div className="overflow-x-auto rounded-lp-card border border-lp-gray-300 bg-white">
      <table className="w-full min-w-[58rem] text-sm">
        <thead>
          <tr className="border-b border-lp-gray-300 text-left text-xs text-lp-gray-500">
            <th scope="col" className="px-4 py-3 font-medium">유입 경로</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">도달</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">시작</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">완료</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">도달→시작</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">시작→완료</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">닫기</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">미완료 저장</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">제출 오류</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-lp-gray-100">
          {rows.map((row) => (
            <tr key={row.trigger}>
              <th scope="row" className="px-4 py-3 font-medium text-lp-ink">
                {row.label}
              </th>
              <td className="px-4 py-3 text-right tabular-nums">{row.reached}</td>
              <td className="px-4 py-3 text-right tabular-nums">{row.started}</td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums text-lp-green">
                {row.completed}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{percentLabel(row.startRate)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{percentLabel(row.completionRate)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{row.dismissed}</td>
              <td className="px-4 py-3 text-right tabular-nums">{row.abandoned}</td>
              <td className="px-4 py-3 text-right tabular-nums">{row.submitErrors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
