// FILE PATH: src/modules/properties/components/shared/PropertyPrice.tsx
// Module 1.2: Property Listings Management - Property Price Component

import React from 'react';
import { ListingType } from '../../types/property.types';
import { priceCalculator } from '../../utils/priceCalculator';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface PropertyPriceProps {
  price: number;
  listingType: ListingType;
  pricePerSqft?: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPerSqft?: boolean;
  showPriceChange?: boolean;
  className?: string;
}

export const PropertyPrice: React.FC<PropertyPriceProps> = ({
  price,
  listingType,
  pricePerSqft,
  originalPrice,
  size = 'md',
  showPerSqft = false,
  showPriceChange = false,
  className = ''
}) => {
  // Calculate price change if original price provided
  const priceChange = originalPrice ? priceCalculator.calculatePriceChange(originalPrice, price) : 0;
  const hasDecrease = priceChange < 0;
  const hasIncrease = priceChange > 0;

  // Size configurations
  const sizeConfig = {
    sm: {
      price: 'text-lg',
      suffix: 'text-sm',
      perSqft: 'text-xs',
      change: 'text-xs'
    },
    md: {
      price: 'text-2xl',
      suffix: 'text-base',
      perSqft: 'text-sm',
      change: 'text-sm'
    },
    lg: {
      price: 'text-3xl',
      suffix: 'text-lg',
      perSqft: 'text-base',
      change: 'text-base'
    },
    xl: {
      price: 'text-4xl',
      suffix: 'text-xl',
      perSqft: 'text-lg',
      change: 'text-lg'
    }
  }[size];

  return (
    <div className={`${className}`}>
      {/* Main Price */}
      <div className="flex items-baseline gap-2">
        <span className={`font-bold text-gray-900 ${sizeConfig.price}`}>
          {priceCalculator.formatCurrency(price)}
        </span>
        {listingType === 'rent' && (
          <span className={`font-medium text-gray-600 ${sizeConfig.suffix}`}>
            /month
          </span>
        )}
      </div>

      {/* Price per sqft */}
      {showPerSqft && pricePerSqft && (
        <div className={`text-gray-600 mt-1 ${sizeConfig.perSqft}`}>
          ${pricePerSqft.toFixed(2)} per sqft
        </div>
      )}

      {/* Price Change Indicator */}
      {showPriceChange && (hasDecrease || hasIncrease) && (
        <div className={`flex items-center gap-1 mt-2 ${sizeConfig.change}`}>
          {hasDecrease ? (
            <>
              <TrendingDown size={16} className="text-green-600" />
              <span className="text-green-600 font-medium">
                {Math.abs(priceChange).toFixed(1)}% decrease
              </span>
            </>
          ) : (
            <>
              <TrendingUp size={16} className="text-red-600" />
              <span className="text-red-600 font-medium">
                {priceChange.toFixed(1)}% increase
              </span>
            </>
          )}
          <span className="text-gray-500 ml-1">
            from {priceCalculator.formatCurrency(originalPrice!)}
          </span>
        </div>
      )}
    </div>
  );
};

// Detailed price display with breakdown
interface PropertyPriceDetailedProps {
  price: number;
  listingType: ListingType;
  sqft: number;
  deposit?: number;
  applicationFee?: number;
  petDeposit?: number;
  utilitiesIncluded?: string[];
  showBreakdown?: boolean;
  className?: string;
}

