export type Tip = {
  id: string;
  title: string;
  description: string;
  featureArea: string;
  relevanceScore: number;
  ctaText: string;
  ctaLink: string;
  dismissed: boolean;
  reason: string;
};

export type UserFeatureUsage = {
  feature: string;
  lastUsed?: Date;
  usageCount: number;
};
