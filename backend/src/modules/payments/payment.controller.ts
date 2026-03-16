// Payment Controller - HTTP Handlers
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/errorHandler";
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
    await paymentService.handleStripeWebhook(req.body);
    return successResponse(res, null, "Webhook processed");
  });
}

export default new PaymentController();
