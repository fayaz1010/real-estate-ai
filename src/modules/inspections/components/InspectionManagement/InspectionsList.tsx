// PLACEHOLDER FILE: src/modules/inspections/components/InspectionManagement/InspectionsList.tsx
// TODO: Add your implementation here

import { Loader, Search, Calendar } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useInspections } from "../../hooks/useInspections";

import { InspectionCard } from "./InspectionCard";

type FilterTab = "all" | "upcoming" | "pending" | "completed" | "cancelled";

export const InspectionsList: React.FC = () => {
  const {
    inspections,
    // inspections,
    // inspections,
    isLoading,
    loadInspections,
  } = useInspections();

  const [activeTab, setActiveTab] = useState<FilterTab>("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "property">("date");

  useEffect(() => {
    loadInspections();
  }, [loadInspections]);

  const getFilteredInspections = () => {
    let filtered = [...inspections];

    // Filter by tab
    switch (activeTab) {
      case "upcoming":
        filtered = inspections;
        break;
      case "pending":
        filtered = inspections.filter((i) => i.status === "pending");
        break;
      case "completed":
        filtered = inspections.filter((i) => i.status === "completed");
        break;
      case "cancelled":
        filtered = inspections.filter(
          (i) => i.status === "cancelled" || i.status === "no_show",
        );
        break;
      default:
        filtered = inspections;
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (inspection) =>
          inspection.property?.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          inspection.property?.address.street
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          inspection.property?.address.city
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Sort
    if (sortBy === "date") {
      filtered.sort(
        (a, b) =>
          new Date(a.scheduledDate).getTime() -
          new Date(b.scheduledDate).getTime(),
      );
    } else {
      filtered.sort((a, b) =>
        (a.property?.title || "").localeCompare(b.property?.title || ""),
      );
    }

    return filtered;
  };

  const filteredInspections = getFilteredInspections();

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "upcoming", label: "Upcoming", count: inspections.length },
    {
      id: "pending",
      label: "Pending",
      count: inspections.filter((i) => i.status === "pending").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: inspections.filter((i) => i.status === "completed").length,
    },
    { id: "all", label: "All", count: inspections.length },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading inspections...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Inspections
        </h1>
        <p className="text-gray-600">
          Manage all your property inspections in one place
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                pb-3 px-1 border-b-2 transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }
              `}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`
                    ml-2 px-2 py-0.5 rounded-full text-xs
                    ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by property name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "property")}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="date">Sort by Date</option>
          <option value="property">Sort by Property</option>
        </select>
      </div>

      {/* Inspections List */}
      {filteredInspections.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No inspections found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "Try adjusting your search terms"
              : activeTab === "upcoming"
                ? "You don't have any upcoming inspections"
                : "No inspections match this filter"}
          </p>
          {activeTab === "upcoming" && !searchTerm && (
            <button
              onClick={() => (window.location.href = "/properties")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInspections.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredInspections.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredInspections.length} of {inspections.length}{" "}
          inspection
          {inspections.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};
