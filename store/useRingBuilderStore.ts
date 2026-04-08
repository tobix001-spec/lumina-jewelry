/**
 * store/useRingBuilderStore.ts
 * Zustand global store for the multi-step ring configurator.
 *
 * Architecture notes:
 * - Immer-style mutations are avoided intentionally; plain object replacements
 *   keep the bundle lean and DevTools diffs readable.
 * - Selectors are defined outside the store so callers use stable references,
 *   preventing unnecessary re-renders on unrelated state changes.
 * - `persist` middleware is omitted deliberately — the wishlist API is the
 *   durable store; ephemeral configurator state lives only in memory.
 */

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  Diamond,
  Setting,
  PriceBreakdown,
  ConfigurationValidation,
  RingConfiguration,
} from "@/types";

// ─── Step Definitions ─────────────────────────────────────────────────────────

export type ConfiguratorStep = 1 | 2 | 3 | 4;
export type ConfiguratorEntry =
  | "START_WITH_SETTING"
  | "START_WITH_DIAMOND"
  | "START_WITH_LAB_DIAMOND"
  | "START_WITH_GEMSTONE"
  | "START_WITH_BRIDAL_SET";

export type ViewMode = "grid" | "details" | "3d";

// ─── State Shape ──────────────────────────────────────────────────────────────

interface RingBuilderState {
  // ── Configuration selections
  selectedDiamond: Diamond | null;
  selectedSetting: Setting | null;
  selectedRingSize: string | null;
  engraving: string;
  engraveLocation: "INSIDE" | "OUTSIDE";
  giftMessage: string;
  rushShipping: boolean;

  // ── Entry point (affects step ordering UI)
  entryPoint: ConfiguratorEntry;

  // ── Step navigation
  currentStep: ConfiguratorStep;
  completedSteps: Set<ConfiguratorStep>;

  // ── UI presentation
  viewMode: ViewMode;
  isLoading: boolean;

  // ── Derived / server-calculated values (populated after API call)
  priceBreakdown: PriceBreakdown | null;
  validation: ConfigurationValidation | null;

  // ── Actions
  setEntryPoint: (entry: ConfiguratorEntry) => void;
  setDiamond: (diamond: Diamond | null) => void;
  setSetting: (setting: Setting | null) => void;
  setRingSize: (size: string) => void;
  setEngraving: (text: string) => void;
  setEngraveLocation: (location: "INSIDE" | "OUTSIDE") => void;
  setGiftMessage: (message: string) => void;
  setRushShipping: (rush: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setCurrentStep: (step: ConfiguratorStep) => void;
  markStepCompleted: (step: ConfiguratorStep) => void;
  setPriceBreakdown: (breakdown: PriceBreakdown | null) => void;
  setValidation: (validation: ConfigurationValidation | null) => void;
  setIsLoading: (loading: boolean) => void;

  // ── High-level workflow actions
  advanceStep: () => void;
  retreatStep: () => void;
  resetConfiguration: () => void;
  serializeToWishlist: () => Omit<RingConfiguration, "configurationId"> | null;
}

// ─── Default Price Breakdown ──────────────────────────────────────────────────

const EMPTY_BREAKDOWN: PriceBreakdown = {
  diamondPrice: 0,
  settingPrice: 0,
  customizationFee: 0,
  subtotal: 0,
  tax: 0,
  shippingCost: 0,
  total: 0,
};

// ─── Store Factory ────────────────────────────────────────────────────────────

export const useRingBuilderStore = create<RingBuilderState>()(
  subscribeWithSelector((set, get) => ({
    // ── Initial State
    selectedDiamond: null,
    selectedSetting: null,
    selectedRingSize: null,
    engraving: "",
    engraveLocation: "INSIDE",
    giftMessage: "",
    rushShipping: false,

    entryPoint: "START_WITH_DIAMOND",
    currentStep: 1,
    completedSteps: new Set(),

    viewMode: "grid",
    isLoading: false,

    priceBreakdown: null,
    validation: null,

    // ── Setters
    setEntryPoint: (entry) =>
      set({
        entryPoint: entry,
        // Reset selections when changing entry mode
        selectedDiamond: null,
        selectedSetting: null,
        currentStep: 1,
        completedSteps: new Set(),
      }),

    setDiamond: (diamond) =>
      set((state) => ({
        selectedDiamond: diamond,
        // When starting from a diamond, mark step 1 as completed
        completedSteps: diamond
          ? new Set([...state.completedSteps, 1 as ConfiguratorStep])
          : removeFromSet(state.completedSteps, 1),
        // Clear pricing/validation to force recalculation
        priceBreakdown: null,
        validation: null,
      })),

    setSetting: (setting) =>
      set((state) => ({
        selectedSetting: setting,
        completedSteps: setting
          ? new Set([...state.completedSteps, 2 as ConfiguratorStep])
          : removeFromSet(state.completedSteps, 2),
        priceBreakdown: null,
        validation: null,
      })),

    setRingSize: (size) =>
      set((state) => ({
        selectedRingSize: size,
        completedSteps: size
          ? new Set([...state.completedSteps, 3 as ConfiguratorStep])
          : removeFromSet(state.completedSteps, 3),
      })),

    setEngraving: (text) => set({ engraving: text }),

    setEngraveLocation: (location) => set({ engraveLocation: location }),

    setGiftMessage: (message) => set({ giftMessage: message }),

    setRushShipping: (rush) => set({ rushShipping: rush }),

    setViewMode: (mode) => set({ viewMode: mode }),

    setCurrentStep: (step) => set({ currentStep: step }),

    markStepCompleted: (step) =>
      set((state) => ({
        completedSteps: new Set([...state.completedSteps, step]),
      })),

    setPriceBreakdown: (breakdown) => set({ priceBreakdown: breakdown }),

    setValidation: (validation) => set({ validation }),

    setIsLoading: (loading) => set({ isLoading: loading }),

    // ── Workflow navigation
    advanceStep: () =>
      set((state) => {
        const next = Math.min(state.currentStep + 1, 4) as ConfiguratorStep;
        return { currentStep: next };
      }),

    retreatStep: () =>
      set((state) => {
        const prev = Math.max(state.currentStep - 1, 1) as ConfiguratorStep;
        return { currentStep: prev };
      }),

    resetConfiguration: () =>
      set({
        selectedDiamond: null,
        selectedSetting: null,
        selectedRingSize: null,
        engraving: "",
        giftMessage: "",
        rushShipping: false,
        currentStep: 1,
        completedSteps: new Set(),
        priceBreakdown: null,
        validation: null,
      }),

    /**
     * Serialize current configuration into a wishlist-ready payload.
     * Returns null if required fields (diamond, setting, ring size) are missing.
     */
    serializeToWishlist: () => {
      const {
        selectedDiamond,
        selectedSetting,
        selectedRingSize,
        engraving,
        engraveLocation,
        giftMessage,
        rushShipping,
        priceBreakdown,
      } = get();

      if (!selectedDiamond || !selectedSetting || !selectedRingSize) {
        return null;
      }

      return {
        diamond: selectedDiamond,
        setting: selectedSetting,
        ringSize: selectedRingSize,
        engraving: engraving || undefined,
        engraveLocation: engraving ? engraveLocation : undefined,
        giftMessage: giftMessage || undefined,
        rushShipping,
        totalPrice: priceBreakdown?.total ?? 0,
      };
    },
  }))
);

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Immutably removes an element from a Set (returns a new Set). */
function removeFromSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  next.delete(value);
  return next;
}

