// FILE PATH: src/modules/properties/components/shared/PropertyStatus.tsx
// Module 1.2: Property Listings Management - Property Status Component

import { CheckCircle, Clock, EyeOff, Edit } from "lucide-react";
import React from "react";

import { PropertyStatus as PropertyStatusType } from "../../types/property.types";

interface PropertyStatusProps {
  status: PropertyStatusType;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export const PropertyStatus: React.FC<PropertyStatusProps> = ({
  status,
  size = "md",
  showIcon = true,
  className = "",
}) => {
  // Get status configuration
  const getStatusConfig = () => {
    const configs = {
      available: {
        label: "Available",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-200",
        icon: CheckCircle,
        description: "Ready for viewing and applications",
      },
      pending: {
        label: "Pending",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-200",
        icon: Clock,
        description: "Application under review",
      },
      rented: {
        label: "Rented",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        borderColor: "border-blue-200",
        icon: CheckCircle,
        description: "Currently leased",
      },
      sold: {
        label: "Sold",
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        borderColor: "border-purple-200",
        icon: CheckCircle,
        description: "Property sold",
      },
      off_market: {
        label: "Off Market",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        borderColor: "border-gray-200",
        icon: EyeOff,
        description: "Not currently listed",
      },
      draft: {
        label: "Draft",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        borderColor: "border-orange-200",
        icon: Edit,
        description: "Not yet published",
      },
    };

    return configs[status] || configs.draft;
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  // Size configurations
  const sizeClasses = {
    sm: {
      padding: "px-2 py-0.5",
      text: "text-xs",
      icon: 12,
      gap: "gap-1",
    },
    md: {
      padding: "px-3 py-1",
      text: "text-sm",
      icon: 14,
      gap: "gap-1.5",
    },
    lg: {
      padding: "px-4 py-2",
      text: "text-base",
      icon: 16,
      gap: "gap-2",
    },
  };

  const sizeConfig = sizeClasses[size];

  return (
    <span
      className={`
        inline-flex items-center ${sizeConfig.gap} ${sizeConfig.padding}
        ${config.bgColor} ${config.textColor} 
        border ${config.borderColor}
        rounded-full font-semibold ${sizeConfig.text}
        ${className}
      `}
      title={config.description}
    >
      {showIcon && <Icon size={sizeConfig.icon} className="flex-shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};

// Variant for detailed status display
interface PropertyStatusDetailedProps {
  status: PropertyStatusType;
  showDescription?: boolean;
  className?: string;
}

export const PropertyStatusDetailed: React.FC<PropertyStatusDetailedProps> = ({
  status,
  showDescription = true,
  className = "",
}) => {
  const getStatusConfig = () => {
    const configs = {
      available: {
        label: "Available Now",
        bgColor: "bg-green-50",
        textColor: "text-green-900",
        borderColor: "border-green-200",
        accentColor: "bg-green-500",
        icon: CheckCircle,
        iconColor: "text-green-600",
        description:
          "This property is ready for viewing and accepting applications.",
        action: "Schedule a tour or apply now",
      },
      pending: {
        label: "Application Pending",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-900",
        borderColor: "border-yellow-200",
        accentColor: "bg-yellow-500",
        icon: Clock,
        iconColor: "text-yellow-600",
        description: "An application is being reviewed for this property.",
        action: "May become available soon",
      },
      rented: {
        label: "Currently Rented",
        bgColor: "bg-blue-50",
        textColor: "text-blue-900",
        borderColor: "border-blue-200",
        accentColor: "bg-blue-500",
        icon: CheckCircle,
        iconColor: "text-blue-600",
        description: "This property is currently occupied by a tenant.",
        action: "Save for future availability",
      },
      sold: {
        label: "Sold",
        bgColor: "bg-purple-50",
        textColor: "text-purple-900",
        borderColor: "border-purple-200",
        accentColor: "bg-purple-500",
        icon: CheckCircle,
        iconColor: "text-purple-600",
        description: "This property has been sold.",
        action: "Browse similar properties",
      },
      off_market: {
        label: "Off Market",
        bgColor: "bg-gray-50",
        textColor: "text-gray-900",
        borderColor: "border-gray-200",
        accentColor: "bg-gray-500",
        icon: EyeOff,
        iconColor: "text-gray-600",
        description: "This property is temporarily not available for viewing.",
        action: "Contact owner for details",
      },
      draft: {
        label: "Draft",
        bgColor: "bg-orange-50",
        textColor: "text-orange-900",
        borderColor: "border-orange-200",
        accentColor: "bg-orange-500",
        icon: Edit,
        iconColor: "text-orange-600",
        description: "This listing is not yet published.",
        action: "Complete and publish listing",
      },
    };

    return configs[status] || configs.draft;
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bgColor} ${config.textColor} 
        border ${config.borderColor}
        rounded-lg p-4 ${className}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Accent Bar */}
        <div className={`w-1 h-full ${config.accentColor} rounded-full`} />

        {/* Icon */}
        <div className={`${config.iconColor} mt-0.5`}>
          <Icon size={24} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-1">{config.label}</h4>
          {showDescription && (
            <>
              <p className="text-sm opacity-90 mb-2">{config.description}</p>
              <p className="text-xs font-medium opacity-75">{config.action}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Status badge with tooltip
interface PropertyStatusWithTooltipProps {
  status: PropertyStatusType;
  size?: "sm" | "md" | "lg";
}

export const PropertyStatusWithTooltip: React.FC<
  PropertyStatusWithTooltipProps
> = ({ status, size = "md" }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const getStatusConfig = () => {
    const configs = {
      available: {
        label: "Available",
        description: "Ready for viewing and applications",
        color: "green",
      },
      pending: {
        label: "Pending",
        description: "Application under review",
        color: "yellow",
      },
      rented: {
        label: "Rented",
        description: "Currently leased",
        color: "blue",
      },
      sold: {
        label: "Sold",
        description: "Property sold",
        color: "purple",
      },
      off_market: {
        label: "Off Market",
        description: "Not currently listed",
        color: "gray",
      },
      draft: {
        label: "Draft",
        description: "Not yet published",
        color: "orange",
      },
    };

    return configs[status] || configs.draft;
  };

  const config = getStatusConfig();

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <PropertyStatus status={status} size={size} />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div className="bg-gray-900 text-white text-xs rounded py-1 px-3 whitespace-nowrap">
            {config.description}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export all variants
export default PropertyStatus;
