import type { TrialStatus } from "../types/trial";

const TRIAL_DURATION_DAYS = 14;

function createMockTrialStatus(startDate: Date): TrialStatus {
  const now = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + TRIAL_DURATION_DAYS);

  const msRemaining = endDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
  const isTrialing = daysRemaining > 0;

  return {
    isTrialing,
    trialStartDate: startDate,
    trialEndDate: endDate,
    daysRemaining,
    hasConverted: false,
    usageHighlights: [
      { feature: "Maintenance Requests", usageCount: 3, value: "3 maintenance requests tracked" },
      { feature: "AI Insights", usageCount: 7, value: "7 AI-powered insights generated" },
      { feature: "Potential Savings", usageCount: 1, value: "$12,400 potential savings identified" },
      { feature: "Tenant Screenings", usageCount: 2, value: "2 tenant screenings completed" },
    ],
  };
}

export async function startTrial(_userId: string): Promise<TrialStatus> {
  const startDate = new Date();
  const status = createMockTrialStatus(startDate);
  localStorage.setItem("trialStartDate", startDate.toISOString());
  return status;
}

export async function getTrialStatus(_userId: string): Promise<TrialStatus | null> {
  const stored = localStorage.getItem("trialStartDate");
  if (!stored) return null;

  const startDate = new Date(stored);
  return createMockTrialStatus(startDate);
}

export async function convertToPaidPlan(_userId: string, _planId: string): Promise<{ success: boolean }> {
  localStorage.removeItem("trialStartDate");
  return { success: true };
}
