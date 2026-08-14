"use client";

import { useMemo, useState } from "react";
import type { SurveyQuestionSummary, SurveyResponse } from "@/lib/types";
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

  const slugsInData = useMemo(() => {
    const slugs = new Set<string>();
    for (const response of responses) {
      if (response.productSlug) slugs.add(response.productSlug);
    }
    return [...slugs];
  }, [responses]);

  const filtered = useMemo(
    () =>
      productFilter === "all"
        ? responses
        : responses.filter((r) => r.productSlug === productFilter),
    [responses, productFilter],
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

      {/* 개별 응답 */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
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
                        : "탐색 3개 후"}
                    </Badge>
                    <span>
                      {response.device === "mobile" ? "모바일" : "데스크탑"}
                    </span>
                    {response.utmCampaign && <span>{response.utmCampaign}</span>}
                  </div>

                  <dl className="mt-3 space-y-2 text-sm">
                    <Row label="누른 이유">
                      {response.buyReason}
                      {response.buyReasonDetail &&
                        ` — ${response.buyReasonDetail}`}
                    </Row>
                    {response.useContext && (
                      <Row label="쓰려던 상황">{response.useContext}</Row>
                    )}
                    <Row label="구매 경험">{response.purchaseExperience}</Row>
                    <Row label="이용 채널">
                      {response.channels.join(", ") || "-"}
                    </Row>
                    <Row label="판단 기준">
                      {response.trustFactors.join(", ") || "-"}
                    </Row>
                    <Row label="지역·생산자">{response.regionInterest}</Row>
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
