// FILE PATH: src/modules/properties/components/PropertyDetails/PropertyHistory.tsx
// Module 1.2: Property Listings Management - Property History Component

import { TrendingDown, TrendingUp, Calendar } from "lucide-react";
import React from "react";

import { Property } from "../../types/property.types";
import { priceCalculator } from "../../utils/priceCalculator";

interface PropertyHistoryProps {
  property: Property;
}

export const PropertyHistory: React.FC<PropertyHistoryProps> = ({
  property,
}) => {
  const priceHistory = property.pricing.priceHistory || [];

  if (priceHistory.length === 0) {
    return null;
  }

  const latestPrice =
    priceHistory[priceHistory.length - 1]?.price || property.pricing.price;
  const oldestPrice = priceHistory[0]?.price;
  const priceChange = oldestPrice
    ? priceCalculator.calculatePriceChange(oldestPrice, latestPrice)
    : 0;

  // Get min and max for chart scaling
  const prices = priceHistory.map((h) => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Price History</h2>

        {priceChange !== 0 && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              priceChange < 0 ? "bg-green-50" : "bg-red-50"
            }`}
          >
            {priceChange < 0 ? (
              <>
                <TrendingDown className="text-green-600" size={20} />
                <span className="font-semibold text-green-600">
                  {Math.abs(priceChange).toFixed(1)}% decrease
                </span>
              </>
            ) : (
              <>
                <TrendingUp className="text-red-600" size={20} />
                <span className="font-semibold text-red-600">
                  {priceChange.toFixed(1)}% increase
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Simple Line Chart */}
      <div className="mb-6">
        <div className="relative h-48 border-l border-b border-gray-200">
          {/* Y-axis labels */}
          <div className="absolute -left-2 top-0 text-xs text-gray-600 transform -translate-x-full">
            {priceCalculator.formatCurrency(maxPrice)}
          </div>
          <div className="absolute -left-2 bottom-0 text-xs text-gray-600 transform -translate-x-full">
            {priceCalculator.formatCurrency(minPrice)}
          </div>

          {/* Chart line */}
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={priceHistory
                .map((entry, index) => {
                  const x = (index / (priceHistory.length - 1)) * 100;
                  const y = 100 - ((entry.price - minPrice) / priceRange) * 100;
                  return `${x},${y}`;
                })
                .join(" ")}
            />
            <polyline
              fill="url(#gradient)"
              stroke="none"
              points={`0,100 ${priceHistory
                .map((entry, index) => {
                  const x = (index / (priceHistory.length - 1)) * 100;
                  const y = 100 - ((entry.price - minPrice) / priceRange) * 100;
                  return `${x},${y}`;
                })
                .join(" ")} 100,100`}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop
                  offset="0%"
                  style={{ stopColor: "#3B82F6", stopOpacity: 0.2 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#3B82F6", stopOpacity: 0 }}
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Data points */}
          {priceHistory.map((entry, index) => {
            const x = (index / (priceHistory.length - 1)) * 100;
            const y = 100 - ((entry.price - minPrice) / priceRange) * 100;

            return (
              <div
                key={index}
                className="absolute w-3 h-3 bg-blue-600 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
                title={`${new Date(entry.date).toLocaleDateString()}: ${priceCalculator.formatCurrency(entry.price)}`}
              />
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {priceHistory.map((entry, index) => {
          const prevPrice = index > 0 ? priceHistory[index - 1].price : null;
          const change = prevPrice
            ? priceCalculator.calculatePriceChange(prevPrice, entry.price)
            : 0;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {entry.event.replace("_", " ")}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {priceCalculator.formatCurrency(entry.price)}
                </p>
                {change !== 0 && (
                  <p
                    className={`text-xs font-medium ${
                      change < 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {change > 0 && "+"}
                    {change.toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600 mb-1">Original Price</p>
          <p className="font-bold text-gray-900">
            {priceCalculator.formatCurrency(oldestPrice)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Current Price</p>
          <p className="font-bold text-blue-600">
            {priceCalculator.formatCurrency(latestPrice)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Price Change</p>
          <p
            className={`font-bold ${priceChange < 0 ? "text-green-600" : "text-red-600"}`}
          >
            {priceChange > 0 && "+"}
            {priceChange.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyHistory;
