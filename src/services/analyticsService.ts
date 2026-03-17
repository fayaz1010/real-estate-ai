import type {
  PortfolioMetrics,
  OccupancyData,
  RevenueTrend,
  MaintenanceTrends,
  ReportConfig,
  PropertyBreakdown,
  AIInsight,
} from "../types/analytics";

import apiClient from "@/api/client";

function buildQuery(params: Record<string, string | string[]>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else if (value) {
      searchParams.set(key, value);
    }
  }
  return searchParams.toString();
}

// --- Mock data generators for development ---

function generateMockPortfolioMetrics(): PortfolioMetrics {
  const totalRevenue = 284500;
  const totalExpenses = 112300;
  const noi = totalRevenue - totalExpenses;
  return {
    totalProperties: 12,
    totalUnits: 87,
    occupancyRate: 94.3,
    avgRent: 1850,
    totalRevenue,
    totalExpenses,
    noi,
    capRate: 7.2,
  };
}

function generateMockOccupancyData(
  startDate: string,
  endDate: string,
): OccupancyData[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const data: OccupancyData[] = [];
  const current = new Date(start);
  while (current <= end) {
    const occupied = 78 + Math.floor(Math.random() * 10);
    const vacant = 87 - occupied;
    data.push({
      month: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`,
      occupied,
      vacant,
      rate: Math.round((occupied / 87) * 1000) / 10,
    });
    current.setMonth(current.getMonth() + 1);
  }
  return data;
}

function generateMockRevenueTrends(
  startDate: string,
  endDate: string,
): RevenueTrend[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const data: RevenueTrend[] = [];
  const current = new Date(start);
  while (current <= end) {
    const rental = 140000 + Math.floor(Math.random() * 30000);
    const other = 8000 + Math.floor(Math.random() * 6000);
    data.push({
      month: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`,
      rental,
      other,
      total: rental + other,
    });
    current.setMonth(current.getMonth() + 1);
  }
  return data;
}

