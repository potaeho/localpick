import "server-only";

import type {
  InterviewConsent,
  SurveyProgress,
  SurveyResponse,
  TrackedEvent,
} from "@/lib/types";
import { jsonlAdapter } from "./jsonl";
import { supabaseAdapter } from "./supabase";

/**
 * 수집 데이터 저장소.
 *
 * 구현을 인터페이스 뒤에 숨겨두어, 실제 광고 집행 전에 Supabase 등
 * 영속 저장소로 갈아끼울 수 있게 한다. 현재 구현(JSONL 파일)은 로컬 개발과
 * 소규모 파일럿을 위한 것으로, Vercel 같은 서버리스 환경에서는 파일시스템이
 * 휘발성이라 그대로 쓰면 데이터가 유실된다.
 */
export interface StorageAdapter {
  appendEvent(event: TrackedEvent): Promise<void>;
  readEvents(): Promise<TrackedEvent[]>;

  /** Returns the canonical ID, including when a retry hits a unique key. */
  saveSurvey(response: SurveyResponse): Promise<string>;
  readSurveys(): Promise<SurveyResponse[]>;
  findSurveyForConsent(surveyId: string, sessionId: string): Promise<SurveyResponse | null>;

  /** 인터뷰 연락처는 설문 응답과 분리 저장한다 (기획서 5단계) */
  /** Returns true only when this consent was newly inserted. */
  saveConsent(consent: InterviewConsent): Promise<boolean>;
  readConsents(): Promise<InterviewConsent[]>;

  /**
   * 설문 도중 답변 스냅샷. 같은 시도(dedupeKey)를 계속 upsert하며,
   * 완료 시 deleteProgress로 지운다.
   */
  saveProgress(progress: SurveyProgress): Promise<void>;
  readProgress(): Promise<SurveyProgress[]>;
  deleteProgress(dedupeKey: string): Promise<void>;

  /** 개인정보 삭제 요청은 같은 익명 세션의 이벤트·설문·동의·진행상태를 함께 제거한다. */
  deleteParticipant(sessionId: string): Promise<{ events: number; surveys: number; consents: number; progress: number }>;
  /** 보존 기간이 지난 전체 기록을 제거한다. */
  purgeBefore(cutoff: string): Promise<{ events: number; surveys: number; consents: number; progress: number }>;
}

function selectedAdapter(): StorageAdapter {
  const configured = process.env.STORAGE_ADAPTER?.toLowerCase();
  const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (configured === "supabase" || (!configured && hasSupabase)) return supabaseAdapter;
  if (process.env.NODE_ENV !== "production" && (configured === "jsonl" || !configured)) return jsonlAdapter;

  // Vercel 파일 시스템은 요청 사이에 지속되지 않는다. 배포에서 조용히 JSONL로
  // 폴백하면 설문/동의 기록이 유실되므로, 설정 오류를 명시적으로 드러낸다.
  throw new Error("Production storage requires STORAGE_ADAPTER=supabase and Supabase credentials");
}

/** 호출 시점에 어댑터를 고른다. 빌드 단계에서 비밀값을 요구하지 않기 위함이다. */
export const storage: StorageAdapter = {
  appendEvent: (event) => selectedAdapter().appendEvent(event),
  readEvents: () => selectedAdapter().readEvents(),
  saveSurvey: (response) => selectedAdapter().saveSurvey(response),
  readSurveys: () => selectedAdapter().readSurveys(),
  findSurveyForConsent: (surveyId, sessionId) => selectedAdapter().findSurveyForConsent(surveyId, sessionId),
  saveConsent: (consent) => selectedAdapter().saveConsent(consent),
  readConsents: () => selectedAdapter().readConsents(),
  saveProgress: (progress) => selectedAdapter().saveProgress(progress),
  readProgress: () => selectedAdapter().readProgress(),
  deleteProgress: (dedupeKey) => selectedAdapter().deleteProgress(dedupeKey),
  deleteParticipant: (sessionId) => selectedAdapter().deleteParticipant(sessionId),
  purgeBefore: (cutoff) => selectedAdapter().purgeBefore(cutoff),
};
