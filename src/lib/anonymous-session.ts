type AnonymousSessionPayload = { v: 1; sid: string; exp: number };

const SESSION_LIFETIME_SECONDS = 60 * 60 * 12;

function getSecret(): string | null {
  const secret = process.env.SESSION_SIGNING_SECRET;
  if (secret && secret.length >= 32) return secret;

  // Legacy local checkouts can continue QA with their existing admin secret.
  // A domain prefix keeps this derived HMAC input separate from admin sessions.
  // Production never falls back: it requires a dedicated session secret.
  const adminSecret = process.env.ADMIN_SESSION_SECRET;
  if (process.env.NODE_ENV !== "production" && adminSecret && adminSecret.length >= 32) {
    return `local-pick:anonymous-session:v1:${adminSecret}`;
  }
  return null;
}

function base64urlEncode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function base64urlDecode(value: string): string | null {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  let mismatch = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < Math.max(leftBytes.length, rightBytes.length); index += 1) {
    mismatch |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return mismatch === 0;
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Buffer.from(signature).toString("base64url");
}

export function hasAnonymousSessionConfiguration(): boolean {
  return Boolean(getSecret());
}

/** Browser-session cookie value. The signed payload prevents forged session IDs. */
export async function createAnonymousSession(): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("SESSION_SIGNING_SECRET must be at least 32 characters");
  const payload: AnonymousSessionPayload = {
    v: 1,
    sid: crypto.randomUUID(),
    exp: Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS,
  };
  const encoded = base64urlEncode(JSON.stringify(payload));
  return `${encoded}.${await sign(encoded, secret)}`;
}

export async function getVerifiedAnonymousSessionId(token?: string): Promise<string | null> {
  const secret = getSecret();
  if (!secret || !token) return null;
  const [encoded, receivedSignature, ...remaining] = token.split(".");
  if (!encoded || !receivedSignature || remaining.length) return null;
  if (!constantTimeEqual(receivedSignature, await sign(encoded, secret))) return null;
  const decoded = base64urlDecode(encoded);
  if (!decoded) return null;
  try {
    const payload = JSON.parse(decoded) as Partial<AnonymousSessionPayload>;
    return payload.v === 1 && typeof payload.sid === "string" && /^[0-9a-f-]{36}$/i.test(payload.sid) && typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000)
      ? payload.sid
      : null;
  } catch {
    return null;
  }
}
