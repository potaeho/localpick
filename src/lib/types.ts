/**
 * LOCAL PICK 페이크도어 테스트의 공용 데이터 계약.
 *
 * Product 스키마가 상품 상세 페이지 템플릿을 강제한다. 모든 상품이 동일한
 * 정보 항목을 갖게 되므로, 기획서 5장이 요구하는 "상품 간 조건 통제"가
 * 데이터 구조 수준에서 보장된다.
 */

export type Region = {
  id: string;
  name: string;
  province: string;
  /** 지역 소개 — 상품 관심이 지역 관심으로 이어지는지 확인하기 위한 콘텐츠 */
  description: string;
  /** 방문 정보 — 팀 비전(지역 방문)과 직접 연결되는 섹션 */
  visitInfo: string[];
};

export type Creator = {
  id: string;
  /**
   * 개인 생산자냐 지역 브랜드냐. 실제 상품이 개인 이름 대신 지역 브랜드
   * ("전북 순창")로만 표기되는 경우 "brand"로 둔다. 화면 문구가 "만든 사람"/
   * "…님이 만든 상품" 같은 개인 전제 표현을 피하도록 분기한다. 기본은 person.
   */
  kind?: "person" | "brand";
  name: string;
  /** 생산자 직함 (예: 흑미 농부) 또는 브랜드 분류 (예: 전통 장류) */
  title: string;
  regionId: string;
  /** 개인의 시작 연도. 지역 브랜드처럼 특정 연도가 없으면 생략한다. */
  since?: string;
  /** 생산자 이야기 — 신뢰 가설 검증용 콘텐츠 */
  story: string;
  philosophy: string;
};

/**
 * 상품 분류. 소비자가 스토어를 훑는 1차 축이다.
 *
 * 지역은 이 실험의 가설(생산지 신뢰·지역 방문)과 직결되지만, 소비자가 장을 볼
 * 때 먼저 찾는 것은 "무엇을 살까"이지 "어느 지역 것을 살까"가 아니다. 그래서
 * 카테고리를 앞세우고 지역은 상품 안에서 드러낸다.
 */
export type Category = {
  id: string;
  name: string;
  /** 카테고리 소개 한 줄 */
  description: string;
};

/** 상품 일러스트 종류 — 실물 사진 대신 그리는 그림의 형태를 고른다 */
export type ProductImageKind =
  | "jar"
  | "bottle"
  | "pouch"
  | "grain"
  | "kelp"
  | "citrus"
  | "persimmon"
  | "bread"
  | "tea"
  | "mealkit"
  | "honey"
  | "greens"
  | "garlic";

export type Product = {
  slug: string;
  name: string;
  /** 한 줄 설명 */
  tagline: string;
  categoryId: string;
  imageKind: ProductImageKind;
  /**
   * 스펙 테이블 아래 들어가는 이미지형 상세 설명 (브랜드 스토리, 제품 포인트 등을
   * 담은 세로로 긴 포스터 이미지들). 네이버 스마트스토어 상세페이지의 "상품정보
   * 표 아래 이어지는 이미지 설명" 구간을 재현한다. `public/product-details/
   * <slug>/`에 둔 파일의 경로 목록이며, 순서대로 위에서 아래로 쌓인다. 아직
   * 이미지가 없는 상품은 생략하면 기존 상품 일러스트가 대표 이미지로 표시되고
   * 상세 이미지 구간은 렌더링되지 않는다.
   */
  detailImages?: string[];
  /**
   * 카드·상세 상단에 쓰는 정사각 대표 사진. detailImages의 포스터 전체를 그대로
   * 정사각형으로 가운데 크롭하면 상품마다 잘리는 위치가 달라 카드 목록이
   * 들쭉날쭉해 보인다 — 그래서 포스터에서 문구 없는 상품 클로즈업 구간만 따로
   * 잘라 `public/product-cards/<slug>.jpg`에 동일 규격(480x480)으로 둔다.
   * 생략하면 detailImages[0]을 그대로 쓰고, 그마저 없으면 일러스트를 쓴다.
   */
  cardImage?: string;
  regionId: string;
  creatorId: string;
  /** 원산지 — 신뢰 가설의 핵심 필드 */
  origin: string;

  /** 정가 */
  priceList: number;
  /** 판매가 */
  priceSale: number;
  shippingFee: number;
  /** 이 금액 이상 구매 시 무료배송 */
  freeShippingOver: number;

  deliveryMethod: string;
  deliveryEta: string;

  seller: string;
  packaging: string;
  /** 판매단위 */
  unit: string;
  /** 중량·용량 */
  weight: string;
  /** 소비기한 */
  expiry: string;

  /** 생산·가공 방식 */
  process: string[];
  /** 안내사항 */
  notes: string;
  refundPolicy: string;

  badges: string[];
};

