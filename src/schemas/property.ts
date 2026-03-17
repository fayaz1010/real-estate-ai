/**
 * Zod schemas for property-related data validation.
 * These schemas align with the Prisma Property model and are used
 * for form validation, API request/response validation, and Redux state.
 */

import { z } from 'zod';

/**
 * Valid property types matching the Prisma PropertyType enum.
 */
export const PROPERTY_TYPES = [
  'APARTMENT',
  'HOUSE',
  'CONDO',
  'TOWNHOUSE',
  'STUDIO',
  'LOFT',
  'COMMERCIAL',
] as const;

/**
 * Valid property statuses matching the Prisma PropertyStatus enum.
 */
export const PROPERTY_STATUSES = [
  'DRAFT',
  'ACTIVE',
  'RENTED',
  'SOLD',
  'INACTIVE',
  'ARCHIVED',
] as const;

/**
 * Zod schema for the property address (stored as Json in Prisma).
 */
export const PropertyAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required').max(300),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  zipCode: z.string().min(1, 'ZIP code is required').max(20),
  country: z.string().min(1, 'Country is required').max(100),
});

export type PropertyAddressInput = z.infer<typeof PropertyAddressSchema>;

/**
 * Zod schema for a complete property record.
 * Mirrors the Prisma Property model.
 */
export const PropertySchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(5000),
  slug: z.string().min(1),
  propertyType: z.enum(PROPERTY_TYPES),
  status: z.enum(PROPERTY_STATUSES),
  address: PropertyAddressSchema,
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  sqft: z.number().int().nonnegative().nullable(),
  lotSize: z.number().int().nonnegative().nullable(),
  yearBuilt: z.number().int().min(1800).max(2100).nullable(),
  price: z.number().positive('Price must be a positive number'),
  pricePerSqft: z.number().nonnegative().nullable(),
  deposit: z.number().nonnegative().nullable(),
  amenities: z.array(z.string()),
  images: z.array(z.string().url('Each image must be a valid URL')),
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

export type Property = z.infer<typeof PropertySchema>;

/**
 * Zod schema for creating a new property.
 * Excludes auto-generated fields (id, slug, timestamps, computed fields).
 */
export const CreatePropertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(5000),
  propertyType: z.enum(PROPERTY_TYPES),
  address: PropertyAddressSchema,
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  sqft: z.number().int().nonnegative().nullable().optional(),
  lotSize: z.number().int().nonnegative().nullable().optional(),
  yearBuilt: z.number().int().min(1800).max(2100).nullable().optional(),
  price: z.number().positive('Price must be a positive number'),
  deposit: z.number().nonnegative().nullable().optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url('Each image must be a valid URL')).default([]),
  virtualTourUrl: z.string().url().nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  availableFrom: z.coerce.date().nullable().optional(),
  leaseTerm: z.number().int().positive().nullable().optional(),
  isPublished: z.boolean().default(false),
});

export type CreateProperty = z.infer<typeof CreatePropertySchema>;

/**
 * Zod schema for updating an existing property.
 * All fields are optional to allow partial updates.
 */
export const UpdatePropertySchema = CreatePropertySchema.partial();

export type UpdateProperty = z.infer<typeof UpdatePropertySchema>;

/**
 * Zod schema for validating property search/filter parameters.
 */
export const PropertySearchParamsSchema = z.object({
  searchTerm: z.string().optional(),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().nonnegative().optional(),
  amenities: z.array(z.string()).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type PropertySearchParams = z.infer<typeof PropertySearchParamsSchema>;
