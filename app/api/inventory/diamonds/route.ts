/**
 * app/api/inventory/diamonds/route.ts
 * GET /api/inventory/diamonds
 *
 * Searches the virtual diamond inventory. Results are served from PostgreSQL
 * (synced from RapNet) with Redis caching. Supports the full filter matrix
 * including 4Cs, advanced grading metrics, ethical provenance, and presets.
 *
 * Query params: see DiamondSearchParams in types/index.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheAside, hashParams, CACHE_TTL } from "@/lib/redis";
import { DIAMOND_PRESETS } from "@/types";
import type { DiamondSearchParams, DiamondSearchResult } from "@/types";
import { z } from "zod";

// ─── Input Validation Schema ──────────────────────────────────────────────────

const SearchSchema = z.object({
  shape: z.union([z.string(), z.array(z.string())]).optional(),
  minCarat: z.coerce.number().min(0.1).max(20).optional(),
  maxCarat: z.coerce.number().min(0.1).max(20).optional(),
  color: z.union([z.string(), z.array(z.string())]).optional(),
  clarity: z.union([z.string(), z.array(z.string())]).optional(),
  cutGrade: z.union([z.string(), z.array(z.string())]).optional(),
  polish: z.union([z.string(), z.array(z.string())]).optional(),
  symmetry: z.union([z.string(), z.array(z.string())]).optional(),
  minTable: z.coerce.number().optional(),
  maxTable: z.coerce.number().optional(),
  minDepth: z.coerce.number().optional(),
  maxDepth: z.coerce.number().optional(),
  fluorescence: z.union([z.string(), z.array(z.string())]).optional(),
  eyeClean: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  origin: z.union([z.string(), z.array(z.string())]).optional(),
  renewableEnergy: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  carbonCapture: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  blockchainEnabled: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(24),
  sortBy: z.enum(["price", "caratWeight", "color", "clarity"]).default("price"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  preset: z.enum(["MOST_SPARKLE", "BEST_BALANCE", "BEST_VALUE"]).optional(),
});

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  // Parse all query params into a plain object for Zod
  const rawParams: Record<string, string | string[]> = {};
  searchParams.forEach((value, key) => {
    if (rawParams[key]) {
      // Multi-value params (e.g., shape=ROUND&shape=OVAL)
      rawParams[key] = Array.isArray(rawParams[key])
        ? [...(rawParams[key] as string[]), value]
        : [rawParams[key] as string, value];
    } else {
      rawParams[key] = value;
    }
  });

  const parsed = SearchSchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_PARAMS", message: parsed.error.message } },
      { status: 400 }
    );
  }

  const params = parsed.data;

  // Merge preset overrides BEFORE building the DB query
  let effectiveParams = { ...params };
  if (params.preset) {
    const presetOverrides = DIAMOND_PRESETS[params.preset];
    // Only apply preset values that aren't already explicitly provided
    if (presetOverrides.cutGrade && !params.cutGrade) {
      effectiveParams.cutGrade = presetOverrides.cutGrade as string[];
    }
    if (presetOverrides.color && !params.color) {
      effectiveParams.color = presetOverrides.color as string[];
    }
    if (presetOverrides.clarity && !params.clarity) {
      effectiveParams.clarity = presetOverrides.clarity as string[];
    }
    if (presetOverrides.eyeClean !== undefined && params.eyeClean === undefined) {
      effectiveParams.eyeClean = presetOverrides.eyeClean;
    }
  }

  const cacheKey = `diamonds:search:${hashParams(effectiveParams as unknown as Record<string, unknown>)}`;

  try {
    const result = await cacheAside<DiamondSearchResult>(
      cacheKey,
      CACHE_TTL.DIAMOND_SEARCH,
      () => queryDiamonds(effectiveParams)
    );

    return NextResponse.json({ success: true, data: result }, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[GET /api/inventory/diamonds]", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch diamonds" } },
      { status: 500 }
    );
  }
}

// ─── Database Query Builder ───────────────────────────────────────────────────

async function queryDiamonds(
  params: z.infer<typeof SearchSchema>
): Promise<DiamondSearchResult> {
  const {
    shape, minCarat, maxCarat, color, clarity, cutGrade,
    polish, symmetry, minTable, maxTable, minDepth, maxDepth,
    fluorescence, eyeClean, origin, renewableEnergy, carbonCapture,
    blockchainEnabled, minPrice, maxPrice, page, pageSize, sortBy, sortOrder,
  } = params;

  // Build Prisma where clause dynamically
  const where: Parameters<typeof prisma.diamond.findMany>[0]["where"] = {
    isAvailable: true,
    ...(shape && { shape: { in: toArray(shape) as string[] } }),
    ...(minCarat !== undefined || maxCarat !== undefined
      ? { caratWeight: { gte: minCarat, lte: maxCarat } }
      : {}),
    ...(color && { color: { in: toArray(color) } }),
    ...(clarity && { clarity: { in: toArray(clarity) } }),
    ...(cutGrade && { cutGrade: { in: toArray(cutGrade) } }),
    ...(polish && { polish: { in: toArray(polish) } }),
    ...(symmetry && { symmetry: { in: toArray(symmetry) } }),
    ...(minTable !== undefined || maxTable !== undefined
      ? { tablePercent: { gte: minTable, lte: maxTable } }
      : {}),
    ...(minDepth !== undefined || maxDepth !== undefined
      ? { depthPercent: { gte: minDepth, lte: maxDepth } }
      : {}),
    ...(fluorescence && { fluorescence: { in: toArray(fluorescence) } }),
    ...(eyeClean !== undefined ? { eyeClean } : {}),
    ...(origin && { origin: { in: toArray(origin) as string[] } }),
    ...(renewableEnergy ? { renewableEnergy: true } : {}),
    ...(carbonCapture ? { carbonCapture: true } : {}),
    ...(blockchainEnabled ? { blockchainId: { not: null } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? { price: { gte: minPrice, lte: maxPrice } }
      : {}),
  };

  const [diamonds, total] = await Promise.all([
    prisma.diamond.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.diamond.count({ where }),
  ]);

  return {
    diamonds: diamonds as unknown as DiamondSearchResult["diamonds"],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/** Normalize a single value or array to always be an array. */
function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
