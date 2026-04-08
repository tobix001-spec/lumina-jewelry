/**
 * app/api/inventory/diamonds/[id]/route.ts
 * GET /api/inventory/diamonds/:id  — Diamond detail + real-time availability
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheAside, invalidateCache, CACHE_TTL } from "@/lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;

  try {
    const diamond = await cacheAside(
      `diamond:${id}`,
      CACHE_TTL.DIAMOND_DETAIL,
      () =>
        prisma.diamond.findUnique({
          where: { id },
        })
    );

    if (!diamond) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Diamond not found" } },
        { status: 404 }
      );
    }

    if (!diamond.isAvailable) {
      // Eagerly evict stale cache entry
      await invalidateCache(`diamond:${id}`);
      return NextResponse.json(
        { success: false, error: { code: "UNAVAILABLE", message: "Diamond is no longer available" } },
        { status: 410 }
      );
    }

    return NextResponse.json({ success: true, data: diamond });
  } catch (error) {
    console.error("[GET /api/inventory/diamonds/:id]", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch diamond" } },
      { status: 500 }
    );
  }
}
