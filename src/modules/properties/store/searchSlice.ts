// ============================================================================
// FILE PATH: src/modules/properties/store/searchSlice.ts
// Module 1.2: Property Listings Management - Search Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { searchService } from "../services/searchService";
import {
  SearchState,
  SearchFilters,
  SavedSearch,
  Property,
  SortOption,
} from "../types/property.types";

// Async thunks
export const searchProperties = createAsyncThunk(
  "search/searchProperties",
  async (filters: SearchFilters, { rejectWithValue }) => {
    try {
      return await searchService.searchProperties(filters);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const saveSearch = createAsyncThunk(
  "search/saveSearch",
  async (
    {
      name,
      filters,
      alertsEnabled,
    }: { name: string; filters: SearchFilters; alertsEnabled: boolean },
    { rejectWithValue },
  ) => {
    try {
      return await searchService.saveSearch(name, filters, alertsEnabled);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchSavedSearches = createAsyncThunk(
  "search/fetchSavedSearches",
  async (_, { rejectWithValue }) => {
    try {
      return await searchService.getSavedSearches();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteSavedSearch = createAsyncThunk(
  "search/deleteSavedSearch",
  async (id: string, { rejectWithValue }) => {
    try {
      await searchService.deleteSavedSearch(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState: SearchState = {
  filters: {
    page: 1,
    limit: 20,
    sortBy: "relevant",
    sortOrder: "desc",
  },
  results: [],
  isSearching: false,
  error: null,
  savedSearches: [],
  mapBounds: null,
  mapCenter: null,
  mapZoom: 12,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters = { ...state.filters, keywords: action.payload };
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.filters = { ...state.filters, sortBy: action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
        sortBy: "relevant",
        sortOrder: "desc",
      };
    },
    setMapBounds: (state, action) => {
      state.mapBounds = action.payload;
    },
    setMapCenter: (state, action) => {
      state.mapCenter = action.payload;
    },
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.mapZoom = action.payload;
    },
    clearSearchError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Search properties
    builder.addCase(searchProperties.pending, (state) => {
      state.isSearching = true;
    });
    builder.addCase(searchProperties.fulfilled, (state, action) => {
      state.isSearching = false;
      state.results = action.payload.properties;
    });
    builder.addCase(searchProperties.rejected, (state, action) => {
      state.isSearching = false;
      state.error = action.payload as string;
    });

    // Save search
    builder.addCase(saveSearch.fulfilled, (state, action) => {
      state.savedSearches.push(action.payload);
    });

    // Fetch saved searches
    builder.addCase(fetchSavedSearches.fulfilled, (state, action) => {
      state.savedSearches = action.payload;
    });

    // Delete saved search
    builder.addCase(deleteSavedSearch.fulfilled, (state, action) => {
      state.savedSearches = state.savedSearches.filter(
        (s) => s.id !== action.payload,
      );
    });
  },
});

export const {
  setFilters,
  setSearchQuery,
  setSortBy,
  clearFilters,
  setMapBounds,
  setMapCenter,
  setMapZoom,
  clearSearchError,
} = searchSlice.actions;

// Selectors
export const selectSearchFilters = (state: { search: SearchState }) =>
  state.search.filters;
export const selectSearchQuery = (state: { search: SearchState }) =>
  state.search.filters.keywords || "";
export const selectSortBy = (state: { search: SearchState }) =>
  state.search.filters.sortBy || "relevant";
export const selectSearchResults = (state: { search: SearchState }) =>
  state.search.results;
export const selectFilteredProperties = (state: { search: SearchState }) =>
  state.search.results;
export const selectIsSearching = (state: { search: SearchState }) =>
  state.search.isSearching;
export const selectSearchError = (state: { search: SearchState }) =>
  state.search.error;
export const selectSavedSearches = (state: { search: SearchState }) =>
  state.search.savedSearches;
export const selectMapBounds = (state: { search: SearchState }) =>
  state.search.mapBounds;
export const selectMapCenter = (state: { search: SearchState }) =>
  state.search.mapCenter;
export const selectMapZoom = (state: { search: SearchState }) =>
  state.search.mapZoom;

export default searchSlice.reducer;
