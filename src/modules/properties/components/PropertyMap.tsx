// FILE PATH: src/modules/properties/components/PropertyMap.tsx
// Google Maps integration for property listings

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";

import { Property } from "../types/property.types";
import { mapHelpers } from "../utils/mapHelpers";

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  className?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "70vh",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: true,
  fullscreenControl: true,
};

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  onPropertyClick,
  className = "",
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places", "geometry"],
  });

  const [_map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const center = useMemo(() => {
    if (properties.length === 0) return defaultCenter;
    const bounds = mapHelpers.getBoundsFromProperties(properties);
    if (!bounds) return defaultCenter;
    const centerPoint = mapHelpers.getCenterFromBounds(bounds);
    return { lat: centerPoint.lat, lng: centerPoint.lng };
  }, [properties]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);

      // Fit bounds to show all properties
      if (properties.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        properties.forEach((property) => {
          bounds.extend({
            lat: property.address.latitude,
            lng: property.address.longitude,
          });
        });
        map.fitBounds(bounds);
      }
    },
    [properties],
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div
        className={`w-full h-[70vh] bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <MapPin size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">Error loading maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`w-full h-[70vh] bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={{
              lat: property.address.latitude,
              lng: property.address.longitude,
            }}
            onClick={() => setSelectedProperty(property)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor:
                property.listingType === "rent" ? "#3B82F6" : "#10B981",
              fillOpacity: 0.9,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
            label={{
              text: `$${Math.round(property.pricing.price / 1000)}k`,
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          />
        ))}

        {selectedProperty && (
          <InfoWindow
            position={{
              lat: selectedProperty.address.latitude,
              lng: selectedProperty.address.longitude,
            }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="p-2 max-w-xs">
              <div className="flex gap-3">
                {selectedProperty.media?.images?.[0] && (
                  <img
                    src={selectedProperty.media.images[0].url}
                    alt={selectedProperty.title}
                    className="w-24 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                    {selectedProperty.title}
                  </h3>
                  <p className="text-blue-600 font-bold text-lg mb-1">
                    ${selectedProperty.pricing.price.toLocaleString()}
                    {selectedProperty.listingType === "rent" && "/mo"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{selectedProperty.details.bedrooms} bed</span>
                    <span>•</span>
                    <span>{selectedProperty.details.bathrooms} bath</span>
                    <span>•</span>
                    <span>{selectedProperty.details.sqft} sqft</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProperty(null);
                      onPropertyClick?.(selectedProperty);
                    }}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default PropertyMap;
