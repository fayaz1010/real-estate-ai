// Booking Routes
import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validation";

import bookingController from "./booking.controller";
import {
  createBookingSchema,
  updateBookingSchema,
} from "./booking.validation";

const router = Router();

// All routes require authentication
router.post(
  "/",
  authenticate,
  validate(createBookingSchema),
  bookingController.create,
);
router.get("/", authenticate, bookingController.getAll);
router.get("/my-bookings", authenticate, bookingController.getMyBookings);
router.get("/:id", authenticate, bookingController.getById);
router.patch(
  "/:id",
  authenticate,
  validate(updateBookingSchema),
  bookingController.update,
);
router.delete("/:id", authenticate, bookingController.delete);

export default router;
