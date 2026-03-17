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
} from '@/types/billing';

// ---------------------------------------------------------------------------
// Plan catalog (static — mirrors DB seed data)
// ---------------------------------------------------------------------------

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 49,
    yearlyPrice: 470, // ~$39.17/mo — 20% off
    features: [
      'Up to 25 units',
      'Basic property management',
      'Tenant portal',
      'Rent collection',
      'Limited AI insights',
      '14-day free trial',
    ],
    limits: { maxProperties: 10, maxUnits: 25, maxUsers: 2, hasAI: false },
    highlighted: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 149,
    yearlyPrice: 1430, // ~$119.17/mo — 20% off
    features: [
      'Up to 100 units',
      'Full AI assistant',
      'Automated tenant screening',
      'Predictive maintenance alerts',
      'Financial reporting',
      'API access',
      '14-day free trial',
    ],
    limits: { maxProperties: 50, maxUnits: 100, maxUsers: 5, hasAI: true },
    highlighted: true,
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 399,
    yearlyPrice: 3830, // ~$319.17/mo — 20% off
    features: [
      'Up to 500 units',
      'Advanced AI analytics',
      'Portfolio optimization',
      'Custom workflows',
      'Priority support',
      'White-label options',
      '14-day free trial',
    ],
    limits: { maxProperties: 200, maxUnits: 500, maxUsers: 15, hasAI: true },
    highlighted: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 800,
    yearlyPrice: 7680, // custom — starting at $640/mo
    features: [
      'Unlimited units',
      'Dedicated AI model training',
      'Custom integrations',
      'SLA guarantees',
      'Dedicated account manager',
      'On-premise option',
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

export function getMonthlyEquivalent(plan: Plan, interval: BillingInterval): number {
  return interval === 'yearly' ? Math.round((plan.yearlyPrice / 12) * 100) / 100 : plan.monthlyPrice;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export async function createCheckoutSession(
  planId: PlanId,
  interval: BillingInterval,
): Promise<CheckoutSessionResponse> {
  const { data } = await apiClient.post<CheckoutSessionResponse>("/billing/create-checkout", {
    planId,
    interval,
    successUrl: `${window.location.origin}/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/billing`,
  });
  return data;
}

export async function createBillingPortalSession(): Promise<BillingPortalResponse> {
  const { data } = await apiClient.post<BillingPortalResponse>("/billing/portal");
  return data;
}

export async function getCurrentSubscription(): Promise<Subscription | null> {
  const { data } = await apiClient.get<Subscription | null>("/billing/subscription");
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

export async function cancelSubscription(): Promise<void> {
  await apiClient.post("/billing/cancel");
}
