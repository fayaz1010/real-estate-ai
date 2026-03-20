// FILE PATH: src/modules/properties/components/PropertyDetails/SimilarProperties.tsx
// Module 1.2: Property Listings Management - Similar Properties Component

import { Home, ArrowRight } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { propertyService } from "../../services/propertyService";
import { Property } from "../../types/property.types";
import { PropertyCard } from "../PropertyCard";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SimilarPropertiesProps {
  property: Property;
  maxItems?: number;
}

export const SimilarProperties: React.FC<SimilarPropertiesProps> = ({
  property,
  maxItems = 4,
}) => {
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchSimilarProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real app, you would call an API endpoint that finds similar properties
      // For now, we'll use the getSimilarProperties method from the property service
      const similar = await propertyService.getSimilarProperties(
        property.id,
        maxItems + 1,
      );

      // Filter out the current property and limit to maxItems
      const filtered = similar
        .filter((p) => p.id !== property.id)
        .slice(0, maxItems);

      setSimilarProperties(filtered);
    } catch (err) {
      console.error("Error fetching similar properties:", err);
      setError("Failed to load similar properties. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [property.id, maxItems]);

  useEffect(() => {
    fetchSimilarProperties();
  }, [fetchSimilarProperties]);

  const handleViewAll = () => {
    navigate(
      `/properties?propertyType=${encodeURIComponent(property.propertyType)}`,
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/properties/${propertyId}`);
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Similar Properties
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 p-6 bg-red-50 rounded-lg text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (similarProperties.length === 0) {
    return null; // Don't render anything if no similar properties found
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Similar Properties</h2>
        <Button
          variant="ghost"
          className="text-realestate-primary hover:bg-primary/5 flex items-center gap-1"
          onClick={handleViewAll}
        >
          View all <ArrowRight size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => handlePropertyClick(property.id)}
          />
        ))}
      </div>

      {/* View More CTA */}
      <div className="mt-10 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl text-center">
        <div className="max-w-2xl mx-auto">
          <Home className="w-10 h-10 mx-auto text-realestate-primary mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Looking for more options?
          </h3>
          <p className="text-gray-600 mb-4">
            We have hundreds of properties that might interest you. Let us help
            you find your dream home.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="default"
              className="bg-realestate-primary hover:bg-realestate-primary/90"
              onClick={handleViewAll}
            >
              Browse All Properties
            </Button>
            <Button
              variant="outline"
              className="border-realestate-primary text-realestate-primary hover:bg-primary/5"
              onClick={() => {
                // This would typically open a contact form or modal
                document
                  .getElementById("contact-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact an Agent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarProperties;
