// PLACEHOLDER FILE: hooks\useApplicationReview.ts
// TODO: Add your implementation here
import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "../../../store";
import { applicationService } from "../services/applicationService";
import {
  fetchPropertyApplications,
  approveApplication,
  rejectApplication,
  fetchApplicationSummary,
} from "../store/applicationSlice";
import {
  Application,
  ApplicationFilters,
  ApplicationStatus,
} from "../types/application.types";
import {
  calculateApplicationScore as _calculateApplicationScore,
  getScoreRating as _getScoreRating,
} from "../utils/scoringAlgorithm";

export const useApplicationReview = (propertyId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { applications, summary, loading, error } = useSelector(
    (state: RootState) => state.applications,
  );

  const [sortBy, setSortBy] = useState<"score" | "date" | "name">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch applications on mount
  useEffect(() => {
    if (propertyId) {
      dispatch(fetchPropertyApplications({ propertyId }));
      dispatch(fetchApplicationSummary(propertyId));
    }
  }, [propertyId, dispatch]);

  // Fetch applications with filters
  const fetchWithFilters = useCallback(
    async (filters: ApplicationFilters) => {
      if (!propertyId) return;
      await dispatch(fetchPropertyApplications({ propertyId, filters }));
    },
    [propertyId, dispatch],
  );

  // Approve application
  const approve = useCallback(
    async (applicationId: string, conditions?: string[]) => {
      const result = await dispatch(
        approveApplication({ applicationId, conditions }),
      );
      return result.payload as Application;
    },
    [dispatch],
  );

  // Reject application
  const reject = useCallback(
    async (applicationId: string, reason: string) => {
      const result = await dispatch(
        rejectApplication({ applicationId, reason }),
      );
      return result.payload as Application;
    },
    [dispatch],
  );

  // Request more information
  const requestMoreInfo = useCallback(
    async (
      applicationId: string,
      message: string,
      requiredFields: string[],
    ) => {
      return await applicationService.requestMoreInfo(
        applicationId,
        message,
        requiredFields,
      );
    },
    [],
  );

  // Add landlord notes
  const addNotes = useCallback(async (applicationId: string, notes: string) => {
    return await applicationService.addLandlordNotes(applicationId, notes);
  }, []);

  // Compare applications
  const compare = useCallback(async (applicationIds: string[]) => {
    return await applicationService.compareApplications(applicationIds);
  }, []);

  // Export application
  const exportPDF = useCallback(async (applicationId: string) => {
    const blob = await applicationService.exportApplicationPDF(applicationId);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `application-${applicationId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, []);

  // Filter and sort applications
  const filteredApplications = useCallback(() => {
    let filtered = [...applications];

    // Filter by status
    if (filterStatus.length > 0) {
      filtered = filtered.filter((app) => filterStatus.includes(app.status));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((app) => {
        const fullName =
          `${app.personalInfo.firstName} ${app.personalInfo.lastName}`.toLowerCase();
        const email = app.personalInfo.email.toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "score":
          comparison = a.score - b.score;
          break;
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "name": {
          const nameA = `${a.personalInfo.firstName} ${a.personalInfo.lastName}`;
          const nameB = `${b.personalInfo.firstName} ${b.personalInfo.lastName}`;
          comparison = nameA.localeCompare(nameB);
          break;
        }
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [applications, filterStatus, searchQuery, sortBy, sortOrder]);

  // Get applications by status
  const getByStatus = useCallback(
    (status: ApplicationStatus) => {
      return applications.filter((app) => app.status === status);
    },
    [applications],
  );

  // Get top applications
  const getTopApplications = useCallback(
    (limit: number = 5) => {
      return [...applications]
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    },
    [applications],
  );

  // Get applications needing attention
  const getNeedingAttention = useCallback(() => {
    return applications.filter(
      (app) =>
        app.status === "submitted" ||
        app.status === "under_review" ||
        app.status === "verification_pending",
    );
  }, [applications]);

  // Calculate statistics
  const getStatistics = useCallback(() => {
    if (applications.length === 0) {
      return {
        total: 0,
        averageScore: 0,
        strongApplicants: 0,
        needingReview: 0,
        approved: 0,
        rejected: 0,
        approvalRate: 0,
      };
    }

    const total = applications.length;
    const averageScore = Math.round(
      applications.reduce((sum, app) => sum + app.score, 0) / total,
    );
    const strongApplicants = applications.filter(
      (app) => app.score >= 90,
    ).length;
    const needingReview = getNeedingAttention().length;
    const approved = applications.filter(
      (app) =>
        app.status === "approved" || app.status === "approved_with_conditions",
    ).length;
    const rejected = applications.filter(
      (app) => app.status === "rejected",
    ).length;
    const approvalRate =
      approved + rejected > 0
        ? Math.round((approved / (approved + rejected)) * 100)
        : 0;

    return {
      total,
      averageScore,
      strongApplicants,
      needingReview,
      approved,
      rejected,
      approvalRate,
    };
  }, [applications, getNeedingAttention]);

  // Get score distribution
  const getScoreDistribution = useCallback(() => {
    const distribution = {
      strong: 0, // 90+
      good: 0, // 75-89
      fair: 0, // 60-74
      weak: 0, // <60
    };

    applications.forEach((app) => {
      if (app.score >= 90) distribution.strong++;
      else if (app.score >= 75) distribution.good++;
      else if (app.score >= 60) distribution.fair++;
      else distribution.weak++;
    });

    return distribution;
  }, [applications]);

  // Bulk actions
  const bulkApprove = useCallback(
    async (applicationIds: string[]) => {
      const promises = applicationIds.map((id) => approve(id));
      return await Promise.all(promises);
    },
    [approve],
  );

  const bulkReject = useCallback(
    async (applicationIds: string[], reason: string) => {
      const promises = applicationIds.map((id) => reject(id, reason));
      return await Promise.all(promises);
    },
    [reject],
  );

  return {
    // Data
    applications: filteredApplications(),
    allApplications: applications,
    summary,
    statistics: getStatistics(),
    scoreDistribution: getScoreDistribution(),

    // UI state
    loading,
    error,

    // Filters
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,

    // Actions
    fetchWithFilters,
    approve,
    reject,
    requestMoreInfo,
    addNotes,
    compare,
    exportPDF,
    bulkApprove,
    bulkReject,

    // Helpers
    getByStatus,
    getTopApplications,
    getNeedingAttention,
  };
};
