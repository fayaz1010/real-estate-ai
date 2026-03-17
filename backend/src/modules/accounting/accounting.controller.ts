import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";

import accountingService from "./accounting.service";
import { reportQuerySchema } from "./accounting.validation";

function parseDateRange(query: Record<string, unknown>) {
  const parsed = reportQuerySchema.parse(query);
  const now = new Date();
  const startDate = parsed.startDate
    ? new Date(parsed.startDate)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = parsed.endDate
    ? new Date(parsed.endDate)
    : new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { startDate, endDate, propertyId: parsed.propertyId };
}

export class AccountingController {
  getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const summary = await accountingService.getDashboardSummary(userId);
    return successResponse(res, summary);
  });

  getIncomeStatement = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { startDate, endDate, propertyId } = parseDateRange(req.query);
    const data = await accountingService.getIncomeStatement({
      startDate,
      endDate,
      propertyId,
      userId,
    });
    return successResponse(res, data);
  });

  getBalanceSheet = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { startDate, endDate, propertyId } = parseDateRange(req.query);
    const data = await accountingService.getBalanceSheet({
      startDate,
      endDate,
      propertyId,
      userId,
    });
    return successResponse(res, data);
  });

  getCashFlowStatement = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { startDate, endDate, propertyId } = parseDateRange(req.query);
    const data = await accountingService.getCashFlowStatement({
      startDate,
      endDate,
      propertyId,
      userId,
    });
    return successResponse(res, data);
  });

  getRentCollectionReport = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user!.userId;
      const { startDate, endDate, propertyId } = parseDateRange(req.query);
      const data = await accountingService.getRentCollectionReport({
        startDate,
        endDate,
        propertyId,
        userId,
      });
      return successResponse(res, data);
    },
  );

  getExpenseReport = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { startDate, endDate, propertyId } = parseDateRange(req.query);
    const data = await accountingService.getExpenseReport({
      startDate,
      endDate,
      propertyId,
      userId,
    });
    return successResponse(res, data);
  });

  getProperties = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const properties = await accountingService.getProperties(userId);
    return successResponse(res, properties);
  });
}

export default new AccountingController();
