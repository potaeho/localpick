"use client";

import { Modal } from "./Modal";

/**
 * 페이크도어 공개 안내.
 *
 * 구매 버튼을 누른 즉시 나타난다. 기획서 4단계와 9장에 따라 **결제가 일어나기
 * 전에** 실험임을 명확히 알리는 것이 목적이므로, 문구를 임의로 부드럽게
 * 바꾸거나 노출을 지연시키지 않는다.
 */
export function FakeDoorOverlay({
  open,
  onClose,
  onSurvey,
}: {
  open: boolean;
  onClose: () => void;
  /** 설문으로 이어가는 분기. 주어지지 않으면 닫기 버튼만 보여준다. */
  onSurvey?: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="fakedoor-title">
      <div className="p-6 sm:p-8">
        <h2 id="fakedoor-title" className="text-lg font-bold text-lp-ink">
          이 상품은 아직 판매 전입니다
        </h2>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-lp-gray-900">
          <p>
            이 상품은 현재 정식 판매 전 수요를 확인하고 있습니다. 실제 주문과
            결제는 진행되지 않았습니다.
          </p>
          <p>기대하셨을 텐데 바로 구매 경험을 제공하지 못해 죄송합니다.</p>
          <p>
            더 나은 로컬 상품 구매 경험을 만들기 위해 짧은 설문에 참여해 주세요.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row-reverse">
          {onSurvey && (
            <button
              type="button"
              onClick={onSurvey}
              className="h-12 flex-1 rounded-lg bg-lp-green font-bold text-white hover:bg-lp-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
            >
              설문 참여하기 (2분)
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-lg border border-lp-gray-300 font-medium text-lp-gray-700 hover:bg-lp-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
          >
            {onSurvey ? "괜찮아요" : "확인"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
