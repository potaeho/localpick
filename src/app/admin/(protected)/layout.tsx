import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdminSession } from "@/lib/admin-auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

/**
 * 관리자 영역의 **실제** 권한 게이트.
 *
 * Next.js 문서는 Proxy(구 Middleware)를 완전한 인증 수단으로 쓰지 말라고
 * 명시한다. proxy.ts는 쿠키 유무만 보는 낙관적 리다이렉트만 하고, 서명 검증과
 * 만료 확인은 여기 서버 컴포넌트에서 한다.
 *
 * 로그인 페이지는 이 라우트 그룹 바깥(/admin/login)에 두어 리다이렉트 루프를
 * 피한다.
 */
export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminSession())) redirect("/admin/login");

  return (
    <div className="min-h-dvh bg-lp-cream">
      <header className="border-b border-lp-gray-300 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-lp-ink">
              LOCAL PICK 페이크도어 실험 대시보드
            </p>
            <p className="truncate text-xs text-lp-gray-500">
              태두리 내부용 · 개인정보 포함
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              className="hidden h-9 items-center rounded-lg border border-lp-gray-300 px-3 text-sm text-lp-gray-700 hover:bg-lp-gray-100 sm:inline-flex"
            >
              스토어 보기
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
