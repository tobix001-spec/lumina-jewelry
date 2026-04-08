"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: "s1",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1800&q=90&auto=format&fit=crop",
    imageMobile: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=85&auto=format&fit=crop",
    eyebrow: "New Spring Collection",
    headline: "Where Love\nBecomes\nEternal",
    sub: "150,000+ certified natural & lab-grown diamonds, ethically sourced and hand-set.",
    cta: { label: "Shop Engagement Rings", href: "/engagement-rings" },
    cta2: { label: "Design Your Own", href: "/configure" },
    alt: "Oval diamond engagement ring on soft white surface",
    align: "left",
  },
  {
    id: "s2",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94fce70?w=1800&q=90&auto=format&fit=crop",
    imageMobile: "https://images.unsplash.com/photo-1573408301185-9519f94fce70?w=900&q=85&auto=format&fit=crop",
    eyebrow: "Lab-Grown Diamonds",
    headline: "Real Diamonds.\nBetter Planet.",
    sub: "Physically identical to mined diamonds. 100% renewable energy certified.",
    cta: { label: "Explore Lab Diamonds", href: "/diamonds?origin=LAB_GROWN" },
    cta2: { label: "Learn More", href: "/education/lab-diamonds" },
    alt: "Brilliant-cut lab-grown diamond under magnification",
    align: "center",
  },
  {
    id: "s3",
    image: "https://images.unsplash.com/photo-1532453288672-3a17f2e980ae?w=1800&q=90&auto=format&fit=crop",
    imageMobile: "https://images.unsplash.com/photo-1532453288672-3a17f2e980ae?w=900&q=85&auto=format&fit=crop",
    eyebrow: "Nature-Inspired",
    headline: "Crafted From\nNature,\nFor Always.",
    sub: "Organic forms, ethically sourced gemstones, and handcrafted 18K gold settings.",
    cta: { label: "Shop the Collection", href: "/engagement-rings?style=NATURE_INSPIRED" },
    cta2: null,
    alt: "Nature-inspired sapphire and diamond ring among flowers",
    align: "left",
  },
];

const INTERVAL = 6500;

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState<number | null>(null);
  const [paused, setPaused]   = useState(false);
  const [textVisible, setTextVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setTextVisible(false);
    setPrev(current);
    setTimeout(() => {
      setCurrent(next);
      setTextVisible(true);
      setPrev(null);
    }, 700);
  }, [current]);

  const advance = useCallback((dir: 1 | -1) => {
    go((current + dir + SLIDES.length) % SLIDES.length);
  }, [current, go]);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => advance(1), INTERVAL);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [advance, paused]);

  const slide = SLIDES[current];
  const isCentered = slide.align === "center";

  return (
    <section
      className="relative w-full overflow-hidden bg-charcoal"
      style={{ height: "clamp(540px, 88vh, 900px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured promotions"
      aria-roledescription="carousel"
    >
      {/* Images — cross-fade */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
          aria-hidden={i !== current}
        >
          <Image
            src={s.image}
            alt={s.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
            quality={90}
          />
          {/* Multi-layer gradient */}
          <div className="absolute inset-0" style={{
            background: isCentered
              ? "linear-gradient(0deg, rgba(26,23,20,0.80) 0%, rgba(26,23,20,0.45) 50%, rgba(26,23,20,0.30) 100%)"
              : "linear-gradient(105deg, rgba(26,23,20,0.75) 0%, rgba(26,23,20,0.30) 55%, rgba(26,23,20,0.10) 100%)"
          }} />
        </div>
      ))}

      {/* Content */}
      <div className={cn("absolute inset-0 z-20 flex items-end pb-16 sm:pb-20 lg:items-center lg:pb-0", isCentered && "justify-center text-center")}>
        <div className={cn("container-luxury w-full", isCentered ? "flex flex-col items-center" : "")}>
          <div className={cn("max-w-xl", isCentered && "text-center")}>
            {/* Eyebrow */}
            <div
              className={cn(
                "inline-flex items-center gap-2 mb-5 transition-all duration-500",
                textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
            >
              <span className="h-px w-8 bg-gold" />
              <span className="label-caps text-gold-light">{slide.eyebrow}</span>
            </div>

            {/* Headline */}
            <h1
              className={cn(
                "font-display text-white mb-6 whitespace-pre-line transition-all duration-500 delay-75",
                textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
              )}
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)", fontWeight: 300, lineHeight: 1.07, letterSpacing: "0.01em" }}
            >
              {slide.headline}
            </h1>

            {/* Sub */}
            <p
              className={cn(
                "text-white/70 text-base sm:text-lg leading-relaxed mb-9 max-w-md transition-all duration-500 delay-100",
                textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                isCentered && "mx-auto"
              )}
            >
              {slide.sub}
            </p>

            {/* CTAs */}
            <div
              className={cn(
                "flex flex-col sm:flex-row gap-3 transition-all duration-500 delay-150",
                textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                isCentered && "justify-center"
              )}
            >
              <Link href={slide.cta.href}
                className="group inline-flex items-center justify-center gap-2 bg-white text-charcoal px-8 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-cream transition-all duration-300 hover:shadow-luxury"
              >
                {slide.cta.label}
                <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200" />
              </Link>
              {slide.cta2 && (
                <Link href={slide.cta2.href}
                  className="inline-flex items-center justify-center gap-2 border border-white/50 text-white px-8 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase hover:border-white hover:bg-white/10 transition-all duration-300"
                >
                  {slide.cta2.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      {(["prev","next"] as const).map((dir) => (
        <button
          key={dir}
          onClick={() => advance(dir === "next" ? 1 : -1)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center",
            "border border-white/25 text-white hover:bg-white hover:text-charcoal backdrop-blur-sm",
            "transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100",
            dir === "prev" ? "left-5" : "right-5"
          )}
          aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
          style={{ opacity: 0.6 }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
        >
          {dir === "prev" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === current}
            className={cn(
              "transition-all duration-500 rounded-full",
              i === current ? "w-7 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-px bg-white/10">
        <div
          key={current}
          className="h-full bg-gold"
          style={{ animation: paused ? "none" : `progressBar ${INTERVAL}ms linear forwards` }}
        />
      </div>
      <style>{`@keyframes progressBar { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  );
}
