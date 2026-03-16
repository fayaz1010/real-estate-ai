// ============================================================================
// FILE PATH: src/modules/properties/services/searchService.ts
// Module 1.2: Property Listings Management - Search Service
// ============================================================================

import { SearchFilters, PropertiesResponse, SavedSearch } from '../types/property.types';
import { tokenManager } from '../../auth/utils/tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4041/api';

class SearchService {
  /**
   * Search properties with filters
   */
  async searchProperties(filters: SearchFilters): Promise<PropertiesResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/properties/search?${queryParams.toString()}`,
      {
        headers: tokenManager.getAuthHeader()
      }
    );

    if (!response.ok) {
      throw new Error('Search failed');
    }

    return response.json();
  }

  /**
   * Save search
   */
  async saveSearch(name: string, filters: SearchFilters, alertsEnabled: boolean = false): Promise<SavedSearch> {
    const response = await fetch(`${API_BASE_URL}/properties/search/save`, {
      method: 'POST',
      headers: {
        ...tokenManager.getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, filters, alertsEnabled })
    });

    if (!response.ok) {
      throw new Error('Failed to save search');
    }

    const data = await response.json();
    return data.savedSearch;
  }

  /**
   * Get saved searches
   */
  async getSavedSearches(): Promise<SavedSearch[]> {
    const response = await fetch(`${API_BASE_URL}/properties/search/saved`, {
      headers: tokenManager.getAuthHeader()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saved searches');
    }

    const data = await response.json();
    return data.savedSearches;
  }

  /**
   * Delete saved search
   */
  async deleteSavedSearch(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/properties/search/saved/${id}`, {
      method: 'DELETE',
      headers: tokenManager.getAuthHeader()
    });

    if (!response.ok) {
      throw new Error('Failed to delete saved search');
    }
  }

  /**
   * Update saved search
   */
  async updateSavedSearch(id: string, updates: Partial<SavedSearch>): Promise<SavedSearch> {
    const response = await fetch(`${API_BASE_URL}/properties/search/saved/${id}`, {
      method: 'PATCH',
      headers: {
        ...tokenManager.getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update saved search');
    }

    const data = await response.json();
    return data.savedSearch;
  }

  /**
   * Get autocomplete suggestions for location
   */
  async getLocationSuggestions(query: string): Promise<string[]> {
    const response = await fetch(
      `${API_BASE_URL}/properties/search/autocomplete?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.suggestions;
  }
}

export const searchService = new SearchService();
