import type { FunnelStep } from "@/lib/types";

export function FunnelChart({ steps }: { steps: FunnelStep[] }) {
  const maximum = Math.max(1, ...steps.map((step) => step.value));
  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={step.label}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="font-medium text-lp-ink">{step.label}</span>
            <span className="text-lp-gray-700">{step.value}명{step.previousValue !== undefined ? ` · 이전 단계의 ${((step.value / Math.max(1, step.previousValue)) * 100).toFixed(1)}%` : ""}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-lp-circle bg-lp-gray-100">
            <div className="h-full rounded-lp-circle bg-lp-green" style={{ width: `${(step.value / maximum) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
