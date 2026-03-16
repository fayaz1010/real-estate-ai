// FILE PATH: src/modules/properties/components/PropertyDetails/PropertyLocation.tsx
// Module 1.2: Property Listings Management - Location & Map Section

import React, { useState, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { Property } from '../../types/property.types';
import { MapPin, Navigation, ShoppingCart, TrendingUp, BookOpen, Coffee, ShoppingBag, Home } from 'lucide-react';

interface PropertyLocationProps {
  property: Property;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: false,
  fullscreenControl: true,
};

interface NearbyPlace {
  name: string;
  type: string;
  distance: number;
  placeId?: string;
  rating?: number;
  address?: string;
}

export const PropertyLocation: React.FC<PropertyLocationProps> = ({ property }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'neighborhood'>('map');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places', 'geometry']
  });

  // Search for nearby places using Google Places API
  useEffect(() => {
    if (!isLoaded || !map) return;

    const searchNearbyPlaces = async () => {
      setLoadingPlaces(true);
      const service = new google.maps.places.PlacesService(map);
      const location = new google.maps.LatLng(property.address.latitude, property.address.longitude);

      const placeTypes = [
        { type: 'restaurant', label: 'Restaurant' },
        { type: 'cafe', label: 'Cafe' },
        { type: 'supermarket', label: 'Grocery' },
        { type: 'school', label: 'School' },
        { type: 'hospital', label: 'Hospital' },
        { type: 'park', label: 'Park' },
        { type: 'transit_station', label: 'Transit' },
        { type: 'shopping_mall', label: 'Shopping' },
      ];

      const allPlaces: NearbyPlace[] = [];

      for (const { type, label } of placeTypes) {
        const request: google.maps.places.PlaceSearchRequest = {
          location,
          radius: 2000, // 2km radius
          type: type as any
        };

        try {
          await new Promise<void>((resolve) => {
            service.nearbySearch(request, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                results.slice(0, 3).forEach((place) => {
                  if (place.geometry?.location) {
                    const distance = google.maps.geometry.spherical.computeDistanceBetween(
                      location,
                      place.geometry.location
                    );
                    allPlaces.push({
                      name: place.name || 'Unknown',
                      type: label,
                      distance: Math.round(distance * 0.000621371 * 100) / 100, // meters to miles
                      placeId: place.place_id,
                      rating: place.rating,
                      address: place.vicinity
                    });
                  }
                });
              }
              resolve();
            });
          });
        } catch (error) {
          console.error(`Error fetching ${type}:`, error);
        }
      }

      setNearbyPlaces(allPlaces);
      setLoadingPlaces(false);
    };

    searchNearbyPlaces();
  }, [isLoaded, map, property.address.latitude, property.address.longitude]);

  // Mock neighborhood data - would come from API
  const neighborhoodData = {
    walkScore: 85,
    transitScore: 72,
    bikeScore: 68,
    schools: [
      { name: 'Lincoln Elementary', type: 'Elementary', rating: 8, distance: 0.5 },
      { name: 'Washington Middle School', type: 'Middle', rating: 7, distance: 1.2 },
      { name: 'Jefferson High School', type: 'High', rating: 9, distance: 2.1 }
    ]
  };

  const availableTypes = useMemo(() => {
    const set = new Set(nearbyPlaces.map(n => n.type));
    return Array.from(set);
  }, [nearbyPlaces]);

  const filteredNearby = useMemo(() => {
    if (!selectedTypes.length) return nearbyPlaces;
    return nearbyPlaces.filter(n => selectedTypes.includes(n.type));
  }, [selectedTypes, nearbyPlaces]);

  const getIconForType = (type: string) => {
    const iconMap: Record<string, any> = {
      'Restaurant': Coffee,
      'Cafe': Coffee,
      'Grocery': ShoppingCart,
      'School': BookOpen,
      'Hospital': Home,
      'Park': MapPin,
      'Transit': Navigation,
      'Shopping': ShoppingBag,
    };
    return iconMap[type] || MapPin;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6" id="location-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Location & Neighborhood</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setActiveTab('neighborhood')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'neighborhood'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Neighborhood
          </button>
        </div>
      </div>

      {activeTab === 'map' ? (
        <>
          {/* Google Map */}
          <div className="w-full h-96 bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{
                  lat: property.address.latitude,
                  lng: property.address.longitude
                }}
                zoom={15}
                onLoad={(map) => setMap(map)}
                options={mapOptions}
              >
                <Marker
                  position={{
                    lat: property.address.latitude,
                    lng: property.address.longitude
                  }}
                  icon={{
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    scale: 6,
                    fillColor: '#EF4444',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    rotation: 180,
                  }}
                />
                <Circle
                  center={{
                    lat: property.address.latitude,
                    lng: property.address.longitude
                  }}
                  radius={2000}
                  options={{
                    fillColor: '#3B82F6',
                    fillOpacity: 0.1,
                    strokeColor: '#3B82F6',
                    strokeOpacity: 0.3,
                    strokeWeight: 1,
                  }}
                />
              </GoogleMap>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <MapPin className="text-blue-600 mt-1" size={20} />
            <div>
              <p className="font-medium text-gray-900">
                {property.address.street}
                {property.address.unit && `, ${property.address.unit}`}
              </p>
              <p className="text-gray-600">
                {property.address.city}, {property.address.state} {property.address.zipCode}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Lat: {property.address.latitude}, Lng: {property.address.longitude}
              </p>
            </div>
          </div>

          {/* Get Directions Button */}
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${property.address.latitude},${property.address.longitude}`;
              window.open(url, '_blank');
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            <Navigation size={18} />
            <span>Get Directions</span>
          </button>
        </>
      ) : (
        <div className="space-y-6">
          {/* Walkability Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">Walk Score</span>
                <span className="text-2xl font-bold text-green-700">{neighborhoodData.walkScore}</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${neighborhoodData.walkScore}%` }}
                />
              </div>
              <p className="text-xs text-green-700 mt-1">Very Walkable</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Transit Score</span>
                <span className="text-2xl font-bold text-blue-700">{neighborhoodData.transitScore}</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${neighborhoodData.transitScore}%` }}
                />
              </div>
              <p className="text-xs text-blue-700 mt-1">Excellent Transit</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-900">Bike Score</span>
                <span className="text-2xl font-bold text-purple-700">{neighborhoodData.bikeScore}</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${neighborhoodData.bikeScore}%` }}
                />
              </div>
              <p className="text-xs text-purple-700 mt-1">Bikeable</p>
            </div>
          </div>

          {/* Nearby Schools */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="text-blue-600" size={20} />
              <h3 className="font-semibold text-gray-900">Nearby Schools</h3>
            </div>
            <div className="space-y-3">
              {neighborhoodData.schools.map((school, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{school.name}</p>
                    <p className="text-sm text-gray-600">{school.type} • {school.distance} miles</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {school.rating}/10
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Places */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">What's Nearby</h3>
            </div>
            {/* Type Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {availableTypes.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setSelectedTypes((prev) =>
                      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                    )
                  }
                  className={`px-3 py-1.5 text-xs rounded-full border ${
                    selectedTypes.includes(type)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
              {selectedTypes.length > 0 && (
                <button
                  onClick={() => setSelectedTypes([])}
                  className="px-3 py-1.5 text-xs rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>

            {loadingPlaces ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Finding nearby places...</p>
              </div>
            ) : filteredNearby.length === 0 ? (
              <div className="text-center py-8">
                <MapPin size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-600 text-sm">No nearby places found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredNearby.map((place, index) => {
                  const Icon = getIconForType(place.type);
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <Icon className="text-gray-600 flex-shrink-0" size={24} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">{place.name}</p>
                        <p className="text-xs text-gray-600">{place.distance} mi • {place.type}</p>
                        {place.rating && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-amber-500 text-xs">★</span>
                            <span className="text-xs text-gray-600">{place.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
