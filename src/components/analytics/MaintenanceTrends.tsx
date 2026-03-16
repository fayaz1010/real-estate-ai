import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  ComposedChart,
} from 'recharts';
import type { MaintenanceTrends as MaintenanceTrendsType } from '../../types/analytics';

interface MaintenanceTrendsProps {
  data: MaintenanceTrendsType[];
}

function formatMonth(month: string): string {
  const [year, m] = month.split('-');
  const date = new Date(Number(year), Number(m) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export const MaintenanceTrendsChart: React.FC<MaintenanceTrendsProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    ...d,
    label: formatMonth(d.month),
  }));

  const avgResolution =
    data.length > 0
      ? Math.round((data.reduce((s, d) => s + d.avgResolutionTime, 0) / data.length) * 10) / 10
      : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            className="text-lg font-bold mb-1"
            style={{ color: '#091a2b', fontFamily: 'Montserrat, sans-serif' }}
          >
            Maintenance Trends
          </h3>
          <p
            className="text-sm"
            style={{ color: '#5a6a7a', fontFamily: 'Open Sans, sans-serif' }}
          >
            Request volume and resolution performance
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg text-sm font-semibold"
          style={{
            backgroundColor: '#005163',
            color: '#ffffff',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Avg Resolution: {avgResolution} days
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: '#5a6a7a' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: '#5a6a7a' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#5a6a7a' }}
              axisLine={{ stroke: '#e5e7eb' }}
              unit=" d"
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 13,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 13, fontFamily: 'Open Sans, sans-serif' }} />
            <Bar
              yAxisId="left"
              dataKey="open"
              name="Open Requests"
              fill="#b91c1c"
              radius={[4, 4, 0, 0]}
              barSize={16}
              opacity={0.8}
            />
            <Bar
              yAxisId="left"
              dataKey="completed"
              name="Completed"
              fill="#0e7c3a"
              radius={[4, 4, 0, 0]}
              barSize={16}
              opacity={0.8}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgResolutionTime"
              name="Avg Resolution (days)"
              stroke="#3b4876"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b4876' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
