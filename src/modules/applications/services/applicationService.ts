// PLACEHOLDER FILE: services\applicationService.ts
// TODO: Add your implementation here

import {
  Application,
  ApplicationFormData,
  ApplicationFilters,
  ApplicationSummary,
  CoApplicant,
  ApplicationDocument,
} from "../types/application.types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4041/api";

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
};

export const applicationService = {
  /**
   * Create a new application
   */
  createApplication: async (propertyId: string): Promise<Application> => {
    return apiCall("/applications", {
      method: "POST",
      body: JSON.stringify({ propertyId }),
    });
  },

  /**
   * Get application by ID
   */
  getApplication: async (applicationId: string): Promise<Application> => {
    return apiCall(`/applications/${applicationId}`);
  },

  /**
   * Update application (autosave)
   */
  updateApplication: async (
    applicationId: string,
    data: Partial<ApplicationFormData>,
  ): Promise<Application> => {
    return apiCall(`/applications/${applicationId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Submit application for review
   */
  submitApplication: async (applicationId: string): Promise<Application> => {
    return apiCall(`/applications/${applicationId}/submit`, {
      method: "POST",
    });
  },

  /**
   * Delete application (draft only)
   */
  deleteApplication: async (applicationId: string): Promise<void> => {
    return apiCall(`/applications/${applicationId}`, {
      method: "DELETE",
    });
  },

  /**
   * Get all applications for current user
   */
  getMyApplications: async (
    filters?: ApplicationFilters,
  ): Promise<Application[]> => {
    const queryParams = new URLSearchParams();

    if (filters?.status) {
      filters.status.forEach((s) => queryParams.append("status", s));
    }
    if (filters?.propertyId) {
      queryParams.append("propertyId", filters.propertyId);
    }
    if (filters?.minScore) {
      queryParams.append("minScore", filters.minScore.toString());
    }
    if (filters?.maxScore) {
      queryParams.append("maxScore", filters.maxScore.toString());
    }
    if (filters?.dateFrom) {
      queryParams.append("dateFrom", filters.dateFrom);
    }
    if (filters?.dateTo) {
      queryParams.append("dateTo", filters.dateTo);
    }
    if (filters?.search) {
      queryParams.append("search", filters.search);
    }

    const query = queryParams.toString();
    return apiCall(`/applications/my-applications${query ? `?${query}` : ""}`);
  },

  /**
   * Apply to multiple properties at once
   */
  applyToMultipleProperties: async (
    propertyIds: string[],
    applicationData: Partial<ApplicationFormData>,
  ): Promise<Application[]> => {
    return apiCall("/applications/multi", {
      method: "POST",
      body: JSON.stringify({ propertyIds, applicationData }),
    });
  },

  /**
   * Get applications for a property (landlord view)
   */
  getPropertyApplications: async (
    propertyId: string,
    filters?: ApplicationFilters,
  ): Promise<Application[]> => {
    const queryParams = new URLSearchParams({ propertyId });

    if (filters?.status) {
      filters.status.forEach((s) => queryParams.append("status", s));
    }
    if (filters?.minScore) {
      queryParams.append("minScore", filters.minScore.toString());
    }

    return apiCall(`/applications?${queryParams.toString()}`);
  },

  /**
   * Get application summary statistics
   */
  getApplicationSummary: async (
    propertyId?: string,
  ): Promise<ApplicationSummary> => {
    const query = propertyId ? `?propertyId=${propertyId}` : "";
    return apiCall(`/applications/summary${query}`);
  },

  /**
   * Approve application
   */
  approveApplication: async (
    applicationId: string,
    conditions?: string[],
  ): Promise<Application> => {
    return apiCall(`/applications/${applicationId}/approve`, {
      method: "POST",
      body: JSON.stringify({ conditions }),
    });
  },

  /**
   * Reject application
   */
  rejectApplication: async (
    applicationId: string,
    reason: string,
  ): Promise<Application> => {
    return apiCall(`/applications/${applicationId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  /**
   * Request more information from applicant
   */
  requestMoreInfo: async (
    applicationId: string,
    message: string,
    requiredFields: string[],
  ): Promise<Application> => {
    return apiCall(`/applications/${applicationId}/request-more-info`, {
      method: "POST",
      body: JSON.stringify({ message, requiredFields }),
    });
  },

  /**
   * Withdraw application
   */
  withdrawApplication: async (applicationId: string): Promise<Application> => {
    return apiCall(`/applications/${applicationId}/withdraw`, {
      method: "POST",
    });
  },

  /**
   * Get application score (real-time)
   */
  getApplicationScore: async (
    applicationId: string,
  ): Promise<{
    score: number;
    breakdown: any;
    rating: string;
  }> => {
    return apiCall(`/applications/${applicationId}/score`);
  },

  /**
   * Invite co-applicant
   */
  inviteCoApplicant: async (
    applicationId: string,
    email: string,
    relationship: string,
  ): Promise<CoApplicant> => {
    return apiCall(`/applications/${applicationId}/co-applicants`, {
      method: "POST",
      body: JSON.stringify({ email, relationship }),
    });
  },

  /**
   * Update co-applicant info
   */
  updateCoApplicant: async (
    applicationId: string,
    coApplicantId: string,
    data: Partial<CoApplicant>,
  ): Promise<CoApplicant> => {
    return apiCall(
      `/applications/${applicationId}/co-applicants/${coApplicantId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  /**
   * Remove co-applicant
   */
  removeCoApplicant: async (
    applicationId: string,
    coApplicantId: string,
  ): Promise<void> => {
    return apiCall(
      `/applications/${applicationId}/co-applicants/${coApplicantId}`,
      {
        method: "DELETE",
      },
    );
  },

  /**
   * Upload document
   */
  uploadDocument: async (
    applicationId: string,
    file: File,
    type: string,
  ): Promise<ApplicationDocument> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      `${API_BASE}/applications/${applicationId}/documents`,
      {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Document upload failed");
    }

    return response.json();
  },

  /**
   * Parse document with AI
   */
  parseDocument: async (
    applicationId: string,
    documentId: string,
  ): Promise<ApplicationDocument> => {
    return apiCall(
      `/applications/${applicationId}/documents/${documentId}/parse`,
      {
        method: "POST",
      },
    );
  },

  /**
   * Delete document
   */
  deleteDocument: async (
    applicationId: string,
    documentId: string,
  ): Promise<void> => {
    return apiCall(`/applications/${applicationId}/documents/${documentId}`, {
      method: "DELETE",
    });
  },

  /**
   * Get autofill data from previous applications
   */
  getAutofillData: async (): Promise<Partial<ApplicationFormData>> => {
    return apiCall("/applications/autofill");
  },

  /**
   * Compare multiple applications
   */
  compareApplications: async (
    applicationIds: string[],
  ): Promise<{
    applications: Application[];
    comparison: any;
  }> => {
    return apiCall("/applications/compare", {
      method: "POST",
      body: JSON.stringify({ applicationIds }),
    });
  },

  /**
   * Export application as PDF
   */
  exportApplicationPDF: async (applicationId: string): Promise<Blob> => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      `${API_BASE}/applications/${applicationId}/export/pdf`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    );

    if (!response.ok) {
      throw new Error("PDF export failed");
    }

    return response.blob();
  },

  /**
   * Add notes to application (landlord only)
   */
  addLandlordNotes: async (
    applicationId: string,
    notes: string,
  ): Promise<Application> => {
    return apiCall(`/applications/${applicationId}/notes`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  },
};
