// PLACEHOLDER FILE: store\applicationSlice.ts
// TODO: Add your implementation here

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Application, 
  ApplicationFormData, 
  ApplicationFilters,
  ApplicationSummary 
} from '../types/application.types';
import { applicationService } from '../services/applicationService';

interface ApplicationState {
  // Current application being filled
  currentApplication: Application | null;
  currentFormData: Partial<ApplicationFormData>;
  
  // List of applications
  applications: Application[];
  
  // Filters
  filters: ApplicationFilters;
  
  // Summary statistics
  summary: ApplicationSummary | null;
  
  // UI state
  loading: boolean;
  saving: boolean;
  submitting: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

const initialState: ApplicationState = {
  currentApplication: null,
  currentFormData: {
    step: 0,
  },
  applications: [],
  filters: {},
  summary: null,
  loading: false,
  saving: false,
  submitting: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
};

// Async Thunks

export const createApplication = createAsyncThunk(
  'applications/create',
  async (propertyId: string) => {
    const application = await applicationService.createApplication(propertyId);
    return application;
  }
);

export const fetchApplication = createAsyncThunk(
  'applications/fetch',
  async (applicationId: string) => {
    const application = await applicationService.getApplication(applicationId);
    return application;
  }
);

export const updateApplication = createAsyncThunk(
  'applications/update',
  async ({ applicationId, data }: { applicationId: string; data: Partial<ApplicationFormData> }) => {
    const application = await applicationService.updateApplication(applicationId, data);
    return application;
  }
);

export const submitApplication = createAsyncThunk(
  'applications/submit',
  async (applicationId: string) => {
    const application = await applicationService.submitApplication(applicationId);
    return application;
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMy',
  async (filters?: ApplicationFilters) => {
    const applications = await applicationService.getMyApplications(filters);
    return applications;
  }
);

export const fetchPropertyApplications = createAsyncThunk(
  'applications/fetchProperty',
  async ({ propertyId, filters }: { propertyId: string; filters?: ApplicationFilters }) => {
    const applications = await applicationService.getPropertyApplications(propertyId, filters);
    return applications;
  }
);

export const approveApplication = createAsyncThunk(
  'applications/approve',
  async ({ applicationId, conditions }: { applicationId: string; conditions?: string[] }) => {
    const application = await applicationService.approveApplication(applicationId, conditions);
    return application;
  }
);

export const rejectApplication = createAsyncThunk(
  'applications/reject',
  async ({ applicationId, reason }: { applicationId: string; reason: string }) => {
    const application = await applicationService.rejectApplication(applicationId, reason);
    return application;
  }
);

export const withdrawApplication = createAsyncThunk(
  'applications/withdraw',
  async (applicationId: string) => {
    const application = await applicationService.withdrawApplication(applicationId);
    return application;
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/delete',
  async (applicationId: string) => {
    await applicationService.deleteApplication(applicationId);
    return applicationId;
  }
);

export const fetchApplicationSummary = createAsyncThunk(
  'applications/fetchSummary',
  async (propertyId?: string) => {
    const summary = await applicationService.getApplicationSummary(propertyId);
    return summary;
  }
);

export const applyToMultipleProperties = createAsyncThunk(
  'applications/applyMultiple',
  async ({ propertyIds, data }: { propertyIds: string[]; data: Partial<ApplicationFormData> }) => {
    const applications = await applicationService.applyToMultipleProperties(propertyIds, data);
    return applications;
  }
);

// Slice

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    // Update form data (for autosave)
    updateFormData: (state, action: PayloadAction<Partial<ApplicationFormData>>) => {
      state.currentFormData = {
        ...state.currentFormData,
        ...action.payload,
      };
    },
    
    // Set current step
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentFormData.step = action.payload;
    },
    
    // Reset form
    resetForm: (state) => {
      state.currentFormData = { step: 0 };
      state.currentApplication = null;
    },
    
    // Set filters
    setFilters: (state, action: PayloadAction<ApplicationFilters>) => {
      state.filters = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set current application
    setCurrentApplication: (state, action: PayloadAction<Application>) => {
      state.currentApplication = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create Application
    builder.addCase(createApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.currentApplication = action.payload;
      state.currentFormData = { step: 0 };
    });
    builder.addCase(createApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create application';
    });
    
    // Fetch Application
    builder.addCase(fetchApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.currentApplication = action.payload;
    });
    builder.addCase(fetchApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch application';
    });
    
    // Update Application
    builder.addCase(updateApplication.pending, (state) => {
      state.saving = true;
      state.error = null;
    });
    builder.addCase(updateApplication.fulfilled, (state, action) => {
      state.saving = false;
      state.currentApplication = action.payload;
    });
    builder.addCase(updateApplication.rejected, (state, action) => {
      state.saving = false;
      state.error = action.error.message || 'Failed to update application';
    });
    
    // Submit Application
    builder.addCase(submitApplication.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(submitApplication.fulfilled, (state, action) => {
      state.submitting = false;
      state.currentApplication = action.payload;
    });
    builder.addCase(submitApplication.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.error.message || 'Failed to submit application';
    });
    
    // Fetch My Applications
    builder.addCase(fetchMyApplications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMyApplications.fulfilled, (state, action) => {
      state.loading = false;
      state.applications = action.payload;
      state.totalCount = action.payload.length;
    });
    builder.addCase(fetchMyApplications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch applications';
    });
    
    // Fetch Property Applications
    builder.addCase(fetchPropertyApplications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPropertyApplications.fulfilled, (state, action) => {
      state.loading = false;
      state.applications = action.payload;
      state.totalCount = action.payload.length;
    });
    builder.addCase(fetchPropertyApplications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch applications';
    });
    
    // Approve Application
    builder.addCase(approveApplication.fulfilled, (state, action) => {
      const index = state.applications.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      if (state.currentApplication?.id === action.payload.id) {
        state.currentApplication = action.payload;
      }
    });
    
    // Reject Application
    builder.addCase(rejectApplication.fulfilled, (state, action) => {
      const index = state.applications.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      if (state.currentApplication?.id === action.payload.id) {
        state.currentApplication = action.payload;
      }
    });
    
    // Withdraw Application
    builder.addCase(withdrawApplication.fulfilled, (state, action) => {
      const index = state.applications.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      if (state.currentApplication?.id === action.payload.id) {
        state.currentApplication = action.payload;
      }
    });
    
    // Delete Application
    builder.addCase(deleteApplication.fulfilled, (state, action) => {
      state.applications = state.applications.filter(a => a.id !== action.payload);
      if (state.currentApplication?.id === action.payload) {
        state.currentApplication = null;
      }
    });
    
    // Fetch Summary
    builder.addCase(fetchApplicationSummary.fulfilled, (state, action) => {
      state.summary = action.payload;
    });
    
    // Apply to Multiple Properties
    builder.addCase(applyToMultipleProperties.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(applyToMultipleProperties.fulfilled, (state, action) => {
      state.submitting = false;
      state.applications = [...state.applications, ...action.payload];
    });
    builder.addCase(applyToMultipleProperties.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.error.message || 'Failed to apply to properties';
    });
  },
});

export const {
  updateFormData,
  setCurrentStep,
  resetForm,
  setFilters,
  clearError,
  setCurrentApplication,
} = applicationSlice.actions;

export default applicationSlice.reducer;