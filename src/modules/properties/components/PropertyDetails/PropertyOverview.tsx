// FILE PATH: src/modules/properties/components/PropertyDetails/PropertyOverview.tsx
// Module 1.2: Property Listings Management - Property Overview Section

import React from 'react';
import { Property } from '../../types/property.types';
import { MapPin, Droplet, Maximize, Home, Calendar, TrendingUp } from 'lucide-react';
import { PropertyPrice } from '../shared/PropertyPrice';
import { priceCalculator } from '../../utils/priceCalculator';

interface PropertyOverviewProps {
  property: Property;
}

export const PropertyOverview: React.FC<PropertyOverviewProps> = ({ property }) => {
  const pricePerSqft = priceCalculator.calculatePricePerSqft(
    property.pricing.price,
    property.details.sqft
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {property.title}
      </h1>

      {/* Address */}
      <div className="flex items-center text-gray-600 mb-6">
        <MapPin size={18} className="mr-2 flex-shrink-0" />
        <span className="text-lg">
          {property.address.street}
          {property.address.unit && `, ${property.address.unit}`}, {property.address.city}, {property.address.state} {property.address.zipCode}
        </span>
      </div>

      {/* Price */}
      <div className="mb-6">
        <PropertyPrice
          price={property.pricing.price}
          listingType={property.listingType}
          pricePerSqft={pricePerSqft}
          originalPrice={property.pricing.originalPrice}
          size="xl"
          showPerSqft
          showPriceChange
        />
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Home className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {property.details.bedrooms}
            </p>
            <p className="text-sm text-gray-600">Bedrooms</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-lg">
            <Droplet className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {property.details.bathrooms}
            </p>
            <p className="text-sm text-gray-600">Bathrooms</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <Maximize className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {property.details.sqft.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Sq Ft</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-50 rounded-lg">
            <Home className="text-orange-600" size={24} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 capitalize">
              {property.propertyType}
            </p>
            <p className="text-sm text-gray-600">Property Type</p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t text-sm">
        {property.details.yearBuilt && (
          <div>
            <p className="text-gray-600">Year Built</p>
            <p className="font-semibold text-gray-900">{property.details.yearBuilt}</p>
          </div>
        )}
        {property.details.lotSize && (
          <div>
            <p className="text-gray-600">Lot Size</p>
            <p className="font-semibold text-gray-900">
              {property.details.lotSize.toLocaleString()} sq ft
            </p>
          </div>
        )}
        {property.details.parking.spaces > 0 && (
          <div>
            <p className="text-gray-600">Parking</p>
            <p className="font-semibold text-gray-900 capitalize">
              {property.details.parking.spaces} {property.details.parking.type}
            </p>
          </div>
        )}
        {property.availableFrom && (
          <div>
            <p className="text-gray-600">Available</p>
            <p className="font-semibold text-gray-900">
              {new Date(property.availableFrom).toLocaleDateString()}
            </p>
          </div>
        )}
        <div>
          <p className="text-gray-600">Listing Type</p>
          <p className="font-semibold text-gray-900 capitalize">
            For {property.listingType}
          </p>
        </div>
      </div>
    </div>
  );
};
