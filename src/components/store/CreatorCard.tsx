import type { Creator, Region } from "@/lib/types";

/**
 * 상품 상세의 생산자 카드.
 *
 * 이 카드의 클릭률이 "원산지·생산자 정보가 구매 판단에 영향을 주는가"라는
 * 신뢰 가설의 행동 신호가 된다. (클릭 이벤트는 TrackedLink가 기록한다)
 */
export function CreatorCard({
  creator,
  region,
  children,
}: {
  creator: Creator;
  region?: Region;
  /** 생산자 이야기로 가는 링크 — 클릭 추적을 위해 부모가 주입한다 */
  children: React.ReactNode;
}) {
  const isBrand = creator.kind === "brand";
  const place = region ? `${region.province} ${region.name}` : "";
  const meta = [place, creator.since ? `${creator.since}부터` : ""]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="rounded-xl border border-lp-gray-300 bg-white p-5">
      <h2 className="text-xs font-medium text-lp-gray-500">
        {isBrand ? "만든 곳" : "만든 사람"}
      </h2>

      <div className="mt-3 flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lp-green-light text-lg font-bold text-lp-green"
        >
          {creator.name.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <p className="font-bold text-lp-ink">
            {creator.name}
            <span className="ml-2 text-sm font-normal text-lp-gray-700">
              {creator.title}
            </span>
          </p>
          {meta && <p className="mt-0.5 text-sm text-lp-gray-500">{meta}</p>}
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-lp-gray-700">
        {creator.story}
      </p>

      <div className="mt-4">{children}</div>
    </section>
  );
}
