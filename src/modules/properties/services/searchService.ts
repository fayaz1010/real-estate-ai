import apiClient from "@/api/client";
import {
  SearchFilters,
  PropertiesResponse,
  SavedSearch,
} from "../types/property.types";

class SearchService {
  async searchProperties(filters: SearchFilters): Promise<PropertiesResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    const { data } = await apiClient.get<PropertiesResponse>(
      `/properties/search?${queryParams.toString()}`,
    );
    return data;
  }

  async saveSearch(name: string, filters: SearchFilters, alertsEnabled: boolean = false): Promise<SavedSearch> {
    const { data } = await apiClient.post<{ savedSearch: SavedSearch }>(
      "/properties/search/save",
      { name, filters, alertsEnabled },
    );
    return data.savedSearch;
  }

  async getSavedSearches(): Promise<SavedSearch[]> {
    const { data } = await apiClient.get<{ savedSearches: SavedSearch[] }>("/properties/search/saved");
    return data.savedSearches;
  }

  async deleteSavedSearch(id: string): Promise<void> {
    await apiClient.delete(`/properties/search/saved/${id}`);
  }

  async updateSavedSearch(id: string, updates: Partial<SavedSearch>): Promise<SavedSearch> {
    const { data } = await apiClient.patch<{ savedSearch: SavedSearch }>(
      `/properties/search/saved/${id}`,
      updates,
    );
    return data.savedSearch;
  }

  async getLocationSuggestions(query: string): Promise<string[]> {
    try {
      const { data } = await apiClient.get<{ suggestions: string[] }>(
        `/properties/search/autocomplete?query=${encodeURIComponent(query)}`,
      );
      return data.suggestions;
    } catch {
      return [];
    }
  }
}

export const searchService = new SearchService();
