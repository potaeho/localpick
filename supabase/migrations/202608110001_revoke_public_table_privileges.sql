-- Follow-up hardening for projects where Supabase's default grants made these
-- tables visible to anon/authenticated despite RLS having no policies.
-- Idempotent: REVOKE/GRANT are safe to run repeatedly and affect only LOCAL PICK tables.
begin;

revoke all privileges on table
  public.lp_events,
  public.lp_surveys,
  public.lp_consents,
  public.lp_admin_login_audit
from anon, authenticated, public;

-- The Route Handlers use the server-only service role through the Data API.
-- `resolution=ignore-duplicates` maps to conflict-ignore inserts, so UPDATE is
-- intentionally not granted. SELECT supports metrics and canonical retry lookup.
grant select, insert, delete on table
  public.lp_events,
  public.lp_surveys,
  public.lp_consents
to service_role;
grant select, insert on table public.lp_admin_login_audit to service_role;

commit;
