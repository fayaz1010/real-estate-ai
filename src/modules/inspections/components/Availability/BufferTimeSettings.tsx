// PLACEHOLDER FILE: src/modules/inspections/components/Availability/BufferTimeSettings.tsx
// TODO: Add your implementation here

import { Clock, Save, Info } from "lucide-react";
import React, { useState } from "react";

interface BufferTimeSettingsProps {
  propertyId: string;
}

export const BufferTimeSettings: React.FC<BufferTimeSettingsProps> = ({
  propertyId: _propertyId,
}) => {
  const [settings, setSettings] = useState({
    defaultBuffer: 15,
    minAdvanceNotice: 2,
    maxAdvanceBooking: 90,
    autoConfirm: false,
    instantBooking: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Buffer & Booking Settings
        </h3>
        <p className="text-sm text-gray-600">
          Configure time buffers and booking preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Default Buffer Time */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-start gap-3 mb-4">
            <Clock className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                Default Buffer Time
              </h4>
              <p className="text-sm text-gray-600">
                Time gap between consecutive inspections for preparation and
                travel
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[0, 15, 30, 45].map((minutes) => (
              <button
                key={minutes}
                onClick={() =>
                  setSettings({ ...settings, defaultBuffer: minutes })
                }
                className={`
                  px-4 py-3 rounded-lg border-2 font-medium transition-colors
                  ${
                    settings.defaultBuffer === minutes
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {minutes === 0 ? "None" : `${minutes} min`}
              </button>
            ))}
          </div>

          <div className="mt-3 p-3 bg-primary/5 rounded-lg text-sm text-primary">
            <Info className="w-4 h-4 inline mr-2" />
            Recommended: 15-30 minutes for local properties, 30-45 minutes if
            traveling between locations
          </div>
        </div>

        {/* Minimum Advance Notice */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-1">
            Minimum Advance Notice
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            How far in advance must tenants book inspections?
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[2, 4, 24, 48].map((hours) => (
              <button
                key={hours}
                onClick={() =>
                  setSettings({ ...settings, minAdvanceNotice: hours })
                }
                className={`
                  px-4 py-3 rounded-lg border-2 font-medium transition-colors
                  ${
                    settings.minAdvanceNotice === hours
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {hours < 24
                  ? `${hours} hours`
                  : `${hours / 24} day${hours > 24 ? "s" : ""}`}
              </button>
            ))}
          </div>
        </div>

        {/* Maximum Advance Booking */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-1">
            Maximum Advance Booking
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            How far in the future can tenants book inspections?
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() =>
                  setSettings({ ...settings, maxAdvanceBooking: days })
                }
                className={`
                  px-4 py-3 rounded-lg border-2 font-medium transition-colors
                  ${
                    settings.maxAdvanceBooking === days
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        {/* Booking Preferences */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">
            Booking Preferences
          </h4>

          <div className="space-y-4">
            {/* Instant Booking */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  checked={settings.instantBooking}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      instantBooking: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                  Instant Booking
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Allow tenants to instantly book available time slots without
                  your approval. You&apos;ll still receive notifications.
                </p>
              </div>
            </label>

            {/* Auto-Confirm */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  checked={settings.autoConfirm}
                  onChange={(e) =>
                    setSettings({ ...settings, autoConfirm: e.target.checked })
                  }
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                  Auto-Confirm After 24 Hours
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Automatically confirm pending inspection requests if you
                  don&apos;t respond within 24 hours.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Summary */}
        <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">
            Current Settings Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Buffer Time</p>
              <p className="font-semibold text-gray-900">
                {settings.defaultBuffer === 0
                  ? "No buffer"
                  : `${settings.defaultBuffer} minutes`}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Advance Notice</p>
              <p className="font-semibold text-gray-900">
                {settings.minAdvanceNotice < 24
                  ? `${settings.minAdvanceNotice} hours`
                  : `${settings.minAdvanceNotice / 24} day${
                      settings.minAdvanceNotice > 24 ? "s" : ""
                    }`}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Booking Window</p>
              <p className="font-semibold text-gray-900">
                Up to {settings.maxAdvanceBooking} days ahead
              </p>
            </div>
            <div>
              <p className="text-gray-600">Booking Mode</p>
              <p className="font-semibold text-gray-900">
                {settings.instantBooking ? "Instant" : "Approval Required"}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-realestate-primary text-white rounded-lg hover:bg-realestate-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>

          {saveSuccess && (
            <span className="text-green-600 font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Settings saved successfully
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
