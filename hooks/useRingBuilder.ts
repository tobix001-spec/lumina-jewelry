/**
 * hooks/useRingBuilder.ts
 * Custom hook that bridges the Zustand ring builder store with
 * React Query for server-driven price calculation and validation.
 *
 * Responsibilities:
 *  1. Expose store state + actions (re-exported for ergonomics)
 *  2. Auto-trigger price recalculation whenever diamond or setting changes
 *  3. Auto-trigger validation when all 3 required fields are present
 *  4. Provide addToCart — serializes configuration and calls the cart API
 *  5. Expose derived booleans (canProceedToNextStep, etc.) for UI gating
 */

"use client";

import { useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  useRingBuilderStore,
  selectIsConfigurationComplete,
  selectClientValidationErrors,
  selectClientTotal,
  selectIsShapeCompatible,
} from "@/store/useRingBuilderStore";
import type {
  PriceBreakdown,
  ConfigurationValidation,
  RingConfiguration,
} from "@/types";

// ─── API Helpers ──────────────────────────────────────────────────────────────

async function fetchPriceBreakdown(
  diamondId: string,
  settingId: string,
  hasEngraving: boolean,
  rushShipping: boolean
): Promise<PriceBreakdown> {
  const { data } = await axios.post<{ success: true; data: PriceBreakdown }>(
    "/api/configurator/calculate-price",
    { diamondId, settingId, hasEngraving, rushShipping }
  );
  return data.data;
}

async function fetchValidation(
  diamondId: string,
  settingId: string,
  ringSize: string
): Promise<ConfigurationValidation> {
  const { data } = await axios.post<{ success: true; data: ConfigurationValidation }>(
    "/api/configurator/validate-config",
    { diamondId, settingId, ringSize }
  );
  return data.data;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRingBuilder() {
  const store = useRingBuilderStore();
  const qc = useQueryClient();

  // ── Mutations (not queries — we want imperative triggers, not auto-fetching)

  const priceMutation = useMutation({
    mutationFn: ({
      diamondId,
      settingId,
      hasEngraving,
      rushShipping,
    }: {
      diamondId: string;
      settingId: string;
      hasEngraving: boolean;
      rushShipping: boolean;
    }) => fetchPriceBreakdown(diamondId, settingId, hasEngraving, rushShipping),
    onSuccess: (data) => store.setPriceBreakdown(data),
    onError: () => store.setPriceBreakdown(null),
  });

  const validationMutation = useMutation({
    mutationFn: ({
      diamondId,
      settingId,
      ringSize,
    }: {
      diamondId: string;
      settingId: string;
      ringSize: string;
    }) => fetchValidation(diamondId, settingId, ringSize),
    onSuccess: (data) => store.setValidation(data),
    onError: () => store.setValidation(null),
  });

  // ── Auto-trigger price calculation whenever diamond or setting changes
  useEffect(() => {
    const { selectedDiamond, selectedSetting, engraving, rushShipping } = store;
    if (selectedDiamond && selectedSetting) {
      priceMutation.mutate({
        diamondId: selectedDiamond.id,
        settingId: selectedSetting.id,
        hasEngraving: Boolean(engraving),
        rushShipping,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    store.selectedDiamond?.id,
    store.selectedSetting?.id,
    store.engraving,
    store.rushShipping,
  ]);

  // ── Auto-trigger validation when all required selections are present
  useEffect(() => {
    const { selectedDiamond, selectedSetting, selectedRingSize } = store;
    if (selectedDiamond && selectedSetting && selectedRingSize) {
      validationMutation.mutate({
        diamondId: selectedDiamond.id,
        settingId: selectedSetting.id,
        ringSize: selectedRingSize,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.selectedDiamond?.id, store.selectedSetting?.id, store.selectedRingSize]);

  // ── Add to Cart
  const addToCart = useCallback(async (): Promise<boolean> => {
    const payload = store.serializeToWishlist();
    if (!payload) return false;

    try {
      store.setIsLoading(true);
      // POST to cart endpoint (implementation depends on auth strategy)
      await axios.post("/api/cart/add", {
        ...payload,
        configurationId: crypto.randomUUID(),
      });
      qc.invalidateQueries({ queryKey: ["cart"] });
      return true;
    } catch {
      return false;
    } finally {
      store.setIsLoading(false);
    }
  }, [store, qc]);

  // ── Save to Wishlist
  const saveToWishlist = useCallback(async (): Promise<boolean> => {
    const { selectedDiamond, selectedSetting } = store;
    if (!selectedDiamond && !selectedSetting) return false;

    try {
      store.setIsLoading(true);
      await axios.post("/api/wishlist/add", {
        diamondId: selectedDiamond?.id,
        settingId: selectedSetting?.id,
        configuration: store.serializeToWishlist(),
      });
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      return true;
    } catch {
      return false;
    } finally {
      store.setIsLoading(false);
    }
  }, [store, qc]);

  // ── Step gate logic (used by step navigation buttons)
  const canProceedFromStep1 = Boolean(store.selectedDiamond);
  const canProceedFromStep2 = Boolean(store.selectedSetting) && selectIsShapeCompatible(store);
  const canProceedFromStep3 = Boolean(store.selectedRingSize);
  const isConfigurationComplete = selectIsConfigurationComplete(store);

  const canProceedFromCurrentStep =
    store.currentStep === 1
      ? canProceedFromStep1
      : store.currentStep === 2
      ? canProceedFromStep2
      : store.currentStep === 3
      ? canProceedFromStep3
      : isConfigurationComplete;

  return {
    // ── State
    selectedDiamond: store.selectedDiamond,
    selectedSetting: store.selectedSetting,
    selectedRingSize: store.selectedRingSize,
    engraving: store.engraving,
    engraveLocation: store.engraveLocation,
    giftMessage: store.giftMessage,
    rushShipping: store.rushShipping,
    currentStep: store.currentStep,
    completedSteps: store.completedSteps,
    viewMode: store.viewMode,
    priceBreakdown: store.priceBreakdown,
    validation: store.validation,
    entryPoint: store.entryPoint,
    isLoading: store.isLoading || priceMutation.isPending || validationMutation.isPending,

    // ── Actions
    setDiamond: store.setDiamond,
    setSetting: store.setSetting,
    setRingSize: store.setRingSize,
    setEngraving: store.setEngraving,
    setEngraveLocation: store.setEngraveLocation,
    setGiftMessage: store.setGiftMessage,
    setRushShipping: store.setRushShipping,
    setViewMode: store.setViewMode,
    setCurrentStep: store.setCurrentStep,
    setEntryPoint: store.setEntryPoint,
    advanceStep: store.advanceStep,
    retreatStep: store.retreatStep,
    resetConfiguration: store.resetConfiguration,

    // ── Higher-level actions
    addToCart,
    saveToWishlist,

    // ── Derived
    clientTotal: selectClientTotal(store),
    clientValidationErrors: selectClientValidationErrors(store),
    isShapeCompatible: selectIsShapeCompatible(store),
    isConfigurationComplete,
    canProceedFromCurrentStep,
    canProceedFromStep1,
    canProceedFromStep2,
    canProceedFromStep3,
  };
}
