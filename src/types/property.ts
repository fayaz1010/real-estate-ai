/**
 * TypeScript types for the Property data model.
 */

export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  CONDO = "CONDO",
  TOWNHOUSE = "TOWNHOUSE",
  COMMERCIAL = "COMMERCIAL",
}

export enum Amenity {
  POOL = "POOL",
  GYM = "GYM",
  PARKING = "PARKING",
  WASHER_DRYER = "WASHER_DRYER",
  DISHWASHER = "DISHWASHER",
  BALCONY = "BALCONY",
  PET_FRIENDLY = "PET_FRIENDLY",
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  rent: number;
  images: string[];
  amenities: Amenity[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}
