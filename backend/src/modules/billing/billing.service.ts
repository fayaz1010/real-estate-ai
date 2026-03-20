// Billing Service - Stripe subscription & customer management
import Stripe from "stripe";

import { AppError } from "../../middleware/errorHandler";
import logger from "../../utils/logger";

// Initialize Stripe (optional - only if key is configured)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
    })
  : null;

function requireStripe(): Stripe {
  if (!stripe) {
    throw new AppError(
      "Payment processing is not configured. Set STRIPE_SECRET_KEY.",
      503,
    );
  }
  return stripe;
}

const PLAN_PRICE_IDS: Record<string, { monthly: string; annual: string }> = {
  STARTER: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "",
    annual: process.env.STRIPE_PRICE_STARTER_ANNUAL ?? "",
  },
  PROFESSIONAL: {
    monthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY ?? "",
    annual: process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL ?? "",
  },
  BUSINESS: {
    monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY ?? "",
    annual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL ?? "",
  },
};

export class BillingService {
  async createCustomer(
    email: string,
    name: string,
  ): Promise<{ customerId: string }> {
    const s = requireStripe();
    try {
      const customer = await s.customers.create({ email, name });
      logger.info(`Stripe customer created: ${customer.id} for ${email}`);
      return { customerId: customer.id };
    } catch (err) {
      logger.error("Failed to create Stripe customer", { error: err });
      throw new AppError("Failed to create Stripe customer", 502);
    }
  }

  async createSubscription(data: {
    customerId: string;
    plan: string;
    interval: "monthly" | "annual";
    paymentMethodId?: string;
  }): Promise<{ subscriptionId: string }> {
    const s = requireStripe();

    if (data.plan === "FREE" || data.plan === "ENTERPRISE") {
      throw new AppError(
        `Cannot create Stripe subscription for plan: ${data.plan}`,
        400,
      );
    }

    const planPrices = PLAN_PRICE_IDS[data.plan];
    if (!planPrices) {
      throw new AppError(`Unknown plan: ${data.plan}`, 400);
    }

    const priceId = planPrices[data.interval];
    if (!priceId) {
      throw new AppError(
        `No Stripe price ID configured for ${data.plan} ${data.interval}`,
        400,
      );
    }

    try {
      const params: Stripe.SubscriptionCreateParams = {
        customer: data.customerId,
        items: [{ price: priceId }],
        trial_period_days: 14,
      };

      if (data.paymentMethodId) {
        params.default_payment_method = data.paymentMethodId;
      }

      const subscription = await s.subscriptions.create(params);
      logger.info(
        `Stripe subscription created: ${subscription.id} for customer ${data.customerId}`,
      );
      return { subscriptionId: subscription.id };
    } catch (err) {
      logger.error("Failed to create Stripe subscription", { error: err });
      throw new AppError("Failed to create Stripe subscription", 502);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const s = requireStripe();
    try {
      await s.subscriptions.cancel(subscriptionId);
      logger.info(`Stripe subscription cancelled: ${subscriptionId}`);
    } catch (err) {
      logger.error("Failed to cancel Stripe subscription", { error: err });
      throw new AppError("Failed to cancel Stripe subscription", 502);
    }
  }

  async getInvoiceHistory(customerId: string): Promise<
    Array<{
      id: string;
      created: number;
      amount_paid: number;
      currency: string;
      status: string;
      invoice_pdf: string | null;
      description: string | null;
    }>
  > {
    const s = requireStripe();
    try {
      const invoices = await s.invoices.list({
        customer: customerId,
        limit: 100,
      });
      return invoices.data.map((inv) => ({
        id: inv.id,
        created: inv.created,
        amount_paid: inv.amount_paid,
        currency: inv.currency,
        status: inv.status ?? "unknown",
        invoice_pdf: inv.invoice_pdf ?? null,
        description: inv.description ?? null,
      }));
    } catch (err) {
      logger.error("Failed to fetch invoice history", { error: err });
      throw new AppError("Failed to fetch invoice history", 502);
    }
  }
}

export default new BillingService();
