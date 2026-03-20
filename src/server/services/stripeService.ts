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
