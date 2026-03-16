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
import axios from 'axios';

const API_BASE = '/api/billing';

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
  const { data } = await axios.post<CheckoutSessionResponse>(`${API_BASE}/create-checkout`, {
    planId,
    interval,
    successUrl: `${window.location.origin}/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/billing`,
  });
  return data;
}

export async function createBillingPortalSession(): Promise<BillingPortalResponse> {
  const { data } = await axios.post<BillingPortalResponse>(`${API_BASE}/portal`);
  return data;
}

export async function getCurrentSubscription(): Promise<Subscription | null> {
  const { data } = await axios.get<Subscription | null>(`${API_BASE}/subscription`);
  return data;
}

export async function getInvoices(): Promise<Invoice[]> {
  const { data } = await axios.get<Invoice[]>(`${API_BASE}/invoices`);
  return data;
}

export async function getUsageSummary(): Promise<UsageSummary> {
  const { data } = await axios.get<UsageSummary>(`${API_BASE}/usage`);
  return data;
}

export async function cancelSubscription(): Promise<void> {
  await axios.post(`${API_BASE}/cancel`);
}
