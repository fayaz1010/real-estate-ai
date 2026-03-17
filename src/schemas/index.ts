/**
 * Zod validation schemas for the Real Estate Platform.
 * Central location for all reusable validation schemas.
 * These schemas align with the types defined in src/types/index.ts
 * and the Prisma models in prisma/schema.prisma.
 */

import { z } from "zod";

// ==========================================
// ENUM CONSTANTS
// ==========================================

export const USER_ROLES = [
  "TENANT",
  "LANDLORD",
  "AGENT",
  "PROPERTY_MANAGER",
  "BUSINESS",
  "ADMIN",
  "SUPER_ADMIN",
] as const;

export const USER_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "PENDING_VERIFICATION",
] as const;

export const PROPERTY_TYPES = [
  "APARTMENT",
  "HOUSE",
  "CONDO",
  "TOWNHOUSE",
  "STUDIO",
  "LOFT",
  "COMMERCIAL",
] as const;

export const PROPERTY_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "RENTED",
  "SOLD",
  "INACTIVE",
  "ARCHIVED",
] as const;

export const INSPECTION_TYPES = ["IN_PERSON", "VIRTUAL", "OPEN_HOUSE"] as const;

export const INSPECTION_STATUSES = [
  "SCHEDULED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "RESCHEDULED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "NO_SHOW",
] as const;

export const APPLICATION_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "WITHDRAWN",
] as const;

export const LEASE_STATUSES = [
  "DRAFT",
  "PENDING_SIGNATURES",
  "ACTIVE",
  "EXPIRED",
  "TERMINATED",
  "RENEWED",
] as const;

export const PAYMENT_TYPES = [
  "RENT",
  "DEPOSIT",
  "LATE_FEE",
  "MAINTENANCE",
  "UTILITY",
  "OTHER",
] as const;

export const PAYMENT_STATUSES = [
  "PENDING",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
] as const;

export const NOTIFICATION_TYPES = ["EMAIL", "IN_APP", "SMS", "PUSH"] as const;

export const NOTIFICATION_STATUSES = [
  "PENDING",
  "SENT",
  "DELIVERED",
  "READ",
  "FAILED",
] as const;

// ==========================================
// USER SCHEMAS
// ==========================================

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const RegisterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  phone: z.string().max(20).optional(),
  role: z.enum(USER_ROLES, {
    error: "Please select a valid role",
  }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const UpdateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name cannot be empty")
    .max(100)
    .optional(),
  lastName: z.string().min(1, "Last name cannot be empty").max(100).optional(),
  phone: z.string().max(20).optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  passwordHash: z.string(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().max(20).nullable(),
  role: z.enum(USER_ROLES),
  avatar: z.string().url().nullable(),
  status: z.enum(USER_STATUSES),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  twoFactorEnabled: z.boolean(),
  twoFactorSecret: z.string().nullable(),
  profileCompletion: z.number().int().min(0).max(100),
  lastLoginAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;

// ==========================================
// PROPERTY SCHEMAS
// ==========================================

export const PropertyAddressSchema = z.object({
  street: z.string().min(1, "Street address is required").max(300),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  zipCode: z.string().min(1, "ZIP code is required").max(20),
  country: z.string().min(1, "Country is required").max(100),
});

export type PropertyAddressInput = z.infer<typeof PropertyAddressSchema>;

export const PropertySchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  slug: z.string().min(1),
  propertyType: z.enum(PROPERTY_TYPES),
  status: z.enum(PROPERTY_STATUSES),
  address: PropertyAddressSchema,
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  sqft: z.number().nonnegative().nullable(),
  lotSize: z.number().nonnegative().nullable(),
  yearBuilt: z.number().int().min(1800).max(2100).nullable(),
  price: z.number().positive("Price must be a positive number"),
  pricePerSqft: z.number().nonnegative().nullable(),
  deposit: z.number().nonnegative().nullable(),
  amenities: z.array(z.string()),
  images: z.array(z.string().url("Each image must be a valid URL")),
  virtualTourUrl: z.string().url().nullable(),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  availableFrom: z.coerce.date().nullable(),
  leaseTerm: z.number().int().positive().nullable(),
  views: z.number().int().nonnegative(),
  featured: z.boolean(),
  verified: z.boolean(),
  isPublished: z.boolean(),
  publishedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type PropertySchemaType = z.infer<typeof PropertySchema>;

export const CreatePropertySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  propertyType: z.enum(PROPERTY_TYPES),
  address: PropertyAddressSchema,
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  sqft: z.number().nonnegative().nullable().optional(),
  lotSize: z.number().nonnegative().nullable().optional(),
  yearBuilt: z.number().int().min(1800).max(2100).nullable().optional(),
  price: z.number().positive("Price must be a positive number"),
  deposit: z.number().nonnegative().nullable().optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url("Each image must be a valid URL")).default([]),
  virtualTourUrl: z.string().url().nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  availableFrom: z.coerce.date().nullable().optional(),
  leaseTerm: z.number().int().positive().nullable().optional(),
  isPublished: z.boolean().default(false),
});

