import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { PageMeta } from "../components/seo";
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Building,
  Star,
  Zap,
  Award,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { getTrialStatus, convertToPaidPlan } from "../services/trialService";
import type { TrialStatus } from "../types/trial";
import type { PlanId, BillingInterval } from "../types/billing";

/* ------------------------------------------------------------------ */
/*  Design tokens – "Nature-Inspired Warmth" palette                   */
/* ------------------------------------------------------------------ */

const palette = {
  primary: "#8B7355",
  secondary: "#A0926B",
  accent: "#C4A882",
  background: "#FAF6F1",
  text: "#2D2A26",
} as const;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PricingTier {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  monthlyPrice: string;
  monthlyUnit: string;
  monthlyMin: string;
  annualPrice: string;
  annualUnit: string;
  annualMin: string;
  features: string[];
  cta: string;
  ctaLink: string;
  highlighted: boolean;
  badge?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface FeatureRow {
  name: string;
  free: boolean | string;
  starter: boolean | string;
  growth: boolean | string;
  enterprise: boolean | string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const tiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    icon: <Building className="w-6 h-6" />,
    description: "Perfect for small landlords getting started with AI management.",
    monthlyPrice: "$29",
    monthlyUnit: "/mo",
    monthlyMin: "Up to 10 properties",
    annualPrice: "$23",
    annualUnit: "/mo",
    annualMin: "Up to 10 properties, billed annually",
    features: [
      "Up to 10 properties",
      "Basic tenant management",
      "Online rent collection",
      "Maintenance requests",
      "14-day free trial",
      "20% annual discount (2 months free)",
    ],
    cta: "Start Free Trial",
    ctaLink: "/auth/register",
    highlighted: false,
  },
  {
    id: "professional",
    name: "Professional",
    icon: <Zap className="w-6 h-6" />,
    description: "For growing portfolios that need powerful AI tools.",
    monthlyPrice: "$79",
    monthlyUnit: "/mo",
    monthlyMin: "Up to 50 properties",
    annualPrice: "$63",
    annualUnit: "/mo",
    annualMin: "Up to 50 properties, billed annually",
    features: [
      "Up to 50 properties",
      "Full AI assistant",
      "Automated tenant screening",
      "Predictive maintenance alerts",
      "Financial reporting",
      "API access",
      "14-day free trial",
      "20% annual discount (2 months free)",
    ],
    cta: "Start Free Trial",
    ctaLink: "/auth/register",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "business",
    name: "Business",
    icon: <Award className="w-6 h-6" />,
    description: "For property management firms scaling operations.",
    monthlyPrice: "$149",
    monthlyUnit: "/mo",
    monthlyMin: "Up to 200 properties",
    annualPrice: "$119",
    annualUnit: "/mo",
    annualMin: "Up to 200 properties, billed annually",
    features: [
      "Up to 200 properties",
      "Advanced AI analytics",
      "Portfolio optimization",
      "Custom workflows",
      "Priority support",
      "White-label options",
      "14-day free trial",
      "20% annual discount (2 months free)",
    ],
    cta: "Start Free Trial",
    ctaLink: "/auth/register",
    highlighted: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: <Star className="w-6 h-6" />,
    description: "Tailored solutions for large-scale property operations.",
    monthlyPrice: "Custom",
    monthlyUnit: "",
    monthlyMin: "Unlimited properties",
    annualPrice: "Custom",
    annualUnit: "",
    annualMin: "Unlimited properties",
    features: [
      "Unlimited properties",
      "Dedicated AI model training",
      "Custom integrations",
      "SLA guarantees",
      "Dedicated account manager",
      "On-premise option",
      "20% annual discount (2 months free)",
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
    highlighted: false,
  },
];

const featureRows: FeatureRow[] = [
  { name: "Properties included", free: "Up to 10", starter: "Up to 50", growth: "Up to 200", enterprise: "Unlimited" },
  { name: "AI insights", free: "Basic", starter: "Advanced", growth: "Full suite", enterprise: "Custom AI" },
  { name: "Tenant management", free: "Basic", starter: true, growth: true, enterprise: true },
  { name: "Online rent collection", free: true, starter: true, growth: true, enterprise: true },
  { name: "Maintenance requests", free: true, starter: "Predictive", growth: "Predictive", enterprise: "Predictive" },
  { name: "Smart rent pricing", free: false, starter: true, growth: true, enterprise: true },
  { name: "Automated workflows", free: false, starter: true, growth: true, enterprise: true },
  { name: "Custom reporting", free: false, starter: false, growth: true, enterprise: true },
  { name: "API access", free: false, starter: false, growth: true, enterprise: true },
  { name: "eSignatures", free: false, starter: true, growth: true, enterprise: true },
  { name: "Team management", free: false, starter: false, growth: true, enterprise: true },
  { name: "White-label option", free: false, starter: false, growth: false, enterprise: true },
  { name: "Dedicated account manager", free: false, starter: false, growth: false, enterprise: true },
  { name: "Custom integrations", free: false, starter: false, growth: true, enterprise: true },
  { name: "SLA guarantee", free: false, starter: false, growth: false, enterprise: true },
  { name: "Support", free: "Email", starter: "Priority", growth: "Dedicated", enterprise: "24/7 Dedicated" },
];

const faqs: FAQ[] = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes. You can upgrade or downgrade your plan at any time from your account settings. When you upgrade, the new features become available immediately and billing is prorated. When you downgrade, the change takes effect at the start of your next billing cycle.",
  },
  {
    question: "How does the free trial work?",
    answer:
      "Every new account starts with a 14-day free trial on the Starter tier. No credit card is required. You get access to up to 10 properties, basic tenant management, online rent collection, and maintenance requests. At the end of the trial, choose a paid plan to keep all your data and unlock more features.",
  },
  {
    question: "What happens after my free trial ends?",
    answer:
      "After your 14-day free trial you will be prompted to choose a paid plan. Your data is preserved for 30 days so you have time to decide. If you do not subscribe within 30 days, your account data will be securely deleted.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes. Annual billing saves you 20% compared to monthly billing — that's 2 months free. The annual price is billed as a single payment at the start of each year. You can switch between monthly and annual billing from your account settings.",
  },
  {
    question: "Can I migrate my data from another platform?",
    answer:
      "Absolutely. We offer free assisted migration for all paid plans. Our team will help you import your properties, tenants, leases, and historical data from platforms like AppFolio, Buildium, Rent Manager, and others. Enterprise customers receive a dedicated migration specialist.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Security is our top priority. All data is encrypted at rest and in transit using AES-256 encryption. We are SOC 2 Type II compliant and undergo regular third-party security audits. Your data is hosted in geographically redundant data centers with 99.99% uptime.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), ACH bank transfers, and wire transfers. Enterprise customers can also pay by invoice with net-30 terms.",
  },
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes. There are no long-term contracts or cancellation fees. You can cancel your subscription at any time from your account settings. Your access continues until the end of your current billing period. We also offer a 30-day money-back guarantee on all paid plans.",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function TrialBanner({ trialStatus }: { trialStatus: TrialStatus }) {
  const navigate = useNavigate();
  const { daysRemaining, isTrialing } = trialStatus;
  const isExpiringSoon = isTrialing && daysRemaining <= 3;

  if (!isTrialing) return null;

  return (
    <div
      className="rounded-xl p-5 sm:p-6 mb-10 animate-fade-in"
      style={{
        backgroundColor: isExpiringSoon ? "#FEF3C7" : palette.background,
        border: `1px solid ${isExpiringSoon ? "#F59E0B" : palette.accent}`,
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isExpiringSoon ? (
            <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: "#D97706" }} />
          ) : (
            <Clock className="w-6 h-6 flex-shrink-0" style={{ color: palette.accent }} />
          )}
          <div>
            <p
              className="font-semibold text-base"
              style={{ fontFamily: "Inter, sans-serif", color: palette.text }}
            >
              {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining in your free trial
            </p>
            {isExpiringSoon && (
              <p
                className="text-sm mt-0.5"
                style={{ fontFamily: "Inter, sans-serif", color: "#92400E" }}
              >
                Upgrade now to unlock AI-powered analytics and market reports
              </p>
            )}
          </div>
        </div>

        {isExpiringSoon && (
          <button
            type="button"
            onClick={() => navigate("/auth/register?upgrade=true")}
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              fontFamily: "Inter, sans-serif",
              backgroundColor: palette.accent,
              color: palette.text,
            }}
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function TrialExpiredBanner() {
  return (
    <div
      className="rounded-xl p-5 sm:p-6 mb-10 animate-fade-in"
      style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 text-red-500" />
          <div>
            <p
              className="font-semibold text-base"
              style={{ fontFamily: "Inter, sans-serif", color: palette.text }}
            >
              Your free trial has expired
            </p>
            <p className="text-sm mt-0.5 text-red-700" style={{ fontFamily: "Inter, sans-serif" }}>
              Upgrade to a paid plan to regain access to all features
            </p>
          </div>
        </div>
        <Link
          to="/auth/register?upgrade=true"
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-90"
          style={{
            fontFamily: "Inter, sans-serif",
            backgroundColor: palette.accent,
            color: palette.text,
          }}
        >
          Choose a Plan
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function BillingToggle({
  isAnnual,
  onToggle,
}: {
  isAnnual: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 animate-fade-in">
      <span
        className="text-sm font-medium transition-colors duration-200"
        style={{
          fontFamily: "Inter, sans-serif",
          color: !isAnnual ? palette.primary : "#9CA3AF",
        }}
      >
        Monthly
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isAnnual}
        aria-label="Toggle annual billing"
        onClick={onToggle}
        className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: isAnnual ? palette.accent : "#D1D5DB",
          ...(isAnnual ? {} : {}),
        }}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
            isAnnual ? "translate-x-8" : "translate-x-1"
          }`}
        />
      </button>

      <span
        className="text-sm font-medium transition-colors duration-200"
        style={{
          fontFamily: "Inter, sans-serif",
          color: isAnnual ? palette.primary : "#9CA3AF",
        }}
      >
        Annual
      </span>

      {isAnnual && (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700 animate-scale-up">
          Save 20%
        </span>
      )}
    </div>
  );
}

function PricingCard({
  tier,
  isAnnual,
  trialStatus,
  onConvert,
}: {
  tier: PricingTier;
  isAnnual: boolean;
  trialStatus: TrialStatus | null;
  onConvert: (planId: PlanId, interval: BillingInterval) => void;
}) {
  const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
  const unit = isAnnual ? tier.annualUnit : tier.monthlyUnit;
  const min = isAnnual ? tier.annualMin : tier.monthlyMin;

  const isTrialing = trialStatus?.isTrialing ?? false;
  const isExpired = trialStatus != null && !trialStatus.isTrialing && !trialStatus.hasConverted;
  const isExpiringSoon = isTrialing && (trialStatus?.daysRemaining ?? 0) <= 3;

  // Determine CTA text based on trial state
  let ctaText = tier.cta;
  if (tier.id !== "enterprise") {
    if (isExpired || isExpiringSoon) {
      ctaText = `Upgrade to ${tier.name}`;
    } else if (isTrialing) {
      ctaText = `Upgrade to ${tier.name}`;
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (tier.id !== "enterprise" && (isTrialing || isExpired)) {
      e.preventDefault();
      onConvert(tier.id as PlanId, isAnnual ? "yearly" : "monthly");
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-xl p-6 sm:p-8 transition-all duration-300 ${
        tier.highlighted
          ? "scale-[1.02] z-10"
          : ""
      }`}
      style={{
        border: tier.highlighted ? `2px solid ${palette.accent}` : "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        boxShadow: tier.highlighted
          ? "0 10px 30px -5px rgba(139, 115, 85, 0.15)"
          : "0 1px 3px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Badge */}
      {tier.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-4 py-1 text-xs font-bold shadow-sm"
            style={{ backgroundColor: palette.accent, color: palette.primary }}
          >
            <Star className="w-3 h-3" />
            {tier.badge}
          </span>
        </div>
      )}

      {/* Icon & Name */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg"
          style={{
            backgroundColor: tier.highlighted ? `${palette.accent}1A` : `${palette.primary}0D`,
            color: tier.highlighted ? palette.accent : palette.primary,
          }}
        >
          {tier.icon}
        </div>
        <h3
          className="text-xl font-semibold"
          style={{ fontFamily: "'DM Serif Display', serif", color: palette.text }}
        >
          {tier.name}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm mb-6" style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>
        {tier.description}
      </p>

      {/* Price */}
      <div className="mb-1">
        <span
          className="text-4xl font-bold"
          style={{ fontFamily: "'DM Serif Display', serif", color: palette.text }}
        >
          {price}
        </span>
        <span className="text-sm ml-1" style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>
          {unit}
        </span>
      </div>
      {min && (
        <p className="text-xs mb-6" style={{ fontFamily: "Inter, sans-serif", color: "#9CA3AF" }}>
          {min}
        </p>
      )}
      {!min && <div className="mb-6" />}

      {/* CTA */}
      <Link
        to={tier.ctaLink}
        onClick={handleClick}
        className="flex items-center justify-center gap-2 w-full rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 mb-8"
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: tier.highlighted
            ? palette.accent
            : tier.id === "enterprise"
            ? "transparent"
            : palette.primary,
          color: tier.highlighted
            ? palette.text
            : tier.id === "enterprise"
            ? palette.primary
            : "#FFFFFF",
          border: tier.id === "enterprise" ? `1px solid ${palette.primary}` : "none",
        }}
      >
        {ctaText}
        <ArrowRight className="w-4 h-4" />
      </Link>

      {/* Features */}
      <ul className="space-y-3 flex-1" role="list">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: tier.highlighted ? palette.accent : "#22C55E" }}
              aria-hidden="true"
            />
            <span className="text-sm" style={{ fontFamily: "Inter, sans-serif", color: "#4B5563" }}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return (
      <span className="text-sm font-medium" style={{ fontFamily: "Inter, sans-serif", color: "#374151" }}>
        {value}
      </span>
    );
  }
  return value ? (
    <Check className="w-5 h-5 text-green-500 mx-auto" aria-label="Included" />
  ) : (
    <X className="w-5 h-5 text-gray-300 mx-auto" aria-label="Not included" />
  );
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg px-2 -mx-2"
        style={{ focusRingColor: palette.accent } as React.CSSProperties}
      >
        <span
          className="text-base font-semibold pr-4"
          style={{ fontFamily: "'DM Serif Display', serif", color: palette.primary }}
        >
          {faq.question}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: palette.secondary }} />
        ) : (
          <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: palette.secondary }} />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm leading-relaxed px-2" style={{ fontFamily: "Inter, sans-serif", color: "#4B5563" }}>
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [loadingTrial, setLoadingTrial] = useState(true);

  useEffect(() => {
    // Attempt to load trial status for the current user
    // In production this would use the authenticated user ID
    const userId = localStorage.getItem("userId") || "current-user";
    getTrialStatus(userId)
      .then(setTrialStatus)
      .finally(() => setLoadingTrial(false));
  }, []);

  const handleConvert = async (planId: PlanId, interval: BillingInterval) => {
    const userId = localStorage.getItem("userId") || "current-user";
    const result = await convertToPaidPlan(userId, planId, interval);
    if (result.success && result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
    }
  };

  const isTrialing = trialStatus?.isTrialing ?? false;
  const isExpired = trialStatus != null && !trialStatus.isTrialing && !trialStatus.hasConverted;

  return (
    <div className="pt-24 pb-20" style={{ backgroundColor: "#FFFFFF" }}>
      <PageMeta
        title="Pricing Plans"
        description="Simple, transparent pricing for AI-powered property management. Start free with a 14-day trial, scale as you grow. Plans from $29/mo for small landlords to custom enterprise solutions."
        keywords="property management pricing, landlord software cost, AI property management plans"
        canonicalUrl="https://realestate-ai.com/pricing"
      />

      {/* ---- Header ---- */}
      <section className="section-container text-center mb-12 animate-fade-in">
        <h1
          className="text-4xl sm:text-5xl mb-4 font-bold"
          style={{ fontFamily: "'DM Serif Display', serif", color: palette.primary }}
        >
          Simple, Transparent Pricing
        </h1>
        <p
          className="text-lg max-w-2xl mx-auto"
          style={{ fontFamily: "Inter, sans-serif", color: palette.secondary }}
        >
          Start free, scale as you grow. No hidden fees, cancel anytime.
        </p>
      </section>

      {/* ---- Trial Status Banner ---- */}
      {!loadingTrial && (
        <section className="section-container">
          {isTrialing && trialStatus && <TrialBanner trialStatus={trialStatus} />}
          {isExpired && <TrialExpiredBanner />}
        </section>
      )}

      {/* ---- Free Trial Info ---- */}
      <section className="section-container mb-8">
        <div className="text-center animate-fade-in">
          <p
            className="text-base font-medium"
            style={{ fontFamily: "Inter, sans-serif", color: palette.text }}
          >
            Try it free for 14 days — no credit card required
          </p>
        </div>
      </section>

      {/* ---- Billing Toggle ---- */}
      <section className="section-container mb-14">
        <BillingToggle isAnnual={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} />
      </section>

      {/* ---- Pricing Cards ---- */}
      <section className="section-container mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-4 items-start">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              isAnnual={isAnnual}
              trialStatus={trialStatus}
              onConvert={handleConvert}
            />
          ))}
        </div>
      </section>

      {/* ---- Feature Comparison Table ---- */}
      <section className="section-container mb-24 animate-fade-in">
        <h2
          className="text-3xl text-center mb-10 font-bold"
          style={{ fontFamily: "'DM Serif Display', serif", color: palette.primary }}
        >
          Compare Plans
        </h2>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse" role="table">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th
                  className="text-left py-4 pr-4 text-sm font-semibold w-1/5"
                  style={{ fontFamily: "'DM Serif Display', serif", color: palette.primary }}
                >
                  Feature
                </th>
                <th
                  className="text-center py-4 px-4 text-sm font-semibold w-1/5"
                  style={{ fontFamily: "'DM Serif Display', serif", color: palette.primary }}
                >
                  Starter
                </th>
                <th
                  className="text-center py-4 px-4 text-sm font-semibold w-1/5"
                  style={{ fontFamily: "'DM Serif Display', serif", color: palette.secondary }}
                >
                  Professional
                </th>
                <th
                  className="text-center py-4 px-4 text-sm font-semibold w-1/5"
                  style={{ fontFamily: "'DM Serif Display', serif", color: palette.primary }}
                >
                  Business
                </th>
                <th
                  className="text-center py-4 px-4 text-sm font-semibold w-1/5"
                  style={{ fontFamily: "'DM Serif Display', serif", color: palette.primary }}
                >
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {featureRows.map((row) => (
                <tr
                  key={row.name}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3.5 pr-4 text-sm" style={{ fontFamily: "Inter, sans-serif", color: "#374151" }}>
                    {row.name}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <FeatureCell value={row.free} />
                  </td>
                  <td className="py-3.5 px-4 text-center" style={{ backgroundColor: `${palette.secondary}08` }}>
                    <FeatureCell value={row.starter} />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <FeatureCell value={row.growth} />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <FeatureCell value={row.enterprise} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile comparison cards */}
        <div className="lg:hidden space-y-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="rounded-xl p-5"
              style={{
                border: tier.highlighted ? `2px solid ${palette.accent}` : "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                boxShadow: tier.highlighted
                  ? "0 4px 15px rgba(139, 115, 85, 0.12)"
                  : "0 1px 3px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h3
                className="text-lg mb-4 flex items-center gap-2 font-semibold"
                style={{ fontFamily: "'DM Serif Display', serif", color: palette.primary }}
              >
                {tier.icon}
                {tier.name}
                {tier.badge && (
                  <span className="text-xs font-bold" style={{ color: palette.accent }}>
                    ({tier.badge})
                  </span>
                )}
              </h3>
              <ul className="space-y-2.5">
                {featureRows.map((row) => {
                  const val =
                    tier.id === "starter"
                      ? row.free
                      : tier.id === "professional"
                      ? row.starter
                      : tier.id === "business"
                      ? row.growth
                      : row.enterprise;

                  return (
                    <li key={row.name} className="flex items-center justify-between">
                      <span className="text-sm" style={{ fontFamily: "Inter, sans-serif", color: "#4B5563" }}>
                        {row.name}
                      </span>
                      <span className="flex-shrink-0 ml-3">
                        <FeatureCell value={val} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="section-container mb-24 animate-fade-in">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5" style={{ color: palette.accent }} />
            <span
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ fontFamily: "Inter, sans-serif", color: palette.accent }}
            >
              FAQ
            </span>
          </div>
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "'DM Serif Display', serif", color: palette.primary }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} faq={faq} />
          ))}
        </div>
      </section>

      {/* ---- CTA Banner ---- */}
      <section className="section-container animate-fade-in">
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-14 sm:px-12 sm:py-20 text-center"
          style={{ backgroundColor: palette.primary }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${palette.accent}1A` }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${palette.secondary}1A` }}
          />

          <div className="relative z-10">
            <MessageSquare className="w-10 h-10 mx-auto mb-4" style={{ color: palette.accent }} />
            <h2
              className="text-3xl sm:text-4xl mb-4 font-bold"
              style={{ fontFamily: "'DM Serif Display', serif", color: "#FFFFFF" }}
            >
              Still Have Questions?
            </h2>
            <p
              className="text-lg max-w-xl mx-auto mb-8"
              style={{ fontFamily: "Inter, sans-serif", color: "#D1D5DB" }}
            >
              Our team is here to help you find the right plan for your portfolio.
              Get in touch and we will respond within 24 hours.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                fontFamily: "Inter, sans-serif",
                backgroundColor: palette.accent,
                color: palette.primary,
              }}
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
