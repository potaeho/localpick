import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";

/**
 * 상품 스펙 테이블.
 *
 * 마켓컬리 상품 상세의 정보 테이블 구조를 따른다. 항목은 Product 스키마가
 * 강제하므로 모든 상품이 같은 줄 수, 같은 순서로 렌더링된다 — 기획서 5장이
 * 요구하는 상품 간 조건 통제가 여기서 지켜진다.
 */
export function SpecTable({ product }: { product: Product }) {
  const rows: [string, string][] = [
    ["배송", product.deliveryMethod],
    ["배송 일정", product.deliveryEta],
    [
      "배송비",
      `${formatPrice(product.shippingFee)}원 (${formatPrice(product.freeShippingOver)}원 이상 무료)`,
    ],
    ["판매자", product.seller],
    ["포장타입", product.packaging],
    ["판매단위", product.unit],
    ["중량 · 용량", product.weight],
    ["소비기한", product.expiry],
    ["안내사항", product.notes],
  ];

  return (
    <dl className="divide-y divide-lp-gray-100 border-y border-lp-gray-100 text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="flex gap-lp-lg py-lp-md">
          <dt className="w-24 shrink-0 text-lp-gray-500">{label}</dt>
          <dd className="flex-1 leading-relaxed text-lp-gray-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
