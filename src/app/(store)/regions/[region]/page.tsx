import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { KoreaMap } from "@/components/store/KoreaMap";
import { ProductCard } from "@/components/store/ProductCard";
import { VisitInfoDisclosure } from "@/components/store/VisitInfoDisclosure";
import {
  creators,
  getProductsByRegion,
  getRegion,
  regions,
} from "@/lib/products";

export function generateStaticParams() {
  return regions.map((region) => ({ region: region.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/regions/[region]">): Promise<Metadata> {
  const { region: regionId } = await params;
  const region = getRegion(regionId);
  if (!region) return {};

  return {
    title: `${region.province} ${region.name} - LOCAL PICK`,
    description: region.description,
  };
}

export default async function RegionPage({
  params,
}: PageProps<"/regions/[region]">) {
  const { region: regionId } = await params;
  const region = getRegion(regionId);
  if (!region) notFound();

  const regionProducts = getProductsByRegion(region.id);
  const regionCreators = creators.filter((c) => c.regionId === region.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <p className="text-sm text-lp-gray-500">{region.province}</p>
      <h1 className="mt-1 text-2xl font-bold text-lp-ink sm:text-3xl">
        {region.name}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-lp-gray-900 sm:text-base">
        {region.description}
      </p>

      <div className="mt-6">
        <KoreaMap
          regions={regions}
          productCounts={Object.fromEntries(
            regions.map((r) => [r.id, getProductsByRegion(r.id).length]),
          )}
          activeRegionId={region.id}
        />
      </div>

      {regionCreators.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-lp-ink">
            {region.name}의 생산자
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {regionCreators.map((creator) => (
              <li key={creator.id}>
                <Link
                  href={`/creators/${creator.id}`}
                  className="flex items-start gap-4 rounded-xl border border-lp-gray-300 bg-white p-4 hover:border-lp-green focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lp-green-light font-bold text-lp-green"
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
                    <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-lp-gray-700">
                      {creator.philosophy}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <VisitInfoDisclosure
        regionId={region.id}
        regionName={region.name}
        items={region.visitInfo}
      />

      <section className="mt-10">
        <h2 className="text-lg font-bold text-lp-ink">
          {region.name}에서 온 상품{" "}
          <span className="text-lp-gray-500">{regionProducts.length}개</span>
        </h2>
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {regionProducts.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
