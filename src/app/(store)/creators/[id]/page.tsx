import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProductCard } from "@/components/store/ProductCard";
import {
  creators,
  getCreator,
  getProductsByCreator,
  getRegion,
} from "@/lib/products";

export function generateStaticParams() {
  return creators.map((creator) => ({ id: creator.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/creators/[id]">): Promise<Metadata> {
  const { id } = await params;
  const creator = getCreator(id);
  if (!creator) return {};

  return {
    title: `${creator.name} ${creator.title} - LOCAL PICK`,
    description: creator.philosophy,
  };
}

/**
 * 생산자 이야기.
 *
 * 이 페이지에 도달했다는 것은 소비자가 상품을 넘어 만든 사람에게 관심을
 * 보였다는 뜻이다 — 신뢰 가설과 지역 연결 가설을 잇는 지점.
 */
export default async function CreatorPage({
  params,
}: PageProps<"/creators/[id]">) {
  const { id } = await params;
  const creator = getCreator(id);
  if (!creator) notFound();

  const region = getRegion(creator.regionId);
  const creatorProducts = getProductsByCreator(creator.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
      <div className="flex items-start gap-5">
        <span
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lp-green-light text-2xl font-bold text-lp-green"
        >
          {creator.name.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-lp-ink">{creator.name}</h1>
          <p className="mt-1 text-lp-gray-700">{creator.title}</p>
          <p className="mt-2 text-sm text-lp-gray-500">
            {region && (
              <Link
                href={`/regions/${region.id}`}
                className="underline underline-offset-4 hover:text-lp-green"
              >
                {region.province} {region.name}
              </Link>
            )}
            {" · "}
            {creator.since}부터
          </p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xs font-medium text-lp-gray-500">어떻게 시작했나</h2>
        <p className="mt-3 leading-loose text-lp-gray-900">{creator.story}</p>
      </section>

      <blockquote className="mt-8 rounded-xl border-l-4 border-lp-orange bg-white p-5 leading-loose text-lp-gray-900">
        {creator.philosophy}
      </blockquote>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-lp-ink">
          {creator.name}님이 만든 상품
        </h2>
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
          {creatorProducts.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
