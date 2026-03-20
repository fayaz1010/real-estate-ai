// Billing Controller - HTTP Handlers
import { Request, Response } from "express";

import { asyncHandler, AppError } from "../../middleware/errorHandler";
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
}

export default new BillingController();
