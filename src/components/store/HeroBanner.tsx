"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type FeaturedProduct = {
  name: string;
  href: string;
  cardImage: string;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
  note?: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string; position?: string };
  sideLabel: string;
  featuredProducts?: FeaturedProduct[];
};

const AUTOPLAY_MS = 6000;

/** 이 비율(가로폭 대비) 이상 끌면 다음/이전 배너로 완전히 넘어간다. */
const SWIPE_COMMIT_RATIO = 0.2;

export function HeroBanner({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  function goTo(delta: number) {
    setIndex((current) => (current + delta + slides.length) % slides.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (slides.length <= 1) return;
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setPaused(true);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    setDragOffset(e.touches[0].clientX - touchStartX.current);
  }

  function handleTouchEnd() {
    if (touchStartX.current === null) return;
    const width = trackRef.current?.offsetWidth || 1;
    const ratio = dragOffset / width;
    if (ratio > SWIPE_COMMIT_RATIO) goTo(-1);
    else if (ratio < -SWIPE_COMMIT_RATIO) goTo(1);
    setDragOffset(0);
    setIsDragging(false);
    touchStartX.current = null;
    setPaused(false);
  }

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, slides.length]);

  return (
    <section
      className="relative isolate overflow-hidden rounded-[20px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex">
        {/* ── 메인 배너 영역 ── */}
        <div className="relative min-h-[220px] flex-1 touch-pan-y overflow-hidden text-white sm:min-h-[340px] lg:min-h-[420px]">
          <div
            ref={trackRef}
            className="absolute inset-0 flex"
            style={{
              transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
              transition: isDragging ? "none" : "transform 300ms ease-out",
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                aria-hidden={i !== index}
                className={`relative h-full w-full shrink-0 ${
                  i === index ? "" : "pointer-events-none"
                }`}
              >
                {/* 배경 실사 이미지 */}
                <Image
                  src={slide.image.src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-cover"
                  style={slide.image.position ? { objectPosition: slide.image.position } : undefined}
                  priority={i === 0}
                />
                {/* 텍스트 가독성을 위한 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

                <div className="relative flex h-full flex-col justify-center break-keep px-6 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8">
                  <p className="text-xs font-semibold tracking-wider text-white/80 sm:text-sm">
                    {slide.eyebrow}
                  </p>

                  <h1 className="mt-2 max-w-md whitespace-pre-line text-3xl font-black leading-tight sm:text-[2.75rem] sm:leading-tight lg:text-5xl lg:leading-tight">
                    {slide.title}
                  </h1>

                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
                    {slide.subtitle}
                  </p>

                  {/* 상품 썸네일 */}
                  {slide.featuredProducts &&
                    slide.featuredProducts.length > 0 && (
                      <div className="mt-4 hidden items-center gap-3 sm:flex">
                        {slide.featuredProducts.map((product) => (
                          <Link
                            key={product.href}
                            href={product.href}
                            className="group flex flex-col items-center gap-1.5"
                          >
                            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-white/30 transition group-hover:scale-105 sm:h-20 sm:w-20">
                              <Image
                                src={product.cardImage}
                                alt={product.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            </div>
                            <span className="max-w-[5rem] truncate text-[10px] text-white/80 sm:text-xs">
                              {product.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                  {/* 뱃지 */}
                  {slide.badge && (
                    <div className="absolute bottom-6 right-6 rounded-xl bg-lp-green px-5 py-2.5 text-lg font-black text-white shadow-lg sm:bottom-8 sm:right-8 sm:text-xl">
                      {slide.badge}
                    </div>
                  )}

                  {slide.note && (
                    <p className="mt-5 text-sm text-white/75">{slide.note}</p>
                  )}

                  <Link
                    href={slide.cta.href}
                    className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-lp-green px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-lp-green-dark sm:text-base"
                  >
                    {slide.cta.label}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 우측 사이드바 (데스크탑 전용) ── */}
        <nav
          aria-label="배너 탐색"
          className="hidden w-52 flex-col border-l border-lp-gray-200 bg-white lg:flex"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-current={i === index ? "true" : undefined}
              className={`flex flex-1 items-center gap-3 border-b border-lp-gray-100 px-4 text-left text-sm transition ${
                i === index
                  ? "border-l-[3px] border-l-lp-green bg-lp-cream font-medium text-lp-ink"
                  : "border-l-[3px] border-l-transparent text-lp-gray-700 hover:bg-lp-gray-50"
              }`}
            >
              <span className="line-clamp-2 flex-1">{slide.sideLabel}</span>
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
                <Image
                  src={slide.image.src}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* ── 모바일 인디케이터 ── */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 rounded-b-[20px] border-t border-lp-gray-200 bg-lp-cream py-3 lg:hidden">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`${i + 1}번째 배너로 이동`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-lp-green"
                  : "w-1.5 bg-lp-gray-300 hover:bg-lp-gray-500"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
