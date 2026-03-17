// FILE PATH: src/modules/properties/components/PropertySearch/SearchFilters.tsx
// Module 1.2: Property Listings Management - Search Filters Sidebar

import {
  Sliders as SlidersHorizontal,
  X,
  DollarSign,
  Home,
  Droplet,
  Maximize,
  Calendar,
  Filter,
} from "lucide-react";
import React, { useState } from "react";

import { usePropertySearch } from "../../hooks/usePropertySearch";
import { SearchFilters as SearchFiltersType, PropertyType } from "../../types/property.types";
import { searchFilterUtils } from "../../utils/searchFilters";

interface SearchFiltersProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  onClose,
  isMobile = false,
}) => {
  const { filters, updateFilters, resetFilters } = usePropertySearch();
  const [localFilters, setLocalFilters] =
    useState<Partial<SearchFiltersType>>(filters);

  const propertyTypes = [
    { value: "apartment", label: "Apartment", icon: "🏢" },
    { value: "house", label: "House", icon: "🏠" },
    { value: "condo", label: "Condo", icon: "🏘️" },
    { value: "townhouse", label: "Townhouse", icon: "🏡" },
    { value: "studio", label: "Studio", icon: "🚪" },
    { value: "commercial", label: "Commercial", icon: "🏬" },
  ];

  const bedroomOptions = [
    { value: 0, label: "Studio" },
    { value: 1, label: "1+" },
    { value: 2, label: "2+" },
    { value: 3, label: "3+" },
    { value: 4, label: "4+" },
    { value: 5, label: "5+" },
  ];

  const bathroomOptions = [
    { value: 1, label: "1+" },
    { value: 1.5, label: "1.5+" },
    { value: 2, label: "2+" },
    { value: 2.5, label: "2.5+" },
    { value: 3, label: "3+" },
    { value: 4, label: "4+" },
  ];

  const togglePropertyType = (type: string) => {
    const currentTypes = localFilters.propertyType || [];
    const newTypes = currentTypes.includes(type as PropertyType)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type as PropertyType];

    setLocalFilters({ ...localFilters, propertyType: newTypes });
  };

  const handleApply = () => {
    updateFilters({ ...localFilters, page: 1 });
    onClose?.();
  };

  const handleReset = () => {
    resetFilters();
    setLocalFilters({});
    onClose?.();
  };

  const activeFilterCount =
    searchFilterUtils.getActiveFilterCount(localFilters);

  return (
    <div
      className={`bg-white ${isMobile ? "h-full overflow-y-auto" : "rounded-lg shadow-lg"}`}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                {activeFilterCount}
              </span>
            )}
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Filters Content */}
      <div className="p-6 space-y-6">
        {/* Listing Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Listing Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                setLocalFilters({ ...localFilters, listingType: "rent" })
              }
              className={`px-4 py-3 border-2 rounded-lg font-medium transition ${
                localFilters.listingType === "rent"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              For Rent
            </button>
            <button
              onClick={() =>
                setLocalFilters({ ...localFilters, listingType: "sale" })
              }
              className={`px-4 py-3 border-2 rounded-lg font-medium transition ${
                localFilters.listingType === "sale"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              For Sale
            </button>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <DollarSign size={16} />
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder="Min"
                value={localFilters.priceMin || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    priceMin: Number(e.target.value) || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.priceMax || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    priceMax: Number(e.target.value) || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Home size={16} />
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => togglePropertyType(type.value)}
                className={`px-3 py-2 border-2 rounded-lg font-medium transition text-left ${
                  localFilters.propertyType?.includes(type.value as PropertyType)
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Home size={16} />
            Bedrooms
          </label>
          <div className="grid grid-cols-3 gap-2">
            {bedroomOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setLocalFilters({
                    ...localFilters,
                    bedroomsMin: option.value,
                  })
                }
                className={`px-3 py-2 border-2 rounded-lg font-medium transition ${
                  localFilters.bedroomsMin === option.value
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Droplet size={16} />
            Bathrooms
          </label>
          <div className="grid grid-cols-3 gap-2">
            {bathroomOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setLocalFilters({
                    ...localFilters,
                    bathroomsMin: option.value,
                  })
                }
                className={`px-3 py-2 border-2 rounded-lg font-medium transition ${
                  localFilters.bathroomsMin === option.value
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Square Footage */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Maximize size={16} />
            Square Footage
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min sqft"
              value={localFilters.sqftMin || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  sqftMin: Number(e.target.value) || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max sqft"
              value={localFilters.sqftMax || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  sqftMax: Number(e.target.value) || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Additional Filters */}
        <div className="space-y-3 pt-4 border-t">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.petFriendly || false}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  petFriendly: e.target.checked,
                })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Pet Friendly</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.furnished || false}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  furnished: e.target.checked,
                })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Furnished</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.parking || false}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, parking: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Parking Available</span>
          </label>
        </div>

        {/* Available From */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar size={16} />
            Available From
          </label>
          <input
            type="date"
            value={localFilters.availableFrom || ""}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                availableFrom: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-white border-t px-6 py-4">
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
