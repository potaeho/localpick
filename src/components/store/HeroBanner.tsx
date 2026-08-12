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
  /** 배너 컨셉에 맞는 실사 — 모든 슬라이드에서 같은 크기의 카드로 노출한다 */
  image: { src: string; alt: string };
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

/**
 * 자동으로 순환하는 메인 배너.
 *
 * 배경은 사진 대신 브랜드 그라데이션 + 도형으로 만든 그래픽을 쓴다 — 사진을
 * 전체 배경으로 늘려 억지로 채우면 어색해지기 때문이다. 대신 배너 컨셉에
 * 맞는 실사를 모든 슬라이드에서 동일한 크기의 카드로 보여줘, 사진은
 * "증거", 배경은 "톤"을 맡도록 역할을 나눴다.
 */
export function HeroBanner({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      className="relative isolate overflow-hidden rounded-xl text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative min-h-[300px] sm:min-h-[360px] lg:min-h-[400px]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            aria-hidden={i !== index}
            className={`absolute inset-0 ${THEME_CLASSES[slide.theme]} transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {/* 배경 도형 — 은은한 원형 블롭으로 시즌 배너 느낌만 준다 */}
            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

            <div className="relative flex h-full flex-col items-start justify-center gap-6 break-keep px-6 py-12 sm:px-10 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:py-0">
              <div>
                <p className="text-xs font-semibold tracking-wide text-white/80 sm:text-sm">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-2 max-w-lg text-2xl font-bold leading-snug sm:text-4xl">
                  {slide.title}
                </h1>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
                  {slide.subtitle}
                </p>
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

              {/* 슬라이드마다 같은 크기의 카드로 컨셉에 맞는 실사를 보여준다 */}
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

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`${i + 1}번째 배너로 이동`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
