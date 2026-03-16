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
 * Zod schema for a complete property record.
 * Mirrors the Prisma Property model with frontend-relevant fields.
 */
export const PropertySchema = z.object({
  /** Unique identifier (UUID). */
  id: z.string().uuid(),
  /** URL-friendly slug. */
  slug: z.string(),
  /** Property listing title. */
  title: z.string().min(1, 'Title is required'),
  /** Detailed property description. */
  description: z.string().min(1, 'Description is required'),
  /** Type of property (e.g., APARTMENT, HOUSE). */
  propertyType: z.enum(PROPERTY_TYPES),
  /** Street address. */
  address: z.string().min(1, 'Address is required'),
  /** City name. */
  city: z.string().min(1, 'City is required'),
  /** State or province. */
  state: z.string().min(1, 'State is required'),
  /** ZIP or postal code. */
  zipCode: z.string().min(1, 'ZIP code is required'),
  /** Country name. */
  country: z.string().min(1, 'Country is required'),
  /** Geographic latitude coordinate. */
  latitude: z.number(),
  /** Geographic longitude coordinate. */
  longitude: z.number(),
  /** Listing price. */
  price: z.number().positive('Price must be a positive number'),
  /** Number of bedrooms. */
  bedrooms: z.number().int().nonnegative(),
  /** Number of bathrooms. */
  bathrooms: z.number().nonnegative(),
  /** Total square footage. */
  squareFootage: z.number().nonnegative(),
  /** List of amenity names. */
  amenities: z.array(z.string()),
  /** List of image URLs. */
  images: z.array(z.string().url()),
  /** Whether the property is publicly visible. */
  isPublished: z.boolean(),
  /** Record creation timestamp. */
  createdAt: z.coerce.date(),
  /** Record last-update timestamp. */
  updatedAt: z.coerce.date(),
});

/** TypeScript type inferred from PropertySchema. */
export type Property = z.infer<typeof PropertySchema>;

/**
 * Zod schema for creating a new property.
 * Excludes auto-generated fields (id, slug, timestamps).
 * Defaults isPublished to false.
 */
export const CreatePropertySchema = PropertySchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  /** Whether the property is publicly visible. Defaults to false. */
  isPublished: z.boolean().default(false),
});

/** TypeScript type inferred from CreatePropertySchema. */
export type CreateProperty = z.infer<typeof CreatePropertySchema>;

/**
 * Zod schema for updating an existing property.
 * All fields are optional to allow partial updates.
 */
export const UpdatePropertySchema = CreatePropertySchema.partial();

/** TypeScript type inferred from UpdatePropertySchema. */
export type UpdateProperty = z.infer<typeof UpdatePropertySchema>;

/**
 * Zod schema for validating property search/filter parameters.
 * All fields are optional with sensible defaults for pagination.
 */
export const PropertySearchParamsSchema = z.object({
  /** Free-text search term. */
  searchTerm: z.string().optional(),
  /** Filter by property type. */
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  /** Filter by city. */
  city: z.string().optional(),
  /** Filter by state. */
  state: z.string().optional(),
  /** Minimum price filter. */
  minPrice: z.number().nonnegative().optional(),
  /** Maximum price filter. */
  maxPrice: z.number().nonnegative().optional(),
  /** Minimum number of bedrooms. */
  bedrooms: z.number().int().nonnegative().optional(),
  /** Minimum number of bathrooms. */
  bathrooms: z.number().nonnegative().optional(),
  /** Required amenities. */
  amenities: z.array(z.string()).optional(),
  /** Page number (1-indexed). Defaults to 1. */
  page: z.number().int().positive().default(1),
  /** Number of results per page. Defaults to 10. */
  limit: z.number().int().positive().default(10),
  /** Field name to sort by. */
  sortBy: z.string().optional(),
  /** Sort direction. */
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/** TypeScript type inferred from PropertySearchParamsSchema. */
export type PropertySearchParams = z.infer<typeof PropertySearchParamsSchema>;
