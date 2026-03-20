import React from "react";

import { PredictiveMaintenanceInsight } from "@/types/maintenance";

interface MaintenanceTimelineProps {
  insights: PredictiveMaintenanceInsight[];
}

const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({
  insights,
}) => {
  const sortedInsights = [...insights].sort(
    (a, b) => new Date(a.timeline).getTime() - new Date(b.timeline).getTime(),
  );

  return (
    <div className="bg-white shadow-realestate-md rounded-lg p-6 mb-6 border border-gray-100">
      <h3 className="text-lg font-display font-semibold text-[#1A1A2E] mb-4">
        Maintenance Timeline
      </h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#FF6B35]/20" />
        <ul className="space-y-6">
          {sortedInsights.map((insight) => (
            <li key={insight.unitId || "common"} className="relative pl-10">
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-[#008080] border-2 border-white shadow" />
              <div className="bg-[#FFFFFF] rounded-lg p-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-body font-semibold text-[#1A1A2E]">
                    {insight.unitId ? `Unit ${insight.unitId}` : "Common Area"}
                  </span>
                  <span className="text-xs font-medium text-[#008080] bg-[#008080]/10 px-2 py-1 rounded">
                    {new Date(insight.timeline).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#FF6B35]">
                  {insight.predictedIssue}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MaintenanceTimeline;
