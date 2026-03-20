// FILE PATH: src/pages/HomePage.tsx
// RealEstate AI - Homepage / Landing Page

import {
  Shield,
  CreditCard,
  Hammer,
  Cpu,
  Clock,
  Users,
  TrendingDown,
  Building,
  CheckCircle,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Zap,
  BarChart,
  PieChart,
  Activity,
  FileText,
  MessageSquare,
  FolderOpen,
  Target,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { PageMeta } from "../components/seo";

/* ------------------------------------------------------------------ */
/*  Tagline options (available for A/B testing and marketing)           */
/* ------------------------------------------------------------------ */
export const TAGLINES = [
  "Property Management That Thinks Ahead",
  "AI-Powered Property Management for Modern Landlords",
  "Stop Managing Properties. Start Growing Your Portfolio.",
] as const;

/* ------------------------------------------------------------------ */
/*  1. HERO SECTION                                                    */
/* ------------------------------------------------------------------ */
const HeroSection: React.FC = () => (
  <section
    className="relative bg-realestate-primary overflow-hidden pt-20 pb-20 md:pt-32 md:pb-28"
    aria-label="Hero"
  >
    {/* Decorative gradient blobs */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-realestate-accent/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-realestate-secondary/15 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-realestate-accent/5 blur-3xl" />
    </div>

    <div className="section-container relative z-10">
      <div className="max-w-3xl mx-auto text-center animate-fade-in">
        <h1 className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-[72px] text-white leading-tight mb-6">
          Property Management{" "}
          <span className="text-realestate-accent">That Thinks Ahead</span>
        </h1>

        <p className="font-inter text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          AI-powered property management that automates rent collection, tenant
          screening, and maintenance — so you can grow your portfolio without
          growing your workload.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/auth/register"
            className="btn-accent text-base md:text-lg px-8 py-4 rounded-lg shadow-realestate-lg inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Start Free Trial - No Credit Card Required
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>

          <Link
            to="#how-it-works"
            className="border border-white/30 text-white font-inter font-medium px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-realestate-primary inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            See How It Works
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <div className="flex -space-x-2" aria-hidden="true">
            {[
              "from-realestate-accent to-yellow-600",
              "from-realestate-secondary to-emerald-700",
              "from-blue-500 to-indigo-600",
              "from-purple-500 to-pink-500",
              "from-orange-400 to-red-500",
            ].map((gradient, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} border-2 border-realestate-primary flex items-center justify-center`}
              >
                <span className="text-white text-xs font-bold">
                  {["JD", "SM", "AK", "RB", "TL"][i]}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-0.5 mb-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-realestate-accent fill-realestate-accent"
                  aria-hidden="true"
                />
              ))}
              <span className="text-white/70 text-sm ml-1">4.9/5</span>
            </div>
            <p className="text-gray-400 text-sm font-inter">
              Trusted by <strong className="text-white">2,500+</strong> Property
              Managers
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  2. SOCIAL PROOF BAR                                                */
/* ------------------------------------------------------------------ */
const SocialProofBar: React.FC = () => {
  const companies = [
    "UrbanCore Realty",
    "Skyline Properties",
    "HavenCrest PM",
    "MetroNest",
    "Apex Estates",
    "TrueHome Group",
  ];

  return (
    <section
      className="bg-[#F0F9FF] py-8 border-y border-gray-200"
      aria-label="Trusted by leading companies"
    >
      <div className="section-container">
        <p className="text-center text-sm font-inter text-gray-500 uppercase tracking-widest mb-6">
          Trusted by property managers at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {companies.map((company) => (
            <div
              key={company}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-realestate-sm border border-gray-100"
            >
              <Building className="w-5 h-5 text-gray-500" aria-hidden="true" />
              <span className="font-space-grotesk font-semibold text-sm text-realestate-primary whitespace-nowrap">
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  3. FEATURE GRID (9 features from competitor analysis)              */
/* ------------------------------------------------------------------ */
const featureGridItems = [
  {
    icon: Building,
    title: "Property Listings & Marketing",
    description:
      "Create professional listings, syndicate to major portals, and attract quality tenants faster.",
  },
  {
    icon: Shield,
    title: "Tenant Screening",
    description:
      "AI-powered background checks, credit analysis, and risk scoring in minutes.",
  },
  {
    icon: FileText,
    title: "Lease Management",
    description:
      "Digital lease creation, e-signatures, renewal tracking, and automated reminders.",
  },
  {
    icon: CreditCard,
    title: "Online Rent Collection",
    description:
      "Automated payments, late fee calculation, and real-time tracking across all units.",
  },
  {
    icon: Hammer,
    title: "Maintenance Requests",
    description:
      "Streamlined request submission, vendor assignment, and status tracking for tenants and managers.",
  },
  {
    icon: BarChart,
    title: "Accounting & Financial Reporting",
    description:
      "Income/expense tracking, automated reports, and tax-ready financial statements.",
  },
  {
    icon: MessageSquare,
    title: "Tenant Communication",
    description:
      "Centralized messaging, announcements, and automated notifications across channels.",
  },
  {
    icon: FolderOpen,
    title: "Document Management",
    description:
      "Secure cloud storage, folder organization, and role-based access control for all property docs.",
  },
  {
    icon: Target,
    title: "CRM",
    description:
      "Track leads, manage contacts, and log all communications to convert prospects into tenants.",
  },
];

const FeatureGrid: React.FC = () => (
  <section className="py-20 bg-white" aria-labelledby="features-heading">
    <div className="section-container">
      <div className="text-center mb-14">
        <p className="font-inter text-sm uppercase tracking-widest text-realestate-accent font-semibold mb-2">
          Core Features
        </p>
        <h2
          id="features-heading"
          className="text-display text-3xl md:text-4xl text-realestate-primary mb-4"
        >
          Everything You Need to Manage Smarter
        </h2>
        <p className="font-inter text-gray-500 max-w-2xl mx-auto">
          From screening to scheduling, our AI handles the heavy lifting so you
          can focus on growing your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureGridItems.map((feature) => (
          <article
            key={feature.title}
            className="card-elevated group relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 w-full h-1 bg-realestate-accent"
              aria-hidden="true"
            />
            <div className="w-14 h-14 bg-realestate-accent/10 rounded-xl flex items-center justify-center mb-5">
              <feature.icon
                className="w-7 h-7 text-realestate-accent"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-heading text-xl text-realestate-primary mb-3">
              {feature.title}
            </h3>
            <p className="font-inter text-gray-500 leading-relaxed">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  4. AI SHOWCASE SECTION                                             */
/* ------------------------------------------------------------------ */
const stats = [
  {
    value: "15+",
    label: "Hours Saved/Week",
    icon: Clock,
    color: "text-realestate-accent",
  },
  {
    value: "98%",
    label: "Tenant Satisfaction",
    icon: Users,
    color: "text-emerald-500",
  },
  {
    value: "40%",
    label: "Fewer Vacancies",
    icon: TrendingDown,
    color: "text-blue-500",
  },
];

const AIShowcase: React.FC = () => (
  <section className="py-20 bg-[#F0F9FF]" aria-labelledby="ai-showcase-heading">
    <div className="section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left - Text Content */}
        <div className="animate-fade-in">
          <p className="font-inter text-sm uppercase tracking-widest text-realestate-accent font-semibold mb-2">
            Why RealEstate AI
          </p>
          <h2
            id="ai-showcase-heading"
            className="text-display text-3xl md:text-4xl text-realestate-primary mb-6"
          >
            The AI Advantage
          </h2>
          <p className="font-inter text-gray-600 leading-relaxed mb-8">
            Our machine learning models analyse thousands of data points to
            optimise every aspect of property management. From predicting
            maintenance issues to identifying the best tenants, RealEstate AI
            gives you a competitive edge.
          </p>

          <ul className="space-y-4 mb-8">
            {[
              "Automated risk scoring for every applicant",
              "Real-time market rent analysis",
              "Predictive maintenance scheduling",
              "Intelligent document processing",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 text-realestate-accent mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="font-inter text-gray-700">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/auth/register"
            className="btn-primary inline-flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Right - Mock Dashboard */}
        <div className="animate-slide-up" aria-label="AI dashboard preview">
          <div className="bg-white rounded-2xl shadow-realestate-lg border border-gray-100 overflow-hidden">
            {/* Mock header bar */}
            <div className="bg-realestate-primary px-6 py-3 flex items-center gap-2">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-gray-400 text-xs font-mono ml-3">
                dashboard.realestate-ai.com
              </span>
            </div>

            <div className="p-6 space-y-5">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <stat.icon
                      className={`w-6 h-6 ${stat.color} mx-auto mb-2`}
                      aria-hidden="true"
                    />
                    <p className="text-display text-2xl text-realestate-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs font-inter text-gray-500 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mock chart area */}
              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-realestate-primary font-space-grotesk">
                    Revenue Trend
                  </span>
                  <Activity
                    className="w-4 h-4 text-realestate-accent"
                    aria-hidden="true"
                  />
                </div>
                {/* Bar chart mock */}
                <div className="flex items-end gap-2 h-32" aria-hidden="true">
                  {[40, 55, 45, 70, 60, 80, 75, 90, 85, 95, 88, 100].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-realestate-accent/80 to-realestate-accent/30 transition-all duration-300"
                        style={{ height: `${h}%` }}
                      />
                    ),
                  )}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-inter">
                  <span>Jan</span>
                  <span>Apr</span>
                  <span>Jul</span>
                  <span>Oct</span>
                </div>
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-realestate-primary/5 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-realestate-accent/10 flex items-center justify-center">
                    <PieChart
                      className="w-5 h-5 text-realestate-accent"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-inter">
                      Occupancy
                    </p>
                    <p className="text-lg font-bold text-realestate-primary font-space-grotesk">
                      96.4%
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bg-realestate-primary/5 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <BarChart
                      className="w-5 h-5 text-emerald-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-inter">
                      Collected
                    </p>
                    <p className="text-lg font-bold text-realestate-primary font-space-grotesk">
                      $284K
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  5. HOW IT WORKS                                                    */
/* ------------------------------------------------------------------ */
const steps = [
  {
    number: "01",
    title: "List Your Properties",
    description:
      "Add your properties in seconds. Import from a spreadsheet or enter details manually -- our system handles the rest.",
    icon: Building,
  },
  {
    number: "02",
    title: "AI Does the Heavy Lifting",
    description:
      "From tenant screening to maintenance predictions, our AI automates the time-consuming tasks that eat into your day.",
    icon: Cpu,
  },
  {
    number: "03",
    title: "Manage with Confidence",
    description:
      "Track performance, collect rent, and resolve issues from a single dashboard. Data-driven insights at your fingertips.",
    icon: Star,
  },
];

const HowItWorks: React.FC = () => (
  <section
    id="how-it-works"
    className="py-20 bg-white"
    aria-labelledby="how-heading"
  >
    <div className="section-container">
      <div className="text-center mb-14">
        <p className="font-inter text-sm uppercase tracking-widest text-realestate-accent font-semibold mb-2">
          Simple Process
        </p>
        <h2
          id="how-heading"
          className="text-display text-3xl md:text-4xl text-realestate-primary mb-4"
        >
          Up and Running in 3 Steps
        </h2>
        <p className="font-inter text-gray-500 max-w-xl mx-auto">
          No complicated setup. No steep learning curve. Get started in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting line (desktop) */}
        <div
          className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-realestate-accent via-realestate-secondary to-blue-500"
          aria-hidden="true"
        />

        {steps.map((step) => (
          <div key={step.number} className="text-center relative">
            <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl bg-realestate-primary flex items-center justify-center shadow-realestate-md">
              <step.icon
                className="w-9 h-9 text-realestate-accent"
                aria-hidden="true"
              />
            </div>
            <span className="font-space-grotesk text-sm font-bold text-realestate-accent tracking-wider">
              STEP {step.number}
            </span>
            <h3 className="text-heading text-xl text-realestate-primary mt-2 mb-3">
              {step.title}
            </h3>
            <p className="font-inter text-gray-500 leading-relaxed max-w-xs mx-auto">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  6. TESTIMONIAL CAROUSEL                                            */
/* ------------------------------------------------------------------ */
const testimonials = [
  {
    quote:
      "RealEstate AI cut my admin time in half. The tenant screening alone has saved me from three potentially bad leases this year.",
    name: "Sarah Mitchell",
    role: "Portfolio Manager, 42 Units",
    rating: 5,
    initials: "SM",
    gradient: "from-realestate-accent to-yellow-600",
  },
  {
    quote:
      "The predictive maintenance feature is a game-changer. We caught a plumbing issue before it became a $15K repair. Paid for itself in one month.",
    name: "David Chen",
    role: "Property Owner, 18 Units",
    rating: 5,
    initials: "DC",
    gradient: "from-realestate-secondary to-emerald-700",
  },
  {
    quote:
      "I manage 120 doors solo thanks to this platform. The automated rent collection and AI insights make it feel like I have a full team behind me.",
    name: "Maria Rodriguez",
    role: "Independent Landlord, 120 Units",
    rating: 5,
    initials: "MR",
    gradient: "from-blue-500 to-indigo-600",
  },
];

const TestimonialCarousel: React.FC = () => {
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () =>
    setActive((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section
      className="py-20 bg-[#F0F9FF]"
      aria-labelledby="testimonials-heading"
    >
      <div className="section-container">
        <div className="text-center mb-14">
          <p className="font-inter text-sm uppercase tracking-widest text-realestate-accent font-semibold mb-2">
            Testimonials
          </p>
          <h2
            id="testimonials-heading"
            className="text-display text-3xl md:text-4xl text-realestate-primary mb-4"
          >
            Loved by Property Managers
          </h2>
        </div>

        {/* Desktop: show all 3 */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <TestimonialCard testimonial={testimonials[active]} />
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex gap-2" aria-hidden="true">
              {testimonials.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === active ? "bg-realestate-accent" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: (typeof testimonials)[number];
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial: t,
}) => (
  <blockquote className="card-elevated flex flex-col h-full">
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: t.rating }).map((_, i) => (
        <Star
          key={i}
          className="w-5 h-5 text-realestate-accent fill-realestate-accent"
          aria-hidden="true"
        />
      ))}
    </div>
    <p className="font-inter text-gray-600 leading-relaxed italic flex-1 mb-6">
      &ldquo;{t.quote}&rdquo;
    </p>
    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
      <div
        className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center`}
        aria-hidden="true"
      >
        <span className="text-white text-sm font-bold">{t.initials}</span>
      </div>
      <div>
        <cite className="not-italic font-semibold text-realestate-primary font-space-grotesk text-sm">
          {t.name}
        </cite>
        <p className="text-xs text-gray-500 font-inter">{t.role}</p>
      </div>
    </div>
  </blockquote>
);

/* ------------------------------------------------------------------ */
/*  7. PRICING TABLE (4 tiers per spec)                                */
/* ------------------------------------------------------------------ */
const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    description: "Get started with the basics",
    features: [
      "Up to 5 units",
      "Basic tenant management",
      "Rent tracking",
      "Maintenance requests",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$125",
    period: "/mo + $2/unit",
    description: "For growing portfolios",
    features: [
      "Up to 100 units",
      "AI-powered analytics",
      "Automated rent collection",
      "Financial reporting",
      "Tenant screening",
      "Document management",
    ],
    highlighted: true,
  },
  {
    name: "Professional",
    price: "$400",
    period: "/mo + $1.50/unit",
    description: "For property management firms",
    features: [
      "Up to 300 units",
      "Advanced AI insights",
      "Owner portal",
      "API access",
      "Custom workflows",
      "Priority support",
      "Market reports",
    ],
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "$1,264+",
    period: "/mo custom",
    description: "For large-scale operators",
    features: [
      "Unlimited units",
      "White-label options",
      "Dedicated CSM",
      "Custom integrations",
      "SLA guarantees",
      "Advanced security",
      "Data-driven market reports",
    ],
    highlighted: false,
  },
];

const PricingTable: React.FC = () => (
  <section className="py-20 bg-white" aria-labelledby="pricing-heading">
    <div className="section-container">
      <div className="text-center mb-14">
        <p className="font-inter text-sm uppercase tracking-widest text-realestate-accent font-semibold mb-2">
          Pricing
        </p>
        <h2
          id="pricing-heading"
          className="text-display text-3xl md:text-4xl text-realestate-primary mb-4"
        >
          Plans That Scale With You
        </h2>
        <p className="font-inter text-gray-500 max-w-xl mx-auto">
          Start with a free 14-day trial. No credit card required.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-xl p-6 border transition-shadow duration-200 ${
              tier.highlighted
                ? "border-realestate-accent shadow-realestate-lg bg-white ring-2 ring-realestate-accent/20"
                : "border-gray-200 shadow-realestate-sm bg-white hover:shadow-realestate-md"
            }`}
          >
            {tier.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-realestate-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <h3 className="text-heading text-lg text-realestate-primary mb-1">
              {tier.name}
            </h3>
            <p className="text-xs text-gray-500 font-inter mb-4">
              {tier.description}
            </p>

            <div className="mb-5">
              <span className="text-display text-3xl text-realestate-primary">
                {tier.price}
              </span>
              {tier.period && (
                <span className="text-gray-500 text-sm font-inter">
                  {tier.period}
                </span>
              )}
            </div>

            <ul className="space-y-2 mb-6">
              {tier.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm font-inter text-gray-600"
                >
                  <Zap
                    className="w-4 h-4 text-realestate-accent mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to={tier.name === "Enterprise" ? "/contact" : "/auth/register"}
              className={`block text-center text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 ${
                tier.highlighted ? "btn-accent" : "btn-outline"
              }`}
            >
              {tier.name === "Enterprise"
                ? "Contact Sales"
                : "Start Free Trial"}
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-8 space-y-2">
        <p className="font-inter text-sm text-realestate-accent font-semibold">
          Save 20% with annual billing (2 months free)
        </p>
        <Link
          to="/pricing"
          className="font-inter text-sm text-gray-500 hover:text-realestate-primary transition-colors inline-flex items-center gap-1"
        >
          View full pricing details
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  8. FAQ SECTION                                                     */
/* ------------------------------------------------------------------ */
const faqs = [
  {
    question: "How does RealEstate AI save me time on manual tasks?",
    answer:
      "Our AI automates rent collection, lease renewals, maintenance routing, and tenant communication. Property managers report saving 15+ hours per week by eliminating repetitive data entry and follow-ups.",
  },
  {
    question: "Can I manage all my properties from one place?",
    answer:
      "Yes. RealEstate AI centralizes all property data, tenant records, financial reports, and communications in a single dashboard. No more switching between spreadsheets, emails, and separate tools.",
  },
  {
    question: "Will RealEstate AI work as I grow my portfolio?",
    answer:
      "Absolutely. Our platform scales from 5 to 5,000+ units. As you grow, features like automated workflows, owner portals, and API integrations ensure your operations stay efficient without adding headcount.",
  },
  {
    question: "How does tenant communication work?",
    answer:
      "Tenants can submit requests and receive updates via the tenant portal, email, or SMS. Automated notifications keep everyone informed about maintenance status, rent reminders, and lease updates without manual follow-up.",
  },
  {
    question: "Are financial reports accurate and audit-ready?",
    answer:
      "Yes. Our accounting module tracks every transaction in real time and generates income statements, balance sheets, and tax-ready reports. Automated categorization reduces errors compared to manual bookkeeping.",
  },
];

const FAQItem: React.FC<{ faq: (typeof faqs)[number] }> = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-space-grotesk font-semibold text-realestate-primary pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-realestate-accent shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-6 pb-5 animate-fade-in">
          <p className="font-inter text-gray-600 leading-relaxed">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
};

const FAQSection: React.FC = () => (
  <section className="py-20 bg-[#F0F9FF]" aria-labelledby="faq-heading">
    <div className="section-container">
      <div className="text-center mb-14">
        <p className="font-inter text-sm uppercase tracking-widest text-realestate-accent font-semibold mb-2">
          FAQ
        </p>
        <h2
          id="faq-heading"
          className="text-display text-3xl md:text-4xl text-realestate-primary mb-4"
        >
          Frequently Asked Questions
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq) => (
          <FAQItem key={faq.question} faq={faq} />
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  9. CTA BANNER                                                      */
/* ------------------------------------------------------------------ */
const CTABanner: React.FC = () => (
  <section
    className="relative bg-realestate-primary py-20 overflow-hidden"
    aria-label="Call to action"
  >
    {/* Decorative elements */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-realestate-accent/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-realestate-secondary/15 blur-3xl" />
    </div>

    <div className="section-container relative z-10 text-center">
      <h2 className="text-display text-3xl md:text-4xl text-white mb-4">
        Ready to Transform Your Property Management?
      </h2>
      <p className="font-inter text-gray-300 max-w-xl mx-auto mb-8 text-lg">
        Join 2,500+ property managers who are saving time, reducing vacancies,
        and growing their portfolios with AI.
      </p>
      <Link
        to="/auth/register"
        className="btn-accent text-base md:text-lg px-10 py-4 rounded-lg shadow-realestate-lg inline-flex items-center gap-2"
      >
        Start Free Trial - No Credit Card Required
        <ArrowRight className="w-5 h-5" aria-hidden="true" />
      </Link>
      <p className="text-gray-400 text-sm mt-4 font-inter">
        14-day free trial. Setup takes less than 2 minutes.
      </p>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                     */
/* ------------------------------------------------------------------ */
const HomePage: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Property Management That Thinks Ahead | RealEstate AI"
        description="RealEstate AI is an AI-powered property management platform that automates tenant screening, rent collection, maintenance predictions, and more. Start your free 14-day trial today."
        keywords="property management software, real estate management software, rental property management software, tenant management software, landlord software, property management platform, AI property management, best property management software for small landlords, property management software pricing"
        canonicalUrl="https://realestate-ai.com/"
      />
      <HeroSection />
      <SocialProofBar />
      <FeatureGrid />
      <AIShowcase />
      <HowItWorks />
      <TestimonialCarousel />
      <PricingTable />
      <FAQSection />
      <CTABanner />
    </>
  );
};

export { HomePage };
export default HomePage;
