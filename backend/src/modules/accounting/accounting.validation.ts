import { z } from "zod";

export const dateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const reportQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  propertyId: z.string().uuid().optional(),
});

export type ReportQuery = z.infer<typeof reportQuerySchema>;
