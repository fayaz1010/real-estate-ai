// PLACEHOLDER FILE: src/modules/inspections/components/Availability/AvailabilityManager.tsx
// TODO: Add your implementation here

import { Calendar, Clock, XCircle, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";

import { useAvailability } from "../../hooks/useAvailability";

import { BlackoutDates } from "./BlackoutDates";
import { BufferTimeSettings } from "./BufferTimeSettings";
import { RecurringSchedule } from "./RecurringSchedule";

interface AvailabilityManagerProps {
  propertyId: string;
}

type TabType = "schedule" | "blackout" | "settings";

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  propertyId,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("schedule");
  const { loadSchedules, loadBlackouts, isLoading } = useAvailability();

  useEffect(() => {
    if (propertyId) {
      loadSchedules(propertyId);
      loadBlackouts(propertyId);
    }
  }, [propertyId, loadSchedules, loadBlackouts]);

  const tabs = [
    {
      id: "schedule" as TabType,
      label: "Recurring Schedule",
      icon: Calendar,
      description: "Set your regular availability",
    },
    {
      id: "blackout" as TabType,
      label: "Blackout Dates",
      icon: XCircle,
      description: "Block specific dates",
    },
    {
      id: "settings" as TabType,
      label: "Buffer Settings",
      icon: Settings,
      description: "Configure time buffers",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Availability Management
          </h2>
        </div>
        <p className="text-gray-600">
          Control when tenants can book inspections for this property
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 px-6 py-4 text-left border-b-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-transparent hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-1">
                  <Icon
                    className={`w-5 h-5 ${
                      activeTab === tab.id ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      activeTab === tab.id ? "text-blue-600" : "text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    activeTab === tab.id ? "text-blue-800" : "text-gray-500"
                  }`}
                >
                  {tab.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : (
          <>
            {activeTab === "schedule" && (
              <RecurringSchedule propertyId={propertyId} />
            )}
            {activeTab === "blackout" && (
              <BlackoutDates propertyId={propertyId} />
            )}
            {activeTab === "settings" && (
              <BufferTimeSettings propertyId={propertyId} />
            )}
          </>
        )}
      </div>

      {/* Help Section */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Quick Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Recurring Schedule:</strong> Set your regular weekly
              availability. This will automatically generate time slots for
              tenants to book.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Blackout Dates:</strong> Block specific dates when you&apos;re
              unavailable (holidays, maintenance, etc.)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Buffer Time:</strong> Add breaks between inspections for
              travel or preparation time
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
