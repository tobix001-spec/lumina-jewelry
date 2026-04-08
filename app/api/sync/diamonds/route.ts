/**
 * app/api/sync/diamonds/route.ts
 * POST /api/sync/diamonds — RapNet delta sync endpoint.
 *
 * Called every 15 minutes by a cron job (AWS Lambda / Vercel Cron).
 * Fetches diamonds updated since the last sync, upserts into PostgreSQL,
 * and marks out-of-stock items as unavailable.
 *
 * Security: requires a shared secret via Authorization header to prevent
 * unauthorized sync triggers. This is NOT a user-facing endpoint.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchDeltaInventory } from "@/lib/rapnet";
import { invalidateCachePattern } from "@/lib/redis";

const SYNC_SECRET = process.env.SYNC_SECRET ?? "";

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Validate shared secret
  const auth = request.headers.get("authorization");
  if (!auth || auth !== `Bearer ${SYNC_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the most recent sync timestamp
    const lastSync = await prisma.diamond.findFirst({
      orderBy: { lastSyncedAt: "desc" },
      select: { lastSyncedAt: true },
    });

    const since = lastSync?.lastSyncedAt ?? new Date(Date.now() - 1000 * 60 * 60); // default: 1h ago

    let page = 1;
    let totalProcessed = 0;
    let hasMore = true;

    while (hasMore) {
      const { diamonds, total } = await fetchDeltaInventory(since, page, 500);

      for (const diamond of diamonds) {
        await prisma.diamond.upsert({
          where: { supplierStockId: diamond.supplierStockId },
          create: {
            ...diamond,
            lastSyncedAt: new Date(),
          },
          update: {
            ...diamond,
            lastSyncedAt: new Date(),
          },
        });
      }

      totalProcessed += diamonds.length;
      hasMore = totalProcessed < total;
      page++;

      // Safety limit: max 10 pages per sync cycle (5,000 diamonds)
      if (page > 10) break;
    }

    // Invalidate all diamond search caches after sync
    await invalidateCachePattern("diamonds:search:*");

    return NextResponse.json({
      success: true,
      processed: totalProcessed,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[POST /api/sync/diamonds]", error);
    return NextResponse.json(
      { success: false, error: "Sync failed" },
      { status: 500 }
    );
  }
}