export const PropertyPriceDetailed: React.FC<PropertyPriceDetailedProps> = ({
  price,
  listingType,
  sqft,
  deposit,
  applicationFee,
  petDeposit,
  utilitiesIncluded = [],
  showBreakdown = true,
  className = ''
}) => {
  const pricePerSqft = priceCalculator.calculatePricePerSqft(price, sqft);
  
  // Calculate total move-in cost for rentals
  const moveInCost = listingType === 'rent' 
    ? priceCalculator.calculateMoveInCost(price, deposit, 0, applicationFee, petDeposit)
    : 0;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Main Price */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="text-blue-600" size={24} />
          <h3 className="text-sm font-medium text-gray-600 uppercase">
            {listingType === 'rent' ? 'Monthly Rent' : 'List Price'}
          </h3>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-gray-900">
            {priceCalculator.formatCurrency(price)}
          </span>
          {listingType === 'rent' && (
            <span className="text-xl font-medium text-gray-600">/mo</span>
          )}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          ${pricePerSqft.toFixed(2)} per sqft
        </div>
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <div className="border-t pt-4 space-y-3">
          {listingType === 'rent' ? (
            <>
              {/* Rental Breakdown */}
              {deposit && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-medium text-gray-900">
                    {priceCalculator.formatCurrency(deposit)}
                  </span>
                </div>
              )}
              
              {applicationFee && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Application Fee</span>
                  <span className="font-medium text-gray-900">
                    {priceCalculator.formatCurrency(applicationFee)}
                  </span>
                </div>
              )}

              {petDeposit && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pet Deposit</span>
                  <span className="font-medium text-gray-900">
                    {priceCalculator.formatCurrency(petDeposit)}
                  </span>
                </div>
              )}

              {moveInCost > 0 && (
                <>
                  <div className="border-t my-2" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total Move-in Cost</span>
                    <span className="font-bold text-blue-600 text-lg">
                      {priceCalculator.formatCurrency(moveInCost)}
                    </span>
                  </div>
                </>
              )}

              {utilitiesIncluded.length > 0 && (
                <>
                  <div className="border-t my-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Utilities Included:</p>
                    <div className="flex flex-wrap gap-2">
                      {utilitiesIncluded.map(utility => (
                        <span
                          key={utility}
                          className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                        >
                          {utility}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* Sale Breakdown */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price per sqft</span>
                <span className="font-medium text-gray-900">
                  ${pricePerSqft.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Est. Closing Costs (2-5%)</span>
                <span className="font-medium text-gray-900">
                  {priceCalculator.formatCurrency(priceCalculator.estimateClosingCosts(price).min)} - 
                  {priceCalculator.formatCurrency(priceCalculator.estimateClosingCosts(price).max)}
                </span>
              </div>

              <div className="border-t my-2" />
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-900 font-medium mb-1">💡 Mortgage Estimate</p>
                <p className="text-xs text-blue-800">
                  See below for detailed mortgage calculator
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Price comparison component
interface PropertyPriceComparisonProps {
  price: number;
  averagePrice?: number;
  medianPrice?: number;
  listingType: ListingType;
  className?: string;
}

export const PropertyPriceComparison: React.FC<PropertyPriceComparisonProps> = ({
  price,
  averagePrice,
  medianPrice,
  listingType,
  className = ''
}) => {
  const calculatePercentageDiff = (comparePrice: number) => {
    return ((price - comparePrice) / comparePrice) * 100;
  };

  const avgDiff = averagePrice ? calculatePercentageDiff(averagePrice) : null;
  const medianDiff = medianPrice ? calculatePercentageDiff(medianPrice) : null;

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">
        Price Comparison
      </h4>

      <div className="space-y-3">
        {/* This Property */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">This Property</span>
          <span className="font-bold text-gray-900">
            {priceCalculator.formatCurrency(price)}
            {listingType === 'rent' && <span className="text-sm">/mo</span>}
          </span>
        </div>

        {/* Average Price */}
        {averagePrice && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Area Average</span>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {priceCalculator.formatCurrency(averagePrice)}
                {listingType === 'rent' && <span className="text-sm">/mo</span>}
              </div>
              {avgDiff !== null && (
                <div className={`text-xs font-medium ${
                  avgDiff < 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {avgDiff < 0 ? '↓' : '↑'} {Math.abs(avgDiff).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        )}

        {/* Median Price */}
        {medianPrice && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Area Median</span>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {priceCalculator.formatCurrency(medianPrice)}
                {listingType === 'rent' && <span className="text-sm">/mo</span>}
              </div>
              {medianDiff !== null && (
                <div className={`text-xs font-medium ${
                  medianDiff < 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {medianDiff < 0 ? '↓' : '↑'} {Math.abs(medianDiff).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Price Rating */}
      <div className="mt-4 pt-3 border-t">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Price Rating:</span>
          {avgDiff !== null && (
            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              avgDiff < -10 ? 'bg-green-100 text-green-800' :
              avgDiff < 0 ? 'bg-blue-100 text-blue-800' :
              avgDiff < 10 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {avgDiff < -10 ? 'Great Deal' :
               avgDiff < 0 ? 'Below Average' :
               avgDiff < 10 ? 'Fair Price' :
               'Above Average'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Price history chart placeholder
interface PropertyPriceHistoryProps {
  priceHistory?: Array<{ date: string; price: number }>;
  currentPrice: number;
  listingType: ListingType;
  className?: string;
}

export const PropertyPriceHistory: React.FC<PropertyPriceHistoryProps> = ({
  priceHistory = [],
  currentPrice,
  listingType,
  className = ''
}) => {
  if (priceHistory.length === 0) {
    return null;
  }

  const initialPrice = priceHistory[0].price;
  const priceChange = priceCalculator.calculatePriceChange(initialPrice, currentPrice);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-900">Price History</h4>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          priceChange < 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {priceChange < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
          <span>{Math.abs(priceChange).toFixed(1)}%</span>
        </div>
      </div>

      {/* Price history list */}
      <div className="space-y-2">
        {priceHistory.map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-gray-600">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
            <span className="font-medium text-gray-900">
              {priceCalculator.formatCurrency(entry.price)}
            </span>
          </div>
        ))}
        
        {/* Current Price */}
        <div className="flex items-center justify-between text-sm pt-2 border-t">
          <span className="text-gray-600 font-medium">Current Price</span>
          <span className="font-bold text-blue-600">
            {priceCalculator.formatCurrency(currentPrice)}
            {listingType === 'rent' && <span className="text-xs">/mo</span>}
          </span>
        </div>
      </div>
    </div>
  );
};

// Export all variants
export default PropertyPrice;