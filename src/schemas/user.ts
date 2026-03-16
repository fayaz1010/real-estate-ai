/**
 * Zod schemas for user-related data validation.
 * These schemas align with the Prisma User model and are used
 * for form validation, API request/response validation, and Redux state.
 */

import { z } from 'zod';

/**
 * Valid user roles matching the Prisma UserRole enum.
 */
export const USER_ROLES = [
  'TENANT',
  'LANDLORD',
  'AGENT',
  'PROPERTY_MANAGER',
  'BUSINESS',
] as const;

/**
 * Zod schema for user registration.
 * Validates all required fields for creating a new user account.
 */
export const RegisterSchema = z.object({
  /** User's email address. Must be a valid email format. */
  email: z.string().email('Please enter a valid email address'),
  /**
   * User's password. Must be at least 8 characters and contain
   * uppercase, lowercase, digit, and special character.
   */
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  /** User's first name. */
  firstName: z.string().min(1, 'First name is required'),
  /** User's last name. */
  lastName: z.string().min(1, 'Last name is required'),
  /** User's role on the platform. */
  role: z.enum(USER_ROLES, {
    error: 'Please select a valid role',
  }),
});

/** TypeScript type inferred from RegisterSchema. */
export type RegisterInput = z.infer<typeof RegisterSchema>;

/**
 * Zod schema for user login.
 * Validates email and password credentials.
 */
export const LoginSchema = z.object({
  /** User's email address. Must be a valid email format. */
  email: z.string().email('Please enter a valid email address'),
  /** User's password. */
  password: z.string().min(1, 'Password is required'),
});

/** TypeScript type inferred from LoginSchema. */
export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Zod schema for updating user profile information.
 * All fields are optional to allow partial updates.
 */
export const UpdateProfileSchema = z.object({
  /** User's first name. */
  firstName: z.string().min(1, 'First name cannot be empty').optional(),
  /** User's last name. */
  lastName: z.string().min(1, 'Last name cannot be empty').optional(),
  /** Phone number. */
  phone: z.string().optional(),
  /** Street address. */
  address: z.string().optional(),
  /** City name. */
  city: z.string().optional(),
  /** State or province. */
  state: z.string().optional(),
  /** ZIP or postal code. */
  zipCode: z.string().optional(),
  /** URL of the user's profile image. */
  profileImage: z.string().url('Profile image must be a valid URL').optional(),
});

/** TypeScript type inferred from UpdateProfileSchema. */
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
