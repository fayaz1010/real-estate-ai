import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import leaseService, {
  Lease,
  CreateLeaseData,
  UpdateLeaseStatusData,
} from "../api/leaseService";

interface LeaseState {
  leases: Lease[];
  selectedLease: Lease | null;
  loading: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: string | null;
}

const initialState: LeaseState = {
  leases: [],
  selectedLease: null,
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
};

export const fetchLeases = createAsyncThunk(
  "leases/fetchLeases",
  async (role: "tenant" | "landlord" | undefined, { rejectWithValue }) => {
    try {
      return await leaseService.getMyLeases(role || "landlord");
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch leases",
      );
    }
  },
);

export const fetchLeaseById = createAsyncThunk(
  "leases/fetchLeaseById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await leaseService.getById(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch lease",
      );
    }
  },
);

export const createLease = createAsyncThunk(
  "leases/createLease",
  async (data: CreateLeaseData, { rejectWithValue }) => {
    try {
      return await leaseService.create(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create lease",
      );
    }
  },
);

export const updateLeaseStatus = createAsyncThunk(
  "leases/updateLeaseStatus",
  async (
    { id, data }: { id: string; data: UpdateLeaseStatusData },
    { rejectWithValue },
  ) => {
    try {
      return await leaseService.updateStatus(id, data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update lease",
      );
    }
  },
);

export const terminateLease = createAsyncThunk(
  "leases/terminateLease",
  async (
    { id, reason }: { id: string; reason: string },
    { rejectWithValue },
  ) => {
    try {
      return await leaseService.terminate(id, reason);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to terminate lease",
      );
    }
  },
);

const leaseSlice = createSlice({
  name: "leases",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSelectedLease(state) {
      state.selectedLease = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch leases
    builder
      .addCase(fetchLeases.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(
        fetchLeases.fulfilled,
        (state, action: PayloadAction<Lease[]>) => {
          state.loading.list = false;
          state.leases = action.payload;
        },
      )
      .addCase(fetchLeases.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload as string;
      });

    // Fetch lease by ID
    builder
      .addCase(fetchLeaseById.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(
        fetchLeaseById.fulfilled,
        (state, action: PayloadAction<Lease>) => {
          state.loading.list = false;
          state.selectedLease = action.payload;
        },
      )
      .addCase(fetchLeaseById.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload as string;
      });

    // Create lease
    builder
      .addCase(createLease.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createLease.fulfilled, (state, action: PayloadAction<Lease>) => {
        state.loading.create = false;
        state.leases.unshift(action.payload);
      })
      .addCase(createLease.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      });

    // Update lease status
    builder
      .addCase(updateLeaseStatus.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(
        updateLeaseStatus.fulfilled,
        (state, action: PayloadAction<Lease>) => {
          state.loading.update = false;
          const idx = state.leases.findIndex((l) => l.id === action.payload.id);
          if (idx !== -1) state.leases[idx] = action.payload;
        },
      )
      .addCase(updateLeaseStatus.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload as string;
      });

    // Terminate lease
    builder
      .addCase(terminateLease.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(
        terminateLease.fulfilled,
        (state, action: PayloadAction<Lease>) => {
          state.loading.delete = false;
          const idx = state.leases.findIndex((l) => l.id === action.payload.id);
          if (idx !== -1) state.leases[idx] = action.payload;
        },
      )
      .addCase(terminateLease.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedLease } = leaseSlice.actions;
export default leaseSlice.reducer;
