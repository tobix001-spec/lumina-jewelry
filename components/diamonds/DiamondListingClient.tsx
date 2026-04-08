"use client";

import React, { useState, useCallback, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { cn } from "@/lib/utils";
import { DiamondCard } from "./DiamondCard";
import { DiamondFilterSidebar } from "./DiamondFilterSidebar";
import type { DiamondFilters, DiamondSearchResult } from "@/types";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

async function fetchDiamonds(filters: DiamondFilters, page: number): Promise<DiamondSearchResult> {
  const p: Record<string, unknown> = {
    page, pageSize: 24, sortBy: "price", sortOrder: "asc",
    minCarat: filters.caratRange[0], maxCarat: filters.caratRange[1],
    minPrice: filters.priceRange[0], maxPrice: filters.priceRange[1],
  };
  if (filters.shapes.length)       p.shape       = filters.shapes;
  if (filters.colors.length)       p.color       = filters.colors;
  if (filters.clarities.length)    p.clarity     = filters.clarities;
  if (filters.cutGrades.length)    p.cutGrade    = filters.cutGrades;
  if (filters.origins.length)      p.origin      = filters.origins;
  if (filters.eyeClean !== null)   p.eyeClean    = String(filters.eyeClean);
  if (filters.renewableEnergy)     p.renewableEnergy  = "true";
  if (filters.carbonCapture)       p.carbonCapture    = "true";
  if (filters.blockchainEnabled)   p.blockchainEnabled = "true";
  if (filters.preset)              p.preset      = filters.preset;

  const { data } = await axios.get<{ success: true; data: DiamondSearchResult }>("/api/inventory/diamonds", { params: p });
  return data.data;
}

const PRESETS = [
  { key: "MOST_SPARKLE"  as const, label: "Most Sparkle",  sub: "Ideal-cut only",         icon: "✦" },
  { key: "BEST_BALANCE"  as const, label: "Best Balance",  sub: "Near-colorless, eye-clean",icon: "⚖" },
  { key: "BEST_VALUE"    as const, label: "Best Value",    sub: "Quality meets value",      icon: "◈" },
];

function paginate(cur: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4)   return [1, 2, 3, 4, 5, "…", total];
  if (cur >= total - 3) return [1, "…", total-4, total-3, total-2, total-1, total];
  return [1, "…", cur-1, cur, cur+1, "…", total];
}

interface Props { initialFilters: DiamondFilters; }