export type CreatePropertyInput = z.infer<typeof CreatePropertySchema>;

export const UpdatePropertySchema = CreatePropertySchema.partial();

export type UpdatePropertyInput = z.infer<typeof UpdatePropertySchema>;

// ==========================================
// INSPECTION SCHEMAS
// ==========================================

export const InspectionSchema = z.object({
  id: z.string().uuid(),
  propertyId: z.string().uuid(),
  inspectorId: z.string().uuid(),
  tenantId: z.string().uuid(),
  type: z.enum(INSPECTION_TYPES),
  status: z.enum(INSPECTION_STATUSES),
  scheduledDate: z.coerce.date(),
  scheduledTime: z.string().min(1, "Scheduled time is required"),
  duration: z.number().int().positive(),
  checkInAt: z.coerce.date().nullable(),
  checkOutAt: z.coerce.date().nullable(),
  tenantNotes: z.string().max(2000).nullable(),
  landlordNotes: z.string().max(2000).nullable(),
  confirmedAt: z.coerce.date().nullable(),
  completedAt: z.coerce.date().nullable(),
  cancelledAt: z.coerce.date().nullable(),
  cancellationReason: z.string().max(500).nullable(),
  meetingLink: z.string().url().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type InspectionSchemaType = z.infer<typeof InspectionSchema>;

export const ScheduleInspectionSchema = z.object({
  propertyId: z.string().uuid("Valid property ID is required"),
  tenantId: z.string().uuid("Valid tenant ID is required"),
  type: z.enum(INSPECTION_TYPES),
  scheduledDate: z.coerce.date(),
  scheduledTime: z.string().min(1, "Scheduled time is required"),
  duration: z.number().int().positive().default(30),
  tenantNotes: z.string().max(2000).optional(),
  meetingLink: z.string().url().optional(),
});

export type ScheduleInspectionInput = z.infer<typeof ScheduleInspectionSchema>;

// ==========================================
// APPLICATION SCHEMAS
// ==========================================

export const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Must be a valid email address"),
  phone: z.string().min(1, "Phone is required").max(20),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  ssn: z.string().min(1, "SSN is required").max(11),
  currentAddress: z.string().min(1, "Current address is required").max(300),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  zipCode: z.string().min(1, "ZIP code is required").max(20),
});

export type PersonalInfoInput = z.infer<typeof PersonalInfoSchema>;

export const EmploymentInfoSchema = z.object({
  employerName: z.string().min(1, "Employer name is required").max(200),
  position: z.string().min(1, "Position is required").max(100),
  employmentDuration: z
    .string()
    .min(1, "Employment duration is required")
    .max(50),
  employerPhone: z.string().min(1, "Employer phone is required").max(20),
  employerAddress: z.string().min(1, "Employer address is required").max(300),
  employmentType: z.string().min(1, "Employment type is required").max(50),
});

export type EmploymentInfoInput = z.infer<typeof EmploymentInfoSchema>;

export const IncomeInfoSchema = z.object({
  annualIncome: z.number().min(0, "Annual income must be 0 or more"),
  monthlyIncome: z.number().min(0, "Monthly income must be 0 or more"),
  additionalIncomeSource: z.string().max(200).default(""),
  additionalIncomeAmount: z.number().min(0).default(0),
});

export type IncomeInfoInput = z.infer<typeof IncomeInfoSchema>;

export const RentalHistorySchema = z.object({
  previousAddress: z.string().min(1, "Previous address is required").max(300),
  landlordName: z.string().min(1, "Landlord name is required").max(100),
  landlordPhone: z.string().min(1, "Landlord phone is required").max(20),
  rentAmount: z.number().positive("Rent must be a positive number"),
  durationOfStay: z.string().min(1, "Duration of stay is required").max(50),
  reasonForLeaving: z
    .string()
    .min(1, "Reason for leaving is required")
    .max(500),
});

export type RentalHistoryInput = z.infer<typeof RentalHistorySchema>;

export const ReferenceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  relationship: z.string().min(1, "Relationship is required").max(50),
  phone: z.string().min(1, "Phone is required").max(20),
  email: z.string().email("Must be a valid email address"),
});

export type ReferenceInput = z.infer<typeof ReferenceSchema>;

export const ApplicationScoringSchema = z.object({
  creditScore: z.number().min(0).max(100),
  incomeScore: z.number().min(0).max(100),
  employmentScore: z.number().min(0).max(100),
  rentalHistoryScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
});

export type ApplicationScoringInput = z.infer<typeof ApplicationScoringSchema>;

export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  applicantId: z.string().uuid(),
  propertyId: z.string().uuid(),
  status: z.enum(APPLICATION_STATUSES),
  submissionDate: z.coerce.date(),
  personalInfo: PersonalInfoSchema,
  employmentInfo: EmploymentInfoSchema,
  incomeInfo: IncomeInfoSchema,
  rentalHistory: RentalHistorySchema,
  references: z
    .array(ReferenceSchema)
    .min(1, "At least one reference is required"),
  backgroundCheckConsent: z.boolean(),
  documents: z.array(z.string().url("Each document must be a valid URL")),
  scoring: ApplicationScoringSchema.nullable(),
  notes: z.string().max(5000),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ApplicationSchemaType = z.infer<typeof ApplicationSchema>;

