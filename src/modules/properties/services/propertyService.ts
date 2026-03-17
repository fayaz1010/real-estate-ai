// FILE PATH: src/modules/properties/services/propertyService.ts
// Module 1.2: Property Listings Management - Property Service

import apiClient from "@/api/client";
import {
  Property,
  PropertyFormData,
  PropertiesResponse,
  PropertyResponse,
  SearchFilters,
} from "../types/property.types";

class PropertyService {
  /**
   * Get all properties with optional filters
   */
  async getProperties(filters?: SearchFilters): Promise<PropertiesResponse> {
    const params: Record<string, string | string[]> = {};

    if (filters) {
      if (filters.location) params.location = filters.location;
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.priceMin) params.priceMin = filters.priceMin.toString();
      if (filters.priceMax) params.priceMax = filters.priceMax.toString();
      if (filters.bedrooms) params.bedrooms = filters.bedrooms.toString();
      if (filters.bathrooms) params.bathrooms = filters.bathrooms.toString();
      if (filters.page) params.page = filters.page.toString();
      if (filters.limit) params.limit = filters.limit.toString();
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    }

    const response = await apiClient.get<PropertiesResponse>("/properties", {
      params,
    });
    return response.data;
  }

  /**
   * Get single property by ID
   */
  async getPropertyById(id: string): Promise<Property> {
    const response = await apiClient.get<PropertyResponse>(
      `/properties/${id}`,
    );
    return response.data.property;
  }

  /**
   * Get property by slug
   */
  async getPropertyBySlug(slug: string): Promise<Property> {
    const response = await apiClient.get<PropertyResponse>(
      `/properties/slug/${slug}`,
    );
    return response.data.property;
  }

  /**
   * Create new property
   */
  async createProperty(
    propertyData: Partial<PropertyFormData>,
  ): Promise<Property> {
    const response = await apiClient.post<PropertyResponse>(
      "/properties",
      propertyData,
    );
    return response.data.property;
  }

  /**
   * Update property
   */
  async updateProperty(
    id: string,
    updates: Partial<Property>,
  ): Promise<Property> {
    const response = await apiClient.patch<PropertyResponse>(
      `/properties/${id}`,
      updates,
    );
    return response.data.property;
  }

  /**
   * Delete property
   */
  async deleteProperty(id: string): Promise<void> {
    await apiClient.delete(`/properties/${id}`);
  }

  /**
   * Publish property
   */
  async publishProperty(id: string): Promise<Property> {
    const response = await apiClient.post<PropertyResponse>(
      `/properties/${id}/publish`,
    );
    return response.data.property;
  }

  /**
   * Unpublish property
   */
  async unpublishProperty(id: string): Promise<Property> {
    const response = await apiClient.post<PropertyResponse>(
      `/properties/${id}/unpublish`,
    );
    return response.data.property;
  }

  /**
   * Track property view
   */
  async trackView(id: string): Promise<void> {
    await apiClient.post(`/properties/${id}/view`);
  }

  /**
   * Get property analytics
   */
  async getPropertyAnalytics(id: string): Promise<any> {
    const response = await apiClient.get(`/properties/${id}/analytics`);
    return response.data;
  }

  /**
   * Get similar properties
   */
  async getSimilarProperties(
    id: string,
    limit: number = 6,
  ): Promise<Property[]> {
    const response = await apiClient.get(`/properties/${id}/similar`, {
      params: { limit },
    });
    return response.data.properties;
  }

  /**
   * Get user's properties
   */
  async getMyProperties(
    page: number = 1,
    limit: number = 20,
  ): Promise<PropertiesResponse> {
    const response = await apiClient.get<PropertiesResponse>(
      "/properties/my-properties",
      { params: { page, limit } },
    );
    return response.data;
  }

  /**
   * Get featured properties
   */
  async getFeaturedProperties(limit: number = 10): Promise<Property[]> {
    const response = await apiClient.get("/properties/featured", {
      params: { limit },
    });
    return response.data.properties;
  }

  /**
   * Contact property owner
   */
  async contactOwner(
    propertyId: string,
    message: {
      name: string;
      email: string;
      phone?: string;
      message: string;
    },
  ): Promise<void> {
    await apiClient.post(`/properties/${propertyId}/contact`, message);
  }

  /**
   * Schedule property tour
   */
  async scheduleTour(
    propertyId: string,
    tourData: {
      date: string;
      time: string;
      name: string;
      email: string;
      phone: string;
      message?: string;
    },
  ): Promise<void> {
    await apiClient.post(
      `/properties/${propertyId}/schedule-tour`,
      tourData,
    );
  }
}

export const propertyService = new PropertyService();
