export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  unitId?: string;
  category:
    | "plumbing"
    | "electrical"
    | "hvac"
    | "structural"
    | "appliance"
    | "other";
  description: string;
  priority: "low" | "medium" | "high" | "emergency";
  status: "open" | "in progress" | "on hold" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date;
  assignedTo?: string;
  costEstimate?: number;
  actualCost?: number;
  notes?: string;
  predictedRiskScore?: number;
  riskFactors?: string[];
}

export interface PredictiveMaintenanceInsight {
  propertyId: string;
  unitId?: string;
  riskScore: number;
  riskFactors: string[];
  predictedIssue: string;
  recommendedAction: string;
  timeline: Date;
}
