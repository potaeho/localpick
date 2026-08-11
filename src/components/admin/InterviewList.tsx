import type { MaskedInterview } from "@/lib/types";
import { MaskedContact } from "./MaskedContact";

export function InterviewList({ interviews }: { interviews: MaskedInterview[] }) {
  return <div className="overflow-x-auto rounded-xl border border-lp-gray-200"><table className="w-full min-w-150 text-left text-sm"><thead className="bg-lp-cream text-lp-gray-700"><tr><th className="p-3">동의 시각</th><th className="p-3">이름</th><th className="p-3">연락처</th><th className="p-3">상품</th><th className="p-3">캠페인</th></tr></thead><tbody>{interviews.map((interview) => <tr key={interview.id} className="border-t border-lp-gray-100"><td className="p-3">{new Date(interview.ts).toLocaleString("ko-KR")}</td><td className="p-3">{interview.name}</td><td className="p-3"><MaskedContact interviewId={interview.id} maskedContact={interview.maskedContact} /></td><td className="p-3">{interview.productSlug ?? "—"}</td><td className="p-3">{interview.utmCampaign ?? "—"}</td></tr>)}</tbody></table>{!interviews.length && <p className="p-6 text-center text-sm text-lp-gray-500">인터뷰 동의자가 없습니다.</p>}</div>;
}
