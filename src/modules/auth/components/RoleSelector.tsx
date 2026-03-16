// FILE PATH: src/modules/auth/components/RoleSelector.tsx
// Module 1.1: User Authentication & Management - Role Selector Component

import { Home, Briefcase, Key } from "lucide-react";
import React from "react";

import { UserRole } from "../types/auth.types";

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  disabled?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
  disabled = false,
}) => {
  const roleOptions = [
    {
      value: UserRole.TENANT,
      label: "Tenant",
      description: "Looking for a place to rent",
      icon: Home,
      color: "blue",
      features: [
        "Browse properties",
        "Submit applications",
        "Pay rent online",
        "Request maintenance",
      ],
    },
    {
      value: UserRole.LANDLORD,
      label: "Landlord",
      description: "List and manage properties",
      icon: Home,
      color: "green",
      features: [
        "List properties",
        "Screen tenants",
        "Collect rent",
        "Manage maintenance",
      ],
    },
    {
      value: UserRole.AGENT,
      label: "Real Estate Agent",
      description: "Help clients find properties",
      icon: Briefcase,
      color: "purple",
      features: [
        "List client properties",
        "Manage showings",
        "Track commissions",
        "Client management",
      ],
    },
    {
      value: UserRole.PROPERTY_MANAGER,
      label: "Property Manager",
      description: "Manage properties for owners",
      icon: Key,
      color: "orange",
      features: [
        "Full property management",
        "Owner reporting",
        "Tenant screening",
        "Financial tracking",
      ],
    },
    {
      value: UserRole.BUSINESS,
      label: "Business",
      description: "Corporate housing solutions",
      icon: Home,
      color: "indigo",
      features: [
        "Bulk bookings",
        "Employee housing",
        "Volume discounts",
        "Dedicated support",
      ],
    },
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: isSelected
        ? "border-blue-600 bg-blue-50"
        : "border-gray-200 hover:border-blue-300",
      green: isSelected
        ? "border-green-600 bg-green-50"
        : "border-gray-200 hover:border-green-300",
      purple: isSelected
        ? "border-purple-600 bg-purple-50"
        : "border-gray-200 hover:border-purple-300",
      orange: isSelected
        ? "border-orange-600 bg-orange-50"
        : "border-gray-200 hover:border-orange-300",
      indigo: isSelected
        ? "border-indigo-600 bg-indigo-50"
        : "border-gray-200 hover:border-indigo-300",
    };
    return colors[color as keyof typeof colors];
  };

  const getIconColorClass = (color: string) => {
    const colors = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
      indigo: "text-indigo-600",
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Choose Your Account Type
        </h3>
        <p className="text-sm text-gray-600">
          Select the option that best describes you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roleOptions.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.value;

          return (
            <button
              key={role.value}
              type="button"
              onClick={() => !disabled && onRoleChange(role.value)}
              disabled={disabled}
              className={`
                p-5 border-2 rounded-lg text-left transition-all
                ${getColorClasses(role.color, isSelected)}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`
                  p-3 rounded-lg 
                  ${isSelected ? "bg-white" : "bg-gray-50"}
                `}
                >
                  <Icon className={getIconColorClass(role.color)} size={24} />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {role.label}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {role.description}
                  </p>

                  {isSelected && (
                    <ul className="space-y-1">
                      {role.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-gray-600 flex items-center gap-2"
                        >
                          <div
                            className={`w-1 h-1 rounded-full ${
                              role.color === "blue"
                                ? "bg-blue-600"
                                : role.color === "green"
                                  ? "bg-green-600"
                                  : role.color === "purple"
                                    ? "bg-purple-600"
                                    : role.color === "orange"
                                      ? "bg-orange-600"
                                      : "bg-indigo-600"
                            }`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {isSelected && (
                  <div
                    className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    ${
                      role.color === "blue"
                        ? "bg-blue-600"
                        : role.color === "green"
                          ? "bg-green-600"
                          : role.color === "purple"
                            ? "bg-purple-600"
                            : role.color === "orange"
                              ? "bg-orange-600"
                              : "bg-indigo-600"
                    }
                  `}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedRole && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> You can change your account type later in
            your profile settings if needed.
          </p>
        </div>
      )}
    </div>
  );
};
