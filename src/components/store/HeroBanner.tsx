"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type HeroSlide = {
  id: string;
  theme: "orange" | "green" | "ink" | "soil" | "gold" | "slate";
  eyebrow: string;
  title: string;
  subtitle: string;
  note?: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string };
  sideLabel: string;
  featuredProducts?: { name: string; href: string }[];
};

const THEME_CLASSES: Record<HeroSlide["theme"], string> = {
  orange: "bg-gradient-to-br from-lp-orange-dark via-lp-orange to-[#c85a10]",
  green: "bg-gradient-to-br from-lp-green-dark via-lp-green to-[#0d3623]",
  ink: "bg-gradient-to-br from-lp-gray-900 via-lp-ink to-[#050505]",
  soil: "bg-gradient-to-br from-[#4a3626] via-[#2e2013] to-lp-ink",
  gold: "bg-gradient-to-br from-[#c98a1a] via-lp-orange to-lp-orange-dark",
  slate: "bg-gradient-to-br from-lp-gray-700 via-lp-gray-900 to-lp-ink",
};

const AUTOPLAY_MS = 6000;

export function HeroBanner({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      className="relative isolate overflow-hidden rounded-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex">
        {/* ── 메인 배너 영역 ── */}
        <div className="relative min-h-[300px] flex-1 text-white sm:min-h-[360px] lg:min-h-[400px]">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              aria-hidden={i !== index}
              className={`absolute inset-0 ${THEME_CLASSES[slide.theme]} transition-opacity duration-700 ease-out ${
                i === index
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

              <div className="relative flex h-full flex-col items-start justify-center gap-6 break-keep px-6 py-12 sm:px-10 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:py-0">
                <div className="flex-1">
                  <p className="text-xs font-semibold tracking-wide text-white/80 sm:text-sm">
                    {slide.eyebrow}
                  </p>
                  <h1 className="mt-2 max-w-lg whitespace-pre-line text-2xl font-bold leading-snug sm:text-4xl">
                    {slide.title}
                  </h1>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
                    {slide.subtitle}
                  </p>

                  {slide.featuredProducts &&
                    slide.featuredProducts.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {slide.featuredProducts.map((product) => (
                          <Link
                            key={product.href}
                            href={product.href}
                            className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
                          >
                            {product.name}
                          </Link>
                        ))}
                      </div>
                    )}

                  {slide.note && (
                    <p className="mt-6 text-sm text-white/75">{slide.note}</p>
                  )}

                  <Link
                    href={slide.cta.href}
                    className="mt-7 inline-flex w-fit items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-lp-ink transition hover:bg-white/90"
                  >
                    {slide.cta.label}
                  </Link>
                </div>

                <div className="relative hidden h-56 w-56 shrink-0 overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/25 sm:block lg:h-64 lg:w-64">
                  <Image
                    src={slide.image.src}
                    alt={slide.image.alt}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
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
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 lg:hidden">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`${i + 1}번째 배너로 이동`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
