// Trial Controller - HTTP Handlers
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";

import trialService from "./trial.service";

export class TrialController {
  // POST /api/trial/start
  startTrial = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    const result = await trialService.startTrial({
      email,
      password,
      firstName,
      lastName,
    });
    return successResponse(res, result, "Free trial started successfully", 201);
  });

  // GET /api/trial/status
  getTrialStatus = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const status = await trialService.getTrialStatus(userId);
    return successResponse(res, status);
  });
}

export default new TrialController();
