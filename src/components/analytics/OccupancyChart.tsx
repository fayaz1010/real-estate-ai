import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import type { OccupancyData } from "../../types/analytics";

interface OccupancyChartProps {
  data: OccupancyData[];
}

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export const OccupancyChart: React.FC<OccupancyChartProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    ...d,
    label: formatMonth(d.month),
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3
        className="text-lg font-bold mb-1"
        style={{ color: "#1A1A2E", fontFamily: "Manrope, sans-serif" }}
      >
        Occupancy Trends
      </h3>
      <p
        className="text-sm mb-4"
        style={{ color: "#5a6a7a", fontFamily: "Inter, sans-serif" }}
      >
        Unit occupancy and vacancy over time
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="occupiedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#008080" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#008080" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="vacantGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#b91c1c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#5a6a7a" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#5a6a7a" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: 13,
                fontFamily: "Inter, sans-serif",
              }}
            />
            <Area
              type="monotone"
              dataKey="occupied"
              name="Occupied Units"
              stroke="#008080"
              fill="url(#occupiedGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="vacant"
              name="Vacant Units"
              stroke="#b91c1c"
              fill="url(#vacantGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
