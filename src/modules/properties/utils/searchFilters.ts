// FILE PATH: src/modules/properties/utils/searchFilters.ts
// Module 1.2: Property Listings Management - Search Filter Utilities

import { Property, SearchFilters, MapBounds } from '../types/property.types';

export const searchFilterUtils = {
  /**
   * Apply all filters to property list
   */
  applyFilters: (properties: Property[], filters: SearchFilters): Property[] => {
    return properties.filter(property => {
      // Listing type filter
      if (filters.listingType && property.listingType !== filters.listingType) {
        return false;
      }

      // Property type filter
      if (filters.propertyType && filters.propertyType.length > 0) {
        if (!filters.propertyType.includes(property.propertyType)) {
          return false;
        }
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(property.status)) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceMin && property.pricing.price < filters.priceMin) {
        return false;
      }
      if (filters.priceMax && property.pricing.price > filters.priceMax) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms && property.details.bedrooms !== filters.bedrooms) {
        return false;
      }
      if (filters.bedroomsMin && property.details.bedrooms < filters.bedroomsMin) {
        return false;
      }
      if (filters.bedroomsMax && property.details.bedrooms > filters.bedroomsMax) {
        return false;
      }

      // Bathrooms filter
      if (filters.bathrooms && property.details.bathrooms !== filters.bathrooms) {
        return false;
      }
      if (filters.bathroomsMin && property.details.bathrooms < filters.bathroomsMin) {
        return false;
      }
      if (filters.bathroomsMax && property.details.bathrooms > filters.bathroomsMax) {
        return false;
      }

      // Square footage filter
      if (filters.sqftMin && property.details.sqft < filters.sqftMin) {
        return false;
      }
      if (filters.sqftMax && property.details.sqft > filters.sqftMax) {
        return false;
      }

      // Pet friendly filter
      if (filters.petFriendly && property.details.petPolicy === 'not_allowed') {
        return false;
      }

      // Furnished filter
      if (filters.furnished !== undefined && property.details.furnished !== filters.furnished) {
        return false;
      }

      // Parking filter
      if (filters.parking && property.details.parking.spaces === 0) {
        return false;
      }
      if (filters.parkingSpaces && property.details.parking.spaces < filters.parkingSpaces) {
        return false;
      }

      // Features filter
      if (filters.features && filters.features.length > 0) {
        const propertyFeatures = [
          ...property.features.interior,
          ...property.features.appliances,
          ...property.features.amenities,
          ...property.features.outdoor
        ];
        const hasAllFeatures = filters.features.every(feature =>
          propertyFeatures.includes(feature)
        );
        if (!hasAllFeatures) return false;
      }

      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          property.features.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      // Location filter (text search)
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        const matchesLocation = 
          property.address.city.toLowerCase().includes(locationLower) ||
          property.address.state.toLowerCase().includes(locationLower) ||
          property.address.zipCode.includes(locationLower) ||
          (property.address.neighborhood?.toLowerCase().includes(locationLower) || false);
        if (!matchesLocation) return false;
      }

      // Neighborhood filter
      if (filters.neighborhood) {
        if (property.address.neighborhood !== filters.neighborhood) {
          return false;
        }
      }

      // Map bounds filter
      if (filters.bounds) {
        if (!searchFilterUtils.isInBounds(property.address.latitude, property.address.longitude, filters.bounds)) {
          return false;
        }
      }

      // Available from filter
      if (filters.availableFrom) {
        if (!property.availableFrom) return false;
        const propertyDate = new Date(property.availableFrom);
        const filterDate = new Date(filters.availableFrom);
        if (propertyDate > filterDate) return false;
      }

      // Keywords filter (search in title and description)
      if (filters.keywords) {
        const keywordsLower = filters.keywords.toLowerCase();
        const matchesKeywords = 
          property.title.toLowerCase().includes(keywordsLower) ||
          property.description.toLowerCase().includes(keywordsLower);
        if (!matchesKeywords) return false;
      }

      return true;
    });
  },

  /**
   * Check if coordinates are within map bounds
   */
  isInBounds: (lat: number, lng: number, bounds: MapBounds): boolean => {
    return (
      lat >= bounds.south &&
      lat <= bounds.north &&
      lng >= bounds.west &&
      lng <= bounds.east
    );
  },

  /**
   * Sort properties based on sort option
   */
  sortProperties: (
    properties: Property[],
    sortBy: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Property[] => {
    const sorted = [...properties].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'price':
          comparison = a.pricing.price - b.pricing.price;
          break;
        case 'newest':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'updated':
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case 'sqft':
          comparison = a.details.sqft - b.details.sqft;
          break;
        case 'bedrooms':
          comparison = a.details.bedrooms - b.details.bedrooms;
          break;
        case 'bathrooms':
          comparison = a.details.bathrooms - b.details.bathrooms;
          break;
        case 'relevant':
          // Relevance based on views and favorites
          const scoreA = a.analytics.views + (a.analytics.favorites * 5);
          const scoreB = b.analytics.views + (b.analytics.favorites * 5);
          comparison = scoreB - scoreA;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return sorted;
  },

  /**
   * Get active filter count
   */
  getActiveFilterCount: (filters: SearchFilters): number => {
    let count = 0;

    if (filters.location) count++;
    if (filters.listingType) count++;
    if (filters.propertyType && filters.propertyType.length > 0) count++;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.bedrooms || filters.bedroomsMin || filters.bedroomsMax) count++;
    if (filters.bathrooms || filters.bathroomsMin || filters.bathroomsMax) count++;
    if (filters.sqftMin || filters.sqftMax) count++;
    if (filters.features && filters.features.length > 0) count += filters.features.length;
    if (filters.amenities && filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.petFriendly) count++;
    if (filters.furnished !== undefined) count++;
    if (filters.parking) count++;
    if (filters.availableFrom) count++;

    return count;
  },

  /**
   * Clear all filters
   */
  clearFilters: (): SearchFilters => {
    return {
      sortBy: 'relevant',
      sortOrder: 'desc',
      page: 1,
      limit: 20
    };
  },

  /**
   * Build query string from filters
   */
  filtersToQueryString: (filters: SearchFilters): string => {
    const params = new URLSearchParams();

    if (filters.location) params.append('location', filters.location);
    if (filters.listingType) params.append('listingType', filters.listingType);
    if (filters.propertyType) {
      filters.propertyType.forEach(type => params.append('propertyType', type));
    }
    if (filters.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters.priceMax) params.append('priceMax', filters.priceMax.toString());
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString());
    if (filters.sqftMin) params.append('sqftMin', filters.sqftMin.toString());
    if (filters.sqftMax) params.append('sqftMax', filters.sqftMax.toString());
    if (filters.petFriendly) params.append('petFriendly', 'true');
    if (filters.furnished !== undefined) params.append('furnished', filters.furnished.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    return params.toString();
  },

  /**
   * Parse query string to filters
   */
  queryStringToFilters: (queryString: string): SearchFilters => {
    const params = new URLSearchParams(queryString);
    const filters: SearchFilters = {};

    if (params.has('location')) filters.location = params.get('location')!;
    if (params.has('listingType')) filters.listingType = params.get('listingType') as any;
    if (params.has('propertyType')) {
      filters.propertyType = params.getAll('propertyType') as any[];
    }
    if (params.has('priceMin')) filters.priceMin = Number(params.get('priceMin'));
    if (params.has('priceMax')) filters.priceMax = Number(params.get('priceMax'));
    if (params.has('bedrooms')) filters.bedrooms = Number(params.get('bedrooms'));
    if (params.has('bathrooms')) filters.bathrooms = Number(params.get('bathrooms'));
    if (params.has('sqftMin')) filters.sqftMin = Number(params.get('sqftMin'));
    if (params.has('sqftMax')) filters.sqftMax = Number(params.get('sqftMax'));
    if (params.has('petFriendly')) filters.petFriendly = params.get('petFriendly') === 'true';
    if (params.has('furnished')) filters.furnished = params.get('furnished') === 'true';
    if (params.has('sortBy')) filters.sortBy = params.get('sortBy') as any;
    if (params.has('sortOrder')) filters.sortOrder = params.get('sortOrder') as any;
    if (params.has('page')) filters.page = Number(params.get('page'));
    if (params.has('limit')) filters.limit = Number(params.get('limit'));

    return filters;
  },

  /**
   * Get price range suggestions
   */
  getPriceRangeSuggestions: (listingType: 'rent' | 'sale'): Array<{ label: string; min?: number; max?: number }> => {
    if (listingType === 'rent') {
      return [
        { label: 'Under $1,000', max: 1000 },
        { label: '$1,000 - $1,500', min: 1000, max: 1500 },
        { label: '$1,500 - $2,000', min: 1500, max: 2000 },
        { label: '$2,000 - $2,500', min: 2000, max: 2500 },
        { label: '$2,500 - $3,000', min: 2500, max: 3000 },
        { label: '$3,000+', min: 3000 }
      ];
    } else {
      return [
        { label: 'Under $200K', max: 200000 },
        { label: '$200K - $400K', min: 200000, max: 400000 },
        { label: '$400K - $600K', min: 400000, max: 600000 },
        { label: '$600K - $800K', min: 600000, max: 800000 },
        { label: '$800K - $1M', min: 800000, max: 1000000 },
        { label: '$1M+', min: 1000000 }
      ];
    }
  },

  /**
   * Get common feature options
   */
  getFeatureOptions: (): string[] => {
    return [
      'Hardwood Floors',
      'Granite Counters',
      'Stainless Steel Appliances',
      'Walk-in Closet',
      'High Ceilings',
      'Fireplace',
      'Central AC',
      'In-unit Laundry',
      'Dishwasher',
      'Balcony',
      'Patio',
      'Yard',
      'Pool',
      'Gym',
      'Parking',
      'Elevator',
      'Doorman',
      'Pet Friendly',
      'Furnished'
    ];
  },

  /**
   * Calculate distance between two coordinates (in miles)
   */
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
};