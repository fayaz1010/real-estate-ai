import React from "react";

import { PropertyListings } from "../components/PropertyListings";
import { PageMeta } from "../components/seo";

export const PropertiesPage: React.FC = () => {
  return (
    <div className="pt-20">
      <PageMeta
        title="Browse Properties"
        description="Search and browse available rental and sale properties managed with AI-powered tools. Find your next home or investment opportunity with RealEstate AI."
        keywords="properties for rent, properties for sale, AI property listings, rental properties, real estate listings"
        canonicalUrl="https://realestate-ai.com/properties"
      />
      <PropertyListings />
    </div>
  );
};
