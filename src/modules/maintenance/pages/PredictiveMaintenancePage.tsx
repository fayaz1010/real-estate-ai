import { ArrowDown, Building2, Filter } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import {
  maintenanceService,
  type MaintenancePrediction as MaintenancePredictionType,
} from "../api/maintenanceService";
import { MaintenancePrediction } from "../components/MaintenancePrediction";

type SortField = "propertyName" | "probability" | "estimatedCost";
type SortDirection = "asc" | "desc";

export const PredictiveMaintenancePage: React.FC = () => {
  const [predictions, setPredictions] = useState<MaintenancePredictionType[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("probability");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterProperty, setFilterProperty] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchPredictions() {
      try {
        setLoading(true);
        setError(null);
        const data = await maintenanceService.getAllPredictions();
        if (!cancelled) {
          setPredictions(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load predictions",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPredictions();
    return () => {
      cancelled = true;
    };
  }, []);

  const propertyNames = useMemo(() => {
    const names = new Set(predictions.map((p) => p.propertyName));
    return Array.from(names).sort();
  }, [predictions]);

  const filteredAndSorted = useMemo(() => {
    let result = predictions;

    if (filterProperty) {
      result = result.filter((p) => p.propertyName === filterProperty);
    }

    return [...result].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp =
        typeof aVal === "string"
          ? aVal.localeCompare(bVal as string)
          : (aVal as number) - (bVal as number);
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [predictions, filterProperty, sortField, sortDirection]);

  const grouped = useMemo(() => {
    const map = new Map<string, MaintenancePredictionType[]>();
    for (const pred of filteredAndSorted) {
      const key = pred.propertyName;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(pred);
    }
    return map;
  }, [filteredAndSorted]);

  function handleSortChange(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "propertyName" ? "asc" : "desc");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-2 font-montserrat text-3xl font-bold text-primary">
          Predictive Maintenance
        </h1>
        <p className="mb-8 font-body text-realestate-text-secondary">
          AI-powered predictions for potential maintenance issues across your
          properties.
        </p>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-realestate-text-secondary" />
            <select
              value={filterProperty}
              onChange={(e) => setFilterProperty(e.target.value)}
              className="rounded-md border border-realestate-border bg-white px-3 py-2 font-body text-sm text-text_primary focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="">All Properties</option>
              {propertyNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4 text-realestate-text-secondary" />
            <span className="font-body text-sm text-realestate-text-secondary">
              Sort by:
            </span>
            {(
              [
                ["probability", "Risk"],
                ["estimatedCost", "Cost"],
                ["propertyName", "Property"],
              ] as const
            ).map(([field, label]) => (
              <button
                key={field}
                onClick={() => handleSortChange(field)}
                className={`rounded-md px-3 py-1.5 font-body text-sm transition-colors ${
                  sortField === field
                    ? "bg-primary text-white"
                    : "bg-white text-text_primary hover:bg-gray-100"
                }`}
              >
                {label}
                {sortField === field &&
                  (sortDirection === "asc" ? " \u2191" : " \u2193")}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-realestate-error/30 bg-red-50 p-6 text-center">
            <p className="font-body text-realestate-error">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-md bg-primary px-4 py-2 font-body text-sm text-white hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && predictions.length === 0 && (
          <div className="rounded-lg border border-realestate-border bg-white p-12 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-realestate-text-muted" />
            <p className="font-body text-lg text-realestate-text-secondary">
              No maintenance predictions available.
            </p>
          </div>
        )}

        {!loading && !error && predictions.length > 0 && (
          <div className="space-y-8">
            {Array.from(grouped.entries()).map(
              ([propertyName, propertyPredictions]) => (
                <div key={propertyName}>
                  <div className="mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-secondary" />
                    <h2 className="font-montserrat text-xl font-semibold text-primary">
                      {propertyName}
                    </h2>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 font-body text-xs text-realestate-text-secondary">
                      {propertyPredictions.length} prediction
                      {propertyPredictions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {propertyPredictions.map((prediction, idx) => (
                      <MaintenancePrediction
                        key={`${prediction.propertyId}-${idx}`}
                        prediction={prediction}
                      />
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};
