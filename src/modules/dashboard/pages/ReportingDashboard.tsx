import {
  DollarSign,
  Home,
  Percent,
  Wrench,
  Clock,
  Building,
  BarChart3,
  Filter,
  CalendarDays,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import {
  getTotalRevenue,
  getOccupancyRate,
  getAverageRent,
  getMaintenanceCosts,
  getVacancyRate,
  getAverageDaysToRent,
} from "../api/dashboardService";
import { AnalyticsCard } from "../components/AnalyticsCard";

interface MetricData {
  value: number;
  previousValue: number;
}

interface DashboardMetrics {
  totalRevenue: MetricData | null;
  occupancyRate: MetricData | null;
  averageRent: MetricData | null;
  maintenanceCosts: MetricData | null;
  vacancyRate: MetricData | null;
  avgDaysToRent: MetricData | null;
}

const MOCK_PROPERTIES = [
  { id: "all", name: "All Properties" },
  { id: "prop-1", name: "Sunrise Apartments" },
  { id: "prop-2", name: "Ocean View Residences" },
  { id: "prop-3", name: "Downtown Lofts" },
  { id: "prop-4", name: "Green Valley Homes" },
  { id: "prop-5", name: "Harbor Point Complex" },
];

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

function formatPercent(val: number): string {
  return `${(val * 100).toFixed(1)}%`;
}

function formatDays(val: number): string {
  return `${Math.round(val)} days`;
}

function calcChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function getDefaultDateRange(): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export const ReportingDashboard: React.FC = () => {
  const defaultRange = getDefaultDateRange();
  const [startDate, setStartDate] = useState(defaultRange.start);
  const [endDate, setEndDate] = useState(defaultRange.end);
  const [propertyId, setPropertyId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: null,
    occupancyRate: null,
    averageRent: null,
    maintenanceCosts: null,
    vacancyRate: null,
    avgDaysToRent: null,
  });

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    const s = new Date(startDate);
    const e = new Date(endDate);
    const pid = propertyId === "all" ? undefined : propertyId;

    const [
      totalRevenue,
      occupancyRate,
      averageRent,
      maintenanceCosts,
      vacancyRate,
      avgDaysToRent,
    ] = await Promise.all([
      getTotalRevenue(s, e, pid),
      getOccupancyRate(s, e, pid),
      getAverageRent(s, e, pid),
      getMaintenanceCosts(s, e, pid),
      getVacancyRate(s, e, pid),
      getAverageDaysToRent(s, e, pid),
    ]);

    setMetrics({
      totalRevenue,
      occupancyRate,
      averageRent,
      maintenanceCosts,
      vacancyRate,
      avgDaysToRent,
    });
    setLoading(false);
  }, [startDate, endDate, propertyId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const cards = [
    {
      title: "Total Revenue",
      data: metrics.totalRevenue,
      format: formatCurrency,
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      title: "Occupancy Rate",
      data: metrics.occupancyRate,
      format: formatPercent,
      icon: <Home className="w-5 h-5" />,
    },
    {
      title: "Average Rent",
      data: metrics.averageRent,
      format: formatCurrency,
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      title: "Maintenance Costs",
      data: metrics.maintenanceCosts,
      format: formatCurrency,
      icon: <Wrench className="w-5 h-5" />,
    },
    {
      title: "Vacancy Rate",
      data: metrics.vacancyRate,
      format: formatPercent,
      icon: <Percent className="w-5 h-5" />,
    },
    {
      title: "Avg Days to Rent",
      data: metrics.avgDaysToRent,
      format: formatDays,
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#f1f3f4]"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[#091a2b] mb-2"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Reporting &amp; Analytics
          </h1>
          <p className="text-[#091a2b]/60 max-w-2xl">
            Gain insights into your property performance with our comprehensive
            reporting dashboard.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-realestate-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-[#3b4876]">
              <Filter className="w-4 h-4" />
              <span
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Filters
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#005163]" />
              <label className="text-sm text-[#091a2b]/70" htmlFor="start-date">
                From
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-[#091a2b] focus:outline-none focus:ring-2 focus:ring-[#005163]/30 focus:border-[#005163]"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-[#091a2b]/70" htmlFor="end-date">
                To
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-[#091a2b] focus:outline-none focus:ring-2 focus:ring-[#005163]/30 focus:border-[#005163]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#005163]" />
              <label
                className="text-sm text-[#091a2b]/70"
                htmlFor="property-select"
              >
                Property
              </label>
              <select
                id="property-select"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-[#091a2b] focus:outline-none focus:ring-2 focus:ring-[#005163]/30 focus:border-[#005163] min-w-[180px]"
              >
                {MOCK_PROPERTIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <AnalyticsCard
              key={card.title}
              title={card.title}
              value={card.data ? card.format(card.data.value) : "--"}
              changePercent={
                card.data
                  ? calcChange(card.data.value, card.data.previousValue)
                  : 0
              }
              icon={card.icon}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportingDashboard;
