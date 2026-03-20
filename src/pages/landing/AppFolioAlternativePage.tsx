import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Star,
  Zap,
  Cpu,
  DollarSign,
  Headphones,
  Activity,
  Shield,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { PageMeta } from "../../components/seo";

interface ComparisonRow {
  feature: string;
  appfolio: string | boolean;
  realestateai: string | boolean;
  highlight?: boolean;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "Starting Price",
    appfolio: "$1.40/unit/mo (min 50 units)",
    realestateai: "Free plan available",
    highlight: true,
  },
  {
    feature: "Minimum Portfolio Size",
    appfolio: "50 units",
    realestateai: "No minimum",
    highlight: true,
  },
  { feature: "Setup Fee", appfolio: "$400+", realestateai: "$0" },
  { feature: "AI Tenant Screening", appfolio: false, realestateai: true },
  { feature: "AI Rent Pricing", appfolio: false, realestateai: true },
  { feature: "AI Maintenance Triage", appfolio: false, realestateai: true },
  { feature: "Online Rent Collection", appfolio: true, realestateai: true },
  { feature: "Accounting & Reporting", appfolio: true, realestateai: true },
  { feature: "Tenant Portal", appfolio: true, realestateai: true },
  { feature: "Owner Portal", appfolio: true, realestateai: true },
  { feature: "Maintenance Tracking", appfolio: true, realestateai: true },
  { feature: "Automated Late Fees", appfolio: true, realestateai: true },
  {
    feature: "Smart Lease Renewal Alerts",
    appfolio: false,
    realestateai: true,
  },
  {
    feature: "Predictive Vacancy Forecasting",
    appfolio: false,
    realestateai: true,
  },
  { feature: "Natural Language Search", appfolio: false, realestateai: true },
  {
    feature: "No Long-Term Contract",
    appfolio: false,
    realestateai: true,
    highlight: true,
  },
  {
    feature: "Free Customer Support",
    appfolio: "Email only",
    realestateai: "Chat, email, phone",
  },
];

const advantages = [
  {
    icon: DollarSign,
    title: "Save 60% or More on Monthly Costs",
    description:
      "AppFolio requires a minimum of 50 units and charges per-unit fees. RealEstate AI offers flat-rate pricing with a free tier, making it accessible for landlords of any portfolio size.",
  },
  {
    icon: Cpu,
    title: "True AI — Not Just Automation",
    description:
      "While AppFolio offers workflow automation, RealEstate AI uses machine learning to predict vacancies, recommend rent prices, triage maintenance requests, and screen tenants intelligently.",
  },
  {
    icon: Zap,
    title: "Get Started in Minutes, Not Weeks",
    description:
      "AppFolio's onboarding process can take weeks with mandatory training sessions. RealEstate AI's guided setup gets you fully operational in under ten minutes.",
  },
  {
    icon: Headphones,
    title: "Support That Actually Supports You",
    description:
      "Access live chat, email, and phone support at no extra cost. AppFolio restricts support channels and charges premium rates for priority assistance.",
  },
  {
    icon: Activity,
    title: "Faster, Modern Interface",
    description:
      "RealEstate AI was built from the ground up with modern web technology. Every interaction is fast, responsive, and designed for the way property managers actually work.",
  },
  {
    icon: Shield,
    title: "No Lock-In Contracts",
    description:
      "Cancel anytime without penalties. AppFolio often requires annual commitments and charges early termination fees that can cost thousands.",
  },
];

const testimonials = [
  {
    quote:
      "We switched from AppFolio after three years. The per-unit pricing was eating into our margins, and the lack of AI features felt like we were falling behind. RealEstate AI pays for itself in time savings alone.",
    name: "Jennifer Park",
    role: "Property Manager, 35 Units",
    rating: 5,
  },
  {
    quote:
      "AppFolio wouldn't even let me sign up because I had fewer than 50 units. RealEstate AI welcomed me with a free plan and I've been growing my portfolio with their tools ever since.",
    name: "Daniel Okafor",
    role: "Independent Landlord, 22 Units",
    rating: 5,
  },
];

const renderCellValue = (value: string | boolean) => {
  if (typeof value === "boolean") {
    return value ? (
      <CheckCircle
        className="w-5 h-5 text-green-500 mx-auto"
        aria-label="Included"
      />
    ) : (
      <XCircle
        className="w-5 h-5 text-red-400 mx-auto"
        aria-label="Not included"
      />
    );
  }
  return <span className="text-sm font-inter">{value}</span>;
};

