import type { Plan } from "../../features/billing/types";

const STRIPE_API_URL = "https://api.stripe.com/v1";

function getStripeSecretKey(): string {
  const key = import.meta.env.VITE_STRIPE_SECRET_KEY;
  if (!key) throw new Error("VITE_STRIPE_SECRET_KEY is not configured");
  return key;
}

function stripeHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getStripeSecretKey()}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

function encodeBody(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}

const PLAN_PRICE_IDS: Record<
  Exclude<Plan, "FREE" | "ENTERPRISE">,
  { monthly: string; annual: string }
> = {
  STARTER: {
    monthly: import.meta.env.VITE_STRIPE_PRICE_STARTER_MONTHLY ?? "",
    annual: import.meta.env.VITE_STRIPE_PRICE_STARTER_ANNUAL ?? "",
  },
  PROFESSIONAL: {
    monthly: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY ?? "",
    annual: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL_ANNUAL ?? "",
  },
  BUSINESS: {
    monthly: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_MONTHLY ?? "",
    annual: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_ANNUAL ?? "",
  },
};

export async function createCustomer(
  email: string,
  name: string,
): Promise<string> {
  const res = await fetch(`${STRIPE_API_URL}/customers`, {
    method: "POST",
    headers: stripeHeaders(),
    body: encodeBody({ email, name }),
  });
  if (!res.ok)
    throw new Error(`Failed to create Stripe customer: ${res.statusText}`);
  const data = await res.json();
  return data.id as string;
}

export async function createSubscription(
  customerId: string,
  plan: Plan,
  interval: "monthly" | "annual" = "monthly",
  paymentMethodId?: string,
): Promise<string> {
  if (plan === "FREE" || plan === "ENTERPRISE") {
    throw new Error(`Cannot create Stripe subscription for plan: ${plan}`);
  }

  const priceId = PLAN_PRICE_IDS[plan][interval];
  if (!priceId)
    throw new Error(`No Stripe price ID configured for ${plan} ${interval}`);

  const params: Record<string, string> = {
    customer: customerId,
    "items[0][price]": priceId,
    trial_period_days: "14",
  };

  if (paymentMethodId) {
    params.default_payment_method = paymentMethodId;
  }

  const res = await fetch(`${STRIPE_API_URL}/subscriptions`, {
    method: "POST",
    headers: stripeHeaders(),
    body: encodeBody(params),
  });
  if (!res.ok)
    throw new Error(`Failed to create Stripe subscription: ${res.statusText}`);
  const data = await res.json();
  return data.id as string;
}

export async function cancelSubscription(
  subscriptionId: string,
): Promise<void> {
  const res = await fetch(`${STRIPE_API_URL}/subscriptions/${subscriptionId}`, {
    method: "DELETE",
    headers: stripeHeaders(),
  });
  if (!res.ok)
    throw new Error(`Failed to cancel Stripe subscription: ${res.statusText}`);
}

export interface StripeInvoice {
  id: string;
  created: number;
  amount_paid: number;
  currency: string;
  status: string;
  invoice_pdf: string | null;
  description: string | null;
}

export async function getInvoiceHistory(
  customerId: string,
): Promise<StripeInvoice[]> {
  const params = new URLSearchParams({ customer: customerId, limit: "100" });
  const res = await fetch(`${STRIPE_API_URL}/invoices?${params.toString()}`, {
    headers: stripeHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch invoices: ${res.statusText}`);
  const data = await res.json();
  return data.data as StripeInvoice[];
}
