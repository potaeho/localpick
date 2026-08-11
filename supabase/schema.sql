-- LOCAL PICK production storage. Run this in the Supabase SQL Editor before
-- deploying with STORAGE_ADAPTER=supabase. Keep the service-role key server-only.
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
create index if not exists lp_surveys_created_at_idx on public.lp_surveys (created_at);
create index if not exists lp_surveys_session_id_idx on public.lp_surveys (session_id);
create index if not exists lp_consents_created_at_idx on public.lp_consents (created_at);
create index if not exists lp_consents_session_id_idx on public.lp_consents (session_id);
create index if not exists lp_admin_login_audit_failures_idx
  on public.lp_admin_login_audit (ip_hash, attempted_at desc) where success is false;

alter table public.lp_events enable row level security;
alter table public.lp_surveys enable row level security;
alter table public.lp_consents enable row level security;
alter table public.lp_admin_login_audit enable row level security;

-- New Supabase projects may not expose new public tables to the Data API by
-- default. The server's service_role needs these explicit privileges; anon and
-- authenticated remain ungranted and RLS has no public policy.
revoke all privileges on table
  public.lp_events,
  public.lp_surveys,
  public.lp_consents,
  public.lp_admin_login_audit
from anon, authenticated, public;
grant usage on schema public to service_role;
grant select, insert, delete on public.lp_events, public.lp_surveys, public.lp_consents to service_role;
grant select, insert on public.lp_admin_login_audit to service_role;

-- Intentionally do not add public policies. Browser requests cannot access
-- these tables; Route Handlers use the server-only service role.
