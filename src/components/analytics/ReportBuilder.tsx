import React, { useState } from 'react';
import { FileText, Download, Loader } from 'lucide-react';
import type { ReportConfig } from '../../types/analytics';
import { generateCustomReport } from '../../services/analyticsService';

const AVAILABLE_METRICS = [
  { id: 'occupancy', label: 'Occupancy Rate' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'noi', label: 'Net Operating Income' },
  { id: 'capRate', label: 'Cap Rate' },
  { id: 'maintenance', label: 'Maintenance Requests' },
  { id: 'avgRent', label: 'Average Rent' },
  { id: 'vacancy', label: 'Vacancy Rate' },
];

const GROUP_OPTIONS: { value: ReportConfig['groupBy']; label: string }[] = [
  { value: 'month', label: 'Monthly' },
  { value: 'quarter', label: 'Quarterly' },
  { value: 'year', label: 'Yearly' },
  { value: 'property', label: 'By Property' },
];

export const ReportBuilder: React.FC = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'occupancy']);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2026-03-17');
  const [groupBy, setGroupBy] = useState<ReportConfig['groupBy']>('month');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Record<string, unknown> | null>(null);

  const toggleMetric = (id: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleGenerate = async () => {
    if (selectedMetrics.length === 0) return;
    setLoading(true);
    try {
      const config: ReportConfig = {
        metrics: selectedMetrics,
        dateRange: { startDate, endDate },
        groupBy,
      };
      const result = await generateCustomReport(config);
      setReport(result);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#091a2b' }}
        >
          <FileText size={20} className="text-white" />
        </div>
        <div>
          <h3
            className="text-lg font-bold"
            style={{ color: '#091a2b', fontFamily: 'Montserrat, sans-serif' }}
          >
            Custom Report Builder
          </h3>
          <p className="text-sm" style={{ color: '#5a6a7a', fontFamily: 'Open Sans, sans-serif' }}>
            Select metrics and parameters to generate a custom report
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metrics Selection */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: '#091a2b', fontFamily: 'Open Sans, sans-serif' }}
          >
            Metrics
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_METRICS.map((metric) => (
              <button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className="text-left px-3 py-2 rounded-lg border text-sm transition-colors"
                style={{
                  borderColor: selectedMetrics.includes(metric.id) ? '#005163' : '#e5e7eb',
                  backgroundColor: selectedMetrics.includes(metric.id) ? '#00516310' : 'white',
                  color: selectedMetrics.includes(metric.id) ? '#005163' : '#5a6a7a',
                  fontFamily: 'Open Sans, sans-serif',
                }}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: '#091a2b', fontFamily: 'Open Sans, sans-serif' }}
            >
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#005163]"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#005163]"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: '#091a2b', fontFamily: 'Open Sans, sans-serif' }}
            >
              Group By
            </label>
            <div className="flex gap-2">
              {GROUP_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setGroupBy(opt.value)}
                  className="px-3 py-2 rounded-lg border text-sm transition-colors"
                  style={{
                    borderColor: groupBy === opt.value ? '#005163' : '#e5e7eb',
                    backgroundColor: groupBy === opt.value ? '#005163' : 'white',
                    color: groupBy === opt.value ? '#ffffff' : '#5a6a7a',
                    fontFamily: 'Open Sans, sans-serif',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading || selectedMetrics.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#091a2b', fontFamily: 'Open Sans, sans-serif' }}
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <FileText size={16} />}
              Generate Report
            </button>
            {report && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors"
                style={{
                  borderColor: '#005163',
                  color: '#005163',
                  fontFamily: 'Open Sans, sans-serif',
                }}
              >
                <Download size={16} />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Report Results */}
      {report && (
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#f1f3f4' }}>
          <h4
            className="text-sm font-semibold mb-3"
            style={{ color: '#091a2b', fontFamily: 'Montserrat, sans-serif' }}
          >
            Generated Report
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-3 font-semibold" style={{ color: '#091a2b' }}>
                    Period
                  </th>
                  {selectedMetrics.includes('revenue') && (
                    <th className="text-right py-2 px-3 font-semibold" style={{ color: '#091a2b' }}>
                      Revenue
                    </th>
                  )}
                  {selectedMetrics.includes('occupancy') && (
                    <th className="text-right py-2 px-3 font-semibold" style={{ color: '#091a2b' }}>
                      Occupancy
                    </th>
                  )}
                  {selectedMetrics.includes('expenses') && (
                    <th className="text-right py-2 px-3 font-semibold" style={{ color: '#091a2b' }}>
                      Expenses
                    </th>
                  )}
                  {selectedMetrics.includes('noi') && (
                    <th className="text-right py-2 px-3 font-semibold" style={{ color: '#091a2b' }}>
                      NOI
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.isArray((report as Record<string, unknown>).data)
                  ? (
                      (report as Record<string, unknown>).data as Array<Record<string, unknown>>
                    ).map((row, i) => (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="py-2 px-3" style={{ color: '#5a6a7a' }}>
                          {String(row.month || '')}
                        </td>
                        {selectedMetrics.includes('revenue') && (
                          <td className="text-right py-2 px-3" style={{ color: '#091a2b' }}>
                            ${Number(row.total || 0).toLocaleString()}
                          </td>
                        )}
                        {selectedMetrics.includes('occupancy') && (
                          <td className="text-right py-2 px-3" style={{ color: '#091a2b' }}>
                            —
                          </td>
                        )}
                        {selectedMetrics.includes('expenses') && (
                          <td className="text-right py-2 px-3" style={{ color: '#091a2b' }}>
                            —
                          </td>
                        )}
                        {selectedMetrics.includes('noi') && (
                          <td className="text-right py-2 px-3" style={{ color: '#091a2b' }}>
                            —
                          </td>
                        )}
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
