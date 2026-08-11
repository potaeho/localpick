import Link from "next/link";
import type { Metadata } from "next";
import { getProductsByRegion, regions } from "@/lib/products";

export const metadata: Metadata = {
  title: "지역별 보기 - LOCAL PICK",
  description: "LOCAL PICK이 상품을 가져오는 지역들을 소개합니다.",
};

export default function RegionsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <h1 className="text-2xl font-bold text-lp-ink sm:text-3xl">지역</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-lp-gray-700">
        상품이 만들어진 곳입니다. 각 지역에서 무엇을 볼 수 있는지도 함께
        정리했습니다.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => (
          <li key={region.id}>
            <Link
              href={`/regions/${region.id}`}
              className="flex h-full flex-col rounded-xl border border-lp-gray-300 bg-white p-5 hover:border-lp-green focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
            >
              <span className="text-xs text-lp-gray-500">
                {region.province}
              </span>
              <span className="mt-1 text-lg font-bold text-lp-ink">
                {region.name}
              </span>
              <span className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-lp-gray-700">
                {region.description}
              </span>
              <span className="mt-4 text-xs text-lp-green">
                상품 {getProductsByRegion(region.id).length}개
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
