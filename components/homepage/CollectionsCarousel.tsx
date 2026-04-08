"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion";

const COLS = [
  { id: "anniversary", label: "20th Anniversary",      sub: "Celebrating our founding mission",      href: "/collections/anniversary", img: "/generated/col-anniversary.jpg", alt: "Anniversary collection" },
  { id: "jane-goodall", label: "Jane Goodall",          sub: "In partnership with the JGI",           href: "/collections/jane-goodall", img: "/generated/col-nature.jpg", alt: "Jane Goodall collection" },
  { id: "signature",   label: "Signature Collection",  sub: "Our most iconic timeless designs",      href: "/collections/signature",   img: "/generated/col-signature.jpg", alt: "Signature collection" },
  { id: "pacific-green", label: "Pacific Green",        sub: "Ethically-sourced Colombian emeralds",  href: "/collections/pacific-green", img: "/generated/col-pacific.jpg", alt: "Pacific Green collection" },
];

export function CollectionsCarousel() {
  const [active, setActive] = useState(0);
  const n = COLS.length;
  const go = (dir: 1 | -1) => setActive(a => (a + dir + n) % n);

  // Show 3 at a time on desktop, 1 on mobile
  const visible = [COLS[active % n], COLS[(active+1) % n], COLS[(active+2) % n]];

  return (
    <section className="py-20 sm:py-28 bg-cream-dark">
      <div className="container-luxury">
        <Reveal className="flex items-end justify-between mb-12">
          <div>
            <p className="label-caps text-gold-dark mb-3">Our Collections</p>
            <h2 className="font-display text-4xl sm:text-5xl text-charcoal" style={{ fontWeight: 300 }}>Curated Stories</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => go(-1)} className="w-10 h-10 border border-warm-border flex items-center justify-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-200 group" aria-label="Previous">
              <ArrowLeft className="w-4 h-4 text-warm-gray group-hover:text-white" />
            </button>
            <button onClick={() => go(1)} className="w-10 h-10 border border-warm-border flex items-center justify-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-200 group" aria-label="Next">
              <ArrowRight className="w-4 h-4 text-warm-gray group-hover:text-white" />
            </button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((col, i) => (
            <Link
              key={`${col.id}-${i}`}
              href={col.href}
              className={cn("group relative overflow-hidden block", i === 2 && "hidden lg:block")}
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={col.img}
                alt={col.alt}
                fill
                sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="font-display text-2xl text-white mb-1.5" style={{ fontWeight: 400 }}>{col.label}</p>
                <p className="text-white/60 text-sm">{col.sub}</p>
                <div className="flex items-center gap-2 mt-4 text-white/70 text-xs font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {COLS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn("h-px transition-all duration-300", i === active ? "w-8 bg-charcoal" : "w-3 bg-warm-border-dark")}
              aria-label={`Collection ${i+1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
