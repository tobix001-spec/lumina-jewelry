"use client";

import React, { lazy, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useRingBuilder } from "@/hooks/useRingBuilder";
import { formatPrice } from "@/lib/pricing";
import { DIAMOND_SHAPE_LABELS, METAL_TYPE_LABELS, RING_SIZES } from "@/types";
import {
  ChevronRight, ChevronLeft, Diamond, Settings2, Ruler, ShoppingBag,
  Heart, AlertCircle, CheckCircle2, Loader2, Sparkles,
} from "lucide-react";

const RingVisualizer = lazy(() =>
  import("@/components/RingVisualizer").then(m => ({ default: m.RingVisualizer }))
);

/* ── Step indicator ───────────────────────────────────────────────────────── */
const STEPS = [
  { n: 1 as const, icon: Diamond,   label: "Diamond" },
  { n: 2 as const, icon: Settings2, label: "Setting" },
  { n: 3 as const, icon: Ruler,     label: "Details" },
  { n: 4 as const, icon: ShoppingBag, label: "Review" },
];

function StepBar({ current, done, onJump }: { current: number; done: Set<number>; onJump: (n: 1|2|3|4) => void }) {
  return (
    <div className="flex items-center justify-between mb-7">
      {STEPS.map(({ n, icon: Icon, label }, i) => {
        const complete = done.has(n);
        const active   = current === n;
        const clickable = complete || active;
        return (
          <React.Fragment key={n}>
            <button
              onClick={() => clickable && onJump(n)}
              disabled={!clickable}
              className={cn("flex flex-col items-center gap-1.5 transition-opacity", !clickable && "opacity-30 cursor-not-allowed")}
              aria-current={active ? "step" : undefined}
            >
              <div className={cn(
                "w-9 h-9 flex items-center justify-center border transition-all duration-300",
                active   ? "border-charcoal bg-charcoal text-white" :
                complete ? "border-gold bg-gold/15 text-gold-dark" :
                           "border-warm-border text-warm-gray"
              )}>
                {complete && !active ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={cn("text-2xs font-semibold tracking-wider uppercase", active ? "text-charcoal" : "text-warm-gray")}>{label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-px mx-1.5 transition-colors duration-300", done.has(n) ? "bg-gold/40" : "bg-warm-border")} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Price breakdown ──────────────────────────────────────────────────────── */
function PriceSummary() {
  const { selectedDiamond, selectedSetting, priceBreakdown, clientTotal, isLoading } = useRingBuilder();
  if (!selectedDiamond && !selectedSetting) return null;
  return (
    <div className="border-t border-warm-border pt-4 mt-4 space-y-2">
      {selectedDiamond && (
        <div className="flex justify-between text-sm">
          <span className="text-warm-gray">Diamond</span>
          <span className="font-medium text-charcoal">{formatPrice(selectedDiamond.price)}</span>
        </div>
      )}
      {selectedSetting && (
        <div className="flex justify-between text-sm">
          <span className="text-warm-gray">Setting</span>
          <span className="font-medium text-charcoal">{formatPrice(selectedSetting.basePrice)}</span>
        </div>
      )}
      {priceBreakdown?.customizationFee ? (
        <div className="flex justify-between text-sm">
          <span className="text-warm-gray">Customization</span>
          <span className="font-medium text-charcoal">{formatPrice(priceBreakdown.customizationFee)}</span>
        </div>
      ) : null}
      <div className="flex justify-between pt-2.5 mt-1 border-t border-warm-border">
        <span className="font-semibold text-charcoal text-sm">Estimated Total</span>
        <span className="font-display text-xl text-charcoal" style={{ fontWeight: 500 }}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : formatPrice(priceBreakdown?.total ?? clientTotal)}
        </span>
      </div>
      <p className="text-2xs text-warm-gray">Includes tax & shipping at checkout</p>
    </div>
  );
}

/* ── Validation messages ──────────────────────────────────────────────────── */
function Alerts() {
  const { clientValidationErrors, validation } = useRingBuilder();
  const errors   = [...clientValidationErrors, ...(validation?.errors ?? [])];
  const warnings = validation?.warnings ?? [];
  if (!errors.length && !warnings.length) return null;
  return (
    <div className="space-y-2 mt-3">
      {errors.map((e, i) => (
        <div key={i} role="alert" className="flex gap-2.5 p-3 bg-red-50 border-l-2 border-red-400 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><p>{e}</p>
        </div>
      ))}
      {warnings.map((w, i) => (
        <div key={i} className="flex gap-2.5 p-3 bg-amber-50 border-l-2 border-amber-400 text-sm text-amber-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><p>{w}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Selection cards ──────────────────────────────────────────────────────── */
function DiamondCard() {
  const { selectedDiamond, setDiamond, currentStep } = useRingBuilder();
  if (!selectedDiamond) return (
    <div className="border border-dashed border-warm-border-dark p-4 text-center text-sm text-warm-gray">
      No diamond selected
    </div>
  );
  const { caratWeight, shape, color, clarity, cutGrade, origin, certificationLab } = selectedDiamond;
  return (
    <div className="border border-warm-border p-4">
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="font-medium text-charcoal text-sm">{caratWeight}ct {DIAMOND_SHAPE_LABELS[shape]}</p>
          <p className="text-xs text-warm-gray mt-0.5">{color} / {clarity} · {cutGrade} Cut</p>
          {certificationLab && <p className="text-2xs text-warm-gray/70 mt-0.5">{certificationLab} Certified</p>}
        </div>
        <span className={cn("text-2xs font-semibold px-2 py-0.5 shrink-0", origin === "LAB_GROWN" ? "bg-emerald-100 text-emerald-700" : "bg-cream text-warm-gray")}>
          {origin === "LAB_GROWN" ? "Lab" : "Natural"}
        </span>
      </div>
      {currentStep > 1 && (
        <button onClick={() => setDiamond(null)} className="text-2xs text-warm-gray hover:text-charcoal underline underline-offset-2 mt-2 transition-colors">
          Change diamond
        </button>
      )}
    </div>
  );
}

function SettingCard() {
  const { selectedSetting, setSetting, currentStep } = useRingBuilder();
  if (!selectedSetting) return (
    <div className="border border-dashed border-warm-border-dark p-4 text-center text-sm text-warm-gray">
      No setting selected
    </div>
  );
  return (
    <div className="border border-warm-border p-4">
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="font-medium text-charcoal text-sm">{selectedSetting.name}</p>
          <p className="text-xs text-warm-gray mt-0.5">{METAL_TYPE_LABELS[selectedSetting.metalType]}</p>
        </div>
        <p className="text-sm font-medium text-charcoal shrink-0">{formatPrice(selectedSetting.basePrice)}</p>
      </div>
      {currentStep > 2 && (
        <button onClick={() => setSetting(null)} className="text-2xs text-warm-gray hover:text-charcoal underline underline-offset-2 mt-2 transition-colors">
          Change setting
        </button>
      )}
    </div>
  );
}

/* ── Step 3: Size & customisations ────────────────────────────────────────── */
function SizeStep() {
  const { selectedRingSize, setRingSize, engraving, setEngraving, engraveLocation, setEngraveLocation, giftMessage, setGiftMessage, rushShipping, setRushShipping } = useRingBuilder();
  return (
    <div className="space-y-6">
      {/* Size grid */}
      <div>
        <p className="label-caps text-charcoal/60 mb-3">Ring Size <span className="text-red-400">*</span></p>
        <div className="grid grid-cols-5 gap-1.5">
          {RING_SIZES.map(sz => (
            <button
              key={sz}
              onClick={() => setRingSize(sz)}
              aria-pressed={selectedRingSize === sz}
              className={cn(
                "py-2 text-xs font-medium border transition-all duration-150",
                selectedRingSize === sz
                  ? "bg-charcoal border-charcoal text-white"
                  : "bg-white border-warm-border text-warm-gray hover:border-charcoal hover:text-charcoal"
              )}
            >{sz}</button>
          ))}
        </div>
        <a href="/education/ring-sizing" className="text-2xs text-warm-gray hover:text-charcoal underline underline-offset-2 mt-2 inline-block transition-colors">
          Not sure of your size?
        </a>
      </div>

      {/* Engraving */}
      <div>
        <p className="label-caps text-charcoal/60 mb-3">Engraving — $50 <span className="normal-case font-normal text-warm-gray">(optional)</span></p>
        <input
          type="text" value={engraving} maxLength={30}
          onChange={e => setEngraving(e.target.value)}
          placeholder="Forever & Always"
          className="w-full border border-warm-border px-3.5 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold transition-colors"
        />
        <div className="flex justify-between mt-2">
          <div className="flex gap-4">
            {(["INSIDE","OUTSIDE"] as const).map(loc => (
              <label key={loc} className="flex items-center gap-1.5 text-xs text-warm-gray cursor-pointer">
                <input type="radio" name="loc" value={loc} checked={engraveLocation === loc} onChange={() => setEngraveLocation(loc)} className="accent-charcoal" />
                {loc === "INSIDE" ? "Inside" : "Outside"}
              </label>
            ))}
          </div>
          <span className="text-2xs text-warm-gray">{engraving.length}/30</span>
        </div>
      </div>

      {/* Gift message */}
      <div>
        <p className="label-caps text-charcoal/60 mb-3">Gift Message <span className="normal-case font-normal text-warm-gray">(optional)</span></p>
        <textarea rows={3} value={giftMessage} maxLength={250}
          onChange={e => setGiftMessage(e.target.value)}
          placeholder="Add a personal note…"
          className="w-full border border-warm-border px-3.5 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold transition-colors resize-none"
        />
      </div>

      {/* Rush shipping */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => setRushShipping(!rushShipping)}
          className={cn("w-4 h-4 border flex items-center justify-center shrink-0 mt-0.5 transition-all", rushShipping ? "border-charcoal bg-charcoal" : "border-warm-border group-hover:border-charcoal")}
        >
          {rushShipping && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
        <div>
          <p className="text-sm font-medium text-charcoal">Rush Production — $75</p>
          <p className="text-xs text-warm-gray mt-0.5">Priority crafting for 7–10 business day delivery</p>
        </div>
      </label>
    </div>
  );
}

/* ── Step 4: Review ───────────────────────────────────────────────────────── */
function ReviewStep() {
  const { addToCart, saveToWishlist, isLoading, validation } = useRingBuilder();
  const valid = validation?.isValid ?? false;
  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-gray leading-relaxed">Your ring will be handcrafted to order. Review your configuration before adding to cart.</p>
      <div className="bg-cream p-4 space-y-2.5">
        {[
          "Free insured shipping on all orders",
          "30-day free returns & exchanges",
          "Lifetime warranty & free resizing",
          "Lifetime diamond upgrade program",
        ].map(t => (
          <div key={t} className="flex items-center gap-2 text-sm text-charcoal/70">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{t}
          </div>
        ))}
      </div>
      <button
        onClick={addToCart}
        disabled={isLoading || !valid}
        className={cn("w-full py-3.5 flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200", valid && !isLoading ? "bg-charcoal text-white hover:bg-charcoal-mid" : "bg-warm-border text-warm-gray cursor-not-allowed")}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
        Add to Cart
      </button>
      <button
        onClick={saveToWishlist}
        disabled={isLoading}
        className="w-full py-3 border border-warm-border text-charcoal text-xs font-semibold tracking-[0.12em] uppercase hover:border-charcoal transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Heart className="w-4 h-4" />Save to Wishlist
      </button>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export function ConfiguratorSidebar({ className }: { className?: string }) {
  const { currentStep, completedSteps, setCurrentStep, advanceStep, retreatStep, canProceedFromCurrentStep, selectedDiamond, selectedSetting, isLoading } = useRingBuilder();

  const stepContent: Record<number, React.ReactNode> = {
    1: <div className="space-y-4"><p className="text-sm text-warm-gray">Browse and select a diamond from 150,000+ certified stones.</p><DiamondCard /></div>,
    2: <div className="space-y-4"><DiamondCard /><p className="text-sm text-warm-gray">Now choose a setting compatible with your diamond shape.</p><SettingCard /></div>,
    3: <div className="space-y-4"><DiamondCard /><SettingCard /><SizeStep /></div>,
    4: <div className="space-y-4"><DiamondCard /><SettingCard /><ReviewStep /></div>,
  };

  return (
    <aside className={cn("flex flex-col gap-5 bg-white border border-warm-border p-5", className)} aria-label="Ring configurator">
      {/* 3D preview */}
      <Suspense fallback={<div className="shimmer bg-cream" style={{ height: 180 }} />}>
        <RingVisualizer
          diamond={selectedDiamond}
          setting={selectedSetting}
          className="w-full"
          style={{ height: 180 }}
          interactive={false}
        />
      </Suspense>

      <StepBar current={currentStep} done={completedSteps} onJump={setCurrentStep} />

      <div className="flex-1 space-y-0.5 overflow-y-auto max-h-[55vh] pr-0.5">
        {stepContent[currentStep]}
        <Alerts />
      </div>

      <PriceSummary />

      {/* Nav buttons */}
      <div className="flex gap-2 pt-3 border-t border-warm-border">
        {currentStep > 1 && (
          <button onClick={retreatStep} className="flex items-center gap-1.5 px-4 py-2.5 border border-warm-border text-sm text-warm-gray hover:border-charcoal hover:text-charcoal transition-all">
            <ChevronLeft className="w-3.5 h-3.5" />Back
          </button>
        )}
        {currentStep < 4 && (
          <button
            onClick={advanceStep}
            disabled={!canProceedFromCurrentStep || isLoading}
            className={cn("flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200",
              canProceedFromCurrentStep ? "bg-charcoal text-white hover:bg-charcoal-mid" : "bg-cream border border-warm-border text-warm-gray cursor-not-allowed"
            )}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                {currentStep === 1 ? "Choose Setting" : currentStep === 2 ? "Customize" : "Review Order"}
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}
