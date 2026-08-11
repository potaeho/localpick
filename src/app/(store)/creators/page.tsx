import Link from "next/link";
import type { Metadata } from "next";
import { creators, getProductsByCreator, getRegion } from "@/lib/products";

export const metadata: Metadata = {
  title: "생산자 - LOCAL PICK",
  description: "LOCAL PICK의 상품을 만드는 생산자들을 소개합니다.",
};

export default function CreatorsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <h1 className="text-2xl font-bold text-lp-ink sm:text-3xl">생산자</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-lp-gray-700">
        상품을 직접 기르고 만드는 사람들입니다.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {creators.map((creator) => {
          const region = getRegion(creator.regionId);
          return (
            <li key={creator.id}>
              <Link
                href={`/creators/${creator.id}`}
                className="flex h-full items-start gap-4 rounded-xl border border-lp-gray-300 bg-white p-5 hover:border-lp-green focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lp-green-light text-lg font-bold text-lp-green"
                >
                  {creator.name.slice(0, 1)}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-lp-ink">
                    {creator.name}
                    <span className="ml-2 text-sm font-normal text-lp-gray-700">
                      {creator.title}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-sm text-lp-gray-500">
                    {region ? `${region.province} ${region.name}` : ""} · 상품{" "}
                    {getProductsByCreator(creator.id).length}개
                  </span>
                  <span className="mt-2 block line-clamp-2 text-sm leading-relaxed text-lp-gray-700">
                    {creator.philosophy}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
