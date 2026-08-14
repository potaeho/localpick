import type { MaskedInterview } from "@/lib/types";
import { MaskedContact } from "./MaskedContact";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function PurposeBadge({ purposes }: { purposes: MaskedInterview["purposes"] }) {
  const label = purposes.includes("interview")
    ? purposes.includes("raffle")
      ? "인터뷰+추첨"
      : "인터뷰"
    : "추첨만";
  return (
    <Badge
      variant="outline"
      className="border-lp-green-light bg-lp-green-light text-[11px] text-lp-green"
    >
      {label}
    </Badge>
  );
}

export function InterviewList({ interviews }: { interviews: MaskedInterview[] }) {
  return (
    <div className="min-w-150 overflow-hidden rounded-lp-card border border-lp-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-lp-cream text-lp-gray-700 hover:bg-lp-cream">
            <TableHead>동의 시각</TableHead>
            <TableHead>목적</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>연락처</TableHead>
            <TableHead>상품</TableHead>
            <TableHead>캠페인</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow key={interview.id} className="border-lp-gray-100">
              <TableCell>
                {new Date(interview.ts).toLocaleString("ko-KR")}
              </TableCell>
              <TableCell>
                <PurposeBadge purposes={interview.purposes} />
              </TableCell>
              <TableCell>{interview.name}</TableCell>
              <TableCell>
                <MaskedContact
                  interviewId={interview.id}
                  maskedContact={interview.maskedContact}
                />
              </TableCell>
              <TableCell>{interview.productSlug ?? "—"}</TableCell>
              <TableCell>{interview.utmCampaign ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!interviews.length && (
        <p className="p-6 text-center text-sm text-lp-gray-500">
          동의한 연락처가 없습니다.
        </p>
      )}
    </div>
  );
}
