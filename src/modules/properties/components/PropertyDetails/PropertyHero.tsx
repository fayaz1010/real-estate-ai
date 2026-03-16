// FILE PATH: src/modules/properties/components/PropertyDetails/PropertyHero.tsx
// Module 1.2: Property Listings Management - Property Hero Section

import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Video,
} from "lucide-react";
import React, { useState } from "react";

import { useFavorites } from "../../hooks/useFavorites";
import { Property } from "../../types/property.types";
import { PropertyStatus } from "../shared/PropertyStatus";

interface PropertyHeroProps {
  property: Property;
  onImageClick?: (index: number) => void;
}

export const PropertyHero: React.FC<PropertyHeroProps> = ({
  property,
  onImageClick,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.media.images.sort((a, b) => a.order - b.order);
  const hasMultipleImages = images.length > 1;
  const hasVideos = property.media.videos && property.media.videos.length > 0;
  const hasVirtualTour = !!property.media.virtualTourUrl;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description.substring(0, 100),
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-white">
      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-4 gap-2 h-[500px]">
          {/* Main Image */}
          <div
            className="col-span-2 row-span-2 relative rounded-l-lg overflow-hidden cursor-pointer group"
            onClick={() => onImageClick?.(0)}
          >
            <img
              src={images[0]?.url || "/placeholder.jpg"}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition" />

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <PropertyStatus status={property.status} size="md" />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
              <Maximize2 size={16} />
              <span>{images.length} Photos</span>
            </div>
          </div>

          {/* Secondary Images */}
          {images.slice(1, 5).map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden cursor-pointer group ${
                index === 3 ? "rounded-tr-lg" : ""
              } ${index === 1 ? "rounded-br-lg" : ""}`}
              onClick={() => onImageClick?.(index + 1)}
            >
              <img
                src={image.url}
                alt={image.caption || `Property image ${index + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition" />

              {/* Show more overlay on last image */}
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    +{images.length - 5} More
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            {hasVirtualTour && (
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                <Video size={18} />
                <span>Virtual Tour</span>
              </button>
            )}
            {hasVideos && (
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
                <Play size={18} />
                <span>Watch Video</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition ${
                isFavorite(property.id)
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Heart
                size={18}
                className={isFavorite(property.id) ? "fill-red-500" : ""}
              />
              <span>{isFavorite(property.id) ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden relative">
        {/* Image Carousel */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={images[currentImageIndex]?.url || "/placeholder.jpg"}
            alt={property.title}
            className="w-full h-full object-cover"
            onClick={() => onImageClick?.(currentImageIndex)}
          />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <PropertyStatus status={property.status} size="sm" />
          </div>

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`p-2 rounded-full shadow-lg ${
                isFavorite(property.id) ? "bg-red-500 text-white" : "bg-white"
              }`}
            >
              <Heart
                size={18}
                className={isFavorite(property.id) ? "fill-white" : ""}
              />
            </button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {hasMultipleImages && (
          <div className="flex gap-2 p-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                  index === currentImageIndex
                    ? "border-blue-600"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image.thumbnail || image.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Media Buttons */}
        <div className="p-4 flex gap-2">
          {hasVirtualTour && (
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg">
              <Video size={16} />
              <span className="text-sm">Virtual Tour</span>
            </button>
          )}
          {hasVideos && (
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg">
              <Play size={16} />
              <span className="text-sm">Video</span>
            </button>
          )}
          <button
            onClick={() => onImageClick?.(currentImageIndex)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
          >
            <Maximize2 size={16} />
            <span className="text-sm">View All</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyHero;
