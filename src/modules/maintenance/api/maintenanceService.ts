import apiClient from "@/api/client";

export interface MaintenancePrediction {
  propertyId: string;
  propertyName: string;
  issue: string;
  probability: number;
  estimatedCost: number;
  recommendedAction: string;
}

class MaintenanceService {
  async getAllPredictions(): Promise<MaintenancePrediction[]> {
    const response = await apiClient.get<MaintenancePrediction[]>(
      "/maintenance/predictions",
    );
    return response.data;
  }

  async getPredictionsForProperty(
    propertyId: string,
  ): Promise<MaintenancePrediction[]> {
    const response = await apiClient.get<MaintenancePrediction[]>(
      "/maintenance/predictions",
      { params: { propertyId } },
    );
    return response.data;
  }
}

export const maintenanceService = new MaintenanceService();
