// FILE PATH: src/components/PropertyIntelligence.tsx
// Property intelligence widget showing market trends and neighborhood insights

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MapPin, Home, Users, DollarSign, BarChart, Info } from 'lucide-react';

interface PropertyIntelligenceProps {
  property: {
    address: {
      city: string;
      state: string;
      zipCode: string;
      neighborhood?: string;
    };
    pricing: {
      price: number;
      pricePerSqft?: number;
    };
    details: {
      sqft: number;
      bedrooms: number;
      bathrooms: number;
    };
    listingType: 'sale' | 'rent';
  };
  className?: string;
}

interface MarketData {
  neighborhood: {
    name: string;
    medianPrice: number;
    priceChange: number;
    daysOnMarket: number;
    walkScore?: number;
    crimeRate: 'low' | 'medium' | 'high';
  };
  marketTrends: {
    pricePerSqft: number;
    pricePerSqftChange: number;
    inventory: number;
    inventoryChange: number;
    salesVolume: number;
    salesVolumeChange: number;
  };
  propertyValue: {
    estimatedValue: number;
    confidence: 'low' | 'medium' | 'high';
    lastUpdated: string;
  };
  nearbyAmenities: {
    schools: number;
    parks: number;
    restaurants: number;
    shopping: number;
  };
}

export const PropertyIntelligence: React.FC<PropertyIntelligenceProps> = ({
  property,
  className = ''
}) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get market data
    const fetchMarketData = async () => {
      setLoading(true);

      // Mock data - in real app, this would come from your backend API
      const mockData: MarketData = {
        neighborhood: {
          name: property.address.neighborhood || property.address.city,
          medianPrice: property.pricing.price * (0.95 + Math.random() * 0.1), // Within 5-10% of property price
          priceChange: (Math.random() - 0.5) * 20, // -10% to +10% change
          daysOnMarket: Math.floor(Math.random() * 60) + 15, // 15-75 days
          walkScore: Math.floor(Math.random() * 40) + 60, // 60-100 walk score
          crimeRate: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        },
        marketTrends: {
          pricePerSqft: property.pricing.pricePerSqft || (property.pricing.price / property.details.sqft),
          pricePerSqftChange: (Math.random() - 0.5) * 10, // -5% to +5% change
          inventory: Math.floor(Math.random() * 100) + 50, // 50-150 homes for sale
          inventoryChange: (Math.random() - 0.5) * 20, // -10% to +10% change
          salesVolume: Math.floor(Math.random() * 50) + 20, // 20-70 sales per month
          salesVolumeChange: (Math.random() - 0.5) * 15, // -7.5% to +7.5% change
        },
        propertyValue: {
          estimatedValue: property.pricing.price * (0.95 + Math.random() * 0.1),
          confidence: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        nearbyAmenities: {
          schools: Math.floor(Math.random() * 5) + 3,
          parks: Math.floor(Math.random() * 3) + 1,
          restaurants: Math.floor(Math.random() * 15) + 5,
          shopping: Math.floor(Math.random() * 8) + 2,
        },
      };

      // Simulate network delay
      setTimeout(() => {
        setMarketData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchMarketData();
  }, [property]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border p-6 ${className}`}>
        <div className="text-center py-8">
          <BarChart size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Market data unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <BarChart className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold text-gray-900">Market Intelligence</h3>
      </div>

      {/* Property Value Estimate */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-blue-900">Property Value Estimate</h4>
          <span className={`px-2 py-1 text-xs rounded-full ${
            marketData.propertyValue.confidence === 'high'
              ? 'bg-green-100 text-green-800'
              : marketData.propertyValue.confidence === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {marketData.propertyValue.confidence} confidence
          </span>
        </div>
        <p className="text-2xl font-bold text-blue-600 mb-1">
          {formatCurrency(marketData.propertyValue.estimatedValue)}
        </p>
        <p className="text-sm text-blue-700">
          Last updated: {new Date(marketData.propertyValue.lastUpdated).toLocaleDateString()}
        </p>
      </div>

      {/* Neighborhood Overview */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-gray-600" />
          {marketData.neighborhood.name} Overview
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Median Price</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(marketData.neighborhood.medianPrice)}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Avg Days on Market</p>
            <p className="text-lg font-bold text-gray-900">
              {marketData.neighborhood.daysOnMarket}
            </p>
          </div>
          {marketData.neighborhood.walkScore && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Walk Score</p>
              <p className="text-lg font-bold text-gray-900">
                {marketData.neighborhood.walkScore}
              </p>
            </div>
          )}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Crime Rate</p>
            <p className={`text-lg font-bold capitalize ${
              marketData.neighborhood.crimeRate === 'low' ? 'text-green-600' :
              marketData.neighborhood.crimeRate === 'medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {marketData.neighborhood.crimeRate}
            </p>
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-gray-600" />
          Market Trends
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">Price per Sqft</span>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                ${marketData.marketTrends.pricePerSqft.toFixed(0)}
              </p>
              <div className={`flex items-center text-xs ${
                marketData.marketTrends.pricePerSqftChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketData.marketTrends.pricePerSqftChange >= 0 ? (
                  <TrendingUp size={12} className="mr-1" />
                ) : (
                  <TrendingDown size={12} className="mr-1" />
                )}
                {formatPercent(marketData.marketTrends.pricePerSqftChange)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Home size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">Active Listings</span>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                {marketData.marketTrends.inventory}
              </p>
              <div className={`flex items-center text-xs ${
                marketData.marketTrends.inventoryChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketData.marketTrends.inventoryChange >= 0 ? (
                  <TrendingUp size={12} className="mr-1" />
                ) : (
                  <TrendingDown size={12} className="mr-1" />
                )}
                {formatPercent(marketData.marketTrends.inventoryChange)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Amenities */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Users size={18} className="text-gray-600" />
          Nearby Amenities (within 2 miles)
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">{marketData.nearbyAmenities.schools} Schools</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">{marketData.nearbyAmenities.parks} Parks</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-700">{marketData.nearbyAmenities.restaurants} Restaurants</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-700">{marketData.nearbyAmenities.shopping} Shopping</span>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-gray-900 text-sm mb-1">Market Insights</h5>
            <p className="text-xs text-gray-600 mb-2">
              This property is priced {Math.abs(marketData.neighborhood.medianPrice - property.pricing.price) < property.pricing.price * 0.05 ? 'competitively' : 'above average'} for the neighborhood.
            </p>
            <p className="text-xs text-gray-600">
              The local market shows {marketData.marketTrends.pricePerSqftChange > 0 ? 'increasing' : 'stable'} prices with {marketData.marketTrends.inventory} active listings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyIntelligence;
