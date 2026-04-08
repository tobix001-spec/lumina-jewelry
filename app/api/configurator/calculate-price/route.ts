/**
 * app/api/configurator/calculate-price/route.ts
 * POST /api/configurator/calculate-price
 *
 * Accepts diamondId + settingId + customizations and returns a full
 * PriceBreakdown. Called by the configurator on each selection change.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateRingPrice } from "@/lib/pricing";
import { z } from "zod";

const BodySchema = z.object({
  diamondId: z.string().cuid(),
  settingId: z.string().cuid(),
  hasEngraving: z.boolean().default(false),
  rushShipping: z.boolean().default(false),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } },
      { status: 400 }
    );
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_PARAMS", message: parsed.error.message } },
      { status: 400 }
    );
  }

  const { diamondId, settingId, hasEngraving, rushShipping } = parsed.data;

  // Fetch both in parallel
  const [diamond, setting] = await Promise.all([
    prisma.diamond.findUnique({ where: { id: diamondId, isAvailable: true } }),
    prisma.setting.findUnique({ where: { id: settingId, isActive: true } }),
  ]);

  if (!diamond) {
    return NextResponse.json(
      { success: false, error: { code: "DIAMOND_NOT_FOUND", message: "Diamond not found or unavailable" } },
      { status: 404 }
    );
  }

  if (!setting) {
    return NextResponse.json(
      { success: false, error: { code: "SETTING_NOT_FOUND", message: "Setting not found or discontinued" } },
      { status: 404 }
    );
  }

  const breakdown = calculateRingPrice({
    diamond: diamond as never,
    setting: setting as never,
    hasEngraving,
    rushShipping,
  });

  return NextResponse.json({ success: true, data: breakdown });
}
