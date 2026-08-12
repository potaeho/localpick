import "server-only";

import { NO_PURCHASE_EXPERIENCE, QUESTIONS } from "@/lib/survey-questions";
import { storage } from "@/lib/store";
import type {
  AbandonedAnswer,
  AbandonedSurveyRow,
  CampaignMetric,
  DashboardStats,
  EventType,
  FunnelStep,
  InterviewConsent,
  MaskedInterview,
  MetricValue,
  ProductFunnelMetric,
  SurveyAnswers,
  SurveyProgress,
  SurveyQuestionSummary,
  SurveyResponse,
  TrackedEvent,
} from "@/lib/types";

function percent(numerator: number, denominator: number): number {
  return denominator ? (numerator / denominator) * 100 : 0;
}

function uniqueSessions(events: TrackedEvent[], type: EventType): Set<string> {
  return new Set(events.filter((event) => event.type === type).map((event) => event.sessionId));
}

/**
 * 이 지표 체계의 모든 분자·분모는 **세션 단위 중복 제거**를 거친다.
 *
 * 한 사람이 같은 상품 상세를 세 번 열었다고 분모가 3이 되면 구매 버튼
 * 클릭률이 실제보다 낮게 나오고, 상품별 표의 수치가 상단 핵심 KPI와
 * 어긋나 같은 화면 안에서 서로 다른 이야기를 하게 된다.
 */
function countEvents(events: TrackedEvent[], type: EventType): number {
  return uniqueSessions(events, type).size;
}

function maskedContact(contact: string, type: InterviewConsent["contactType"]): string {
  if (type === "email") {
    const [local = "", domain = ""] = contact.split("@");
    return `${local.slice(0, 2)}${"•".repeat(Math.max(3, local.length - 2))}@${domain}`;
  }
  const digits = contact.replace(/\D/g, "");
  return digits.length >= 4 ? `${"•".repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}` : "••••";
}

function answerCounts(question: string, values: string[]): SurveyQuestionSummary {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return {
    question,
    answers: [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, "ko")),
  };
}

function createSurveySummaries(surveys: SurveyResponse[]): SurveyQuestionSummary[] {
  return [
    answerCounts("구매 버튼을 누른 이유", surveys.map((survey) => survey.buyReason)),
    answerCounts("온라인 지역 상품 구매 경험", surveys.map((survey) => survey.purchaseExperience)),
    answerCounts("주 사용 구매 채널", surveys.flatMap((survey) => survey.channels)),
    answerCounts("신뢰 판단 정보", surveys.flatMap((survey) => survey.trustFactors)),
    answerCounts("지역·생산자 관심", surveys.map((survey) => survey.regionInterest)),
    answerCounts("인터뷰 참여 의사", surveys.map((survey) => (survey.interviewWilling ? "참여 의사 있음" : "참여 의사 없음"))),
  ];
}

function productFunnels(
  events: TrackedEvent[],
  buyerPathSurveys: SurveyResponse[],
  buyerPathConsents: InterviewConsent[],
): ProductFunnelMetric[] {
  const surveysById = new Map(buyerPathSurveys.map((survey) => [survey.id, survey]));
  const slugs = new Set([
    ...events.map((event) => event.productSlug),
    ...buyerPathSurveys.map((survey) => survey.productSlug),
  ].filter((slug): slug is string => Boolean(slug)));
  return [...slugs]
    .map((productSlug) => {
      const forProduct = events.filter((event) => event.productSlug === productSlug);
      const detailViews = countEvents(forProduct, "product_view");
      const buyClicks = countEvents(forProduct, "buy_click");
      const completedBuyerSurveySessions = new Set(
        buyerPathSurveys
          .filter((survey) => survey.productSlug === productSlug)
          .map((survey) => survey.sessionId),
      );
      const buyerConsentSessions = new Set(
        buyerPathConsents
          .filter((consent) => surveysById.get(consent.surveyId)?.productSlug === productSlug)
          .map((consent) => consent.sessionId),
      );
      return {
        productSlug,
        detailViews,
        buyClicks,
        clickThroughRate: percent(buyClicks, detailViews),
        // 상품 비교 퍼널도 핵심 경로인 구매 버튼 → 설문만 사용한다. browse_3
        // 보조 설문은 설문 응답 목록/문항 집계에서 계속 확인할 수 있다.
        surveyCompletes: completedBuyerSurveySessions.size,
        interviewConsents: buyerConsentSessions.size,
      };
    })
    .sort((a, b) => b.clickThroughRate - a.clickThroughRate || b.detailViews - a.detailViews);
}

