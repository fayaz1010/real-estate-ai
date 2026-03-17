import {
  MaintenanceSystemType,
  MaintenanceRecord,
  MaintenancePrediction,
} from "../types";

interface PropertyInput {
  propertyId: string;
  yearBuilt?: number;
}

const SYSTEM_LIFESPAN_YEARS: Record<MaintenanceSystemType, number> = {
  [MaintenanceSystemType.HVAC]: 15,
  [MaintenanceSystemType.PLUMBING]: 20,
  [MaintenanceSystemType.ELECTRICAL]: 25,
  [MaintenanceSystemType.ROOFING]: 20,
  [MaintenanceSystemType.APPLIANCE]: 10,
  [MaintenanceSystemType.STRUCTURAL]: 30,
};

const MAINTENANCE_INTERVAL_MONTHS: Record<MaintenanceSystemType, number> = {
  [MaintenanceSystemType.HVAC]: 12,
  [MaintenanceSystemType.PLUMBING]: 18,
  [MaintenanceSystemType.ELECTRICAL]: 24,
  [MaintenanceSystemType.ROOFING]: 12,
  [MaintenanceSystemType.APPLIANCE]: 6,
  [MaintenanceSystemType.STRUCTURAL]: 36,
};

function monthsBetween(dateA: Date, dateB: Date): number {
  return (
    (dateB.getFullYear() - dateA.getFullYear()) * 12 +
    (dateB.getMonth() - dateA.getMonth())
  );
}

function generateId(): string {
  return (
    crypto.randomUUID?.() ??
    `pred-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  );
}

function calculateSystemRisk(
  systemType: MaintenanceSystemType,
  property: PropertyInput,
  records: MaintenanceRecord[],
): { predictedFailureDate: Date; confidence: number } | null {
  const now = new Date();
  const systemRecords = records
    .filter((r) => r.systemType === systemType)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

  const lastRecord = systemRecords[0];
  const intervalMonths = MAINTENANCE_INTERVAL_MONTHS[systemType];
  const lifespanYears = SYSTEM_LIFESPAN_YEARS[systemType];

  let confidence = 0.5;
  let monthsUntilFailure = intervalMonths;

  // Factor 1: Time since last maintenance
  if (lastRecord) {
    const lastDate = new Date(lastRecord.completedAt);
    const monthsSinceLast = monthsBetween(lastDate, now);
    const overdueFactor = monthsSinceLast / intervalMonths;

    if (overdueFactor > 1) {
      confidence += Math.min(0.25, (overdueFactor - 1) * 0.15);
      monthsUntilFailure = Math.max(1, intervalMonths - monthsSinceLast);
    } else {
      monthsUntilFailure = intervalMonths - monthsSinceLast;
      confidence -= 0.1;
    }
  } else {
    // No maintenance records — higher risk
    confidence += 0.15;
    monthsUntilFailure = Math.round(intervalMonths * 0.5);
  }

  // Factor 2: Building age
  if (property.yearBuilt) {
    const buildingAge = now.getFullYear() - property.yearBuilt;
    if (buildingAge > lifespanYears) {
      confidence += 0.2;
      monthsUntilFailure = Math.max(1, Math.round(monthsUntilFailure * 0.6));
    } else if (buildingAge > lifespanYears * 0.7) {
      confidence += 0.1;
      monthsUntilFailure = Math.max(1, Math.round(monthsUntilFailure * 0.8));
    }
  }

  // Factor 3: Frequency of past issues
  if (systemRecords.length >= 3) {
    const recentRecords = systemRecords.slice(0, 3);
    const avgMonthsBetween =
      monthsBetween(
        new Date(recentRecords[recentRecords.length - 1].completedAt),
        new Date(recentRecords[0].completedAt),
      ) /
      (recentRecords.length - 1);

    if (avgMonthsBetween < intervalMonths * 0.5) {
      confidence += 0.1;
      monthsUntilFailure = Math.max(1, Math.round(avgMonthsBetween));
    }
  }

  // Clamp confidence
  confidence = Math.min(0.95, Math.max(0.1, confidence));

  // Skip if predicted too far out and low confidence
  if (monthsUntilFailure > 24 && confidence < 0.4) {
    return null;
  }

  const predictedDate = new Date(now);
  predictedDate.setMonth(predictedDate.getMonth() + monthsUntilFailure);

  return { predictedFailureDate: predictedDate, confidence };
}

export function generatePredictions(
  property: PropertyInput,
  records: MaintenanceRecord[],
): MaintenancePrediction[] {
  const predictions: MaintenancePrediction[] = [];
  const now = new Date().toISOString();

  for (const systemType of Object.values(MaintenanceSystemType)) {
    const result = calculateSystemRisk(systemType, property, records);
    if (result) {
      predictions.push({
        id: generateId(),
        propertyId: property.propertyId,
        systemType,
        predictedFailureDate: result.predictedFailureDate.toISOString(),
        confidence: Math.round(result.confidence * 100) / 100,
        createdAt: now,
      });
    }
  }

  return predictions.sort((a, b) => b.confidence - a.confidence);
}
