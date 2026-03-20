/**
 * TypeScript types for the Property data model.
 */

export type PropertyStatus =
  | "DRAFT"
  | "ACTIVE"
  | "RENTED"
  | "SOLD"
  | "INACTIVE"
  | "ARCHIVED";

export type PropertyType =
  | "APARTMENT"
  | "HOUSE"
  | "CONDO"
  | "TOWNHOUSE"
  | "STUDIO"
  | "LOFT"
  | "COMMERCIAL";

export type Property = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  ownerId: string;
  title: string;
  description: string;
  slug: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  address: Record<string, unknown>;
  bedrooms: number;
  bathrooms: number;
  sqft?: number | null;
  lotSize?: number | null;
  yearBuilt?: number | null;
  price: number;
  pricePerSqft?: number | null;
  deposit?: number | null;
  amenities: string[];
  utilities?: Record<string, unknown> | null;
  parking?: Record<string, unknown> | null;
  petPolicy?: Record<string, unknown> | null;
  images?: PropertyImage[];
  virtualTourUrl?: string | null;
  videoUrl?: string | null;
  floorPlanUrl?: string | null;
  availableFrom?: Date | null;
  leaseTerm?: number | null;
  views: number;
  featured: boolean;
  verified: boolean;
  publishedAt?: Date | null;
};

export type PropertyImage = {
  id: string;
  propertyId: string;
  url: string;
  caption?: string | null;
  isPrimary: boolean;
  order: number;
  createdAt: Date;
};
