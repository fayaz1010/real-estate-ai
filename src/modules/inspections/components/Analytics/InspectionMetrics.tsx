// ============================================================================
// FILE PATH: src/modules/inspections/components/Analytics/InspectionMetrics.tsx
// Module 1.3: Inspection Booking & Scheduling System - Analytics Component
// ============================================================================

import {
  TrendingUp,
  Calendar,
  Users,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  BarChart,
  AlertCircle,
  MapPin,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { useInspections } from "../../hooks/useInspections";
import {
  InspectionAnalytics,
  PropertyInspectionMetrics,
} from "../../types/inspection.types";

interface InspectionMetricsProps {
  landlordId?: string;
  propertyId?: string;
  type: "landlord" | "property";
  className?: string;
}

export const InspectionMetrics: React.FC<InspectionMetricsProps> = ({
  landlordId,
  propertyId,
  type,
  className = "",
}) => {
  const { loadInspections, isLoading, error } = useInspections();
  const [analytics, setAnalytics] = useState<InspectionAnalytics | null>(null);
  const [propertyMetrics, setPropertyMetrics] =
    useState<PropertyInspectionMetrics | null>(null);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">(
    "30d",
  );

  useEffect(() => {
    loadMetrics();
  }, [landlordId, propertyId, dateRange]);

  const loadMetrics = async () => {
    try {
      // This would call actual API endpoints for analytics
      // For now, we'll use mock data to demonstrate the component
      if (type === "landlord" && landlordId) {
        // Mock landlord analytics data
        const mockAnalytics: InspectionAnalytics = {
          totalInspections: 156,
          conversionRate: 0.68,
          noShowRate: 0.12,
          averageRating: 4.3,
          averageDuration: 25,
          responseTime: 2.5,
          byStatus: {
            pending: 8,
            confirmed: 45,
            checked_in: 12,
            completed: 78,
            cancelled: 8,
            no_show: 3,
            rescheduled: 2,
          },
          peakBookingTimes: [
            { day: "Saturday", hour: 10, count: 23 },
            { day: "Saturday", hour: 14, count: 19 },
            { day: "Sunday", hour: 14, count: 18 },
            { day: "Saturday", hour: 11, count: 16 },
            { day: "Sunday", hour: 15, count: 15 },
          ],
        };
        setAnalytics(mockAnalytics);
      } else if (type === "property" && propertyId) {
        // Mock property metrics data
        const mockPropertyMetrics: PropertyInspectionMetrics = {
          totalViews: 342,
          inspectionRequests: 89,
          completedInspections: 67,
          averageFeedbackRating: 4.2,
          inspectionToApplication: 0.45,
          likedFeatures: [
            "Modern kitchen appliances",
            "Hardwood floors",
            "Natural lighting",
            "Updated bathroom",
            "Spacious layout",
          ],
          commonConcerns: [
            "Limited parking availability",
            "Street noise level",
            "Small closet space",
            "No in-unit laundry",
          ],
        };
        setPropertyMetrics(mockPropertyMetrics);
      }
    } catch (error) {
      console.error("Failed to load metrics:", error);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center py-12 text-red-600 ${className}`}
      >
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>Error loading analytics: {error}</span>
      </div>
    );
  }

  const renderLandlordMetrics = () => {
    if (!analytics) return null;

    return (
      <>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Inspections */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {analytics.totalInspections}
            </h3>
            <p className="text-sm text-gray-600">Total Inspections</p>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% from last month
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">
                Inspection → Application
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {(analytics.conversionRate * 100).toFixed(1)}%
            </h3>
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <div
              className={`mt-2 flex items-center text-xs ${
                analytics.conversionRate > 0.6
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {analytics.conversionRate > 0.6 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-1" />
              )}
              {analytics.conversionRate > 0.6
                ? "Above average"
                : "Below average"}
            </div>
          </div>

          {/* No-Show Rate */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {(analytics.noShowRate * 100).toFixed(1)}%
            </h3>
            <p className="text-sm text-gray-600">No-Show Rate</p>
            <div
              className={`mt-2 flex items-center text-xs ${
                analytics.noShowRate < 0.15 ? "text-green-600" : "text-red-600"
              }`}
            >
              {analytics.noShowRate < 0.15 ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-1" />
              )}
              {analytics.noShowRate < 0.15 ? "Good" : "Needs improvement"}
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {analytics.averageRating.toFixed(1)} / 5.0
            </h3>
            <p className="text-sm text-gray-600">Average Rating</p>
            <div className="flex items-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(analytics.averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Inspection Status Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analytics.byStatus).map(([status, count]) => (
              <div
                key={status}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">
                  {status.replace("_", " ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Booking Times */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Peak Booking Times
            </h3>
          </div>
          <div className="space-y-3">
            {analytics.peakBookingTimes.slice(0, 5).map((time, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600">
                  {time.day} {time.hour}:00
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(time.count / Math.max(...analytics.peakBookingTimes.map((t) => t.count))) * 100}%`,
                    }}
                  />
                </div>
                <div className="w-12 text-sm font-medium text-gray-900 text-right">
                  {time.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Average Duration
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {analytics.averageDuration}{" "}
              <span className="text-lg text-gray-600">min</span>
            </p>
            <p className="text-sm text-gray-600">Per inspection</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Response Time
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {analytics.responseTime}{" "}
              <span className="text-lg text-gray-600">hrs</span>
            </p>
            <p className="text-sm text-gray-600">Average confirmation time</p>
          </div>
        </div>
      </>
    );
  };

  const renderPropertyMetrics = () => {
    if (!propertyMetrics) return null;

    return (
      <>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {propertyMetrics.totalViews}
            </h3>
            <p className="text-sm text-gray-600">Property Views</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {propertyMetrics.inspectionRequests}
            </h3>
            <p className="text-sm text-gray-600">Inspection Requests</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {propertyMetrics.completedInspections}
            </h3>
            <p className="text-sm text-gray-600">Completed Inspections</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {propertyMetrics.averageFeedbackRating.toFixed(1)} / 5.0
            </h3>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Conversion Funnel
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Property Views</span>
                <span className="font-medium text-gray-900">
                  {propertyMetrics.totalViews}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Inspection Requests</span>
                <span className="font-medium text-gray-900">
                  {propertyMetrics.inspectionRequests}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full"
                  style={{
                    width: `${(propertyMetrics.inspectionRequests / propertyMetrics.totalViews) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Completed Inspections</span>
                <span className="font-medium text-gray-900">
                  {propertyMetrics.completedInspections}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{
                    width: `${(propertyMetrics.completedInspections / propertyMetrics.totalViews) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Applications</span>
                <span className="font-medium text-gray-900">
                  {Math.round(
                    propertyMetrics.inspectionToApplication *
                      propertyMetrics.completedInspections,
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-600 h-3 rounded-full"
                  style={{
                    width: `${((propertyMetrics.inspectionToApplication * propertyMetrics.completedInspections) / propertyMetrics.totalViews) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Most Liked Features
            </h3>
            <div className="space-y-2">
              {propertyMetrics.likedFeatures
                .slice(0, 5)
                .map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Common Concerns
            </h3>
            <div className="space-y-2">
              {propertyMetrics.commonConcerns
                .slice(0, 5)
                .map((concern, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-yellow-600">!</span>
                    <span className="text-gray-700">{concern}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {type === "landlord"
              ? "Inspection Analytics"
              : "Property Performance"}
          </h2>
          <p className="text-gray-600">
            {type === "landlord"
              ? "Track your inspection performance and conversion rates"
              : "Analyze how this property is performing"}
          </p>
        </div>

        {/* Date Range Selector */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Metrics Content */}
      {type === "landlord" ? renderLandlordMetrics() : renderPropertyMetrics()}
    </div>
  );
};
