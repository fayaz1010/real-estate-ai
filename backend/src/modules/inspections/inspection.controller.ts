// Inspection Controller
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";

import inspectionService from "./inspection.service";

export class InspectionController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const inspection = await inspectionService.create(userId, req.body);
    return successResponse(res, inspection, "Inspection booked", 201);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await inspectionService.getAll(req.query);
    return successResponse(res, result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const inspection = await inspectionService.getById(req.params.id);
    return successResponse(res, inspection);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const inspection = await inspectionService.update(
      req.params.id,
      userId,
      req.body,
    );
    return successResponse(res, inspection, "Inspection updated");
  });

  cancel = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { reason } = req.body;
    const inspection = await inspectionService.cancel(
      req.params.id,
      userId,
      reason,
    );
    return successResponse(res, inspection, "Inspection cancelled");
  });

  getMyInspections = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { page, limit } = req.query;
    const result = await inspectionService.getMyInspections(
      userId,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20,
    );
    return successResponse(res, result);
  });
}

export default new InspectionController();
