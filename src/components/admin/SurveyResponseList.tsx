"use client";

import { useMemo, useState } from "react";
import type {
  SurveyQuestionSummary,
  SurveyResponse,
  SurveyTrigger,
} from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * 교차분석에 쓸 문항 정의. getValues가 배열을 돌려주는 이유는 복수선택
 * 문항(channels, trustFactors)을 단일선택 문항과 같은 방식으로 다루기
 * 위해서다 — 응답 하나가 여러 값에 동시에 걸릴 수 있다.
 */
const CROSS_TAB_QUESTIONS: Array<{
  key: string;
  label: string;
  getValues: (r: SurveyResponse) => string[];
}> = [
  {
    key: "purchaseExperience",
    label: "구매 경험",
    getValues: (r) => [r.purchaseExperience],
  },
  { key: "channels", label: "실제 구매처", getValues: (r) => r.channels ?? [] },
  { key: "productCategories", label: "구매 상품", getValues: (r) => r.productCategories ?? [] },
  { key: "purchaseFrequency", label: "구매 빈도", getValues: (r) => r.purchaseFrequency ? [r.purchaseFrequency] : [] },
  { key: "typicalSpend", label: "구매 금액", getValues: (r) => r.typicalSpend ? [r.typicalSpend] : [] },
  { key: "purchaseBarriers", label: "미구매 이유", getValues: (r) => r.purchaseBarriers ?? [] },
  { key: "regionAttention", label: "지역 확인", getValues: (r) => r.regionAttention ? [r.regionAttention] : [] },
  { key: "preferredStoryFocus", label: "선호 소개", getValues: (r) => r.preferredStoryFocus ? [r.preferredStoryFocus] : [] },
  {
    key: "regionInterest",
    label: "지역 관심",
    getValues: (r) => r.regionInterest ? [r.regionInterest] : [],
  },
  { key: "ageGroup", label: "연령대", getValues: (r) => r.ageGroup ? [r.ageGroup] : [] },
  { key: "gender", label: "성별", getValues: (r) => r.gender ? [r.gender] : [] },
  {
    key: "interviewWilling",
    label: "인터뷰 의사",
    getValues: (r) => [r.interviewWilling ? "있음" : "없음"],
  },
];

