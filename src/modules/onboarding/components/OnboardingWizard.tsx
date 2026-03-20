import {
  Home,
  Briefcase,
  Key,
  Building2,
  User,
  Bell,
  CreditCard,
  Camera,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Shield,
} from "lucide-react";
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { UserRole } from "../../auth/types/auth.types";
import {
  nextStep,
  prevStep,
  setRole,
  setProfile,
  setProperty,
  setBankConnected,
  setNotificationPreferences,
  completeOnboarding,
} from "../store/onboardingSlice";
import type { OnboardingState } from "../store/onboardingSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store";
import type { RootState } from "@/store";

const STEPS = [
  { label: "Role", icon: User },
  { label: "Profile", icon: User },
  { label: "Property", icon: Home },
  { label: "Banking", icon: CreditCard },
  { label: "Notifications", icon: Bell },
];

// ── Progress Bar ──
const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      {/* Step indicators */}
      <div className="flex justify-between mb-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step.label}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-realestate-primary text-white"
                    : isActive
                      ? "bg-realestate-primary text-white ring-4 ring-realestate-primary/20"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-xs font-open-sans ${
                  isActive || isCompleted
                    ? "text-realestate-primary font-semibold"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-realestate-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ── Step 1: Role Selection ──
const RoleStep: React.FC<{
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
}> = ({ selectedRole, onSelect }) => {
  const roles = [
    {
      value: UserRole.TENANT,
      label: "Tenant",
      description: "Find and rent your perfect home",
      icon: Home,
    },
    {
      value: UserRole.LANDLORD,
      label: "Landlord",
      description: "Manage your rental properties",
      icon: Key,
    },
    {
      value: UserRole.AGENT,
      label: "Agent",
      description: "Help clients find properties",
      icon: Briefcase,
    },
    {
      value: UserRole.PROPERTY_MANAGER,
      label: "Property Manager",
      description: "Oversee multiple properties",
      icon: Building2,
    },
    {
      value: UserRole.BUSINESS,
      label: "Business",
      description: "Corporate housing solutions",
      icon: Building2,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-realestate-primary mb-2">
        What best describes you?
      </h2>
      <p className="text-gray-600 font-open-sans mb-6">
        Select your role so we can personalize your experience.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.value;

          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onSelect(role.value)}
              className={`p-5 border-2 rounded-xl text-left transition-all duration-200 ${
                isSelected
                  ? "border-realestate-primary bg-realestate-primary/5 shadow-md"
                  : "border-gray-200 hover:border-realestate-primary/40 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    isSelected
                      ? "bg-realestate-primary text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-montserrat font-semibold text-realestate-primary">
                    {role.label}
                  </h4>
                  <p className="text-sm text-gray-500 font-open-sans">
                    {role.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-realestate-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Step 2: Profile Setup ──
const ProfileStep: React.FC<{
  profile: OnboardingState["profile"];
  onChange: (profile: OnboardingState["profile"]) => void;
}> = ({ profile, onChange }) => {
  const handleChange = (
    field: keyof OnboardingState["profile"],
    value: string,
  ) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-realestate-primary mb-2">
        Set up your profile
      </h2>
      <p className="text-gray-600 font-open-sans mb-6">
        Tell us a bit about yourself to get started.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-realestate-primary font-open-sans mb-1.5">
            Full Name
          </label>
          <Input
            placeholder="John Doe"
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border-gray-300 focus-visible:ring-realestate-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-realestate-primary font-open-sans mb-1.5">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={profile.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border-gray-300 focus-visible:ring-realestate-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-realestate-primary font-open-sans mb-1.5">
            Phone Number
          </label>
          <Input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={profile.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="border-gray-300 focus-visible:ring-realestate-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-realestate-primary font-open-sans mb-1.5">
            Address
          </label>
          <Input
            placeholder="123 Main St, City, State"
            value={profile.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="border-gray-300 focus-visible:ring-realestate-primary"
          />
        </div>
      </div>
    </div>
  );
};

// ── Step 3: Add Property ──
const PropertyStep: React.FC<{
  property: OnboardingState["property"];
  onChange: (property: OnboardingState["property"]) => void;
}> = ({ property, onChange }) => {
  const [showAhaInsights, setShowAhaInsights] = useState(false);

  const handleAddProperty = () => {
    if (property.address.trim()) {
      onChange({ ...property, added: true });
      setShowAhaInsights(true);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-realestate-primary mb-2">
        Add your first property
      </h2>
      <p className="text-gray-600 font-open-sans mb-6">
        Enter a property address to see AI-powered insights instantly.
      </p>

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-semibold text-realestate-primary font-open-sans mb-1.5">
            Property Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Start typing an address..."
              value={property.address}
              onChange={(e) =>
                onChange({ ...property, address: e.target.value, added: false })
              }
              className="pl-10 border-gray-300 focus-visible:ring-realestate-primary"
            />
          </div>
        </div>

        {/* AI Photo Enhancement placeholder */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <Camera className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-realestate-primary font-open-sans">
            Upload property photos
          </p>
          <p className="text-xs text-gray-500 font-open-sans mt-1">
            AI will automatically enhance your photos for listings
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-realestate-primary/10 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-realestate-primary/80" />
            <span className="text-xs font-semibold text-realestate-primary/80">
              AI Enhancement Available
            </span>
          </div>
        </div>

        {!property.added && (
          <Button
            onClick={handleAddProperty}
            disabled={!property.address.trim()}
            className="w-full bg-realestate-primary hover:bg-realestate-primary/90 text-white"
          >
            Add Property
          </Button>
        )}

        {/* Aha moment - AI insights */}
        {showAhaInsights && (
          <div className="animate-fade-in space-y-3 mt-4">
            <div className="bg-gradient-to-r from-realestate-primary to-realestate-primary/80 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-montserrat font-bold">
                  AI Property Valuation
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/70 text-xs font-open-sans">
                    Estimated Value
                  </p>
                  <p className="text-2xl font-bold font-montserrat">$485,000</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs font-open-sans">
                    Monthly Rent Estimate
                  </p>
                  <p className="text-2xl font-bold font-montserrat">$2,450</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-realestate-primary/80" />
                <h4 className="font-montserrat font-semibold text-realestate-primary">
                  Optimization Suggestions
                </h4>
              </div>
              <ul className="space-y-2">
                {[
                  "Professional photos could increase inquiries by 40%",
                  "Pricing is 5% below market — consider adjusting",
                  "Add virtual tour to attract remote tenants",
                ].map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm text-gray-600 font-open-sans"
                  >
                    <Check className="w-4 h-4 text-realestate-success mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Step 4: Bank Account ──
const BankStep: React.FC<{
  connected: boolean;
  onConnect: (connected: boolean) => void;
}> = ({ connected, onConnect }) => {
  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-realestate-primary mb-2">
        Connect your bank account
      </h2>
      <p className="text-gray-600 font-open-sans mb-6">
        Enable seamless rent collection and payment processing.
      </p>

      <div className="space-y-4">
        {/* Placeholder bank connection UI */}
        <div
          className={`border-2 rounded-xl p-6 transition-all ${
            connected
              ? "border-realestate-success bg-realestate-success/10"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-lg ${
                connected
                  ? "bg-realestate-success text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-montserrat font-semibold text-realestate-primary">
                {connected ? "Bank Account Connected" : "Bank Account"}
              </h4>
              <p className="text-sm text-gray-500 font-open-sans">
                {connected
                  ? "Your account is securely connected"
                  : "Securely link your bank for rent collection"}
              </p>
            </div>
            {connected && <Check className="w-6 h-6 text-realestate-success" />}
          </div>
        </div>

        {!connected && (
          <Button
            onClick={() => onConnect(true)}
            className="w-full bg-realestate-primary hover:bg-realestate-primary/90 text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Connect Bank Account
          </Button>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 font-open-sans">
          <Shield className="w-4 h-4" />
          <span>256-bit encryption. Your data is always secure.</span>
        </div>

        <button
          type="button"
          onClick={() => onConnect(false)}
          className="text-sm text-realestate-primary/80 underline font-open-sans hover:text-realestate-primary/60"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

// ── Step 5: Notification Preferences ──
const NotificationStep: React.FC<{
  preferences: OnboardingState["notificationPreferences"];
  onChange: (prefs: OnboardingState["notificationPreferences"]) => void;
}> = ({ preferences, onChange }) => {
  const options = [
    {
      key: "email" as const,
      label: "Email Notifications",
      description: "Property updates, lease reminders, payment receipts",
    },
    {
      key: "sms" as const,
      label: "SMS Notifications",
      description: "Urgent alerts and time-sensitive updates",
    },
    {
      key: "push" as const,
      label: "Push Notifications",
      description: "Real-time alerts on your device",
    },
    {
      key: "inApp" as const,
      label: "In-App Notifications",
      description: "Updates within your dashboard",
    },
  ];

  const toggle = (key: keyof OnboardingState["notificationPreferences"]) => {
    onChange({ ...preferences, [key]: !preferences[key] });
  };

  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-realestate-primary mb-2">
        Notification preferences
      </h2>
      <p className="text-gray-600 font-open-sans mb-6">
        Choose how you&apos;d like to stay informed.
      </p>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => toggle(option.key)}
            className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
              preferences[option.key]
                ? "border-realestate-primary bg-realestate-primary/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-open-sans font-semibold text-realestate-primary text-sm">
                  {option.label}
                </h4>
                <p className="text-xs text-gray-500 font-open-sans mt-0.5">
                  {option.description}
                </p>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-all relative ${
                  preferences[option.key]
                    ? "bg-realestate-primary"
                    : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                    preferences[option.key] ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Final CTA */}
      <div className="mt-8 p-5 bg-gradient-to-r from-realestate-primary to-realestate-primary/80 rounded-xl text-white text-center">
        <h3 className="font-montserrat font-bold text-lg mb-1">
          You&apos;re all set!
        </h3>
        <p className="text-white/80 text-sm font-open-sans mb-4">
          Start managing your properties with AI-powered tools.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-open-sans">
          <Sparkles className="w-4 h-4" />
          Start Free 14-Day Trial (no credit card)
        </div>
      </div>
    </div>
  );
};

// ── Main Wizard ──
export const OnboardingWizard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onboarding = useAppSelector((state: RootState) => state.onboarding);

  const {
    currentStep,
    totalSteps,
    role,
    profile,
    property,
    bankConnected,
    notificationPreferences,
  } = onboarding;

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 0:
        return role !== null;
      case 1:
        return profile.name.trim() !== "" && profile.email.trim() !== "";
      case 2:
        return true; // Property is optional
      case 3:
        return true; // Bank is optional
      case 4:
        return true;
      default:
        return false;
    }
  }, [currentStep, role, profile]);

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      dispatch(completeOnboarding());
      navigate("/dashboard");
      return;
    }
    dispatch(nextStep());
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <RoleStep
            selectedRole={role}
            onSelect={(r) => dispatch(setRole(r))}
          />
        );
      case 1:
        return (
          <ProfileStep
            profile={profile}
            onChange={(p) => dispatch(setProfile(p))}
          />
        );
      case 2:
        return (
          <PropertyStep
            property={property}
            onChange={(p) => dispatch(setProperty(p))}
          />
        );
      case 3:
        return (
          <BankStep
            connected={bankConnected}
            onConnect={(c) => dispatch(setBankConnected(c))}
          />
        );
      case 4:
        return (
          <NotificationStep
            preferences={notificationPreferences}
            onChange={(p) => dispatch(setNotificationPreferences(p))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-realestate-primary"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-realestate-primary hover:bg-realestate-primary/90 text-white px-8"
          >
            {currentStep === totalSteps - 1 ? (
              "Complete Setup"
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
