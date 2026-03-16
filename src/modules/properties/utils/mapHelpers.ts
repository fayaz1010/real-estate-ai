// FILE PATH: src/modules/properties/utils/mapHelpers.ts
// Module 1.2: Property Listings Management - Map Helper Utilities

import { Property, MapBounds } from "../types/property.types";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  price: number;
  propertyType: string;
  status: string;
}

export interface MarkerCluster {
  lat: number;
  lng: number;
  count: number;
  properties: Property[];
}

export const mapHelpers = {
  /**
   * Get bounds from property list
   */
  getBoundsFromProperties: (properties: Property[]): MapBounds | null => {
    if (properties.length === 0) return null;

    let north = -90;
    let south = 90;
    let east = -180;
    let west = 180;

    properties.forEach((property) => {
      const { latitude, longitude } = property.address;
      if (latitude > north) north = latitude;
      if (latitude < south) south = latitude;
      if (longitude > east) east = longitude;
      if (longitude < west) west = longitude;
    });

    // Add padding (10%)
    const latPadding = (north - south) * 0.1;
    const lngPadding = (east - west) * 0.1;

    return {
      north: north + latPadding,
      south: south - latPadding,
      east: east + lngPadding,
      west: west - lngPadding,
    };
  },

  /**
   * Get center point from bounds
   */
  getCenterFromBounds: (bounds: MapBounds): { lat: number; lng: number } => {
    return {
      lat: (bounds.north + bounds.south) / 2,
      lng: (bounds.east + bounds.west) / 2,
    };
  },

  /**
   * Calculate appropriate zoom level based on bounds
   */
  getZoomFromBounds: (bounds: MapBounds): number => {
    const latDiff = bounds.north - bounds.south;
    const lngDiff = bounds.east - bounds.west;
    const maxDiff = Math.max(latDiff, lngDiff);

    // Approximate zoom levels
    if (maxDiff > 10) return 5;
    if (maxDiff > 5) return 6;
    if (maxDiff > 2) return 7;
    if (maxDiff > 1) return 8;
    if (maxDiff > 0.5) return 9;
    if (maxDiff > 0.2) return 10;
    if (maxDiff > 0.1) return 11;
    if (maxDiff > 0.05) return 12;
    if (maxDiff > 0.02) return 13;
    if (maxDiff > 0.01) return 14;
    return 15;
  },

  /**
   * Convert properties to map markers
   */
  propertiesToMarkers: (properties: Property[]): MapMarker[] => {
    return properties.map((property) => ({
      id: property.id,
      lat: property.address.latitude,
      lng: property.address.longitude,
      price: property.pricing.price,
      propertyType: property.propertyType,
      status: property.status,
    }));
  },

  /**
   * Cluster nearby markers
   */
  clusterMarkers: (
    properties: Property[],
    zoomLevel: number,
    clusterRadius: number = 40,
  ): MarkerCluster[] => {
    // Don't cluster at high zoom levels
    if (zoomLevel >= 14) {
      return properties.map((p) => ({
        lat: p.address.latitude,
        lng: p.address.longitude,
        count: 1,
        properties: [p],
      }));
    }

    const clusters: MarkerCluster[] = [];
    const processed = new Set<string>();

    properties.forEach((property) => {
      if (processed.has(property.id)) return;

      const cluster: MarkerCluster = {
        lat: property.address.latitude,
        lng: property.address.longitude,
        count: 1,
        properties: [property],
      };

      processed.add(property.id);

      // Find nearby properties
      properties.forEach((otherProperty) => {
        if (processed.has(otherProperty.id)) return;

        const distance = mapHelpers.calculatePixelDistance(
          property.address.latitude,
          property.address.longitude,
          otherProperty.address.latitude,
          otherProperty.address.longitude,
          zoomLevel,
        );

        if (distance < clusterRadius) {
          cluster.properties.push(otherProperty);
          cluster.count++;
          processed.add(otherProperty.id);

          // Update cluster center (average position)
          cluster.lat =
            cluster.properties.reduce((sum, p) => sum + p.address.latitude, 0) /
            cluster.count;
          cluster.lng =
            cluster.properties.reduce(
              (sum, p) => sum + p.address.longitude,
              0,
            ) / cluster.count;
        }
      });

      clusters.push(cluster);
    });

    return clusters;
  },

  /**
   * Calculate pixel distance between two points at given zoom
   */
  calculatePixelDistance: (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
    zoom: number,
  ): number => {
    const scale = 256 * Math.pow(2, zoom);
    const x1 = ((lng1 + 180) / 360) * scale;
    const y1 =
      ((1 -
        Math.log(
          Math.tan((lat1 * Math.PI) / 180) +
            1 / Math.cos((lat1 * Math.PI) / 180),
        ) /
          Math.PI) /
        2) *
      scale;
    const x2 = ((lng2 + 180) / 360) * scale;
    const y2 =
      ((1 -
        Math.log(
          Math.tan((lat2 * Math.PI) / 180) +
            1 / Math.cos((lat2 * Math.PI) / 180),
        ) /
          Math.PI) /
        2) *
      scale;

    const dx = x2 - x1;
    const dy = y2 - y1;

    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Get marker color based on property type
   */
  getMarkerColor: (propertyType: string): string => {
    const colors: Record<string, string> = {
      apartment: "#3B82F6", // blue
      house: "#10B981", // green
      condo: "#8B5CF6", // purple
      townhouse: "#F59E0B", // amber
      studio: "#EC4899", // pink
      commercial: "#6B7280", // gray
      land: "#84CC16", // lime
    };

    return colors[propertyType] || "#3B82F6";
  },

  /**
   * Get marker icon based on status
   */
  getMarkerIcon: (status: string): string => {
    const icons: Record<string, string> = {
      available: "🏠",
      pending: "⏳",
      rented: "✓",
      sold: "✓",
      off_market: "🚫",
    };

    return icons[status] || "🏠";
  },

  /**
   * Format address for display
   */
  formatAddress: (
    street: string,
    unit?: string,
    city?: string,
    state?: string,
    zipCode?: string,
  ): string => {
    const parts = [street];
    if (unit) parts[0] += ` ${unit}`;
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (zipCode) parts.push(zipCode);
    return parts.join(", ");
  },

  /**
   * Geocode address (placeholder - would use Google Maps API)
   */
  geocodeAddress: async (
    address: string,
  ): Promise<{ lat: number; lng: number } | null> => {
    // This would integrate with Google Maps Geocoding API or similar
    // For now, return null as placeholder
    console.log("Geocoding address:", address);
    return null;
  },

  /**
   * Reverse geocode coordinates (placeholder)
   */
  reverseGeocode: async (lat: number, lng: number): Promise<string | null> => {
    // This would integrate with Google Maps Reverse Geocoding API
    console.log("Reverse geocoding:", lat, lng);
    return null;
  },

  /**
   * Get Street View URL
   */
  getStreetViewUrl: (
    lat: number,
    lng: number,
    heading: number = 0,
    pitch: number = 0,
  ): string => {
    return `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&heading=${heading}&pitch=${pitch}&key=YOUR_API_KEY`;
  },

  /**
   * Get static map image URL
   */
  getStaticMapUrl: (
    lat: number,
    lng: number,
    zoom: number = 14,
    width: number = 400,
    height: number = 300,
  ): string => {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY`;
  },

  /**
   * Calculate bounds from center and radius
   */
  getBoundsFromRadius: (
    centerLat: number,
    centerLng: number,
    radiusMiles: number,
  ): MapBounds => {
    const latDegree = radiusMiles / 69; // 1 degree latitude ≈ 69 miles
    const lngDegree =
      radiusMiles / (69 * Math.cos((centerLat * Math.PI) / 180));

    return {
      north: centerLat + latDegree,
      south: centerLat - latDegree,
      east: centerLng + lngDegree,
      west: centerLng - lngDegree,
    };
  },

  /**
   * Check if bounds are valid
   */
  isValidBounds: (bounds: MapBounds): boolean => {
    return (
      bounds.north > bounds.south &&
      bounds.east > bounds.west &&
      bounds.north <= 90 &&
      bounds.south >= -90 &&
      bounds.east <= 180 &&
      bounds.west >= -180
    );
  },

  /**
   * Expand bounds to include a point
   */
  expandBoundsToIncludePoint: (
    bounds: MapBounds,
    lat: number,
    lng: number,
  ): MapBounds => {
    return {
      north: Math.max(bounds.north, lat),
      south: Math.min(bounds.south, lat),
      east: Math.max(bounds.east, lng),
      west: Math.min(bounds.west, lng),
    };
  },

  /**
   * Get map style presets
   */
  getMapStyles: () => {
    return {
      standard: [],
      silver: [
        { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
      ],
      night: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      ],
      retro: [
        { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
      ],
    };
  },
};
