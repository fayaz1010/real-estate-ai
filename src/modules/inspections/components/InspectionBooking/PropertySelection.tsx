// ============================================================================
// FILE PATH: src/modules/inspections/components/InspectionBooking/PropertySelection.tsx
// Module 1.3: Property Selection Step - Production-Ready Component
// ============================================================================

import { Home, MapPin, Check, Search } from "lucide-react";
import React, { useState } from "react";

interface PropertySelectionProps {
  onSelect: (propertyId: string) => void;
  selectedPropertyId?: string | null;
  properties?: Array<{
    id: string;
    title: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
  }>;
}

export const PropertySelection: React.FC<PropertySelectionProps> = ({
  onSelect,
  selectedPropertyId,
  properties = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = properties.filter(
    (prop) =>
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Property
        </h2>
        <p className="text-gray-600">
          Choose the property you&apos;d like to inspect
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Property List */}
      <div className="grid gap-4">
        {filteredProperties.map((property) => (
          <button
            key={property.id}
            onClick={() => onSelect(property.id)}
            className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
              selectedPropertyId === property.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    {property.title}
                  </h3>
                  {selectedPropertyId === property.id && (
                    <Check className="w-5 h-5 text-blue-600 ml-auto" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{property.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <span className="font-semibold text-blue-600">
                    ${property.price}/mo
                  </span>
                  <span>{property.bedrooms} bed</span>
                  <span>{property.bathrooms} bath</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Home className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No properties found</p>
        </div>
      )}
    </div>
  );
};
