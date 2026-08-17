import type { SurveyAnswers, SurveyTrigger } from "./types";

/**
 * 구매 경험과 지역 확인 여부에 따라 달라지는 조건부 설문 문항.
 *
 * 선택지는 특정 답을 유도하지 않도록 중립적으로 쓴다. 이 실험의 목적은
 * 가치 제안을 확인받는 것이 아니라, 소비자가 실제로 무엇을 보고 눌렀는지
 * 알아내는 것이기 때문이다. "생산자 정보를 믿을 만해서"와 "특별한 이유 없이
 * 궁금해서"가 같은 무게로 놓여 있어야 한다.
 *
 * 첫 문항에서 온라인 구매 경험을 확인하고 실제 구매 행동 또는 미구매 장벽을
 * 묻는다. 이후 평소 생산 지역 확인 행동, 지역·생산자 가치, 최소 분류 정보,
 * 인터뷰 참여 의사 순으로 합류한다. 기존 buyReason/useContext 문항 정의는 이미
 * 저장된 응답과 이탈 기록을 읽기 위해서만 유지한다.
 *
 * 주관식 문항(사용 상황)은 일부러 뒤쪽에 둔다. 직접 타이핑해야 하는 문항이라
 * 선택형보다 부담이 큰데, 두 번째 문항으로 일찍 나오면 "여기서 그만할까"
 * 하는 이탈 충동이 커진다는 걸 실제 사용자 피드백으로 확인했다. 뒤쪽에
 * 두면 이미 답한 문항들이 있어 끝까지 마치려는 동기가 더 크게 작용한다.
 */
export type Question =
  | {
      id: keyof SurveyAnswers;
      kind: "single";
      title: string;
      help?: string;
      options: string[];
      /** 이 선택지를 고르면 자유 입력란을 연다 */
      detailWhen?: string;
    }
  | {
      id: keyof SurveyAnswers;
      kind: "multi";
      title: string;
      help?: string;
      options: string[];
    }
  | {
      id: keyof SurveyAnswers;
      kind: "text";
      title: string;
      help?: string;
      placeholder: string;
      optional?: boolean;
    }
  | {
      id: keyof SurveyAnswers;
      kind: "boolean";
      title: string;
      help?: string;
      yes: string;
      no: string;
    };

/** "온라인으로 구매해본 적 없다"에 해당하는 값 — 실구매 경험자 비율 집계에 쓰인다 */
export const NO_PURCHASE_EXPERIENCE = "온라인으로 구매해본 적 없다";

