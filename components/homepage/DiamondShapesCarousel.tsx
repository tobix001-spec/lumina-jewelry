"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Reveal } from "@/components/motion";

// ─── Shape Data ──────────────────────────────────────────────────────────────

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

// ─── 3D Tilt Card ────────────────────────────────────────────────────────────

function Diamond3DCard({ id, label, img }: { id: string; label: string; img: string }) {
  const [hovered, setHovered] = useState(false);

  // Mouse tracking for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring-based rotation
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [18, -18]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), { stiffness: 200, damping: 20 });

  // Glare position
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Link
      href={`/diamonds?shape=${id}`}
      className="flex-none snap-center flex flex-col items-center gap-2.5 group w-[90px] sm:w-[110px]"
      aria-label={`Shop ${label} diamonds`}
    >
      <div
        className="relative"
        style={{ perspective: "600px" }}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
      >
        <motion.div
          className="relative w-[76px] h-[76px] sm:w-[90px] sm:h-[90px]"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          {/* Diamond image */}
          <Image
            src={img}
            alt={`${label} cut diamond`}
            width={180}
            height={180}
            className="relative object-contain w-full h-full select-none"
            style={{ transform: "translateZ(10px)" }}
            draggable={false}
          />

          {/* Sparkle/glare overlay on hover */}
          {hovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-full"
              style={{
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.5) 0%, rgba(232,213,163,0.15) 30%, transparent 65%)`,
                transform: "translateZ(20px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>

        {/* 3D shadow */}
        <motion.div
          className="absolute inset-x-3 -bottom-1.5 h-3 bg-charcoal/12 rounded-full blur-md"
          animate={{
            opacity: hovered ? 0.7 : 0.2,
            scaleX: hovered ? 0.85 : 1,
            y: hovered ? 4 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <span className="text-xs text-warm-gray font-medium text-center group-hover:text-charcoal transition-colors leading-tight">
        {label}
      </span>
      <div className="h-px w-0 bg-gold group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

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
            className="flex gap-2 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4"
            role="list"
          >
            {SHAPES.map((shape) => (
              <Diamond3DCard key={shape.id} {...shape} />
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
