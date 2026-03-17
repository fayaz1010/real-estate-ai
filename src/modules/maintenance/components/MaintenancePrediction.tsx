import { AlertTriangle, DollarSign, Wrench } from "lucide-react";
import React from "react";

import { formatCurrency } from "../../../lib/utils";
import type { MaintenancePrediction as MaintenancePredictionType } from "../api/maintenanceService";

interface MaintenancePredictionProps {
  prediction: MaintenancePredictionType;
}

function getProbabilityColor(probability: number): string {
  if (probability >= 0.7) return "bg-red-500";
  if (probability >= 0.4) return "bg-yellow-500";
  return "bg-green-500";
}

function getProbabilityLabel(probability: number): string {
  if (probability >= 0.7) return "High";
  if (probability >= 0.4) return "Medium";
  return "Low";
}

function getProbabilityBadgeClass(probability: number): string {
  if (probability >= 0.7) return "bg-red-100 text-red-800";
  if (probability >= 0.4) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
}

export const MaintenancePrediction: React.FC<MaintenancePredictionProps> = ({
  prediction,
}) => {
  const percent = Math.round(prediction.probability * 100);

  return (
    <div className="rounded-lg border border-realestate-border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0 text-secondary" />
          <h4 className="font-body text-base font-semibold text-primary">
            {prediction.issue}
          </h4>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${getProbabilityBadgeClass(prediction.probability)}`}
        >
          {getProbabilityLabel(prediction.probability)} Risk
        </span>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-body text-sm text-realestate-text-secondary">
            Probability
          </span>
          <span className="font-body text-sm font-medium text-text_primary">
            {percent}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all ${getProbabilityColor(prediction.probability)}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-realestate-text-secondary" />
          <span className="font-body text-sm text-realestate-text-secondary">
            Estimated Cost:
          </span>
          <span className="font-body text-sm font-semibold text-text_primary">
            {formatCurrency(prediction.estimatedCost)}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-realestate-text-secondary" />
          <span className="font-body text-sm text-realestate-text-secondary">
            Action:
          </span>
          <span className="font-body text-sm text-text_primary">
            {prediction.recommendedAction}
          </span>
        </div>
      </div>
    </div>
  );
};
