import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createAnonymousSession,
  getVerifiedAnonymousSessionId,
  hasAnonymousSessionConfiguration,
} from "@/lib/anonymous-session";

export const SESSION_COOKIE = "lp_sid";
// proxy는 next/headers를 쓰는 서버 인증 모듈을 가져오지 않는다. 실제 서명
// 검증은 admin protected layout과 Route Handler에서 ADMIN_SESSION_COOKIE로 한다.
const ADMIN_SESSION_COOKIE = "lp_admin";

/**
 * Next.js 16부터 Middleware의 이름이 Proxy로 바뀌었다. 동작은 같다.
 *
 * 여기서는 익명 세션 ID만 발급한다. 이 ID가 "상세 페이지를 본 사람"과
 * "구매 버튼을 누른 사람"을 같은 사람으로 묶어주는 유일한 열쇠이며,
 * 개인을 식별하는 정보는 담지 않는다.
 */
export async function proxy(request: NextRequest) {
  if (!hasAnonymousSessionConfiguration()) {
    return new NextResponse("Session configuration is unavailable", { status: 503 });
  }
  const pathname = request.nextUrl.pathname;
  const response =
    pathname.startsWith("/admin") && pathname !== "/admin/login" && !request.cookies.has(ADMIN_SESSION_COOKIE)
      ? NextResponse.redirect(new URL("/admin/login", request.url))
      : NextResponse.next();

  if (!(await getVerifiedAnonymousSessionId(request.cookies.get(SESSION_COOKIE)?.value))) {
    response.cookies.set(SESSION_COOKIE, await createAnonymousSession(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // maxAge/expires를 넣지 않는 브라우저 세션 쿠키다. 브라우저를 닫으면
      // 새 세션이 시작되어 실험 참가자를 장기간 연결하지 않는다.
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * 정적 자산을 제외한 모든 경로.
     * API 라우트도 포함해야 첫 요청부터 세션 쿠키가 붙는다.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
