"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Modal } from "./Modal";
import { ConsentForm } from "./ConsentForm";
import { Button } from "@/components/ui/button";
import { questionsForTrigger, type Question } from "@/lib/survey-questions";
import { getDevice, getUtm, trackOnce } from "@/lib/events";
import type { SurveyAnswers, SurveyTrigger } from "@/lib/types";

type AnswerMap = Partial<Record<keyof SurveyAnswers, unknown>>;

const EMPTY: AnswerMap = { channels: [], trustFactors: [] };
const INITIAL_GAUGE_PERCENT = 6;
const FINAL_ANSWER_GAUGE_PERCENT = 97;
const SAVE_CONFIRMATION_DELAY_MS = 500;

/** 화면 폭에 따라 한 화면에 보여줄 문항 수를 정한다 */
function usePerStep(): number {
  const [perStep, setPerStep] = useState(1);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const apply = () => setPerStep(query.matches ? 2 : 1);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return perStep;
}

/** 뭔가 하나라도 골랐는지 — 초기 빈 상태({channels:[], trustFactors:[]})는 제외 */
function hasAnyAnswer(answers: AnswerMap): boolean {
  return Object.values(answers).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return value !== undefined;
  });
}

function isAnswered(question: Question, answers: AnswerMap): boolean {
  const value = answers[question.id];

  switch (question.kind) {
    case "single":
      if (typeof value !== "string" || !value) return false;
      // '기타'를 골랐으면 자유 입력까지 채워야 다음으로 넘어간다
      if (question.detailWhen && value === question.detailWhen) {
        const detail = answers.buyReasonDetail;
        return typeof detail === "string" && detail.trim().length > 0;
      }
      return true;
    case "multi":
      return Array.isArray(value) && value.length > 0;
    case "text":
      return question.optional
        ? true
        : typeof value === "string" && value.trim().length > 0;
    case "boolean":
      return typeof value === "boolean";
  }
}

/** 선택을 실제로 남긴 문항만 센다. 선택 문항이라도 빈 배열은 완료로 보지 않는다. */
function answeredCount(questions: Question[], answers: AnswerMap): number {
  return questions.filter((question) => {
    const value = answers[question.id];
    if (question.kind === "text") {
      return typeof value === "string" && value.trim().length > 0;
    }
    return isAnswered(question, answers);
  }).length;
}

/**
 * 첫 답변에서 크게 전진하고 뒤로 갈수록 증가 폭이 줄어드는 동기부여 곡선.
 * 마지막 답변만으로는 97%에 머물고 서버 저장이 확인된 뒤에만 100%가 된다.
 */
export function motivationalProgress(completed: number, total: number): number {
  if (total <= 0 || completed <= 0) return INITIAL_GAUGE_PERCENT;
  if (completed >= total) return FINAL_ANSWER_GAUGE_PERCENT;

  const ratio = Math.min(1, completed / total);
  const eased = 1 - (1 - ratio) ** 2.5;
  return Math.round(
    INITIAL_GAUGE_PERCENT +
      (FINAL_ANSWER_GAUGE_PERCENT - INITIAL_GAUGE_PERCENT) * eased,
  );
}

/**
 * 설문 모달.
 *
 * 기획서 5단계의 7문항을 2분 안에 끝낼 수 있도록, 모바일은 한 화면에 한 문항,
 * 데스크탑은 두 문항씩 보여준다. 인터뷰 연락처는 설문이 저장된 뒤 별도 화면에서
 * 따로 받는다.
 */
