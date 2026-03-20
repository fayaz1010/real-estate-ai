// Stripe API Client — frontend route definitions for /api/billing/* endpoints.
// All Stripe secret-key operations run on the backend. The frontend ONLY uses
// the publishable key (via VITE_STRIPE_PUBLISHABLE_KEY) for Stripe.js/Elements.

import apiClient from "@/api/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
}

export interface CreateSubscriptionRequest {
  customerId: string;
  priceId?: string;
  plan?: string;
  interval?: "monthly" | "annual";
  paymentMethodId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateSubscriptionResponse {
  subscriptionId?: string;
  sessionId?: string;
}

export interface CancelSubscriptionRequest {
  subscriptionId: string;
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

/**
 * Creates a Stripe PaymentIntent via the backend.
 * Returns the client secret for use with Stripe.js confirmCardPayment().
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentRequest,
): Promise<string> {
  const { data } = await apiClient.post<{ data: CreatePaymentIntentResponse }>(
    "/billing/create-payment-intent",
    {
      amount: params.amount,
      currency: params.currency || "usd",
      metadata: params.metadata || {},
    },
  );
  return data.data.clientSecret;
}

/**
 * Creates a Stripe subscription via the backend.
 * If priceId is provided, creates a checkout session and returns sessionId.
 * If plan is provided, creates a direct subscription and returns subscriptionId.
 */
export async function createSubscription(
  params: CreateSubscriptionRequest,
): Promise<CreateSubscriptionResponse> {
  const { data } = await apiClient.post<{ data: CreateSubscriptionResponse }>(
    "/billing/create-subscription",
    params,
  );
  return data.data;
}

/**
 * Cancels a Stripe subscription via the backend.
 */
export async function cancelSubscription(
  subscriptionId: string,
): Promise<void> {
  await apiClient.post("/billing/cancel-subscription", { subscriptionId });
}
