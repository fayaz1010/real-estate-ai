export enum MaintenanceSystemType {
  HVAC = "HVAC",
  PLUMBING = "PLUMBING",
  ELECTRICAL = "ELECTRICAL",
  ROOFING = "ROOFING",
  APPLIANCE = "APPLIANCE",
  STRUCTURAL = "STRUCTURAL",
}

export interface MaintenanceRecord {
  id: string;
  propertyId: string;
  systemType: MaintenanceSystemType;
  description: string;
  cost: number;
  completedAt: string;
  nextPredictedDate?: string | null;
  createdAt: string;
}

export interface MaintenancePrediction {
  id: string;
  propertyId: string;
  systemType: MaintenanceSystemType;
  predictedFailureDate: string;
  confidence: number;
  createdAt: string;
}

export interface PropertyMaintenanceData {
  propertyId: string;
  propertyTitle: string;
  yearBuilt?: number;
  records: MaintenanceRecord[];
  predictions: MaintenancePrediction[];
}

export interface SystemRisk {
  systemType: MaintenanceSystemType;
  riskLevel: number;
  lastMaintenance?: string;
  nextPredicted?: string;
}
