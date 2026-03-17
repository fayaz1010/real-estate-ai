export type OnboardingCategory =
  | "account"
  | "properties"
  | "tenants"
  | "billing"
  | "integrations";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  category: OnboardingCategory;
  completed: boolean;
  required: boolean;
  estimatedMinutes: number;
  guideSlug: string | null;
}

export interface SetupGuide {
  slug: string;
  title: string;
  content: string;
  category: OnboardingCategory;
}