function campaignMetrics(events: TrackedEvent[]): CampaignMetric[] {
  const campaigns = new Set(events.map((event) => event.utmCampaign ?? "(미지정)"));
  return [...campaigns]
    .map((campaign) => {
      const relevant = events.filter((event) => (event.utmCampaign ?? "(미지정)") === campaign);
      return {
        campaign,
        detailViews: countEvents(relevant, "product_view"),
        buyClicks: countEvents(relevant, "buy_click"),
        surveys: countEvents(relevant, "survey_complete"),
        consents: countEvents(relevant, "interview_consent"),
      };
    })
    .sort((a, b) => b.detailViews - a.detailViews);
}

/**
 * 이탈 스냅샷의 답변을 사람이 읽을 수 있는 라벨:값 목록으로 펼친다.
 * QUESTIONS 순서를 그대로 따라 설문 문항 순서와 나란히 읽힌다.
 */
function formatAbandonedAnswers(
  answers: Partial<SurveyAnswers>,
): { rows: AbandonedAnswer[]; answeredCount: number } {
  const rows: AbandonedAnswer[] = [];
  let answeredCount = 0;

  for (const question of QUESTIONS) {
    const value = answers[question.id];
    if (value === undefined) continue;

    if (question.kind === "boolean") {
      if (typeof value !== "boolean") continue;
      rows.push({ label: question.title, value: value ? question.yes : question.no });
    } else if (question.kind === "multi") {
      if (!Array.isArray(value) || value.length === 0) continue;
      rows.push({ label: question.title, value: value.join(", ") });
    } else {
      if (typeof value !== "string" || !value) continue;
      rows.push({ label: question.title, value });
    }
    answeredCount += 1;
  }

  if (answers.buyReasonDetail) {
    rows.push({ label: "기타 이유", value: answers.buyReasonDetail });
  }

  return { rows, answeredCount };
}

/**
 * 이탈한 시도만 남긴다. 완료된 시도는 saveProgress → deleteProgress 흐름으로
 * 정리되지만, 정리가 실패했거나 경합이 있었을 경우를 대비해 dedupeKey로
 * 완료된 설문과 한 번 더 대조한다.
 */
function abandonedSurveyRows(
  progress: SurveyProgress[],
  completedSurveys: SurveyResponse[],
): AbandonedSurveyRow[] {
  const completedDedupeKeys = new Set(completedSurveys.map((survey) => survey.dedupeKey));

  return progress
    .filter((entry) => !completedDedupeKeys.has(entry.dedupeKey))
    .map((entry) => {
      const { rows, answeredCount } = formatAbandonedAnswers(entry.answers);
      return {
        id: entry.dedupeKey,
        ts: entry.ts,
        trigger: entry.trigger,
        productSlug: entry.productSlug,
        device: entry.device,
        utmCampaign: entry.utmCampaign,
        answeredCount,
        answers: rows,
      };
    })
    .sort((a, b) => b.ts.localeCompare(a.ts));
}

function interviewRows(consents: InterviewConsent[], surveys: SurveyResponse[]): MaskedInterview[] {
  const surveyById = new Map(surveys.map((survey) => [survey.id, survey]));
  return consents
    .map((consent) => {
      const survey = surveyById.get(consent.surveyId);
      return {
        id: consent.id,
        ts: consent.ts,
        surveyId: consent.surveyId,
        name: consent.name ? `${consent.name.slice(0, 1)}${"•".repeat(Math.max(1, consent.name.length - 1))}` : "익명",
        contactType: consent.contactType,
        maskedContact: maskedContact(consent.contact, consent.contactType),
        productSlug: survey?.productSlug,
        utmCampaign: survey?.utmCampaign,
      };
    })
    .sort((a, b) => b.ts.localeCompare(a.ts));
}

