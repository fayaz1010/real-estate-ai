// PLACEHOLDER FILE: components\ApplicationReview\ApplicationsList.tsx
// TODO: Add your implementation here

import {
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import React, { useState } from "react";

import { useApplicationReview } from "../../hooks/useApplicationReview";
import { ApplicationStatus } from "../../types/application.types";

import ApplicationCard from "./ApplicationCard";

interface ApplicationsListProps {
  propertyId?: string;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({ propertyId }) => {
  const {
    applications,
    statistics,
    loading,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
  } = useApplicationReview(propertyId);

  const [showFilters, setShowFilters] = useState(false);

  const statusOptions: {
    value: ApplicationStatus;
    label: string;
    color: string;
  }[] = [
    { value: "submitted", label: "New", color: "blue" },
    { value: "under_review", label: "Under Review", color: "yellow" },
    {
      value: "verification_pending",
      label: "Verification Pending",
      color: "purple",
    },
    {
      value: "conditionally_approved",
      label: "Conditionally Approved",
      color: "green",
    },
    { value: "approved", label: "Approved", color: "green" },
    { value: "rejected", label: "Rejected", color: "red" },
  ];

  const handleStatusToggle = (status: ApplicationStatus) => {
    setFilterStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const toggleSort = (field: "score" | "date" | "name") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">
            {statistics.total} total applications
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statistics.averageScore}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Strong Applicants</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {statistics.strongApplicants}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Needs Review</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {statistics.needingReview}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approval Rate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {statistics.approvalRate}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name or email..."
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "date" | "name")}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="score">Sort by Score</option>
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === "asc" ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                filterStatus.length > 0
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters {filterStatus.length > 0 && `(${filterStatus.length})`}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Filter by Status:
            </p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusToggle(status.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus.includes(status.value)
                      ? `bg-${status.color}-600 text-white`
                      : `bg-${status.color}-50 text-${status.color}-700 hover:bg-${status.color}-100`
                  }`}
                >
                  {status.label}
                </button>
              ))}
              {filterStatus.length > 0 && (
                <button
                  onClick={() => setFilterStatus([])}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
          <p className="text-gray-600 mb-2">No applications found</p>
          <p className="text-sm text-gray-500">
            {filterStatus.length > 0 || searchQuery
              ? "Try adjusting your filters or search query"
              : "Applications will appear here once submitted"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}

      {/* Pagination placeholder */}
      {applications.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {applications.length} of {statistics.total} applications
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
