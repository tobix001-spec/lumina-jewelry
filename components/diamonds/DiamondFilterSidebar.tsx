"use client";

import React, { useState, useId } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import type { DiamondFilters, DiamondShape, DiamondOrigin } from "@/types";
import { DIAMOND_SHAPE_LABELS, COLOR_ORDER, CLARITY_ORDER } from "@/types";

/* ── Filter Group ─────────────────────────────────────────────────────────── */
function FilterGroup({ label, children, defaultOpen = true }: {
  label: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-warm-border pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
      <button
        className="flex items-center justify-between w-full text-left mb-4 group"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="label-caps text-charcoal/60 group-hover:text-charcoal transition-colors">{label}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-warm-gray transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && <div id={id}>{children}</div>}
    </div>
  );
}

/* ── Toggle Chips ─────────────────────────────────────────────────────────── */
function Chips<T extends string>({
  opts, selected, onToggle, map,
}: {
  opts: T[]; selected: T[]; onToggle: (v: T) => void; map?: Partial<Record<T, string>>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {opts.map(opt => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          aria-pressed={selected.includes(opt)}
          className={cn(
            "px-2.5 py-1 text-xs font-medium border transition-all duration-200",
            selected.includes(opt)
              ? "bg-charcoal border-charcoal text-white"
              : "bg-white border-warm-border text-warm-gray hover:border-warm-border-dark hover:text-charcoal"
          )}
        >
          {map?.[opt] ?? opt}
        </button>
      ))}
    </div>
  );
}

