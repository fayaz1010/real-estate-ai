// ============================================================================
// FILE PATH: src/modules/inspections/components/InspectionBooking/InspectionTypeSelector.tsx
// Module 1.3: Inspection Type Selection - Production-Ready Component
// ============================================================================

import { Home, Video, Users, Key, Check, Clock, Info } from "lucide-react";
import React from "react";

import { InspectionType } from "../../types/inspection.types";

interface InspectionTypeSelectorProps {
  onSelect: (type: InspectionType) => void;
  selectedType?: InspectionType | null;
}

const inspectionTypes = [
  {
    type: "in_person" as InspectionType,
    icon: Home,
    title: "In-Person Tour",
    description: "Visit the property with a guided tour",
    duration: "30-45 minutes",
    features: [
      "Guided property walkthrough",
      "Ask questions in real-time",
      "Inspect all rooms and amenities",
      "Meet the landlord or agent",
    ],
    popular: true,
  },
  {
    type: "virtual" as InspectionType,
    icon: Video,
    title: "Virtual Tour",
    description: "Live video tour from anywhere",
    duration: "20-30 minutes",
    features: [
      "Live video walkthrough",
      "Remote viewing convenience",
      "Screen sharing of documents",
      "Record the tour for later",
    ],
    popular: false,
  },
  {
    type: "open_house" as InspectionType,
    icon: Users,
    title: "Open House",
    description: "Join a scheduled group viewing",
    duration: "1-2 hours",
    features: [
      "Multiple time slots available",
      "Meet other prospective tenants",
      "Self-guided exploration",
      "Refreshments provided",
    ],
    popular: false,
  },
  {
    type: "self_guided" as InspectionType,
    icon: Key,
    title: "Self-Guided Tour",
    description: "Tour the property at your own pace",
    duration: "Flexible",
    features: [
      "Access via smart lock code",
      "Tour on your schedule",
      "No appointment needed",
      "Instant access available",
    ],
    popular: false,
  },
];

export const InspectionTypeSelector: React.FC<InspectionTypeSelectorProps> = ({
  onSelect,
  selectedType,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Inspection Type
        </h2>
        <p className="text-gray-600">
          Select how you&apos;d like to view the property
        </p>
      </div>

      <div className="grid gap-4">
        {inspectionTypes.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedType === option.type;

          return (
            <button
              key={option.type}
              onClick={() => onSelect(option.type)}
              className={`relative w-full text-left p-6 border-2 rounded-lg transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              {option.popular && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  Popular
                </span>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    isSelected ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isSelected ? "text-blue-600" : "text-gray-600"
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {option.title}
                    </h3>
                    {isSelected && (
                      <Check className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </div>

                  <p className="text-gray-600 mb-3">{option.description}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{option.duration}</span>
                  </div>

                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">Not sure which to choose?</p>
          <p>
            In-person tours are recommended for the best experience. Virtual
            tours are perfect if you&apos;re relocating from another city.
          </p>
        </div>
      </div>
    </div>
  );
};
