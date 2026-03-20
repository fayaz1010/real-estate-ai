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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  PLANS,
  formatPrice,
  getMonthlyEquivalent,
} from "@/services/billingService";
import type { Plan, BillingInterval } from "@/types/billing";

/* ------------------------------------------------------------------ */
/*  FAQ Data                                                           */
/* ------------------------------------------------------------------ */

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes. You can upgrade or downgrade your plan at any time from your billing dashboard. When you upgrade, the new features become available immediately and billing is prorated. When you downgrade, the change takes effect at the start of your next billing cycle.",
  },
  {
    question: "What happens after my free trial ends?",
    answer:
      "After your 14-day free trial you will be prompted to choose a paid plan. Your data is preserved for 30 days so you have time to decide. If you do not subscribe within 30 days, your account data will be securely deleted.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes. Annual billing saves you approximately 20% compared to monthly billing. The annual price is billed as a single payment at the start of each year.",
  },
  {
    question: "Can I migrate my data from another platform?",
    answer:
      "Absolutely. We offer free assisted migration for all paid plans. Our team will help you import your properties, tenants, leases, and historical data from platforms like AppFolio, Buildium, Rent Manager, and others. Enterprise customers receive a dedicated migration specialist.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Security is our top priority. All data is encrypted at rest and in transit using AES-256 encryption. We are SOC 2 Type II compliant and undergo regular third-party security audits.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), ACH bank transfers, and wire transfers. Enterprise customers can also pay by invoice with net-30 terms.",
  },
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes. There are no long-term contracts or cancellation fees. You can cancel your subscription at any time from your billing dashboard. Your access continues until the end of your current billing period.",
  },
  {
    question: "How does AI property management work?",
    answer:
      "Our AI actively manages your properties — predicting maintenance issues before they escalate, optimizing rent prices based on market data, screening tenants with advanced risk scoring, and reducing vacancy through intelligent marketing. Available on Professional plans and above.",
  },
];

/* ------------------------------------------------------------------ */
/*  Feature Comparison                                                 */
/* ------------------------------------------------------------------ */

