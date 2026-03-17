import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Star,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Zap,
  Shield,
  Award,
} from "lucide-react";

interface PricingPlatform {
  name: string;
  startingPrice: string;
  perUnit: string;
  setupFee: string;
  minimumUnits: string;
  aiFeatures: boolean;
  freeplan: boolean;
  noContract: boolean;
  highlight?: boolean;
}

const platforms: PricingPlatform[] = [
  {
    name: "RealEstate AI",
    startingPrice: "$0/mo",
    perUnit: "Flat rate",
    setupFee: "$0",
    minimumUnits: "None",
    aiFeatures: true,
    freeplan: true,
    noContract: true,
    highlight: true,
  },
  {
    name: "AppFolio",
    startingPrice: "$70/mo",
    perUnit: "$1.40/unit",
    setupFee: "$400+",
    minimumUnits: "50 units",
    aiFeatures: false,
    freeplan: false,
    noContract: false,
  },
  {
    name: "Buildium",
    startingPrice: "$58/mo",
    perUnit: "$1.50/unit",
    setupFee: "$0",
    minimumUnits: "None",
    aiFeatures: false,
    freeplan: false,
    noContract: true,
  },
  {
    name: "Rent Manager",
    startingPrice: "$200/mo",
    perUnit: "Custom",
    setupFee: "$500+",
    minimumUnits: "100+ units",
    aiFeatures: false,
    freeplan: false,
    noContract: false,
  },
  {
    name: "TenantCloud",
    startingPrice: "$0/mo",
    perUnit: "$1/unit",
    setupFee: "$0",
    minimumUnits: "None",
    aiFeatures: false,
    freeplan: true,
    noContract: true,
  },
  {
    name: "Yardi Breeze",
    startingPrice: "$100/mo",
    perUnit: "$1/unit",
    setupFee: "$0",
    minimumUnits: "None",
    aiFeatures: false,
    freeplan: false,
    noContract: false,
  },
];

const costScenarios = [
  { units: 10, competitors: "$45 - $150/mo", realestateai: "$0 (Free Plan)" },
  { units: 25, competitors: "$70 - $250/mo", realestateai: "$29/mo" },
  { units: 50, competitors: "$120 - $400/mo", realestateai: "$29/mo" },
  { units: 100, competitors: "$200 - $700/mo", realestateai: "$79/mo" },
  { units: 250, competitors: "$400 - $1,500/mo", realestateai: "$79/mo" },
];

const painPoints = [
  {
    icon: DollarSign,
    title: "Per-Unit Pricing Adds Up Fast",
    description:
      "Most property management platforms charge $1 to $3 per unit per month. For a 100-unit portfolio, that is $100 to $300 per month just in per-unit fees, on top of base subscription costs.",
  },
  {
    icon: AlertTriangle,
    title: "Hidden Fees Are Everywhere",
    description:
      "Setup fees, training fees, transaction fees, premium support fees, and early termination penalties. The advertised price is rarely the price you actually pay.",
  },
  {
    icon: TrendingDown,
    title: "You Pay More as You Grow",
    description:
      "Per-unit pricing means your software cost grows linearly with your portfolio. The more successful you become, the more you pay — even though the software's cost to serve you barely changes.",
  },
];

const whyDifferent = [
  {
    icon: Award,
    title: "Flat-Rate Pricing",
    description:
      "We charge a single monthly fee regardless of how many units you manage. Your software costs stay predictable even as your portfolio grows.",
  },
  {
    icon: Zap,
    title: "AI Included at Every Tier",
    description:
      "AI-powered screening, rent optimization, maintenance routing, and analytics are included in every plan — not locked behind expensive add-ons.",
  },
  {
    icon: Shield,
    title: "No Hidden Fees, No Contracts",
    description:
      "What you see is what you pay. No setup fees, no training fees, no early termination penalties. Cancel anytime with zero friction.",
  },
];

const testimonials = [
  {
    quote:
      "I was paying $450 per month to Buildium for 200 units. With RealEstate AI, I pay $79. That is a savings of over $4,400 per year, and I get better AI features on top of it.",
    name: "Gregory Hines",
    role: "Portfolio Manager, 200 Units",
    rating: 5,
  },
  {
    quote:
      "The transparent pricing is refreshing. Every other platform hit me with surprise fees during onboarding. RealEstate AI quoted me one number and that is exactly what I pay.",
    name: "Megan O'Brien",
    role: "Property Management Company, 85 Units",
    rating: 5,
  },
];

const renderBoolCell = (value: boolean) =>
  value ? (
    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" aria-label="Yes" />
  ) : (
    <XCircle className="w-5 h-5 text-red-400 mx-auto" aria-label="No" />
  );

