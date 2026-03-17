/**
 * Zod schemas for payment-related data validation.
 * Aligns with the Prisma Payment model.
 */

import { z } from "zod";

/**
 * Valid payment types matching the Prisma PaymentType enum.
 */
export const PAYMENT_TYPES = [
  "RENT",
  "DEPOSIT",
  "LATE_FEE",
  "MAINTENANCE",
  "UTILITY",
  "OTHER",
] as const;

/**
 * Valid payment statuses matching the Prisma PaymentStatus enum.
 */
export const PAYMENT_STATUSES = [
  "PAYMENT_PENDING",
  "PAID",
  "OVERDUE",
  "PARTIAL",
  "REFUNDED",
  "PAYMENT_CANCELLED",
] as const;

/**
 * Zod schema for a complete payment record.
 * Mirrors the Prisma Payment model.
 */
export const PaymentSchema = z.object({
  id: z.string().uuid(),
  leaseId: z.string().uuid(),
  payerId: z.string().uuid(),
  type: z.enum(PAYMENT_TYPES),
  status: z.enum(PAYMENT_STATUSES),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3).default("USD"),
  dueDate: z.coerce.date(),
  paidAt: z.coerce.date().nullable(),
  stripePaymentIntentId: z.string().nullable(),
  stripeInvoiceId: z.string().nullable(),
  description: z.string().max(500).nullable(),
  receiptUrl: z.string().url().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type PaymentSchemaType = z.infer<typeof PaymentSchema>;

/**
 * Zod schema for processing/creating a new payment.
 */
export const ProcessPaymentSchema = z.object({
  leaseId: z.string().uuid("Valid lease ID is required"),
  type: z.enum(PAYMENT_TYPES),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3).default("USD"),
  dueDate: z.coerce.date(),
  stripePaymentIntentId: z.string().optional(),
  description: z.string().max(500).optional(),
});

export type ProcessPaymentInput = z.infer<typeof ProcessPaymentSchema>;

/**
 * Zod schema for updating payment status.
 */
export const UpdatePaymentSchema = z.object({
  status: z.enum(PAYMENT_STATUSES),
  paidAt: z.coerce.date().nullable().optional(),
  stripePaymentIntentId: z.string().nullable().optional(),
  stripeInvoiceId: z.string().nullable().optional(),
  receiptUrl: z.string().url().nullable().optional(),
});

export type UpdatePaymentInput = z.infer<typeof UpdatePaymentSchema>;
