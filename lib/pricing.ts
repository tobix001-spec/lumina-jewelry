/**
 * lib/pricing.ts
 * Price calculation engine for ring configurations.
 *
 * Markup strategy:
 *  - Diamond: wholesale price * markupMultiplier (sourced from env)
 *  - Setting: flat base price from catalog (no additional markup)
 *  - Engraving: $50 fixed fee
 *  - Rush shipping: $75 fixed fee
 *  - Tax: configurable rate per jurisdiction (simplified to flat rate here)
 *  - Shipping: free on orders ≥ FREE_SHIPPING_THRESHOLD, else $25
 *
 * In production, tax rates would integrate with a service like TaxJar or Avalara.
 */

import type { Diamond, Setting, PriceBreakdown } from "@/types";

// Loaded from environment; default 1.5× wholesale markup
const DIAMOND_MARKUP = parseFloat(process.env.DIAMOND_MARKUP_MULTIPLIER ?? "1.5");

const ENGRAVING_FEE = 50;
const RUSH_SHIPPING_FEE = 75;
const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_FEE = 25;
const TAX_RATE = parseFloat(process.env.DEFAULT_TAX_RATE ?? "0.08"); // 8%

export interface PriceCalculationInput {
  diamond: Diamond;
  setting: Setting;
  hasEngraving: boolean;
  rushShipping: boolean;
}

/**
 * Calculate the full price breakdown for a ring configuration.
 * All values are in USD, rounded to 2 decimal places.
 */
export function calculateRingPrice(input: PriceCalculationInput): PriceBreakdown {
  const { diamond, setting, hasEngraving, rushShipping } = input;

  // Diamond price already includes markup from RapNet sync pipeline
  const diamondPrice = round(diamond.price * DIAMOND_MARKUP);
  const settingPrice = round(setting.basePrice);

  let customizationFee = 0;
  if (hasEngraving) customizationFee += ENGRAVING_FEE;
  if (rushShipping) customizationFee += RUSH_SHIPPING_FEE;

  const subtotal = round(diamondPrice + settingPrice + customizationFee);
  const tax = round(subtotal * TAX_RATE);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = round(subtotal + tax + shippingCost);

  return {
    diamondPrice,
    settingPrice,
    customizationFee,
    subtotal,
    tax,
    shippingCost,
    total,
  };
}

/** Format a number as USD currency string (e.g. 4500 → "$4,500.00"). */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Round to 2 decimal places (avoids floating-point drift). */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Compute the price for a diamond-only purchase (no setting).
 * Used on the standalone diamond PLP.
 */
export function calculateDiamondOnlyPrice(diamond: Diamond): number {
  return round(diamond.price * DIAMOND_MARKUP);
}

/**
 * Validates that two prices (e.g., cart price vs. re-calculated price)
 * are within an acceptable tolerance (handles floating-point drift).
 */
export function isPriceConsistent(
  priceA: number,
  priceB: number,
  toleranceCents = 1
): boolean {
  return Math.abs(priceA - priceB) < toleranceCents / 100;
}