const BASE_QUESTIONS: Question[] = [
  {
    id: "buyReason",
    kind: "single",
    title: "구매 버튼을 누른 가장 큰 이유는 무엇인가요?",
    options: [
      "상품 자체가 마음에 들어서",
      "가격이 적당해 보여서",
      "어디서 났는지(원산지)가 분명해서",
      "누가 어떻게 만들었는지 알 수 있어서",
      "평소에 찾던 상품이라서",
      "특별한 이유 없이 궁금해서",
      "기타",
    ],
    detailWhen: "기타",
  },
  {
    id: "regionInterest",
    kind: "single",
    title: "상품을 통해 생산 지역에 관심이 생길 수 있다고 생각하나요?",
    options: [
      "매우 그렇다",
      "그런 편이다",
      "보통이다",
      "그렇지 않은 편이다",
      "전혀 그렇지 않다",
    ],
  },
  {
    id: "purchaseExperience",
    kind: "single",
    title: "온라인에서 지역 특산물이나 지역 가공식품을 구매해본 적이 있나요?",
    options: [
      "최근 3개월 안에 구매했다",
      "3개월 초과~6개월 안에 구매했다",
      "6개월 초과~1년 안에 구매했다",
      "1년보다 오래전에 구매했다",
      NO_PURCHASE_EXPERIENCE,
    ],
  },
  {
    id: "channels",
    kind: "multi",
    title: "어디에서 구매해보셨나요?",
    help: "여러 개 고르실 수 있습니다.",
    options: [
      "쿠팡",
      "네이버 스마트스토어",
      "마켓컬리",
      "지역 농협이나 직거래 장터",
      "생산자의 개인 채널 (인스타그램 등)",
      "백화점·대형마트 온라인몰",
      "기타 온라인몰",
    ],
  },
  {
    id: "trustFactors",
    kind: "multi",
    title: "구매할 때 어떤 정보를 중요하게 확인하시나요?",
    help: "여러 개 고르실 수 있습니다.",
    options: [
      "원산지 표시",
      "생산자 정보와 이야기",
      "생산·가공 과정 설명",
      "다른 사람의 후기",
      "인증 마크",
      "가격",
      "판매처의 인지도",
      "상품 사진",
    ],
  },
  {
    id: "useContext",
    kind: "text",
    title: "어떤 상황에 쓰려고 하셨나요?",
    help: "짧게 적어주셔도 좋습니다.",
    placeholder: "예: 주말에 가족과 먹으려고",
    optional: true,
  },
  {
    id: "interviewWilling",
    kind: "boolean",
    title: "LOCAL PICK을 개선하기 위한 인터뷰에 참여해주실 수 있나요?",
    help: "인터뷰는 약 20~30분 진행됩니다. 인터뷰에 실제 참여한 분을 대상으로 상품을 추첨해 드립니다.",
    yes: "참여할 수 있어요",
    no: "지금은 참여하기 어려워요",
  },
];

