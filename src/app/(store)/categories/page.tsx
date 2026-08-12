import Link from "next/link";
import type { Metadata } from "next";

import { ProductImage } from "@/components/store/ProductImage";
import { categories, getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "카테고리 - LOCAL PICK",
  description: "LOCAL PICK의 상품을 카테고리별로 둘러봅니다.",
};

export default function CategoriesIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <h1 className="text-2xl font-bold text-lp-ink sm:text-3xl">카테고리</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-lp-gray-700">
        무엇을 찾으시는지부터 골라보세요.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const items = getProductsByCategory(category.id);
          return (
            <li key={category.id}>
              <Link
                href={`/categories/${category.id}`}
                className="flex h-full items-center gap-4 rounded-xl border border-lp-gray-300 bg-white p-4 hover:border-lp-green focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-green focus-visible:ring-offset-2"
              >
                {items[0] && (
                  <ProductImage
                    slug={items[0].slug}
                    kind={items[0].imageKind}
                    label={category.name}
                    imageSrc={items[0].detailImages?.[0]}
                    sizes="64px"
                    className="h-16 w-16 shrink-0 rounded-lg"
                  />
                )}
                <span className="min-w-0">
                  <span className="block font-bold text-lp-ink">
                    {category.name}
                    <span className="ml-2 text-sm font-normal text-lp-gray-500">
                      {items.length}개
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-lp-gray-700">
                    {category.description}
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
