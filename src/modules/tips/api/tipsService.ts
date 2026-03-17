export interface Tip {
  id: string;
  targetElement: string;
  title: string;
  content: string;
  type: "tooltip" | "featureHighlight";
  isNew: boolean;
}

const mockTips: Tip[] = [
  {
    id: "tip-search-filters",
    targetElement: "[data-tip='search-filters']",
    title: "Advanced Search Filters",
    content:
      "Use filters to narrow down properties by price, bedrooms, location, and more.",
    type: "tooltip",
    isNew: false,
  },
  {
    id: "tip-map-view",
    targetElement: "[data-tip='map-view']",
    title: "Interactive Map View",
    content:
      "Switch to map view to explore properties visually and see nearby amenities.",
    type: "featureHighlight",
    isNew: true,
  },
  {
    id: "tip-save-property",
    targetElement: "[data-tip='save-property']",
    title: "Save Properties",
    content:
      "Click the heart icon to save properties to your favorites for easy access later.",
    type: "tooltip",
    isNew: false,
  },
  {
    id: "tip-virtual-tour",
    targetElement: "[data-tip='virtual-tour']",
    title: "Virtual Tours",
    content:
      "Take a 360° virtual tour of properties without leaving your home.",
    type: "featureHighlight",
    isNew: true,
  },
  {
    id: "tip-mortgage-calculator",
    targetElement: "[data-tip='mortgage-calculator']",
    title: "Mortgage Calculator",
    content:
      "Estimate your monthly payments with our built-in mortgage calculator.",
    type: "tooltip",
    isNew: false,
  },
  {
    id: "tip-maintenance-requests",
    targetElement: "[data-tip='maintenance-requests']",
    title: "Predictive Maintenance",
    content:
      "AI-powered maintenance predictions help you stay ahead of repairs and reduce costs.",
    type: "featureHighlight",
    isNew: true,
  },
  {
    id: "tip-schedule-inspection",
    targetElement: "[data-tip='schedule-inspection']",
    title: "Smart Scheduling",
    content:
      "Book property inspections with intelligent time-slot suggestions based on availability.",
    type: "tooltip",
    isNew: false,
  },
  {
    id: "tip-workflow-automation",
    targetElement: "[data-tip='workflow-automation']",
    title: "Automated Workflows",
    content:
      "Set up automated workflows to streamline tenant onboarding, lease renewals, and more.",
    type: "featureHighlight",
    isNew: true,
  },
];

export async function fetchTips(): Promise<Tip[]> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTips), 300);
  });
}
