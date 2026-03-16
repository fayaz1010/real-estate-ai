// FILE PATH: src/modules/properties/components/PropertyDetails/PropertyDetailsPage.tsx
// Module 1.2: Property Listings Management - Main Property Details Page

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { propertyService } from '../../services/propertyService';
import { PropertyIntelligence } from '../../../../components/PropertyIntelligence';
import { PropertyHero } from './PropertyHero';
import { PropertyOverview } from './PropertyOverview';
import { PropertyDescription } from './PropertyDescription';
import { PropertyFeatures } from './PropertyFeatures';
import { PropertyLocation } from './PropertyLocation';
import { PropertyPricing } from './PropertyPricing';
import { PropertyGallery } from './PropertyGallery';
import { PropertyContact } from './PropertyContact';
import { SimilarProperties } from './SimilarProperties';
import { PropertyHistory } from './PropertyHistory';
import { ArrowLeft, Share2, Flag } from 'lucide-react';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, loadProperty, loading } = useProperties();
  const selectedProperty = properties.find(p => p.id === id);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadProperty(id).catch(err => console.error('Failed to load property:', err));
      // Track property view
      propertyService.trackView(id).catch(err => console.error('Failed to track view:', err));
    }
  }, [id, loadProperty]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = selectedProperty?.title || 'Property';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleReport = () => {
    // Open report modal or redirect to report page
    alert('Report functionality would open here');
  };

  const openGallery = (startIndex: number = 0) => {
    setGalleryStartIndex(startIndex);
    setShowGallery(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!selectedProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={handleReport}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <Flag size={18} />
                <span className="hidden sm:inline">Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <PropertyHero 
        property={selectedProperty} 
        onImageClick={openGallery}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <PropertyOverview property={selectedProperty} />

            {/* Description */}
            <PropertyDescription property={selectedProperty} />

            {/* Features */}
            <PropertyFeatures property={selectedProperty} />

            {/* Location & Map */}
            <PropertyLocation property={selectedProperty} />

            {/* Pricing & Mortgage Calculator */}
            <PropertyPricing property={selectedProperty} />

            {/* Price History */}
            {selectedProperty.pricing.priceHistory && 
             selectedProperty.pricing.priceHistory.length > 0 && (
              <PropertyHistory property={selectedProperty} />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Form */}
              <PropertyContact property={selectedProperty} />

              {/* Property Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Property Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium text-gray-900">
                      {selectedProperty.analytics.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Favorites</span>
                    <span className="font-medium text-gray-900">
                      {selectedProperty.analytics.favorites.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days on Market</span>
                    <span className="font-medium text-gray-900">
                      {selectedProperty.analytics.daysOnMarket}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedProperty.publishedAt || selectedProperty.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-12">
          <SimilarProperties property={selectedProperty} />
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <PropertyGallery
          images={selectedProperty.media.images}
          startIndex={galleryStartIndex}
          onClose={() => setShowGallery(false)}
        />
      )}

      {/* SEO Meta Tags (would be in <head> in real app) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": selectedProperty.listingType === 'sale' ? "SingleFamilyResidence" : "Apartment",
          "name": selectedProperty.title,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": selectedProperty.address.street,
            "addressLocality": selectedProperty.address.city,
            "addressRegion": selectedProperty.address.state,
            "postalCode": selectedProperty.address.zipCode,
            "addressCountry": selectedProperty.address.country
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": selectedProperty.address.latitude,
            "longitude": selectedProperty.address.longitude
          },
          "numberOfRooms": selectedProperty.details.bedrooms,
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": selectedProperty.details.sqft,
            "unitCode": "SQF"
          }
        })}
      </script>
    </div>
  );
};

export default PropertyDetailsPage;