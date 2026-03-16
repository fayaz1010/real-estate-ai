/**
 * Zod schemas for Property data validation.
 */

import { z } from 'zod';

export const PROPERTY_TYPES = [
  'APARTMENT',
  'HOUSE',
  'CONDO',
  'TOWNHOUSE',
  'COMMERCIAL',
] as const;

export const AMENITIES = [
  'POOL',
  'GYM',
  'PARKING',
  'WASHER_DRYER',
  'DISHWASHER',
  'BALCONY',
  'PET_FRIENDLY',
] as const;

export const propertySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be at most 5000 characters'),
  address: z.string().min(1, 'Address is required').max(300),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .max(20, 'ZIP code must be at most 20 characters'),
  propertyType: z.enum(PROPERTY_TYPES),
  bedrooms: z.number().int().min(0, 'Bedrooms must be 0 or more').max(50),
  bathrooms: z.number().min(0, 'Bathrooms must be 0 or more').max(50),
  squareFootage: z.number().min(0, 'Square footage must be 0 or more').max(1000000),
  rent: z.number().positive('Rent must be a positive number').max(1000000),
  images: z.array(z.string().url('Each image must be a valid URL')),
  amenities: z.array(z.enum(AMENITIES)),
  isPublished: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  slug: z.string().min(1, 'Slug is required'),
});

export type PropertySchemaType = z.infer<typeof propertySchema>;

export const createPropertySchema = propertySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  slug: true,
}).extend({
  isPublished: z.boolean().default(false),
});

export type CreatePropertySchemaType = z.infer<typeof createPropertySchema>;

export const updatePropertySchema = createPropertySchema.partial();

export type UpdatePropertySchemaType = z.infer<typeof updatePropertySchema>;