function countValues(responses: SurveyResponse[], getValues: (r: SurveyResponse) => string[]) {
  const counts = new Map<string, number>();
  for (const r of responses) {
    for (const v of getValues(r)) {
      if (!v) continue;
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  }
  return counts;
}

/**
 * 설문 응답 — 문항별 집계와 주관식 원문.
 *
 * 상품별로 걸러볼 수 있게 한다. "왜 눌렀는가"는 상품마다 다를 수 있고, 그
 * 차이가 1차 실험에서 얻으려는 것이기 때문이다.
 */
export function SurveyResponseList({
  summaries,
  responses,
  productNames,
}: {
  summaries: SurveyQuestionSummary[];
  responses: SurveyResponse[];
  productNames: Record<string, string>;
}) {
  const [productFilter, setProductFilter] = useState<string>("all");
  const [triggerFilter, setTriggerFilter] = useState<SurveyTrigger | "all">(
    "all",
  );
  const [baseQuestionKey, setBaseQuestionKey] = useState(
    CROSS_TAB_QUESTIONS[0].key,
  );
  const [baseValue, setBaseValue] = useState<string | null>(null);

  const slugsInData = useMemo(() => {
    const slugs = new Set<string>();
    for (const response of responses) {
      if (response.productSlug) slugs.add(response.productSlug);
    }
    return [...slugs];
  }, [responses]);

  const filtered = useMemo(
    () => responses.filter((response) => {
      const productMatches =
        productFilter === "all" || response.productSlug === productFilter;
      const triggerMatches =
        triggerFilter === "all" || response.trigger === triggerFilter;
      return productMatches && triggerMatches;
    }),
    [responses, productFilter, triggerFilter],
  );

  const baseQuestion =
    CROSS_TAB_QUESTIONS.find((q) => q.key === baseQuestionKey) ??
    CROSS_TAB_QUESTIONS[0];

  const baseValueCounts = useMemo(
    () => countValues(filtered, baseQuestion.getValues),
    [filtered, baseQuestion],
  );
  const baseValueOptions = useMemo(
    () => [...baseValueCounts.entries()].sort((a, b) => b[1] - a[1]),
    [baseValueCounts],
  );
  const activeBaseValue = baseValue ?? baseValueOptions[0]?.[0] ?? null;

  const crossTabSubset = useMemo(
    () =>
      activeBaseValue === null
        ? []
        : filtered.filter((r) =>
            baseQuestion.getValues(r).includes(activeBaseValue),
          ),
    [filtered, baseQuestion, activeBaseValue],
  );

  if (responses.length === 0) {
    return (
      <p className="rounded-lp-card border border-dashed border-lp-gray-300 p-8 text-center text-sm text-lp-gray-500">
        아직 완료된 설문이 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* 문항별 집계 */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaries.map((summary) => {
          const total = summary.answers.reduce((sum, a) => sum + a.count, 0);
          return (
            <Card
              key={summary.question}
              className="rounded-lp-card border-lp-gray-300 shadow-none [--card-spacing:--spacing(4)]"
            >
              <CardContent>
                <h3 className="text-sm font-bold text-lp-ink">
                  {summary.question}
                </h3>
                <ul className="mt-3 space-y-2">
                  {summary.answers.length === 0 && (
                    <li className="text-xs text-lp-gray-500">응답 없음</li>
                  )}
                  {summary.answers.map((answer) => (
                    <li key={answer.value}>
                      <div className="flex items-baseline justify-between gap-2 text-xs">
                        <span className="text-lp-gray-900">{answer.value}</span>
                        <span className="shrink-0 tabular-nums text-lp-gray-500">
                          {answer.count}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-lp-circle bg-lp-gray-100">
                        <div
                          className="h-full rounded-lp-circle bg-lp-green"
                          style={{
                            width: `${total ? (answer.count / total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 문항 간 연관성 */}
      <div>
        <h3 className="text-sm font-bold text-lp-ink">문항 간 연관성</h3>
        <p className="mt-1 text-xs leading-relaxed text-lp-gray-500">
          기준 문항·보기를 고르면, 그렇게 답한 사람들이 다른 문항에서는 각각
          몇 %를 골랐는지 보여줍니다. 괄호 값은 전체(상품 필터 적용) 대비
          얼마나 더/덜 골랐는지입니다.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Select
            value={baseQuestionKey}
            onValueChange={(v) => {
              setBaseQuestionKey(v);
              setBaseValue(null);
            }}
          >
            <SelectTrigger className="h-10 rounded-lp-control border-lp-gray-300 bg-white px-lp-md text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CROSS_TAB_QUESTIONS.map((q) => (
                <SelectItem key={q.key} value={q.key}>
                  {q.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={activeBaseValue ?? undefined}
            onValueChange={setBaseValue}
          >
            <SelectTrigger className="h-10 min-w-[10rem] rounded-lp-control border-lp-gray-300 bg-white px-lp-md text-sm">
              <SelectValue placeholder="보기 선택" />
            </SelectTrigger>
            <SelectContent>
              {baseValueOptions.map(([value, count]) => (
                <SelectItem key={value} value={value}>
                  {value} ({count}건)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-lp-gray-500">
            {crossTabSubset.length}건이 이 보기를 선택함
          </span>
        </div>

        {crossTabSubset.length === 0 ? (
          <p className="mt-4 text-xs text-lp-gray-500">
            선택한 보기에 해당하는 응답이 없습니다.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {CROSS_TAB_QUESTIONS.filter((q) => q.key !== baseQuestion.key).map(
              (q) => {
                const subsetCounts = countValues(crossTabSubset, q.getValues);
                const overallCounts = countValues(filtered, q.getValues);
                const rows = [...subsetCounts.entries()]
                  .map(([value, count]) => {
                    const subsetPct = (count / crossTabSubset.length) * 100;
                    const overallTotal = filtered.length || 1;
                    const overallPct =
                      ((overallCounts.get(value) ?? 0) / overallTotal) * 100;
                    return { value, count, subsetPct, delta: subsetPct - overallPct };
                  })
                  .sort((a, b) => b.count - a.count);

                return (
                  <Card
                    key={q.key}
                    className="rounded-lp-card border-lp-gray-300 shadow-none [--card-spacing:--spacing(4)]"
                  >
                    <CardContent>
                      <h4 className="text-sm font-bold text-lp-ink">
                        {q.label}
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {rows.map((row) => (
                          <li key={row.value}>
                            <div className="flex items-baseline justify-between gap-2 text-xs">
                              <span className="text-lp-gray-900">
                                {row.value}
                              </span>
                              <span className="shrink-0 tabular-nums text-lp-gray-500">
                                {row.subsetPct.toFixed(0)}%{" "}
                                <span
                                  className={
                                    row.delta > 0
                                      ? "text-lp-green"
                                      : row.delta < 0
                                        ? "text-lp-orange"
                                        : "text-lp-gray-500"
                                  }
                                >
                                  ({row.delta > 0 ? "+" : ""}
                                  {row.delta.toFixed(0)}%p)
                                </span>
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 overflow-hidden rounded-lp-circle bg-lp-gray-100">
                              <div
                                className="h-full rounded-lp-circle bg-lp-green"
                                style={{ width: `${row.subsetPct}%` }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* 개별 응답 */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="survey-trigger-filter"
            className="text-sm font-medium text-lp-ink"
          >
            유입 경로
          </label>
          <Select
            value={triggerFilter}
            onValueChange={(value) =>
              setTriggerFilter(value as SurveyTrigger | "all")
            }
          >
            <SelectTrigger
              id="survey-trigger-filter"
              className="h-10 rounded-lp-control border-lp-gray-300 bg-white px-lp-md text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 경로</SelectItem>
              <SelectItem value="landing_engaged">랜딩 탐색 후</SelectItem>
              <SelectItem value="buy_click">구매 클릭 후</SelectItem>
              <SelectItem value="browse_3">상품 탐색 후(기존)</SelectItem>
            </SelectContent>
          </Select>
          <label
            htmlFor="survey-product-filter"
            className="text-sm font-medium text-lp-ink"
          >
            상품 필터
          </label>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger
              id="survey-product-filter"
              className="h-10 rounded-lp-control border-lp-gray-300 bg-white px-lp-md text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 ({responses.length}건)</SelectItem>
              {slugsInData.map((slug) => (
                <SelectItem key={slug} value={slug}>
                  {productNames[slug] ?? slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-lp-gray-500">{filtered.length}건</span>
        </div>

        <ul className="mt-4 space-y-3">
          {filtered.map((response) => (
            <li key={response.id}>
              <Card className="rounded-lp-card border-lp-gray-300 shadow-none [--card-spacing:--spacing(4)]">
                <CardContent>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-lp-gray-500">
                    <span>{new Date(response.ts).toLocaleString("ko-KR")}</span>
                    <span>
                      {response.productSlug
                        ? (productNames[response.productSlug] ??
                          response.productSlug)
                        : "상품 없음"}
                    </span>
                    <Badge variant="secondary" className="text-lp-gray-700">
                      {response.trigger === "buy_click"
                        ? "구매 클릭"
                        : response.trigger === "landing_engaged"
                          ? "랜딩 탐색 후"
                          : "상품 탐색 후"}
                    </Badge>
                    <span>
                      {response.device === "mobile" ? "모바일" : "데스크탑"}
                    </span>
                    {response.utmCampaign && <span>{response.utmCampaign}</span>}
                  </div>

                  <dl className="mt-3 space-y-2 text-sm">
                    <Row label="구매 경험">{response.purchaseExperience}</Row>
                    {(response.channels?.length ?? 0) > 0 && <Row label="구매처">{response.channels.join(", ")}</Row>}
                    {(response.productCategories?.length ?? 0) > 0 && <Row label="구매 상품">{response.productCategories.join(", ")}</Row>}
                    {response.purchaseFrequency && <Row label="구매 빈도">{response.purchaseFrequency}</Row>}
                    {response.typicalSpend && <Row label="구매 금액">{response.typicalSpend}</Row>}
                    {(response.purchasePurposes?.length ?? 0) > 0 && <Row label="구매 목적">{response.purchasePurposes.join(", ")}</Row>}
                    {(response.trustFactors?.length ?? 0) > 0 && <Row label="판단 기준">{response.trustFactors.join(", ")}</Row>}
                    {(response.purchaseProblems?.length ?? 0) > 0 && <Row label="구매 불편">{response.purchaseProblems.join(", ")}</Row>}
                    {(response.purchaseBarriers?.length ?? 0) > 0 && <Row label="미구매 이유">{response.purchaseBarriers.join(", ")}</Row>}
                    {(response.offlineChannels?.length ?? 0) > 0 && <Row label="평소 구매처">{response.offlineChannels.join(", ")}</Row>}
                    {(response.purchaseConditions?.length ?? 0) > 0 && <Row label="전환 조건">{response.purchaseConditions.join(", ")}</Row>}
                    {(response.prospectiveChannels?.length ?? 0) > 0 && <Row label="예상 구매처">{response.prospectiveChannels.join(", ")}</Row>}
                    {(response.purchaseConcerns?.length ?? 0) > 0 && <Row label="구매 우려">{response.purchaseConcerns.join(", ")}</Row>}
                    <Row label="지역 확인">{response.regionAttention || "-"}</Row>
                    {(response.regionReasons?.length ?? 0) > 0 && <Row label="확인 이유">{response.regionReasons.join(", ")}</Row>}
                    {(response.regionNonReasons?.length ?? 0) > 0 && <Row label="미확인 이유">{response.regionNonReasons.join(", ")}</Row>}
                    <Row label="생산자 정보">{response.producerStoryHelp || "-"}</Row>
                    <Row label="과정 신뢰">{response.processInfoTrust || "-"}</Row>
                    <Row label="지역 관심">{response.regionInterest || "-"}</Row>
                    <Row label="여행 정보">{response.travelInfoInterest || "-"}</Row>
                    <Row label="지역 기여">{response.regionalImpactInfluence || "-"}</Row>
                    <Row label="선호 소개">{response.preferredStoryFocus || "-"}</Row>
                    <Row label="연령대">{response.ageGroup || "-"}</Row>
                    <Row label="성별">{response.gender || "-"}</Row>
                    <Row label="인터뷰 의사">
                      {response.interviewWilling ? "있음" : "없음"}
                    </Row>
                  </dl>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-xs text-lp-gray-500">{label}</dt>
      <dd className="flex-1 leading-relaxed text-lp-gray-900">{children}</dd>
    </div>
  );
}
