// Billing & Subscription Types for Stripe Integration

export type PlanId =
  | "starter"
  | "growth"
  | "professional"
  | "business"
  | "enterprise";

export interface PlanLimits {
  maxProperties: number;
  maxUnits: number;
  maxUsers: number;
  hasAI: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: PlanLimits;
  highlighted: boolean;
}

export interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: "paid" | "unpaid" | "past_due";
  planName: string;
}

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing";

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanId;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export type BillingInterval = "monthly" | "yearly";

export interface CheckoutSessionRequest {
  planId: PlanId;
  interval: BillingInterval;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface BillingPortalResponse {
  url: string;
}

export interface UsageSummary {
  properties: { used: number; limit: number };
  units: { used: number; limit: number };
  users: { used: number; limit: number };
}
