import apiClient from "@/api/client";
import type {
  Plan,
  PlanId,
  BillingInterval,
  CheckoutSessionResponse,
  BillingPortalResponse,
  Invoice,
  Subscription,
  UsageSummary,
} from "@/types/billing";

// ---------------------------------------------------------------------------
// Plan catalog (static — mirrors DB seed data)
// Pricing: 20% annual discount (2 months free), 14-day free trial
// ---------------------------------------------------------------------------

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Up to 5 units",
      "Basic tenant management",
      "Rent tracking",
      "Maintenance requests",
    ],
    limits: { maxProperties: 5, maxUnits: 5, maxUsers: 1, hasAI: false },
    highlighted: false,
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 125,
    yearlyPrice: 1200, // ~$100/mo — 20% off (2 months free)
    features: [
      "Up to 100 units",
      "AI-powered analytics",
      "Automated rent collection",
      "Financial reporting",
      "Tenant screening",
      "Document management",
      "$2/unit overage",
      "14-day free trial",
    ],
    limits: { maxProperties: 100, maxUnits: 100, maxUsers: 5, hasAI: true },
    highlighted: true,
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPrice: 400,
    yearlyPrice: 3840, // ~$320/mo — 20% off (2 months free)
    features: [
      "Up to 300 units",
      "Advanced AI insights",
      "Owner portal",
      "API access",
      "Custom workflows",
      "Priority support",
      "Market reports",
      "$1.50/unit overage",
      "14-day free trial",
    ],
    limits: { maxProperties: 300, maxUnits: 300, maxUsers: 15, hasAI: true },
    highlighted: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 0, // Custom pricing — $1,264+/mo, contact sales
    yearlyPrice: 0,
    features: [
      "Unlimited units",
      "White-label options",
      "Dedicated CSM",
      "Custom integrations",
      "SLA guarantees",
      "Advanced security",
      "Data-driven market reports",
    ],
    limits: { maxProperties: 9999, maxUnits: 9999, maxUsers: 999, hasAI: true },
    highlighted: false,
  },
];

// ---------------------------------------------------------------------------
// Plan helpers
// ---------------------------------------------------------------------------

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function getMonthlyEquivalent(
  plan: Plan,
  interval: BillingInterval,
): number {
  return interval === "yearly"
    ? Math.round((plan.yearlyPrice / 12) * 100) / 100
    : plan.monthlyPrice;
}

export function getAnnualDiscount(plan: Plan): number {
  if (plan.monthlyPrice === 0) return 0;
  const fullAnnual = plan.monthlyPrice * 12;
  return Math.round(((fullAnnual - plan.yearlyPrice) / fullAnnual) * 100);
}

export function formatPrice(amount: number): string {
  if (amount === 0) return "Custom";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// ---------------------------------------------------------------------------
// Payment Intent API calls
// ---------------------------------------------------------------------------

export type PaymentType = "rent" | "deposit" | "subscription";

export interface CreatePaymentIntentParams {
  amount: number;
  userId: string;
  propertyId: string;
  paymentType: PaymentType;
  leaseId?: string;
  description?: string;
}

export async function createPaymentIntent(
  params: CreatePaymentIntentParams,
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const { data } = await apiClient.post<{
    data: { clientSecret: string };
  }>("/stripe/create-payment-intent", {
    amount: params.amount,
    currency: "usd",
    metadata: {
      userId: params.userId,
      propertyId: params.propertyId,
      paymentType: params.paymentType,
      ...(params.leaseId && { leaseId: params.leaseId }),
    },
  });
  return { clientSecret: data.data.clientSecret, paymentIntentId: "" };
}

// ---------------------------------------------------------------------------
// Subscription management API calls
// ---------------------------------------------------------------------------

export async function createSubscription(
  planId: PlanId,
  interval: BillingInterval,
): Promise<CheckoutSessionResponse> {
  const { data } = await apiClient.post<CheckoutSessionResponse>(
    "/billing/create-checkout",
    {
      planId,
      interval,
      successUrl: `${window.location.origin}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/billing`,
    },
  );
  return data;
}

export async function updateSubscription(
  subscriptionId: string,
  newPlanId: PlanId,
  interval: BillingInterval,
): Promise<Subscription> {
  const { data } = await apiClient.put<Subscription>(
    `/billing/subscription/${subscriptionId}`,
    {
      planId: newPlanId,
      interval,
    },
  );
  return data;
}

export async function cancelSubscription(): Promise<void> {
  await apiClient.post("/stripe/cancel-subscription");
}

export async function resumeSubscription(
  subscriptionId: string,
): Promise<Subscription> {
  const { data } = await apiClient.post<Subscription>(
    `/billing/subscription/${subscriptionId}/resume`,
  );
  return data;
}

// ---------------------------------------------------------------------------
// Billing portal & info API calls
// ---------------------------------------------------------------------------

export async function createCheckoutSession(
  planId: PlanId,
  interval: BillingInterval,
): Promise<CheckoutSessionResponse> {
  return createSubscription(planId, interval);
}

export async function createBillingPortalSession(): Promise<BillingPortalResponse> {
  const { data } =
    await apiClient.post<BillingPortalResponse>("/billing/portal");
  return data;
}

export async function getCurrentSubscription(): Promise<Subscription | null> {
  const { data } = await apiClient.get<Subscription | null>(
    "/billing/subscription",
  );
  return data;
}

export async function getInvoices(): Promise<Invoice[]> {
  const { data } = await apiClient.get<Invoice[]>("/billing/invoices");
  return data;
}

export async function getUsageSummary(): Promise<UsageSummary> {
  const { data } = await apiClient.get<UsageSummary>("/billing/usage");
  return data;
}

// ---------------------------------------------------------------------------
// Webhook handler types (backend reference — actual processing is server-side)
// ---------------------------------------------------------------------------

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      metadata: Record<string, string>;
      amount?: number;
      status?: string;
    };
  };
}

/**
 * Stripe webhook events handled by the backend:
 * - payment_intent.succeeded: Updates payment status to PAID in the database
 * - customer.subscription.created: Activates subscription record
 * - customer.subscription.updated: Syncs subscription changes
 * - customer.subscription.deleted: Marks subscription as canceled
 *
 * See backend/src/modules/payments/payment.service.ts for implementation.
 */