/* ── Dual Range Slider ────────────────────────────────────────────────────── */
function DualRange({
  min, max, step = 1, value, fmt, onChange,
}: {
  min: number; max: number; step?: number;
  value: [number, number];
  fmt?: (v: number) => string;
  onChange: (r: [number, number]) => void;
}) {
  const f = fmt ?? String;
  const pct = (v: number) => `${((v - min) / (max - min)) * 100}%`;

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-xs font-medium text-charcoal">{f(value[0])}</span>
        <span className="text-xs font-medium text-charcoal">{f(value[1])}</span>
      </div>
      <div className="relative h-5 flex items-center">
        {/* Track */}
        <div className="absolute inset-x-0 h-0.5 bg-warm-border rounded-full" />
        {/* Active fill */}
        <div
          className="absolute h-0.5 bg-charcoal rounded-full"
          style={{ left: pct(value[0]), right: `${100 - parseFloat(pct(value[1]))}%` }}
        />
        {/* Min thumb */}
        <input type="range" min={min} max={max} step={step} value={value[0]}
          onChange={e => { const v = Math.min(+e.target.value, value[1] - step); onChange([v, value[1]]); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
          aria-label={`Min ${f(value[0])}`}
        />
        {/* Max thumb */}
        <input type="range" min={min} max={max} step={step} value={value[1]}
          onChange={e => { const v = Math.max(+e.target.value, value[0] + step); onChange([value[0], v]); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
          aria-label={`Max ${f(value[1])}`}
        />
        {/* Visual thumbs */}
        {([value[0], value[1]] as const).map((v, i) => (
          <div key={i}
            className="absolute w-4 h-4 bg-white border-2 border-charcoal rounded-full shadow-luxury-sm -translate-x-1/2 pointer-events-none"
            style={{ left: pct(v) }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Sidebar ─────────────────────────────────────────────────────────── */
interface Props {
  filters: DiamondFilters;
  onFiltersChange: (p: Partial<DiamondFilters>) => void;
  onClearAll: () => void;
}

export function DiamondFilterSidebar({ filters, onFiltersChange, onClearAll }: Props) {
  const tog = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const CUTS = ["Excellent", "Very Good", "Good", "Fair", "Poor"];
  const POLISH_SYM = ["Excellent", "Very Good", "Good", "Fair"];
  const FLUOR = ["None", "Faint", "Medium", "Strong"];
  const SHAPES: DiamondShape[] = ["ROUND","OVAL","EMERALD","CUSHION","RADIANT","PEAR","MARQUISE","PRINCESS","ASSCHER","HEART","ELONGATED_CUSHION"];
  const ORIGINS: { value: DiamondOrigin; label: string }[] = [
    { value: "NATURAL",   label: "Natural Diamonds" },
    { value: "LAB_GROWN", label: "Lab Grown Diamonds" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="label-caps text-charcoal">Filters</p>
        <button onClick={onClearAll} className="text-xs text-warm-gray hover:text-charcoal underline underline-offset-2 transition-colors">Clear all</button>
      </div>

      {/* Shape */}
      <FilterGroup label="Shape">
        <Chips opts={SHAPES} selected={filters.shapes}
          onToggle={s => onFiltersChange({ shapes: tog(filters.shapes, s) })}
          map={DIAMOND_SHAPE_LABELS as Partial<Record<DiamondShape, string>>}
        />
      </FilterGroup>

      {/* Carat */}
      <FilterGroup label="Carat Weight">
        <DualRange min={0.3} max={10} step={0.1} value={filters.caratRange}
          fmt={v => `${v.toFixed(1)}ct`}
          onChange={r => onFiltersChange({ caratRange: r })}
        />
      </FilterGroup>

      {/* Color */}
      <FilterGroup label="Color">
        <Chips opts={COLOR_ORDER} selected={filters.colors}
          onToggle={c => onFiltersChange({ colors: tog(filters.colors, c) })}
        />
        <p className="text-2xs text-warm-gray mt-2">D (colorless) → N (near colorless)</p>
      </FilterGroup>

      {/* Clarity */}
      <FilterGroup label="Clarity">
        <Chips opts={CLARITY_ORDER} selected={filters.clarities}
          onToggle={c => onFiltersChange({ clarities: tog(filters.clarities, c) })}
        />
      </FilterGroup>

      {/* Cut */}
      <FilterGroup label="Cut">
        <Chips opts={CUTS} selected={filters.cutGrades}
          onToggle={c => onFiltersChange({ cutGrades: tog(filters.cutGrades, c) })}
        />
      </FilterGroup>

      {/* Origin */}
      <FilterGroup label="Origin">
        <div className="space-y-2.5">
          {ORIGINS.map(o => (
            <label key={o.value} className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-4 h-4 border flex items-center justify-center transition-all duration-150 shrink-0",
                filters.origins.includes(o.value) ? "border-charcoal bg-charcoal" : "border-warm-border group-hover:border-warm-border-dark"
              )}>
                {filters.origins.includes(o.value) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
              <input type="checkbox" checked={filters.origins.includes(o.value)} onChange={() => onFiltersChange({ origins: tog(filters.origins, o.value) })} className="sr-only" />
              <span className="text-sm text-charcoal/70 group-hover:text-charcoal transition-colors">{o.label}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Advanced — collapsed by default */}
      <FilterGroup label="Polish" defaultOpen={false}>
        <Chips opts={POLISH_SYM} selected={filters.polish} onToggle={p => onFiltersChange({ polish: tog(filters.polish, p) })} />
      </FilterGroup>

      <FilterGroup label="Symmetry" defaultOpen={false}>
        <Chips opts={POLISH_SYM} selected={filters.symmetry} onToggle={s => onFiltersChange({ symmetry: tog(filters.symmetry, s) })} />
      </FilterGroup>

      <FilterGroup label="Fluorescence" defaultOpen={false}>
        <Chips opts={FLUOR} selected={filters.fluorescence} onToggle={f => onFiltersChange({ fluorescence: tog(filters.fluorescence, f) })} />
      </FilterGroup>

      <FilterGroup label="Table %" defaultOpen={false}>
        <DualRange min={50} max={80} step={1} value={filters.tableRange} fmt={v => `${v}%`} onChange={r => onFiltersChange({ tableRange: r })} />
      </FilterGroup>

      <FilterGroup label="Depth %" defaultOpen={false}>
        <DualRange min={50} max={75} step={1} value={filters.depthRange} fmt={v => `${v}%`} onChange={r => onFiltersChange({ depthRange: r })} />
      </FilterGroup>

      {/* Eye Clean */}
      <FilterGroup label="Eye Clean" defaultOpen={false}>
        <div className="flex gap-2">
          {(["Yes","No","Any"] as const).map(v => {
            const val = v === "Yes" ? true : v === "No" ? false : null;
            return (
              <button key={v} onClick={() => onFiltersChange({ eyeClean: val })}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium border transition-all duration-200",
                  filters.eyeClean === val
                    ? "bg-charcoal border-charcoal text-white"
                    : "bg-white border-warm-border text-warm-gray hover:border-warm-border-dark"
                )}>
                {v}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* Ethical */}
      <FilterGroup label="Ethical Provenance">
        <div className="space-y-3">
          {[
            { key: "renewableEnergy" as const, label: "100% Renewable Energy", icon: "🌿" },
            { key: "carbonCapture"   as const, label: "Carbon Capture Certified", icon: "⚡" },
            { key: "blockchainEnabled" as const, label: "Blockchain Provenance", icon: "🔗" },
          ].map(({ key, label, icon }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-4 h-4 border flex items-center justify-center transition-all duration-150 shrink-0",
                filters[key] ? "border-charcoal bg-charcoal" : "border-warm-border group-hover:border-warm-border-dark"
              )}>
                {filters[key] && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <input type="checkbox" checked={filters[key]} onChange={e => onFiltersChange({ [key]: e.target.checked })} className="sr-only" />
              <span className="text-sm text-charcoal/70 group-hover:text-charcoal transition-colors">{icon} {label}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Price */}
      <FilterGroup label="Price">
        <DualRange min={200} max={100_000} step={100} value={filters.priceRange}
          fmt={v => v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`}
          onChange={r => onFiltersChange({ priceRange: r })}
        />
        <div className="flex gap-2 mt-4">
          {(["min","max"] as const).map((t) => (
            <input
              key={t}
              type="number"
              value={t === "min" ? filters.priceRange[0] : filters.priceRange[1]}
              onChange={e => {
                const v = Number(e.target.value);
                onFiltersChange({ priceRange: t === "min" ? [v, filters.priceRange[1]] : [filters.priceRange[0], v] });
              }}
              className="w-full border border-warm-border px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-gold transition-colors"
              placeholder={t === "min" ? "Min $" : "Max $"}
              aria-label={`${t === "min" ? "Minimum" : "Maximum"} price`}
            />
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}
