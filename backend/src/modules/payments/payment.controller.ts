// Payment Controller - HTTP Handlers
import { Request, Response } from "express";
import Stripe from "stripe";

import { config } from "../../config/env";
import { asyncHandler, AppError } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";

import paymentService from "./payment.service";

export class PaymentController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const payerId = req.user!.userId;
    const payment = await paymentService.createPayment({
      ...req.body,
      payerId,
    });
    return successResponse(res, payment, "Payment created", 201);
  });

  createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await paymentService.createPaymentIntent(
      req.params.id,
      userId,
    );
    return successResponse(res, result);
  });

  createDirectPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { amount, propertyId, paymentType, leaseId, description } = req.body;
    const result = await paymentService.createDirectPaymentIntent({
      amount,
      userId,
      propertyId,
      paymentType,
      leaseId,
      description,
    });
    return successResponse(res, result, "Payment intent created", 201);
  });

  getMyPayments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const payments = await paymentService.getMyPayments(
      userId,
      req.query.status as string,
    );
    return successResponse(res, payments);
  });

  getLeasePayments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const payments = await paymentService.getLeasePayments(
      req.params.leaseId,
      userId,
    );
    return successResponse(res, payments);
  });

  generateRentPayments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await paymentService.generateRentPayments(
      req.params.leaseId,
      userId,
    );
    return successResponse(res, result, "Rent payments generated");
  });

  stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = config.stripe.webhookSecret;

    if (webhookSecret && sig) {
      try {
        const stripe = new Stripe(config.stripe.secretKey, {
          apiVersion: "2024-06-20" as any,
        });
        const event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          webhookSecret,
        );
        await paymentService.handleStripeWebhook(event);
      } catch (err) {
        console.error("[Stripe Webhook] Signature verification failed:", err);
        throw new AppError("Webhook signature verification failed", 400);
      }
    } else {
      // Dev mode: accept raw body without signature verification
      await paymentService.handleStripeWebhook(req.body);
    }

    return successResponse(res, null, "Webhook processed");
  });
}

export default new PaymentController();
