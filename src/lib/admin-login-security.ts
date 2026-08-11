import "server-only";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const localFailures = new Map<string, number[]>();

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceRole ? { url, serviceRole } : null;
}

function authHeaders(serviceRole: string): HeadersInit {
  return serviceRole.startsWith("eyJ")
    ? { apikey: serviceRole, Authorization: `Bearer ${serviceRole}` }
    : { apikey: serviceRole };
}

async function hash(value: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must be configured");
  const scoped = `local-pick:admin-login-audit:v1:${secret}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(scoped), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const result = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Buffer.from(result).toString("base64url");
}

/** Raw IP addresses are not retained: only a keyed digest scopes rate limits. */
export async function loginAttemptKey(request: Request): Promise<string> {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return hash((forwarded || request.headers.get("x-real-ip") || "unknown").slice(0, 120));
}

function activeLocalFailures(key: string): number[] {
  const failures = (localFailures.get(key) ?? []).filter((time) => time >= Date.now() - WINDOW_MS);
  localFailures.set(key, failures);
  return failures;
}

async function supabase(path: string, init?: RequestInit): Promise<Response> {
  const settings = config();
  if (!settings) throw new Error("Supabase audit storage is unavailable");
  return fetch(`${settings.url}/rest/v1/${path}`, {
    ...init,
    headers: { ...authHeaders(settings.serviceRole), "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
}

export async function isLoginRateLimited(key: string): Promise<boolean> {
  if (!config()) return activeLocalFailures(key).length >= MAX_FAILURES;
  const cutoff = new Date(Date.now() - WINDOW_MS).toISOString();
  const response = await supabase(`lp_admin_login_audit?select=id&ip_hash=eq.${encodeURIComponent(key)}&success=is.false&attempted_at=gte.${encodeURIComponent(cutoff)}&limit=${MAX_FAILURES}`);
  if (!response.ok) throw new Error(`Admin audit lookup failed (${response.status})`);
  return (await response.json() as unknown[]).length >= MAX_FAILURES;
}

export async function recordLoginAttempt(key: string, success: boolean): Promise<void> {
  if (!config()) {
    if (success) localFailures.delete(key); else activeLocalFailures(key).push(Date.now());
    return;
  }
  const response = await supabase("lp_admin_login_audit", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ id: crypto.randomUUID(), ip_hash: key, success }),
  });
  if (!response.ok) throw new Error(`Admin audit write failed (${response.status})`);
}

export const LOGIN_RETRY_AFTER_SECONDS = Math.ceil(WINDOW_MS / 1000);
