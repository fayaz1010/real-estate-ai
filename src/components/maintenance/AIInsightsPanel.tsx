import React from "react";

import { PredictiveMaintenanceInsight } from "@/types/maintenance";

interface AIInsightsPanelProps {
  insights: PredictiveMaintenanceInsight[];
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights }) => {
  return (
    <div className="bg-white shadow-realestate-md rounded-lg p-6 mb-6 border border-gray-100">
      <h3 className="text-lg font-display font-semibold text-[#1A1A2E] mb-4">
        AI Insights & Recommendations
      </h3>
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.unitId || "common"}
            className="bg-[#FFFFFF] rounded-lg p-4 border-l-4 border-[#008080]"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="font-body font-semibold text-[#1A1A2E]">
                {insight.unitId ? `Unit ${insight.unitId}: ` : "Common Area: "}
                {insight.predictedIssue}
              </p>
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${
                  insight.riskScore > 70
                    ? "bg-red-100 text-red-700"
                    : insight.riskScore > 30
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-realestate-success/10 text-realestate-success"
                }`}
              >
                Risk: {insight.riskScore}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-[#FF6B35]">
                <span className="font-medium">Risk Factors:</span>{" "}
                {insight.riskFactors.join(", ")}
              </p>
              <p className="text-[#008080]">
                <span className="font-medium">Recommendation:</span>{" "}
                {insight.recommendedAction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsPanel;
