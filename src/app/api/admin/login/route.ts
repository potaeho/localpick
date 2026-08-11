import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSession,
  hasAdminConfiguration,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { isLoginRateLimited, LOGIN_RETRY_AFTER_SECONDS, loginAttemptKey, recordLoginAttempt } from "@/lib/admin-login-security";

export async function POST(request: Request) {
  if (!hasAdminConfiguration()) {
    return NextResponse.json({ error: "관리자 인증 환경변수가 설정되지 않았습니다." }, { status: 503 });
  }
  let key: string;
  try {
    key = await loginAttemptKey(request);
    if (await isLoginRateLimited(key)) {
      return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 429, headers: { "Retry-After": String(LOGIN_RETRY_AFTER_SECONDS) } });
    }
  } catch {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "로그인 보안 확인을 완료하지 못했습니다." }, { status: 503 });
    key = "development-audit-unavailable";
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  const authenticated = verifyAdminPassword((body as { password?: unknown }).password);
  try {
    await recordLoginAttempt(key, authenticated);
  } catch {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "로그인 보안 기록을 저장하지 못했습니다." }, { status: 503 });
  }
  if (!authenticated) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSession(), adminSessionCookieOptions);
  return response;
}
