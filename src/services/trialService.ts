import type { TrialStatus } from "../types/trial";
import type { PlanId, BillingInterval } from "../types/billing";
import { createCheckoutSession } from "./billingService";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const TRIAL_DURATION_DAYS = 14;
const TRIAL_EXPIRY_WARNING_DAYS = 3;

/** Features available during the Starter trial */
export const STARTER_TRIAL_FEATURES = {
  maxProperties: 10,
  basicTenantManagement: true,
  onlineRentCollection: true,
  maintenanceRequests: true,
} as const;

export type TrialFeature = keyof typeof STARTER_TRIAL_FEATURES;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function buildTrialStatus(startDate: Date, hasConverted = false): TrialStatus {
  const now = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + TRIAL_DURATION_DAYS);

  const msRemaining = endDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
  const isTrialing = !hasConverted && daysRemaining > 0;

  return {
    isTrialing,
    trialStartDate: startDate,
    trialEndDate: endDate,
    daysRemaining,
    hasConverted,
    usageHighlights: [
      { feature: "Properties", usageCount: 0, value: "0 / 10 properties used" },
      { feature: "Maintenance Requests", usageCount: 0, value: "0 maintenance requests tracked" },
      { feature: "Rent Collected", usageCount: 0, value: "$0 rent collected online" },
      { feature: "Tenant Screenings", usageCount: 0, value: "0 tenant screenings completed" },
    ],
  };
}

// ---------------------------------------------------------------------------
// Trial lifecycle
// ---------------------------------------------------------------------------

/** Start a 14-day trial for a newly registered user. */
export async function startTrial(userId: string): Promise<TrialStatus> {
  const startDate = new Date();
  localStorage.setItem(`trial_start_${userId}`, startDate.toISOString());
  localStorage.removeItem(`trial_converted_${userId}`);
  return buildTrialStatus(startDate);
}

/** Retrieve the current trial status for a user, or null if no trial exists. */
export async function getTrialStatus(userId: string): Promise<TrialStatus | null> {
  const stored = localStorage.getItem(`trial_start_${userId}`);
  if (!stored) return null;

  const hasConverted = localStorage.getItem(`trial_converted_${userId}`) === "true";
  return buildTrialStatus(new Date(stored), hasConverted);
}

/** Return the trial expiry date (ISO string) for a user, or null. */
export async function getTrialExpiryDate(userId: string): Promise<string | null> {
  const status = await getTrialStatus(userId);
  if (!status) return null;
  return status.trialEndDate.toISOString();
}

/** True when the trial has 3 or fewer days remaining. */
export async function isTrialExpiringSoon(userId: string): Promise<boolean> {
  const status = await getTrialStatus(userId);
  if (!status || !status.isTrialing) return false;
  return status.daysRemaining <= TRIAL_EXPIRY_WARNING_DAYS;
}

// ---------------------------------------------------------------------------
// Feature gating
// ---------------------------------------------------------------------------

export interface FeatureAccess {
  allowed: boolean;
  reason?: string;
}

/**
 * Check whether a user can access a given feature based on their trial /
 * subscription status. During the trial the Starter tier limits apply.
 * After trial expiry (without conversion) only basic viewing is permitted.
 */
export async function checkFeatureAccess(
  userId: string,
  feature: TrialFeature,
): Promise<FeatureAccess> {
  const status = await getTrialStatus(userId);

  // No trial record — not gated (e.g. already on a paid plan handled elsewhere)
  if (!status) return { allowed: true };

  // Converted users are no longer gated by the trial service
  if (status.hasConverted) return { allowed: true };

  // Active trial — Starter tier features are available
  if (status.isTrialing) {
    return { allowed: true };
  }

  // Trial expired and not converted — restrict to basic viewing
  return {
    allowed: false,
    reason: "Your free trial has expired. Upgrade to a paid plan to continue using this feature.",
  };
}

/**
 * Check whether the user has exceeded the trial property limit.
 */
export async function checkPropertyLimit(
  userId: string,
  currentPropertyCount: number,
): Promise<FeatureAccess> {
  const status = await getTrialStatus(userId);
  if (!status || status.hasConverted) return { allowed: true };

  if (status.isTrialing && currentPropertyCount >= STARTER_TRIAL_FEATURES.maxProperties) {
    return {
      allowed: false,
      reason: `Trial accounts are limited to ${STARTER_TRIAL_FEATURES.maxProperties} properties. Upgrade to add more.`,
    };
  }

  if (!status.isTrialing) {
    return {
      allowed: false,
      reason: "Your free trial has expired. Upgrade to a paid plan to manage properties.",
    };
  }

  return { allowed: true };
}

// ---------------------------------------------------------------------------
// Trial-to-paid conversion
// ---------------------------------------------------------------------------

/**
 * Initiate the conversion from trial to a paid subscription.
 * Creates a Stripe Checkout session via the billing service and returns the
 * redirect URL so the frontend can send the user to Stripe.
 */
export async function convertToPaidPlan(
  userId: string,
  planId: PlanId,
  interval: BillingInterval = "monthly",
): Promise<{ success: boolean; checkoutUrl?: string }> {
  try {
    const session = await createCheckoutSession(planId, interval);

    // Mark the trial as converted locally (server confirms via webhook)
    localStorage.setItem(`trial_converted_${userId}`, "true");

    return { success: true, checkoutUrl: session.url };
  } catch {
    return { success: false };
  }
}