/* ------------------------------------------------------------------ */
/* 행동 이벤트                                                          */
/* ------------------------------------------------------------------ */

/**
 * 기획서 6장의 지표 체계에 대응하는 이벤트 목록.
 *
 * 해석 원칙(대시보드에도 표기):
 * - 광고 클릭은 관심 신호
 * - buy_click은 구매 의도 신호 — 이 실험의 핵심 지표
 * - 설문 응답은 진술 데이터
 * - 실제 결제만이 구매 행동 (이 실험에서는 측정하지 않음)
 */
export const EVENT_TYPES = [
  "product_view",
  "buy_click",
  "fakedoor_shown",
  "survey_start",
  "survey_complete",
  "interview_consent",
  "creator_story_click",
  "region_info_click",
  "visit_info_click",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

/** 설문이 열린 경로 */
export type SurveyTrigger = "buy_click" | "browse_3";

export type DeviceType = "mobile" | "desktop";

export type UtmParams = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
};

export type TrackedEvent = UtmParams & {
  id: string;
  /** session/type/context로 만든 서버측 멱등 키. 저장소의 unique 제약과 연결된다. */
  dedupeKey: string;
  type: EventType;
  /** 익명 세션 ID (proxy.ts가 httpOnly 쿠키로 발급) */
  sessionId: string;
  /** ISO 8601 */
  ts: string;
  productSlug?: string;
  regionId?: string;
  creatorId?: string;
  device: DeviceType;
  trigger?: SurveyTrigger;
};

/** 클라이언트가 /api/events로 보내는 페이로드. sessionId와 ts는 서버가 채운다. */
export type EventInput = UtmParams & {
  type: EventType;
  productSlug?: string;
  regionId?: string;
  creatorId?: string;
  device: DeviceType;
  trigger?: SurveyTrigger;
};

/* ------------------------------------------------------------------ */
/* 설문 — 기획서 5단계 7문항                                            */
/* ------------------------------------------------------------------ */

export type SurveyAnswers = {
  /** 1. 이 상품의 구매 버튼을 누른 가장 큰 이유 */
  buyReason: string;
  buyReasonDetail?: string;
  /** 2. 구매를 기대한 사용 상황 */
  useContext: string;
  /** 3. 최근 온라인 로컬 상품 구매 경험 */
  purchaseExperience: string;
  /** 4. 주로 이용하는 구매처 (복수 선택) */
  channels: string[];
  /** 5. 구매할 때 중요하게 확인하는 정보 (복수 선택) */
  trustFactors: string[];
  /** 6. 해당 생산지역 또는 생산자에 대한 관심 */
  regionInterest: string;
  /** 7. 후속 인터뷰 참여 의사 */
  interviewWilling: boolean;
};

export type SurveyResponse = UtmParams &
  SurveyAnswers & {
    id: string;
    dedupeKey: string;
    sessionId: string;
    ts: string;
    productSlug?: string;
    trigger: SurveyTrigger;
    device: DeviceType;
  };

/**
 * 설문 도중 이탈해도 그때까지 고른 답변을 잃지 않기 위한 스냅샷.
 *
 * 완료된 설문(`SurveyResponse`)과 별도 테이블에 저장한다. 같은 테이블에
 * 섞으면 "구매 이유" 같은 선택형 집계가 미완성 응답까지 세게 되어 왜곡된다.
 * 완료 시 이 스냅샷은 삭제되므로, 남아있는 것은 전부 이탈한 시도다.
 */