export const SubmitApplicationSchema = z.object({
  propertyId: z.string().uuid("Valid property ID is required"),
  personalInfo: PersonalInfoSchema,
  employmentInfo: EmploymentInfoSchema,
  incomeInfo: IncomeInfoSchema,
  rentalHistory: RentalHistorySchema,
  references: z
    .array(ReferenceSchema)
    .min(1, "At least one reference is required"),
  backgroundCheckConsent: z.literal(true, {
    error: "You must consent to a background check",
  }),
  documents: z
    .array(z.string().url("Each document must be a valid URL"))
    .default([]),
  notes: z.string().max(5000).default(""),
});

export type SubmitApplicationInput = z.infer<typeof SubmitApplicationSchema>;

// ==========================================
// LEASE SCHEMAS
// ==========================================

export const LateFeeConfigSchema = z.object({
  amount: z.number().nonnegative("Late fee must be non-negative"),
  graceDays: z.number().int().nonnegative().default(5),
});

export type LateFeeConfigInput = z.infer<typeof LateFeeConfigSchema>;

export const LeaseSchema = z.object({
  id: z.string().uuid(),
  propertyId: z.string().uuid(),
  tenantId: z.string().uuid(),
  landlordId: z.string().uuid(),
  status: z.enum(LEASE_STATUSES),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  rentAmount: z.number().positive("Rent amount must be positive"),
  depositAmount: z.number().nonnegative("Deposit must be non-negative"),
  depositPaid: z.boolean(),
  lateFeeConfig: LateFeeConfigSchema,
  leaseDocumentUrl: z.string().url().nullable(),
  signedByTenant: z.boolean(),
  signedByLandlord: z.boolean(),
  signedAt: z.coerce.date().nullable(),
  isActive: z.boolean(),
  terminatedAt: z.coerce.date().nullable(),
  terminationReason: z.string().max(500).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type LeaseSchemaType = z.infer<typeof LeaseSchema>;

export const CreateLeaseSchema = z
  .object({
    propertyId: z.string().uuid("Valid property ID is required"),
    tenantId: z.string().uuid("Valid tenant ID is required"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    rentAmount: z.number().positive("Rent amount must be positive"),
    depositAmount: z.number().nonnegative("Deposit must be non-negative"),
    lateFeeConfig: LateFeeConfigSchema.default({ amount: 0, graceDays: 5 }),
    leaseDocumentUrl: z.string().url().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CreateLeaseInput = z.infer<typeof CreateLeaseSchema>;

// ==========================================
// PAYMENT SCHEMAS
// ==========================================

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  leaseId: z.string().uuid(),
  tenantId: z.string().uuid(),
  type: z.enum(PAYMENT_TYPES),
  status: z.enum(PAYMENT_STATUSES),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3).default("USD"),
  dueDate: z.coerce.date(),
  paymentDate: z.coerce.date().nullable(),
  paidAt: z.coerce.date().nullable(),
  stripePaymentIntentId: z.string().nullable(),
  stripeInvoiceId: z.string().nullable(),
  description: z.string().max(500).nullable(),
  receiptUrl: z.string().url().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type PaymentSchemaType = z.infer<typeof PaymentSchema>;

export const ProcessPaymentSchema = z.object({
  leaseId: z.string().uuid("Valid lease ID is required"),
  type: z.enum(PAYMENT_TYPES),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3).default("USD"),
  stripePaymentIntentId: z.string().optional(),
  description: z.string().max(500).optional(),
});

export type ProcessPaymentInput = z.infer<typeof ProcessPaymentSchema>;

// ==========================================
// NOTIFICATION SCHEMAS
// ==========================================

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  recipientId: z.string().uuid(),
  type: z.enum(NOTIFICATION_TYPES),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
  status: z.enum(NOTIFICATION_STATUSES),
  data: z.record(z.string(), z.unknown()).nullable(),
  readAt: z.coerce.date().nullable(),
  sentAt: z.coerce.date().nullable(),
  failReason: z.string().max(500).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type NotificationSchemaType = z.infer<typeof NotificationSchema>;

export const NotificationPreferenceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  email: z.boolean().default(true),
  sms: z.boolean().default(false),
  push: z.boolean().default(true),
  inspectionReminders: z.boolean().default(true),
  inspectionUpdates: z.boolean().default(true),
  applicationUpdates: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type NotificationPreferenceSchemaType = z.infer<
  typeof NotificationPreferenceSchema
>;

export const UpdateNotificationPreferenceSchema = z.object({
  email: z.boolean().optional(),
  sms: z.boolean().optional(),
  push: z.boolean().optional(),
  inspectionReminders: z.boolean().optional(),
  inspectionUpdates: z.boolean().optional(),
  applicationUpdates: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
});

export type UpdateNotificationPreferenceInput = z.infer<
  typeof UpdateNotificationPreferenceSchema
>;
