import {
  Search,
  Shield,
  ArrowRight,
  Star,
  CheckCircle,
  FileText,
  UserCheck,
  AlertTriangle,
  Cpu,
  Clock,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { PageMeta } from "../../components/seo/PageMeta";

const features = [
  {
    icon: Search,
    title: "Comprehensive Background Checks",
    description:
      "Access criminal records, credit reports, and eviction history. Our system searches national, state, and county databases to give you a complete picture of every applicant.",
  },
  {
    icon: Cpu,
    title: "Automated Scoring",
    description:
      "Get a tenant score based on key risk factors. Our AI analyzes hundreds of data points beyond credit score to predict tenant reliability with 94% accuracy.",
  },
  {
    icon: FileText,
    title: "Online Application",
    description:
      "Streamline the application process with our online form. Share a branded link, tenants fill out the form, authorize screening, and pay the fee — zero manual work.",
  },
  {
    icon: Shield,
    title: "Fraud Detection",
    description:
      "Protect your properties from fraudulent applications. Our AI verifies identity, cross-references data sources, and flags inconsistencies before you approve a tenancy.",
  },
];

const additionalFeatures = [
  {
    icon: Clock,
    title: "Results in Minutes",
    description:
      "No more waiting days for reports. Credit checks, criminal background searches, and eviction history are returned in under 10 minutes.",
  },
  {
    icon: UserCheck,
    title: "Fair Housing Compliance",
    description:
      "Our system applies the same objective criteria to every applicant automatically, reducing legal exposure and ensuring consistent evaluations.",
  },
  {
    icon: AlertTriangle,
    title: "Adverse Action Letters",
    description:
      "If you decline an applicant, the platform automatically generates and sends compliant adverse action notices with required disclosures.",
  },
  {
    icon: CheckCircle,
    title: "Comprehensive Reports",
    description:
      "Every screening includes credit report, criminal background, eviction history, identity verification, and income analysis in a single dashboard.",
  },
];

const stats = [
  { value: "94%", label: "AI Prediction Accuracy" },
  { value: "<10min", label: "Average Report Time" },
  { value: "50K+", label: "Screenings Completed" },
  { value: "0", label: "Fair Housing Violations" },
];

const testimonials = [
  {
    quote:
      "The AI risk score has been incredibly accurate. Every tenant that scored low risk has been excellent. I have not had a single eviction since I started using RealEstate AI for screening.",
    name: "Patricia Coleman",
    role: "Landlord, 24 Units",
    rating: 5,
  },
  {
    quote:
      "I used to dread the screening process. Now I share a link, tenants apply and pay, and I get a comprehensive report with an AI recommendation in minutes. It is effortless.",
    name: "Thomas Ng",
    role: "Property Manager, 60 Units",
    rating: 5,
  },
  {
    quote:
      "The fair housing compliance features give me peace of mind. I know every applicant is evaluated using the same objective criteria, which protects me and my tenants.",
    name: "Diana Ruiz",
    role: "Independent Landlord, 10 Units",
    rating: 5,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RealEstate AI Tenant Screening",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Simplify tenant screening with RealEstate AI. Get background checks, credit reports, and eviction history in minutes.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free plan available",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "980",
    bestRating: "5",
  },
  provider: {
    "@type": "Organization",
    name: "RealEstate AI",
  },
};

export const TenantScreeningPage: React.FC = () => {
  return (
    <main
      className="min-h-screen"
      role="main"
      style={{ backgroundColor: "#F5F8F4" }}
    >
      <PageMeta
        title="Tenant Screening Software"
        description="Simplify tenant screening with RealEstate AI. Get background checks, credit reports, and eviction history in minutes."
        keywords="tenant screening software, tenant background check, credit report, eviction history, rental application"
        ogImage="/assets/generated/og-image.png"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section
        className="relative pt-24 pb-20 overflow-hidden"
        style={{ backgroundColor: "#5B7F63" }}
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
            style={{ backgroundColor: "#B8D4A3" }}
          />
          <div
            className="absolute bottom-10 right-20 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: "#8FAE7E" }}
          />
        </div>
        <div className="section-container relative z-10 text-center">
          <span
            className="inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-6 font-inter"
            style={{
              backgroundColor: "rgba(184, 212, 163, 0.2)",
              color: "#B8D4A3",
            }}
          >
            AI-Powered Tenant Screening
          </span>
          <h1
            id="hero-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-space-grotesk mb-6 leading-tight"
          >
            AI-Powered Tenant{" "}
            <span style={{ color: "#B8D4A3" }}>Screening</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-inter max-w-3xl mx-auto leading-relaxed mb-10">
            Screen tenants faster and smarter with AI. Get comprehensive
            background checks, credit reports, eviction history, and AI-powered
            risk scores — all in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#1A4F5A" }}
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg border border-white text-white hover:bg-white transition-all duration-200"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#5B7F63";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "white";
              }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-16"
        style={{ backgroundColor: "#F5F8F4" }}
        aria-labelledby="stats-heading"
      >
        <div className="section-container">
          <h2 id="stats-heading" className="sr-only">
            Screening Statistics
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white shadow-sm"
              >
                <p
                  className="text-3xl md:text-4xl font-bold font-space-grotesk mb-2"
                  style={{ color: "#5B7F63" }}
                >
                  {stat.value}
                </p>
                <p className="text-sm font-inter" style={{ color: "#8FAE7E" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-white" aria-labelledby="features-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-4 font-inter"
              style={{
                backgroundColor: "rgba(184, 212, 163, 0.2)",
                color: "#5B7F63",
              }}
            >
              Core Features
            </span>
            <h2
              id="features-heading"
              className="text-heading font-space-grotesk mb-4"
              style={{ color: "#1E2B22" }}
            >
              Screening Made Simple and Smart
            </h2>
            <p
              className="font-inter max-w-2xl mx-auto"
              style={{ color: "#8FAE7E" }}
            >
              Everything you need to find reliable tenants and protect your
              investment, powered by artificial intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                  style={{ backgroundColor: "#F5F8F4" }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: "rgba(184, 212, 163, 0.25)" }}
                  >
                    <IconComponent
                      className="w-7 h-7"
                      style={{ color: "#5B7F63" }}
                      aria-hidden="true"
                    />
                  </div>
                  <h3
                    className="text-xl font-semibold font-space-grotesk mb-3"
                    style={{ color: "#1E2B22" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="font-inter leading-relaxed"
                    style={{ color: "#8FAE7E" }}
                  >
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section
        className="py-20"
        style={{ backgroundColor: "#5B7F63" }}
        aria-labelledby="ai-features-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-4 font-inter"
              style={{
                backgroundColor: "rgba(184, 212, 163, 0.2)",
                color: "#B8D4A3",
              }}
            >
              Advanced Capabilities
            </span>
            <h2
              id="ai-features-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Go Beyond Traditional Screening
            </h2>
            <p className="text-gray-200 font-inter max-w-2xl mx-auto">
              RealEstate AI adds intelligent analysis that goes beyond what
              manual screening can achieve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="backdrop-blur-sm border rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(184, 212, 163, 0.2)" }}
                  >
                    <IconComponent
                      className="w-6 h-6"
                      style={{ color: "#B8D4A3" }}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white font-space-grotesk mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 font-inter leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 bg-white"
        aria-labelledby="testimonials-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-4 font-inter"
              style={{
                backgroundColor: "rgba(184, 212, 163, 0.2)",
                color: "#5B7F63",
              }}
            >
              Landlord Reviews
            </span>
            <h2
              id="testimonials-heading"
              className="text-heading font-space-grotesk mb-4"
              style={{ color: "#1E2B22" }}
            >
              Trusted by Thousands of Landlords
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="p-8 rounded-2xl border border-gray-100 shadow-sm"
                style={{ backgroundColor: "#F5F8F4" }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current"
                      style={{ color: "#8FAE7E" }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote
                  className="font-inter leading-relaxed mb-6"
                  style={{ color: "#1E2B22" }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div>
                  <p
                    className="font-semibold font-space-grotesk"
                    style={{ color: "#5B7F63" }}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className="text-sm font-inter"
                    style={{ color: "#8FAE7E" }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className="py-20"
        style={{ backgroundColor: "#F5F8F4" }}
        aria-labelledby="cta-heading"
      >
        <div className="section-container">
          <div
            className="p-10 md:p-16 text-center rounded-3xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #5B7F63, #1E2B22)",
            }}
          >
            <h2
              id="cta-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Screen Smarter, Not Harder
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto mb-8 text-lg">
              Let AI handle the heavy lifting. Get comprehensive tenant
              screening reports with AI risk scores in under 10 minutes. Free to
              start.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#1A4F5A" }}
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg border border-white text-white hover:bg-white transition-all duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#5B7F63";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "white";
                }}
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TenantScreeningPage;
