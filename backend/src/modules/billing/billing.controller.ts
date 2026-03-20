// Billing Controller - HTTP Handlers
import { Request, Response } from "express";

import { asyncHandler, AppError } from "../../middleware/errorHandler";
import logger from "../../utils/logger";
import { successResponse } from "../../utils/response";

import billingService from "./billing.service";

export class BillingController {
  createCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { email, name } = req.body;
    if (!email || !name) {
      throw new AppError("Email and name are required", 400);
    }
    const result = await billingService.createCustomer(email, name);
    return successResponse(res, result, "Customer created", 201);
  });

  createSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { customerId, plan, interval, paymentMethodId } = req.body;
    if (!customerId || !plan) {
      throw new AppError("customerId and plan are required", 400);
    }
    const result = await billingService.createSubscription({
      customerId,
      plan,
      interval: interval || "monthly",
      paymentMethodId,
    });
    return successResponse(res, result, "Subscription created", 201);
  });

  cancelSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { subscriptionId } = req.body;
    if (!subscriptionId) {
      throw new AppError("subscriptionId is required", 400);
    }
    await billingService.cancelSubscription(subscriptionId);
    return successResponse(res, null, "Subscription cancelled");
  });

  getInvoices = asyncHandler(async (req: Request, res: Response) => {
    const customerId = req.query.customerId as string;
    if (!customerId) {
      throw new AppError("customerId query parameter is required", 400);
    }
    const invoices = await billingService.getInvoiceHistory(customerId);
    return successResponse(res, invoices);
  });

  createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
    const { priceId, customerId, successUrl, cancelUrl } = req.body;
    if (!priceId || !customerId || !successUrl || !cancelUrl) {
      throw new AppError(
        "priceId, customerId, successUrl, and cancelUrl are required",
        400,
      );
    }
    const sessionId = await billingService.createCheckoutSession(
      priceId,
      customerId,
      successUrl,
      cancelUrl,
    );
    return successResponse(res, { sessionId }, "Checkout session created", 201);
  });

  getSubscriptionStatus = asyncHandler(async (req: Request, res: Response) => {
    const { subscriptionId } = req.params;
    if (!subscriptionId) {
      throw new AppError("subscriptionId parameter is required", 400);
    }
    const status = await billingService.getSubscriptionStatus(subscriptionId);
    return successResponse(res, { status });
  });

  getUpcomingInvoice = asyncHandler(async (req: Request, res: Response) => {
    const { subscriptionId } = req.params;
    if (!subscriptionId) {
      throw new AppError("subscriptionId parameter is required", 400);
    }
    const invoice = await billingService.getUpcomingInvoice(subscriptionId);
    return successResponse(res, invoice);
  });

  createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
    const { amount, currency, metadata } = req.body;
    if (!amount) {
      throw new AppError("amount is required", 400);
    }
    const clientSecret = await billingService.createPaymentIntent(
      amount,
      currency || "usd",
      metadata || {},
    );
    return successResponse(
      res,
      { clientSecret },
      "Payment intent created",
      201,
    );
  });

  getPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
    const { paymentIntentId } = req.params;
    if (!paymentIntentId) {
      throw new AppError("paymentIntentId parameter is required", 400);
    }
    const paymentIntent =
      await billingService.retrievePaymentIntent(paymentIntentId);
    return successResponse(res, paymentIntent);
  });

  stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret || !sig) {
      throw new AppError("Missing webhook secret or signature", 400);
    }

    try {
      const event = billingService.constructEvent(req.body, sig, webhookSecret);

      switch (event.type) {
        case "payment_intent.succeeded": {
          const pi = event.data.object;
          logger.info(`[Stripe Webhook] payment_intent.succeeded: ${pi.id}`);
          break;
        }
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const sub = event.data.object;
          logger.info(`[Stripe Webhook] ${event.type}: ${sub.id}`);
          break;
        }
        default:
          logger.info(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }

      return successResponse(res, null, "Webhook processed");
    } catch (err) {
      logger.error("[Stripe Webhook] Signature verification failed", {
        error: err,
      });
      throw new AppError("Webhook signature verification failed", 400);
    }
  });
}

export default new BillingController();
