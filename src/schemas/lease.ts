/**
 * Zod schemas for lease-related data validation.
 * Aligns with the Prisma Lease model.
 */

import { z } from 'zod';

/**
 * Valid lease statuses matching the Prisma LeaseStatus enum.
 */
export const LEASE_STATUSES = [
  'DRAFT',
  'PENDING_SIGNATURES',
  'ACTIVE',
  'EXPIRED',
  'TERMINATED',
  'RENEWED',
] as const;

/**
 * Zod schema for a complete lease record.
 * Mirrors the Prisma Lease model.
 */
export const LeaseSchema = z.object({
  id: z.string().uuid(),
  propertyId: z.string().uuid(),
  tenantId: z.string().uuid(),
  landlordId: z.string().uuid(),
  status: z.enum(LEASE_STATUSES),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  monthlyRent: z.number().positive('Monthly rent must be positive'),
  depositAmount: z.number().nonnegative('Deposit must be non-negative'),
  depositPaid: z.boolean(),
  lateFeeAmount: z.number().nonnegative('Late fee must be non-negative').default(0),
  lateFeeGraceDays: z.number().int().nonnegative().default(5),
  leaseDocumentUrl: z.string().url().nullable(),
  signedByTenant: z.boolean(),
  signedByLandlord: z.boolean(),
  signedAt: z.coerce.date().nullable(),
  terminatedAt: z.coerce.date().nullable(),
  terminationReason: z.string().max(500).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type LeaseSchemaType = z.infer<typeof LeaseSchema>;

/**
 * Zod schema for creating a new lease.
 * Excludes auto-generated fields. Validates that end date is after start date.
 */
export const CreateLeaseSchema = z
  .object({
    propertyId: z.string().uuid('Valid property ID is required'),
    tenantId: z.string().uuid('Valid tenant ID is required'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    monthlyRent: z.number().positive('Monthly rent must be positive'),
    depositAmount: z.number().nonnegative('Deposit must be non-negative'),
    lateFeeAmount: z.number().nonnegative().default(0),
    lateFeeGraceDays: z.number().int().nonnegative().default(5),
    leaseDocumentUrl: z.string().url().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export type CreateLeaseInput = z.infer<typeof CreateLeaseSchema>;

/**
 * Zod schema for updating an existing lease.
 */
export const UpdateLeaseSchema = z.object({
  status: z.enum(LEASE_STATUSES).optional(),
  monthlyRent: z.number().positive('Monthly rent must be positive').optional(),
  depositAmount: z.number().nonnegative().optional(),
  depositPaid: z.boolean().optional(),
  lateFeeAmount: z.number().nonnegative().optional(),
  lateFeeGraceDays: z.number().int().nonnegative().optional(),
  leaseDocumentUrl: z.string().url().nullable().optional(),
  terminationReason: z.string().max(500).nullable().optional(),
});

export type UpdateLeaseInput = z.infer<typeof UpdateLeaseSchema>;
