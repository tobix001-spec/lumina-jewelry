/**
 * app/api/configurator/validate-config/route.ts
 * POST /api/configurator/validate-config
 *
 * Authoritative server-side validation of a ring configuration.
 * Checks shape compatibility, diamond availability, and setting status.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ConfigurationValidation } from "@/types";
import { z } from "zod";

const BodySchema = z.object({
  diamondId: z.string().cuid(),
  settingId: z.string().cuid(),
  ringSize: z.string().min(1).max(5),
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

  const { diamondId, settingId, ringSize } = parsed.data;

  const [diamond, settingWithShapes] = await Promise.all([
    prisma.diamond.findUnique({
      where: { id: diamondId },
      select: { id: true, shape: true, isAvailable: true },
    }),
    prisma.setting.findUnique({
      where: { id: settingId },
      select: { id: true, isActive: true, allowedShapes: true },
    }),
  ]);

  const errors: string[] = [];
  const warnings: string[] = [];
  let isCompatible = true;

  if (!diamond) {
    errors.push("The selected diamond could not be found.");
  } else if (!diamond.isAvailable) {
    errors.push("The selected diamond is no longer available. Please choose another.");
  }

  if (!settingWithShapes) {
    errors.push("The selected setting could not be found.");
  } else if (!settingWithShapes.isActive) {
    errors.push("The selected setting has been discontinued. Please choose another.");
  }

  if (diamond && settingWithShapes) {
    const allowedShapes = settingWithShapes.allowedShapes.map((s) => s.allowedShape);
    if (!allowedShapes.includes(diamond.shape as never)) {
      isCompatible = false;
      errors.push(
        `This setting does not support ${diamond.shape} diamonds. ` +
          `Compatible shapes: ${allowedShapes.join(", ")}.`
      );
    }
  }

  // Ring size soft validation — warn but don't hard-block
  const validSizes = ["5","5.5","6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11","11.5","12","12.5","13"];
  if (!validSizes.includes(ringSize)) {
    warnings.push(
      `Ring size ${ringSize} is outside standard range. Our jewelers will contact you to confirm.`
    );
  }

  const validation: ConfigurationValidation = {
    isValid: errors.length === 0,
    errors,
    warnings,
    isCompatible,
  };

  return NextResponse.json({ success: true, data: validation });
}
