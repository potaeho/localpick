import type { Metadata } from "next";

import { getDashboardStats } from "@/lib/metrics";
import { products } from "@/lib/products";
import { KpiCard } from "@/components/admin/KpiCard";
import { FunnelChart } from "@/components/admin/FunnelChart";
import { ProductFunnelTable } from "@/components/admin/ProductFunnelTable";
import { InterviewList } from "@/components/admin/InterviewList";
import { SurveyResponseList } from "@/components/admin/SurveyResponseList";
import { AbandonedSurveyList } from "@/components/admin/AbandonedSurveyList";
import { SurveyFunnelTable } from "@/components/admin/SurveyFunnelTable";

export const metadata: Metadata = {
  title: "실험 대시보드 - LOCAL PICK",
  robots: { index: false, follow: false },
};

/** 수집 데이터는 항상 최신이어야 하므로 캐시하지 않는다 */
export const dynamic = "force-dynamic";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-lp-heading text-lp-ink">{title}</h2>
      {description && (
        <p className="mt-1 text-sm leading-relaxed text-lp-gray-700">
          {description}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const productNames = Object.fromEntries(
    products.map((product) => [product.slug, product.name]),
  );

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-lp-ink">랜딩 설문 · 상품 수요 실험</h1>
          <p className="mt-1 text-sm text-lp-gray-500">
            집계 시각 {new Date(stats.generatedAt).toLocaleString("ko-KR")}
          </p>
        </div>
        <a
          href="/api/admin/export"
          className="inline-flex h-10 items-center rounded-lp-control border border-lp-green px-lp-lg text-sm font-medium text-lp-green hover:bg-lp-green-light"
        >
          CSV 내보내기
        </a>
      </div>

      {/* 지표 오독을 막는 상시 안내 — 기획서 6장의 해석 원칙 */}
      <aside className="mt-5 rounded-lp-card border border-lp-orange-light bg-lp-orange-light p-4">
        <h2 className="text-sm font-bold text-lp-ink">지표를 읽는 원칙</h2>
        <ul className="mt-2 space-y-1 text-xs leading-relaxed text-lp-gray-900">
          <li>· 광고 클릭은 <strong>관심</strong> 신호입니다.</li>
          <li>
            · 구매 버튼 클릭은 <strong>구매 의도</strong> 신호입니다. 실제 구매가
            아닙니다.
          </li>
          <li>· 설문 응답은 <strong>진술</strong> 데이터입니다.</li>
          <li>
            · 실제 결제만이 구매 행동이며, 이번 실험에서는 측정하지 않습니다.
          </li>
          <li>
            · 방문 정보 클릭은 <strong>지역 관심</strong> 신호일 뿐, 실제 방문이
            아닙니다.
          </li>
        </ul>
      </aside>

      <Section
        title="설문 유도 성과"
        description="랜딩에서 설문이 열린 뒤 시작하고 끝낸 비율을 유입 경로별로 봅니다. 시작 또는 완료 기록이 있으면 노출 이벤트가 누락돼도 '도달'로 보정합니다."
      >
        <SurveyFunnelTable rows={stats.surveyFunnel} />
      </Section>

      <Section
        title="구매 의도 핵심 지표"
        description="광고를 본 사람이 상품 상세를 거쳐 인터뷰 대상자가 되기까지의 전환입니다."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.primaryKpis.map((metric) => (
            <KpiCard key={metric.label} metric={metric} />
          ))}
        </div>
      </Section>

      <Section title="상품별 퍼널 비교">
        <ProductFunnelTable rows={stats.productFunnels} />
      </Section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-lp-heading text-lp-ink">단계별 이탈</h2>
          <div className="mt-4 rounded-lp-card border border-lp-gray-300 bg-white p-5">
            <FunnelChart steps={stats.funnel} />
          </div>
        </section>

        <section>
          <h2 className="text-lp-heading text-lp-ink">
            2차 보조 지표 — 미션 연결 신호
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-lp-gray-700">
            상품 관심이 생산자·지역 관심으로 이어지는지 봅니다.
          </p>
          <div className="mt-4 space-y-3">
            {stats.secondaryMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lp-card border border-lp-gray-300 bg-white p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-lp-gray-900">
                    {metric.label}
                  </span>
                  <span className="shrink-0 text-xl font-bold tabular-nums text-lp-ink">
                    {metric.value.toFixed(1)}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-lp-gray-500">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Section
        title="캠페인별 분해"
        description="2차 실험에서 메시지를 나눠 테스트할 때 이 표로 조건 간 반응을 비교합니다."
      >
        <div className="overflow-x-auto rounded-lp-card border border-lp-gray-300 bg-white">
          <table className="w-full min-w-[32rem] text-sm">
            <thead>
              <tr className="border-b border-lp-gray-300 text-left text-xs text-lp-gray-500">
                <th scope="col" className="px-4 py-3 font-medium">캠페인</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">상세 도달</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">구매 클릭</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">설문 완료</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">인터뷰 동의</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lp-gray-100">
              {stats.campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-lp-gray-500">
                    아직 수집된 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                stats.campaigns.map((row) => (
                  <tr key={row.campaign}>
                    <td className="px-4 py-3 font-medium text-lp-ink">
                      {row.campaign}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{row.detailViews}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{row.buyClicks}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{row.surveys}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{row.consents}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="설문 응답"
        description="선택형 문항 집계와 주관식 원문입니다. 개별 응답은 랜딩 탐색·구매 클릭 등 유입 경로와 상품으로 걸러볼 수 있습니다."
      >
        <SurveyResponseList
          summaries={stats.surveySummaries}
          responses={stats.surveyResponses}
          productNames={productNames}
        />
      </Section>

      <Section
        title="인터뷰 참여 연락처"
        description="인터뷰 일정 안내와 상품 추첨 결과 안내에 동의하고 연락처를 남긴 분들입니다. 실제 인터뷰 참여자가 상품 추첨 대상이며, 연락처는 기본적으로 가려져 있습니다."
      >
        <InterviewList interviews={stats.interviews} />
      </Section>

      <Section
        title="이탈된 응답"
        description="설문을 끝내지 못하고 나갔지만, 그 전까지 답한 내용은 자동으로 남겨둔 것입니다. 완료 응답 집계에는 포함되지 않습니다."
      >
        <AbandonedSurveyList
          rows={stats.abandonedSurveys}
          productNames={productNames}
        />
      </Section>
    </>
  );
}