/** 원시 이벤트를 기획서 6장의 지표 체계로 변환한다. */
export function calculateDashboardStats(
  events: TrackedEvent[],
  surveys: SurveyResponse[],
  consents: InterviewConsent[],
  progress: SurveyProgress[] = [],
): DashboardStats {
  const detailSessions = uniqueSessions(events, "product_view");
  const buySessions = uniqueSessions(events, "buy_click");
  // browse_3은 보조 탐색 경로다. 여기의 1차 퍼널에는 구매 버튼을 눌러
  // 페이크도어를 본 뒤 완료한 설문만 포함한다.
  const buyerPathSurveys = surveys.filter((survey) => survey.trigger === "buy_click");
  const buyerSurveyIds = new Set(buyerPathSurveys.map((survey) => survey.id));
  const buyerSurveySessions = new Set(buyerPathSurveys.map((survey) => survey.sessionId));
  const buyerPathConsents = consents.filter((consent) => buyerSurveyIds.has(consent.surveyId));
  const buyerConsentSessions = new Set(buyerPathConsents.map((consent) => consent.sessionId));
  const experiencedBuyerSurveys = buyerPathSurveys.filter(
    (survey) => survey.purchaseExperience && survey.purchaseExperience !== NO_PURCHASE_EXPERIENCE,
  );
  const experiencedBuyerSessions = new Set(experiencedBuyerSurveys.map((survey) => survey.sessionId));
  const experiencedBuyerSessionsWithConsent = new Set(
    buyerPathConsents
      .filter((consent) => experiencedBuyerSessions.has(consent.sessionId))
      .map((consent) => consent.sessionId),
  );

  const primaryKpis: MetricValue[] = [
    { label: "상세 대비 구매 버튼 클릭률", value: percent(buySessions.size, detailSessions.size), denominator: detailSessions.size, description: "구매 버튼 클릭은 구매 의도 신호입니다." },
    { label: "구매 클릭자 중 설문 완료율", value: percent(buyerSurveySessions.size, buySessions.size), denominator: buySessions.size, description: "구매 버튼 경로 설문 완료만 포함한 진술 데이터입니다." },
    { label: "설문 완료자 중 온라인 구매 경험", value: percent(experiencedBuyerSessions.size, buyerSurveySessions.size), denominator: buyerSurveySessions.size, description: "구매 버튼 경로 응답자가 말한 과거 경험 비율입니다." },
    { label: "실구매 경험자 중 인터뷰 동의율", value: percent(experiencedBuyerSessionsWithConsent.size, experiencedBuyerSessions.size), denominator: experiencedBuyerSessions.size, description: "구매 버튼 경로의 동의이며 실제 구매가 아닙니다." },
  ];

  const funnel: FunnelStep[] = [
    { label: "상세 도달", value: detailSessions.size },
    { label: "구매 클릭", value: buySessions.size, previousValue: detailSessions.size },
    { label: "설문 완료", value: buyerSurveySessions.size, previousValue: buySessions.size },
    { label: "인터뷰 동의", value: buyerConsentSessions.size, previousValue: buyerSurveySessions.size },
  ];

  const secondaryMetrics: MetricValue[] = [
    { label: "생산자 이야기 클릭률", value: percent(uniqueSessions(events, "creator_story_click").size, detailSessions.size), denominator: detailSessions.size, description: "생산자 정보에 대한 관심 신호" },
    { label: "지역 정보 클릭률", value: percent(uniqueSessions(events, "region_info_click").size, detailSessions.size), denominator: detailSessions.size, description: "생산지역 정보에 대한 관심 신호" },
    { label: "방문 정보 요청률", value: percent(uniqueSessions(events, "visit_info_click").size, detailSessions.size), denominator: detailSessions.size, description: "지역 방문 관심 신호" },
  ];

  return {
    generatedAt: new Date().toISOString(),
    primaryKpis,
    funnel,
    secondaryMetrics,
    productFunnels: productFunnels(events, buyerPathSurveys, buyerPathConsents),
    campaigns: campaignMetrics(events),
    surveySummaries: createSurveySummaries(surveys),
    surveyResponses: [...surveys].sort((a, b) => b.ts.localeCompare(a.ts)),
    interviews: interviewRows(consents, surveys),
    abandonedSurveys: abandonedSurveyRows(progress, surveys),
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [events, surveys, consents, progress] = await Promise.all([
    storage.readEvents(),
    storage.readSurveys(),
    storage.readConsents(),
    storage.readProgress(),
  ]);
  return calculateDashboardStats(events, surveys, consents, progress);
}