// ─── Selectors (stable references for performance) ────────────────────────────

/** True when diamond, setting, and ring size are all selected. */
export const selectIsConfigurationComplete = (s: RingBuilderState): boolean =>
  s.selectedDiamond !== null &&
  s.selectedSetting !== null &&
  s.selectedRingSize !== null;

/** Returns the raw diamond price, or 0 if not selected. */
export const selectDiamondPrice = (s: RingBuilderState): number =>
  s.selectedDiamond?.price ?? 0;

/** Returns the raw setting base price, or 0 if not selected. */
export const selectSettingPrice = (s: RingBuilderState): number =>
  s.selectedSetting?.basePrice ?? 0;

/** Derived total before server confirms tax/shipping. */
export const selectClientTotal = (s: RingBuilderState): number =>
  (s.selectedDiamond?.price ?? 0) + (s.selectedSetting?.basePrice ?? 0);

/** Shape compatibility check between selected diamond and setting. */
export const selectIsShapeCompatible = (s: RingBuilderState): boolean => {
  if (!s.selectedDiamond || !s.selectedSetting) return true; // Not enough data to flag
  return s.selectedSetting.allowedShapes.includes(s.selectedDiamond.shape);
};

/** Formatted summary string for the review step. */
export const selectConfigurationSummary = (
  s: RingBuilderState
): string | null => {
  if (!s.selectedDiamond || !s.selectedSetting) return null;
  const { selectedDiamond: d, selectedSetting: st } = s;
  return `${d.caratWeight}ct ${d.shape} ${d.color}/${d.clarity} in ${st.name}`;
};

/**
 * Returns an array of validation errors computed client-side.
 * Server validation via /api/configurator/validate-config provides the
 * authoritative result; this gives instant feedback before the API call.
 */
export const selectClientValidationErrors = (
  s: RingBuilderState
): string[] => {
  const errors: string[] = [];

  if (s.selectedDiamond && s.selectedSetting) {
    if (!s.selectedSetting.allowedShapes.includes(s.selectedDiamond.shape)) {
      errors.push(
        `This setting does not support ${s.selectedDiamond.shape} diamonds. ` +
          `Compatible shapes: ${s.selectedSetting.allowedShapes.join(", ")}.`
      );
    }
  }

  if (s.engraving && s.engraving.length > 30) {
    errors.push("Engraving text cannot exceed 30 characters.");
  }

  return errors;
};

/**
 * Subscribe to diamond changes to trigger server-side price recalculation.
 * Call this once in a top-level provider component.
 */
export function subscribeToConfigChanges(
  onConfigChange: (
    diamond: Diamond | null,
    setting: Setting | null
  ) => void
): () => void {
  return useRingBuilderStore.subscribe(
    (s) => ({ diamond: s.selectedDiamond, setting: s.selectedSetting }),
    ({ diamond, setting }) => onConfigChange(diamond, setting),
    { equalityFn: (a, b) => a.diamond?.id === b.diamond?.id && a.setting?.id === b.setting?.id }
  );
}
