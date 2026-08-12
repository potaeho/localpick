import type { ConsentPurpose } from "./types";

/**
 * 인터뷰·추첨 연락처 수집 고지문.
 *
 * 기획서 5단계가 요구하는 6개 항목을 한 곳에서 관리한다. 화면과 저장 기록이
 * 같은 문구를 참조해야, 나중에 "이 응답자는 어떤 고지를 받고 동의했는가"를
 * 되짚을 수 있다. 문구를 고치면 반드시 버전도 함께 올릴 것.
 */
export const PRIVACY_NOTICE_VERSION = "2026-08-13";

/**
 * A public deletion-request channel must be configured before collecting an
 * interview contact. Do not substitute a plausible-looking address here.
 */
export const PRIVACY_CONTACT =
  process.env.NEXT_PUBLIC_PRIVACY_CONTACT?.trim() || null;

const CONTACT_REQUEST_NOTICE = PRIVACY_CONTACT
  ? `${PRIVACY_CONTACT}로 문의 또는 삭제를 요청하시면 지체 없이 처리하고 결과를 알려드립니다.`
  : "공개 문의 채널이 아직 설정되지 않아, 현재는 연락처를 수집하지 않습니다.";

/**
 * 목적(인터뷰 / 추첨)에 따라 수집 목적·보유기간 문구가 달라지므로 고정 배열이
 * 아니라 함수로 둔다. 두 목적을 함께 동의받는 경우 두 문구를 한 줄에 같이
 * 보여준다.
 */
export function getPrivacyNotice(
  purposes: ConsentPurpose[],
): { label: string; value: string }[] {
  const wantsInterview = purposes.includes("interview");
  const wantsRaffle = purposes.includes("raffle");

  const purposeParts: string[] = [];
  if (wantsInterview) {
    purposeParts.push("로컬 상품 구매 경험에 관한 후속 인터뷰 참여 요청 및 일정 안내");
  }
  if (wantsRaffle) {
    purposeParts.push("추첨 경품 당첨 여부 안내 및 배송");
  }

  const retentionParts: string[] = [];
  if (wantsInterview) {
    retentionParts.push(
      "인터뷰 목적: 수집일로부터 6개월 이내, 또는 인터뷰가 모두 종료되는 시점 중 먼저 도래하는 때까지",
    );
  }
  if (wantsRaffle) {
    retentionParts.push(
      "추첨 목적: 추첨 결과 안내 및 경품 발송이 끝난 뒤 1개월 이내",
    );
  }

  return [
    {
      label: "수집 목적",
      value: purposeParts.join(" · "),
    },
    {
      label: "수집 항목",
      value: "이름(또는 호칭), 연락처(이메일 또는 휴대전화번호 중 택 1)",
    },
    {
      label: "보유 · 이용기간",
      value: retentionParts.join(" / "),
    },
    {
      label: "동의 거부 권리",
      value:
        "동의를 거부하실 수 있으며, 거부하셔도 설문 참여에는 아무런 불이익이 없습니다. 이미 하신 동의도 언제든 철회하실 수 있습니다.",
    },
    {
      label: "문의 · 삭제 요청",
      value: CONTACT_REQUEST_NOTICE,
    },
    {
      label: "파기 시점",
      value:
        "위 보유기간 만료 즉시 복구할 수 없는 방법으로 파기합니다. 수집한 연락처는 광고 타기팅이나 상품 판매 목적으로 사용하지 않습니다.",
    },
  ];
}
