/**
 * Zod schemas for maintenance request data validation.
 * Aligns with the Prisma MaintenanceRecord model and extends it
 * with request-specific fields (status, priority, assignedVendor).
 */

import { z } from "zod";

/**
 * Valid maintenance system types matching the Prisma MaintenanceSystemType enum.
 */
export const MAINTENANCE_SYSTEM_TYPES = [
  "HVAC",
  "PLUMBING",
  "ELECTRICAL",
  "ROOFING",
  "APPLIANCE",
  "STRUCTURAL",
] as const;

/**
 * Valid maintenance request statuses.
 */
export const MAINTENANCE_REQUEST_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
  "CLOSED",
] as const;

/**
 * Valid maintenance priority levels.
 */
export const MAINTENANCE_PRIORITIES = ["HIGH", "MEDIUM", "LOW"] as const;

/**
 * Zod schema for a complete maintenance request record.
 */
export const MaintenanceRequestSchema = z.object({
  id: z.string().uuid(),
  propertyId: z.string().uuid(),
  tenantId: z.string().uuid(),
  systemType: z.enum(MAINTENANCE_SYSTEM_TYPES),
  description: z.string().min(1, "Description is required").max(2000),
  status: z.enum(MAINTENANCE_REQUEST_STATUSES),
  priority: z.enum(MAINTENANCE_PRIORITIES),
  cost: z.number().nonnegative().nullable(),
  assignedVendor: z.string().max(200).nullable(),
  completedAt: z.coerce.date().nullable(),
  nextPredictedDate: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type MaintenanceRequestSchemaType = z.infer<
  typeof MaintenanceRequestSchema
>;

/**
 * Zod schema for creating a new maintenance request.
 */
export const CreateMaintenanceRequestSchema = z.object({
  propertyId: z.string().uuid("Valid property ID is required"),
  tenantId: z.string().uuid("Valid tenant ID is required"),
  systemType: z.enum(MAINTENANCE_SYSTEM_TYPES),
  description: z.string().min(1, "Description is required").max(2000),
  priority: z.enum(MAINTENANCE_PRIORITIES).default("MEDIUM"),
});

export type CreateMaintenanceRequestInput = z.infer<
  typeof CreateMaintenanceRequestSchema
>;

/**
 * Zod schema for updating a maintenance request.
 */
export const UpdateMaintenanceRequestSchema = z.object({
  status: z.enum(MAINTENANCE_REQUEST_STATUSES).optional(),
  priority: z.enum(MAINTENANCE_PRIORITIES).optional(),
  description: z.string().min(1).max(2000).optional(),
  assignedVendor: z.string().max(200).nullable().optional(),
  cost: z.number().nonnegative().nullable().optional(),
});

export type UpdateMaintenanceRequestInput = z.infer<
  typeof UpdateMaintenanceRequestSchema
>;
