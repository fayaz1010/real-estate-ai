// Application Validation
import { z } from "zod";

export const createApplicationSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid(),
  }),
});

export const updateApplicationSchema = z.object({
  body: z.object({
    personalInfo: z.any().optional(),
    employment: z.array(z.any()).optional(),
    income: z.array(z.any()).optional(),
    rentalHistory: z.array(z.any()).optional(),
    references: z.array(z.any()).optional(),
    pets: z.array(z.any()).optional(),
    vehicles: z.array(z.any()).optional(),
    moveInDate: z.string().optional(),
    leaseTerm: z.number().int().min(1).optional(),
    applicantNotes: z.string().optional(),
  }),
});

export const submitApplicationSchema = z.object({
  body: z.object({
    backgroundConsentGiven: z.boolean(),
  }),
});

export const reviewApplicationSchema = z.object({
  body: z.object({
    action: z.enum(["approve", "reject"]),
    conditions: z.array(z.string()).optional(),
    rejectionReason: z.string().optional(),
    landlordNotes: z.string().optional(),
  }),
});