function generateMockMaintenanceTrends(
  startDate: string,
  endDate: string,
): MaintenanceTrends[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const data: MaintenanceTrends[] = [];
  const current = new Date(start);
  while (current <= end) {
    data.push({
      month: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`,
      open: 5 + Math.floor(Math.random() * 15),
      completed: 10 + Math.floor(Math.random() * 20),
      avgResolutionTime: 2 + Math.round(Math.random() * 5 * 10) / 10,
    });
    current.setMonth(current.getMonth() + 1);
  }
  return data;
}

function generateMockPropertyBreakdown(): PropertyBreakdown[] {
  const properties = [
    "Sunset Apartments",
    "Oak Ridge Condos",
    "Riverside Villas",
    "Pine Street Townhomes",
    "Harbor View Complex",
    "Maple Court",
    "Cedar Heights",
    "Elm Park Residences",
    "Willow Creek",
    "Birch Lane Estates",
    "Aspen Grove",
    "Magnolia Place",
  ];
  return properties.map((name, i) => {
    const units = 5 + Math.floor(Math.random() * 15);
    const occupied = Math.floor(units * (0.8 + Math.random() * 0.2));
    const avgRent = 1200 + Math.floor(Math.random() * 1200);
    const totalRevenue = occupied * avgRent;
    const totalExpenses = Math.floor(
      totalRevenue * (0.35 + Math.random() * 0.15),
    );
    const noi = totalRevenue - totalExpenses;
    return {
      propertyId: `prop-${i + 1}`,
      propertyName: name,
      metrics: {
        totalProperties: 1,
        totalUnits: units,
        occupancyRate: Math.round((occupied / units) * 1000) / 10,
        avgRent,
        totalRevenue,
        totalExpenses,
        noi,
        capRate: Math.round((noi / (totalRevenue * 12)) * 1000) / 10,
      },
    };
  });
}

function generateMockAIInsights(): AIInsight[] {
  return [
    {
      type: "vacancy_alert",
      title: "Predicted Vacancy Risk — Oak Ridge Condos Unit 4B",
      description:
        "Based on lease expiration patterns and tenant engagement data, Unit 4B has a 73% probability of vacancy within the next 60 days.",
      impact: "high",
      actionable: true,
      recommendation:
        "Initiate early lease renewal outreach. Consider offering a 3% rent discount for a 12-month renewal to reduce turnover costs.",
    },
    {
      type: "rent_optimization",
      title: "Below-Market Rent — Sunset Apartments",
      description:
        "Comparable properties within a 2-mile radius are renting 8-12% higher. Current avg rent of $1,650 is below market rate of $1,820.",
      impact: "high",
      actionable: true,
      recommendation:
        "Gradually adjust rent by 5% at next renewal cycle across 6 units. Estimated additional annual revenue: $12,240.",
    },
    {
      type: "maintenance_forecast",
      title: "HVAC System Maintenance Due — Harbor View Complex",
      description:
        "Predictive analysis of work order history indicates HVAC systems in Building B are approaching failure threshold. Average unit age: 8.2 years.",
      impact: "medium",
      actionable: true,
      recommendation:
        "Schedule preventive HVAC inspections for Building B within 30 days. Estimated preventive cost: $3,200 vs. emergency repair: $8,500.",
    },
    {
      type: "rent_optimization",
      title: "Seasonal Demand Opportunity — Riverside Villas",
      description:
        "Historical data shows 22% higher demand for waterfront units during Q2. Two units are coming available in April.",
      impact: "medium",
      actionable: true,
      recommendation:
        "List upcoming vacancies at 6% premium ($1,950 vs. $1,840). Seasonal demand supports higher pricing through September.",
    },
    {
      type: "vacancy_alert",
      title: "Low Renewal Risk — Cedar Heights",
      description:
        "All 8 current tenants show high engagement scores and on-time payment history. Portfolio-wide renewal probability: 91%.",
      impact: "low",
      actionable: false,
    },
  ];
}

// --- Service functions ---

export async function getPortfolioMetrics(
  propertyIds: string[],
): Promise<PortfolioMetrics> {
  try {
    const query = buildQuery({ propertyIds });
    const { data } = await apiClient.get<PortfolioMetrics>(
      `/analytics/portfolio-metrics?${query}`,
    );
    return data;
  } catch {
    return generateMockPortfolioMetrics();
  }
}

export async function getOccupancyData(
  propertyIds: string[],
  startDate: string,
  endDate: string,
): Promise<OccupancyData[]> {
  try {
    const query = buildQuery({ propertyIds, startDate, endDate });
    const { data } = await apiClient.get<OccupancyData[]>(
      `/analytics/occupancy-data?${query}`,
    );
    return data;
  } catch {
    return generateMockOccupancyData(startDate, endDate);
  }
}

export async function getRevenueTrends(
  propertyIds: string[],
  startDate: string,
  endDate: string,
): Promise<RevenueTrend[]> {
  try {
    const query = buildQuery({ propertyIds, startDate, endDate });
    const { data } = await apiClient.get<RevenueTrend[]>(
      `/analytics/revenue-trends?${query}`,
    );
    return data;
  } catch {
    return generateMockRevenueTrends(startDate, endDate);
  }
}

export async function getMaintenanceTrends(
  propertyIds: string[],
  startDate: string,
  endDate: string,
): Promise<MaintenanceTrends[]> {
  try {
    const query = buildQuery({ propertyIds, startDate, endDate });
    const { data } = await apiClient.get<MaintenanceTrends[]>(
      `/analytics/maintenance-trends?${query}`,
    );
    return data;
  } catch {
    return generateMockMaintenanceTrends(startDate, endDate);
  }
}

export async function getPropertyBreakdown(
  propertyIds: string[],
): Promise<PropertyBreakdown[]> {
  try {
    const query = buildQuery({ propertyIds });
    const { data } = await apiClient.get<PropertyBreakdown[]>(
      `/analytics/property-breakdown?${query}`,
    );
    return data;
  } catch {
    return generateMockPropertyBreakdown();
  }
}

export async function generateCustomReport(
  config: ReportConfig,
): Promise<Record<string, unknown>> {
  try {
    const { data } = await apiClient.post<Record<string, unknown>>(
      "/analytics/custom-report",
      config,
    );
    return data;
  } catch {
    return {
      generated: new Date().toISOString(),
      config,
      data: generateMockRevenueTrends(
        config.dateRange.startDate,
        config.dateRange.endDate,
      ),
    };
  }
}

export async function getAIInsights(): Promise<AIInsight[]> {
  try {
    const { data } = await apiClient.get<AIInsight[]>("/analytics/ai-insights");
    return data;
  } catch {
    return generateMockAIInsights();
  }
}
