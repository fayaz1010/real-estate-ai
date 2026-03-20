import type { Plan } from "../../features/billing/types";

import apiClient from "@/api/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StripeInvoice {
  id: string;
  created: number;
  amount_paid: number;
  currency: string;
  status: string;
  invoice_pdf: string | null;
  description: string | null;
}

export interface UpcomingInvoice {
  amount_due: number;
  currency: string;
  period_start: number;
  period_end: number;
  lines: Array<{ description: string | null; amount: number }>;
}

export interface PaymentIntentInfo {
  id: string;
  amount: number;
  currency: string;
  status: string;
  metadata: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Billing API — all Stripe secret-key operations run on the backend
// ---------------------------------------------------------------------------

export async function createCustomer(
  email: string,
  name: string,
): Promise<string> {
  const { data } = await apiClient.post<{ data: { customerId: string } }>(
    "/billing/create-customer",
    { email, name },
  );
  return data.data.customerId;
}

export async function createSubscription(
  customerId: string,
  plan: Plan,
  interval: "monthly" | "annual" = "monthly",
  paymentMethodId?: string,
): Promise<string> {
  const { data } = await apiClient.post<{
    data: { subscriptionId: string };
  }>("/billing/create-subscription", {
    customerId,
    plan,
    interval,
    paymentMethodId,
  });
  return data.data.subscriptionId;
}

export async function cancelSubscription(
  subscriptionId: string,
): Promise<void> {
  await apiClient.post("/billing/cancel-subscription", { subscriptionId });
}

export async function getInvoiceHistory(
  customerId: string,
): Promise<StripeInvoice[]> {
  const { data } = await apiClient.get<{ data: StripeInvoice[] }>(
    `/billing/invoices?customerId=${encodeURIComponent(customerId)}`,
  );
  return data.data;
}

export async function createCheckoutSession(
  priceId: string,
  customerId: string,
  successUrl: string,
  cancelUrl: string,
): Promise<string> {
  const { data } = await apiClient.post<{ data: { sessionId: string } }>(
    "/billing/create-checkout-session",
    { priceId, customerId, successUrl, cancelUrl },
  );
  return data.data.sessionId;
}

export async function getSubscriptionStatus(
  subscriptionId: string,
): Promise<string> {
  const { data } = await apiClient.get<{ data: { status: string } }>(
    `/billing/subscription-status/${encodeURIComponent(subscriptionId)}`,
  );
  return data.data.status;
}

export async function getUpcomingInvoice(
  subscriptionId: string,
): Promise<UpcomingInvoice> {
  const { data } = await apiClient.get<{ data: UpcomingInvoice }>(
    `/billing/upcoming-invoice/${encodeURIComponent(subscriptionId)}`,
  );
  return data.data;
}

export async function createPaymentIntent(
  amount: number,
  currency: string = "usd",
  metadata: Record<string, string> = {},
): Promise<string> {
  const { data } = await apiClient.post<{ data: { clientSecret: string } }>(
    "/billing/create-payment-intent",
    { amount, currency, metadata },
  );
  return data.data.clientSecret;
}

export async function retrievePaymentIntent(
  paymentIntentId: string,
): Promise<PaymentIntentInfo> {
  const { data } = await apiClient.get<{ data: PaymentIntentInfo }>(
    `/billing/payment-intent/${encodeURIComponent(paymentIntentId)}`,
  );
  return data.data;
}
