// FILE PATH: src/modules/properties/components/PropertyDetails/PropertyFeatures.tsx
// Module 1.2: Property Listings Management - Property Features Component

import { Check, CheckCircle } from "lucide-react";
import React from "react";

import { Property } from "../../types/property.types";

interface PropertyFeaturesProps {
  property: Pick<Property, "features" | "details">;
}

const featureIcons: Record<string, JSX.Element> = {
  "Air Conditioning": <Check className="w-5 h-5 text-green-500" />,
  Heating: <Check className="w-5 h-5 text-green-500" />,
  Garage: <Check className="w-5 h-5 text-green-500" />,
  "Swimming Pool": <Check className="w-5 h-5 text-green-500" />,
  Garden: <Check className="w-5 h-5 text-green-500" />,
  Balcony: <Check className="w-5 h-5 text-green-500" />,
  Fireplace: <Check className="w-5 h-5 text-green-500" />,
  "Security System": <Check className="w-5 h-5 text-green-500" />,
  Furnished: <Check className="w-5 h-5 text-green-500" />,
  "Hardwood Floors": <Check className="w-5 h-5 text-green-500" />,
};

export const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({
  property,
}) => {
  // Get all unique features from different categories
  const allFeatures = [
    ...(property.features.interior || []),
    ...(property.features.appliances || []),
    ...(property.features.amenities || []),
    ...(property.features.outdoor || []),
  ];

  // Group features by category
  const featuresByCategory = {
    Interior: property.features.interior || [],
    Appliances: property.features.appliances || [],
    Amenities: property.features.amenities || [],
    Outdoor: property.features.outdoor || [],
  };

  // If there are no features, don't render anything
  if (allFeatures.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Property Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(featuresByCategory).map(([category, features]) => {
          if (features.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {category}
              </h3>
              <ul className="space-y-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">
                      {featureIcons[feature] || (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Additional property details */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Additional Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem
            label="Parking"
            value={
              property.details.parking?.spaces
                ? `${property.details.parking.spaces} ${property.details.parking.type}${property.details.parking.spaces > 1 ? "s" : ""}`
                : "None"
            }
          />
          <DetailItem
            label="Laundry"
            value={
              property.details.laundry
                ? property.details.laundry
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "None"
            }
          />
          <DetailItem
            label="Cooling"
            value={
              property.details.cooling
                ? property.details.cooling
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "None"
            }
          />
          <DetailItem
            label="Heating"
            value={
              property.details.heating
                ? property.details.heating
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "None"
            }
          />
        </div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div className="flex items-start">
    <span className="text-gray-500 w-32 flex-shrink-0">{label}:</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

export default PropertyFeatures;
