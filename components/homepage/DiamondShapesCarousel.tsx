"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion";

// ─── Diamond Shape Data ──────────────────────────────────────────────────────

const SHAPES = [
  { id: "ROUND",             label: "Round",             img: "/shapes/round.jpg" },
  { id: "OVAL",              label: "Oval",              img: "/shapes/oval.jpg" },
  { id: "EMERALD",           label: "Emerald",           img: "/shapes/emerald.jpg" },
  { id: "MARQUISE",          label: "Marquise",          img: "/shapes/marquise.jpg" },
  { id: "PEAR",              label: "Pear",              img: "/shapes/pear.jpg" },
  { id: "RADIANT",           label: "Radiant",           img: "/shapes/radiant.jpg" },
  { id: "CUSHION",           label: "Cushion",           img: "/shapes/cushion.jpg" },
  { id: "PRINCESS",          label: "Princess",          img: "/shapes/princess.jpg" },
  { id: "ASSCHER",           label: "Asscher",           img: "/shapes/asscher.jpg" },
  { id: "HEART",             label: "Heart",             img: "/shapes/heart.png" },
  { id: "ELONGATED_CUSHION", label: "Elongated Cushion", img: "/shapes/elongated-cushion.jpg" },
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
          <h2 className="font-display text-3xl sm:text-4xl text-charcoal" style={{ fontWeight: 300 }}>
            Find Your Shape
          </h2>
        </Reveal>
        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 border border-warm-border bg-white hover:bg-cream items-center justify-center transition-all duration-200 hover:border-warm-border-dark shadow-luxury-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-warm-gray" />
          </button>

          <div
            ref={ref}
            className="flex gap-2 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2"
            role="list"
          >
            {SHAPES.map(({ id, label, img }) => (
              <Link
                key={id}
                href={`/diamonds?shape=${id}`}
                role="listitem"
                className="flex-none snap-center flex flex-col items-center gap-2.5 group w-[90px] sm:w-[110px]"
                aria-label={`Shop ${label} diamonds`}
              >
                <motion.div
                  className="relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full bg-cream border border-warm-border group-hover:border-gold group-hover:shadow-gold overflow-hidden transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <Image
                    src={img}
                    alt={`${label} cut diamond`}
                    width={168}
                    height={168}
                    className="object-contain w-full h-full p-2.5 sm:p-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.div>
                <span className="text-xs text-warm-gray font-medium text-center group-hover:text-charcoal transition-colors leading-tight">
                  {label}
                </span>
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
