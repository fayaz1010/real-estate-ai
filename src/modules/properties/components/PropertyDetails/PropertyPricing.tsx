// FILE PATH: src/modules/properties/components/PropertyDetails/PropertyPricing.tsx
// Module 1.2: Property Listings Management - Property Pricing Component

import {
  TrendingUp,
  TrendingDown,
  Info,
  Home,
  DollarSign as DollarSignIcon,
  Calendar,
  Percent,
  MapPin,
  Clock,
  TrendingUp as TrendingIcon,
} from "lucide-react";
import React, { useState } from "react";

import { MortgageCalculator } from "../../../../components/MortgageCalculator";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { formatCurrency } from "../../../../lib/utils";

// Import using relative path to avoid module resolution issues

interface PriceChangeProps {
  change: number;
  className?: string;
}

interface PriceHistoryEntry {
  date: string;
  price: number;
  event: string;
}

interface PropertyPricingData {
  price: number;
  pricePerSqft?: number;
  originalPrice?: number;
  priceChange?: number;
  deposit?: number;
  applicationFee?: number;
  propertyTax?: number;
  hoaFees?: number;
  utilitiesIncluded?: string[];
  priceHistory?: PriceHistoryEntry[];
}

const PriceChange: React.FC<PriceChangeProps> = ({
  change,
  className = "",
}) => {
  const isPositive = change >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"} ${className}`}
    >
      <Icon className="w-4 h-4 mr-1" />
      <span className="text-sm font-medium">
        {Math.abs(change)}% {isPositive ? "increase" : "decrease"}
      </span>
    </div>
  );
};

interface PriceDetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  className?: string;
}

const PriceDetailItem: React.FC<PriceDetailItemProps> = ({
  icon,
  label,
  value,
  description,
  className = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">{label}</span>
          {description && (
            <div className="relative ml-1">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              {showTooltip && (
                <div className="absolute z-10 w-48 p-2 mt-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-md shadow-lg -left-1/2">
                  {description}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-0.5 text-base font-medium text-gray-900">
          {typeof value === "number" ? formatCurrency(value) : value}
        </div>
      </div>
    </div>
  );
};

interface PropertyPricingProps {
  property: {
    pricing: PropertyPricingData;
    listingType: "sale" | "rent";
    propertyType: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  onContactAgent?: () => void;
  onScheduleTour?: () => void;
}

export const PropertyPricing: React.FC<PropertyPricingProps> = ({
  property,
  onContactAgent,
  onScheduleTour,
}) => {
  const { pricing, listingType } = property;
  const isRental = listingType === "rent";
  const priceChange = pricing.priceChange ?? 0;

  // Calculate monthly payment (example calculation)
  const _calculateMonthlyPayment = (): number => {
    if (isRental) return pricing.price;

    // Simple mortgage calculation (30-year fixed, 4% interest)
    const principal = pricing.price;
    const monthlyInterestRate = 0.04 / 12;
    const numberOfPayments = 30 * 12;

    if (monthlyInterestRate === 0) return principal / numberOfPayments;

    return (
      (principal *
        (monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6" id="pricing-section">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {isRental
                ? `${formatCurrency(pricing.price)}/mo`
                : formatCurrency(pricing.price)}
            </h2>
            {priceChange !== 0 && (
              <div className="ml-3">
                <PriceChange change={priceChange} />
              </div>
            )}
          </div>

          {!isRental && (
            <div className="mt-1 text-sm text-gray-500">
              {pricing.pricePerSqft
                ? `$${pricing.pricePerSqft.toLocaleString()} per sq ft`
                : "Price per sq ft not available"}
            </div>
          )}

          {pricing.originalPrice && pricing.originalPrice > pricing.price && (
            <div className="mt-1 text-sm text-gray-500 line-through">
              Was: {formatCurrency(pricing.originalPrice)}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onContactAgent}>
            Contact Agent
          </Button>
          <Button size="sm" onClick={onScheduleTour}>
            Schedule Tour
          </Button>
        </div>
      </div>

      {/* Mortgage Calculator for Sale Properties */}
      {!isRental && (
        <div className="mb-6">
          <MortgageCalculator propertyPrice={pricing.price} />
        </div>
      )}

      {/* Estimated Monthly Payment for Rentals */}
      {isRental && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">
            Estimated monthly payment of {formatCurrency(pricing.price)}
          </h3>
          <p className="mt-1 text-xs text-blue-700">
            Monthly rent amount. Security deposit and application fees may
            apply.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <PriceDetailItem
          icon={<DollarSignIcon className="w-5 h-5" />}
          label={isRental ? "Monthly Rent" : "Price"}
          value={pricing.price}
        />

        {isRental && pricing.deposit && (
          <PriceDetailItem
            icon={<Home className="w-5 h-5" />}
            label="Security Deposit"
            value={pricing.deposit}
            description="Refundable deposit required to secure the property"
          />
        )}

        {pricing.applicationFee && (
          <PriceDetailItem
            icon={<Calendar className="w-5 h-5" />}
            label="Application Fee"
            value={pricing.applicationFee}
            description="Non-refundable fee to process your application"
          />
        )}

        {pricing.propertyTax && (
          <PriceDetailItem
            icon={<Percent className="w-5 h-5" />}
            label="Property Tax"
            value={`${((pricing.propertyTax / pricing.price) * 100).toFixed(2)}%`}
            description="Annual property tax amount"
          />
        )}

        {pricing.hoaFees && (
          <PriceDetailItem
            icon={<MapPin className="w-5 h-5" />}
            label="HOA Fees"
            value={`${formatCurrency(pricing.hoaFees)}/mo`}
            description="Monthly Homeowners Association fees"
          />
        )}

        {pricing.utilitiesIncluded && pricing.utilitiesIncluded.length > 0 && (
          <div className="pt-2">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Utilities Included:
            </h4>
            <div className="flex flex-wrap gap-2">
              {pricing.utilitiesIncluded.map((utility) => (
                <Badge key={utility} variant="outline" className="text-xs">
                  {utility}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Price History
        </h3>
        {pricing.priceHistory && pricing.priceHistory.length > 0 ? (
          <div className="space-y-3">
            {pricing.priceHistory.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">
                    {formatCurrency(entry.price)}
                  </span>
                  {entry.event !== "listed" && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {entry.event.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No price history available</p>
        )}
      </div>

      {/* Additional Financial Tools */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Financial Tools
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" className="text-sm">
            <TrendingIcon className="w-4 h-4 mr-2" />
            Affordability Calculator
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            Refinance Calculator
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            Get Pre-Approved
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            Investment Calculator
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyPricing;
