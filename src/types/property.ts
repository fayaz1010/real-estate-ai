/**
 * TypeScript types for the Property data model.
 */

export type Property = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  rent: number;
  images: string[];
  amenities: string[];
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
};
