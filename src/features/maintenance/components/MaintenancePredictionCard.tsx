import React from 'react';
import { MaintenancePrediction } from '../types';

interface MaintenancePredictionCardProps {
  prediction: MaintenancePrediction;
  propertyName?: string;
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getConfidenceBadge(confidence: number): { label: string; classes: string } {
  const pct = Math.round(confidence * 100);
  if (pct >= 80) return { label: `${pct}% High`, classes: 'bg-red-100 text-red-700' };
  if (pct >= 60) return { label: `${pct}% Medium`, classes: 'bg-orange-100 text-orange-700' };
  return { label: `${pct}% Low`, classes: 'bg-yellow-100 text-yellow-700' };
}

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export const MaintenancePredictionCard: React.FC<MaintenancePredictionCardProps> = ({
  prediction,
  propertyName,
}) => {
  const badge = getConfidenceBadge(prediction.confidence);
  const daysUntil = getDaysUntil(prediction.predictedFailureDate);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <span
            className="font-body text-xs font-semibold uppercase tracking-wide"
            style={{ color: '#3b4876' }}
          >
            {getSystemLabel(prediction.systemType)}
          </span>
          {propertyName && (
            <p className="mt-0.5 font-body text-xs text-gray-500">{propertyName}</p>
          )}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${badge.classes}`}>
          {badge.label}
        </span>
      </div>

      <div className="mt-4">
        <p className="font-body text-sm text-gray-600">Predicted Failure Date</p>
        <p className="mt-0.5 font-display text-lg font-semibold" style={{ color: '#091a2b' }}>
          {formatDate(prediction.predictedFailureDate)}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div
          className={`h-2 flex-1 rounded-full ${
            daysUntil <= 30 ? 'bg-red-200' : daysUntil <= 90 ? 'bg-orange-200' : 'bg-gray-200'
          }`}
        >
          <div
            className={`h-full rounded-full ${
              daysUntil <= 30 ? 'bg-red-500' : daysUntil <= 90 ? 'bg-orange-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, (1 - daysUntil / 365) * 100))}%` }}
          />
        </div>
        <span
          className={`font-body text-xs font-medium ${
            daysUntil <= 30 ? 'text-red-600' : daysUntil <= 90 ? 'text-orange-600' : 'text-gray-500'
          }`}
        >
          {daysUntil <= 0 ? 'Overdue' : `${daysUntil}d`}
        </span>
      </div>

      <p className="mt-3 font-body text-sm text-gray-500">
        Predicted {getSystemLabel(prediction.systemType).toLowerCase()} maintenance needed based on
        historical data and system age analysis.
      </p>
    </div>
  );
};