export type SurveyProgress = UtmParams & {
  /** session/trigger/product로 만든 키 — 같은 시도를 계속 upsert한다 */
  dedupeKey: string;
  sessionId: string;
  /** 마지막 저장 시각 (ISO 8601) */
  ts: string;
  trigger: SurveyTrigger;
  productSlug?: string;
  device: DeviceType;
  /** 그 순간까지 고른 값 그대로 — 완결성 검증을 하지 않는다 */
  answers: Partial<SurveyAnswers>;
  /** 마지막으로 답한 문항 — 어디서 멈췄는지 보여준다 */
  lastQuestionId?: keyof SurveyAnswers;
};

/**
 * 이 연락처를 수집한 목적. 인터뷰 참여 의사와 무관하게 추첨 참여만을 위해
 * 남기는 경우가 있으므로, 인터뷰 동의 여부를 나타내는 지표(KPI)가 추첨만
 * 신청한 사람까지 "인터뷰 동의"로 세지 않도록 이 필드로 구분한다.
 */
export type ConsentPurpose = "interview" | "raffle";

/**
 * 인터뷰·추첨 연락처. 기획서 5단계에 따라 설문 응답과 **분리 저장**하며,
 * 별도 동의를 받은 뒤에만 수집한다.
 */
export type InterviewConsent = {
  id: string;
  dedupeKey: string;
  sessionId: string;
  ts: string;
  /** 연결된 설문 응답 ID */
  surveyId: string;
  name: string;
  contact: string;
  contactType: "email" | "phone";
  /** 이 연락처를 남긴 목적 (인터뷰 / 추첨, 중복 가능) */
  purposes: ConsentPurpose[];
  /** 동의 시점에 표시된 고지 문구의 버전 */
  noticeVersion: string;
};

/* ------------------------------------------------------------------ */
/* 관리자 집계                                                         */
/* ------------------------------------------------------------------ */

export type MetricValue = {
  label: string;
  value: number;
  denominator?: number;
  description: string;
};

export type FunnelStep = {
  label: string;
  value: number;
  previousValue?: number;
};

export type ProductFunnelMetric = {
  productSlug: string;
  detailViews: number;
  buyClicks: number;
  clickThroughRate: number;
  surveyCompletes: number;
  interviewConsents: number;
};

export type CampaignMetric = {
  campaign: string;
  detailViews: number;
  buyClicks: number;
  surveys: number;
  consents: number;
};

export type SurveyQuestionSummary = {
  question: string;
  answers: Array<{ value: string; count: number }>;
};

/** 개인정보는 포함하지 않는 관리자용 인터뷰 목록 항목. */
export type MaskedInterview = {
  id: string;
  ts: string;
  surveyId: string;
  name: string;
  contactType: InterviewConsent["contactType"];
  maskedContact: string;
  purposes: ConsentPurpose[];
  productSlug?: string;
  utmCampaign?: string;
};

/** 이탈 시점까지 답한 문항을 사람이 읽을 수 있게 펼친 것 */
export type AbandonedAnswer = { label: string; value: string };

/** 설문을 끝내지 못하고 나간 시도 — 정량 집계에는 넣지 않고 목록으로만 보여준다 */
export type AbandonedSurveyRow = {
  id: string;
  ts: string;
  trigger: SurveyTrigger;
  productSlug?: string;
  device: DeviceType;
  utmCampaign?: string;
  /** 7문항 중 몇 개까지 답했는지 */
  answeredCount: number;
  answers: AbandonedAnswer[];
};

export type DashboardStats = {
  generatedAt: string;
  primaryKpis: MetricValue[];
  funnel: FunnelStep[];
  secondaryMetrics: MetricValue[];
  productFunnels: ProductFunnelMetric[];
  campaigns: CampaignMetric[];
  surveySummaries: SurveyQuestionSummary[];
  surveyResponses: SurveyResponse[];
  interviews: MaskedInterview[];
  abandonedSurveys: AbandonedSurveyRow[];
};
