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
    monthly: process.env.STRIPE_PRICE_ID_STARTER ?? "",
    annual: process.env.STRIPE_PRICE_ID_STARTER_ANNUAL ?? "",
  },
  GROWTH: {
    monthly: process.env.STRIPE_PRICE_ID_GROWTH ?? "",
    annual: process.env.STRIPE_PRICE_ID_GROWTH_ANNUAL ?? "",
  },
  PROFESSIONAL: {
    monthly: process.env.STRIPE_PRICE_ID_PROFESSIONAL ?? "",
    annual: process.env.STRIPE_PRICE_ID_PROFESSIONAL_ANNUAL ?? "",
  },
  ENTERPRISE: {
    monthly: process.env.STRIPE_PRICE_ID_ENTERPRISE ?? "",
    annual: process.env.STRIPE_PRICE_ID_ENTERPRISE_ANNUAL ?? "",
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

    if (data.plan === "FREE" || data.plan === "STARTER") {
      throw new AppError(
        `Cannot create Stripe subscription for free plan: ${data.plan}`,
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
      logger.info(
        `Fetched ${invoices.data.length} invoices for customer ${customerId}`,
      );
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

  async createCheckoutSession(
    priceId: string,
    customerId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<string> {
    const s = requireStripe();
    try {
      const session = await s.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      logger.info(
        `Stripe checkout session created: ${session.id} for customer ${customerId}`,
      );
      return session.id;
    } catch (err) {
      logger.error("Failed to create checkout session", { error: err });
      throw new AppError("Failed to create Stripe checkout session", 502);
    }
  }

  async getSubscriptionStatus(subscriptionId: string): Promise<string> {
    const s = requireStripe();
    try {
      const subscription = await s.subscriptions.retrieve(subscriptionId);
      logger.info(
        `Retrieved subscription status: ${subscription.status} for ${subscriptionId}`,
      );
      return subscription.status;
    } catch (err) {
      logger.error("Failed to get subscription status", { error: err });
      throw new AppError("Failed to get subscription status", 502);
    }
  }

  async getUpcomingInvoice(subscriptionId: string): Promise<{
    amount_due: number;
    currency: string;
    period_start: number;
    period_end: number;
    lines: Array<{ description: string | null; amount: number }>;
  }> {
    const s = requireStripe();
    try {
      const invoice = await s.invoices.createPreview({
        subscription: subscriptionId,
      });
      logger.info(
        `Retrieved upcoming invoice for subscription ${subscriptionId}`,
      );
      return {
        amount_due: invoice.amount_due,
        currency: invoice.currency,
        period_start: invoice.period_start ?? 0,
        period_end: invoice.period_end ?? 0,
        lines: invoice.lines.data.map((line) => ({
          description: line.description,
          amount: line.amount,
        })),
      };
    } catch (err) {
      logger.error("Failed to get upcoming invoice", { error: err });
      throw new AppError("Failed to get upcoming invoice", 502);
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string = "usd",
    metadata: Record<string, string> = {},
  ): Promise<string> {
    const s = requireStripe();
    try {
      const paymentIntent = await s.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        metadata,
      });
      logger.info(
        `Stripe payment intent created: ${paymentIntent.id} for ${amount} ${currency}`,
      );
      return paymentIntent.client_secret!;
    } catch (err) {
      logger.error("Failed to create payment intent", { error: err });
      throw new AppError("Failed to create Stripe payment intent", 502);
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    metadata: Record<string, string>;
  }> {
    const s = requireStripe();
    try {
      const pi = await s.paymentIntents.retrieve(paymentIntentId);
      logger.info(`Retrieved payment intent: ${pi.id} status=${pi.status}`);
      return {
        id: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        status: pi.status,
        metadata: pi.metadata as Record<string, string>,
      };
    } catch (err) {
      logger.error("Failed to retrieve payment intent", { error: err });
      throw new AppError("Failed to retrieve payment intent", 502);
    }
  }

  constructEvent(
    payload: Buffer,
    signature: string,
    webhookSecret: string,
  ): Stripe.Event {
    const s = requireStripe();
    return s.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}

export default new BillingService();
