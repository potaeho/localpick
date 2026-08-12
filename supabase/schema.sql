-- LOCAL PICK production storage. Run this in the Supabase SQL Editor before
-- deploying with STORAGE_ADAPTER=supabase. Keep the service-role key server-only.
--
-- Design: `payload` (jsonb) stays the source of truth the app reads back, and
-- the flattened columns beside it exist so the team can browse, filter, sort,
-- and chart the data directly in Supabase (or point a BI tool at it) without
-- unpacking jsonb by hand. Writes populate both; the dashboard still reads
-- `payload`, so flattening carries no risk to the read path.

create table if not exists public.lp_events (
  id text primary key,
  session_id text,
  dedupe_key text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lp_surveys (
  id text primary key,
  session_id text,
  dedupe_key text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lp_consents (
  id text primary key,
  session_id text,
  dedupe_key text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lp_admin_login_audit (
  id text primary key,
  ip_hash text not null,
  success boolean not null,
  attempted_at timestamptz not null default now()
);

-- Snapshot of a survey's answers-so-far, upserted as the participant progresses
-- through the modal. One row per attempt (session + trigger + product), kept
-- separate from lp_surveys so an abandoned attempt never enters the completed-
-- survey funnel or answer tallies. Deleted once the attempt finishes (its
-- answers now live in lp_surveys); a stray leftover is still filtered out at
-- read time by dedupe_key as a second line of defense.
create table if not exists public.lp_survey_progress (
  id text primary key,
  session_id text,
  dedupe_key text,
  trigger text,
  product_slug text,
  device text,
  last_question_id text,
  answers jsonb not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  client_ts timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Supports an in-place upgrade from the original payload-only schema.
alter table public.lp_events add column if not exists session_id text;
alter table public.lp_events add column if not exists dedupe_key text;
alter table public.lp_surveys add column if not exists session_id text;
alter table public.lp_surveys add column if not exists dedupe_key text;
alter table public.lp_consents add column if not exists session_id text;
alter table public.lp_consents add column if not exists dedupe_key text;
update public.lp_events set session_id = payload->>'sessionId' where session_id is null;
update public.lp_surveys set session_id = payload->>'sessionId' where session_id is null;
update public.lp_consents set session_id = payload->>'sessionId' where session_id is null;

-- ─────────────────────────────────────────────────────────────────────────────
-- Flattened, browsable columns. All are add-if-not-exists so this file stays
-- idempotent and can be re-run to upgrade an already-populated database.
-- ─────────────────────────────────────────────────────────────────────────────

-- lp_events: one row per tracked interaction.
alter table public.lp_events add column if not exists event_type text;   -- product_view / buy_click / survey_complete / ...
alter table public.lp_events add column if not exists product_slug text;
alter table public.lp_events add column if not exists region_id text;
alter table public.lp_events add column if not exists creator_id text;
alter table public.lp_events add column if not exists device text;       -- mobile / desktop
alter table public.lp_events add column if not exists trigger text;      -- buy_click / browse_3 (survey events only)
alter table public.lp_events add column if not exists utm_source text;
alter table public.lp_events add column if not exists utm_medium text;
alter table public.lp_events add column if not exists utm_campaign text;
alter table public.lp_events add column if not exists utm_content text;
alter table public.lp_events add column if not exists client_ts timestamptz;  -- client-reported time (payload.ts)

-- lp_surveys: one row per completed survey. Selection answers become columns;
-- free-text (useContext, buyReasonDetail) is kept but the qualitative reading
-- still happens in the admin dashboard.
alter table public.lp_surveys add column if not exists product_slug text;
alter table public.lp_surveys add column if not exists trigger text;
alter table public.lp_surveys add column if not exists device text;
alter table public.lp_surveys add column if not exists buy_reason text;
alter table public.lp_surveys add column if not exists buy_reason_detail text;
alter table public.lp_surveys add column if not exists use_context text;
alter table public.lp_surveys add column if not exists purchase_experience text;
alter table public.lp_surveys add column if not exists channels text[];        -- 복수 선택
alter table public.lp_surveys add column if not exists trust_factors text[];    -- 복수 선택
alter table public.lp_surveys add column if not exists region_interest text;
alter table public.lp_surveys add column if not exists interview_willing boolean;
alter table public.lp_surveys add column if not exists utm_source text;
alter table public.lp_surveys add column if not exists utm_medium text;
alter table public.lp_surveys add column if not exists utm_campaign text;
alter table public.lp_surveys add column if not exists utm_content text;
alter table public.lp_surveys add column if not exists client_ts timestamptz;

-- lp_consents: interview contacts (PERSONAL DATA). Flattened for the deletion /
-- retention workflow; the dashboard still masks these and logs every reveal.
alter table public.lp_consents add column if not exists survey_id text;
alter table public.lp_consents add column if not exists name text;
alter table public.lp_consents add column if not exists contact text;
alter table public.lp_consents add column if not exists contact_type text;   -- email / phone
alter table public.lp_consents add column if not exists notice_version text;
alter table public.lp_consents add column if not exists client_ts timestamptz;

-- Backfill flattened columns from any pre-existing payload rows.
update public.lp_events set
  event_type   = coalesce(event_type, payload->>'type'),
  product_slug = coalesce(product_slug, payload->>'productSlug'),
  region_id    = coalesce(region_id, payload->>'regionId'),
  creator_id   = coalesce(creator_id, payload->>'creatorId'),
  device       = coalesce(device, payload->>'device'),
  trigger      = coalesce(trigger, payload->>'trigger'),
  utm_source   = coalesce(utm_source, payload->>'utmSource'),
  utm_medium   = coalesce(utm_medium, payload->>'utmMedium'),
  utm_campaign = coalesce(utm_campaign, payload->>'utmCampaign'),
  utm_content  = coalesce(utm_content, payload->>'utmContent'),
  client_ts    = coalesce(client_ts, (payload->>'ts')::timestamptz)
where event_type is null;

update public.lp_surveys set
  product_slug        = coalesce(product_slug, payload->>'productSlug'),
  trigger             = coalesce(trigger, payload->>'trigger'),
  device              = coalesce(device, payload->>'device'),
  buy_reason          = coalesce(buy_reason, payload->>'buyReason'),
  buy_reason_detail   = coalesce(buy_reason_detail, payload->>'buyReasonDetail'),
  use_context         = coalesce(use_context, payload->>'useContext'),
  purchase_experience = coalesce(purchase_experience, payload->>'purchaseExperience'),
  channels            = coalesce(channels, array(select jsonb_array_elements_text(payload->'channels'))),
  trust_factors       = coalesce(trust_factors, array(select jsonb_array_elements_text(payload->'trustFactors'))),
  region_interest     = coalesce(region_interest, payload->>'regionInterest'),
  interview_willing   = coalesce(interview_willing, (payload->>'interviewWilling')::boolean),
  utm_source          = coalesce(utm_source, payload->>'utmSource'),
  utm_medium          = coalesce(utm_medium, payload->>'utmMedium'),
  utm_campaign        = coalesce(utm_campaign, payload->>'utmCampaign'),
  utm_content         = coalesce(utm_content, payload->>'utmContent'),
  client_ts           = coalesce(client_ts, (payload->>'ts')::timestamptz)
where buy_reason is null;

update public.lp_consents set
  survey_id      = coalesce(survey_id, payload->>'surveyId'),
  name           = coalesce(name, payload->>'name'),
  contact        = coalesce(contact, payload->>'contact'),
  contact_type   = coalesce(contact_type, payload->>'contactType'),
  notice_version = coalesce(notice_version, payload->>'noticeVersion'),
  client_ts      = coalesce(client_ts, (payload->>'ts')::timestamptz)
where contact is null;

-- PostgREST `?on_conflict=dedupe_key` requires a conflict target that PostgreSQL
-- can infer. A partial unique index is not inferable by `ON CONFLICT(dedupe_key)`.
-- Upgrade any earlier partial indexes in-place; no table rows are removed. A
-- regular unique index still permits multiple NULLs, so legacy rows without a
-- dedupe key remain valid.
do $$
begin
  if exists (
    select 1 from pg_index i
    join pg_class c on c.oid = i.indexrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'lp_events_dedupe_key_unique'
      and i.indpred is not null
  ) then
    drop index public.lp_events_dedupe_key_unique;
  end if;
  if exists (
    select 1 from pg_index i
    join pg_class c on c.oid = i.indexrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'lp_surveys_dedupe_key_unique'
      and i.indpred is not null
  ) then
    drop index public.lp_surveys_dedupe_key_unique;
  end if;
  if exists (
    select 1 from pg_index i
    join pg_class c on c.oid = i.indexrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'lp_consents_dedupe_key_unique'
      and i.indpred is not null
  ) then
    drop index public.lp_consents_dedupe_key_unique;
  end if;
end $$;

create unique index if not exists lp_events_dedupe_key_unique
  on public.lp_events (dedupe_key);
create unique index if not exists lp_surveys_dedupe_key_unique
  on public.lp_surveys (dedupe_key);
create unique index if not exists lp_consents_dedupe_key_unique
  on public.lp_consents (dedupe_key);
create index if not exists lp_events_created_at_idx on public.lp_events (created_at);
create index if not exists lp_events_session_id_idx on public.lp_events (session_id);
-- Speeds up the per-product / per-campaign browsing the flattened columns enable.
create index if not exists lp_events_event_type_idx on public.lp_events (event_type);
create index if not exists lp_events_product_slug_idx on public.lp_events (product_slug);
create index if not exists lp_events_utm_campaign_idx on public.lp_events (utm_campaign);
create index if not exists lp_surveys_created_at_idx on public.lp_surveys (created_at);
create index if not exists lp_surveys_session_id_idx on public.lp_surveys (session_id);
create index if not exists lp_surveys_product_slug_idx on public.lp_surveys (product_slug);
create index if not exists lp_consents_created_at_idx on public.lp_consents (created_at);
create index if not exists lp_consents_session_id_idx on public.lp_consents (session_id);
create index if not exists lp_admin_login_audit_failures_idx
  on public.lp_admin_login_audit (ip_hash, attempted_at desc) where success is false;

create unique index if not exists lp_survey_progress_dedupe_key_unique
  on public.lp_survey_progress (dedupe_key);
create index if not exists lp_survey_progress_session_id_idx on public.lp_survey_progress (session_id);
create index if not exists lp_survey_progress_updated_at_idx on public.lp_survey_progress (updated_at);

-- Each autosave is an upsert (insert-or-update by dedupe_key), so updated_at
-- must move on every revision, not just the first insert — a plain column
-- default only fires on insert.
create or replace function public.lp_survey_progress_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists lp_survey_progress_touch_updated_at on public.lp_survey_progress;
create trigger lp_survey_progress_touch_updated_at
  before update on public.lp_survey_progress
  for each row execute function public.lp_survey_progress_touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- The one relationship worth enforcing: an interview consent belongs to the
-- survey it was collected from. lp_surveys.id is the primary key, so this makes
-- the link visible in Supabase's schema diagram and rejects orphan consents.
--
-- `on delete set null` (not the restrict default): a participant-deletion or a
-- retention purge removes surveys and consents concurrently, so the FK must not
-- fail if the survey row is deleted while its consent still points at it — the
-- link is simply nulled. lp_events stays FK-free on purpose (see the design
-- note at the top): it is a high-write log, correlated by session_id at read
-- time, not a child row.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lp_consents_survey_id_fkey'
  ) then
    alter table public.lp_consents
      add constraint lp_consents_survey_id_fkey
      foreign key (survey_id) references public.lp_surveys (id)
      on delete set null;
  end if;
end $$;
create index if not exists lp_consents_survey_id_idx on public.lp_consents (survey_id);

alter table public.lp_events enable row level security;
alter table public.lp_surveys enable row level security;
alter table public.lp_consents enable row level security;
alter table public.lp_admin_login_audit enable row level security;
alter table public.lp_survey_progress enable row level security;

-- New Supabase projects may not expose new public tables to the Data API by
-- default. The server's service_role needs these explicit privileges; anon and
-- authenticated remain ungranted and RLS has no public policy.
revoke all privileges on table
  public.lp_events,
  public.lp_surveys,
  public.lp_consents,
  public.lp_admin_login_audit,
  public.lp_survey_progress
from anon, authenticated, public;
grant usage on schema public to service_role;
grant select, insert, delete on public.lp_events, public.lp_surveys, public.lp_consents to service_role;
grant select, insert on public.lp_admin_login_audit to service_role;
-- lp_survey_progress alone needs UPDATE: PostgREST upserts it via
-- INSERT ... ON CONFLICT (dedupe_key) DO UPDATE as answers accumulate.
grant select, insert, update, delete on public.lp_survey_progress to service_role;

-- Intentionally do not add public policies. Browser requests cannot access
-- these tables; Route Handlers use the server-only service role.
