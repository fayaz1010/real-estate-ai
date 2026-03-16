// FILE PATH: src/modules/properties/components/PropertyList.tsx
// List layout for displaying properties

import React from 'react';
import { Property } from '../types/property.types';
import { MapPin, Home, Droplet, Square, Heart, Calendar } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';

interface PropertyListProps {
  properties: Property[];
  loading?: boolean;
  onPropertyClick?: (property: Property) => void;
  emptyMessage?: string;
  className?: string;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  loading = false,
  onPropertyClick,
  emptyMessage = 'No properties found',
  className = '',
}) => {
  const [savedProperties, setSavedProperties] = React.useState<Set<string>>(new Set());

  const handleSaveClick = (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    setSavedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading properties...</span>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {properties.map((property) => {
        const isSaved = savedProperties.has(property.id);

        return (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            onClick={() => onPropertyClick?.(property)}
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0">
                <img
                  src={property.media?.images?.[0]?.url || '/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800">
                    {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                  </span>
                </div>
                <button
                  onClick={(e) => handleSaveClick(e, property.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                  aria-label={isSaved ? 'Remove from saved' : 'Save property'}
                >
                  <Heart
                    size={18}
                    className={isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin size={14} className="mr-1" />
                      <span>
                        {property.address?.street}, {property.address?.city}, {property.address?.state}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(property.pricing?.price || 0)}
                      {property.listingType === 'rent' && <span className="text-sm font-normal">/mo</span>}
                    </div>
                    {property.pricing?.price && (
                      <div className="text-sm text-gray-500">
                        {formatCurrency(property.pricing.price / (property.details?.sqft || 1))}/sqft
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {property.description}
                </p>

                {/* Property Features */}
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Home size={16} className="mr-1.5 text-gray-400" />
                    <span>{property.details?.bedrooms || 0} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Droplet size={16} className="mr-1.5 text-gray-400" />
                    <span>{property.details?.bathrooms || 0} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <Square size={16} className="mr-1.5 text-gray-400" />
                    <span>{property.details?.sqft || 0} sqft</span>
                  </div>
                  {property.createdAt && (
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1.5 text-gray-400" />
                      <span>
                        Listed {new Date(property.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Amenities/Features */}
                {property.features && (
                  property.features.interior?.length > 0 ||
                  property.features.appliances?.length > 0 ||
                  property.features.amenities?.length > 0 ||
                  property.features.outdoor?.length > 0
                ) && (
                  <div className="flex flex-wrap gap-2">
                    {[
                      ...(property.features.interior || []).slice(0, 2),
                      ...(property.features.appliances || []).slice(0, 2),
                      ...(property.features.amenities || []).slice(0, 2),
                      ...(property.features.outdoor || []).slice(0, 2),
                    ]
                      .slice(0, 4)
                      .map((feature, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    {(
                      (property.features.interior?.length || 0) +
                      (property.features.appliances?.length || 0) +
                      (property.features.amenities?.length || 0) +
                      (property.features.outdoor?.length || 0)
                    ) > 4 && (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{(
                          (property.features.interior?.length || 0) +
                          (property.features.appliances?.length || 0) +
                          (property.features.amenities?.length || 0) +
                          (property.features.outdoor?.length || 0) - 4
                        )} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Agent Info */}
              {property.agentInfo && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={property.agentInfo.avatar || '/avatar-placeholder.png'}
                      alt={property.agentInfo.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="leading-tight">
                      <p className="text-gray-900 font-medium line-clamp-1">{property.agentInfo.name}</p>
                      <p className="text-gray-500 text-xs line-clamp-1">{property.agentInfo.phone} • {property.agentInfo.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyList;
