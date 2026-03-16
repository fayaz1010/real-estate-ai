import React, { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

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
    monthlyPrice: "$49",
    monthlyUnit: "/mo",
    monthlyMin: "Up to 25 units",
    annualPrice: "$39",
    annualUnit: "/mo",
    annualMin: "Up to 25 units, billed annually",
    features: [
      "Up to 25 units",
      "Basic property management",
      "Tenant portal",
      "Rent collection",
      "Limited AI insights",
      "14-day free trial",
      "20% annual discount (2 months free)",
    ],
    cta: "Start Free 14-Day Trial",
    ctaLink: "/auth/register",
    highlighted: false,
  },
  {
    id: "professional",
    name: "Professional",
    icon: <Zap className="w-6 h-6" />,
    description: "For growing portfolios that need powerful AI tools.",
    monthlyPrice: "$149",
    monthlyUnit: "/mo",
    monthlyMin: "Up to 100 units",
    annualPrice: "$119",
    annualUnit: "/mo",
    annualMin: "Up to 100 units, billed annually",
    features: [
      "Up to 100 units",
      "Full AI assistant",
      "Automated tenant screening",
      "Predictive maintenance alerts",
      "Financial reporting",
      "API access",
      "14-day free trial",
      "20% annual discount (2 months free)",
    ],
    cta: "Start Free 14-Day Trial",
    ctaLink: "/auth/register",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "business",
    name: "Business",
    icon: <Award className="w-6 h-6" />,
    description: "For property management firms scaling operations.",
    monthlyPrice: "$399",
    monthlyUnit: "/mo",
    monthlyMin: "Up to 500 units",
    annualPrice: "$319",
    annualUnit: "/mo",
    annualMin: "Up to 500 units, billed annually",
    features: [
      "Up to 500 units",
      "Advanced AI analytics",
      "Portfolio optimization",
      "Custom workflows",
      "Priority support",
      "White-label options",
      "14-day free trial",
      "20% annual discount (2 months free)",
    ],
    cta: "Start Free 14-Day Trial",
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
    monthlyMin: "$800–$2,000+/mo · Unlimited units",
    annualPrice: "Custom",
    annualUnit: "",
    annualMin: "$800–$2,000+/mo · Unlimited units",
    features: [
      "Unlimited units",
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
  { name: "Units included", free: "Up to 25", starter: "Up to 100", growth: "Up to 500", enterprise: "Unlimited" },
  { name: "AI insights", free: "Basic", starter: "Advanced", growth: "Full suite", enterprise: "Custom AI" },
  { name: "Tenant screening", free: true, starter: true, growth: true, enterprise: true },
  { name: "Online rent collection", free: true, starter: true, growth: true, enterprise: true },
  { name: "Maintenance tracking", free: "Basic", starter: "Predictive", growth: "Predictive", enterprise: "Predictive" },
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
    question: "How does the per-unit pricing work?",
    answer:
      "You are charged based on the number of active units (apartments, houses, commercial spaces) in your portfolio. Each plan has a minimum monthly fee. If your unit count multiplied by the per-unit rate exceeds the minimum, you pay the per-unit total instead. For example, on the Starter plan with 100 units you would pay $100/mo (100 x $1) rather than the $79 minimum.",
  },
  {
    question: "What happens after my free trial ends?",
    answer:
      "After your 14-day free trial you will be prompted to choose a paid plan. Your data is preserved for 30 days so you have time to decide. If you do not subscribe within 30 days, your account data will be securely deleted.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes. Annual billing saves you approximately 20% compared to monthly billing. The annual price is billed as a single payment at the start of each year. You can switch between monthly and annual billing from your account settings.",
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
        className={`font-inter text-sm font-medium transition-colors duration-200 ${
          !isAnnual ? "text-realestate-primary" : "text-gray-400"
        }`}
      >
        Monthly
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isAnnual}
        aria-label="Toggle annual billing"
        onClick={onToggle}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-realestate-accent focus:ring-offset-2 ${
          isAnnual ? "bg-realestate-accent" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-realestate-sm transition-transform duration-300 ${
            isAnnual ? "translate-x-8" : "translate-x-1"
          }`}
        />
      </button>

      <span
        className={`font-inter text-sm font-medium transition-colors duration-200 ${
          isAnnual ? "text-realestate-primary" : "text-gray-400"
        }`}
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
}: {
  tier: PricingTier;
  isAnnual: boolean;
}) {
  const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
  const unit = isAnnual ? tier.annualUnit : tier.monthlyUnit;
  const min = isAnnual ? tier.annualMin : tier.monthlyMin;

  return (
    <div
      className={`relative flex flex-col rounded-xl p-6 sm:p-8 transition-all duration-300 ${
        tier.highlighted
          ? "border-2 border-realestate-accent bg-white shadow-realestate-lg scale-[1.02] z-10"
          : "border border-gray-200 bg-white shadow-realestate-sm hover:shadow-realestate-md"
      }`}
    >
      {/* Badge */}
      {tier.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-realestate-accent px-4 py-1 text-xs font-bold text-realestate-primary shadow-realestate-sm">
            <Star className="w-3 h-3" />
            {tier.badge}
          </span>
        </div>
      )}

      {/* Icon & Name */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-lg ${
            tier.highlighted
              ? "bg-realestate-accent/10 text-realestate-accent"
              : "bg-realestate-primary/5 text-realestate-primary"
          }`}
        >
          {tier.icon}
        </div>
        <h3 className="text-heading text-xl">{tier.name}</h3>
      </div>

      {/* Description */}
      <p className="font-inter text-sm text-gray-500 mb-6">{tier.description}</p>

      {/* Price */}
      <div className="mb-1">
        <span className="text-display text-4xl">{price}</span>
        <span className="font-inter text-sm text-gray-500 ml-1">{unit}</span>
      </div>
      {min && (
        <p className="font-inter text-xs text-gray-400 mb-6">{min}</p>
      )}
      {!min && <div className="mb-6" />}

      {/* CTA */}
      <Link
        to={tier.ctaLink}
        className={`flex items-center justify-center gap-2 w-full rounded-lg px-6 py-3 text-sm font-semibold font-inter transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 mb-8 ${
          tier.highlighted
            ? "bg-realestate-accent text-realestate-primary hover:bg-realestate-accent/90 focus:ring-realestate-accent"
            : tier.id === "enterprise"
            ? "border border-realestate-primary text-realestate-primary hover:bg-realestate-primary hover:text-white focus:ring-realestate-primary"
            : "bg-realestate-primary text-white hover:bg-realestate-primary/90 focus:ring-realestate-accent"
        }`}
      >
        {tier.cta}
        <ArrowRight className="w-4 h-4" />
      </Link>

      {/* Features */}
      <ul className="space-y-3 flex-1" role="list">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                tier.highlighted ? "text-realestate-accent" : "text-green-500"
              }`}
              aria-hidden="true"
            />
            <span className="font-inter text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return (
      <span className="font-inter text-sm text-gray-700 font-medium">
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
        className="flex w-full items-center justify-between py-5 text-left focus:outline-none focus:ring-2 focus:ring-realestate-accent focus:ring-offset-2 rounded-lg px-2 -mx-2"
      >
        <span className="text-heading text-base text-realestate-primary pr-4">
          {faq.question}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-realestate-secondary flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-realestate-secondary flex-shrink-0" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="font-inter text-sm text-gray-600 leading-relaxed px-2">
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

  return (
    <div className="pt-24 pb-20 bg-white">
      {/* ---- Header ---- */}
      <section className="section-container text-center mb-12 animate-fade-in">
        <h1 className="text-display text-4xl sm:text-5xl text-realestate-primary mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="font-inter text-lg text-realestate-secondary max-w-2xl mx-auto">
          Start free, scale as you grow. No hidden fees, cancel anytime.
        </p>
      </section>

      {/* ---- Billing Toggle ---- */}
      <section className="section-container mb-14">
        <BillingToggle isAnnual={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} />
      </section>

      {/* ---- Pricing Cards ---- */}
      <section className="section-container mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-4 items-start">
          {tiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} isAnnual={isAnnual} />
          ))}
        </div>
      </section>

      {/* ---- Feature Comparison Table ---- */}
      <section className="section-container mb-24 animate-fade-in">
        <h2 className="text-display text-3xl text-center text-realestate-primary mb-10">
          Compare Plans
        </h2>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse" role="table">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 pr-4 text-heading text-sm text-realestate-primary w-1/5">
                  Feature
                </th>
                <th className="text-center py-4 px-4 text-heading text-sm text-realestate-primary w-1/5">
                  Starter
                </th>
                <th className="text-center py-4 px-4 text-heading text-sm text-realestate-secondary w-1/5">
                  Professional
                </th>
                <th className="text-center py-4 px-4 text-heading text-sm text-realestate-primary w-1/5">
                  Business
                </th>
                <th className="text-center py-4 px-4 text-heading text-sm text-realestate-primary w-1/5">
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
                  <td className="py-3.5 pr-4 font-inter text-sm text-gray-700">
                    {row.name}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <FeatureCell value={row.free} />
                  </td>
                  <td className="py-3.5 px-4 text-center bg-realestate-secondary/[0.03]">
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
              className={`rounded-xl p-5 ${
                tier.highlighted
                  ? "border-2 border-realestate-accent bg-white shadow-realestate-md"
                  : "border border-gray-200 bg-white shadow-realestate-sm"
              }`}
            >
              <h3 className="text-heading text-lg text-realestate-primary mb-4 flex items-center gap-2">
                {tier.icon}
                {tier.name}
                {tier.badge && (
                  <span className="text-xs font-bold text-realestate-accent">
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
                      <span className="font-inter text-sm text-gray-600">
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
            <HelpCircle className="w-5 h-5 text-realestate-accent" />
            <span className="font-inter text-sm font-semibold text-realestate-accent uppercase tracking-wide">
              FAQ
            </span>
          </div>
          <h2 className="text-display text-3xl text-realestate-primary">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-realestate-sm p-6 sm:p-8">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} faq={faq} />
          ))}
        </div>
      </section>

      {/* ---- CTA Banner ---- */}
      <section className="section-container animate-fade-in">
        <div className="relative overflow-hidden rounded-2xl bg-realestate-primary px-6 py-14 sm:px-12 sm:py-20 text-center">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-realestate-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-realestate-secondary/10 blur-3xl" />

          <div className="relative z-10">
            <MessageSquare className="w-10 h-10 text-realestate-accent mx-auto mb-4" />
            <h2 className="text-display text-3xl sm:text-4xl text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="font-inter text-lg text-gray-300 max-w-xl mx-auto mb-8">
              Our team is here to help you find the right plan for your portfolio.
              Get in touch and we will respond within 24 hours.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-realestate-accent text-realestate-primary font-inter font-semibold px-8 py-3.5 rounded-lg hover:bg-realestate-accent/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-realestate-accent focus:ring-offset-2 focus:ring-offset-realestate-primary"
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
