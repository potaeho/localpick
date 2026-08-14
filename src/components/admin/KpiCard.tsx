import type { MetricValue } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({ metric }: { metric: MetricValue }) {
  return (
    <Card className="rounded-lp-media border-lp-gray-300 [--card-spacing:--spacing(5)]">
      <CardContent>
        <p className="text-sm font-medium text-lp-gray-700">{metric.label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-lp-green">{metric.value.toFixed(1)}%</p>
        <p className="mt-2 text-xs leading-5 text-lp-gray-500">{metric.description}{metric.denominator !== undefined ? ` · 기준 ${metric.denominator}명` : ""}</p>
      </CardContent>
    </Card>
  );
}
