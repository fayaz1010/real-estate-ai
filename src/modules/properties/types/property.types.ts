// FILE PATH: src/modules/properties/types/property.types.ts
// Module 1.2: Property Listings Management - Type Definitions

export type PropertyType = 'apartment' | 'house' | 'condo' | 'townhouse' | 'studio' | 'commercial' | 'land';
export type ListingType = 'rent' | 'sale';
export type PropertyStatus = 'available' | 'pending' | 'rented' | 'sold' | 'off_market' | 'draft';
export type PetPolicy = 'allowed' | 'not_allowed' | 'negotiable' | 'cats_only' | 'dogs_only';
export type ParkingType = 'garage' | 'carport' | 'street' | 'covered' | 'none';
export type OwnerType = 'landlord' | 'agent' | 'property_manager' | 'business';

export interface PropertyAddress {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  neighborhood?: string;
  county?: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  category?: string; // 'living_room', 'kitchen', 'bedroom', 'bathroom', 'exterior', 'other'
  order: number;
  isPrimary: boolean;
  width?: number;
  height?: number;
  uploadedAt: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  licenseNumber?: string;
  brokerageName?: string;
  rating?: number;
  reviewsCount?: number;
  responseTime?: string; // e.g., "Within 1 hour"
  activeListings?: number;
}

export interface PropertyPricing {
  price: number;
  priceType: 'monthly' | 'total'; // monthly for rent, total for sale
  deposit?: number;
  applicationFee?: number;
  petDeposit?: number;
  securityDeposit?: number;
  lastMonthRent?: number;
  utilitiesIncluded?: string[]; // ['water', 'gas', 'electric', 'internet', 'trash']
  
  // For sales
  pricePerSqft?: number;
  propertyTax?: number;
  hoaFees?: number;
  
  // Price history
  priceHistory?: PriceHistoryEntry[];
  originalPrice?: number;
  priceChange?: number; // percentage
  priceChangedAt?: string;
}

export interface PriceHistoryEntry {
  date: string;
  price: number;
  event: 'listed' | 'price_increase' | 'price_decrease' | 'sold' | 'rented';
}

export interface PropertyDetails {
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: number;
  yearBuilt?: number;
  floors?: number;
  unitNumber?: string;
  buildingName?: string;
  
  // Additional details
  furnished: boolean;
  petPolicy: PetPolicy;
  parking: {
    spaces: number;
    type: ParkingType;
    covered: boolean;
    evCharging?: boolean;
  };
  laundry?: 'in_unit' | 'in_building' | 'none' | 'hookup';
  cooling?: 'central_ac' | 'window_units' | 'none';
  heating?: 'central' | 'baseboard' | 'fireplace' | 'none';
}

export interface PropertyFeatures {
  // Interior features
  interior: string[]; // e.g., ['Hardwood Floors', 'Granite Counters', 'Stainless Appliances']
  
  // Appliances
  appliances: string[]; // e.g., ['Dishwasher', 'Refrigerator', 'Microwave']
  
  // Building amenities
  amenities: string[]; // e.g., ['Gym', 'Pool', 'Elevator', 'Doorman']
  
  // Outdoor
  outdoor: string[]; // e.g., ['Balcony', 'Patio', 'Yard', 'Garden']
  
  // Utilities & Services
  utilities: string[]; // What's included
  
  // Accessibility
  accessibility?: string[]; // e.g., ['Wheelchair Accessible', 'Elevator Access']
}

export interface PropertyMedia {
  images: PropertyImage[];
  videos?: PropertyVideo[];
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  threeDTourUrl?: string;
}

export interface PropertyVideo {
  id: string;
  url: string;
  thumbnail: string;
  title?: string;
  duration?: number;
  uploadedAt: string;
}

export interface PropertyAnalytics {
  views: number;
  favorites: number;
  contactRequests: number;
  tourRequests: number;
  applications?: number;
  daysOnMarket: number;
  viewsLast24h: number;
  viewsLast7d: number;
  viewsLast30d: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  
  // Core data
  address: PropertyAddress;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  
  // Pricing
  pricing: PropertyPricing;
  
  // Details
  details: PropertyDetails;
  features: PropertyFeatures;
  
