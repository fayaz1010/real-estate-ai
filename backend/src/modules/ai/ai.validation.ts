/**
 * @module ai.validation
 * @description Zod validation schemas for AI endpoint request payloads.
 */
import { z } from "zod";

/**
 * Validation schema for property valuation requests.
 * Requires address, size, bedrooms, bathrooms, and recent sales data.
 */
export const propertyValuationSchema = z.object({
  body: z.object({
    address: z.string().min(1, "Address is required"),
    size: z.number().positive("Size must be a positive number"),
    bedrooms: z
      .number()
      .int()
      .min(0, "Bedrooms must be a non-negative integer"),
    bathrooms: z
      .number()
      .int()
      .min(0, "Bathrooms must be a non-negative integer"),
    recentSales: z
      .array(
        z.object({
          address: z.string().min(1, "Sale address is required"),
          salePrice: z.number().positive("Sale price must be positive"),
          saleDate: z.string().min(1, "Sale date is required"),
        }),
      )
      .min(1, "At least one recent sale is required"),
  }),
});

/**
 * Validation schema for market analysis requests.
 * Requires at least one of city, state, or zipCode.
 */
export const marketAnalysisSchema = z.object({
  body: z
    .object({
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .refine((data) => data.city || data.state || data.zipCode, {
      message: "At least one of city, state, or zipCode is required",
    }),
});

/**
 * Validation schema for tenant screening insights requests.
 * Requires credit score, background check results, and income verification.
 */
export const tenantScreeningSchema = z.object({
  body: z.object({
    creditScore: z
      .number()
      .int()
      .min(300, "Credit score must be at least 300")
      .max(850, "Credit score must be at most 850"),
    backgroundCheck: z.object({
      criminal: z.enum(["clear", "minor", "major"]),
      eviction: z.enum(["clear", "found"]),
    }),
    incomeVerification: z.object({
      monthlyIncome: z.number().positive("Monthly income must be positive"),
      employmentStatus: z.enum([
        "employed",
        "self-employed",
        "unemployed",
        "retired",
      ]),
      employmentLength: z
        .number()
        .min(0, "Employment length must be non-negative")
        .optional(),
    }),
  }),
});

/**
 * Validation schema for predictive maintenance requests.
 * Requires property age and maintenance history.
 */
export const predictiveMaintenanceSchema = z.object({
  body: z.object({
    propertyAge: z.number().min(0, "Property age must be non-negative"),
    maintenanceHistory: z
      .array(
        z.object({
          system: z.string().min(1, "System name is required"),
          lastServiceDate: z.string().min(1, "Last service date is required"),
          issueDescription: z.string().optional(),
        }),
      )
      .min(1, "At least one maintenance history entry is required"),
    sensorData: z
      .array(
        z.object({
          sensorType: z.string().min(1, "Sensor type is required"),
          reading: z.number(),
          unit: z.string().min(1, "Unit is required"),
          timestamp: z.string().min(1, "Timestamp is required"),
        }),
      )
      .optional(),
  }),
});
