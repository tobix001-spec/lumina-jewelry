/**
 * lib/dummyDiamonds.ts
 * Dummy diamond inventory data for development/demo.
 * Used when PostgreSQL is unavailable.
 */

import type { Diamond } from "@/types";

const SHAPES = ["ROUND", "OVAL", "EMERALD", "MARQUISE", "PEAR", "RADIANT", "CUSHION", "PRINCESS", "ASSCHER", "HEART"] as const;
const COLORS = ["D", "E", "F", "G", "H", "I", "J"] as const;
const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"] as const;
const CUTS = ["IDEAL", "EXCELLENT", "VERY_GOOD", "GOOD"] as const;
const ORIGINS = ["NATURAL", "LAB_GROWN"] as const;
const LABS = ["GIA", "IGI", "AGS"] as const;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateDiamond(index: number): Diamond {
  const rng = seededRandom(index * 7 + 42);

  const shape = SHAPES[Math.floor(rng() * SHAPES.length)];
  const color = COLORS[Math.floor(rng() * COLORS.length)];
  const clarity = CLARITIES[Math.floor(rng() * CLARITIES.length)];
  const cutGrade = CUTS[Math.floor(rng() * CUTS.length)];
  const origin = rng() > 0.4 ? "NATURAL" : "LAB_GROWN";
  const certLab = LABS[Math.floor(rng() * LABS.length)];
  const caratWeight = Math.round((0.3 + rng() * 4.7) * 100) / 100;
  const isLab = origin === "LAB_GROWN";

  // Price based on carat, color, clarity
  const colorIdx = COLORS.indexOf(color);
  const clarityIdx = CLARITIES.indexOf(clarity);
  const basePrice = caratWeight * (isLab ? 1800 : 5500);
  const qualityMult = 1 + (7 - colorIdx) * 0.08 + (8 - clarityIdx) * 0.1;
  const price = Math.round(basePrice * qualityMult / 10) * 10;

  return {
    id: `DIA-${String(index + 1).padStart(5, "0")}`,
    shape,
    caratWeight,
    color,
    clarity,
    cutGrade,
    polish: CUTS[Math.floor(rng() * 3)] as any,
    symmetry: CUTS[Math.floor(rng() * 3)] as any,
    fluorescence: rng() > 0.6 ? "NONE" : rng() > 0.3 ? "FAINT" : "MEDIUM",
    tablePercent: Math.round(54 + rng() * 12),
    depthPercent: Math.round(56 + rng() * 10 * 10) / 10,
    measurements: `${(5 + caratWeight * 1.2).toFixed(2)} x ${(5 + caratWeight * 1.15).toFixed(2)} x ${(3 + caratWeight * 0.7).toFixed(2)}`,
    price,
    origin: origin as any,
    certificationLab: certLab,
    certificateNumber: `${certLab}-${Math.floor(1000000 + rng() * 9000000)}`,
    certificateUrl: null,
    imageUrl: null,
    videoUrl: null,
    eyeClean: clarityIdx < 5,
    renewableEnergy: isLab && rng() > 0.3,
    carbonCapture: isLab && rng() > 0.6,
    blockchainId: rng() > 0.7 ? `0x${Math.floor(rng() * 16 ** 8).toString(16)}` : null,
    available: true,
    rapnetId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Diamond;
}

// Pre-generate 200 diamonds
export const DUMMY_DIAMONDS: Diamond[] = Array.from({ length: 200 }, (_, i) => generateDiamond(i));

/**
 * Search/filter dummy diamonds matching the API's filter contract.
 */
export function searchDummyDiamonds(params: {
  shapes?: string[];
  colors?: string[];
  clarities?: string[];
  cutGrades?: string[];
  origins?: string[];
  minCarat?: number;
  maxCarat?: number;
  minPrice?: number;
  maxPrice?: number;
  eyeClean?: boolean;
  renewableEnergy?: boolean;
  carbonCapture?: boolean;
  sortBy?: string;
  sortDir?: string;
  page?: number;
  limit?: number;
}): { diamonds: Diamond[]; total: number; page: number; pageSize: number } {
  let filtered = [...DUMMY_DIAMONDS];

  if (params.shapes?.length) {
    filtered = filtered.filter((d) => params.shapes!.includes(d.shape));
  }
  if (params.colors?.length) {
    filtered = filtered.filter((d) => params.colors!.includes(d.color));
  }
  if (params.clarities?.length) {
    filtered = filtered.filter((d) => params.clarities!.includes(d.clarity));
  }
  if (params.cutGrades?.length) {
    filtered = filtered.filter((d) => params.cutGrades!.includes(d.cutGrade));
  }
  if (params.origins?.length) {
    filtered = filtered.filter((d) => params.origins!.includes(d.origin));
  }
  if (params.minCarat != null) {
    filtered = filtered.filter((d) => d.caratWeight >= params.minCarat!);
  }
  if (params.maxCarat != null) {
    filtered = filtered.filter((d) => d.caratWeight <= params.maxCarat!);
  }
  if (params.minPrice != null) {
    filtered = filtered.filter((d) => d.price >= params.minPrice!);
  }
  if (params.maxPrice != null) {
    filtered = filtered.filter((d) => d.price <= params.maxPrice!);
  }
  if (params.eyeClean != null) {
    filtered = filtered.filter((d) => d.eyeClean === params.eyeClean);
  }
  if (params.renewableEnergy) {
    filtered = filtered.filter((d) => d.renewableEnergy);
  }
  if (params.carbonCapture) {
    filtered = filtered.filter((d) => d.carbonCapture);
  }

  // Sort
  const sortBy = params.sortBy || "price";
  const sortDir = params.sortDir === "desc" ? -1 : 1;
  filtered.sort((a, b) => {
    const av = (a as any)[sortBy] ?? 0;
    const bv = (b as any)[sortBy] ?? 0;
    return av > bv ? sortDir : av < bv ? -sortDir : 0;
  });

  const page = params.page || 1;
  const limit = params.limit || 24;
  const start = (page - 1) * limit;

  return {
    diamonds: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    pageSize: limit,
  };
}
