// Lease Controller - HTTP Handlers
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";

import leaseService from "./lease.service";

export class LeaseController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const landlordId = req.user!.userId;
    const lease = await leaseService.create(landlordId, req.body);
    return successResponse(res, lease, "Lease created", 201);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const lease = await leaseService.getById(req.params.id, userId);
    return successResponse(res, lease);
  });

  getMyLeases = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const role = (req.query.role as string) || "tenant";
    const leases = await leaseService.getMyLeases(
      userId,
      role as "tenant" | "landlord",
    );
    return successResponse(res, leases);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const lease = await leaseService.updateStatus(
      req.params.id,
      userId,
      req.body.status,
    );
    return successResponse(res, lease, "Lease status updated");
  });

  sign = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const lease = await leaseService.signLease(req.params.id, userId);
    return successResponse(res, lease, "Lease signed");
  });

  terminate = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const lease = await leaseService.terminate(
      req.params.id,
      userId,
      req.body.reason,
    );
    return successResponse(res, lease, "Lease terminated");
  });
}

export default new LeaseController();
