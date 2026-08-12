import type { AbandonedSurveyRow } from "@/lib/types";

/**
 * 설문을 끝내지 못하고 나간 시도들.
 *
 * 완료된 설문 집계(문항별 통계 등)에는 절대 섞이지 않는다 — 미완성 응답이
 * 정량 지표에 끼면 "구매 이유" 같은 집계가 왜곡된다. 여기서는 오직 정성적으로,
 * "이탈 직전까지 무엇을 답했는지"를 그대로 보여준다.
 */
export function AbandonedSurveyList({
  rows,
  productNames,
}: {
  rows: AbandonedSurveyRow[];
  productNames: Record<string, string>;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-lp-gray-300 p-8 text-center text-sm text-lp-gray-500">
        이탈한 설문 시도가 없습니다.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-lp-gray-500">{rows.length}건</p>

      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-xl border border-lp-gray-300 bg-white p-4"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-lp-gray-500">
              <span>{new Date(row.ts).toLocaleString("ko-KR")}</span>
              <span>
                {row.productSlug
                  ? (productNames[row.productSlug] ?? row.productSlug)
                  : "상품 없음"}
              </span>
              <span className="rounded bg-lp-gray-100 px-1.5 py-0.5">
                {row.trigger === "buy_click" ? "구매 클릭" : "탐색 3개 후"}
              </span>
              <span>{row.device === "mobile" ? "모바일" : "데스크탑"}</span>
              {row.utmCampaign && <span>{row.utmCampaign}</span>}
              <span className="rounded bg-lp-orange-light px-1.5 py-0.5 text-lp-orange">
                7문항 중 {row.answeredCount}개 답함
              </span>
            </div>

            {row.answers.length === 0 ? (
              <p className="mt-3 text-sm text-lp-gray-500">
                첫 문항을 고르기 전에 나갔습니다.
              </p>
            ) : (
              <dl className="mt-3 space-y-2 text-sm">
                {row.answers.map((answer) => (
                  <div key={answer.label} className="flex gap-3">
                    <dt className="w-28 shrink-0 text-xs text-lp-gray-500">
                      {answer.label}
                    </dt>
                    <dd className="flex-1 leading-relaxed text-lp-gray-900">
                      {answer.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
