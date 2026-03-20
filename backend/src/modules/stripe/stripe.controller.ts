// Stripe Controller - Consolidated HTTP handlers for Stripe operations
import { Request, Response } from "express";
import Stripe from "stripe";

import { config } from "../../config/env";
import { asyncHandler, AppError } from "../../middleware/errorHandler";
import logger from "../../utils/logger";
import { successResponse } from "../../utils/response";
import billingService from "../billing/billing.service";
import paymentService from "../payments/payment.service";

export class StripeController {
  /**
   * POST /api/stripe/create-payment-intent
   * Creates a Stripe PaymentIntent and returns the client secret.
   */
  createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
    const { amount, currency } = req.body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      throw new AppError("A positive numeric amount is required", 400);
    }

    logger.info(
      `[Stripe] Creating payment intent: ${amount} ${currency || "usd"}`,
    );

    const clientSecret = await billingService.createPaymentIntent(
      amount,
      currency || "usd",
      req.body.metadata || {},
    );

    logger.info("[Stripe] Payment intent created successfully");
    return successResponse(
      res,
      { clientSecret },
      "Payment intent created",
      201,
    );
  });

  /**
   * POST /api/stripe/create-subscription
   * Creates a Stripe subscription and returns the subscription ID.
   */
  createSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { customerId, priceId, plan, interval, paymentMethodId } = req.body;

    if (!customerId) {
      throw new AppError("customerId is required", 400);
    }

    if (!priceId && !plan) {
      throw new AppError("Either priceId or plan is required", 400);
    }

    logger.info(`[Stripe] Creating subscription for customer ${customerId}`);

    // If a priceId is provided directly, use checkout session flow
    if (priceId && !plan) {
      const sessionId = await billingService.createCheckoutSession(
        priceId,
        customerId,
        req.body.successUrl || `${config.frontendUrl}/billing/success`,
        req.body.cancelUrl || `${config.frontendUrl}/billing/cancel`,
      );
      logger.info(
        `[Stripe] Checkout session created: ${sessionId} for customer ${customerId}`,
      );
      return successResponse(
        res,
        { sessionId },
        "Checkout session created",
        201,
      );
    }

    // Otherwise use the plan-based subscription flow
    const result = await billingService.createSubscription({
      customerId,
      plan,
      interval: interval || "monthly",
      paymentMethodId,
    });

    logger.info(
      `[Stripe] Subscription created: ${result.subscriptionId} for customer ${customerId}`,
    );
    return successResponse(res, result, "Subscription created", 201);
  });

  /**
   * POST /api/stripe/cancel-subscription
   * Cancels a Stripe subscription.
   */
  cancelSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      throw new AppError("subscriptionId is required", 400);
    }

    logger.info(`[Stripe] Cancelling subscription: ${subscriptionId}`);
    await billingService.cancelSubscription(subscriptionId);
    logger.info(`[Stripe] Subscription cancelled: ${subscriptionId}`);

    return successResponse(res, null, "Subscription cancelled");
  });

  /**
   * POST /api/stripe/webhook
   * Handles Stripe webhook events with signature verification.
   */
  webhook = asyncHandler(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = config.stripe.webhookSecret;

    if (!webhookSecret) {
      logger.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured");
      throw new AppError("Webhook secret is not configured", 500);
    }

    if (!sig) {
      throw new AppError("Missing stripe-signature header", 400);
    }

    let event: Stripe.Event;
    try {
      event = billingService.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      logger.error("[Stripe Webhook] Signature verification failed", {
        error: err,
      });
      throw new AppError("Webhook signature verification failed", 400);
    }

    logger.info(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        logger.info(
          `[Stripe Webhook] Payment intent succeeded: ${pi.id}, amount: ${pi.amount} ${pi.currency}`,
        );
        // Delegate to payment service for DB updates
        await paymentService.handleStripeWebhook(event);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        logger.warn(
          `[Stripe Webhook] Payment intent failed: ${pi.id}, error: ${pi.last_payment_error?.message}`,
        );
        await paymentService.handleStripeWebhook(event);
        break;
      }

      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        logger.info(
          `[Stripe Webhook] Subscription created: ${sub.id}, customer: ${sub.customer}, status: ${sub.status}`,
        );
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        logger.info(
          `[Stripe Webhook] Subscription updated: ${sub.id}, status: ${sub.status}`,
        );
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        logger.info(
          `[Stripe Webhook] Subscription deleted: ${sub.id}, customer: ${sub.customer}`,
        );
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        logger.info(
          `[Stripe Webhook] Invoice payment succeeded: ${invoice.id}, amount: ${invoice.amount_paid} ${invoice.currency}`,
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logger.warn(
          `[Stripe Webhook] Invoice payment failed: ${invoice.id}, customer: ${invoice.customer}`,
        );
        break;
      }

      default:
        logger.info(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return successResponse(res, null, "Webhook processed");
  });
}

export default new StripeController();
