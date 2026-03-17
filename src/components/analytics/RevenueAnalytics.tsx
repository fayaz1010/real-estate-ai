import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart,
} from "recharts";

import type { RevenueTrend } from "../../types/analytics";

interface RevenueAnalyticsProps {
  data: RevenueTrend[];
}

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
}

export const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    ...d,
    label: formatMonth(d.month),
  }));

  const totalRevenue = data.reduce((sum, d) => sum + d.total, 0);
  const totalRental = data.reduce((sum, d) => sum + d.rental, 0);
  const totalOther = data.reduce((sum, d) => sum + d.other, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            className="text-lg font-bold mb-1"
            style={{ color: "#091a2b", fontFamily: "Montserrat, sans-serif" }}
          >
            Revenue Analytics
          </h3>
          <p
            className="text-sm"
            style={{ color: "#5a6a7a", fontFamily: "Open Sans, sans-serif" }}
          >
            Rental income and other revenue sources
          </p>
        </div>
        <div className="text-right">
          <p
            className="text-xs uppercase tracking-wider"
            style={{ color: "#5a6a7a" }}
          >
            Period Total
          </p>
          <p
            className="text-xl font-bold"
            style={{ color: "#091a2b", fontFamily: "Montserrat, sans-serif" }}
          >
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: "#005163" }}
          />
          <span className="text-xs" style={{ color: "#5a6a7a" }}>
            Rental: ${totalRental.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: "#3b4876" }}
          />
          <span className="text-xs" style={{ color: "#5a6a7a" }}>
            Other: ${totalOther.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#5a6a7a" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#5a6a7a" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                undefined,
              ]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontFamily: "Open Sans, sans-serif",
                fontSize: 13,
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: 13,
                fontFamily: "Open Sans, sans-serif",
              }}
            />
            <Bar
              dataKey="rental"
              name="Rental Income"
              fill="#005163"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="other"
              name="Other Revenue"
              fill="#3b4876"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Revenue"
              stroke="#091a2b"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
