/**
 * components/configurator/ConfiguratorClient.tsx
 * Client shell that wires the ring builder store entry point,
 * then renders the correct grid (diamonds or settings) alongside the sidebar.
 */

"use client";

import React, { useEffect } from "react";
import { useRingBuilderStore } from "@/store/useRingBuilderStore";
import { ConfiguratorSidebar } from "@/components/ConfiguratorSidebar";
import { DiamondListingClient } from "@/components/diamonds/DiamondListingClient";
import type { ConfiguratorEntry } from "@/store/useRingBuilderStore";
import type { DiamondFilters } from "@/types";

const DEFAULT_DIAMOND_FILTERS: DiamondFilters = {
  shapes: [],
  caratRange: [0.5, 5],
  colors: [],
  clarities: [],
  cutGrades: [],
  polish: [],
  symmetry: [],
  tableRange: [55, 65],
  depthRange: [55, 70],
  fluorescence: [],
  eyeClean: null,
  origins: [],
  renewableEnergy: false,
  carbonCapture: false,
  blockchainEnabled: false,
  priceRange: [500, 50000],
  preset: null,
};

const LAB_DIAMOND_FILTERS: DiamondFilters = {
  ...DEFAULT_DIAMOND_FILTERS,
  origins: ["LAB_GROWN"],
};

interface ConfiguratorClientProps {
  entry: ConfiguratorEntry;
}

export function ConfiguratorClient({ entry }: ConfiguratorClientProps) {
  const setEntryPoint = useRingBuilderStore((s) => s.setEntryPoint);
  const currentStep = useRingBuilderStore((s) => s.currentStep);

  // Apply the URL-driven entry point on mount
  useEffect(() => {
    setEntryPoint(entry);
  }, [entry, setEntryPoint]);

  // Determine initial filters based on entry point
  const initialFilters =
    entry === "START_WITH_LAB_DIAMOND" ? LAB_DIAMOND_FILTERS : DEFAULT_DIAMOND_FILTERS;

  return (
    <div className="flex gap-6 items-start">
      {/* Configurator sidebar (sticky on desktop) */}
      <div className="hidden lg:block w-72 shrink-0 sticky top-24">
        <ConfiguratorSidebar />
      </div>

      {/* Main content: show diamond grid on step 1, settings grid on step 2 */}
      <div className="flex-1 min-w-0">
        {currentStep === 1 && (
          <DiamondListingClient
            initialFilters={initialFilters}
          />
        )}

        {currentStep === 2 && (
          <div className="py-4">
            <h2 className="font-serif text-2xl text-stone-900 mb-6">
              Choose Your Setting
            </h2>
            {/* Settings grid would be rendered here — similar to DiamondListingClient */}
            <p className="text-stone-500 text-sm">
              Settings grid component — mirrors the diamond listing architecture,
              filtered by selected diamond shape compatibility.
            </p>
          </div>
        )}

        {(currentStep === 3 || currentStep === 4) && (
          <div className="lg:hidden">
            {/* On mobile, the sidebar becomes full-width for steps 3–4 */}
            <ConfiguratorSidebar className="w-full" />
          </div>
        )}
      </div>

      {/* Mobile sticky footer CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-stone-100 p-4 z-20">
        <ConfiguratorSidebar />
      </div>
    </div>
  );
}
