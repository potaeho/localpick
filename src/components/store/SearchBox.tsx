"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getRegion, products, searchProducts } from "@/lib/products";
import { ProductImage } from "./ProductImage";

const MAX_SUGGESTIONS = 6;

const CHOSUNG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

/** 완성형 한글 음절을 초성으로 바꾼다. 한글이 아닌 글자는 그대로 둔다. */
function toChosung(str: string): string {
  let result = "";
  for (const ch of str) {
    const code = ch.charCodeAt(0) - 0xac00;
    result += code >= 0 && code <= 11171 ? CHOSUNG[Math.floor(code / 588)] : ch;
  }
  return result;
}

const isChosungOnly = (str: string) => /^[ㄱ-ㅎ]+$/.test(str);

/**
 * 초성만 입력했을 때(예: "ㅅㅊ")도 상품·지역명이 매칭되도록 하는 검색.
 * "순창"을 다 치기 전, 자음만 눌러도 후보가 바로 뜨는 한국어 앱 특유의
 * 자동완성 방식을 따른다.
 */
function searchByChosung(query: string) {
  return products.filter((product) => {
    const region = getRegion(product.regionId);
    const fields = [product.name, region?.name ?? "", product.tagline];
    return fields.some((field) => toChosung(field).includes(query));
  });
}

/**
 * 검색창 자동완성.
 *
 * 구글 검색창처럼 입력 중에 우리 상품 데이터 안에서 후보를 바로 보여준다.
 * 외부 검색엔진으로 나가지 않고, 클릭하면 해당 상품 상세로 바로 이동한다.
 * Enter나 검색 버튼을 누르면 기존처럼 `/?q=` 검색 결과 페이지로 이동한다.
 */
export function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const suggestions = !trimmedQuery
    ? []
    : isChosungOnly(trimmedQuery)
      ? searchByChosung(trimmedQuery).slice(0, MAX_SUGGESTIONS)
      : searchProducts(trimmedQuery).slice(0, MAX_SUGGESTIONS);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      setOpen(false);
      router.push(`/products/${suggestions[activeIndex].slug}`);
    } else {
      setOpen(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = open && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative ml-auto w-full max-w-md">
      <form action="/" onSubmit={handleSubmit}>
        <div className="relative">
          <label htmlFor="store-search" className="sr-only">
            상품 검색
          </label>
          <input
            id="store-search"
            type="search"
            name="q"
            autoComplete="off"
            placeholder="지역이나 상품을 검색해보세요"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="store-search-suggestions"
            aria-autocomplete="list"
            className="h-10 w-full rounded-full border border-lp-gray-300 bg-lp-gray-100 pl-4 pr-11 text-sm placeholder:text-lp-gray-500 focus:border-lp-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-lp-green"
          />
          <button
            type="submit"
            aria-label="검색"
            className="absolute right-1 top-1 flex h-8 w-9 items-center justify-center rounded-full text-lp-gray-700 hover:text-lp-green"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
              <path
                d="M13.5 13.5 L17 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </form>

      {showDropdown && (
        <ul
          id="store-search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 mt-lp-sm overflow-hidden rounded-lp-card border border-lp-gray-300 bg-white shadow-lg"
        >
          {suggestions.map((product, index) => {
            const region = getRegion(product.regionId);
            const active = index === activeIndex;
            return (
              <li key={product.slug} role="option" aria-selected={active}>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center gap-lp-md px-lp-md py-2.5 ${
                    active ? "bg-lp-green-light" : "hover:bg-lp-gray-100"
                  }`}
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-lp-gray-100">
                    <ProductImage
                      slug={product.slug}
                      kind={product.imageKind}
                      label={product.name}
                      imageSrc={product.cardImage ?? product.detailImages?.[0]}
                      sizes="40px"
                      className="h-10 w-10"
                    />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-lp-ink">
                      {product.name}
                    </span>
                    <span className="block truncate text-xs text-lp-gray-500">
                      {region?.name ? `${region.name} · ` : ""}
                      {product.tagline}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
