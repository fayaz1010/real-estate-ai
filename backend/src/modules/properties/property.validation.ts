// Property Validation Schemas
import { z } from 'zod';

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    propertyType: z.enum(['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'STUDIO', 'LOFT', 'COMMERCIAL']),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    }),
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().min(0),
    sqft: z.number().int().min(0).optional(),
    price: z.number().min(0),
    deposit: z.number().min(0).optional(),
    amenities: z.array(z.string()).optional(),
    availableFrom: z.string().optional(),
    leaseTerm: z.number().int().min(1).optional(),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    propertyType: z.enum(['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'STUDIO', 'LOFT', 'COMMERCIAL']).optional(),
    bedrooms: z.number().int().min(0).optional(),
    bathrooms: z.number().min(0).optional(),
    sqft: z.number().int().min(0).optional(),
    price: z.number().min(0).optional(),
    deposit: z.number().min(0).optional(),
    amenities: z.array(z.string()).optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'RENTED', 'SOLD', 'INACTIVE', 'ARCHIVED']).optional(),
  }),
});