const CONDITIONAL_QUESTIONS: Question[] = [
  {
    id: "productCategories",
    kind: "multi",
    title: "어떤 종류의 상품을 구매해보셨나요?",
    help: "여러 개 고르실 수 있습니다.",
    options: ["농산물", "수산물", "축산물", "반찬·가공식품", "간식·디저트", "차·음료", "선물세트", "기타"],
  },
  {
    id: "purchaseFrequency",
    kind: "single",
    title: "온라인 지역 상품을 얼마나 자주 구매하시나요?",
    options: ["한 달에 2회 이상", "한 달에 1회 정도", "2~3개월에 1회", "반년에 1회 정도", "1년에 1회 이하"],
  },
  {
    id: "typicalSpend",
    kind: "single",
    title: "한 번 구매할 때 보통 얼마 정도 사용하시나요?",
    options: ["2만원 미만", "2만~4만원 미만", "4만~7만원 미만", "7만~10만원 미만", "10만원 이상"],
  },
  {
    id: "purchasePurposes",
    kind: "multi",
    title: "주로 어떤 목적으로 구매하시나요?",
    help: "여러 개 고르실 수 있습니다.",
    options: ["나 또는 가족이 먹기 위해", "선물하기 위해", "여행 후 다시 구매하기 위해", "제철 음식을 즐기기 위해", "특정 지역이나 생산자를 응원하기 위해", "새로운 상품을 경험하기 위해", "기타"],
  },
  {
    id: "purchaseProblems",
    kind: "multi",
    title: "구매하면서 불편하거나 실망했던 점은 무엇인가요?",
    help: "여러 개 고르실 수 있습니다.",
    options: ["사진과 실제 상품이 달랐다", "품질이 기대에 미치지 못했다", "가격이 비쌌다", "배송비가 부담됐다", "배송이 느리거나 상품이 손상됐다", "원산지·생산자 정보가 부족했다", "재구매할 곳을 찾기 어려웠다", "특별히 불편한 점이 없었다", "기타"],
  },
  {
    id: "purchaseBarriers",
    kind: "multi",
    title: "온라인으로 구매하지 않은 이유는 무엇인가요?",
    help: "가까운 이유를 모두 골라주세요.",
    options: ["품질을 직접 확인하기 어려워서", "원산지나 생산자 정보를 믿기 어려워서", "배송비가 부담스러워서", "가격이 적절한지 판단하기 어려워서", "후기나 정보가 부족해서", "오프라인 구매가 더 익숙해서", "살 기회나 필요가 없어서", "기타"],
  },
  {
    id: "offlineChannels",
    kind: "multi",
    title: "특산품이 필요할 때는 주로 어디에서 구매하시나요?",
    help: "여러 개 고르실 수 있습니다.",
    options: ["여행지나 지역 매장", "전통시장", "대형마트·백화점", "지역 축제·박람회", "지인에게 받는다", "특산품을 거의 구매하지 않는다", "기타"],
  },
  {
    id: "purchaseConditions",
    kind: "multi",
    title: "어떤 조건이 갖춰지면 온라인으로 구매할 것 같나요?",
    help: "여러 개 고르실 수 있습니다.",
    options: ["충분한 상품 사진", "구체적인 원산지 정보", "생산자와 생산 과정 정보", "믿을 만한 구매 후기", "교환·환불 보장", "합리적인 가격", "무료 또는 저렴한 배송", "잘 알려진 판매처", "기타"],
  },
  {
    id: "prospectiveChannels",
    kind: "multi",
    title: "구매한다면 어느 판매처를 먼저 살펴볼 것 같나요?",
    help: "여러 개 고르실 수 있습니다.",
    options: ["쿠팡", "네이버 스마트스토어", "마켓컬리", "지역 농협이나 직거래 장터", "생산자의 개인 채널", "백화점·대형마트 온라인몰", "아직 모르겠다"],
  },
  {
    id: "purchaseConcerns",
    kind: "multi",
    title: "온라인 구매에서 가장 걱정되는 점은 무엇인가요?",
    help: "여러 개 고르실 수 있습니다.",
    options: ["신선도와 품질", "원산지·생산자 신뢰", "가격", "배송비", "배송 중 파손·변질", "교환·환불", "상품 정보 부족", "기타"],
  },
  {
    id: "regionAttention",
    kind: "single",
    title: "식품이나 특산품을 구매할 때, 어느 지역에서 생산하거나 만든 상품인지도 확인하시나요?",
    help: "국산인지 여부가 아니라 구체적인 생산 지역을 확인하는지 묻는 질문입니다.",
    options: ["항상 확인한다", "자주 확인한다", "가끔 확인한다", "거의 확인하지 않는다", "전혀 확인하지 않는다"],
  },
  {
    id: "regionReasons",
    kind: "multi",
    title: "상품이 만들어진 지역을 확인하는 이유는 무엇인가요?",
    help: "여러 개 고르실 수 있습니다.",
    options: ["품질이나 맛을 판단하기 위해", "안전성과 신뢰를 확인하기 위해", "특정 지역의 상품을 선호해서", "여행했던 지역의 상품을 다시 구매하기 위해", "지역 생산자나 지역경제를 응원하기 위해", "선물할 때 지역의 특색이 중요해서", "기타"],
  },
  {
    id: "regionNonReasons",
    kind: "multi",
    title: "상품이 만들어진 지역을 크게 확인하지 않는 이유는 무엇인가요?",
    help: "여러 개 고르실 수 있습니다.",
    options: ["가격을 더 중요하게 봐서", "상품 후기나 평점을 더 중요하게 봐서", "판매처의 신뢰도를 더 중요하게 봐서", "지역에 따른 차이를 잘 모르겠어서", "지역 정보가 구매에 필요하지 않아서", "지역 정보가 눈에 잘 보이지 않아서", "기타"],
  },
  { id: "producerStoryHelp", kind: "single", title: "생산자 정보와 이야기가 구매 판단에 도움이 되나요?", options: ["매우 도움이 된다", "어느 정도 도움이 된다", "보통이다", "별로 도움이 되지 않는다", "전혀 도움이 되지 않는다"] },
  { id: "processInfoTrust", kind: "single", title: "생산·가공 과정 설명이 있으면 상품을 더 신뢰하게 되나요?", options: ["매우 그렇다", "그런 편이다", "보통이다", "그렇지 않은 편이다", "전혀 그렇지 않다"] },
  { id: "travelInfoInterest", kind: "single", title: "상품 구매 후 관련 지역의 여행 정보가 제공되면 보고 싶나요?", options: ["꼭 보고 싶다", "관심이 있다", "보통이다", "별로 관심 없다", "전혀 관심 없다"] },
  { id: "regionalImpactInfluence", kind: "single", title: "지역 상품 구매가 지역에 어떻게 도움이 되는지 알려주면 구매 결정에 영향을 줄까요?", options: ["매우 영향을 준다", "어느 정도 영향을 준다", "보통이다", "별로 영향을 주지 않는다", "전혀 영향을 주지 않는다"] },
  { id: "preferredStoryFocus", kind: "single", title: "어떤 내용을 중심으로 상품을 소개받고 싶나요?", options: ["상품의 특징과 품질", "생산자 이야기", "생산·가공 과정", "생산 지역 이야기", "가격과 혜택"] },
  { id: "ageGroup", kind: "single", title: "연령대를 알려주세요.", options: ["10대", "20대", "30대", "40대", "50대", "60대 이상", "응답하고 싶지 않음"] },
  { id: "gender", kind: "single", title: "성별을 알려주세요.", options: ["여성", "남성", "기타", "응답하고 싶지 않음"] },
];

