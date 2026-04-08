"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion";

// ─── Realistic Diamond Shape SVGs with Facet Lines ───────────────────────────

function RoundIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Table */}
      <polygon points="28,22 52,22 56,28 24,28" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      {/* Crown facets */}
      <line x1="40" y1="6" x2="28" y2="22" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="40" y1="6" x2="52" y2="22" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="10" y1="28" x2="28" y2="22" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="70" y1="28" x2="52" y2="22" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      {/* Girdle line */}
      <ellipse cx="40" cy="36" rx="34" ry="4" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      {/* Pavilion facets */}
      <line x1="40" y1="72" x2="12" y2="36" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="40" y1="72" x2="68" y2="36" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="40" y1="72" x2="24" y2="28" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="40" y1="72" x2="56" y2="28" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="40" y1="72" x2="40" y2="36" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

function OvalIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      <ellipse cx="40" cy="40" rx="22" ry="34" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Table */}
      <ellipse cx="40" cy="28" rx="12" ry="6" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      {/* Crown facets */}
      <line x1="40" y1="6" x2="32" y2="22" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="40" y1="6" x2="48" y2="22" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="20" y1="30" x2="28" y2="22" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="60" y1="30" x2="52" y2="22" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      {/* Pavilion facets */}
      <line x1="40" y1="74" x2="22" y2="38" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="40" y1="74" x2="58" y2="38" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="40" y1="74" x2="32" y2="30" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      <line x1="40" y1="74" x2="48" y2="30" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

function EmeraldIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Outer shape - cut corners */}
      <polygon points="22,6 58,6 74,18 74,62 58,74 22,74 6,62 6,18" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Step cut lines */}
      <polygon points="26,14 54,14 64,22 64,58 54,66 26,66 16,58 16,22" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <polygon points="30,22 50,22 56,28 56,52 50,58 30,58 24,52 24,28" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      {/* Table */}
      <rect x="32" y="30" width="16" height="20" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      {/* Corner facets */}
      <line x1="22" y1="6" x2="26" y2="14" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="58" y1="6" x2="54" y2="14" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="22" y1="74" x2="26" y2="66" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="58" y1="74" x2="54" y2="66" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function MarquiseIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Outer - pointed ellipse */}
      <path d="M40 4 C58 16, 66 30, 66 40 C66 50, 58 64, 40 76 C22 64, 14 50, 14 40 C14 30, 22 16, 40 4Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Table */}
      <path d="M40 18 C48 24, 52 30, 52 40 C52 50, 48 56, 40 62 C32 56, 28 50, 28 40 C28 30, 32 24, 40 18Z" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      {/* Crown/pavilion center line */}
      <line x1="14" y1="40" x2="66" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      {/* Facet lines */}
      <line x1="40" y1="4" x2="28" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="4" x2="52" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="76" x2="28" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="76" x2="52" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      {/* Side facets */}
      <line x1="40" y1="4" x2="40" y2="18" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="40" y1="76" x2="40" y2="62" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

function PearIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Outer pear shape */}
      <path d="M40 6 C30 6, 14 18, 14 36 C14 52, 24 68, 40 76 C56 68, 66 52, 66 36 C66 18, 50 6, 40 6Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Table */}
      <path d="M40 16 C35 16, 24 24, 24 34 C24 44, 30 54, 40 60 C50 54, 56 44, 56 34 C56 24, 45 16, 40 16Z" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      {/* Crown facets from tip */}
      <line x1="40" y1="6" x2="30" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="6" x2="50" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      {/* Pavilion facets */}
      <line x1="40" y1="76" x2="20" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="76" x2="60" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="76" x2="40" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      {/* Girdle */}
      <line x1="14" y1="38" x2="66" y2="38" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
    </svg>
  );
}

function RadiantIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Outer - cut corners rectangle */}
      <polygon points="18,6 62,6 74,18 74,62 62,74 18,74 6,62 6,18" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Inner facet ring */}
      <polygon points="26,16 54,16 62,24 62,56 54,64 26,64 18,56 18,24" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      {/* Table */}
      <rect x="30" y="26" width="20" height="28" rx="1" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      {/* Diagonal facets - brilliant style */}
      <line x1="18" y1="6" x2="30" y2="26" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="62" y1="6" x2="50" y2="26" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="18" y1="74" x2="30" y2="54" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="62" y1="74" x2="50" y2="54" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="6" y1="18" x2="30" y2="26" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="74" y1="18" x2="50" y2="26" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="6" y1="62" x2="30" y2="54" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="74" y1="62" x2="50" y2="54" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

function CushionIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Outer - rounded square */}
      <rect x="8" y="8" width="64" height="64" rx="16" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Inner facet ring */}
      <rect x="18" y="18" width="44" height="44" rx="10" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      {/* Table */}
      <rect x="28" y="28" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      {/* Brilliant facets */}
      <line x1="40" y1="8" x2="28" y2="28" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="8" x2="52" y2="28" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="72" x2="28" y2="52" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="72" x2="52" y2="52" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="8" y1="40" x2="28" y2="28" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="8" y1="40" x2="28" y2="52" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="72" y1="40" x2="52" y2="28" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="72" y1="40" x2="52" y2="52" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function PrincessIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Outer square */}
      <rect x="8" y="8" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Table */}
      <rect x="24" y="24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      {/* Chevron facets - princess cut signature */}
      <line x1="8" y1="8" x2="24" y2="24" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="72" y1="8" x2="56" y2="24" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="8" y1="72" x2="24" y2="56" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <line x1="72" y1="72" x2="56" y2="56" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      {/* V-shaped chevrons on each side */}
      <line x1="40" y1="8" x2="24" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="8" x2="56" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="72" x2="24" y2="56" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="72" x2="56" y2="56" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="8" y1="40" x2="24" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="8" y1="40" x2="24" y2="56" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="72" y1="40" x2="56" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="72" y1="40" x2="56" y2="56" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function AsscherIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Outer octagon */}
      <polygon points="24,6 56,6 74,24 74,56 56,74 24,74 6,56 6,24" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Step cuts */}
      <polygon points="28,14 52,14 66,28 66,52 52,66 28,66 14,52 14,28" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <polygon points="32,22 48,22 58,32 58,48 48,58 32,58 22,48 22,32" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      {/* Table */}
      <rect x="34" y="32" width="12" height="16" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      {/* Windmill facets - asscher signature */}
      <line x1="24" y1="6" x2="34" y2="32" stroke="currentColor" strokeWidth="0.4" opacity="0.25" />
      <line x1="56" y1="6" x2="46" y2="32" stroke="currentColor" strokeWidth="0.4" opacity="0.25" />
      <line x1="24" y1="74" x2="34" y2="48" stroke="currentColor" strokeWidth="0.4" opacity="0.25" />
      <line x1="56" y1="74" x2="46" y2="48" stroke="currentColor" strokeWidth="0.4" opacity="0.25" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Outer heart */}
      <path d="M40 72 C40 72 8 52 8 30 C8 18 16 10 26 12 C32 13 36 17 40 22 C44 17 48 13 54 12 C64 10 72 18 72 30 C72 52 40 72 40 72Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Inner heart - table */}
      <path d="M40 58 C40 58 18 44 18 30 C18 22 22 18 28 19 C32 20 36 24 40 30 C44 24 48 20 52 19 C58 18 62 22 62 30 C62 44 40 58 40 58Z" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      {/* Center cleft line */}
      <line x1="40" y1="12" x2="40" y2="30" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      {/* Pavilion facets */}
      <line x1="40" y1="72" x2="22" y2="36" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="72" x2="58" y2="36" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="72" x2="40" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      {/* Crown facets */}
      <line x1="26" y1="12" x2="30" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="54" y1="12" x2="50" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

function ElongatedCushionIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Outer - tall rounded rectangle */}
      <rect x="14" y="4" width="52" height="72" rx="16" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Inner ring */}
      <rect x="22" y="14" width="36" height="52" rx="10" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      {/* Table */}
      <rect x="30" y="24" width="20" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      {/* Brilliant facets */}
      <line x1="40" y1="4" x2="30" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="4" x2="50" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="76" x2="30" y2="56" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="76" x2="50" y2="56" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="14" y1="40" x2="30" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="14" y1="40" x2="30" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="66" y1="40" x2="50" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="66" y1="40" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

// ─── Shape → Component Map ───────────────────────────────────────────────────

const SHAPES: { id: string; label: string; Icon: React.FC }[] = [
  { id: "ROUND",             label: "Round",             Icon: RoundIcon },
  { id: "OVAL",              label: "Oval",              Icon: OvalIcon },
  { id: "EMERALD",           label: "Emerald",           Icon: EmeraldIcon },
  { id: "MARQUISE",          label: "Marquise",          Icon: MarquiseIcon },
  { id: "PEAR",              label: "Pear",              Icon: PearIcon },
  { id: "RADIANT",           label: "Radiant",           Icon: RadiantIcon },
  { id: "CUSHION",           label: "Cushion",           Icon: CushionIcon },
  { id: "PRINCESS",          label: "Princess",          Icon: PrincessIcon },
  { id: "ASSCHER",           label: "Asscher",           Icon: AsscherIcon },
  { id: "HEART",             label: "Heart",             Icon: HeartIcon },
  { id: "ELONGATED_CUSHION", label: "Elongated Cushion", Icon: ElongatedCushionIcon },
];

// ─── Carousel ────────────────────────────────────────────────────────────────

export function DiamondShapesCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <section className="py-16 sm:py-20 border-y border-warm-border bg-white">
      <div className="container-luxury">
        <Reveal className="text-center mb-10">
          <p className="label-caps text-gold-dark mb-3">Shop by Shape</p>
          <h2 className="font-display text-3xl sm:text-4xl text-charcoal" style={{ fontWeight: 300 }}>Find Your Shape</h2>
        </Reveal>
        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 border border-warm-border bg-white hover:bg-cream items-center justify-center transition-all duration-200 hover:border-warm-border-dark shadow-luxury-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-warm-gray" />
          </button>

          <div ref={ref} className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2" role="list">
            {SHAPES.map(({ id, label, Icon }) => (
              <Link
                key={id}
                href={`/diamonds?shape=${id}`}
                role="listitem"
                className="flex-none snap-center flex flex-col items-center gap-3 group w-[90px] sm:w-[110px]"
                aria-label={`Shop ${label} diamonds`}
              >
                <motion.div
                  className="w-16 h-16 sm:w-[72px] sm:h-[72px] text-warm-gray group-hover:text-charcoal transition-colors duration-300"
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Icon />
                </motion.div>
                <span className="text-xs text-warm-gray font-medium text-center group-hover:text-charcoal transition-colors leading-tight">{label}</span>
                <div className="h-px w-0 bg-gold group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 border border-warm-border bg-white hover:bg-cream items-center justify-center transition-all duration-200 hover:border-warm-border-dark shadow-luxury-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-warm-gray" />
          </button>
        </div>
      </div>
    </section>
  );
}
