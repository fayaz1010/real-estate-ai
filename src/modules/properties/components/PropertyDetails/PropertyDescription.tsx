// FILE PATH: src/modules/properties/components/PropertyDetails/PropertyDescription.tsx
// Module 1.2: Property Listings Management - Property Description Component

import React, { useState } from 'react';
import { Property } from '../../types/property.types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PropertyDescriptionProps {
  property: Property;
  maxLength?: number;
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  property,
  maxLength = 500,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsTruncation = property.description.length > maxLength;
  const displayText = isExpanded || !needsTruncation 
    ? property.description 
    : `${property.description.substring(0, maxLength).trim()}...`;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
      <div className="prose max-w-none text-gray-700 mb-6">
        <p className="whitespace-pre-line">{displayText}</p>
      </div>

      {needsTruncation && (
        <button
          onClick={toggleExpand}
          className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-0 mt-4 font-medium"
        >
          {isExpanded ? (
            <>
              Read Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Read More <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DetailItem label="Year Built" value={property.details.yearBuilt?.toString()} />
          <DetailItem label="Lot Size" value={
            property.details.lotSize ? `${property.details.lotSize.toLocaleString()} sq ft` : 'N/A'
          } />
          <DetailItem label="Living Area" value={`${property.details.sqft.toLocaleString()} sq ft`} />
          <DetailItem label="Bedrooms" value={property.details.bedrooms.toString()} />
          <DetailItem 
            label="Bathrooms" 
            value={property.details.bathrooms % 1 === 0 
              ? property.details.bathrooms.toString() 
              : property.details.bathrooms.toFixed(1)
            } 
          />
        </div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value?: string | null;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div className="flex items-start">
    <span className="text-gray-500 w-32 flex-shrink-0">{label}:</span>
    <span className="text-gray-900 font-medium">{value || 'N/A'}</span>
  </div>
);

export default PropertyDescription;