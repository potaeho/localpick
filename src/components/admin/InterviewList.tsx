import type { MaskedInterview } from "@/lib/types";
import { MaskedContact } from "./MaskedContact";

function PurposeBadge({ purposes }: { purposes: MaskedInterview["purposes"] }) {
  const label = purposes.includes("interview")
    ? purposes.includes("raffle")
      ? "인터뷰+추첨"
      : "인터뷰"
    : "추첨만";
  return (
    <span className="rounded border border-lp-green-light bg-lp-green-light px-1.5 py-0.5 text-[11px] text-lp-green">
      {label}
    </span>
  );
}

export function InterviewList({ interviews }: { interviews: MaskedInterview[] }) {
  return <div className="overflow-x-auto rounded-lp-card border border-lp-gray-200"><table className="w-full min-w-150 text-left text-sm"><thead className="bg-lp-cream text-lp-gray-700"><tr><th className="p-lp-md">동의 시각</th><th className="p-lp-md">목적</th><th className="p-lp-md">이름</th><th className="p-lp-md">연락처</th><th className="p-lp-md">상품</th><th className="p-lp-md">캠페인</th></tr></thead><tbody>{interviews.map((interview) => <tr key={interview.id} className="border-t border-lp-gray-100"><td className="p-lp-md">{new Date(interview.ts).toLocaleString("ko-KR")}</td><td className="p-lp-md"><PurposeBadge purposes={interview.purposes} /></td><td className="p-lp-md">{interview.name}</td><td className="p-lp-md"><MaskedContact interviewId={interview.id} maskedContact={interview.maskedContact} /></td><td className="p-lp-md">{interview.productSlug ?? "—"}</td><td className="p-lp-md">{interview.utmCampaign ?? "—"}</td></tr>)}</tbody></table>{!interviews.length && <p className="p-6 text-center text-sm text-lp-gray-500">동의한 연락처가 없습니다.</p>}</div>;
}
