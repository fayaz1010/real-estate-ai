// FILE PATH: src/modules/properties/store/propertySlice.ts
// Module 1.2: Property Listings Management - Property Redux Slice

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { propertyService } from "../services/propertyService";
import {
  Property,
  PropertyFormData,
  PropertyState,
  SearchFilters,
} from "../types/property.types";

// Async thunks
export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
  async (filters: SearchFilters | undefined, { rejectWithValue }) => {
    try {
      return await propertyService.getProperties(filters);
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : String(error),
      );
    }
  },
);

export const fetchPropertyById = createAsyncThunk(
  "properties/fetchPropertyById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await propertyService.getPropertyById(id);
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : String(error),
      );
    }
  },
);

export const createProperty = createAsyncThunk(
  "properties/createProperty",
  async (propertyData: Partial<PropertyFormData>, { rejectWithValue }) => {
    try {
      return await propertyService.createProperty(propertyData);
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : String(error),
      );
    }
  },
);

export const updateProperty = createAsyncThunk(
  "properties/updateProperty",
  async (
    { id, updates }: { id: string; updates: Partial<Property> },
    { rejectWithValue },
  ) => {
    try {
      return await propertyService.updateProperty(id, updates);
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : String(error),
      );
    }
  },
);

export const deleteProperty = createAsyncThunk(
  "properties/deleteProperty",
  async (id: string, { rejectWithValue }) => {
    try {
      await propertyService.deleteProperty(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : String(error),
      );
    }
  },
);

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  favorites: [],
  comparison: [],
};

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload);
    },
    addToComparison: (state, action: PayloadAction<string>) => {
      if (
        state.comparison.length < 4 &&
        !state.comparison.includes(action.payload)
      ) {
        state.comparison.push(action.payload);
      }
    },
    removeFromComparison: (state, action: PayloadAction<string>) => {
      state.comparison = state.comparison.filter((id) => id !== action.payload);
    },
    clearComparison: (state) => {
      state.comparison = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch properties
    builder.addCase(fetchProperties.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProperties.fulfilled, (state, action) => {
      state.isLoading = false;
      state.properties = action.payload.properties;
      state.currentPage = action.payload.page;
      state.totalCount = action.payload.total;
      state.totalPages = Math.ceil(action.payload.total / action.payload.limit);
    });
    builder.addCase(fetchProperties.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch property by ID
    builder.addCase(fetchPropertyById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPropertyById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedProperty = action.payload;
    });
    builder.addCase(fetchPropertyById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create property
    builder.addCase(createProperty.fulfilled, (state, action) => {
      state.properties.unshift(action.payload);
      state.totalCount++;
    });

    // Update property
    builder.addCase(updateProperty.fulfilled, (state, action) => {
      const index = state.properties.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (index !== -1) {
        state.properties[index] = action.payload;
      }
      if (state.selectedProperty?.id === action.payload.id) {
        state.selectedProperty = action.payload;
      }
    });

    // Delete property
    builder.addCase(deleteProperty.fulfilled, (state, action) => {
      state.properties = state.properties.filter(
        (p) => p.id !== action.payload,
      );
      state.totalCount--;
      if (state.selectedProperty?.id === action.payload) {
        state.selectedProperty = null;
      }
    });
  },
});

export const {
  clearError,
  setSelectedProperty,
  addToFavorites,
  removeFromFavorites,
  addToComparison,
  removeFromComparison,
  clearComparison,
} = propertySlice.actions;

// Selectors
export const selectAllProperties = (state: { properties: PropertyState }) =>
  state.properties.properties;
export const selectPropertyById = (
  state: { properties: PropertyState },
  id: string,
) => state.properties.properties.find((p) => p.id === id);
export const selectSelectedProperty = (state: { properties: PropertyState }) =>
  state.properties.selectedProperty;
export const selectPropertiesLoading = (state: { properties: PropertyState }) =>
  state.properties.isLoading;
export const selectPropertiesError = (state: { properties: PropertyState }) =>
  state.properties.error;
export const selectFavorites = (state: { properties: PropertyState }) =>
  state.properties.favorites;
export const selectComparison = (state: { properties: PropertyState }) =>
  state.properties.comparison;
export const selectPagination = (state: { properties: PropertyState }) => ({
  currentPage: state.properties.currentPage,
  totalPages: state.properties.totalPages,
  totalCount: state.properties.totalCount,
});

export default propertySlice.reducer;
