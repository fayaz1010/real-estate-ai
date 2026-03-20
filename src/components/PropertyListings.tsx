// Property Listings page that composes the Property Search system
import { Sliders as SlidersHorizontal, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { PropertyGrid } from "../modules/properties/components/PropertyGrid";
import { SearchBar } from "../modules/properties/components/PropertySearch/SearchBar";
import { SearchResults } from "../modules/properties/components/PropertySearch/SearchResults";
import { usePropertySearch } from "../modules/properties/hooks/usePropertySearch";
import { propertyService } from "../modules/properties/services/propertyService";
import type { Property } from "../modules/properties/types/property.types";
import { searchFilterUtils } from "../modules/properties/utils/searchFilters";

const FilterChip: React.FC<{ label: string; onRemove: () => void }> = ({
  label,
  onRemove,
}) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-realestate-primary text-xs font-medium rounded-full border border-primary/20">
    {label}
    <button
      onClick={onRemove}
      className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition"
      aria-label={`Remove ${label} filter`}
    >
      <X size={12} />
    </button>
  </span>
);

export const PropertyListings: React.FC = () => {
  const { filters, updateFilters, performSearch } = usePropertySearch();
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // initial search
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoadingFeatured(true);
        const props = await propertyService.getFeaturedProperties(8);
        setFeatured(props);
      } catch (e) {
        console.error("Failed to load featured properties", e);
      } finally {
        setLoadingFeatured(false);
      }
    };
    loadFeatured();
  }, []);

  const activeFilterCount = searchFilterUtils.getActiveFilterCount(filters);

  const setListingType = (type?: "rent" | "sale" | "sold") => {
    // 'sold' can map to status filter
    if (type === "sold") {
      updateFilters({
        listingType: undefined,
        status: [
          "sold",
        ] as import("../modules/properties/types/property.types").PropertyStatus[],
        page: 1,
      });
    } else {
      updateFilters({ listingType: type, status: undefined, page: 1 });
    }
    performSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero with Search */}
      <div className="relative bg-gradient-to-br from-realestate-primary via-realestate-primary/90 to-realestate-primary/70 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h1 className="text-5xl font-bold mb-4 text-center">
            Find Your Perfect Home
          </h1>
          <p className="text-xl text-center mb-8 text-white/90">
            Smart filters. Beautiful results.
          </p>
          <div className="max-w-4xl mx-auto">
            <SearchBar className="bg-white rounded-2xl shadow-2xl p-0" />
          </div>
        </div>
      </div>

      {/* Quick Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setListingType("rent")}
                className={`px-4 py-2 rounded-lg font-semibold ${filters.listingType === "rent" ? "bg-realestate-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                Rent
              </button>
              <button
                onClick={() => setListingType("sale")}
                className={`px-4 py-2 rounded-lg font-semibold ${filters.listingType === "sale" ? "bg-realestate-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                Buy
              </button>
              <button
                onClick={() => setListingType("sold")}
                className={`px-4 py-2 rounded-lg font-semibold ${(filters.status as string[] | undefined)?.includes("sold") ? "bg-realestate-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                Sold
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition font-medium ${
                showFilters
                  ? "bg-realestate-primary text-white border-realestate-primary"
                  : activeFilterCount > 0
                    ? "bg-primary/10 text-realestate-primary border-primary/30 hover:bg-primary/20"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal size={18} />
              Filters
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 bg-realestate-primary text-white text-xs rounded-full min-w-[20px] text-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 font-medium">Active:</span>
              {filters.listingType && (
                <FilterChip
                  label={
                    filters.listingType === "rent" ? "For Rent" : "For Sale"
                  }
                  onRemove={() => updateFilters({ listingType: undefined })}
                />
              )}
              {filters.propertyType && filters.propertyType.length > 0 && (
                <FilterChip
                  label={filters.propertyType.join(", ")}
                  onRemove={() => updateFilters({ propertyType: [] })}
                />
              )}
              {(filters.priceMin || filters.priceMax) && (
                <FilterChip
                  label={`$${(filters.priceMin || 0).toLocaleString()} - $${(filters.priceMax || Infinity).toLocaleString()}`}
                  onRemove={() =>
                    updateFilters({ priceMin: undefined, priceMax: undefined })
                  }
                />
              )}
              {filters.bedroomsMin && (
                <FilterChip
                  label={`${filters.bedroomsMin}+ beds`}
                  onRemove={() => updateFilters({ bedroomsMin: undefined })}
                />
              )}
              {filters.bathroomsMin && (
                <FilterChip
                  label={`${filters.bathroomsMin}+ baths`}
                  onRemove={() => updateFilters({ bathroomsMin: undefined })}
                />
              )}
              {(filters.sqftMin || filters.sqftMax) && (
                <FilterChip
                  label={`${(filters.sqftMin || 0).toLocaleString()}-${filters.sqftMax || "∞"} sqft`}
                  onRemove={() =>
                    updateFilters({ sqftMin: undefined, sqftMax: undefined })
                  }
                />
              )}
              {filters.petFriendly && (
                <FilterChip
                  label="Pet Friendly"
                  onRemove={() => updateFilters({ petFriendly: undefined })}
                />
              )}
              {filters.furnished && (
                <FilterChip
                  label="Furnished"
                  onRemove={() => updateFilters({ furnished: undefined })}
                />
              )}
              {filters.parking && (
                <FilterChip
                  label="Parking"
                  onRemove={() => updateFilters({ parking: undefined })}
                />
              )}
              {filters.availableFrom && (
                <FilterChip
                  label={`From ${filters.availableFrom}`}
                  onRemove={() => updateFilters({ availableFrom: undefined })}
                />
              )}
              <button
                onClick={() => {
                  updateFilters({});
                  performSearch();
                }}
                className="text-xs text-realestate-error hover:text-realestate-error/80 font-medium ml-1"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-realestate-text">
            Featured Properties
          </h2>
          {/* could link to all featured */}
        </div>
        <PropertyGrid
          properties={featured}
          loading={loadingFeatured}
          columns={4}
        />
      </div>

      {/* Search Results */}
      <SearchResults
        showFilters={showFilters}
        onToggleFilters={setShowFilters}
      />
    </div>
  );
};
