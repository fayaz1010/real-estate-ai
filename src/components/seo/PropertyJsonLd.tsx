import React from "react";

interface PropertyJsonLdProps {
  property: {
    title: string;
    description: string;
    address: string;
    price: number;
    images: string[];
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    listingType?: string;
  };
}

export const PropertyJsonLd: React.FC<PropertyJsonLdProps> = ({ property }) => {
  const schemaType =
    property.listingType === "sale"
      ? "SingleFamilyResidence"
      : "Apartment";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    image: property.images,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "USD",
    },
    mainEntity: {
      "@type": schemaType,
      name: property.title,
      description: property.description,
      ...(property.bedrooms !== undefined && {
        numberOfRooms: property.bedrooms,
      }),
      ...(property.bathrooms !== undefined && {
        numberOfBathroomsTotal: property.bathrooms,
      }),
      ...(property.area !== undefined && {
        floorSize: {
          "@type": "QuantitativeValue",
          value: property.area,
          unitCode: "SQF",
        },
      }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default PropertyJsonLd;
