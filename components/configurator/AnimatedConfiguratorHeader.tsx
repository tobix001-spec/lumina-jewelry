"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion";
import type { ConfiguratorEntry } from "@/store/useRingBuilderStore";
import { Sparkles, Diamond, Heart, Layers } from "lucide-react";

const ENTRY_ICONS: Record<string, React.ElementType> = {
  START_WITH_DIAMOND: Diamond,
  START_WITH_SETTING: Layers,
  START_WITH_LAB_DIAMOND: Sparkles,
  START_WITH_BRIDAL_SET: Heart,
};

interface Props {
  entry: ConfiguratorEntry;
  entryLabels: Record<ConfiguratorEntry, string>;
}

export function AnimatedConfiguratorHeader({ entry, entryLabels }: Props) {
  return (
    <Reveal className="mb-8">
      <p className="label-caps text-gold-dark mb-3">Ring Builder</p>
      <h1 className="font-display text-4xl sm:text-5xl text-charcoal mb-6" style={{ fontWeight: 300 }}>
        Design Your Own Ring
      </h1>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Configurator entry point">
        {Object.entries(entryLabels).map(([key, label]) => {
          const Icon = ENTRY_ICONS[key] ?? Sparkles;
          const isActive = entry === key;
          return (
            <motion.a
              key={key}
              href={`/configure?entry=${key}`}
              role="tab"
              aria-selected={isActive}
              className={[
                "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium border transition-all duration-300",
                isActive
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-white text-warm-gray border-warm-border hover:border-charcoal hover:text-charcoal",
              ].join(" ")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {isActive && (
                <motion.div
                  layoutId="configurator-tab-indicator"
                  className="absolute inset-0 bg-charcoal -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </motion.a>
          );
        })}
      </div>
    </Reveal>
  );
}
