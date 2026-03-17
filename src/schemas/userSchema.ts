/**
 * Zod schemas for User data validation.
 */

import { z } from "zod";

export const USER_ROLES = [
  "TENANT",
  "LANDLORD",
  "AGENT",
  "PROPERTY_MANAGER",
  "BUSINESS",
  "ADMIN",
] as const;

export const tenantProfileSchema = z.object({
  currentAddress: z.string().min(1).max(300),
  moveInDate: z.string().min(1),
  preferredLocation: z.string().min(1).max(200),
  budget: z.number().positive(),
  pets: z.boolean(),
  employmentStatus: z.string().min(1).max(100),
});

export const landlordProfileSchema = z.object({
  companyName: z.string().min(1).max(200),
  totalProperties: z.number().int().min(0),
  businessLicense: z.string().min(1).max(100),
  preferredContactMethod: z.string().min(1).max(50),
});

export const agentProfileSchema = z.object({
  agencyName: z.string().min(1).max(200),
  licenseNumber: z.string().min(1).max(50),
  specializations: z.array(z.string().min(1)),
  yearsOfExperience: z.number().int().min(0).max(100),
  bio: z.string().min(1).max(2000),
});

export const propertyManagerProfileSchema = z.object({
  companyName: z.string().min(1).max(200),
  managedProperties: z.number().int().min(0),
  certifications: z.array(z.string().min(1)),
  serviceAreas: z.array(z.string().min(1)),
});

export const businessProfileSchema = z.object({
  businessName: z.string().min(1).max(200),
  businessType: z.string().min(1).max(100),
  taxId: z.string().min(1).max(50),
  website: z.string().url("Website must be a valid URL"),
});

export const adminProfileSchema = z.object({
  department: z.string().min(1).max(100),
  accessLevel: z.number().int().min(1).max(10),
});

export const userProfileSchema = z.object({
  tenantProfile: tenantProfileSchema.optional(),
  landlordProfile: landlordProfileSchema.optional(),
  agentProfile: agentProfileSchema.optional(),
  propertyManagerProfile: propertyManagerProfileSchema.optional(),
  businessProfile: businessProfileSchema.optional(),
  adminProfile: adminProfileSchema.optional(),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Must be a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  role: z.enum(USER_ROLES),
  profile: userProfileSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  emailVerified: z.boolean(),
  twoFactorEnabled: z.boolean(),
});

export type UserSchemaType = z.infer<typeof userSchema>;
