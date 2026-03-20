import {
  Home,
  Users,
  DollarSign,
  FileText,
  CreditCard,
  ClipboardList,
  MessageSquare,
  Calendar,
  Building2,
  BarChart3,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { UserRole } from "../../auth/types/auth.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = React.ComponentType<any>;

interface GuideLink {
  label: string;
  href: string;
  icon: IconComponent;
}

interface GuideConfig {
  headline: string;
  content: string;
  links: GuideLink[];
}

const GUIDE_MAP: Record<string, GuideConfig> = {
  [UserRole.LANDLORD]: {
    headline: "Welcome, Landlord!",
    content:
      "Learn how to add your first property, screen tenants, and collect rent online.",
    links: [
      { label: "Add Property", href: "/properties", icon: Home },
      { label: "Tenant Screening", href: "/applications", icon: Users },
      { label: "Rent Collection", href: "/payments", icon: DollarSign },
    ],
  },
  [UserRole.TENANT]: {
    headline: "Welcome, Tenant!",
    content:
      "Learn how to update your profile, view your lease, and pay rent online.",
    links: [
      { label: "Profile Settings", href: "/profile-setup", icon: FileText },
      { label: "Lease Details", href: "/leases", icon: ClipboardList },
      { label: "Rent Payment", href: "/payments", icon: CreditCard },
    ],
  },
  [UserRole.AGENT]: {
    headline: "Welcome, Agent!",
    content:
      "Learn how to manage properties, communicate with tenants, and schedule inspections.",
    links: [
      { label: "Property Management", href: "/properties", icon: Home },
      {
        label: "Tenant Communication",
        href: "/tenant-portal",
        icon: MessageSquare,
      },
      {
        label: "Inspection Scheduling",
        href: "/inspections",
        icon: Calendar,
      },
    ],
  },
  [UserRole.PROPERTY_MANAGER]: {
    headline: "Welcome, Property Manager!",
    content:
      "Learn how to oversee multiple properties, generate reports, and optimize your portfolio.",
    links: [
      { label: "Property Overview", href: "/landlord-portal", icon: Building2 },
      { label: "Reporting & Analytics", href: "/admin", icon: BarChart3 },
      {
        label: "Portfolio Optimization",
        href: "/dashboard",
        icon: TrendingUp,
      },
    ],
  },
};

interface SetupGuideProps {
  role: UserRole | null;
}

export const SetupGuide: React.FC<SetupGuideProps> = ({ role }) => {
  if (!role || !GUIDE_MAP[role]) {
    return null;
  }

  const guide = GUIDE_MAP[role];

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#008080] px-6 py-5">
          <h2 className="text-xl font-montserrat font-bold text-white">
            {guide.headline}
          </h2>
          <p className="text-white/80 font-open-sans text-sm mt-1">
            {guide.content}
          </p>
        </div>

        {/* Quick links */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-500 font-open-sans uppercase tracking-wider mb-4">
            Quick Start
          </h3>
          <div className="space-y-2">
            {guide.links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#008080]/40 hover:bg-[#008080]/5 transition-all group"
                >
                  <div className="p-2.5 rounded-lg bg-[#008080]/10 text-[#008080] group-hover:bg-[#008080] group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="flex-1 font-open-sans font-semibold text-[#1A1A2E] text-sm">
                    {link.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008080] transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
