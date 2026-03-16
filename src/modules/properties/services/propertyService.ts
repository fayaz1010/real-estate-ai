// FILE PATH: src/modules/properties/services/propertyService.ts
// Module 1.2: Property Listings Management - Property Service

import { tokenManager } from "../../auth/utils/tokenManager";
import {
  Property,
  PropertyFormData,
  PropertiesResponse,
  PropertyResponse,
  SearchFilters,
} from "../types/property.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4041/api";

class PropertyService {
  /**
   * Get all properties with optional filters
   */
  async getProperties(filters?: SearchFilters): Promise<PropertiesResponse> {
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.location) queryParams.append("location", filters.location);
      if (filters.listingType)
        queryParams.append("listingType", filters.listingType);
      if (filters.propertyType) {
        filters.propertyType.forEach((type) =>
          queryParams.append("propertyType", type),
        );
      }
      if (filters.priceMin)
        queryParams.append("priceMin", filters.priceMin.toString());
      if (filters.priceMax)
        queryParams.append("priceMax", filters.priceMax.toString());
      if (filters.bedrooms)
        queryParams.append("bedrooms", filters.bedrooms.toString());
      if (filters.bathrooms)
        queryParams.append("bathrooms", filters.bathrooms.toString());
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.limit) queryParams.append("limit", filters.limit.toString());
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
    }

    const response = await fetch(
      `${API_BASE_URL}/properties?${queryParams.toString()}`,
      {
        headers: tokenManager.getAuthHeader(),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    return response.json();
  }

  /**
   * Get single property by ID
   */
  async getPropertyById(id: string): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      headers: tokenManager.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Property not found");
    }

    const data: PropertyResponse = await response.json();
    return data.property;
  }

  /**
   * Get property by slug
   */
  async getPropertyBySlug(slug: string): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties/slug/${slug}`, {
      headers: tokenManager.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Property not found");
    }

    const data: PropertyResponse = await response.json();
    return data.property;
  }

  /**
   * Create new property
   */
  async createProperty(
    propertyData: Partial<PropertyFormData>,
  ): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: "POST",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create property");
    }

    const data: PropertyResponse = await response.json();
    return data.property;
  }

  /**
   * Update property
   */
  async updateProperty(
    id: string,
    updates: Partial<Property>,
  ): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: "PATCH",
      headers: {
        ...tokenManager.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update property");
    }

    const data: PropertyResponse = await response.json();
    return data.property;
  }

  /**
   * Delete property
   */
  async deleteProperty(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: "DELETE",
      headers: tokenManager.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete property");
    }
  }

  /**
   * Publish property
   */
  async publishProperty(id: string): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}/publish`, {
      method: "POST",
      headers: tokenManager.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to publish property");
    }

    const data: PropertyResponse = await response.json();
    return data.property;
  }

  /**
   * Unpublish property
   */
  async unpublishProperty(id: string): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}/unpublish`, {
      method: "POST",
      headers: tokenManager.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to unpublish property");
    }

    const data: PropertyResponse = await response.json();
    return data.property;
  }

  /**
   * Track property view
   */
  async trackView(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/properties/${id}/view`, {
      method: "POST",
      headers: tokenManager.getAuthHeader(),
    });
  }

  /**
   * Get property analytics
   */
  async getPropertyAnalytics(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}/analytics`, {
      headers: tokenManager.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch analytics");
    }

    return response.json();
  }

  /**
   * Get similar properties
   */
  async getSimilarProperties(
    id: string,
    limit: number = 6,
  ): Promise<Property[]> {
    const response = await fetch(
      `${API_BASE_URL}/properties/${id}/similar?limit=${limit}`,
      {
        headers: tokenManager.getAuthHeader(),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch similar properties");
    }

    const data = await response.json();
    return data.properties;
  }

  /**
   * Get user's properties
   */
  async getMyProperties(
    page: number = 1,
    limit: number = 20,
  ): Promise<PropertiesResponse> {
    const response = await fetch(
      `${API_BASE_URL}/properties/my-properties?page=${page}&limit=${limit}`,
      {
        headers: tokenManager.getAuthHeader(),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch your properties");
    }

    return response.json();
  }

  /**
   * Get featured properties
   */
  async getFeaturedProperties(limit: number = 10): Promise<Property[]> {
    const response = await fetch(
      `${API_BASE_URL}/properties/featured?limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured properties");
    }

    const data = await response.json();
    return data.properties;
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
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/contact`,
      {
        method: "POST",
        headers: {
          ...tokenManager.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send message");
    }
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
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/schedule-tour`,
      {
        method: "POST",
        headers: {
          ...tokenManager.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tourData),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to schedule tour");
    }
  }
}

export const propertyService = new PropertyService();
