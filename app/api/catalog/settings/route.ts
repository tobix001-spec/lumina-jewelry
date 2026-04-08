/**
 * app/api/catalog/settings/route.ts
 * GET /api/catalog/settings
 *
 * Returns ring settings filtered by metal type, style, price, and—critically—
 * shape compatibility with a selected diamond. The `compatibleShape` filter is
 * the glue between Step 1 (diamond selection) and Step 2 (setting selection).
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheAside, hashParams, CACHE_TTL } from "@/lib/redis";
import type { Setting } from "@/types";
import { z } from "zod";

const SearchSchema = z.object({
  metalType: z.union([z.string(), z.array(z.string())]).optional(),
  style: z.union([z.string(), z.array(z.string())]).optional(),
  compatibleShape: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(24),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  const rawParams: Record<string, string | string[]> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    if (rawParams[key]) {
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
  const cacheKey = `settings:list:${hashParams(params as unknown as Record<string, unknown>)}`;

  try {
    const result = await cacheAside(
      cacheKey,
      CACHE_TTL.SETTING_LIST,
      () => querySettings(params)
    );
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[GET /api/catalog/settings]", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch settings" } },
      { status: 500 }
    );
  }
}

async function querySettings(params: z.infer<typeof SearchSchema>) {
  const { metalType, style, compatibleShape, minPrice, maxPrice, page, pageSize } = params;

  const where: Parameters<typeof prisma.setting.findMany>[0]["where"] = {
    isActive: true,
    ...(metalType && { metalType: { in: toArray(metalType) as string[] } }),
    ...(style && { style: { in: toArray(style) as string[] } }),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? { basePrice: { gte: minPrice, lte: maxPrice } }
      : {}),
    // Filter settings that have at least one SettingShape row for the given diamond shape
    ...(compatibleShape
      ? {
          allowedShapes: {
            some: { allowedShape: compatibleShape as string },
          },
        }
      : {}),
  };

  const [settings, total] = await Promise.all([
    prisma.setting.findMany({
      where,
      include: { allowedShapes: true },
      orderBy: { basePrice: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.setting.count({ where }),
  ]);

  // Flatten allowedShapes relation for the client
  const settingDTOs: Setting[] = settings.map((s) => ({
    id: s.id,
    sku: s.sku,
    name: s.name,
    description: s.description ?? undefined,
    metalType: s.metalType as Setting["metalType"],
    basePrice: s.basePrice,
    imageUrl: s.imageUrl ?? undefined,
    galleryUrls: s.galleryUrls,
    style: s.style as Setting["style"],
    allowedShapes: s.allowedShapes.map((shape) => shape.allowedShape as Setting["allowedShapes"][number]),
    isActive: s.isActive,
  }));

  return {
    settings: settingDTOs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
