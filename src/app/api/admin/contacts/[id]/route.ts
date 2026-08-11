import { isAdminSession } from "@/lib/admin-auth";
import { storage } from "@/lib/store";

/**
 * 인터뷰 연락처 원문 열람.
 *
 * 대시보드는 기본적으로 마스킹된 값만 보여주고, 실제 연락처는 담당자가
 * 명시적으로 요청할 때만 이 엔드포인트로 한 건씩 가져온다. 목록 응답에
 * 원문을 실어 보내면 화면을 열어두기만 해도 개인정보가 브라우저에 남는다.
 */
export async function GET(
  _request: Request,
  context: RouteContext<"/api/admin/contacts/[id]">,
) {
  if (!(await isAdminSession())) {
    return new Response("unauthorized", { status: 401 });
  }

  const { id } = await context.params;
  const consents = await storage.readConsents();
  const consent = consents.find((item) => item.id === id);

  if (!consent) return new Response("not found", { status: 404 });

  // 열람 사실을 서버 로그에 남긴다
  console.info(
    `[admin] 인터뷰 연락처 열람: consent=${consent.id} at=${new Date().toISOString()}`,
  );

  return Response.json({
    name: consent.name,
    contact: consent.contact,
    contactType: consent.contactType,
    noticeVersion: consent.noticeVersion,
  });
}
