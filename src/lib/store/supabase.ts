import "server-only";

import type {
  InterviewConsent,
  SurveyProgress,
  SurveyResponse,
  TrackedEvent,
} from "@/lib/types";
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
      product_categories: response.productCategories,
      purchase_frequency: response.purchaseFrequency || null,
      typical_spend: response.typicalSpend || null,
      purchase_purposes: response.purchasePurposes,
      trust_factors: response.trustFactors,
      purchase_problems: response.purchaseProblems,
      purchase_barriers: response.purchaseBarriers,
      offline_channels: response.offlineChannels,
      purchase_conditions: response.purchaseConditions,
      prospective_channels: response.prospectiveChannels,
      purchase_concerns: response.purchaseConcerns,
      region_attention: response.regionAttention,
      region_reasons: response.regionReasons,
      region_non_reasons: response.regionNonReasons,
      producer_story_help: response.producerStoryHelp,
      process_info_trust: response.processInfoTrust,
      region_interest: response.regionInterest,
      travel_info_interest: response.travelInfoInterest,
      regional_impact_influence: response.regionalImpactInfluence,
      preferred_story_focus: response.preferredStoryFocus,
      age_group: response.ageGroup,
      gender: response.gender,
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

type ProgressRow = {
  id: string;
  session_id: string;
  dedupe_key: string;
  trigger: SurveyProgress["trigger"];
  product_slug: string | null;
  device: SurveyProgress["device"];
  last_question_id: string | null;
  answers: Partial<SurveyProgress["answers"]>;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  client_ts: string | null;
};

/**
 * 답변이 늘어날 때마다 같은 dedupe_key로 계속 upsert된다 — 그래서 이 테이블은
 * insert-or-update(merge-duplicates)를 쓴다. 다른 테이블(events/surveys/
 * consents)은 처음 한 번만 기록되면 끝이라 ignore-duplicates(멱등 재시도
 * 방어)면 충분하지만, 진행 스냅샷은 매번 갱신되어야 의미가 있다.
 */
async function saveProgress(progress: SurveyProgress): Promise<void> {
  await request<void>("lp_survey_progress?on_conflict=dedupe_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      id: progress.dedupeKey,
      session_id: progress.sessionId,
      dedupe_key: progress.dedupeKey,
      trigger: progress.trigger,
      product_slug: progress.productSlug ?? null,
      device: progress.device,
      last_question_id: progress.lastQuestionId ?? null,
      answers: progress.answers,
      utm_source: progress.utmSource ?? null,
      utm_medium: progress.utmMedium ?? null,
      utm_campaign: progress.utmCampaign ?? null,
      utm_content: progress.utmContent ?? null,
      client_ts: progress.ts,
    }),
  });
}

function toSurveyProgress(row: ProgressRow, updatedAt: string): SurveyProgress {
  return {
    dedupeKey: row.dedupe_key,
    sessionId: row.session_id,
    ts: row.client_ts ?? updatedAt,
    trigger: row.trigger,
    productSlug: row.product_slug ?? undefined,
    device: row.device,
    answers: row.answers ?? {},
    lastQuestionId: (row.last_question_id ?? undefined) as SurveyProgress["lastQuestionId"],
    utmSource: row.utm_source ?? undefined,
    utmMedium: row.utm_medium ?? undefined,
    utmCampaign: row.utm_campaign ?? undefined,
    utmContent: row.utm_content ?? undefined,
  };
}

async function readProgress(): Promise<SurveyProgress[]> {
  const rows = await request<(ProgressRow & { updated_at: string })[]>(
    "lp_survey_progress?select=id,session_id,dedupe_key,trigger,product_slug,device,last_question_id,answers,utm_source,utm_medium,utm_campaign,utm_content,client_ts,updated_at&order=updated_at.asc",
  );
  return rows.map((row) => toSurveyProgress(row, row.updated_at));
}

async function deleteProgress(dedupeKey: string): Promise<void> {
  await request<void>(
    `lp_survey_progress?dedupe_key=eq.${encodeURIComponent(dedupeKey)}`,
    { method: "DELETE", headers: { Prefer: "return=minimal" } },
  );
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

  saveProgress,
  readProgress,
  deleteProgress,

  async deleteParticipant(sessionId) {
    const filter = `session_id=eq.${encodeFilter(sessionId)}`;
    const [events, surveys, consents, progress] = await Promise.all([
      remove(`lp_events?${filter}`),
      remove(`lp_surveys?${filter}`),
      remove(`lp_consents?${filter}`),
      remove(`lp_survey_progress?${filter}`),
    ]);
    return { events, surveys, consents, progress };
  },
  async purgeBefore(cutoff) {
    const filter = `created_at=lt.${encodeFilter(cutoff)}`;
    // lp_survey_progress is timestamped by updated_at (it is upserted in
    // place, so created_at would keep the very first draft's age forever).
    const progressFilter = `updated_at=lt.${encodeFilter(cutoff)}`;
    const [events, surveys, consents, progress] = await Promise.all([
      remove(`lp_events?${filter}`),
      remove(`lp_surveys?${filter}`),
      remove(`lp_consents?${filter}`),
      remove(`lp_survey_progress?${progressFilter}`),
    ]);
    return { events, surveys, consents, progress };
  },
};
