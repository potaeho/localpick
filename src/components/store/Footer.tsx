import Link from "next/link";
import { PRIVACY_CONTACT } from "@/lib/consent";
import { LogoMark } from "./Logo";

/**
 * 스토어 푸터.
 *
 * 사업자등록번호·통신판매업 신고번호·인증 마크는 넣지 않는다. 실재하지 않는
 * 등록 정보를 표시하는 것은 기획서 9장이 금지하는 "존재하지 않는 인증" 표기에
 * 해당한다. 문의 이메일은 개인정보 삭제 요청 창구로도 쓰이므로, 실제 광고
 * 집행 전 팀이 실제로 수신하는 주소로 교체해야 한다.
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-lp-gray-300 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <div className="flex flex-col gap-lp-section sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <span className="flex items-center gap-lp-sm text-lp-green">
              <LogoMark className="h-8 w-6" />
              <span className="text-lg font-bold tracking-tight">
                LOCAL PICK
              </span>
            </span>
            <p className="mt-lp-md text-lp-body text-lp-gray-700">
              누가, 어디서, 어떻게 만들었는지 확인할 수 있는 로컬 상품을
              모았습니다.
            </p>
          </div>

          <nav aria-label="푸터 메뉴">
            <ul className="flex flex-col gap-lp-sm text-lp-body text-lp-gray-700">
              <li>
                <Link href="/regions" className="hover:text-lp-green">
                  지역별 보기
                </Link>
              </li>
              <li>
                <Link href="/creators" className="hover:text-lp-green">
                  생산자 보기
                </Link>
              </li>
              <li>
                {PRIVACY_CONTACT ? (
                  <a
                    href={`mailto:${PRIVACY_CONTACT}`}
                    className="hover:text-lp-green"
                  >
                    문의 · 개인정보 삭제 요청
                  </a>
                ) : (
                  <span className="text-lp-gray-500">문의 채널 준비 중</span>
                )}
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-8 border-t border-lp-gray-100 pt-6 text-xs text-lp-gray-500">
          © {new Date().getFullYear()} 태두리 · LOCAL PICK
        </p>
      </div>
    </footer>
  );
}
