"use client";

import { useState } from "react";

const shapes = [
  "Round",
  "Oval",
  "Cushion",
  "Pear",
  "Emerald",
  "Princess",
  "Radiant",
  "Marquise",
];

const styles = [
  "Solitaire",
  "Halo",
  "Three Stone",
  "Hidden Halo",
  "Vintage",
  "Bezel",
  "Nature-Inspired",
  "Cathedral",
];

const metals = [
  "14K White Gold",
  "18K Yellow Gold",
  "Platinum",
  "14K Rose Gold",
];

const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
  "Best Sellers",
];

export function FilterBar() {
  const [activeShape, setActiveShape] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [activeMetal, setActiveMetal] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("Featured");

  return (
    <div className="mb-10">
      {/* Sort row */}
      <div className="flex items-center justify-between pb-6 border-b border-warm-border">
        <h2 className="label-caps text-charcoal">Filter By</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="label-caps text-warm-gray text-2xs">
            Sort
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-luxury py-2 px-3 text-xs w-44"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mt-6 space-y-5">
        {/* Shape */}
        <div>
          <p className="label-caps text-warm-gray text-2xs mb-2.5">Diamond Shape</p>
          <div className="flex flex-wrap gap-2">
            {shapes.map((shape) => (
              <button
                key={shape}
                onClick={() =>
                  setActiveShape(activeShape === shape ? null : shape)
                }
                className={`chip rounded-full ${
                  activeShape === shape ? "active" : ""
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <p className="label-caps text-warm-gray text-2xs mb-2.5">Ring Style</p>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() =>
                  setActiveStyle(activeStyle === style ? null : style)
                }
                className={`chip rounded-full ${
                  activeStyle === style ? "active" : ""
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Metal */}
        <div>
          <p className="label-caps text-warm-gray text-2xs mb-2.5">Metal Type</p>
          <div className="flex flex-wrap gap-2">
            {metals.map((metal) => (
              <button
                key={metal}
                onClick={() =>
                  setActiveMetal(activeMetal === metal ? null : metal)
                }
                className={`chip rounded-full ${
                  activeMetal === metal ? "active" : ""
                }`}
              >
                {metal}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