  // Media
  media: PropertyMedia;
  
  // Availability
  availableFrom?: string;
  leaseTerm?: string; // e.g., '12 months', 'Month-to-month'
  
  // Owner/Agent
  ownerId: string;
  ownerType: OwnerType;
  agentInfo?: AgentInfo;
  
  // Analytics
  analytics: PropertyAnalytics;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;
  
  // SEO
  slug?: string;
  metaDescription?: string;
}

// Search & Filters
export interface SearchFilters {
  // Location
  location?: string; // City, zip, or address
  bounds?: MapBounds; // For map-based search
  neighborhood?: string;
  
  // Type & Status
  listingType?: ListingType;
  propertyType?: PropertyType[];
  status?: PropertyStatus[];
  
  // Price
  priceMin?: number;
  priceMax?: number;
  
  // Property specs
  bedrooms?: number;
  bedroomsMin?: number;
  bedroomsMax?: number;
  bathrooms?: number;
  bathroomsMin?: number;
  bathroomsMax?: number;
  sqftMin?: number;
  sqftMax?: number;
  
  // Features
  features?: string[];
  amenities?: string[];
  petFriendly?: boolean;
  furnished?: boolean;
  parking?: boolean;
  parkingSpaces?: number;
  
  // Availability
  availableFrom?: string;
  
  // Keywords
  keywords?: string;
  
  // Sorting
  sortBy?: SortOption;
  sortOrder?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  limit?: number;
}

export type SortOption = 
  | 'price' 
  | 'newest' 
  | 'updated' 
  | 'sqft' 
  | 'bedrooms' 
  | 'bathrooms'
  | 'relevant';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface SearchResults {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  alertsEnabled: boolean;
  createdAt: string;
  lastRun?: string;
  newResultsCount?: number;
}

// Property comparison
export interface PropertyComparison {
  properties: Property[];
  selectedIds: string[];
}

// Neighborhood data
export interface NeighborhoodInfo {
  zipCode: string;
  name: string;
  walkScore?: number;
  transitScore?: number;
  bikeScore?: number;
  medianPrice?: number;
  medianRent?: number;
  population?: number;
  crimeRate?: string; // 'low', 'medium', 'high'
  schools?: NearbySchool[];
  pointsOfInterest?: PointOfInterest[];
}

export interface NearbySchool {
  name: string;
  type: 'elementary' | 'middle' | 'high';
  rating?: number;
  distance: number; // in miles
  address: string;
}

export interface PointOfInterest {
  name: string;
  type: string; // 'restaurant', 'grocery', 'park', 'transit', etc.
  distance: number;
  rating?: number;
  address: string;
}

// Form state
export interface PropertyFormData {
  // Step 1: Basic Details
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  
  // Step 2: Location
  address: Partial<PropertyAddress>;
  
  // Step 3: Details
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: number;
  yearBuilt?: number;
  furnished: boolean;
  
  // Step 4: Pricing
  price: number;
  deposit?: number;
  applicationFee?: number;
  utilitiesIncluded?: string[];
  
  // Step 5: Features
  features: {
    interior: string[];
    appliances: string[];
    amenities: string[];
    outdoor: string[];
  };
  petPolicy: PetPolicy;
  parking: {
    spaces: number;
    type: ParkingType;
  };
  
  // Step 6: Media
  images: File[];
  videos?: File[];
  virtualTourUrl?: string;
  
  // Step 7: Availability
  availableFrom?: string;
  leaseTerm?: string;
}

// Redux state
export interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalCount: number;
  
  // Favorites
  favorites: string[]; // property IDs
  
  // Comparison
  comparison: string[]; // property IDs (max 4)
}

export interface SearchState {
  filters: SearchFilters;
  results: Property[];
  isSearching: boolean;
  error: string | null;
  
  // Saved searches
  savedSearches: SavedSearch[];
  
  // Map
  mapBounds: MapBounds | null;
  mapCenter: { lat: number; lng: number } | null;
  mapZoom: number;
}

// API responses
export interface PropertyResponse {
  property: Property;
}

export interface PropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface UploadImageResponse {
  image: PropertyImage;
}

export interface BulkUploadImagesResponse {
  images: PropertyImage[];
}