export function SurveyModal({
  open,
  trigger,
  productSlug,
  onCompleted,
  onClose,
}: {
  open: boolean;
  trigger: SurveyTrigger;
  productSlug?: string;
  onCompleted: () => void;
  onClose: () => void;
}) {
  const perStep = usePerStep();
  const [answers, setAnswers] = useState<AnswerMap>(EMPTY);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"questions" | "consent" | "done">(
    "questions",
  );
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [maxCompletedCount, setMaxCompletedCount] = useState(0);
  const [saveConfirmed, setSaveConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = useMemo(() => questionsForTrigger(trigger), [trigger]);

  const steps = useMemo(() => {
    const grouped: Question[][] = [];
    for (let i = 0; i < questions.length; i += perStep) {
      grouped.push(questions.slice(i, i + perStep));
    }
    return grouped;
  }, [perStep, questions]);

  // StrictMode가 개발 중 effect를 두 번 실행하므로 한 번만 보내도록 막는다.
  const impressionSent = useRef(false);
  useEffect(() => {
    if (!open || impressionSent.current) return;
    impressionSent.current = true;
    void trackOnce(`survey_impression:${trigger}:${productSlug ?? "none"}`, {
      type: "survey_impression",
      productSlug,
      trigger,
    });
  }, [open, productSlug, trigger]);

  const startSent = useRef(false);
  function noteFirstAnswer() {
    if (startSent.current) return;
    startSent.current = true;
    void trackOnce(`survey_start:${trigger}:${productSlug ?? "none"}`, {
      type: "survey_start",
      productSlug,
      trigger,
    });
  }

  // 마지막으로 손댄 문항 — 이탈 시 "어디서 멈췄는지"로 함께 저장한다
  const lastTouchedRef = useRef<keyof SurveyAnswers | undefined>(undefined);

  function setAnswer(id: keyof SurveyAnswers, value: unknown) {
    noteFirstAnswer();
    lastTouchedRef.current = id;
    const next = { ...answers, [id]: value };
    setAnswers(next);
    setMaxCompletedCount((count) =>
      Math.max(count, answeredCount(questions, next)),
    );
  }

  function toggleMulti(id: keyof SurveyAnswers, option: string) {
    noteFirstAnswer();
    lastTouchedRef.current = id;
    const list = Array.isArray(answers[id]) ? (answers[id] as string[]) : [];
    const next = {
      ...answers,
      [id]: list.includes(option)
        ? list.filter((item) => item !== option)
        : [...list, option],
    };
    setAnswers(next);
    setMaxCompletedCount((count) =>
      Math.max(count, answeredCount(questions, next)),
    );
  }

  /**
   * 이탈 시점까지의 답변 스냅샷을 저장한다.
   *
   * 실패해도 삼킨다 — 자동저장 하나 때문에 설문 진행이 막히면 안 된다.
   * `keepalive`는 탭을 닫는 순간에도 요청이 끊기지 않게 한다.
   */
  const saveProgress = useCallback(
    (snapshot: AnswerMap) => {
      if (!hasAnyAnswer(snapshot)) return;
      void fetch("/api/survey/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          ...getUtm(),
          device: getDevice(),
          trigger,
          productSlug,
          answers: snapshot,
          lastQuestionId: lastTouchedRef.current,
        }),
      }).catch(() => undefined);
    },
    [trigger, productSlug],
  );

  // 답을 고를 때마다 잠시 기다렸다가 저장한다 — 매 클릭마다 요청을 보내지
  // 않으면서도, 문항 사이를 오가지 않고 그냥 창을 닫아도 최근 상태가 남는다.
  useEffect(() => {
    if (!open || phase !== "questions") return;
    const timer = setTimeout(() => saveProgress(answers), 700);
    return () => clearTimeout(timer);
  }, [answers, open, phase, saveProgress]);

  /** Esc·배경 클릭으로 나갈 때도 방금 고른 값까지는 잡아둔다(디바운스를 기다리지 않고 즉시). */
  function handleClose() {
    if (phase === "questions") {
      saveProgress(answers);
      if (!saveConfirmed) {
        void trackOnce(`survey_dismiss:${trigger}:${productSlug ?? "none"}`, {
          type: "survey_dismiss",
          productSlug,
          trigger,
        });
      }
    }
    onClose();
  }

  // A viewport change can regroup questions while this modal is open. Derive
  // a safe display index rather than setting state from an effect.
  const currentStep = Math.min(step, steps.length - 1);
  const current = steps[currentStep] ?? [];
  const canAdvance = current.every((question) => isAnswered(question, answers));
  const isLastStep = currentStep === steps.length - 1;
  const completedCount = Math.max(
    maxCompletedCount,
    Math.min(currentStep * perStep, questions.length),
  );
  const gaugePercent = saveConfirmed
    ? 100
    : motivationalProgress(completedCount, questions.length);
  const gaugeText = saveConfirmed
    ? "설문 답변 저장 완료"
    : `전체 ${questions.length}개 문항 중 ${completedCount}개 완료`;

  function advance() {
    const completedThroughStep = Math.min(
      (currentStep + 1) * perStep,
      questions.length,
    );
    setMaxCompletedCount((count) =>
      Math.max(count, completedThroughStep),
    );
    setStep((value) => Math.min(value + 1, steps.length - 1));
  }

  async function submit() {
    setMaxCompletedCount(questions.length);
    setSubmitting(true);
    setSaveConfirmed(false);
    setError(null);

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...getUtm(),
          device: getDevice(),
          trigger,
          productSlug,
          ...answers,
        }),
      });

      if (!response.ok) throw new Error("save failed");

      const { surveyId: id } = (await response.json()) as { surveyId: string };

      // 완료했으니 이탈 스냅샷은 정리한다. 실패해도 조용히 넘어간다 — 청소가
      // 안 됐다고 완료 처리를 막을 이유는 없다(대시보드가 dedupeKey로 한 번
      // 더 걸러내므로 정리 실패로 완료 응답이 이탈 목록에 섞이지도 않는다).
      void fetch("/api/survey/progress", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ trigger, productSlug }),
      }).catch(() => undefined);

      setSurveyId(id);
      setSaveConfirmed(true);
      onCompleted();
      await new Promise((resolve) =>
        window.setTimeout(resolve, SAVE_CONFIRMATION_DELAY_MS),
      );
      // 인터뷰 참여 의사와 무관하게 추첨 참여 연락처는 모두에게 안내한다.
      setPhase("consent");
    } catch {
      setError("저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      void trackOnce(
        `survey_submit_error:${trigger}:${productSlug ?? "none"}`,
        {
          type: "survey_submit_error",
          productSlug,
          trigger,
        },
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} labelledBy="survey-title">
      {phase === "questions" && (
        <div className="flex flex-col">
          <div className="border-b border-lp-gray-100 px-6 pb-4 pt-6">
            <h2 id="survey-title" className="text-lp-heading text-lp-ink">
              더 나은 로컬 상품 구매 경험을 위해
            </h2>
            <p className="mt-1 text-sm text-lp-gray-700">
              전체 문항 · 약 2분
            </p>
            <p className="mt-1 text-xs text-lp-orange">
              참여해 주신 분들 중 추첨을 통해 로컬 특산품을 보내드려요
            </p>
            <div
              className="mt-3 h-2.5 overflow-hidden rounded-lp-circle bg-lp-gray-100"
              role="progressbar"
              aria-valuenow={saveConfirmed ? questions.length : completedCount}
              aria-valuemin={0}
              aria-valuemax={questions.length}
              aria-valuetext={gaugeText}
              aria-label="설문 진행률"
            >
              <div
                className={`h-full rounded-lp-circle transition-[width,background-color] duration-500 ease-out motion-reduce:transition-none ${
                  saveConfirmed ? "bg-lp-green" : "bg-lp-orange"
                }`}
                style={{ width: `${gaugePercent}%` }}
              />
            </div>
            {saveConfirmed && (
              <p
                aria-live="polite"
                className="mt-2 text-sm font-medium text-lp-green"
              >
                ✓ 답변이 안전하게 저장됐습니다
              </p>
            )}
          </div>

          <div className="space-y-8 px-6 py-6">
            {current.map((question) => (
              <QuestionField
                key={question.id}
                question={question}
                answers={answers}
                onSet={setAnswer}
                onToggle={toggleMulti}
              />
            ))}
          </div>

          {error && (
            <p role="alert" className="px-6 pb-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="sticky bottom-0 flex gap-lp-sm border-t border-lp-gray-100 bg-white px-6 py-4">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                className="h-12 rounded-lp-control border-lp-gray-300 px-5 font-medium text-lp-gray-700"
              >
                이전
              </Button>
            )}
            <Button
              type="button"
              disabled={!canAdvance || submitting}
              onClick={() => {
                if (isLastStep) void submit();
                else advance();
              }}
              className="h-12 flex-1 rounded-lp-control text-lp-button disabled:bg-lp-gray-300"
            >
              {submitting ? "저장하는 중…" : isLastStep ? "제출하기" : "다음"}
            </Button>
          </div>
        </div>
      )}

      {phase === "consent" && surveyId && (
        <ConsentForm
          surveyId={surveyId}
          productSlug={productSlug}
          interviewWilling={answers.interviewWilling === true}
          onDone={() => setPhase("done")}
          onSkip={() => setPhase("done")}
        />
      )}

      {phase === "done" && (
        <div className="px-6 py-10 text-center sm:px-8">
          <h2 id="survey-title" className="text-lp-heading text-lp-ink">
            답변 감사합니다
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-lp-gray-700">
            남겨주신 이야기는 로컬 상품을 어떻게 소개하면 좋을지 정하는 데
            쓰겠습니다.
          </p>
          <Button
            type="button"
            onClick={onClose}
            className="mt-7 h-12 w-full rounded-lp-control text-lp-button"
          >
            계속 둘러보기
          </Button>
        </div>
      )}
    </Modal>
  );
}

