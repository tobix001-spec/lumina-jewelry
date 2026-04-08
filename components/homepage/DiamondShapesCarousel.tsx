"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion";

const SHAPES = [
  { id: "ROUND",             label: "Round",             path: "M24 6 A18 18 0 0 1 42 24 A18 18 0 0 1 24 42 A18 18 0 0 1 6 24 A18 18 0 0 1 24 6Z" },
  { id: "OVAL",              label: "Oval",              rx: 12, ry: 19, cx: 24, cy: 24, type: "ellipse" },
  { id: "EMERALD",           label: "Emerald",           path: "M12 8 L36 8 L40 14 L40 34 L36 40 L12 40 L8 34 L8 14 Z" },
  { id: "MARQUISE",          label: "Marquise",          path: "M24 5 L42 24 L24 43 L6 24 Z" },
  { id: "PEAR",              label: "Pear",              path: "M24 6 C18 6 9 13 9 22 C9 32 16 42 24 44 C32 42 39 32 39 22 C39 13 30 6 24 6Z" },
  { id: "RADIANT",           label: "Radiant",           path: "M11 11 L37 11 L41 16 L41 32 L37 37 L11 37 L7 32 L7 16Z" },
  { id: "CUSHION",           label: "Cushion",           path: "M10 10 Q24 7 38 10 Q41 24 38 38 Q24 41 10 38 Q7 24 10 10Z" },
  { id: "PRINCESS",          label: "Princess",          path: "M9 9 L39 9 L39 39 L9 39 Z" },
  { id: "ASSCHER",           label: "Asscher",           path: "M15 9 L33 9 L39 15 L39 33 L33 39 L15 39 L9 33 L9 15 Z" },
  { id: "HEART",             label: "Heart",             path: "M24 38 C24 38 7 26 7 17 C7 11 12 7 17 8.5 C20 9 22.5 11 24 13.5 C25.5 11 28 9 31 8.5 C36 7 41 11 41 17 C41 26 24 38 24 38Z" },
  { id: "ELONGATED_CUSHION", label: "Elongated Cushion", path: "M14 8 Q24 5 34 8 Q37 18 37 30 Q34 43 24 43 Q14 43 11 30 Q11 18 14 8Z" },
];

function ShapeIcon({ shape }: { shape: typeof SHAPES[0] }) {
  if (shape.type === "ellipse") {
    return (
      <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
        <ellipse cx={(shape as any).cx} cy={(shape as any).cy} rx={(shape as any).rx} ry={(shape as any).ry}
          fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
      <path d={shape.path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

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
            {SHAPES.map((shape) => (
              <Link
                key={shape.id}
                href={`/diamonds?shape=${shape.id}`}
                role="listitem"
                className="flex-none snap-center flex flex-col items-center gap-3 group w-[90px] sm:w-[100px]"
                aria-label={`Shop ${shape.label} diamonds`}
              >
                <motion.div
                  className="w-14 h-14 sm:w-16 sm:h-16 text-warm-gray group-hover:text-charcoal transition-colors duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <ShapeIcon shape={shape} />
                </motion.div>
                <span className="text-xs text-warm-gray font-medium text-center group-hover:text-charcoal transition-colors leading-tight">{shape.label}</span>
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