export function DiamondListingClient({ initialFilters }: Props) {
  const [filters, setFilters]   = useState<DiamondFilters>(initialFilters);
  const [page, setPage]         = useState(1);
  const [drawerOpen, setDrawer] = useState(false);
  const [, startT]              = useTransition();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["diamonds", filters, page],
    queryFn: () => fetchDiamonds(filters, page),
    staleTime: 5 * 60_000,
    placeholderData: prev => prev,
  });

  const update = useCallback((next: Partial<DiamondFilters>) => {
    startT(() => { setFilters(f => ({ ...f, ...next })); setPage(1); });
  }, []);

  const clear = useCallback(() => { setFilters(initialFilters); setPage(1); }, [initialFilters]);

  const activeCount = [
    filters.shapes.length,
    filters.colors.length,
    filters.clarities.length,
    filters.cutGrades.length,
    filters.origins.length,
    +filters.renewableEnergy,
    +filters.carbonCapture,
    +filters.blockchainEnabled,
    +(filters.preset !== null),
    +(filters.eyeClean !== null),
  ].reduce((a, b) => a + (b > 0 ? 1 : 0), 0);

  return (
    <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
      {/* Page header */}
      <div className="py-10 sm:py-14 border-b border-warm-border">
        <p className="label-caps text-gold-dark mb-3">Our Inventory</p>
        <h1 className="font-display text-4xl sm:text-5xl text-charcoal mb-6" style={{ fontWeight: 300 }}>
          Certified Diamonds
        </h1>
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p.key}
              onClick={() => update({ preset: filters.preset === p.key ? null : p.key })}
              aria-pressed={filters.preset === p.key}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 border text-sm transition-all duration-200",
                filters.preset === p.key
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-warm-border bg-white text-warm-gray hover:border-charcoal hover:text-charcoal"
              )}
            >
              <span>{p.icon}</span>
              <span className="font-medium">{p.label}</span>
              <span className="text-xs opacity-60 hidden sm:inline">— {p.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-10 py-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 xl:w-64 shrink-0" aria-label="Diamond filters">
          <div className="sticky top-28">
            <DiamondFilterSidebar filters={filters} onFiltersChange={update} onClearAll={clear} />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Mobile filter btn */}
              <button
                onClick={() => setDrawer(true)}
                className="lg:hidden flex items-center gap-2 border border-warm-border px-3.5 py-2 text-sm text-warm-gray hover:text-charcoal hover:border-charcoal transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeCount > 0 && (
                  <span className="w-4.5 h-4.5 bg-charcoal text-white text-2xs font-semibold rounded-full flex items-center justify-center">{activeCount}</span>
                )}
              </button>

              <p className="text-sm text-warm-gray">
                {isLoading ? "Loading…" : (
                  <><span className="font-semibold text-charcoal">{(data?.total ?? 0).toLocaleString()}</span> diamonds</>
                )}
              </p>

              {activeCount > 0 && (
                <button onClick={clear} className="flex items-center gap-1 text-xs text-warm-gray hover:text-charcoal underline underline-offset-2 transition-colors">
                  <X className="w-3 h-3" />Clear
                </button>
              )}
            </div>

            <select
              className="border border-warm-border px-3 py-2 text-xs text-warm-gray hover:border-charcoal focus:outline-none focus:border-gold transition-colors bg-white"
              defaultValue="price-asc"
              aria-label="Sort"
            >
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="carat-asc">Carat: Low → High</option>
              <option value="carat-desc">Carat: High → Low</option>
            </select>
          </div>

          {/* Error */}
          {isError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
              Failed to load diamonds. Please try again.
            </div>
          )}

          {/* Grid */}
          <div
            className={cn("grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 transition-opacity duration-300", isFetching && !isLoading && "opacity-60")}
            role="list"
            aria-busy={isLoading}
          >
            {isLoading
              ? Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="shimmer bg-cream" style={{ aspectRatio: "1/1" }} aria-hidden />
                ))
              : data?.diamonds.map(d => <DiamondCard key={d.id} diamond={d} role="listitem" />)
            }
          </div>

          {/* Empty */}
          {!isLoading && data?.diamonds.length === 0 && (
            <div className="py-24 text-center">
              <Sparkles className="w-10 h-10 text-warm-border mx-auto mb-4" />
              <p className="font-display text-2xl text-charcoal mb-2" style={{ fontWeight: 400 }}>No Diamonds Found</p>
              <p className="text-warm-gray text-sm mb-6">Try adjusting or clearing your filters.</p>
              <button onClick={clear} className="btn-primary">Clear All Filters</button>
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <nav className="flex items-center justify-between mt-12 pt-8 border-t border-warm-border" aria-label="Pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 px-4 py-2.5 border border-warm-border text-sm text-warm-gray hover:border-charcoal hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1">
                {paginate(page, data.totalPages).map((p, i) =>
                  p === "…" ? (
                    <span key={`e${i}`} className="px-2 text-warm-gray text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={cn(
                        "w-9 h-9 text-sm font-medium transition-all",
                        page === p ? "bg-charcoal text-white" : "text-warm-gray hover:bg-cream hover:text-charcoal"
                      )}
                      aria-current={page === p ? "page" : undefined}
                    >{p}</button>
                  )
                )}
              </div>

              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="flex items-center gap-2 px-4 py-2.5 border border-warm-border text-sm text-warm-gray hover:border-charcoal hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setDrawer(false)} aria-hidden />
          <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 overflow-y-auto shadow-luxury-xl lg:hidden animate-slide-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-warm-border sticky top-0 bg-white z-10">
              <p className="font-semibold text-charcoal text-sm">Filters</p>
              <button onClick={() => setDrawer(false)} aria-label="Close">
                <X className="w-4.5 h-4.5 text-warm-gray hover:text-charcoal transition-colors" />
              </button>
            </div>
            <div className="p-5">
              <DiamondFilterSidebar filters={filters} onFiltersChange={p => { update(p); }} onClearAll={() => { clear(); setDrawer(false); }} />
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-warm-border">
              <button onClick={() => setDrawer(false)} className="btn-primary w-full justify-center">
                View {data?.total?.toLocaleString() ?? "…"} Diamonds
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
