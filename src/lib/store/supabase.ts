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

/** New `sb_secret_` API keys are sent only as apikey, never as JWT Bearer tokens. */
function authHeaders(serviceRole: string): HeadersInit {
  return serviceRole.startsWith("eyJ")
    ? { apikey: serviceRole, Authorization: `Bearer ${serviceRole}` }
    : { apikey: serviceRole };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { url, serviceRole } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...authHeaders(serviceRole),
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    // 상태 코드만으로는 원인을 알 수 없어 디버깅이 오래 걸린다. PostgREST가
    // 돌려주는 message/hint를 함께 남긴다 (자격 증명은 포함되지 않는다).
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Supabase storage request failed (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`,
    );
  }

  // `Prefer: return=minimal` 인서트는 204가 아니라 **201에 빈 본문**으로 온다.
  // 상태 코드만 보고 건너뛰면 빈 문자열을 JSON.parse 하다 터진다.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// Each insert writes `payload` (the source of truth the app reads back) plus
// the flattened columns that make the row browsable in Supabase.
//
// ⚠️ Deploy order matters: the schema must be upgraded (schema.sql applied)
// BEFORE this adapter ships. PostgREST rejects an insert that names a column
// the table doesn't have (400 / PGRST204) — it does not ignore it — so shipping
// these columns against the old schema would break every write.

function appendEvent(event: TrackedEvent): Promise<void> {
  return request<void>("lp_events?on_conflict=dedupe_key", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({
      id: event.id,
      session_id: event.sessionId,
      dedupe_key: event.dedupeKey,
      event_type: event.type,
      product_slug: event.productSlug ?? null,
      region_id: event.regionId ?? null,
      creator_id: event.creatorId ?? null,
      device: event.device,
      trigger: event.trigger ?? null,
      utm_source: event.utmSource ?? null,
      utm_medium: event.utmMedium ?? null,
      utm_campaign: event.utmCampaign ?? null,
      utm_content: event.utmContent ?? null,
      client_ts: event.ts,
      payload: event,
    }),
  });
}

async function saveSurvey(response: SurveyResponse): Promise<string> {
  const rows = await request<InsertRecord[]>("lp_surveys?on_conflict=dedupe_key", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({
      id: response.id,
      session_id: response.sessionId,
      dedupe_key: response.dedupeKey,
      product_slug: response.productSlug ?? null,
      trigger: response.trigger,
      device: response.device,
      buy_reason: response.buyReason,
      buy_reason_detail: response.buyReasonDetail ?? null,
      use_context: response.useContext,
      purchase_experience: response.purchaseExperience,
      channels: response.channels,
      trust_factors: response.trustFactors,
      region_interest: response.regionInterest,
      interview_willing: response.interviewWilling,
      utm_source: response.utmSource ?? null,
      utm_medium: response.utmMedium ?? null,
      utm_campaign: response.utmCampaign ?? null,
      utm_content: response.utmContent ?? null,
      client_ts: response.ts,
      payload: response,
    }),
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
    body: JSON.stringify({
      id: consent.id,
      session_id: consent.sessionId,
      dedupe_key: consent.dedupeKey,
      survey_id: consent.surveyId,
      name: consent.name,
      contact: consent.contact,
      contact_type: consent.contactType,
      notice_version: consent.noticeVersion,
      client_ts: consent.ts,
      payload: consent,
    }),
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
      ...authHeaders(serviceRole),
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
