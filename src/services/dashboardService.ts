// Dashboard & AI Service - Fetches real data from backend API
import apiClient from "@/api/client";

// Dashboard stats from auth/dashboard endpoint
export interface DashboardStats {
  stats: {
    properties: number;
    applications: number;
    activeInspections: number;
  };
  recentProperties: Array<{
    id: string;
    title: string;
    status: string;
    price: number;
    createdAt: string;
  }>;
  recentApplications: Array<{
    id: string;
    status: string;
    createdAt: string;
    property: { title: string };
  }>;
  upcomingInspections: Array<{
    id: string;
    scheduledDate: string;
    status: string;
    type: string;
    property: { title: string; address: string };
  }>;
}

async function apiFetch<T>(path: string): Promise<T> {
  const { data } = await apiClient.get<{ data: T }>(path);
  return data.data;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/auth/dashboard");
}

// AI Insights
export interface AIInsight {
  id: number;
  type: "maintenance" | "vacancy" | "rent";
  title: string;
  description: string;
  action: string;
  severity: string;
}

export async function fetchAIInsights(): Promise<AIInsight[]> {
  const data = await apiFetch<{ insights: AIInsight[] }>("/ai/insights");
  return data.insights;
}

// Portfolio metrics
export interface PortfolioMetricsData {
  totalProperties: number;
  totalUnits: number;
  occupancyRate: number;
  avgRent: number;
  totalRevenue: number;
  totalExpenses: number;
  noi: number;
  capRate: number;
}

export async function fetchPortfolioMetrics(): Promise<PortfolioMetricsData> {
  const data = await apiFetch<{ metrics: PortfolioMetricsData }>("/ai/portfolio");
  return data.metrics;
}

// Occupancy data
export interface OccupancyDataPoint {
  month: string;
  occupied: number;
  vacant: number;
  rate: number;
}

export async function fetchOccupancyData(): Promise<OccupancyDataPoint[]> {
  const data = await apiFetch<{ occupancy: OccupancyDataPoint[] }>("/ai/occupancy");
  return data.occupancy;
}

// Maintenance trends / predictions
export interface MaintenanceTrendPoint {
  month: string;
  open: number;
  completed: number;
  avgResolutionTime: number;
  predicted: boolean;
}

export interface MaintenancePredictions {
  trends: MaintenanceTrendPoint[];
  summary: {
    avgResolutionDays: number;
    predictedNextMonth: number;
    highRiskProperties: number;
  };
}

export async function fetchMaintenancePredictions(): Promise<MaintenancePredictions> {
  return apiFetch<MaintenancePredictions>("/ai/predictions/maintenance");
}

// Smart scoring for applications
export interface SmartScore {
  applicationId: string;
  overallScore: number;
  categories: Array<{
    label: string;
    score: number;
    maxScore: number;
    weight: number;
  }>;
  recommendation: string;
  riskLevel: string;
  generatedAt: string;
}

export async function fetchSmartScore(applicationId: string): Promise<SmartScore> {
  return apiFetch<SmartScore>(`/ai/scoring/${applicationId}`);
}

// Market analysis
export interface MarketAnalysis {
  propertyId: string;
  marketRent: {
    estimated: number;
    low: number;
    high: number;
    confidence: number;
  };
  comparables: Array<{
    id: string;
    address: string;
    rent: number;
    bedrooms: number;
    distance: number;
  }>;
  trends: {
    rentGrowth12m: number;
    vacancyRate: number;
    daysOnMarket: number;
    demandScore: number;
  };
  generatedAt: string;
}

export async function fetchMarketAnalysis(propertyId: string): Promise<MarketAnalysis> {
  return apiFetch<MarketAnalysis>(`/ai/market-analysis/${propertyId}`);
}

// Inspections from backend
export interface InspectionData {
  id: string;
  propertyId: string;
  userId: string;
  scheduledDate: string;
  type: string;
  status: string;
  notes?: string;
  property: { title: string; address: string };
}

export async function fetchInspections(): Promise<InspectionData[]> {
  return apiFetch<InspectionData[]>("/inspections");
}

// Applications from backend
export interface ApplicationData {
  id: string;
  primaryApplicantId: string;
  propertyId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  property: { title: string; address: string };
  primaryApplicant: { firstName: string; lastName: string; email: string };
}

export async function fetchApplications(): Promise<ApplicationData[]> {
  return apiFetch<ApplicationData[]>("/applications/my-applications");
}

// Admin data - platform stats
export interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  activeLeases: number;
  monthlyRevenue: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const data = await apiFetch<DashboardStats>("/auth/dashboard");
  return {
    totalUsers: 0,
    totalProperties: data.stats.properties,
    activeLeases: 0,
    monthlyRevenue: 0,
  };
}

// Bookings
export interface BookingData {
  id: string;
  title: string;
  type: string;
  status: string;
  startTime: string;
  endTime: string;
  propertyId: string;
  attendees: Array<{ name: string; email: string }>;
}

export async function fetchBookings(): Promise<BookingData[]> {
  return apiFetch<BookingData[]>("/bookings");
}
