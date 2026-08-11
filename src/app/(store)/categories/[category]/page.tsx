import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProductCard } from "@/components/store/ProductCard";
import { CategoryChips } from "@/components/store/CategoryChips";
import {
  categories,
  getCategory,
  getProductsByCategory,
} from "@/lib/products";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/categories/[category]">): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);
  if (!category) return {};

  return {
    title: `${category.name} - LOCAL PICK`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/categories/[category]">) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);
  if (!category) notFound();

  const items = getProductsByCategory(category.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <h1 className="text-2xl font-bold text-lp-ink sm:text-3xl">
        {category.name}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-lp-gray-700">
        {category.description}
      </p>

      <CategoryChips activeId={category.id} />

      <section className="mt-8">
        <h2 className="sr-only">{category.name} 상품 목록</h2>
        <p className="text-sm text-lp-gray-500">상품 {items.length}개</p>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
