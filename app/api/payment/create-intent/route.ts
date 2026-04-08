/**
 * app/api/payment/create-intent/route.ts
 * POST /api/payment/create-intent
 *
 * Creates a Stripe PaymentIntent for the configured ring.
 * Amount is server-calculated (never trusted from client).
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { calculateRingPrice } from "@/lib/pricing";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const BodySchema = z.object({
  diamondId: z.string().cuid(),
  settingId: z.string().cuid(),
  hasEngraving: z.boolean().default(false),
  rushShipping: z.boolean().default(false),
  userId: z.string().cuid(),
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

  const { diamondId, settingId, hasEngraving, rushShipping, userId } = parsed.data;

  const [diamond, setting, user] = await Promise.all([
    prisma.diamond.findUnique({ where: { id: diamondId, isAvailable: true } }),
    prisma.setting.findUnique({ where: { id: settingId, isActive: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { email: true } }),
  ]);

  if (!diamond || !setting || !user) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Diamond, setting, or user not found" } },
      { status: 404 }
    );
  }

  const breakdown = calculateRingPrice({
    diamond: diamond as never,
    setting: setting as never,
    hasEngraving,
    rushShipping,
  });

  // Stripe requires amount in smallest currency unit (cents for USD)
  const amountInCents = Math.round(breakdown.total * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    receipt_email: user.email,
    metadata: {
      diamondId,
      settingId,
      userId,
      orderSource: "web_configurator",
    },
    // Enable payment methods via Stripe Dashboard configuration
    automatic_payment_methods: { enabled: true },
  });

  return NextResponse.json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountInCents,
      breakdown,
    },
  });
}