export const AppFolioAlternativePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white" role="main">
      <PageMeta
        title="Best AppFolio Alternative with AI | RealEstate AI"
        description="Looking for an AppFolio alternative? RealEstate AI offers AI-powered features, lower pricing, and no minimum unit requirements. Compare and switch today."
        keywords="AppFolio alternative, AppFolio competitor, better than AppFolio, AppFolio replacement, property management software alternative"
        canonicalUrl="https://realestate-ai.com/landing/appfolio-alternative"
      />
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
            AppFolio Alternative
          </span>
          <h1
            id="hero-heading"
            className="text-display text-white font-space-grotesk mb-6"
          >
            AppFolio vs RealEstate AI:
            <br className="hidden md:block" />
            <span className="text-realestate-accent">
              {" "}
              Feature and Pricing Comparison
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-inter max-w-3xl mx-auto leading-relaxed mb-10">
            Looking for a smarter, more affordable AppFolio alternative? See how
            RealEstate AI delivers more AI-powered features, flexible pricing,
            and zero minimum unit requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/register"
              className="btn-accent inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              Try RealEstate AI Free
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              to="/pricing"
              className="btn-outline border-white text-white hover:bg-white hover:text-realestate-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              See Full Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="comparison-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Head-to-Head Comparison
            </span>
            <h2
              id="comparison-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Feature-by-Feature Breakdown
            </h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              We believe in transparency. Here is an honest side-by-side
              comparison of AppFolio and RealEstate AI across the features that
              matter most.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="card-elevated overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-realestate-primary text-white">
                      <th className="text-left py-4 px-6 font-space-grotesk font-semibold">
                        Feature
                      </th>
                      <th className="text-center py-4 px-6 font-space-grotesk font-semibold">
                        AppFolio
                      </th>
                      <th className="text-center py-4 px-6 font-space-grotesk font-semibold bg-realestate-accent/20">
                        RealEstate AI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr
                        key={row.feature}
                        className={`border-b border-gray-100 ${
                          row.highlight
                            ? "bg-realestate-accent/5"
                            : index % 2 === 0
                              ? "bg-white"
                              : "bg-gray-50"
                        }`}
                      >
                        <td className="py-3.5 px-6 font-inter text-sm text-realestate-primary font-medium">
                          {row.feature}
                        </td>
                        <td className="py-3.5 px-6 text-center text-gray-600">
                          {renderCellValue(row.appfolio)}
                        </td>
                        <td className="py-3.5 px-6 text-center text-realestate-primary font-medium">
                          {renderCellValue(row.realestateai)}
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

      {/* Why Switch Section */}
      <section className="py-20 bg-white" aria-labelledby="advantages-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Why Switch
            </span>
            <h2
              id="advantages-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Six Reasons Property Managers Switch to RealEstate AI
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {advantages.map((advantage) => {
              const IconComponent = advantage.icon;
              return (
                <article
                  key={advantage.title}
                  className="card p-6 hover:shadow-realestate-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-realestate-accent/10 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent
                      className="w-6 h-6 text-realestate-accent"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-realestate-primary font-space-grotesk mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600 font-inter leading-relaxed text-sm">
                    {advantage.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 bg-realestate-primary"
        aria-labelledby="testimonials-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <h2
              id="testimonials-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              What Switchers Are Saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-realestate-accent fill-realestate-accent"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-300 font-inter leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-white font-space-grotesk">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-400 font-inter">
                    {testimonial.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Section */}
      <section className="py-20 bg-gray-50" aria-labelledby="migration-heading">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              id="migration-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-6"
            >
              Switching Is Easier Than You Think
            </h2>
            <p className="text-gray-600 font-inter text-lg mb-8">
              Our dedicated migration team will import your properties, tenants,
              leases, and financial history from AppFolio at no extra cost. Most
              migrations are complete within 48 hours.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Sign Up Free",
                  desc: "Create your account in under two minutes",
                },
                {
                  step: "2",
                  title: "We Migrate Your Data",
                  desc: "Our team imports everything from AppFolio",
                },
                {
                  step: "3",
                  title: "Go Live",
                  desc: "Start managing with AI-powered tools",
                },
              ].map((item) => (
                <div key={item.step} className="card-elevated p-6 text-center">
                  <div className="w-10 h-10 bg-realestate-accent text-realestate-primary rounded-full flex items-center justify-center mx-auto mb-3 font-bold font-space-grotesk">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-realestate-primary font-space-grotesk mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-inter">
                    {item.desc}
                  </p>
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
              Ready to Switch from AppFolio?
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto mb-8 text-lg">
              Start your free trial today. No credit card required, no minimum
              unit count, and free data migration from AppFolio.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth/register"
                className="btn-accent inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                to="/pricing"
                className="btn-outline border-white text-white hover:bg-white hover:text-realestate-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
              >
                Compare All Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AppFolioAlternativePage;
