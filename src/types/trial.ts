export interface UsageHighlight {
  feature: string;
  usageCount: number;
  value: string;
}

export interface TrialStatus {
  isTrialing: boolean;
  trialStartDate: Date;
  trialEndDate: Date;
  daysRemaining: number;
  hasConverted: boolean;
  usageHighlights: UsageHighlight[];
}
