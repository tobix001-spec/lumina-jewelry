/**
 * app/api/orders/create/route.ts
 * POST /api/orders/create
 *
 * Creates a confirmed order after payment intent is authorized.
 * Validates configuration, freezes prices at purchase time, decrements
 * virtual inventory, and returns the created order for confirmation page.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateRingPrice } from "@/lib/pricing";
import { z } from "zod";

const AddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(2).max(2),
  phoneNumber: z.string().optional(),
});

const CreateOrderSchema = z.object({
  userId: z.string().cuid(),
  diamondId: z.string().cuid(),
  settingId: z.string().cuid(),
  ringSize: z.string().min(1),
  engraving: z.string().max(30).optional(),
  engraveLocation: z.enum(["INSIDE", "OUTSIDE"]).optional(),
  giftMessage: z.string().max(250).optional(),
  rushShipping: z.boolean().default(false),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  paymentIntentId: z.string().min(1),
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

  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_PARAMS", message: parsed.error.message } },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Fetch diamond + setting atomically for price freeze
  const [diamond, setting] = await Promise.all([
    prisma.diamond.findUnique({
      where: { id: data.diamondId, isAvailable: true },
      include: { _count: true },
    }),
    prisma.setting.findUnique({
      where: { id: data.settingId, isActive: true },
      include: { allowedShapes: true },
    }),
  ]);

  if (!diamond) {
    return NextResponse.json(
      { success: false, error: { code: "DIAMOND_UNAVAILABLE", message: "Diamond is no longer available" } },
      { status: 409 }
    );
  }

  if (!setting) {
    return NextResponse.json(
      { success: false, error: { code: "SETTING_UNAVAILABLE", message: "Setting is no longer available" } },
      { status: 409 }
    );
  }

  // Verify shape compatibility server-side (never trust client)
  const allowedShapes = setting.allowedShapes.map((s) => s.allowedShape);
  if (!allowedShapes.includes(diamond.shape as never)) {
    return NextResponse.json(
      { success: false, error: { code: "SHAPE_MISMATCH", message: "Diamond shape incompatible with selected setting" } },
      { status: 422 }
    );
  }

  // Calculate price with server-authoritative logic
  const breakdown = calculateRingPrice({
    diamond: diamond as never,
    setting: setting as never,
    hasEngraving: Boolean(data.engraving),
    rushShipping: data.rushShipping,
  });

  // Generate human-readable order number
  const orderNumber = `LJ-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  // Wrap in transaction: mark diamond unavailable + create order atomically
  const order = await prisma.$transaction(async (tx) => {
    // Mark diamond as reserved (unavailable)
    await tx.diamond.update({
      where: { id: diamond.id },
      data: { isAvailable: false },
    });

    return tx.order.create({
      data: {
        userId: data.userId,
        orderNumber,
        status: "CONFIRMED",
        subtotalPrice: breakdown.subtotal,
        tax: breakdown.tax,
        shippingCost: breakdown.shippingCost,
        totalPrice: breakdown.total,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress ?? data.shippingAddress,
        paymentMethod: "stripe",
        paymentIntentId: data.paymentIntentId,
        paymentStatus: "AUTHORIZED",
        giftMessage: data.giftMessage,
        rushShipping: data.rushShipping,
        items: {
          create: {
            settingId: data.settingId,
            diamondId: data.diamondId,
            ringSize: data.ringSize,
            diamondPrice: breakdown.diamondPrice,
            settingPrice: breakdown.settingPrice,
            customizationFee: breakdown.customizationFee,
            totalItemPrice: breakdown.total,
            engraving: data.engraving,
            engraveLocation: data.engraveLocation,
          },
        },
      },
      include: { items: true },
    });
  });

  return NextResponse.json({ success: true, data: order }, { status: 201 });
}
