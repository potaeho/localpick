import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "lp_admin";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 8;

type AdminSessionPayload = {
  v: 1;
  exp: number;
};

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

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return Buffer.from(signature).toString("base64url");
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  let mismatch = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < length; index += 1) {
    mismatch |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return mismatch === 0;
}

/** 로그인 비밀번호 비교 및 세션 서명에 필요한 운영 환경변수의 존재를 확인한다. */
export function hasAdminConfiguration(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && getSecret());
}

export function verifyAdminPassword(candidate: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return (
    typeof candidate === "string" &&
    typeof expected === "string" &&
    constantTimeEqual(candidate, expected)
  );
}

export async function createAdminSession(): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");

  const payload: AdminSessionPayload = {
    v: 1,
    exp: Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS,
  };
  const encoded = base64urlEncode(JSON.stringify(payload));
  return `${encoded}.${await sign(encoded, secret)}`;
}

export async function verifyAdminSessionToken(token?: string): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !token) return false;

  const [encoded, suppliedSignature, ...extra] = token.split(".");
  if (!encoded || !suppliedSignature || extra.length) return false;
  const expectedSignature = await sign(encoded, secret);
  if (!constantTimeEqual(suppliedSignature, expectedSignature)) return false;

  const decoded = base64urlDecode(encoded);
  if (!decoded) return false;
  try {
    const payload = JSON.parse(decoded) as Partial<AdminSessionPayload>;
    return payload.v === 1 && typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/** 서버 컴포넌트와 Route Handler에서 실제 권한 검증에 사용한다. */
export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export const adminSessionCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_LIFETIME_SECONDS,
};
