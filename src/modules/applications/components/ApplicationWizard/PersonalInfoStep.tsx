// PLACEHOLDER FILE: components\ApplicationWizard\PersonalInfoStep.tsx
// TODO: Add your implementation here

import {
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  MapPin,
  Upload,
} from "lucide-react";
import React, { useState } from "react";

import { useApplicationForm } from "../../hooks/useApplicationForm";
import {
  validatePersonalInfo,
  formatSSN,
  formatPhoneNumber,
} from "../../utils/applicationValidation";

export const PersonalInfoStep: React.FC = () => {
  const { formData, updateNestedField } = useApplicationForm();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const personalInfo = formData.personalInfo || {};

  const handleChange = (field: string, value: string) => {
    updateNestedField("personalInfo", field, value);

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    const validation = validatePersonalInfo(personalInfo);
    if (validation.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }));
    }
  };

  const handleSSNChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 9) {
      handleChange("ssn", formatSSN(cleaned));
    }
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      handleChange("phone", formatPhoneNumber(cleaned));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">
          Please provide accurate information as it appears on your
          government-issued ID
        </p>
      </div>

      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={personalInfo.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Middle Name
          </label>
          <input
            type="text"
            value={personalInfo.middleName || ""}
            onChange={(e) => handleChange("middleName", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="M."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={personalInfo.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            onBlur={() => handleBlur("lastName")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={personalInfo.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="john.doe@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={personalInfo.phone || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={() => handleBlur("phone")}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="(555) 123-4567"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={personalInfo.dateOfBirth || ""}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              onBlur={() => handleBlur("dateOfBirth")}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dateOfBirth ? "border-red-500" : "border-gray-300"
              }`}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Social Security Number *
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={personalInfo.ssn || ""}
              onChange={(e) => handleSSNChange(e.target.value)}
              onBlur={() => handleBlur("ssn")}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.ssn ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="XXX-XX-XXXX"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Your SSN is encrypted and used only for verification
          </p>
          {errors.ssn && (
            <p className="mt-1 text-sm text-red-600">{errors.ssn}</p>
          )}
        </div>
      </div>

      {/* Current Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Current Address
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={personalInfo.currentAddress?.street || ""}
              onChange={(e) => {
                updateNestedField("personalInfo", "currentAddress", {
                  ...(personalInfo.currentAddress || {}),
                  street: e.target.value,
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={personalInfo.currentAddress?.city || ""}
                onChange={(e) => {
                  updateNestedField("personalInfo", "currentAddress", {
                    ...(personalInfo.currentAddress || {}),
                    city: e.target.value,
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="New York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={personalInfo.currentAddress?.state || ""}
                onChange={(e) => {
                  updateNestedField("personalInfo", "currentAddress", {
                    ...(personalInfo.currentAddress || {}),
                    state: e.target.value.toUpperCase(),
                  });
                }}
                maxLength={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={personalInfo.currentAddress?.zipCode || ""}
                onChange={(e) => {
                  updateNestedField("personalInfo", "currentAddress", {
                    ...(personalInfo.currentAddress || {}),
                    zipCode: e.target.value,
                  });
                }}
                maxLength={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10001"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ID Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Identification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Type *
            </label>
            <select
              value={personalInfo.idType || ""}
              onChange={(e) => handleChange("idType", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select ID Type</option>
              <option value="drivers_license">Driver&apos;s License</option>
              <option value="passport">Passport</option>
              <option value="state_id">State ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number *
            </label>
            <input
              type="text"
              value={personalInfo.idNumber || ""}
              onChange={(e) => handleChange("idNumber", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ID Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date *
            </label>
            <input
              type="date"
              value={personalInfo.idExpiration || ""}
              onChange={(e) => handleChange("idExpiration", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Why we need this information:</strong> This information is
          required to verify your identity and process your application. All
          data is encrypted and stored securely in compliance with privacy
          regulations.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
