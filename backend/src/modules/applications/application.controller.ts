// Application Controller
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";

import applicationService from "./application.service";

export class ApplicationController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { propertyId } = req.body;
    const application = await applicationService.create(userId, propertyId);
    return successResponse(res, application, "Application created", 201);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const application = await applicationService.getById(req.params.id);
    return successResponse(res, application);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const application = await applicationService.update(
      req.params.id,
      userId,
      req.body,
    );
    return successResponse(res, application, "Application updated");
  });

  submit = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const application = await applicationService.submit(req.params.id, userId);
    return successResponse(res, application, "Application submitted");
  });

  getMyApplications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { page, limit } = req.query;
    const result = await applicationService.getMyApplications(
      userId,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20,
    );
    return successResponse(res, result);
  });

  approve = asyncHandler(async (req: Request, res: Response) => {
    const landlordId = req.user!.userId;
    const { conditions } = req.body;
    const application = await applicationService.approve(
      req.params.id,
      landlordId,
      conditions,
    );
    return successResponse(res, application, "Application approved");
  });

  reject = asyncHandler(async (req: Request, res: Response) => {
    const landlordId = req.user!.userId;
    const { rejectionReason } = req.body;
    const application = await applicationService.reject(
      req.params.id,
      landlordId,
      rejectionReason,
    );
    return successResponse(res, application, "Application rejected");
  });
}

export default new ApplicationController();
