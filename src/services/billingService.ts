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
    monthlyPrice: 29,
    yearlyPrice: 278, // ~$23.20/mo — 20% off (2 months free)
    features: [
      "Up to 10 properties",
      "Basic tenant management",
      "Online rent collection",
      "Maintenance requests",
      "14-day free trial",
    ],
    limits: { maxProperties: 10, maxUnits: 25, maxUsers: 2, hasAI: false },
    highlighted: false,
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPrice: 79,
    yearlyPrice: 758, // ~$63.20/mo — 20% off (2 months free)
    features: [
      "Up to 50 properties",
      "AI-powered analytics",
      "Automated lease management",
      "Financial reporting",
      "Tenant screening",
      "14-day free trial",
    ],
    limits: { maxProperties: 50, maxUnits: 100, maxUsers: 5, hasAI: true },
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 149,
    yearlyPrice: 1430, // ~$119.20/mo — 20% off (2 months free)
    features: [
      "Up to 200 properties",
      "Advanced market reports",
      "API access",
      "Multi-user seats",
      "Priority support",
      "Custom workflows",
      "14-day free trial",
    ],
    limits: { maxProperties: 200, maxUnits: 500, maxUsers: 15, hasAI: true },
    highlighted: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 0, // Custom pricing — contact sales
    yearlyPrice: 0,
    features: [
      "Unlimited properties",
      "Dedicated account manager",
      "White-label options",
      "SLA guarantees",
      "Custom integrations",
      "Executive Business Reviews",
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
    clientSecret: string;
    paymentIntentId: string;
  }>("/billing/create-payment-intent", {
    amount: params.amount,
    metadata: {
      userId: params.userId,
      propertyId: params.propertyId,
      paymentType: params.paymentType,
      leaseId: params.leaseId,
    },
    description: params.description,
  });
  return data;
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
  await apiClient.post("/billing/cancel");
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
