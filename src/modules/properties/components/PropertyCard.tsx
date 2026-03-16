import { Heart, MapPin, Home, Droplet, Maximize, Star } from "lucide-react";
import React from "react";

import { formatCurrency } from "../../../lib/utils";
import { Property } from "../types/property.types";

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  className?: string;
  showSaveButton?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onClick,
  className = "",
  showSaveButton = true,
}) => {
  const [isSaved, setIsSaved] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    // TODO: Add to saved properties
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Property Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={property.media?.images?.[0]?.url || "/placeholder-property.jpg"}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status Badge */}
        <div className="absolute left-3 top-3 z-10">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
            {property.listingType === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>

        {/* Save Button */}
        {showSaveButton && (
          <button
            onClick={handleSaveClick}
            className={`absolute right-3 top-3 z-10 rounded-full p-2 transition-colors ${
              isSaved ? "text-red-500" : "text-white/80 hover:bg-white/20"
            }`}
            aria-label={isSaved ? "Remove from saved" : "Save property"}
          >
            <Heart
              size={20}
              fill={isSaved ? "currentColor" : "none"}
              className={isSaved ? "fill-current" : ""}
            />
          </button>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <div className="text-lg font-bold text-blue-600">
            {formatCurrency(property.pricing?.price || 0)}
            {property.listingType === "rent" && "/mo"}
          </div>
        </div>

        <div className="mb-3 flex items-center text-sm text-gray-500">
          <MapPin size={14} className="mr-1" />
          <span className="line-clamp-1">
            {property.address?.street}, {property.address?.city},{" "}
            {property.address?.state}
          </span>
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-sm">
          <div className="flex items-center text-gray-600">
            <Home size={16} className="mr-1 text-gray-400" />
            <span>{property.details?.bedrooms || 0} Beds</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Droplet size={16} className="mr-1 text-gray-400" />
            <span>{property.details?.bathrooms || 0} Baths</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span>{property.details?.sqft || 0} sqft</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-3 border-t border-gray-100 pt-3 text-sm">
          {/* Agent Info */}
          {property.agentInfo && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={property.agentInfo.avatar || "/avatar-placeholder.png"}
                  alt={property.agentInfo.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="leading-tight">
                  <p className="text-gray-900 font-medium line-clamp-1">
                    {property.agentInfo.name}
                  </p>
                  <p className="text-gray-500 text-xs line-clamp-1">
                    {property.agentInfo.phone} • {property.agentInfo.email}
                  </p>
                </div>
              </div>
              {typeof property.agentInfo.rating === "number" && (
                <div className="flex items-center text-amber-600 text-xs">
                  <Star size={14} className="fill-current mr-1" />
                  <span>{property.agentInfo.rating?.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
