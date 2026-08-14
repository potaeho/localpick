import type { SurveyAnswers, SurveyTrigger } from "./types";

/**
 * 기획서 5단계의 7문항.
 *
 * 선택지는 특정 답을 유도하지 않도록 중립적으로 쓴다. 이 실험의 목적은
 * 가치 제안을 확인받는 것이 아니라, 소비자가 실제로 무엇을 보고 눌렀는지
 * 알아내는 것이기 때문이다. "생산자 정보를 믿을 만해서"와 "특별한 이유 없이
 * 궁금해서"가 같은 무게로 놓여 있어야 한다.
 *
 * 순서는 "이 상품" 얘기(구매 이유·관심 방향) → "평소 소비 습관" 얘기(구매
 * 경험·채널·판단 기준) → 주관식(사용 상황) → 인터뷰 참여 요청으로 묶었다.
 * 상품 얘기와 습관 얘기를 오가면 응답자가 매번 화제를 다시 떠올려야 해서
 * 흐름이 끊긴다.
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

export const QUESTIONS: Question[] = [
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
    title: "이 상품을 보고 나서 어떤 마음이 드셨나요?",
    help: "가장 가까운 것 하나만 골라주세요.",
    options: [
      "상품을 만든 지역에 가보고 싶어졌다",
      "만든 사람에 대해 더 알고 싶어졌다",
      "상품에만 관심이 있다",
      "잘 모르겠다",
    ],
  },
  {
    id: "purchaseExperience",
    kind: "single",
    title: "온라인에서 지역 특산물이나 가공품을 사보신 적이 있나요?",
    options: [
      "최근 3개월 안에 구매한 적 있다",
      "6개월에서 1년 사이에 구매한 적 있다",
      "1년보다 더 오래됐다",
      NO_PURCHASE_EXPERIENCE,
    ],
  },
  {
    id: "channels",
    kind: "multi",
    title: "온라인에서 지역 특산물이나 가공품을 살 때 주로 어디를 이용하시나요?",
    help: "여러 개 고르실 수 있습니다.",
    options: [
      "쿠팡",
      "네이버 스마트스토어",
      "마켓컬리",
      "지역 농협이나 직거래 장터",
      "생산자의 개인 채널 (인스타그램 등)",
      "백화점·대형마트 온라인몰",
      "온라인으로 사지 않는다",
    ],
  },
  {
    id: "trustFactors",
    kind: "multi",
    title: "그럴 때 무엇을 보고 판단하시나요?",
    help: "여러 개 고르실 수 있습니다.",
    options: [
      "원산지 표시",
      "생산자 정보와 이야기",
      "생산·가공 과정 설명",
      "다른 사람의 후기",
      "인증 마크 (유기농, 무농약 등)",
      "가격",
      "판매처가 얼마나 알려져 있는지",
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
    title: "짧은 인터뷰에 참여해주실 수 있나요?",
    help: "20~30분 정도 온라인으로 이야기를 나눕니다. 지금 결정하지 않으셔도 됩니다.",
    yes: "참여할 수 있어요",
    no: "아니요, 다음에 할게요",
  },
];

/**
 * `browse_3`(구매 버튼을 누르지 않고 상품 2개를 둘러본) 경로는 아직 구매
 * 의사를 밝히지 않은 상태이므로, "구매 버튼을 누른 이유"를 그대로 물으면
 * 맞지 않는다. 이 트리거에서만 첫 문항의 제목과 선택지를 "더 알아보고 싶었던
 * 이유"에 맞게 바꿔 내보낸다. 나머지 문항은 트리거와 무관하게 동일하다.
 */
export function questionsForTrigger(trigger: SurveyTrigger): Question[] {
  if (trigger !== "browse_3") return QUESTIONS;

  return QUESTIONS.map((question) => {
    if (question.id !== "buyReason") return question;
    return {
      ...question,
      title: "상품을 더 알아보고 싶었던 가장 큰 이유는 무엇인가요?",
      options: [
        "상품 자체가 마음에 들어서",
        "가격이 궁금해서",
        "어디서 났는지(원산지)가 분명해서",
        "누가 어떻게 만들었는지 알 수 있어서",
        "평소에 관심있던 상품이라서",
        "특별한 이유 없이 궁금해서",
        "기타",
      ],
    };
  });
}