interface FeatureRow {
  name: string;
  starter: boolean | string;
  growth: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

const featureRows: FeatureRow[] = [
  {
    name: "Units included",
    starter: "Up to 5",
    growth: "Up to 100",
    professional: "Up to 300",
    enterprise: "Unlimited",
  },
  {
    name: "AI-powered analytics",
    starter: false,
    growth: true,
    professional: "Advanced",
    enterprise: "Custom AI",
  },
  {
    name: "Tenant screening",
    starter: false,
    growth: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Rent collection",
    starter: "Tracking only",
    growth: "Automated",
    professional: "Automated",
    enterprise: "Automated",
  },
  {
    name: "Maintenance requests",
    starter: true,
    growth: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Financial reporting",
    starter: false,
    growth: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Document management",
    starter: false,
    growth: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Owner portal",
    starter: false,
    growth: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "API access",
    starter: false,
    growth: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Custom workflows",
    starter: false,
    growth: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Market reports",
    starter: false,
    growth: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "White-label options",
    starter: false,
    growth: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "Dedicated CSM",
    starter: false,
    growth: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "SLA guarantees",
    starter: false,
    growth: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "Support",
    starter: "Email",
    growth: "Email + Chat",
    professional: "Priority",
    enterprise: "24/7 Dedicated",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const PLAN_ICONS: Record<string, React.ReactNode> = {
  starter: <Building className="w-6 h-6" />,
  growth: <Zap className="w-6 h-6" />,
  professional: <Award className="w-6 h-6" />,
  enterprise: <Star className="w-6 h-6" />,
};

function BillingToggle({
  interval,
  onToggle,
}: {
  interval: BillingInterval;
  onToggle: () => void;
}) {
  const isAnnual = interval === "yearly";
  return (
    <div className="flex items-center justify-center gap-4 animate-fade-in">
      <span
        className={`font-body text-sm font-medium transition-colors duration-200 ${!isAnnual ? "text-realestate-primary" : "text-gray-400"}`}
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
        className={`font-body text-sm font-medium transition-colors duration-200 ${isAnnual ? "text-realestate-primary" : "text-gray-400"}`}
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
  plan,
  interval,
  onSelect,
}: {
  plan: Plan;
  interval: BillingInterval;
  onSelect: (id: string) => void;
}) {
  const monthlyEquiv = getMonthlyEquivalent(plan, interval);
  const isEnterprise = plan.id === "enterprise";
  const displayPrice = isEnterprise ? "Custom" : formatPrice(monthlyEquiv);

  return (
    <div
      className={`relative flex flex-col rounded-xl p-6 sm:p-8 transition-all duration-300 ${
        plan.highlighted
          ? "border-2 border-realestate-accent bg-white shadow-realestate-lg scale-[1.02] z-10"
          : "border border-gray-200 bg-white shadow-realestate-sm hover:shadow-realestate-md"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-realestate-accent px-4 py-1 text-xs font-bold text-realestate-primary shadow-realestate-sm">
            <Star className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-2">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-lg ${
            plan.highlighted
              ? "bg-realestate-accent/10 text-realestate-accent"
              : "bg-realestate-primary/5 text-realestate-primary"
          }`}
        >
          {PLAN_ICONS[plan.id]}
        </div>
        <h3 className="text-heading text-xl">{plan.name}</h3>
      </div>

      <p className="font-body text-sm text-gray-500 mb-6">
        {plan.id === "starter" &&
          "Get started free — perfect for small landlords with a few units."}
        {plan.id === "growth" &&
          "For growing portfolios that need AI-powered analytics and automation."}
        {plan.id === "professional" &&
          "Advanced tools for scaling property management companies."}
        {plan.id === "enterprise" &&
          "Tailored solutions for large-scale property operations."}
      </p>

      <div className="mb-1">
        <span className="text-display text-4xl">{displayPrice}</span>
        {!isEnterprise && (
          <span className="font-body text-sm text-gray-500 ml-1">/mo</span>
        )}
      </div>
      <p className="font-body text-xs text-gray-400 mb-6">
        {isEnterprise
          ? "Unlimited units"
          : interval === "yearly"
            ? `${formatPrice(plan.yearlyPrice)}/yr billed annually`
            : `Up to ${plan.limits.maxUnits} units`}
      </p>

      <button
        onClick={() => onSelect(plan.id)}
        className={`flex items-center justify-center gap-2 w-full rounded-lg px-6 py-3 text-sm font-semibold font-body transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 mb-8 ${
          plan.highlighted
            ? "bg-realestate-accent text-realestate-primary hover:bg-realestate-accent/90 focus:ring-realestate-accent"
            : isEnterprise
              ? "border border-realestate-primary text-realestate-primary hover:bg-realestate-primary hover:text-white focus:ring-realestate-primary"
              : "bg-realestate-primary text-white hover:bg-realestate-primary/90 focus:ring-realestate-accent"
        }`}
      >
        {isEnterprise ? "Contact Sales" : "Start Free 14-Day Trial"}
        <ArrowRight className="w-4 h-4" />
      </button>

      <ul className="space-y-3 flex-1" role="list">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? "text-realestate-accent" : "text-green-500"}`}
              aria-hidden="true"
            />
            <span className="font-body text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return (
      <span className="font-body text-sm text-gray-700 font-medium">
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
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-5" : "max-h-0"}`}
      >
        <p className="font-body text-sm text-gray-600 leading-relaxed px-2">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function BillingPricingPage() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    if (planId === "enterprise") {
      navigate("/contact");
      return;
    }
    navigate(`/billing/checkout?plan=${planId}&interval=${interval}`);
  };

  return (
    <div className="pt-24 pb-20 bg-white">
      {/* SEO-optimized header */}
      <section className="section-container text-center mb-12 animate-fade-in">
        <p className="font-body text-sm font-semibold text-realestate-accent uppercase tracking-wide mb-3">
          Property Management Software Pricing
        </p>
        <h1 className="text-display text-4xl sm:text-5xl text-realestate-primary mb-4">
          Property Management, Powered by AI
        </h1>
        <p className="font-body text-lg text-realestate-secondary max-w-2xl mx-auto">
          AI that actively manages your properties — predicting maintenance
          issues, optimizing rent prices, screening tenants, and reducing
          vacancy — so you manage more units with less effort.
        </p>
      </section>

      {/* Billing Toggle */}
      <section className="section-container mb-14">
        <BillingToggle
          interval={interval}
          onToggle={() =>
            setInterval(interval === "monthly" ? "yearly" : "monthly")
          }
        />
      </section>

      {/* Pricing Cards */}
      <section className="section-container mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-4 items-start">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              interval={interval}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
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
                <th className="text-center py-4 px-4 text-heading text-sm text-realestate-accent w-1/5">
                  Growth
                </th>
                <th className="text-center py-4 px-4 text-heading text-sm text-realestate-primary w-1/5">
                  Professional
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
                  <td className="py-3.5 pr-4 font-body text-sm text-gray-700">
                    {row.name}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <FeatureCell value={row.starter} />
                  </td>
                  <td className="py-3.5 px-4 text-center bg-realestate-accent/[0.03]">
                    <FeatureCell value={row.growth} />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <FeatureCell value={row.professional} />
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
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl p-5 ${
                plan.highlighted
                  ? "border-2 border-realestate-accent bg-white shadow-realestate-md"
                  : "border border-gray-200 bg-white shadow-realestate-sm"
              }`}
            >
              <h3 className="text-heading text-lg text-realestate-primary mb-4 flex items-center gap-2">
                {PLAN_ICONS[plan.id]}
                {plan.name}
                {plan.highlighted && (
                  <span className="text-xs font-bold text-realestate-accent">
                    (Most Popular)
                  </span>
                )}
              </h3>
              <ul className="space-y-2.5">
                {featureRows.map((row) => {
                  const val = row[plan.id as keyof FeatureRow];
                  return (
                    <li
                      key={row.name}
                      className="flex items-center justify-between"
                    >
                      <span className="font-body text-sm text-gray-600">
                        {row.name}
                      </span>
                      <span className="flex-shrink-0 ml-3">
                        <FeatureCell value={val as boolean | string} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-container mb-24 animate-fade-in">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-realestate-accent" />
            <span className="font-body text-sm font-semibold text-realestate-accent uppercase tracking-wide">
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

      {/* CTA Banner */}
      <section className="section-container animate-fade-in">
        <div className="relative overflow-hidden rounded-2xl bg-realestate-primary px-6 py-14 sm:px-12 sm:py-20 text-center">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-realestate-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-realestate-secondary/10 blur-3xl" />
          <div className="relative z-10">
            <MessageSquare className="w-10 h-10 text-realestate-accent mx-auto mb-4" />
            <h2 className="text-display text-3xl sm:text-4xl text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="font-body text-lg text-gray-300 max-w-xl mx-auto mb-8">
              Our team is here to help you find the right AI property management
              software plan for your portfolio.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-realestate-accent text-realestate-primary font-body font-semibold px-8 py-3.5 rounded-lg hover:bg-realestate-accent/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-realestate-accent focus:ring-offset-2 focus:ring-offset-realestate-primary"
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
