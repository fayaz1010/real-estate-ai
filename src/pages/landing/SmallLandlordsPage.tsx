import {
  DollarSign,
  Clock,
  BarChart,
  Shield,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const painPoints = [
  {
    icon: Clock,
    title: "Drowning in Spreadsheets",
    description:
      "Tracking rent payments, maintenance requests, and lease renewals across scattered spreadsheets wastes hours every week and leads to costly mistakes.",
  },
  {
    icon: DollarSign,
    title: "Enterprise Software Is Too Expensive",
    description:
      "Most property management platforms are priced for large portfolios. When you manage 1 to 50 units, paying hundreds per month simply does not make sense.",
  },
  {
    icon: Users,
    title: "Tenant Communication Is Chaotic",
    description:
      "Juggling texts, emails, and phone calls from tenants means important requests slip through the cracks and response times suffer.",
  },
];

const features = [
  {
    icon: CreditCard,
    title: "Affordable Flat-Rate Pricing",
    description:
      "One predictable monthly fee regardless of how many units you manage. No per-unit charges, no hidden fees, and no long-term contracts.",
  },
  {
    icon: Zap,
    title: "AI-Powered Automation",
    description:
      "Automate rent reminders, lease renewals, maintenance routing, and tenant screening so you spend minutes instead of hours on routine tasks.",
  },
  {
    icon: BarChart,
    title: "Real-Time Financial Dashboard",
    description:
      "See income, expenses, and net operating income across all your properties at a glance. Export reports instantly for tax season.",
  },
  {
    icon: Shield,
    title: "Built-In Tenant Screening",
    description:
      "Run credit checks, criminal background reports, and eviction history searches directly from the platform with results in minutes.",
  },
  {
    icon: Building,
    title: "Online Rent Collection",
    description:
      "Accept ACH, credit card, and debit card payments online. Tenants pay on time with automated reminders and auto-pay options.",
  },
  {
    icon: TrendingUp,
    title: "Smart Rent Pricing",
    description:
      "AI analyzes comparable properties in your market to recommend optimal rent prices that maximize occupancy and revenue.",
  },
];

const stats = [
  { value: "15+", label: "Hours Saved Per Week" },
  { value: "98%", label: "On-Time Rent Collection" },
  { value: "$0", label: "Setup Fee" },
  { value: "4.9/5", label: "Customer Rating" },
];

const testimonials = [
  {
    quote:
      "I manage 12 rental units on my own. Before RealEstate AI, I was spending every Sunday doing paperwork. Now everything runs on autopilot and I actually enjoy being a landlord again.",
    name: "Marcus Johnson",
    role: "Independent Landlord, 12 Units",
    rating: 5,
  },
  {
    quote:
      "The pricing is what got me in the door, but the AI features are what kept me. Automated maintenance routing alone saves me five hours a week.",
    name: "Lisa Tran",
    role: "Small Portfolio Owner, 8 Units",
    rating: 5,
  },
  {
    quote:
      "I switched from a competitor charging me per unit. RealEstate AI costs a fraction of the price and does more. The tenant screening integration is seamless.",
    name: "Robert Alvarez",
    role: "Part-Time Landlord, 4 Units",
    rating: 5,
  },
];

export const SmallLandlordsPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white" role="main">
      {/* Hero Section */}
      <section
        className="relative pt-24 pb-20 bg-realestate-primary overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-realestate-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-realestate-secondary rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-realestate-accent/20 text-realestate-accent font-semibold text-sm rounded-full mb-6 font-inter">
            #1 Rated for Small Landlords in 2026
          </span>
          <h1
            id="hero-heading"
            className="text-display text-white font-space-grotesk mb-6"
          >
            Best Property Management Software
            <br className="hidden md:block" />
            <span className="text-realestate-accent">
              {" "}
              for Small Landlords
            </span>{" "}
            in 2026
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-inter max-w-3xl mx-auto leading-relaxed mb-10">
            Manage your rental properties like a pro without the enterprise
            price tag. RealEstate AI gives independent landlords powerful
            automation, AI-driven insights, and effortless rent collection —
            starting free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/register"
              className="btn-accent inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              to="/pricing"
              className="btn-outline border-white text-white hover:bg-white hover:text-realestate-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="pain-points-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              The Problem
            </span>
            <h2
              id="pain-points-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Managing Rentals Shouldn&apos;t Feel Like a Second Job
            </h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              Most property management software is designed for large firms with
              hundreds of units. Small landlords are left with tools that are
              either too expensive, too complex, or too limited.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {painPoints.map((point) => {
              const IconComponent = point.icon;
              return (
                <article key={point.title} className="card-elevated p-8">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent
                      className="w-6 h-6 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-realestate-primary font-space-grotesk mb-3">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 font-inter leading-relaxed">
                    {point.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white" aria-labelledby="solution-heading">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              The Solution
            </span>
            <h2
              id="solution-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Property Management Software Built for Landlords Like You
            </h2>
            <p className="text-gray-600 font-inter text-lg">
              RealEstate AI was purpose-built for independent landlords managing
              1 to 50 units. Every feature is designed to save you time, reduce
              vacancies, and put more money in your pocket — without requiring a
              property management degree to operate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="card p-6 hover:shadow-realestate-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-realestate-accent/10 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent
                      className="w-6 h-6 text-realestate-accent"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-realestate-primary font-space-grotesk mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 font-inter leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-20 bg-realestate-primary"
        aria-labelledby="stats-heading"
      >
        <div className="section-container">
          <h2 id="stats-heading" className="sr-only">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-realestate-accent font-space-grotesk mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-300 font-inter">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="testimonials-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Social Proof
            </span>
            <h2
              id="testimonials-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Trusted by Thousands of Independent Landlords
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="card-elevated p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-realestate-accent fill-realestate-accent"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-600 font-inter leading-relaxed mb-6">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div>
                  <p className="font-semibold text-realestate-primary font-space-grotesk">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 font-inter">
                    {testimonial.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Small Landlords Choose Us */}
      <section className="py-20 bg-white" aria-labelledby="why-heading">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h2
              id="why-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-8 text-center"
            >
              Why Small Landlords Choose RealEstate AI
            </h2>
            <div className="space-y-4">
              {[
                "No per-unit pricing — manage 1 or 50 units at the same flat rate",
                "Set up in under 10 minutes with guided onboarding",
                "AI handles tenant screening, rent pricing, and maintenance triage automatically",
                "Mobile-friendly dashboard so you can manage properties from anywhere",
                "Bank-grade encryption protects your financial data and tenant information",
                "Free plan available with no credit card required",
                "Dedicated support team that understands small landlord challenges",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 text-realestate-accent flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-gray-700 font-inter">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-white" aria-labelledby="cta-heading">
        <div className="section-container">
          <div className="card-elevated bg-gradient-to-br from-realestate-primary to-realestate-secondary p-10 md:p-16 text-center rounded-3xl shadow-realestate-lg">
            <h2
              id="cta-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Start Managing Smarter Today
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto mb-8 text-lg">
              Join thousands of small landlords who have reclaimed their
              weekends with RealEstate AI. Free to start, no credit card
              required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth/register"
                className="btn-accent inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                to="/pricing"
                className="btn-outline border-white text-white hover:bg-white hover:text-realestate-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
              >
                Compare Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SmallLandlordsPage;
