import { useState, useEffect, useCallback } from "react";

import {
  MaintenanceRecord,
  MaintenancePrediction,
  PropertyMaintenanceData,
  MaintenanceSystemType,
  SystemRisk,
} from "../types";
import { generatePredictions } from "../utils/predictionEngine";

// Mock data for development — replace with API calls
const MOCK_RECORDS: MaintenanceRecord[] = [
  {
    id: "1",
    propertyId: "prop-1",
    systemType: MaintenanceSystemType.HVAC,
    description: "Annual HVAC filter replacement and inspection",
    cost: 350,
    completedAt: "2025-06-15T00:00:00Z",
    createdAt: "2025-06-15T00:00:00Z",
  },
  {
    id: "2",
    propertyId: "prop-1",
    systemType: MaintenanceSystemType.PLUMBING,
    description: "Fixed leaking kitchen faucet",
    cost: 180,
    completedAt: "2025-09-20T00:00:00Z",
    createdAt: "2025-09-20T00:00:00Z",
  },
  {
    id: "3",
    propertyId: "prop-1",
    systemType: MaintenanceSystemType.ELECTRICAL,
    description: "Replaced faulty circuit breaker in panel B",
    cost: 520,
    completedAt: "2024-11-10T00:00:00Z",
    createdAt: "2024-11-10T00:00:00Z",
  },
  {
    id: "4",
    propertyId: "prop-2",
    systemType: MaintenanceSystemType.ROOFING,
    description: "Patched roof leak above unit 3B",
    cost: 1200,
    completedAt: "2025-03-05T00:00:00Z",
    createdAt: "2025-03-05T00:00:00Z",
  },
  {
    id: "5",
    propertyId: "prop-2",
    systemType: MaintenanceSystemType.APPLIANCE,
    description: "Replaced water heater thermostat",
    cost: 275,
    completedAt: "2025-12-01T00:00:00Z",
    createdAt: "2025-12-01T00:00:00Z",
  },
  {
    id: "6",
    propertyId: "prop-1",
    systemType: MaintenanceSystemType.HVAC,
    description: "Emergency compressor repair",
    cost: 2100,
    completedAt: "2024-08-03T00:00:00Z",
    createdAt: "2024-08-03T00:00:00Z",
  },
  {
    id: "7",
    propertyId: "prop-3",
    systemType: MaintenanceSystemType.STRUCTURAL,
    description: "Foundation crack inspection and seal",
    cost: 3500,
    completedAt: "2025-01-18T00:00:00Z",
    createdAt: "2025-01-18T00:00:00Z",
  },
];

const MOCK_PROPERTIES = [
  {
    propertyId: "prop-1",
    propertyTitle: "245 Oak Street Apartments",
    yearBuilt: 2005,
  },
  {
    propertyId: "prop-2",
    propertyTitle: "180 Riverside Condos",
    yearBuilt: 1998,
  },
  {
    propertyId: "prop-3",
    propertyTitle: "72 Maple Drive Townhomes",
    yearBuilt: 2012,
  },
];

interface UsePredictiveMaintenanceReturn {
  properties: PropertyMaintenanceData[];
  allRecords: MaintenanceRecord[];
  allPredictions: MaintenancePrediction[];
  urgentPredictions: MaintenancePrediction[];
  systemRisks: SystemRisk[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePredictiveMaintenance(): UsePredictiveMaintenanceReturn {
  const [properties, setProperties] = useState<PropertyMaintenanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const propertyData: PropertyMaintenanceData[] = MOCK_PROPERTIES.map(
        (prop) => {
          const records = MOCK_RECORDS.filter(
            (r) => r.propertyId === prop.propertyId,
          );
          const predictions = generatePredictions(
            { propertyId: prop.propertyId, yearBuilt: prop.yearBuilt },
            records,
          );

          return {
            propertyId: prop.propertyId,
            propertyTitle: prop.propertyTitle,
            yearBuilt: prop.yearBuilt,
            records,
            predictions,
          };
        },
      );

      setProperties(propertyData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch maintenance data",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const allRecords = properties.flatMap((p) => p.records);
  const allPredictions = properties.flatMap((p) => p.predictions);

  const now = new Date();
  const thirtyDaysFromNow = new Date(now);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const urgentPredictions = allPredictions.filter(
    (p) =>
      new Date(p.predictedFailureDate) <= thirtyDaysFromNow &&
      p.confidence >= 0.6,
  );

  // Aggregate risk by system type
  const systemRisks: SystemRisk[] = Object.values(MaintenanceSystemType).map(
    (systemType) => {
      const systemPredictions = allPredictions.filter(
        (p) => p.systemType === systemType,
      );
      const systemRecords = allRecords
        .filter((r) => r.systemType === systemType)
        .sort(
          (a, b) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime(),
        );

      const maxConfidence = systemPredictions.reduce(
        (max, p) => Math.max(max, p.confidence),
        0,
      );

      return {
        systemType,
        riskLevel: maxConfidence,
        lastMaintenance: systemRecords[0]?.completedAt,
        nextPredicted: systemPredictions.sort(
          (a, b) =>
            new Date(a.predictedFailureDate).getTime() -
            new Date(b.predictedFailureDate).getTime(),
        )[0]?.predictedFailureDate,
      };
    },
  );

  return {
    properties,
    allRecords,
    allPredictions,
    urgentPredictions,
    systemRisks,
    isLoading,
    error,
    refresh: fetchData,
  };
}
