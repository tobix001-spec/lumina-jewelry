"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

const SLIDES = [
  {
    id: "s1",
    image: "/generated/hero-1.jpg",
    imageMobile: "/generated/hero-1.jpg",
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
    image: "/generated/hero-2.jpg",
    imageMobile: "/generated/hero-2.jpg",
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
    image: "/generated/hero-3.jpg",
    imageMobile: "/generated/hero-3.jpg",
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

/* ───── Slide transition variants ───── */
const slideVariants = {
  enter: {
    opacity: 0,
    scale: 1.04,
    filter: "blur(8px)",
  },
  center: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    filter: "blur(4px)",
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ───── Parallax image variants ───── */
const parallaxVariants = {
  initial: { scale: 1.08, x: -10, y: 5 },
  animate: {
    scale: 1.12,
    x: 10,
    y: -5,
    transition: {
      duration: 12,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

/* ───── Character reveal ───── */
const charContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.2,
    },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ───── Content stagger ───── */
const contentContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ───── Eyebrow line variant ───── */
const lineVariants = {
  hidden: { width: 0 },
  visible: {
    width: 32,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 },
  },
};

/* ───── Helper: split headline into chars preserving newlines ───── */
function splitHeadline(text: string) {
  const lines = text.split("\n");
  const chars: { char: string; key: string }[] = [];
  lines.forEach((line, li) => {
    for (let ci = 0; ci < line.length; ci++) {
      chars.push({ char: line[ci], key: `${li}-${ci}` });
    }
    if (li < lines.length - 1) {
      chars.push({ char: "\n", key: `br-${li}` });
    }
  });
  return chars;
}

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [direction, setDirection] = useState(1);

  /* ── Progress bar ── */
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (paused) {
      progress.stop();
      return;
    }
    const controls = animate(progress, 1, {
      duration: INTERVAL / 1000,
      ease: "linear",
    });
    return () => controls.stop();
  }, [current, paused, progress]);

  const go = useCallback(
    (next: number) => {
      setDirection(next > current ? 1 : -1);
      progress.set(0);
      setCurrent(next);
    },
    [current, progress]
  );

  const advance = useCallback(
    (dir: 1 | -1) => {
      const next = (current + dir + SLIDES.length) % SLIDES.length;
      setDirection(dir);
      progress.set(0);
      setCurrent(next);
    },
    [current, progress]
  );

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => advance(1), INTERVAL);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
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
      {/* Images — AnimatePresence cross-fade with parallax */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slide.id}
          className="absolute inset-0 z-10"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0"
            variants={parallaxVariants}
            initial="initial"
            animate="animate"
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={current === 0}
              sizes="100vw"
              className="object-cover object-center"
              quality={90}
            />
          </motion.div>
          {/* Multi-layer gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: isCentered
                ? "linear-gradient(0deg, rgba(26,23,20,0.80) 0%, rgba(26,23,20,0.45) 50%, rgba(26,23,20,0.30) 100%)"
                : "linear-gradient(105deg, rgba(26,23,20,0.75) 0%, rgba(26,23,20,0.30) 55%, rgba(26,23,20,0.10) 100%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div
        className={cn(
          "absolute inset-0 z-20 flex items-end pb-16 sm:pb-20 lg:items-center lg:pb-0",
          isCentered && "justify-center text-center"
        )}
      >
        <div
          className={cn(
            "container-luxury w-full",
            isCentered ? "flex flex-col items-center" : ""
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-content"}
              className={cn("max-w-xl", isCentered && "text-center")}
              variants={contentContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Eyebrow */}
              <motion.div
                className="inline-flex items-center gap-2 mb-5"
                variants={fadeUpVariants}
              >
                <motion.span
                  className="h-px bg-gold inline-block"
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                />
                <span className="label-caps text-gold-light">
                  {slide.eyebrow}
                </span>
              </motion.div>

              {/* Headline — character-by-character reveal */}
              <motion.h1
                className={cn(
                  "font-display text-white mb-6 whitespace-pre-line"
                )}
                style={{
                  fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
                  fontWeight: 300,
                  lineHeight: 1.07,
                  letterSpacing: "0.01em",
                }}
                variants={charContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {splitHeadline(slide.headline).map(({ char, key }) =>
                  char === "\n" ? (
                    <br key={key} />
                  ) : char === " " ? (
                    <motion.span key={key} variants={charVariants}>
                      &nbsp;
                    </motion.span>
                  ) : (
                    <motion.span
                      key={key}
                      variants={charVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  )
                )}
              </motion.h1>

              {/* Sub */}
              <motion.p
                className={cn(
                  "text-white/70 text-base sm:text-lg leading-relaxed mb-9 max-w-md",
                  isCentered && "mx-auto"
                )}
                variants={fadeUpVariants}
              >
                {slide.sub}
              </motion.p>

              {/* CTAs */}
              <motion.div
                className={cn(
                  "flex flex-col sm:flex-row gap-3",
                  isCentered && "justify-center"
                )}
                variants={fadeUpVariants}
              >
                <motion.a
                  href={slide.cta.href}
                  className="group inline-flex items-center justify-center gap-2 bg-white text-charcoal px-8 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300"
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 0 25px rgba(255,255,255,0.25), 0 4px 20px rgba(0,0,0,0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {slide.cta.label}
                  <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200" />
                </motion.a>
                {slide.cta2 && (
                  <motion.a
                    href={slide.cta2.href}
                    className="inline-flex items-center justify-center gap-2 border border-white/50 text-white px-8 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300"
                    whileHover={{
                      scale: 1.04,
                      borderColor: "rgba(255,255,255,1)",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {slide.cta2.label}
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Prev / Next */}
      {(["prev", "next"] as const).map((dir) => (
        <motion.button
          key={dir}
          onClick={() => advance(dir === "next" ? 1 : -1)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center",
            "border border-white/25 text-white backdrop-blur-sm",
            dir === "prev" ? "left-5" : "right-5"
          )}
          initial={{ opacity: 0.6 }}
          whileHover={{
            opacity: 1,
            backgroundColor: "rgba(255,255,255,1)",
            color: "rgba(26,23,20,1)",
            scale: 1.1,
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25 }}
          aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
        >
          {dir === "prev" ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </motion.button>
      ))}

      {/* Dot indicators with layoutId morphing */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === current}
            className="relative flex items-center justify-center"
            style={{
              width: i === current ? 28 : 6,
              height: 6,
              transition: "width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <span
              className={cn(
                "rounded-full transition-all duration-500",
                i === current
                  ? "w-full h-1.5 bg-white/40"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
              )}
            />
            {i === current && (
              <motion.span
                layoutId="hero-active-dot"
                className="absolute inset-0 rounded-full bg-white"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-px bg-white/10">
        <motion.div
          className="h-full bg-gold"
          style={{ width: progressWidth }}
        />
      </div>
    </section>
  );
}
