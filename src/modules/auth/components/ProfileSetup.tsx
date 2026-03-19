// FILE PATH: src/modules/auth/components/ProfileSetup.tsx

import {
  User as UserIcon,
  Camera,
  Home,
  Briefcase,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import React, { useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { UserRole } from "../types/auth.types";

interface ProfileSetupProps {
  onComplete?: () => void;
}
export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const {
    updateProfile,
    uploadAvatar,
    updateLandlordProfile,
    updateTenantProfile,
    updateAgentProfile,
    isUpdating,
    error,
    success,
  } = useProfile();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null,
  );
  const [landlordData, setLandlordData] = useState({
    businessName: "",
    businessRegistration: "",
    taxId: "",
  });
  const [tenantData, setTenantData] = useState({
    employmentStatus: "",
    annualIncome: "",
    moveInDate: "",
    pets: false,
    numberOfOccupants: 1,
  });
  const [agentData, setAgentData] = useState({
    licenseNumber: "",
    licenseState: "",
    brokerageName: "",
    yearsOfExperience: 0,
    specializations: [] as string[],
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      await uploadAvatar(file);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    }
  };

  const handleComplete = async () => {
    try {
      // Update role-specific profile based on user role
      if (user?.role === UserRole.LANDLORD && landlordData.businessName) {
        await updateLandlordProfile(landlordData);
      } else if (
        user?.role === UserRole.TENANT &&
        tenantData.employmentStatus
      ) {
        await updateTenantProfile({
          ...tenantData,
          annualIncome: tenantData.annualIncome
            ? parseFloat(tenantData.annualIncome)
            : undefined,
        });
      } else if (user?.role === UserRole.AGENT && agentData.licenseNumber) {
        await updateAgentProfile(agentData);
      }

      // Update profile completion
      await updateProfile({ profileCompletionPercentage: 100 });

      onComplete?.();
    } catch (err) {
      console.error("Failed to complete profile:", err);
    }
  };

  const handleSkip = () => {
    onComplete?.();
  };

  const stateOptions = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  const specializationOptions = [
    "Residential",
    "Commercial",
    "Luxury",
    "First-time buyers",
    "Investment properties",
    "Rentals",
    "New construction",
  ];

  const toggleSpecialization = (spec: string) => {
    setAgentData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-gray-600">
          Add more details to help others connect with you
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle size={18} />
          <span className="text-sm">{success}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6 pb-6 border-b">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon size={40} className="text-gray-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-600 mt-1">
              Upload a photo to personalize your account
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or GIF. Max size 5MB
            </p>
          </div>
        </div>

        {/* Landlord Profile */}
        {user?.role === UserRole.LANDLORD && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Home className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold">Landlord Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name (Optional)
              </label>
              <input
                type="text"
                value={landlordData.businessName}
                onChange={(e) =>
                  setLandlordData({
                    ...landlordData,
                    businessName: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your Property Management Company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Registration Number (Optional)
              </label>
              <input
                type="text"
                value={landlordData.businessRegistration}
                onChange={(e) =>
                  setLandlordData({
                    ...landlordData,
                    businessRegistration: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ABN/ACN/Business Number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax ID (Optional)
              </label>
              <input
                type="text"
                value={landlordData.taxId}
                onChange={(e) =>
                  setLandlordData({ ...landlordData, taxId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="XX-XXXXXXX"
              />
            </div>
          </div>
        )}

        {/* Tenant Profile */}
        {user?.role === UserRole.TENANT && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold">Tenant Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Status (Optional)
              </label>
              <select
                value={tenantData.employmentStatus}
                onChange={(e) =>
                  setTenantData({
                    ...tenantData,
                    employmentStatus: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select status</option>
                <option value="employed">Employed Full-time</option>
                <option value="parttime">Employed Part-time</option>
                <option value="selfemployed">Self-employed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Income (Optional)
              </label>
              <input
                type="number"
                value={tenantData.annualIncome}
                onChange={(e) =>
                  setTenantData({ ...tenantData, annualIncome: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="75000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desired Move-in Date (Optional)
              </label>
              <input
                type="date"
                value={tenantData.moveInDate}
                onChange={(e) =>
                  setTenantData({ ...tenantData, moveInDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Occupants
              </label>
              <input
                type="number"
                min="1"
                value={tenantData.numberOfOccupants}
                onChange={(e) =>
                  setTenantData({
                    ...tenantData,
                    numberOfOccupants: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tenantData.pets}
                  onChange={(e) =>
                    setTenantData({ ...tenantData, pets: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">I have pets</span>
              </label>
            </div>
          </div>
        )}

        {/* Agent Profile */}
        {user?.role === UserRole.AGENT && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold">Agent Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number *
              </label>
              <input
                type="text"
                value={agentData.licenseNumber}
                onChange={(e) =>
                  setAgentData({ ...agentData, licenseNumber: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="License #"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License State *
              </label>
              <select
                value={agentData.licenseState}
                onChange={(e) =>
                  setAgentData({ ...agentData, licenseState: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select state</option>
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brokerage Name *
              </label>
              <input
                type="text"
                value={agentData.brokerageName}
                onChange={(e) =>
                  setAgentData({ ...agentData, brokerageName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your Brokerage"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                value={agentData.yearsOfExperience}
                onChange={(e) =>
                  setAgentData({
                    ...agentData,
                    yearsOfExperience: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations
              </label>
              <div className="flex flex-wrap gap-2">
                {specializationOptions.map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpecialization(spec)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      agentData.specializations.includes(spec)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Skip for Now
          </button>
          <button
            onClick={handleComplete}
            disabled={isUpdating}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
          >
            {isUpdating ? "Saving..." : "Complete Setup"}
          </button>
        </div>
      </div>
    </div>
  );
};
