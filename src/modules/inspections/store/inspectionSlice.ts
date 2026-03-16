// ============================================================================
// FILE PATH: src/modules/inspections/store/inspectionSlice.ts
// Module 1.3: Inspection Booking & Scheduling System - Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { inspectionService } from "../services/inspectionService";
import {
  Inspection,
  InspectionState,
  InspectionBookingRequest,
  InspectionStatus,
  AvailabilitySlot,
} from "../types/inspection.types";

// ============================================================================
// ASYNC THUNKS
// ============================================================================

export const fetchInspections = createAsyncThunk(
  "inspections/fetchInspections",
  async (params: {
    landlordId?: string;
    propertyId?: string;
    status?: InspectionStatus;
    page?: number;
    limit?: number;
  }) => {
    const response = await inspectionService.getInspections(params);
    return response;
  },
);

export const createInspection = createAsyncThunk(
  "inspections/createInspection",
  async (bookingRequest: InspectionBookingRequest) => {
    const response = await inspectionService.requestInspection(bookingRequest);
    return response;
  },
);

export const updateInspectionStatus = createAsyncThunk(
  "inspections/updateStatus",
  async ({
    id,
    status,
    notes,
  }: {
    id: string;
    status: InspectionStatus;
    notes?: string;
  }) => {
    const response = await inspectionService.updateInspection(id, {
      status,
      landlordNotes: notes,
    });
    return response;
  },
);

export const cancelInspection = createAsyncThunk(
  "inspections/cancelInspection",
  async ({ id, reason }: { id: string; reason: string }) => {
    const response = await inspectionService.cancelInspection(id, reason);
    return response;
  },
);

export const rescheduleInspection = createAsyncThunk(
  "inspections/rescheduleInspection",
  async ({
    id,
    newDate,
    newTime,
    reason,
  }: {
    id: string;
    newDate: string;
    newTime: string;
    reason?: string;
  }) => {
    const response = await inspectionService.rescheduleInspection(
      id,
      newDate,
      newTime,
      reason,
    );
    return response;
  },
);

export const fetchAvailableSlots = createAsyncThunk(
  "inspections/fetchAvailableSlots",
  async (params: {
    propertyId: string;
    startDate: string;
    endDate: string;
    inspectionType?: string;
  }) => {
    const response = await inspectionService.getAvailableSlots(
      params.propertyId,
      params.startDate,
    );
    return response;
  },
);

export const checkInInspection = createAsyncThunk(
  "inspections/checkInInspection",
  async ({
    id,
    location,
    photo,
  }: {
    id: string;
    location: { lat: number; lng: number };
    photo?: string;
  }) => {
    const response = await inspectionService.checkInInspection(id, {
      location,
      photo,
    });
    return response;
  },
);

export const checkOutInspection = createAsyncThunk(
  "inspections/checkOutInspection",
  async ({
    id,
    feedback,
  }: {
    id: string;
    feedback: {
      rating: 1 | 2 | 3 | 4 | 5;
      comment?: string;
      likedFeatures: string[];
      concerns: string[];
      interestedInApplying: boolean;
    };
  }) => {
    const response = await inspectionService.checkOutInspection(id, {
      feedback,
    });
    return response;
  },
);

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: InspectionState = {
  // Inspection data
  inspections: [],
  currentInspection: null,
  availableSlots: [],

  // Loading states
  isLoadingInspections: false,
  isLoadingSlots: false,
  isCreatingInspection: false,
  isUpdatingInspection: false,

  // Pagination
  totalInspections: 0,
  currentPage: 1,
  totalPages: 0,

  // Filters
  filters: {
    status: undefined,
    propertyId: undefined,
    landlordId: undefined,
    dateRange: undefined,
  },

  // Error handling
  error: null,

  // UI state
  selectedInspectionId: null,
  showBookingModal: false,
  showRescheduleModal: false,
};

// ============================================================================
// SLICE DEFINITION
// ============================================================================