function QuestionField({
  question,
  answers,
  onSet,
  onToggle,
}: {
  question: Question;
  answers: AnswerMap;
  onSet: (id: keyof SurveyAnswers, value: unknown) => void;
  onToggle: (id: keyof SurveyAnswers, option: string) => void;
}) {
  const value = answers[question.id];

  return (
    <fieldset>
      <legend className="text-base font-bold leading-snug text-lp-ink">
        {question.title}
      </legend>
      {question.help && (
        <p className="mt-1 text-sm text-lp-gray-500">{question.help}</p>
      )}

      <div className="mt-3 space-y-2">
        {question.kind === "single" &&
          question.options.map((option) => (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-lp-md rounded-lp-control border p-lp-md text-sm ${
                value === option
                  ? "border-lp-green bg-lp-green-light text-lp-green"
                  : "border-lp-gray-300 text-lp-gray-900 hover:border-lp-green"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                checked={value === option}
                onChange={() => onSet(question.id, option)}
                className="h-4 w-4 accent-lp-green"
              />
              {option}
            </label>
          ))}

        {question.kind === "single" &&
          question.detailWhen &&
          value === question.detailWhen && (
            <textarea
              value={(answers.buyReasonDetail as string) ?? ""}
              onChange={(event) =>
                onSet("buyReasonDetail", event.target.value)
              }
              rows={2}
              placeholder="어떤 이유였는지 알려주세요"
              className="w-full rounded-lp-control border border-lp-gray-300 p-lp-md text-sm focus:border-lp-green focus:outline-none"
            />
          )}

        {question.kind === "multi" &&
          question.options.map((option) => {
            const list = Array.isArray(value) ? (value as string[]) : [];
            const checked = list.includes(option);
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-lp-md rounded-lp-control border p-lp-md text-sm ${
                  checked
                    ? "border-lp-green bg-lp-green-light text-lp-green"
                    : "border-lp-gray-300 text-lp-gray-900 hover:border-lp-green"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(question.id, option)}
                  className="h-4 w-4 accent-lp-green"
                />
                {option}
              </label>
            );
          })}

        {question.kind === "text" && (
          <textarea
            value={(value as string) ?? ""}
            onChange={(event) => onSet(question.id, event.target.value)}
            rows={3}
            placeholder={question.placeholder}
            className="w-full rounded-lp-control border border-lp-gray-300 p-lp-md text-sm focus:border-lp-green focus:outline-none"
          />
        )}

        {question.kind === "boolean" && (
          <div className="flex gap-lp-sm">
            {[
              { label: question.yes, val: true },
              { label: question.no, val: false },
            ].map((choice) => (
              <Button
                key={String(choice.val)}
                type="button"
                variant="outline"
                onClick={() => onSet(question.id, choice.val)}
                className={`h-12 flex-1 rounded-lp-control text-sm font-medium ${
                  value === choice.val
                    ? "border-lp-green bg-lp-green-light text-lp-green hover:bg-lp-green-light"
                    : "border-lp-gray-300 text-lp-gray-700"
                }`}
              >
                {choice.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </fieldset>
  );
}
