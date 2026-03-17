import { Tip } from "@/types/tips";

// ---------------------------------------------------------------------------
// Feature-discovery tips (existing mock data for FeatureDiscoveryPopover)
// ---------------------------------------------------------------------------

const mockTips: Tip[] = [
  {
    id: "tip-ai-property-recommendations",
    title: "AI Property Recommendations",
    description:
      "Let our AI analyse market trends and your portfolio to recommend high-yield investment properties tailored to your goals. Properties matched by AI see 23% higher returns on average.",
    featureArea: "AI Insights",
    relevanceScore: 92,
    ctaText: "Explore Recommendations",
    ctaLink: "/dashboard?feature=ai-recommendations",
    dismissed: false,
    reason: "",
  },
  {
    id: "tip-ai-chatbot",
    title: "AI Chatbot for Tenants",
    description:
      "Deploy an AI-powered chatbot that handles tenant enquiries 24/7—maintenance requests, lease questions, and payment reminders—reducing your response time by up to 80%.",
    featureArea: "Tenant Communication",
    relevanceScore: 85,
    ctaText: "Set Up Chatbot",
    ctaLink: "/dashboard?feature=ai-chatbot",
    dismissed: false,
    reason: "",
  },
  {
    id: "tip-smart-pricing",
    title: "Smart Pricing Suggestions",
    description:
      "Our AI continuously monitors local rental markets and suggests optimal pricing for your units. Landlords using Smart Pricing fill vacancies 35% faster.",
    featureArea: "Rent Optimisation",
    relevanceScore: 78,
    ctaText: "View Pricing Insights",
    ctaLink: "/dashboard?feature=smart-pricing",
    dismissed: false,
    reason: "",
  },
  {
    id: "tip-ai-tenant-screening",
    title: "AI-Assisted Tenant Screening",
    description:
      "Speed up your tenant screening process with AI that analyses applications, credit history, and references in seconds—giving you a comprehensive risk score for every applicant.",
    featureArea: "Tenant Screening",
    relevanceScore: 88,
    ctaText: "Try Screening",
    ctaLink: "/applications",
    dismissed: false,
    reason: "",
  },
  {
    id: "tip-predictive-maintenance",
    title: "Predictive Maintenance Alerts",
    description:
      "Get ahead of costly repairs. Our AI predicts maintenance issues before they escalate, helping you save an average of $1,200 per property per year on emergency repairs.",
    featureArea: "Predictive Maintenance",
    relevanceScore: 74,
    ctaText: "Enable Alerts",
    ctaLink: "/maintenance",
    dismissed: false,
    reason: "",
  },
];

export async function getTips(_userId: string): Promise<Tip[]> {
  // Mock implementation — returns static data
  return Promise.resolve(mockTips.map((tip) => ({ ...tip })));
}

export async function updateTip(
  tipId: string,
  updates: Partial<Tip>,
): Promise<Tip> {
  const index = mockTips.findIndex((t) => t.id === tipId);
  if (index === -1) {
    throw new Error(`Tip not found: ${tipId}`);
  }
  mockTips[index] = { ...mockTips[index], ...updates };
  return Promise.resolve({ ...mockTips[index] });
}

// ---------------------------------------------------------------------------
// Context-aware in-app tips (for FeatureTooltip & OnboardingTour)
// ---------------------------------------------------------------------------

export interface ContextTip {
  id: string;
  title: string;
  description: string;
  targetElementId: string;
  contexts: string[];
}

const DISMISSED_STORAGE_KEY = "realEstateAI_dismissedTips";

/** Predefined context-aware tips for feature discovery tooltips */
export const contextTips: Record<string, ContextTip> = {
  "property-search-tip": {
    id: "property-search-tip",
    title: "Search & Filter Properties",
    description:
      "Use the search bar and filters to quickly find properties by location, price range, or property type.",
    targetElementId: "property-search",
    contexts: ["property-listings", "dashboard"],
  },
  "tenant-screening-tip": {
    id: "tenant-screening-tip",
    title: "Tenant Screening",
    description:
      "Run comprehensive background checks and credit reports on prospective tenants directly from the application.",
    targetElementId: "tenant-screening",
    contexts: ["tenant-screening"],
  },
  "lease-management-tip": {
    id: "lease-management-tip",
    title: "Create & Manage Leases",
    description:
      "Create digital lease agreements, set renewal reminders, and track lease terms all in one place.",
    targetElementId: "lease-management",
    contexts: ["lease-management"],
  },
  "rent-collection-tip": {
    id: "rent-collection-tip",
    title: "Online Rent Collection",
    description:
      "Set up automatic rent collection with Stripe. Tenants can pay via credit card or bank transfer.",
    targetElementId: "rent-collection",
    contexts: ["rent-collection", "payments"],
  },
  "accounting-tip": {
    id: "accounting-tip",
    title: "Financial Reports",
    description:
      "Generate income statements, expense reports, and tax-ready financial summaries for your properties.",
    targetElementId: "accounting-reports",
    contexts: ["accounting", "dashboard"],
  },
  "maintenance-tip": {
    id: "maintenance-tip",
    title: "Maintenance Requests",
    description:
      "Create, assign, and track maintenance requests. Tenants can submit requests and receive status updates.",
    targetElementId: "maintenance-requests",
    contexts: ["maintenance"],
  },
  "dashboard-stats-tip": {
    id: "dashboard-stats-tip",
    title: "Dashboard Overview",
    description:
      "Your dashboard shows key metrics at a glance — occupancy rates, upcoming payments, and recent activity.",
    targetElementId: "dashboard-stats",
    contexts: ["dashboard"],
  },
};

function getDismissedTipIds(): Set<string> {
  try {
    const stored = localStorage.getItem(DISMISSED_STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    localStorage.removeItem(DISMISSED_STORAGE_KEY);
  }
  return new Set();
}

function saveDismissedTipIds(dismissed: Set<string>): void {
  localStorage.setItem(
    DISMISSED_STORAGE_KEY,
    JSON.stringify(Array.from(dismissed)),
  );
}

/** Returns a context tip by ID. */
export function getContextTip(tipId: string): ContextTip | undefined {
  return contextTips[tipId];
}

/** Returns all registered context tips. */
export function getAllContextTips(): ContextTip[] {
  return Object.values(contextTips);
}

/** Checks whether a tip should be shown for the given context. */
export function shouldShowTip(tipId: string, currentContext: string): boolean {
  const tip = contextTips[tipId];
  if (!tip) return false;
  if (!tip.contexts.includes(currentContext)) return false;
  return !getDismissedTipIds().has(tipId);
}

/** Marks a tip as dismissed so it won't appear again. */
export function markTipAsDismissed(tipId: string): void {
  const dismissed = getDismissedTipIds();
  dismissed.add(tipId);
  saveDismissedTipIds(dismissed);
}

/** Resets all dismissed tips (useful for development/testing). */
export function resetTips(): void {
  localStorage.removeItem(DISMISSED_STORAGE_KEY);
}

/** Returns all undismissed context tips for a given context. */
export function getTipsForContext(currentContext: string): ContextTip[] {
  const dismissed = getDismissedTipIds();
  return Object.values(contextTips).filter(
    (tip) => tip.contexts.includes(currentContext) && !dismissed.has(tip.id),
  );
}
