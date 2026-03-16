export type Plan = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE';

export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';

export type BillingInterval = 'monthly' | 'annual';

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  plan: Plan;
  status: SubscriptionStatus;
  trialStartDate: string | null;
  trialEndDate: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PricingTier {
  id: Plan;
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  features: string[];
  unitLimit: string;
  highlighted: boolean;
  badge?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible' | 'draft';
  pdfUrl: string | null;
  description: string | null;
}

export interface CreateSubscriptionRequest {
  plan: Plan;
  interval: BillingInterval;
  paymentMethodId: string;
}

export interface CancelSubscriptionRequest {
  cancelAtPeriodEnd: boolean;
}

export interface UpdateSubscriptionRequest {
  plan: Plan;
  interval?: BillingInterval;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'STARTER',
    name: 'Starter',
    description: 'Perfect for small landlords getting started with AI management.',
    monthlyPrice: 49,
    annualPrice: 39,
    unitLimit: 'Up to 25 units',
    features: [
      'Up to 25 units',
      'Basic property management',
      'Tenant portal',
      'Rent collection',
      'Limited AI insights',
    ],
    highlighted: false,
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    description: 'For growing portfolios that need powerful AI tools.',
    monthlyPrice: 149,
    annualPrice: 119,
    unitLimit: 'Up to 100 units',
    features: [
      'Up to 100 units',
      'Full AI assistant',
      'Automated tenant screening',
      'Predictive maintenance alerts',
      'Financial reporting',
      'API access',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'BUSINESS',
    name: 'Business',
    description: 'For property management firms scaling operations.',
    monthlyPrice: 399,
    annualPrice: 319,
    unitLimit: 'Up to 500 units',
    features: [
      'Up to 500 units',
      'Advanced AI analytics',
      'Portfolio optimization',
      'Custom workflows',
      'Priority support',
      'White-label options',
    ],
    highlighted: false,
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    description: 'Tailored solutions for large-scale property operations.',
    monthlyPrice: null,
    annualPrice: null,
    unitLimit: 'Unlimited units',
    features: [
      'Unlimited units',
      'Dedicated AI model training',
      'Custom integrations',
      'SLA guarantees',
      'Dedicated account manager',
      'On-premise option',
    ],
    highlighted: false,
  },
];

export const TRIAL_DURATION_DAYS = 14;
export const ANNUAL_DISCOUNT_PERCENT = 20;