const inspectionSlice = createSlice({
  name: "inspections",
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    // Set filters
    setFilters: (
      state,
      action: PayloadAction<Partial<typeof initialState.filters>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset pagination when filters change
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },

    // Set current page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    // Set selected inspection
    setSelectedInspection: (state, action: PayloadAction<string | null>) => {
      state.selectedInspectionId = action.payload;
    },

    // Show/hide booking modal
    setShowBookingModal: (state, action: PayloadAction<boolean>) => {
      state.showBookingModal = action.payload;
    },

    // Show/hide reschedule modal
    setShowRescheduleModal: (state, action: PayloadAction<boolean>) => {
      state.showRescheduleModal = action.payload;
    },

    // Set current inspection for detailed view
    setCurrentInspection: (state, action: PayloadAction<Inspection | null>) => {
      state.currentInspection = action.payload;
    },

    // Reset inspection state
    resetInspectionState: () => initialState,
  },

  extraReducers: (builder) => {
    // Fetch inspections
    builder
      .addCase(fetchInspections.pending, (state) => {
        state.isLoadingInspections = true;
        state.error = null;
      })
      .addCase(fetchInspections.fulfilled, (state, action) => {
        state.isLoadingInspections = false;
        state.inspections = action.payload.inspections;
        state.totalInspections = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchInspections.rejected, (state, action) => {
        state.isLoadingInspections = false;
        state.error = action.error.message || "Failed to fetch inspections";
      });

    // Create inspection
    builder
      .addCase(createInspection.pending, (state) => {
        state.isCreatingInspection = true;
        state.error = null;
      })
      .addCase(createInspection.fulfilled, (state, action) => {
        state.isCreatingInspection = false;
        state.inspections.unshift(action.payload);
        state.showBookingModal = false;
      })
      .addCase(createInspection.rejected, (state, action) => {
        state.isCreatingInspection = false;
        state.error = action.error.message || "Failed to create inspection";
      });

    // Update inspection status
    builder
      .addCase(updateInspectionStatus.pending, (state) => {
        state.isUpdatingInspection = true;
        state.error = null;
      })
      .addCase(updateInspectionStatus.fulfilled, (state, action) => {
        state.isUpdatingInspection = false;
        const index = state.inspections.findIndex(
          (i) => i.id === action.payload.id,
        );
        if (index !== -1) {
          state.inspections[index] = action.payload;
        }
        if (state.currentInspection?.id === action.payload.id) {
          state.currentInspection = action.payload;
        }
      })
      .addCase(updateInspectionStatus.rejected, (state, action) => {
        state.isUpdatingInspection = false;
        state.error =
          action.error.message || "Failed to update inspection status";
      });

    // Cancel inspection
    builder.addCase(cancelInspection.fulfilled, (state, action) => {
      const index = state.inspections.findIndex(
        (i) => i.id === action.payload.id,
      );
      if (index !== -1) {
        state.inspections[index] = action.payload;
      }
      if (state.currentInspection?.id === action.payload.id) {
        state.currentInspection = action.payload;
      }
    });

    // Reschedule inspection
    builder.addCase(rescheduleInspection.fulfilled, (state, action) => {
      const index = state.inspections.findIndex(
        (i) => i.id === action.payload.id,
      );
      if (index !== -1) {
        state.inspections[index] = action.payload;
      }
      if (state.currentInspection?.id === action.payload.id) {
        state.currentInspection = action.payload;
      }
      state.showRescheduleModal = false;
    });

    // Fetch available slots
    builder
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.isLoadingSlots = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.isLoadingSlots = false;
        state.availableSlots = action.payload.slots;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.isLoadingSlots = false;
        state.error = action.error.message || "Failed to fetch available slots";
      });

    // Check-in inspection
    builder.addCase(checkInInspection.fulfilled, (state, action) => {
      const index = state.inspections.findIndex(
        (i) => i.id === action.payload.id,
      );
      if (index !== -1) {
        state.inspections[index] = action.payload;
      }
      if (state.currentInspection?.id === action.payload.id) {
        state.currentInspection = action.payload;
      }
    });

    // Check-out inspection
    builder.addCase(checkOutInspection.fulfilled, (state, action) => {
      const index = state.inspections.findIndex(
        (i) => i.id === action.payload.id,
      );
      if (index !== -1) {
        state.inspections[index] = action.payload;
      }
      if (state.currentInspection?.id === action.payload.id) {
        state.currentInspection = action.payload;
      }
    });
  },
});

// ============================================================================
// ACTIONS
// ============================================================================

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentPage,
  setSelectedInspection,
  setShowBookingModal,
  setShowRescheduleModal,
  setCurrentInspection,
  resetInspectionState,
} = inspectionSlice.actions;

// ============================================================================
// SELECTORS
// ============================================================================

export const selectInspections = (state: { inspections: InspectionState }) =>
  state.inspections.inspections;

export const selectCurrentInspection = (state: {
  inspections: InspectionState;
}) => state.inspections.currentInspection;

export const selectAvailableSlots = (state: { inspections: InspectionState }) =>
  state.inspections.availableSlots;

export const selectInspectionLoading = (state: {
  inspections: InspectionState;
}) => state.inspections.isLoadingInspections;

export const selectSlotLoading = (state: { inspections: InspectionState }) =>
  state.inspections.isLoadingSlots;

export const selectInspectionError = (state: {
  inspections: InspectionState;
}) => state.inspections.error;

export const selectInspectionFilters = (state: {
  inspections: InspectionState;
}) => state.inspections.filters;

export const selectInspectionPagination = (state: {
  inspections: InspectionState;
}) => ({
  currentPage: state.inspections.currentPage,
  totalPages: state.inspections.totalPages,
  totalInspections: state.inspections.totalInspections,
});

export const selectInspectionUI = (state: {
  inspections: InspectionState;
}) => ({
  selectedInspectionId: state.inspections.selectedInspectionId,
  showBookingModal: state.inspections.showBookingModal,
  showRescheduleModal: state.inspections.showRescheduleModal,
});

// ============================================================================
// REDUCER
// ============================================================================

export default inspectionSlice.reducer;
