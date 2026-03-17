import {
  Application,
  ApplicationFormData,
  ApplicationFilters,
  ApplicationSummary,
  CoApplicant,
  ApplicationDocument,
} from "../types/application.types";

import apiClient from "@/api/client";

export const applicationService = {
  /**
   * Create a new application
   */
  createApplication: async (propertyId: string): Promise<Application> => {
    const response = await apiClient.post("/applications", { propertyId });
    return response.data;
  },

  /**
   * Get application by ID
   */
  getApplication: async (applicationId: string): Promise<Application> => {
    const response = await apiClient.get(`/applications/${applicationId}`);
    return response.data;
  },

  /**
   * Update application (autosave)
   */
  updateApplication: async (
    applicationId: string,
    data: Partial<ApplicationFormData>,
  ): Promise<Application> => {
    const response = await apiClient.patch(
      `/applications/${applicationId}`,
      data,
    );
    return response.data;
  },

  /**
   * Submit application for review
   */
  submitApplication: async (applicationId: string): Promise<Application> => {
    const response = await apiClient.post(
      `/applications/${applicationId}/submit`,
    );
    return response.data;
  },

  /**
   * Delete application (draft only)
   */
  deleteApplication: async (applicationId: string): Promise<void> => {
    await apiClient.delete(`/applications/${applicationId}`);
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
    const response = await apiClient.get(
      `/applications/my-applications${query ? `?${query}` : ""}`,
    );
    return response.data;
  },

  /**
   * Apply to multiple properties at once
   */
  applyToMultipleProperties: async (
    propertyIds: string[],
    applicationData: Partial<ApplicationFormData>,
  ): Promise<Application[]> => {
    const response = await apiClient.post("/applications/multi", {
      propertyIds,
      applicationData,
    });
    return response.data;
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

    const response = await apiClient.get(
      `/applications?${queryParams.toString()}`,
    );
    return response.data;
  },

  /**
   * Get application summary statistics
   */
  getApplicationSummary: async (
    propertyId?: string,
  ): Promise<ApplicationSummary> => {
    const query = propertyId ? `?propertyId=${propertyId}` : "";
    const response = await apiClient.get(`/applications/summary${query}`);
    return response.data;
  },

  /**
   * Approve application
   */
  approveApplication: async (
    applicationId: string,
    conditions?: string[],
  ): Promise<Application> => {
    const response = await apiClient.post(
      `/applications/${applicationId}/approve`,
      { conditions },
    );
    return response.data;
  },

  /**
   * Reject application
   */
  rejectApplication: async (
    applicationId: string,
    reason: string,
  ): Promise<Application> => {
    const response = await apiClient.post(
      `/applications/${applicationId}/reject`,
      { reason },
    );
    return response.data;
  },

  /**
   * Request more information from applicant
   */
  requestMoreInfo: async (
    applicationId: string,
    message: string,
    requiredFields: string[],
  ): Promise<Application> => {
    const response = await apiClient.post(
      `/applications/${applicationId}/request-more-info`,
      { message, requiredFields },
    );
    return response.data;
  },

  /**
   * Withdraw application
   */
  withdrawApplication: async (applicationId: string): Promise<Application> => {
    const response = await apiClient.post(
      `/applications/${applicationId}/withdraw`,
    );
    return response.data;
  },

  /**
   * Get application score (real-time)
   */
  getApplicationScore: async (
    applicationId: string,
  ): Promise<{
    score: number;
    breakdown: Record<string, unknown>;
    rating: string;
  }> => {
    const response = await apiClient.get(
      `/applications/${applicationId}/score`,
    );
    return response.data;
  },

  /**
   * Invite co-applicant
   */
  inviteCoApplicant: async (
    applicationId: string,
    email: string,
    relationship: string,
  ): Promise<CoApplicant> => {
    const response = await apiClient.post(
      `/applications/${applicationId}/co-applicants`,
      { email, relationship },
    );
    return response.data;
  },

  /**
   * Update co-applicant info
   */
  updateCoApplicant: async (
    applicationId: string,
    coApplicantId: string,
    data: Partial<CoApplicant>,
  ): Promise<CoApplicant> => {
    const response = await apiClient.patch(
      `/applications/${applicationId}/co-applicants/${coApplicantId}`,
      data,
    );
    return response.data;
  },

  /**
   * Remove co-applicant
   */
  removeCoApplicant: async (
    applicationId: string,
    coApplicantId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/applications/${applicationId}/co-applicants/${coApplicantId}`,
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

    const response = await apiClient.post<ApplicationDocument>(
      `/applications/${applicationId}/documents`,
      formData,
      {
        headers: { "Content-Type": undefined as unknown as string },
      },
    );
    return response.data;
  },

  /**
   * Parse document with AI
   */
  parseDocument: async (
    applicationId: string,
    documentId: string,
  ): Promise<ApplicationDocument> => {
    const response = await apiClient.post(
      `/applications/${applicationId}/documents/${documentId}/parse`,
    );
    return response.data;
  },

  /**
   * Delete document
   */
  deleteDocument: async (
    applicationId: string,
    documentId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/applications/${applicationId}/documents/${documentId}`,
    );
  },

  /**
   * Get autofill data from previous applications
   */
  getAutofillData: async (): Promise<Partial<ApplicationFormData>> => {
    const response = await apiClient.get("/applications/autofill");
    return response.data;
  },

  /**
   * Compare multiple applications
   */
  compareApplications: async (
    applicationIds: string[],
  ): Promise<{
    applications: Application[];
    comparison: Record<string, unknown>;
  }> => {
    const response = await apiClient.post("/applications/compare", {
      applicationIds,
    });
    return response.data;
  },

  /**
   * Export application as PDF
   */
  exportApplicationPDF: async (applicationId: string): Promise<Blob> => {
    const response = await apiClient.get(
      `/applications/${applicationId}/export/pdf`,
      { responseType: "blob" },
    );
    return response.data;
  },

  /**
   * Add notes to application (landlord only)
   */
  addLandlordNotes: async (
    applicationId: string,
    notes: string,
  ): Promise<Application> => {
    const response = await apiClient.post(
      `/applications/${applicationId}/notes`,
      { notes },
    );
    return response.data;
  },
};
