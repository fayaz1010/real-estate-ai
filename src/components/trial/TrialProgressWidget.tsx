import React from "react";
import { TrendingUp } from "lucide-react";
import type { TrialStatus } from "../../types/trial";

interface TrialProgressWidgetProps {
  trialStatus: TrialStatus;
}

export const TrialProgressWidget: React.FC<TrialProgressWidgetProps> = ({ trialStatus }) => {
  const totalDays = 14;
  const elapsed = totalDays - trialStatus.daysRemaining;
  const percentage = Math.min(100, Math.round((elapsed / totalDays) * 100));

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5" style={{ color: "#3b4876" }} />
        <h3
          className="text-lg font-bold"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: "#091a2b",
          }}
        >
          Trial Progress
        </h3>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-1.5">
          <span>Day {elapsed} of {totalDays}</span>
          <span>{trialStatus.daysRemaining} days left</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: "#3b4876",
            }}
          />
        </div>
      </div>

      {/* Usage Highlights */}
      {trialStatus.usageHighlights.length > 0 && (
        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            What you've accomplished
          </p>
          {trialStatus.usageHighlights.map((highlight) => (
            <div
              key={highlight.feature}
              className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{ backgroundColor: "#f1f3f4" }}
            >
              <span className="text-sm text-gray-700">{highlight.feature}</span>
              <span
                className="text-sm font-semibold"
                style={{ color: "#3b4876" }}
              >
                {highlight.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
