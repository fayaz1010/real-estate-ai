/**
 * Zod schemas for tenant-related data validation.
 * Aligns with the Prisma TenantProfile model.
 */

import { z } from 'zod';

/**
 * Zod schema for a complete tenant profile record.
 * Mirrors the Prisma TenantProfile model.
 */
export const TenantSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  employmentStatus: z.string().max(50).nullable(),
  employerName: z.string().max(200).nullable(),
  jobTitle: z.string().max(100).nullable(),
  annualIncome: z.number().nonnegative('Annual income must be non-negative').nullable(),
  creditScore: z.number().int().min(300).max(850).nullable(),
  hasPets: z.boolean(),
  petsDescription: z.string().max(500).nullable(),
  hasVehicle: z.boolean(),
  vehicleDescription: z.string().max(500).nullable(),
  smoking: z.boolean(),
  references: z.record(z.string(), z.unknown()).nullable(),
  moveInDate: z.coerce.date().nullable(),
  leaseTerm: z.number().int().positive().nullable(),
  preferredLocations: z.array(z.string()),
  budgetMin: z.number().nonnegative().nullable(),
  budgetMax: z.number().nonnegative().nullable(),
  preferredPropertyTypes: z.array(z.string()),
  specialRequirements: z.string().max(1000).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type TenantSchemaType = z.infer<typeof TenantSchema>;

/**
 * Zod schema for creating/updating a tenant profile.
 * Excludes auto-generated fields (id, timestamps).
 */
export const CreateTenantProfileSchema = z.object({
  employmentStatus: z.string().max(50).nullable().optional(),
  employerName: z.string().max(200).nullable().optional(),
  jobTitle: z.string().max(100).nullable().optional(),
  annualIncome: z.number().nonnegative('Annual income must be non-negative').nullable().optional(),
  creditScore: z.number().int().min(300, 'Credit score must be at least 300').max(850, 'Credit score must be at most 850').nullable().optional(),
  hasPets: z.boolean().default(false),
  petsDescription: z.string().max(500).nullable().optional(),
  hasVehicle: z.boolean().default(false),
  vehicleDescription: z.string().max(500).nullable().optional(),
  smoking: z.boolean().default(false),
  references: z.record(z.string(), z.unknown()).nullable().optional(),
  moveInDate: z.coerce.date().nullable().optional(),
  leaseTerm: z.number().int().positive().nullable().optional(),
  preferredLocations: z.array(z.string()).default([]),
  budgetMin: z.number().nonnegative().nullable().optional(),
  budgetMax: z.number().nonnegative().nullable().optional(),
  preferredPropertyTypes: z.array(z.string()).default([]),
  specialRequirements: z.string().max(1000).nullable().optional(),
});

export type CreateTenantProfileInput = z.infer<typeof CreateTenantProfileSchema>;

/**
 * Zod schema for updating a tenant profile.
 * All fields are optional to allow partial updates.
 */
export const UpdateTenantProfileSchema = CreateTenantProfileSchema.partial();

export type UpdateTenantProfileInput = z.infer<typeof UpdateTenantProfileSchema>;
