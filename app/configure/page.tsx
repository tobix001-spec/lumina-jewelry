/**
 * app/configure/page.tsx — Ring Configurator Entry Page
 *
 * Handles all 5 entry points via `?entry=` URL param.
 * Renders the multi-step configurator alongside the diamond/setting grid.
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfiguratorClient } from "@/components/configurator/ConfiguratorClient";
import type { ConfiguratorEntry } from "@/store/useRingBuilderStore";

export const metadata: Metadata = {
  title: "Design Your Own Engagement Ring",
  description:
    "Build your perfect engagement ring step by step. Choose from 150,000+ certified diamonds, then pair with a handcrafted setting in your choice of metal.",
};

const ENTRY_LABELS: Record<ConfiguratorEntry, string> = {
  START_WITH_DIAMOND: "Start with a Diamond",
  START_WITH_SETTING: "Start with a Setting",
  START_WITH_LAB_DIAMOND: "Start with a Lab Diamond",
  START_WITH_GEMSTONE: "Start with a Gemstone",
  START_WITH_BRIDAL_SET: "Start with a Bridal Set",
};

export default function ConfigurePage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const entry = (searchParams.entry ?? "START_WITH_DIAMOND") as ConfiguratorEntry;
  const entryLabel = ENTRY_LABELS[entry] ?? ENTRY_LABELS.START_WITH_DIAMOND;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Entry point selector tabs */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900 mb-4">Design Your Own Ring</h1>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Configurator entry point"
        >
          {Object.entries(ENTRY_LABELS).map(([key, label]) => (
            <a
              key={key}
              href={`/configure?entry=${key}`}
              role="tab"
              aria-selected={entry === key}
              className={[
                "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                entry === key
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-400",
              ].join(" ")}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <Suspense fallback={<ConfiguratorSkeleton />}>
        <ConfiguratorClient entry={entry} />
      </Suspense>
    </main>
  );
}

function ConfiguratorSkeleton() {
  return (
    <div className="flex gap-8 animate-pulse">
      <div className="hidden lg:block w-72 shrink-0 h-screen rounded-2xl bg-stone-100" />
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-stone-100 aspect-square" />
        ))}
      </div>
    </div>
  );
}
