// FILE PATH: src/modules/properties/components/PropertySearch/SearchResults.tsx
// Module 1.2: Property Listings Management - Search Results Display

import {
  Grid,
  List,
  Map as MapIcon,
  Sliders as SlidersHorizontal,
  ChevronDown,
  MapPin,
  Save,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useProperties } from "../../hooks/useProperties";
import { usePropertySearch } from "../../hooks/usePropertySearch";
import { Property, SortOption } from "../../types/property.types";
import { PropertyGrid } from "../PropertyGrid";
import { PropertyList } from "../PropertyList";
import { PropertyMap } from "../PropertyMap";

import { SearchFilters } from "./SearchFilters";

interface SearchResultsProps {
  onPropertyClick?: (property: Property) => void;
  showFilters?: boolean;
  onToggleFilters?: (show: boolean) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  onPropertyClick,
  showFilters: externalShowFilters,
  onToggleFilters,
}) => {
  const navigate = useNavigate();
  const { filters, filteredProperties, updateFilters, performSearch } =
    usePropertySearch();
  const { properties, loading } = useProperties();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [internalShowFilters, setInternalShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Use external state if provided, otherwise fall back to internal state
  const showFilters =
    externalShowFilters !== undefined
      ? externalShowFilters
      : internalShowFilters;
  const setShowFilters = onToggleFilters || setInternalShowFilters;

  const displayProperties =
    filteredProperties.length > 0 ? filteredProperties : properties;
  const totalCount = displayProperties.length;
  const currentPage = 1;
  const totalPages = 1;

  useEffect(() => {
    if (displayProperties.length === 0) {
      performSearch();
    }
  }, []);

  const _sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "relevant", label: "Most Relevant" },
    { value: "newest", label: "Newest Listings" },
    { value: "price", label: "Price: Low to High" },
    { value: "price", label: "Price: High to Low" },
    { value: "sqft", label: "Square Feet" },
    { value: "bedrooms", label: "Bedrooms" },
  ];

  const handleSortChange = (
    sortBy: SortOption,
    order: "asc" | "desc" = "desc",
  ) => {
    updateFilters({ sortBy, sortOrder: order, page: 1 });
    performSearch();
    setShowSortMenu(false);
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
    performSearch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePropertyClick = (property: Property) => {
    if (onPropertyClick) {
      onPropertyClick(property);
    } else {
      navigate(`/properties/${property.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Results Count */}
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-gray-400" />
              <div>
                <h2 className="font-semibold text-gray-900">
                  {totalCount.toLocaleString()} Properties
                </h2>
                {filters.location && (
                  <p className="text-sm text-gray-600">in {filters.location}</p>
                )}
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <span className="text-sm text-gray-700">Sort</span>
                  <ChevronDown size={16} />
                </button>

                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40">
                    <button
                      onClick={() => handleSortChange("relevant")}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      Most Relevant
                    </button>
                    <button
                      onClick={() => handleSortChange("newest")}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      Newest Listings
                    </button>
                    <button
                      onClick={() => handleSortChange("price", "asc")}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => handleSortChange("price", "desc")}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      Price: High to Low
                    </button>
                    <button
                      onClick={() => handleSortChange("sqft", "desc")}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      Largest First
                    </button>
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="hidden md:flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 border-l ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  title="List View"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 border-l ${viewMode === "map" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  title="Map View"
                >
                  <MapIcon size={18} />
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <SlidersHorizontal size={18} />
                <span>Filters</span>
              </button>

              {/* Save Search Button */}
              <button
                onClick={() => alert("Save search functionality")}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                title="Save Search"
              >
                <Save size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          {showFilters && (
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <SearchFilters onClose={() => setShowFilters(false)} />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching properties...</p>
              </div>
            ) : displayProperties.length === 0 ? (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search in a different location
                </p>
                <button
                  onClick={() => {
                    updateFilters({});
                    performSearch();
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <PropertyGrid
                    properties={displayProperties}
                    onPropertyClick={handlePropertyClick}
                  />
                ) : viewMode === "list" ? (
                  <PropertyList
                    properties={displayProperties}
                    onPropertyClick={handlePropertyClick}
                  />
                ) : (
                  <PropertyMap
                    properties={displayProperties}
                    onPropertyClick={handlePropertyClick}
                  />
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-4 py-2 rounded-lg ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white">
            <SearchFilters onClose={() => setShowFilters(false)} isMobile />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
