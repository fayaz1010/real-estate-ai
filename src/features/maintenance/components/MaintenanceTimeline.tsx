import React from "react";

import { MaintenanceRecord, MaintenancePrediction } from "../types";

interface MaintenanceTimelineProps {
  records: MaintenanceRecord[];
  predictions: MaintenancePrediction[];
}

interface TimelineItem {
  id: string;
  date: string;
  type: "record" | "prediction";
  systemType: string;
  description: string;
  cost?: number;
  confidence?: number;
}

function getSystemLabel(type: string): string {
  const labels: Record<string, string> = {
    HVAC: "HVAC System",
    PLUMBING: "Plumbing",
    ELECTRICAL: "Electrical",
    ROOFING: "Roofing",
    APPLIANCE: "Appliance",
    STRUCTURAL: "Structural",
  };
  return labels[type] ?? type;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({
  records,
  predictions,
}) => {
  const items: TimelineItem[] = [
    ...records.map((r) => ({
      id: r.id,
      date: r.completedAt,
      type: "record" as const,
      systemType: r.systemType,
      description: r.description,
      cost: r.cost,
    })),
    ...predictions.map((p) => ({
      id: p.id,
      date: p.predictedFailureDate,
      type: "prediction" as const,
      systemType: p.systemType,
      description: `Predicted ${getSystemLabel(p.systemType).toLowerCase()} maintenance needed`,
      confidence: p.confidence,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const now = new Date();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3
        className="font-display text-lg font-semibold"
        style={{ color: "#1A1A2E" }}
      >
        Maintenance Timeline
      </h3>
      <p className="mt-1 font-body text-sm text-gray-500">
        Past records and future predictions
      </p>
      <div className="relative mt-6">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {items.map((item) => {
            const isPast = new Date(item.date) <= now;
            const isRecord = item.type === "record";

            return (
              <div key={item.id} className="relative flex gap-4 pl-10">
                {/* Dot */}
                <div
                  className={`absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 ${
                    isRecord
                      ? "border-[#008080] bg-[#008080]"
                      : "border-orange-400 bg-orange-400"
                  }`}
                />

                <div
                  className={`flex-1 rounded-lg border p-4 ${
                    isRecord
                      ? "border-gray-200 bg-white"
                      : "border-dashed border-orange-200 bg-orange-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 font-body text-xs font-medium ${
                            isRecord
                              ? "bg-[#008080]/10 text-[#008080]"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {isRecord ? "Completed" : "Predicted"}
                        </span>
                        <span
                          className="font-body text-xs font-medium"
                          style={{ color: "#FF6B35" }}
                        >
                          {getSystemLabel(item.systemType)}
                        </span>
                      </div>
                      <p className="mt-1 font-body text-sm text-gray-700">
                        {item.description}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 font-body text-xs ${isPast ? "text-gray-500" : "font-medium text-orange-600"}`}
                    >
                      {formatDate(item.date)}
                    </span>
                  </div>
                  {(item.cost !== undefined ||
                    item.confidence !== undefined) && (
                    <div className="mt-2 flex items-center gap-4">
                      {item.cost !== undefined && (
                        <span className="font-body text-sm font-medium text-gray-900">
                          {formatCurrency(item.cost)}
                        </span>
                      )}
                      {item.confidence !== undefined && (
                        <span className="font-body text-xs text-orange-600">
                          {Math.round(item.confidence * 100)}% confidence
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
