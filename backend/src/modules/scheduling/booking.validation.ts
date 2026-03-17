// Booking Validation
import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    type: z.enum(["VIEWING", "INSPECTION", "MAINTENANCE", "MEETING"]),
    propertyId: z.string().uuid(),
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    notes: z.string().max(1000).optional(),
    location: z.string().max(500).optional(),
  }),
});

export const updateBookingSchema = z.object({
  body: z.object({
    type: z
      .enum(["VIEWING", "INSPECTION", "MAINTENANCE", "MEETING"])
      .optional(),
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    status: z
      .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
      .optional(),
    notes: z.string().max(1000).optional(),
    location: z.string().max(500).optional(),
  }),
});
