import type { MetricValue } from "@/lib/types";

export function KpiCard({ metric }: { metric: MetricValue }) {
  return (
    <article className="rounded-2xl border border-lp-gray-300 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-lp-gray-700">{metric.label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-lp-green">{metric.value.toFixed(1)}%</p>
      <p className="mt-2 text-xs leading-5 text-lp-gray-500">{metric.description}{metric.denominator !== undefined ? ` · 기준 ${metric.denominator}명` : ""}</p>
    </article>
  );
}
