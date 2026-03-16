// PLACEHOLDER FILE: src/modules/inspections/store/availabilitySlice.ts
// TODO: Add your implementation here

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import availabilityService from '../services/availabilityService';
import {
  AvailabilitySlot,
  RecurringSchedule,
  BlackoutDate,
} from '../types/inspection.types';

interface AvailabilityState {
  slots: AvailabilitySlot[];
  recurringSchedules: RecurringSchedule[];
  blackoutDates: BlackoutDate[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AvailabilityState = {
  slots: [],
  recurringSchedules: [],
  blackoutDates: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchAvailableSlots = createAsyncThunk(
  'availability/fetchSlots',
  async (params: { propertyId: string; startDate: string; endDate: string }) => {
    const response = await availabilityService.getAvailableSlots(params);
    return response;
  }
);

export const createRecurringSchedule = createAsyncThunk(
  'availability/createRecurringSchedule',
  async (data: Omit<RecurringSchedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await availabilityService.createRecurringSchedule(data);
    return response;
  }
);

export const fetchRecurringSchedules = createAsyncThunk(
  'availability/fetchRecurringSchedules',
  async (propertyId: string) => {
    const response = await availabilityService.getRecurringSchedules(propertyId);
    return response;
  }
);

export const updateRecurringSchedule = createAsyncThunk(
  'availability/updateRecurringSchedule',
  async (params: { id: string; updates: Partial<RecurringSchedule> }) => {
    const response = await availabilityService.updateRecurringSchedule(
      params.id,
      params.updates
    );
    return response;
  }
);

export const deleteRecurringSchedule = createAsyncThunk(
  'availability/deleteRecurringSchedule',
  async (id: string) => {
    await availabilityService.deleteRecurringSchedule(id);
    return id;
  }
);

export const toggleRecurringSchedule = createAsyncThunk(
  'availability/toggleRecurringSchedule',
  async (params: { id: string; isActive: boolean }) => {
    const response = await availabilityService.toggleRecurringSchedule(
      params.id,
      params.isActive
    );
    return response;
  }
);

export const createBlackoutDate = createAsyncThunk(
  'availability/createBlackoutDate',
  async (data: Omit<BlackoutDate, 'id' | 'createdAt'>) => {
    const response = await availabilityService.createBlackoutDate(data);
    return response;
  }
);

export const fetchBlackoutDates = createAsyncThunk(
  'availability/fetchBlackoutDates',
  async (propertyId: string) => {
    const response = await availabilityService.getBlackoutDates(propertyId);
    return response;
  }
);

export const deleteBlackoutDate = createAsyncThunk(
  'availability/deleteBlackoutDate',
  async (id: string) => {
    await availabilityService.deleteBlackoutDate(id);
    return id;
  }
);

// Slice
const availabilitySlice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    clearAvailability: (state) => {
      state.slots = [];
      state.recurringSchedules = [];
      state.blackoutDates = [];
      state.status = 'idle';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch available slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.slots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch available slots';
      })

      // Create recurring schedule
      .addCase(createRecurringSchedule.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createRecurringSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recurringSchedules.push(action.payload);
      })
      .addCase(createRecurringSchedule.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create recurring schedule';
      })

      // Fetch recurring schedules
      .addCase(fetchRecurringSchedules.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRecurringSchedules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recurringSchedules = action.payload;
      })
      .addCase(fetchRecurringSchedules.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch recurring schedules';
      })

      // Update recurring schedule
      .addCase(updateRecurringSchedule.fulfilled, (state, action) => {
        const index = state.recurringSchedules.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.recurringSchedules[index] = action.payload;
        }
      })

      // Delete recurring schedule
      .addCase(deleteRecurringSchedule.fulfilled, (state, action) => {
        state.recurringSchedules = state.recurringSchedules.filter(
          (s) => s.id !== action.payload
        );
      })

      // Toggle recurring schedule
      .addCase(toggleRecurringSchedule.fulfilled, (state, action) => {
        const index = state.recurringSchedules.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.recurringSchedules[index] = action.payload;
        }
      })

      // Create blackout date
      .addCase(createBlackoutDate.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createBlackoutDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blackoutDates.push(action.payload);
      })
      .addCase(createBlackoutDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create blackout date';
      })

      // Fetch blackout dates
      .addCase(fetchBlackoutDates.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBlackoutDates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blackoutDates = action.payload;
      })
      .addCase(fetchBlackoutDates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch blackout dates';
      })

      // Delete blackout date
      .addCase(deleteBlackoutDate.fulfilled, (state, action) => {
        state.blackoutDates = state.blackoutDates.filter(
          (d) => d.id !== action.payload
        );
      });
  },
});

// Actions
export const { clearAvailability, clearError } = availabilitySlice.actions;

// Selectors
export const selectAvailableSlots = (state: RootState) => state.availability.slots;
export const selectRecurringSchedules = (state: RootState) =>
  state.availability.recurringSchedules;
export const selectBlackoutDates = (state: RootState) => state.availability.blackoutDates;
export const selectAvailabilityStatus = (state: RootState) => state.availability.status;
export const selectAvailabilityError = (state: RootState) => state.availability.error;

export const selectSlotsByDate = (state: RootState, date: string) =>
  state.availability.slots.filter((slot) => slot.date === date);

export const selectActiveRecurringSchedules = (state: RootState) =>
  state.availability.recurringSchedules.filter((s) => s.isActive);

export const selectFutureBlackoutDates = (state: RootState) => {
  const today = new Date().toISOString().split('T')[0];
  return state.availability.blackoutDates.filter((d) => d.endDate >= today);
};

export default availabilitySlice.reducer;