export interface PortfolioMetrics {
  totalProperties: number;
  totalUnits: number;
  occupancyRate: number;
  avgRent: number;
  totalRevenue: number;
  totalExpenses: number;
  noi: number;
  capRate: number;
}

export interface OccupancyData {
  month: string;
  occupied: number;
  vacant: number;
  rate: number;
}

export interface RevenueTrend {
  month: string;
  rental: number;
  other: number;
  total: number;
}

export interface MaintenanceTrends {
  month: string;
  open: number;
  completed: number;
  avgResolutionTime: number;
}

export interface ReportConfig {
  metrics: string[];
  dateRange: { startDate: string; endDate: string };
  groupBy: "property" | "month" | "quarter" | "year";
}

export interface PropertyBreakdown {
  propertyId: string;
  propertyName: string;
  metrics: PortfolioMetrics;
}

export interface AIInsight {
  type: "vacancy_alert" | "rent_optimization" | "maintenance_forecast";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  actionable: boolean;
  recommendation?: string;
}
