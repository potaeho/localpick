"use client";

import { useMemo, useState } from "react";

import { PRIVACY_CONTACT, getPrivacyNotice } from "@/lib/consent";
import { getDevice } from "@/lib/events";
import type { ConsentPurpose } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * 인터뷰·추첨 연락처 수집 — 설문과 분리된 별도 화면.
 *
 * 인터뷰 참여 의사를 밝힌 응답자에게만 보여준다. 실제 인터뷰 참여자가 상품
 * 추첨 대상이므로 인터뷰 일정 안내와 추첨 결과 안내 목적을 함께 동의받는다.
 *
 * 기획서 5단계에 따라 수집 목적·항목·보유기간·거부 권리·문의 및 삭제 요청
 * 방법·파기 시점 여섯 가지를 모두 화면에 띄운 뒤 동의를 받는다. 동의 체크가
 * 없으면 제출 버튼이 열리지 않는다.
 */
export function ConsentForm({
  surveyId,
  productSlug,
  onDone,
  onSkip,
}: {
  surveyId: string;
  /** 상품별 퍼널에서 인터뷰 동의를 집계하려면 어느 상품에서 왔는지 알아야 한다 */
  productSlug?: string;
  onDone: () => void;
  onSkip: () => void;
}) {
  const purposes: ConsentPurpose[] = useMemo(
    () => ["interview", "raffle"],
    [],
  );
  const notice = useMemo(() => getPrivacyNotice(purposes), [purposes]);
  const purposeLabel = "인터뷰 일정 안내 및 상품 추첨 결과 안내";

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState<"email" | "phone">("email");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const consentAvailable = Boolean(PRIVACY_CONTACT);

  async function submit() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/survey/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId,
          name,
          contact,
          contactType,
          productSlug,
          purposes,
          device: getDevice(),
          agreed: true,
        }),
      });

      if (!response.ok) throw new Error("save failed");
      onDone();
    } catch {
      setError("저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="border-b border-lp-gray-100 px-6 pb-4 pt-6">
        <h2 id="survey-title" className="text-lp-heading text-lp-ink">
          인터뷰 참여 연락처를 남겨주세요
        </h2>
        <p className="mt-1 text-sm text-lp-gray-700">
          연락처는 인터뷰 일정 안내와 상품 추첨 결과 안내에만 사용하며,
          설문 답변과 따로 보관합니다.
        </p>
      </div>

      <div className="space-y-5 px-6 py-6">
        {!consentAvailable && (
          <p role="alert" className="rounded-lp-control bg-lp-gray-100 p-3 text-sm text-lp-gray-900">
            공개 문의 채널이 설정되기 전까지 연락처를 받을 수 없습니다.
          </p>
        )}
        <div>
          <label
            htmlFor="consent-name"
            className="block text-sm font-medium text-lp-ink"
          >
            어떻게 불러드리면 될까요
          </label>
          <Input
            id="consent-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="예: 김OO"
            className="mt-lp-sm h-12 rounded-lp-control border-lp-gray-300 px-lp-md text-sm focus-visible:border-lp-green"
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-lp-ink">
            연락 방법
          </span>
          <div className="mt-lp-sm flex gap-lp-sm">
            {(
              [
                { type: "email", label: "이메일" },
                { type: "phone", label: "휴대전화" },
              ] as const
            ).map((option) => (
              <Button
                key={option.type}
                type="button"
                variant="outline"
                onClick={() => setContactType(option.type)}
                aria-pressed={contactType === option.type}
                className={`h-10 flex-1 rounded-lp-control text-sm font-medium ${
                  contactType === option.type
                    ? "border-lp-green bg-lp-green-light text-lp-green hover:bg-lp-green-light"
                    : "border-lp-gray-300 text-lp-gray-700"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <label htmlFor="consent-contact" className="sr-only">
            {contactType === "email" ? "이메일 주소" : "휴대전화번호"}
          </label>
          <Input
            id="consent-contact"
            type={contactType === "email" ? "email" : "tel"}
            inputMode={contactType === "email" ? "email" : "tel"}
            autoComplete={contactType === "email" ? "email" : "tel"}
            required
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder={
              contactType === "email" ? "name@example.com" : "010-0000-0000"
            }
            className="mt-lp-sm h-12 rounded-lp-control border-lp-gray-300 px-lp-md text-sm focus-visible:border-lp-green"
          />
        </div>

        <div className="rounded-lp-control bg-lp-gray-100 p-lp-lg">
          <h3 className="text-sm font-bold text-lp-ink">
            개인정보 수집 · 이용 안내
          </h3>
          <dl className="mt-lp-md space-y-2.5">
            {notice.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-medium text-lp-gray-500">
                  {item.label}
                </dt>
                <dd className="mt-0.5 text-xs leading-relaxed text-lp-gray-900">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <label className="flex cursor-pointer items-start gap-lp-md text-sm text-lp-gray-900">
          <Checkbox
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="mt-0.5 shrink-0 data-checked:border-lp-green data-checked:bg-lp-green"
          />
          위 내용을 확인했고, {purposeLabel}를 위한 개인정보 수집·이용에
          동의합니다.
        </label>
      </div>

      {error && (
        <p role="alert" className="px-6 pb-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 flex flex-col gap-lp-sm border-t border-lp-gray-100 bg-white px-6 py-4">
        <Button
          type="button"
          disabled={!consentAvailable || !agreed || !contact.trim() || submitting}
          onClick={() => void submit()}
          className="h-12 rounded-lp-control text-lp-button disabled:bg-lp-gray-300"
        >
          {submitting ? "저장하는 중…" : "연락처 남기기"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onSkip}
          className="h-11 rounded-lp-control text-sm font-medium text-lp-gray-700"
        >
          지금은 건너뛰기
        </Button>
      </div>
    </div>
  );
}
