import { tokenManager } from "../../auth/utils/tokenManager";

export interface MaintenancePrediction {
  propertyId: string;
  propertyName: string;
  issue: string;
  probability: number;
  estimatedCost: number;
  recommendedAction: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4041/api";

class MaintenanceService {
  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...tokenManager.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Request failed with status ${response.status}`,
      );
    }

    return response.json();
  }

  async getAllPredictions(): Promise<MaintenancePrediction[]> {
    return this.request<MaintenancePrediction[]>(
      "/maintenance/predictions",
    );
  }

  async getPredictionsForProperty(
    propertyId: string,
  ): Promise<MaintenancePrediction[]> {
    return this.request<MaintenancePrediction[]>(
      `/maintenance/predictions?propertyId=${encodeURIComponent(propertyId)}`,
    );
  }
}

export const maintenanceService = new MaintenanceService();
