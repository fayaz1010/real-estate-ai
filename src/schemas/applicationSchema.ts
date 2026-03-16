/**
 * Zod schemas for Application data validation.
 */

import { z } from 'zod';

export const APPLICATION_STATUSES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'WITHDRAWN',
] as const;

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Must be a valid email address'),
  phone: z.string().min(1, 'Phone is required').max(20),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  ssn: z.string().min(1, 'SSN is required').max(11),
  currentAddress: z.string().min(1, 'Current address is required').max(300),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  zipCode: z.string().min(1, 'ZIP code is required').max(20),
});

export const employmentInfoSchema = z.object({
  employerName: z.string().min(1, 'Employer name is required').max(200),
  position: z.string().min(1, 'Position is required').max(100),
  employmentDuration: z.string().min(1, 'Employment duration is required').max(50),
  employerPhone: z.string().min(1, 'Employer phone is required').max(20),
  employerAddress: z.string().min(1, 'Employer address is required').max(300),
  employmentType: z.string().min(1, 'Employment type is required').max(50),
});

export const incomeInfoSchema = z.object({
  annualIncome: z.number().min(0, 'Annual income must be 0 or more'),
  monthlyIncome: z.number().min(0, 'Monthly income must be 0 or more'),
  additionalIncomeSource: z.string().max(200),
  additionalIncomeAmount: z.number().min(0),
});

export const rentalHistorySchema = z.object({
  previousAddress: z.string().min(1, 'Previous address is required').max(300),
  landlordName: z.string().min(1, 'Landlord name is required').max(100),
  landlordPhone: z.string().min(1, 'Landlord phone is required').max(20),
  rentAmount: z.number().positive('Rent must be a positive number'),
  durationOfStay: z.string().min(1, 'Duration of stay is required').max(50),
  reasonForLeaving: z.string().min(1, 'Reason for leaving is required').max(500),
});

export const referenceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  relationship: z.string().min(1, 'Relationship is required').max(50),
  phone: z.string().min(1, 'Phone is required').max(20),
  email: z.string().email('Must be a valid email address'),
});

export const applicationSchema = z.object({
  id: z.string().uuid(),
  propertyId: z.string().uuid(),
  tenantId: z.string().uuid(),
  status: z.enum(APPLICATION_STATUSES),
  submissionDate: z.coerce.date(),
  personalInfo: personalInfoSchema,
  employmentInfo: employmentInfoSchema,
  incomeInfo: incomeInfoSchema,
  rentalHistory: rentalHistorySchema,
  references: z.array(referenceSchema).min(1, 'At least one reference is required'),
  backgroundCheckConsent: z.boolean(),
  documents: z.array(z.string().url('Each document must be a valid URL')),
  score: z.number().min(0).max(100).nullable(),
  notes: z.string().max(5000),
});

export type ApplicationSchemaType = z.infer<typeof applicationSchema>;

export const createApplicationSchema = applicationSchema.omit({
  id: true,
  submissionDate: true,
  score: true,
}).extend({
  status: z.enum(APPLICATION_STATUSES).default('PENDING'),
  score: z.number().min(0).max(100).nullable().default(null),
});

export type CreateApplicationSchemaType = z.infer<typeof createApplicationSchema>;
