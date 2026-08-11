"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { captureUtm, trackOnce } from "@/lib/events";
import type { SurveyTrigger } from "@/lib/types";
import { FakeDoorOverlay } from "./FakeDoorOverlay";
import { SurveyModal } from "./SurveyModal";
import { useExitIntent } from "./useExitIntent";

const VIEWED_KEY = "lp_viewed";
const BUY_CLICKED_KEY = "lp_buy_clicked";
const SURVEY_SHOWN_KEY = "lp_survey_shown";

/** 설문 보조 트리거가 발동하는 서로 다른 상품 조회 수 */
const BROWSE_THRESHOLD = 3;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeSession(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* 무시 */
  }
}

type ExperimentContextValue = {
  /** 구매 버튼 클릭 — 이 실험의 핵심 구매 의도 신호 */
  buyClick: (productSlug: string) => void;
  /** 상품 상세 도달을 세션에 기록 (설문 보조 트리거 판단용) */
  noteProductViewed: (productSlug: string) => void;
};

const ExperimentContext = createContext<ExperimentContextValue | null>(null);

export function useExperiment(): ExperimentContextValue {
  const value = useContext(ExperimentContext);
  if (!value) {
    throw new Error("useExperiment must be used within <ExperimentProvider>");
  }
  return value;
}

/**
 * 실험 흐름(구매 클릭 → 페이크도어 공개 → 설문)의 상태를 쥐고 있는 프로바이더.
 * 스토어 레이아웃 전체를 감싼다.
 */
export function ExperimentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fakeDoorSlug, setFakeDoorSlug] = useState<string | null>(null);
  const [survey, setSurvey] = useState<{
    trigger: SurveyTrigger;
    productSlug?: string;
  } | null>(null);
  /** 이탈 의도 감시를 켤지 — 서로 다른 상품을 기준치만큼 봤고, 구매 클릭은 안 한 경우 */
  const [browseArmed, setBrowseArmed] = useState(false);

  const viewedRef = useRef<string[]>([]);
  const lastViewedRef = useRef<string | undefined>(undefined);
  const buyInFlightRef = useRef(false);

  /** 보조 트리거를 켤 조건인지 다시 판단한다 */
  const evaluateArm = useCallback(() => {
    const buyClicked =
      window.sessionStorage.getItem(BUY_CLICKED_KEY) === "1";
    const alreadyShown =
      window.sessionStorage.getItem(SURVEY_SHOWN_KEY) === "1";

    setBrowseArmed(
      !buyClicked &&
        !alreadyShown &&
        viewedRef.current.length >= BROWSE_THRESHOLD,
    );
  }, []);

  useEffect(() => {
    // 광고에서 넘어온 UTM을 세션에 붙잡아둔다
    captureUtm();
    viewedRef.current = readJson<string[]>(VIEWED_KEY, []);
    evaluateArm();
  }, [evaluateArm]);

  const noteProductViewed = useCallback(
    (productSlug: string) => {
      lastViewedRef.current = productSlug;

      // 매번 sessionStorage에서 읽어 병합한다. React는 자식 effect를 부모보다
      // 먼저 실행하므로, 이 함수는 프로바이더가 아직 기존 목록을 복원하기 전에
      // 호출될 수 있다. 메모리의 ref를 기준으로 쓰면 직전 페이지에서 본 상품
      // 기록을 통째로 덮어써, 3개를 봐도 1개로 집계된다.
      const stored = readJson<string[]>(VIEWED_KEY, []);
      const merged = stored.includes(productSlug)
        ? stored
        : [...stored, productSlug];

      viewedRef.current = merged;
      if (merged !== stored) writeSession(VIEWED_KEY, JSON.stringify(merged));

      evaluateArm();
    },
    [evaluateArm],
  );

  const openSurvey = useCallback(
    (trigger: SurveyTrigger, productSlug?: string) => {
      writeSession(SURVEY_SHOWN_KEY, "1");
      setBrowseArmed(false);
      setSurvey({ trigger, productSlug });
    },
    [],
  );

  const buyClick = useCallback((productSlug: string) => {
    if (buyInFlightRef.current) return;
    buyInFlightRef.current = true;

    // 구매 클릭자에게는 이탈 의도 기반 설문을 띄우지 않는다. 핵심 지표를
    // 측정하는 흐름과 보조 흐름이 섞이면 결과 해석이 어려워진다.
    writeSession(BUY_CLICKED_KEY, "1");
    setBrowseArmed(false);

    setFakeDoorSlug(productSlug);
    // Queue these records in the same order as the participant sees them.
    // The disclosure itself is rendered immediately and never waits on the API.
    const buyEvent = trackOnce(`buy_click:${productSlug}`, {
      type: "buy_click",
      productSlug,
    });
    const disclosureEvent = trackOnce(`fakedoor_shown:${productSlug}`, {
      type: "fakedoor_shown",
      productSlug,
    });
    void Promise.all([buyEvent, disclosureEvent]).finally(() => {
      buyInFlightRef.current = false;
    });
  }, []);

  // 보조 경로: 서로 다른 상품 3개를 본 뒤 떠나려 할 때 한 번만 묻는다
  useExitIntent(browseArmed, () => {
    openSurvey("browse_3", lastViewedRef.current);
  });

  return (
    <ExperimentContext.Provider value={{ buyClick, noteProductViewed }}>
      {children}

      <FakeDoorOverlay
        open={fakeDoorSlug !== null}
        onClose={() => setFakeDoorSlug(null)}
        onSurvey={() => {
          const slug = fakeDoorSlug ?? undefined;
          setFakeDoorSlug(null);
          openSurvey("buy_click", slug);
        }}
      />

      {survey && (
        <SurveyModal
          open
          trigger={survey.trigger}
          productSlug={survey.productSlug}
          onClose={() => setSurvey(null)}
        />
      )}
    </ExperimentContext.Provider>
  );
}
