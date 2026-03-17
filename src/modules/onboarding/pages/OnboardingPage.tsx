import { Building2, Shield, Users } from "lucide-react";
import React from "react";

import { OnboardingWizard } from "../components/OnboardingWizard";
import { SetupGuide } from "../components/SetupGuide";

import { useAppSelector } from "@/store";
import type { RootState } from "@/store";

const OnboardingPage: React.FC = () => {
  const { role, completed } = useAppSelector(
    (state: RootState) => state.onboarding,
  );

  return (
    <div className="min-h-screen bg-[#f1f3f4]">
      {/* Header */}
      <div className="bg-[#091a2b] text-white py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="w-7 h-7" />
            <span className="font-montserrat text-xl font-bold">
              RealEstate AI
            </span>
          </div>
          <p className="font-open-sans text-white/80 text-sm">
            Property Management, Powered by AI
          </p>
        </div>
      </div>

      {/* Social proof bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center gap-6 text-sm font-open-sans text-gray-600">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#005163]" />
            <span>
              <strong className="text-[#091a2b]">50,000+</strong> units managed
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-300" />
          <div className="hidden sm:flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#005163]" />
            <span>
              <strong className="text-[#091a2b]">99.9%</strong> uptime
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <OnboardingWizard />

        {/* Show guide after role is selected and onboarding is not yet completed */}
        {role && !completed && <SetupGuide role={role} />}
      </div>
    </div>
  );
};

export default OnboardingPage;
