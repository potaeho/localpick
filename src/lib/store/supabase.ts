import "server-only";

import type { InterviewConsent, SurveyResponse, TrackedEvent } from "@/lib/types";
import type { StorageAdapter } from "./index";

type SupabaseRecord<T> = { payload: T };
type InsertRecord = { id: string };

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error("Supabase storage requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }
  if (new URL(url).protocol !== "https:") {
    throw new Error("SUPABASE_URL must use HTTPS");
  }
  return { url, serviceRole };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { url, serviceRole } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Supabase storage request failed (${response.status})`);
  }
  return (response.status === 204 ? undefined : await response.json()) as T;
}

function appendEvent(event: TrackedEvent): Promise<void> {
  return request<void>("lp_events?on_conflict=dedupe_key", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({
      id: event.id,
      session_id: event.sessionId,
      dedupe_key: event.dedupeKey,
      payload: event,
    }),
  });
}

async function saveSurvey(response: SurveyResponse): Promise<string> {
  const rows = await request<InsertRecord[]>("lp_surveys?on_conflict=dedupe_key", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({ id: response.id, session_id: response.sessionId, dedupe_key: response.dedupeKey, payload: response }),
  });
  if (rows[0]?.id) return rows[0].id;
  const existing = await request<InsertRecord[]>(`lp_surveys?select=id&dedupe_key=eq.${encodeURIComponent(response.dedupeKey)}&limit=1`);
  if (!existing[0]?.id) throw new Error("Survey conflict could not be resolved");
  return existing[0].id;
}

async function saveConsent(consent: InterviewConsent): Promise<boolean> {
  const rows = await request<InsertRecord[]>("lp_consents?on_conflict=dedupe_key", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({ id: consent.id, session_id: consent.sessionId, dedupe_key: consent.dedupeKey, payload: consent }),
  });
  return rows.length > 0;
}

async function read<T>(table: string): Promise<T[]> {
  const rows = await request<SupabaseRecord<T>[]>(`${table}?select=payload&order=created_at.asc`);
  return rows.flatMap((row) => (row && typeof row.payload === "object" && row.payload ? [row.payload] : []));
}

async function remove(path: string): Promise<number> {
  const { url, serviceRole } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method: "DELETE",
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      Prefer: "return=representation",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase deletion failed (${response.status})`);
  const rows = (await response.json()) as unknown[];
  return Array.isArray(rows) ? rows.length : 0;
}

function encodeFilter(value: string): string {
  return encodeURIComponent(value);
}

/** Vercel 같은 무상태 배포 환경에서 사용하는 영속 저장소. */
export const supabaseAdapter: StorageAdapter = {
  appendEvent,
  readEvents: () => read<TrackedEvent>("lp_events"),
  saveSurvey,
  readSurveys: () => read<SurveyResponse>("lp_surveys"),
  async findSurveyForConsent(surveyId, sessionId) {
    const rows = await request<SupabaseRecord<SurveyResponse>[]>(
      `lp_surveys?select=payload&id=eq.${encodeURIComponent(surveyId)}&session_id=eq.${encodeURIComponent(sessionId)}&limit=1`,
    );
    return rows[0]?.payload ?? null;
  },
  saveConsent,
  readConsents: () => read<InterviewConsent>("lp_consents"),

  async deleteParticipant(sessionId) {
    const filter = `session_id=eq.${encodeFilter(sessionId)}`;
    const [events, surveys, consents] = await Promise.all([
      remove(`lp_events?${filter}`),
      remove(`lp_surveys?${filter}`),
      remove(`lp_consents?${filter}`),
    ]);
    return { events, surveys, consents };
  },
  async purgeBefore(cutoff) {
    const filter = `created_at=lt.${encodeFilter(cutoff)}`;
    const [events, surveys, consents] = await Promise.all([
      remove(`lp_events?${filter}`),
      remove(`lp_surveys?${filter}`),
      remove(`lp_consents?${filter}`),
    ]);
    return { events, surveys, consents };
  },
};
