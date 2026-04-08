/**
 * lib/dummySettings.ts
 * Dummy ring settings data for development/demo.
 */

import type { Setting } from "@/types";

const METALS = [
  "FOURTEEN_K_WHITE_GOLD",
  "FOURTEEN_K_YELLOW_GOLD",
  "FOURTEEN_K_ROSE_GOLD",
  "EIGHTEEN_K_WHITE_GOLD",
  "EIGHTEEN_K_YELLOW_GOLD",
  "PLATINUM",
] as const;

const METAL_LABELS: Record<string, string> = {
  FOURTEEN_K_WHITE_GOLD: "14K White Gold",
  FOURTEEN_K_YELLOW_GOLD: "14K Yellow Gold",
  FOURTEEN_K_ROSE_GOLD: "14K Rose Gold",
  EIGHTEEN_K_WHITE_GOLD: "18K White Gold",
  EIGHTEEN_K_YELLOW_GOLD: "18K Yellow Gold",
  PLATINUM: "Platinum",
};

const STYLES = ["SOLITAIRE", "HALO", "THREE_STONE", "HIDDEN_HALO", "VINTAGE", "BEZEL", "NATURE_INSPIRED", "CATHEDRAL"] as const;

const ALL_SHAPES = ["ROUND", "OVAL", "EMERALD", "MARQUISE", "PEAR", "RADIANT", "CUSHION", "PRINCESS", "ASSCHER", "HEART"];

const SETTING_NAMES = [
  "Petite Nouveau",
  "Whisper Thin",
  "Riviera Pavé",
  "Luxe Comfort Fit",
  "Classic Six-Prong",
  "French Pavé",
  "Sunrise Basket",
  "Tapered Baguette",
  "Entwined Celtic",
  "Aria Hidden Halo",
  "Verdure Vine",
  "Empress Cathedral",
  "Regalia Three Stone",
  "Luna Bezel",
  "Heritage Milgrain",
  "Soleil Split Shank",
  "Cosette",
  "Ellora Solitaire",
  "Willow",
  "Deco Marquise",
  "Oceana Wave",
  "Bloom Petal",
  "Meridian Twist",
  "Athena",
];

function generateSettings(): Setting[] {
  const settings: Setting[] = [];
  let idx = 0;

  for (const name of SETTING_NAMES) {
    const metal = METALS[idx % METALS.length];
    const style = STYLES[idx % STYLES.length];
    const basePrice = [890, 1200, 1490, 1750, 2100, 950, 1350, 1650, 2400, 1100, 1800, 2200, 2800, 1400, 1950, 2600, 980, 1280, 1560, 2050, 1700, 1150, 1420, 1880][idx] || 1500;
    const imgIndex = (idx % 8) + 1;

    settings.push({
      id: `SET-${String(idx + 1).padStart(4, "0")}`,
      sku: `LUM-${style.slice(0, 3)}-${metal.slice(0, 3)}-${String(idx + 1).padStart(3, "0")}`,
      name: `${name} ${METAL_LABELS[metal]?.split(" ").pop() || ""}`.trim(),
      description: `Handcrafted ${METAL_LABELS[metal]} ${style.toLowerCase().replace(/_/g, " ")} setting with exquisite detailing.`,
      metalType: metal as Setting["metalType"],
      basePrice,
      imageUrl: `/generated/ring-${imgIndex}.jpg`,
      galleryUrls: [`/generated/ring-${imgIndex}.jpg`],
      style: style as Setting["style"],
      allowedShapes: ALL_SHAPES.slice(0, 6 + (idx % 5)) as Setting["allowedShapes"],
      isActive: true,
    });

    idx++;
  }

  return settings;
}

const DUMMY_SETTINGS = generateSettings();

export function getDummySettings(params: {
  metalType?: string | string[];
  style?: string | string[];
  compatibleShape?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}) {
  let filtered = [...DUMMY_SETTINGS];

  if (params.metalType) {
    const metals = Array.isArray(params.metalType) ? params.metalType : [params.metalType];
    filtered = filtered.filter((s) => metals.includes(s.metalType));
  }
  if (params.style) {
    const styles = Array.isArray(params.style) ? params.style : [params.style];
    filtered = filtered.filter((s) => styles.includes(s.style));
  }
  if (params.compatibleShape) {
    filtered = filtered.filter((s) => s.allowedShapes.includes(params.compatibleShape as any));
  }
  if (params.minPrice != null) {
    filtered = filtered.filter((s) => s.basePrice >= params.minPrice!);
  }
  if (params.maxPrice != null) {
    filtered = filtered.filter((s) => s.basePrice <= params.maxPrice!);
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || 24;
  const start = (page - 1) * pageSize;

  return {
    settings: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}