export const QUESTIONS: Question[] = [
  ...BASE_QUESTIONS,
  ...CONDITIONAL_QUESTIONS,
];

export const REGION_ATTENTION_LOW = ["거의 확인하지 않는다", "전혀 확인하지 않는다"];

/** 모든 유입 경로가 같은 질문 값 체계를 사용하므로 검증 목록은 동일하다. */
export function questionsForTrigger(trigger: SurveyTrigger): Question[] {
  void trigger;
  return QUESTIONS;
}

/** 앞선 답변에 따라 현재 응답자에게 필요한 문항만 순서대로 돌려준다. */
export function questionsForAnswers(
  trigger: SurveyTrigger,
  answers: Partial<SurveyAnswers>,
): Question[] {
  const all = questionsForTrigger(trigger);
  const byId = new Map(all.map((question) => [question.id, question]));
  const pick = (id: keyof SurveyAnswers): Question => {
    const question = byId.get(id);
    if (!question) throw new Error(`Missing survey question: ${id}`);
    return question;
  };

  const hasAnsweredExperience = typeof answers.purchaseExperience === "string";
  const hasExperience =
    hasAnsweredExperience &&
    answers.purchaseExperience !== NO_PURCHASE_EXPERIENCE;
  const hasAnsweredRegion = typeof answers.regionAttention === "string";
  const hasLowRegionAttention =
    hasAnsweredRegion && REGION_ATTENTION_LOW.includes(answers.regionAttention ?? "");

  const buyerIds: (keyof SurveyAnswers)[] = [
    "channels",
    "productCategories",
    "purchaseFrequency",
    "typicalSpend",
    "purchasePurposes",
    "trustFactors",
    "purchaseProblems",
  ];
  const nonBuyerIds: (keyof SurveyAnswers)[] = [
    "purchaseBarriers",
    "offlineChannels",
    "purchaseConditions",
    "prospectiveChannels",
    "purchaseConcerns",
  ];
  const commonIds: (keyof SurveyAnswers)[] = [
    "producerStoryHelp",
    "processInfoTrust",
    "regionInterest",
    "travelInfoInterest",
    "regionalImpactInfluence",
    "preferredStoryFocus",
    "ageGroup",
    "gender",
    "interviewWilling",
  ];

  return [
    pick("purchaseExperience"),
    ...(hasAnsweredExperience ? (hasExperience ? buyerIds : nonBuyerIds).map(pick) : []),
    pick("regionAttention"),
    ...(hasAnsweredRegion
      ? [pick(hasLowRegionAttention ? "regionNonReasons" : "regionReasons")]
      : []),
    ...commonIds.map(pick),
  ];
}
