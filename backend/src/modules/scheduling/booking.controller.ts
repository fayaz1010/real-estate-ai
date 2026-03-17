// Booking Controller
import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";

import bookingService from "./booking.service";

export class BookingController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const booking = await bookingService.create(userId, req.body);
    return successResponse(res, booking, "Booking created", 201);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await bookingService.getAll(req.query);
    return successResponse(res, result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingService.getById(req.params.id);
    return successResponse(res, booking);
  });

  getMyBookings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await bookingService.getMyBookings(userId, req.query);
    return successResponse(res, result);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const booking = await bookingService.update(
      req.params.id,
      userId,
      req.body,
    );
    return successResponse(res, booking, "Booking updated");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    await bookingService.delete(req.params.id, userId);
    return successResponse(res, null, "Booking deleted");
  });
}

export default new BookingController();