export const PricingComparisonPage: React.FC = () => {
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
            2026 Pricing Comparison
          </span>
          <h1
            id="hero-heading"
            className="text-display text-white font-space-grotesk mb-6"
          >
            Property Management Software
            <br className="hidden md:block" />
            <span className="text-realestate-accent"> Pricing Comparison</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-inter max-w-3xl mx-auto leading-relaxed mb-10">
            See how RealEstate AI&apos;s flat-rate pricing stacks up against AppFolio,
            Buildium, Rent Manager, TenantCloud, and Yardi Breeze. Transparent
            pricing with no hidden fees.
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
              View Our Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 bg-gray-50" aria-labelledby="problems-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              The Pricing Problem
            </span>
            <h2
              id="problems-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Why Most Property Management Software Costs Too Much
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {painPoints.map((point) => {
              const IconComponent = point.icon;
              return (
                <article key={point.title} className="card-elevated p-8">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-red-500" aria-hidden="true" />
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

      {/* Main Comparison Table */}
      <section className="py-20 bg-white" aria-labelledby="comparison-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Side-by-Side Comparison
            </span>
            <h2
              id="comparison-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              How Every Platform Compares on Price
            </h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              All prices reflect publicly available information as of early 2026.
              Actual costs may vary based on add-ons and negotiated discounts.
            </p>
          </div>
          <div className="card-elevated overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-realestate-primary text-white">
                    <th className="text-left py-4 px-4 font-space-grotesk font-semibold text-sm">Platform</th>
                    <th className="text-center py-4 px-4 font-space-grotesk font-semibold text-sm">Starting Price</th>
                    <th className="text-center py-4 px-4 font-space-grotesk font-semibold text-sm">Per Unit</th>
                    <th className="text-center py-4 px-4 font-space-grotesk font-semibold text-sm">Setup Fee</th>
                    <th className="text-center py-4 px-4 font-space-grotesk font-semibold text-sm">Min. Units</th>
                    <th className="text-center py-4 px-4 font-space-grotesk font-semibold text-sm">AI Features</th>
                    <th className="text-center py-4 px-4 font-space-grotesk font-semibold text-sm">Free Plan</th>
                    <th className="text-center py-4 px-4 font-space-grotesk font-semibold text-sm">No Contract</th>
                  </tr>
                </thead>
                <tbody>
                  {platforms.map((platform, index) => (
                    <tr
                      key={platform.name}
                      className={`border-b border-gray-100 ${
                        platform.highlight
                          ? "bg-realestate-accent/5 font-medium"
                          : index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-inter text-sm text-realestate-primary font-semibold">
                        {platform.highlight && (
                          <span className="inline-block w-2 h-2 bg-realestate-accent rounded-full mr-2" />
                        )}
                        {platform.name}
                      </td>
                      <td className="py-3.5 px-4 text-center text-sm font-inter">{platform.startingPrice}</td>
                      <td className="py-3.5 px-4 text-center text-sm font-inter">{platform.perUnit}</td>
                      <td className="py-3.5 px-4 text-center text-sm font-inter">{platform.setupFee}</td>
                      <td className="py-3.5 px-4 text-center text-sm font-inter">{platform.minimumUnits}</td>
                      <td className="py-3.5 px-4 text-center">{renderBoolCell(platform.aiFeatures)}</td>
                      <td className="py-3.5 px-4 text-center">{renderBoolCell(platform.freeplan)}</td>
                      <td className="py-3.5 px-4 text-center">{renderBoolCell(platform.noContract)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Scenarios */}
      <section className="py-20 bg-gray-50" aria-labelledby="scenarios-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Real Cost Scenarios
            </span>
            <h2
              id="scenarios-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              What You&apos;d Actually Pay by Portfolio Size
            </h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              Here is what property management software typically costs at different
              portfolio sizes, compared with RealEstate AI&apos;s flat-rate pricing.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="card-elevated overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-realestate-primary text-white">
                      <th className="text-left py-4 px-6 font-space-grotesk font-semibold">Portfolio Size</th>
                      <th className="text-center py-4 px-6 font-space-grotesk font-semibold">Industry Range</th>
                      <th className="text-center py-4 px-6 font-space-grotesk font-semibold text-realestate-accent">RealEstate AI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costScenarios.map((scenario, index) => (
                      <tr
                        key={scenario.units}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-3.5 px-6 font-inter text-sm text-realestate-primary font-medium">
                          {scenario.units} Units
                        </td>
                        <td className="py-3.5 px-6 text-center text-sm font-inter text-red-500 font-medium">
                          {scenario.competitors}
                        </td>
                        <td className="py-3.5 px-6 text-center text-sm font-inter text-green-600 font-bold">
                          {scenario.realestateai}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="py-20 bg-realestate-primary" aria-labelledby="different-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2
              id="different-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Why Our Pricing Model Is Different
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {whyDifferent.map((item) => {
              const IconComponent = item.icon;
              return (
                <article
                  key={item.title}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="w-12 h-12 bg-realestate-accent/20 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-realestate-accent" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-white font-space-grotesk mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 font-inter leading-relaxed text-sm">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50" aria-labelledby="testimonials-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2
              id="testimonials-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              What Switchers Say About Our Pricing
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
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

      {/* Final CTA */}
      <section className="py-20 bg-white" aria-labelledby="cta-heading">
        <div className="section-container">
          <div className="card-elevated bg-gradient-to-br from-realestate-primary to-realestate-secondary p-10 md:p-16 text-center rounded-3xl shadow-realestate-lg">
            <h2
              id="cta-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Stop Overpaying for Property Management Software
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto mb-8 text-lg">
              Get more features at a fraction of the cost. Start free, upgrade
              when you&apos;re ready, and never worry about per-unit fees again.
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
                See Detailed Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PricingComparisonPage;
