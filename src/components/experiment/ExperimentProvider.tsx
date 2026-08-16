"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import { captureLanding, captureUtm, trackBeacon, trackOnce } from "@/lib/events";
import type { SurveyTrigger } from "@/lib/types";
import { FakeDoorOverlay } from "./FakeDoorOverlay";
import { SurveyModal } from "./SurveyModal";

const VIEWED_KEY = "lp_viewed";
const BUY_CLICKED_KEY = "lp_buy_clicked";
const SURVEY_SHOWN_KEY = "lp_survey_shown";
const SURVEY_COMPLETED_KEY = "lp_survey_completed";

/** 랜딩을 조금 살펴본 뒤 설문을 여는 기준 */
const ENGAGEMENT_DELAY_MS = 5_000;
const ENGAGEMENT_SCROLL_DEPTH = 15;

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
  const viewedRef = useRef<string[]>([]);
  const lastViewedRef = useRef<string | undefined>(undefined);
  const buyInFlightRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    // 광고에서 넘어온 UTM을 세션에 붙잡아둔다
    captureUtm();
    viewedRef.current = readJson<string[]>(VIEWED_KEY, []);

    // 유입 경로(리퍼러·랜딩 페이지) — 세션당 한 번만 남는다
    const landing = captureLanding();
    void trackOnce("session_start", {
      type: "session_start",
      referrer: landing?.referrer,
      landingPath: landing?.landingPath,
    });
  }, []);

  /**
   * 페이지별 체류시간·최대 스크롤 깊이를 재고, 그 페이지를 떠나는 순간
   * page_exit로 남긴다.
   *
   * 라우트가 바뀌면(pathname 변경) 이 effect의 클린업이 "떠나는 페이지" 기준으로
   * 먼저 실행되고, 새 pathname으로 다시 시작한다. 탭을 닫거나 백그라운드로
   * 보내는 경우(클린업이 실행되지 않는 경우)는 visibilitychange로 따로 잡는다.
   */
  useEffect(() => {
    const enteredAt = Date.now();
    const path = pathname;
    let maxScroll = 0;
    let sent = false;

    function currentScrollDepth(): number {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return 100;
      return Math.min(100, Math.max(0, Math.round((window.scrollY / scrollable) * 100)));
    }

    function updateMaxScroll() {
      maxScroll = Math.max(maxScroll, currentScrollDepth());
    }

    function sendExit() {
      if (sent) return;
      sent = true;
      trackBeacon({
        type: "page_exit",
        path,
        durationMs: Date.now() - enteredAt,
        scrollDepth: maxScroll,
      });
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") sendExit();
    }

    window.addEventListener("scroll", updateMaxScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", sendExit);

    return () => {
      window.removeEventListener("scroll", updateMaxScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", sendExit);
      sendExit();
    };
  }, [pathname]);

  const openSurvey = useCallback(
    (trigger: SurveyTrigger, productSlug?: string) => {
      writeSession(SURVEY_SHOWN_KEY, "1");
      setSurvey({ trigger, productSlug });
    },
    [],
  );

  /**
   * 이 랜딩의 1차 역할은 설문 참여 유도다. 페이지를 열자마자 콘텐츠를 가리지
   * 않고, 5초를 머물거나 15% 이상 살펴본 시점 중 빠른 쪽에서 한 번만 연다.
   * 구매 흐름이 이미 시작됐거나 같은 세션에서 설문을 본 사람은 제외한다.
   */
  useEffect(() => {
    let finished = false;
    let delayElapsed = false;

    function alreadyHandled(): boolean {
      try {
        return (
          window.sessionStorage.getItem(BUY_CLICKED_KEY) === "1" ||
          window.sessionStorage.getItem(SURVEY_SHOWN_KEY) === "1" ||
          window.sessionStorage.getItem(SURVEY_COMPLETED_KEY) === "1"
        );
      } catch {
        return false;
      }
    }

    function showEngagedSurvey() {
      if (finished || document.visibilityState !== "visible" || alreadyHandled()) {
        return;
      }
      finished = true;
      openSurvey("landing_engaged", lastViewedRef.current);
    }

    function currentScrollDepth(): number {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return 0;
      return Math.round((window.scrollY / scrollable) * 100);
    }

    function onScroll() {
      if (currentScrollDepth() >= ENGAGEMENT_SCROLL_DEPTH) {
        showEngagedSurvey();
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible" && delayElapsed) {
        showEngagedSurvey();
      }
    }

    const timer = window.setTimeout(() => {
      delayElapsed = true;
      showEngagedSurvey();
    }, ENGAGEMENT_DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [openSurvey]);

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

    },
    [],
  );

  const buyClick = useCallback((productSlug: string) => {
    if (buyInFlightRef.current) return;
    buyInFlightRef.current = true;

    // 구매 클릭자에게는 탐색 기반 보조 설문을 띄우지 않는다. 핵심 지표를
    // 측정하는 흐름과 보조 흐름이 섞이면 결과 해석이 어려워진다.
    writeSession(BUY_CLICKED_KEY, "1");

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

  return (
    <ExperimentContext.Provider value={{ buyClick, noteProductViewed }}>
      {children}

      <FakeDoorOverlay
        open={fakeDoorSlug !== null}
        onClose={() => setFakeDoorSlug(null)}
        onSurvey={() => {
          const slug = fakeDoorSlug ?? undefined;
          setFakeDoorSlug(null);
          try {
            if (window.sessionStorage.getItem(SURVEY_COMPLETED_KEY) === "1") {
              return;
            }
          } catch {
            // 저장소를 쓸 수 없으면 현재 구매 경로의 설문을 정상적으로 연다.
          }
          openSurvey("buy_click", slug);
        }}
      />

      {survey && (
        <SurveyModal
          open
          trigger={survey.trigger}
          productSlug={survey.productSlug}
          onCompleted={() => writeSession(SURVEY_COMPLETED_KEY, "1")}
          onClose={() => setSurvey(null)}
        />
      )}
    </ExperimentContext.Provider>
  );
}
