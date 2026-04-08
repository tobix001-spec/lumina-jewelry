"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/pricing";
import { DIAMOND_SHAPE_LABELS } from "@/types";
import type { Diamond } from "@/types";
import { Heart, Leaf, Zap, Shield, ExternalLink, Video } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  diamond: Diamond;
  inConfigurator?: boolean;
  onSelect?: (d: Diamond) => void;
  role?: string;
}

export function DiamondCard({ diamond, inConfigurator = false, onSelect, role }: Props) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const {
    id, shape, caratWeight, color, clarity, cutGrade, price,
    origin, certificationLab, certificateUrl, imageUrl,
    renewableEnergy, carbonCapture, blockchainId, eyeClean, videoUrl,
  } = diamond;

  const isLab  = origin === "LAB_GROWN" || origin === "LAB_GROWN_COLORED";
  const shapeLabel = DIAMOND_SHAPE_LABELS[shape] ?? shape;

  const badges = [
    renewableEnergy && { icon: Leaf,   tip: "100% Renewable Energy",       cls: "text-emerald-600" },
    carbonCapture   && { icon: Zap,    tip: "Carbon Capture Certified",     cls: "text-sky-600" },
    blockchainId    && { icon: Shield, tip: "Blockchain Provenance Tracked",cls: "text-violet-600" },
  ].filter(Boolean) as { icon: React.ElementType; tip: string; cls: string }[];

  return (
    <motion.article
      role={role}
      className="group flex flex-col bg-white border border-warm-border hover:border-warm-border-dark hover:shadow-luxury transition-all duration-400"
      aria-label={`${caratWeight}ct ${shapeLabel} diamond — ${color}/${clarity} — ${formatPrice(price)}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-cream" style={{ aspectRatio: "1/1" }}>
        {imageUrl && !imgErr ? (
          <Image
            src={imageUrl}
            alt={`${caratWeight}ct ${shapeLabel}`}
            fill
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgErr(true)}
          />
        ) : (
          /* SVG diamond placeholder */
          <div className="absolute inset-0 flex items-center justify-center text-warm-border-dark">
            <svg viewBox="0 0 80 80" className="w-20 h-20" aria-hidden>
              <polygon points="40,8 68,30 56,68 24,68 12,30" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="12" y1="30" x2="68" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3"/>
              <line x1="40" y1="8"  x2="24" y2="68" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3"/>
              <line x1="40" y1="8"  x2="56" y2="68" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3"/>
              <line x1="12" y1="30" x2="56" y2="68" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3"/>
              <line x1="68" y1="30" x2="24" y2="68" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3"/>
            </svg>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); setWishlisted(w => !w); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={wishlisted}
        >
          <Heart className={cn("w-3.5 h-3.5 transition-colors", wishlisted ? "fill-rose-500 text-rose-500" : "text-warm-gray")} />
        </button>

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {isLab && (
            <span className="text-2xs font-semibold tracking-wide px-2 py-0.5 bg-emerald-600 text-white">Lab</span>
          )}
          {eyeClean && (
            <span className="text-2xs font-semibold tracking-wide px-2 py-0.5 bg-charcoal text-white">Eye Clean</span>
          )}
        </div>

        {/* Ethical icon badges */}
        {badges.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5 flex gap-1">
            {badges.map(({ icon: Icon, tip, cls }) => (
              <span key={tip} title={tip} className="w-6 h-6 bg-white/90 backdrop-blur-sm flex items-center justify-center" aria-label={tip}>
                <Icon className={cn("w-3 h-3", cls)} />
              </span>
            ))}
          </div>
        )}

        {/* Video indicator */}
        {videoUrl && (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-2xs font-semibold text-warm-gray">
              <Video className="w-2.5 h-2.5" />360°
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Name */}
        <p className="font-medium text-charcoal text-sm leading-tight">
          {caratWeight}ct {shapeLabel}
        </p>
        {/* 4Cs */}
        <p className="text-xs text-warm-gray mt-1">
          {color} · {clarity} · {cutGrade}
        </p>
        {/* Cert */}
        {certificationLab && (
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-2xs text-warm-gray/70">{certificationLab} Certified</span>
            {certificateUrl && (
              <a href={certificateUrl} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-warm-gray/50 hover:text-gold-dark transition-colors"
                aria-label="View certificate"
              >
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        )}

        {/* Price */}
        <p className="font-display text-xl text-charcoal mt-3" style={{ fontWeight: 400 }}>
          {formatPrice(price)}
        </p>

        {/* CTA */}
        <div className="mt-4">
          {inConfigurator && onSelect ? (
            <button
              onClick={() => onSelect(diamond)}
              className="w-full py-2.5 bg-charcoal text-white text-xs font-semibold tracking-[0.12em] uppercase hover:bg-charcoal-mid transition-colors duration-200"
            >
              Select Diamond
            </button>
          ) : (
            <Link
              href={`/diamonds/${id}?configure=true`}
              className="block w-full py-2.5 bg-charcoal text-white text-xs font-semibold tracking-[0.12em] uppercase hover:bg-charcoal-mid transition-colors duration-200 text-center"
            >
              Select Diamond
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
