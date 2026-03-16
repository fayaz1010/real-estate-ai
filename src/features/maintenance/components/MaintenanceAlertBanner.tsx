import React from 'react';
import { MaintenancePrediction } from '../types';

interface MaintenanceAlertBannerProps {
  predictions: MaintenancePrediction[];
  propertyNames?: Record<string, string>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getSystemLabel(type: string): string {
  const labels: Record<string, string> = {
    HVAC: 'HVAC System',
    PLUMBING: 'Plumbing',
    ELECTRICAL: 'Electrical',
    ROOFING: 'Roofing',
    APPLIANCE: 'Appliance',
    STRUCTURAL: 'Structural',
  };
  return labels[type] ?? type;
}

export const MaintenanceAlertBanner: React.FC<MaintenanceAlertBannerProps> = ({
  predictions,
  propertyNames = {},
}) => {
  if (predictions.length === 0) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-5 w-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-red-800">
            Urgent Maintenance Alerts
          </h3>
          <p className="mt-1 font-body text-sm text-red-700">
            {predictions.length} system{predictions.length !== 1 ? 's' : ''} predicted to need
            attention within the next 30 days.
          </p>
          <ul className="mt-3 space-y-2">
            {predictions.map((prediction) => (
              <li
                key={prediction.id}
                className="flex items-center justify-between rounded-md bg-white/60 px-3 py-2"
              >
                <div>
                  <span className="font-body text-sm font-medium text-red-900">
                    {getSystemLabel(prediction.systemType)}
                  </span>
                  {propertyNames[prediction.propertyId] && (
                    <span className="ml-2 font-body text-xs text-red-600">
                      — {propertyNames[prediction.propertyId]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-body text-xs text-red-600">
                    {formatDate(prediction.predictedFailureDate)}
                  </span>
                  <span className="rounded-full bg-red-200 px-2 py-0.5 font-body text-xs font-medium text-red-800">
                    {Math.round(prediction.confidence * 100)}% confidence
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
