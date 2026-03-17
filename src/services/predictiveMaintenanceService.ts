import { PredictiveMaintenanceInsight } from "@/types/maintenance";

export const getPredictiveMaintenanceInsights = async (
  propertyId: string,
): Promise<PredictiveMaintenanceInsight[]> => {
  // TODO: Replace with actual API call to fetch AI insights
  return Promise.resolve([
    {
      propertyId: propertyId,
      unitId: "101",
      riskScore: 75,
      riskFactors: ["Old plumbing", "High tenant turnover"],
      predictedIssue: "Water leak in bathroom",
      recommendedAction: "Inspect plumbing and replace old pipes",
      timeline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      propertyId: propertyId,
      unitId: "102",
      riskScore: 60,
      riskFactors: ["Outdated electrical wiring"],
      predictedIssue: "Electrical fire hazard",
      recommendedAction: "Schedule electrical inspection",
      timeline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  ]);
};

export const getPropertyRiskScore = async (
  propertyId: string,
): Promise<number> => {
  // TODO: Replace with actual API call to fetch AI insights
  void propertyId;
  return Promise.resolve(68);
};
