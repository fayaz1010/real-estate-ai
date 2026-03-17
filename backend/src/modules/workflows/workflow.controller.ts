// Workflow Controller - HTTP Handlers
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";

import workflowService from "./workflow.service";

export class WorkflowController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const workflow = await workflowService.create(userId, req.body);
    return successResponse(res, workflow, "Workflow created", 201);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const workflows = await workflowService.getAll(userId);
    return successResponse(res, workflows);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const workflow = await workflowService.getById(req.params.id, userId);
    return successResponse(res, workflow);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const workflow = await workflowService.update(
      req.params.id,
      userId,
      req.body,
    );
    return successResponse(res, workflow, "Workflow updated");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await workflowService.delete(req.params.id, userId);
    return successResponse(res, result, "Workflow deleted");
  });

  toggle = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const workflow = await workflowService.toggle(req.params.id, userId);
    return successResponse(res, workflow, "Workflow toggled");
  });

  execute = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const execution = await workflowService.execute(req.params.id, userId);
    return successResponse(res, execution, "Workflow executed");
  });

  getExecutions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const executions = await workflowService.getExecutions(
      req.params.id,
      userId,
    );
    return successResponse(res, executions);
  });
}

export default new WorkflowController();
