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
import { AnimatedConfiguratorHeader } from "@/components/configurator/AnimatedConfiguratorHeader";

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

  return (
    <main className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 py-8">
      <AnimatedConfiguratorHeader
        entry={entry}
        entryLabels={ENTRY_LABELS}
      />

      <Suspense fallback={<ConfiguratorSkeleton />}>
        <ConfiguratorClient entry={entry} />
      </Suspense>
    </main>
  );
}

function ConfiguratorSkeleton() {
  return (
    <div className="flex gap-8">
      <div className="hidden lg:block w-72 shrink-0 h-screen shimmer bg-cream" />
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="shimmer bg-cream aspect-square" />
        ))}
      </div>
    </div>
  );
}
