import { isAdminSession } from "@/lib/admin-auth";
import { getDashboardStats } from "@/lib/metrics";
import { products } from "@/lib/products";

/**
 * CSV 내보내기.
 *
 * 인터뷰 연락처는 **일부러 넣지 않는다**. CSV는 메신저나 메일로 쉽게
 * 옮겨다니는 형식이라, 개인정보가 여기 실리면 통제 범위를 곧바로 벗어난다.
 * 연락처는 대시보드에서 한 건씩 열람하는 경로만 남겨둔다.
 */
function toCsv(rows: (string | number)[][]): string {
  const escape = (cell: string | number) => {
    const raw = String(cell).replace(/\u0000/g, "");
    // Formula prefixes after whitespace are also interpreted by spreadsheets.
    const value = /^[\s\uFEFF]*[=+\-@]/.test(raw) ? `'${raw}` : raw;
    return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  };
  return rows.map((row) => row.map(escape).join(",")).join("\r\n");
}

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return new Response("unauthorized", { status: 401 });
  }

  const type = new URL(request.url).searchParams.get("type") ?? "products";
  const stats = await getDashboardStats();
  const names = new Map(products.map((p) => [p.slug, p.name]));

  let rows: (string | number)[][];
  let filename: string;

  if (type === "surveys") {
    filename = "local-pick-surveys";
    rows = [
      [
        "응답시각",
        "상품",
        "트리거",
        "디바이스",
        "캠페인",
        "누른이유",
        "이유상세",
        "사용상황",
        "구매경험",
        "이용채널",
        "판단기준",
        "지역생산자관심",
        "인터뷰의사",
      ],
      ...stats.surveyResponses.map((r) => [
        r.ts,
        r.productSlug ? (names.get(r.productSlug) ?? r.productSlug) : "",
        r.trigger,
        r.device,
        r.utmCampaign ?? "",
        r.buyReason ?? "",
        r.buyReasonDetail ?? "",
        r.useContext ?? "",
        r.purchaseExperience,
        (r.channels ?? []).join(" | "),
        (r.trustFactors ?? []).join(" | "),
        r.regionInterest ?? "",
        r.interviewWilling ? "있음" : "없음",
      ]),
    ];
  } else if (type === "campaigns") {
    filename = "local-pick-campaigns";
    rows = [
      ["캠페인", "상세도달", "구매클릭", "설문완료", "인터뷰동의"],
      ...stats.campaigns.map((c) => [
        c.campaign,
        c.detailViews,
        c.buyClicks,
        c.surveys,
        c.consents,
      ]),
    ];
  } else {
    filename = "local-pick-products";
    rows = [
      ["상품", "상세도달", "구매클릭", "구매버튼클릭률(%)", "설문완료", "인터뷰동의"],
      ...stats.productFunnels.map((p) => [
        names.get(p.productSlug) ?? p.productSlug,
        p.detailViews,
        p.buyClicks,
        p.clickThroughRate.toFixed(1),
        p.surveyCompletes,
        p.interviewConsents,
      ]),
    ];
  }

  const date = new Date().toISOString().slice(0, 10);

  // Excel이 UTF-8로 열도록 BOM을 붙인다
  return new Response(`﻿${toCsv(rows)}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}-${date}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
