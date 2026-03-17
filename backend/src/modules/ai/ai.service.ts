/**
 * @module ai.service
 * @description Service layer for AI endpoints. Returns fabricated data
 * with correct structure until real ML models are integrated.
 */

/** Generate a random float in [min, max], rounded to 2 decimal places. */
function rand(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/** Generate a random integer in [min, max]. */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick a random element from an array. */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// Property Valuation
// ---------------------------------------------------------------------------

interface PropertyValuationInput {
  address: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  recentSales: { address: string; salePrice: number; saleDate: string }[];
}

interface ComparableSale {
  address: string;
  salePrice: number;
  saleDate: string;
}

interface PropertyValuationResult {
  estimatedValue: number;
  confidenceScore: number;
  comparableSales: ComparableSale[];
}

/**
 * Generate a fabricated property valuation based on the provided inputs.
 * @param input - Property details and recent sales data
 * @returns Estimated value, confidence score, and comparable sales
 */
export function generatePropertyValuation(
  input: PropertyValuationInput,
): PropertyValuationResult {
  const avgSalePrice =
    input.recentSales.reduce((sum, s) => sum + s.salePrice, 0) /
    input.recentSales.length;

  const sizeMultiplier = input.size / 1000;
  const bedroomBonus = input.bedrooms * 15000;
  const bathroomBonus = input.bathrooms * 10000;
  const estimatedValue = Math.round(
    avgSalePrice * sizeMultiplier + bedroomBonus + bathroomBonus,
  );

  const confidenceScore = Math.min(
    1,
    Math.max(0, rand(0.7, 0.95) + input.recentSales.length * 0.01),
  );

  const comparableSales: ComparableSale[] = input.recentSales.map((sale) => ({
    address: sale.address,
    salePrice: sale.salePrice,
    saleDate: sale.saleDate,
  }));

  return {
    estimatedValue,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    comparableSales,
  };
}

// ---------------------------------------------------------------------------
// Market Analysis
// ---------------------------------------------------------------------------

interface MarketAnalysisInput {
  city?: string;
  state?: string;
  zipCode?: string;
}

interface MarketAnalysisResult {
  location: string;
  averageRent: number;
  vacancyRate: number;
  medianHomePrice: number;
  marketTrend: "increasing" | "decreasing" | "stable";
  dataSources: string[];
}

/**
 * Generate a fabricated market analysis for the given location.
 * @param input - Location identifiers (city, state, zipCode)
 * @returns Market metrics including rent, vacancy rate, and trends
 */
export function generateMarketAnalysis(
  input: MarketAnalysisInput,
): MarketAnalysisResult {
  const locationParts = [input.city, input.state, input.zipCode].filter(
    Boolean,
  );
  const location = locationParts.join(", ");

  return {
    location,
    averageRent: randInt(1200, 3500),
    vacancyRate: rand(2, 12),
    medianHomePrice: randInt(250000, 750000),
    marketTrend: pick(["increasing", "decreasing", "stable"]),
    dataSources: [
      "MLS Regional Database",
      "Census Bureau ACS Data",
      "Zillow Market Index",
      "Local Property Tax Records",
    ],
  };
}

// ---------------------------------------------------------------------------
// Tenant Screening Insights
// ---------------------------------------------------------------------------

interface TenantScreeningInput {
  creditScore: number;
  backgroundCheck: {
    criminal: "clear" | "minor" | "major";
    eviction: "clear" | "found";
  };
  incomeVerification: {
    monthlyIncome: number;
    employmentStatus: "employed" | "self-employed" | "unemployed" | "retired";
    employmentLength?: number;
  };
}

interface TenantScreeningResult {
  overallRiskScore: number;
  recommendation: "Approve" | "Approve with caution" | "Reject";
  justification: string[];
}

/**
 * Generate fabricated tenant screening insights based on provided data.
 * @param input - Tenant screening data (credit, background, income)
 * @returns Risk score, recommendation, and justification factors
 */
export function generateTenantScreeningInsights(
  input: TenantScreeningInput,
): TenantScreeningResult {
  let riskScore = 0;
  const justification: string[] = [];

  // Credit score factor (0-35 points)
  if (input.creditScore >= 750) {
    riskScore += 5;
    justification.push(
      "Excellent credit score indicates strong financial responsibility.",
    );
  } else if (input.creditScore >= 650) {
    riskScore += 20;
    justification.push("Good credit score within acceptable range.");
  } else if (input.creditScore >= 550) {
    riskScore += 35;
    justification.push("Fair credit score; higher risk of late payments.");
  } else {
    riskScore += 50;
    justification.push(
      "Poor credit score suggests significant financial risk.",
    );
  }

  // Background check factor (0-30 points)
  if (input.backgroundCheck.criminal === "major") {
    riskScore += 30;
    justification.push(
      "Major criminal record found; significant liability concern.",
    );
  } else if (input.backgroundCheck.criminal === "minor") {
    riskScore += 10;
    justification.push("Minor criminal record found; low-level concern.");
  } else {
    justification.push("Criminal background check is clear.");
  }

  if (input.backgroundCheck.eviction === "found") {
    riskScore += 20;
    justification.push("Prior eviction record found; elevated tenancy risk.");
  } else {
    justification.push("No prior eviction records found.");
  }

  // Income verification factor (0-20 points)
  if (input.incomeVerification.employmentStatus === "unemployed") {
    riskScore += 20;
    justification.push("Currently unemployed; income stability concern.");
  } else if (input.incomeVerification.employmentStatus === "self-employed") {
    riskScore += 10;
    justification.push("Self-employed; income may be variable.");
  } else {
    justification.push(
      `Verified ${input.incomeVerification.employmentStatus} status with stable income.`,
    );
  }

  riskScore = Math.min(100, Math.max(0, riskScore));

  let recommendation: TenantScreeningResult["recommendation"];
  if (riskScore <= 25) {
    recommendation = "Approve";
  } else if (riskScore <= 55) {
    recommendation = "Approve with caution";
  } else {
    recommendation = "Reject";
  }

  return { overallRiskScore: riskScore, recommendation, justification };
}

// ---------------------------------------------------------------------------
// Predictive Maintenance
// ---------------------------------------------------------------------------

interface MaintenanceHistoryEntry {
  system: string;
  lastServiceDate: string;
  issueDescription?: string;
}

interface SensorDataEntry {
  sensorType: string;
  reading: number;
  unit: string;
  timestamp: string;
}

interface PredictiveMaintenanceInput {
  propertyAge: number;
  maintenanceHistory: MaintenanceHistoryEntry[];
  sensorData?: SensorDataEntry[];
}

interface MaintenanceIssue {
  issueDescription: string;
  severityLevel: "low" | "medium" | "high";
  estimatedCost: number;
  probabilityOfOccurrence: number;
}

interface PredictiveMaintenanceResult {
  potentialIssues: MaintenanceIssue[];
  recommendedActions: string[];
}

/**
 * Generate fabricated predictive maintenance analysis for a property.
 * @param input - Property age, maintenance history, and optional sensor data
 * @returns Potential issues and recommended preventive actions
 */
export function generatePredictiveMaintenance(
  input: PredictiveMaintenanceInput,
): PredictiveMaintenanceResult {
  const issuePool: {
    description: string;
    system: string;
    severity: "low" | "medium" | "high";
  }[] = [
    {
      description: "HVAC compressor nearing end of service life",
      system: "HVAC",
      severity: "high",
    },
    {
      description: "Water heater anode rod degradation detected",
      system: "Plumbing",
      severity: "medium",
    },
    {
      description: "Roof shingles showing weather wear",
      system: "Roofing",
      severity: "medium",
    },
    {
      description: "Electrical panel requires capacity upgrade",
      system: "Electrical",
      severity: "high",
    },
    {
      description: "Plumbing pipes at risk of corrosion",
      system: "Plumbing",
      severity: "medium",
    },
    {
      description: "Appliance motor bearings wearing",
      system: "Appliance",
      severity: "low",
    },
    {
      description: "Foundation settling detected in north wall",
      system: "Structural",
      severity: "high",
    },
    {
      description: "Smoke detector battery replacement overdue",
      system: "Safety",
      severity: "low",
    },
    {
      description: "Gutter drainage inefficiency increasing",
      system: "Exterior",
      severity: "low",
    },
    {
      description: "Insulation R-value below recommended threshold",
      system: "HVAC",
      severity: "medium",
    },
  ];

  const relevantSystems = new Set(
    input.maintenanceHistory.map((h) => h.system),
  );

  // Generate issues based on property age and history
  const issueCount = Math.min(
    issuePool.length,
    Math.max(2, Math.floor(input.propertyAge / 5)),
  );
  const shuffled = [...issuePool].sort(() => Math.random() - 0.5);
  const selectedIssues = shuffled.slice(0, issueCount);

  const potentialIssues: MaintenanceIssue[] = selectedIssues.map((issue) => {
    const ageFactor = Math.min(1, input.propertyAge / 30);
    const historyFactor = relevantSystems.has(issue.system) ? 0.8 : 1.2;

    return {
      issueDescription: issue.description,
      severityLevel: issue.severity,
      estimatedCost: randInt(200, 8000),
      probabilityOfOccurrence:
        Math.round(rand(0.15, 0.85) * ageFactor * historyFactor * 100) / 100,
    };
  });

  const recommendedActions: string[] = [
    "Schedule annual HVAC inspection and filter replacement.",
    "Conduct plumbing pressure test within the next 30 days.",
    "Arrange roof inspection before the next storm season.",
    "Update electrical panel to meet current code requirements.",
    "Install water leak detection sensors in high-risk areas.",
    "Replace smoke detector batteries on a semi-annual schedule.",
  ].slice(0, Math.max(2, issueCount));

  if (input.sensorData && input.sensorData.length > 0) {
    recommendedActions.push(
      "Review sensor data trends monthly to detect early anomalies.",
    );
  }

  return { potentialIssues, recommendedActions };
}
