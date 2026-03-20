export type Plan =
  | "FREE"
  | "STARTER"
  | "GROWTH"
  | "PROFESSIONAL"
  | "BUSINESS"
  | "ENTERPRISE";

export type SubscriptionStatus =
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "EXPIRED";

export type BillingInterval = "monthly" | "annual";

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
  status: "paid" | "open" | "void" | "uncollectible" | "draft";
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
    id: "STARTER",
    name: "Starter",
    description:
      "Get started free — perfect for small landlords with a few units.",
    monthlyPrice: 0,
    annualPrice: 0,
    unitLimit: "Up to 5 units",
    features: [
      "Up to 5 units",
      "Basic tenant management",
      "Rent tracking",
      "Maintenance requests",
    ],
    highlighted: false,
  },
  {
    id: "GROWTH",
    name: "Growth",
    description:
      "For growing portfolios that need AI-powered analytics and automation.",
    monthlyPrice: 125,
    annualPrice: 100,
    unitLimit: "Up to 100 units",
    features: [
      "Up to 100 units",
      "AI-powered analytics",
      "Automated rent collection",
      "Financial reporting",
      "Tenant screening",
      "Document management",
      "$2/unit overage",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    description: "Advanced tools for scaling property management companies.",
    monthlyPrice: 400,
    annualPrice: 320,
    unitLimit: "Up to 300 units",
    features: [
      "Up to 300 units",
      "Advanced AI insights",
      "Owner portal",
      "API access",
      "Custom workflows",
      "Priority support",
      "Market reports",
      "$1.50/unit overage",
    ],
    highlighted: false,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    description: "Tailored solutions for large-scale property operations.",
    monthlyPrice: null,
    annualPrice: null,
    unitLimit: "Unlimited units",
    features: [
      "Unlimited units",
      "White-label options",
      "Dedicated CSM",
      "Custom integrations",
      "SLA guarantees",
      "Advanced security",
      "Data-driven market reports",
    ],
    highlighted: false,
  },
];

export const TRIAL_DURATION_DAYS = 14;
export const ANNUAL_DISCOUNT_PERCENT = 20;
