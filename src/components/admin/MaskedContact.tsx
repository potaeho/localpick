"use client";

import { useState } from "react";

/**
 * 연락처는 기본적으로 마스킹된 값만 보여준다.
 *
 * 원문은 목록 HTML에 절대 싣지 않는다. 대시보드를 열어두기만 해도 개인정보가
 * 브라우저에 남기 때문이다. 담당자가 '열람'을 눌렀을 때만 서버에서 한 건씩
 * 가져오고, 그 사실은 서버 로그에 기록된다.
 */
export function MaskedContact({
  interviewId,
  maskedContact,
}: {
  interviewId: string;
  maskedContact: string;
}) {
  const [revealed, setRevealed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (revealed) {
    return <span className="font-medium text-lp-ink">{revealed}</span>;
  }

  return (
    <span className="flex items-center gap-2">
      <span className="tabular-nums text-lp-gray-700">{maskedContact}</span>
      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            const response = await fetch(`/api/admin/contacts/${interviewId}`);
            if (!response.ok) throw new Error("failed");
            const data = (await response.json()) as { contact: string };
            setRevealed(data.contact);
          } catch {
            setRevealed("열람 실패");
          } finally {
            setLoading(false);
          }
        }}
        className="shrink-0 rounded border border-lp-gray-300 px-2 py-0.5 text-xs text-lp-gray-700 hover:bg-lp-gray-100 disabled:opacity-50"
      >
        {loading ? "여는 중" : "열람"}
      </button>
    </span>
  );
}
