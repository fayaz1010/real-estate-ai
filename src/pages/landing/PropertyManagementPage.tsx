import React from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Users,
  Wrench,
  BarChart,
  ArrowRight,
  CheckCircle,
  Star,
  Building,
  Shield,
  Zap,
} from "lucide-react";
import { PageMeta } from "../../components/seo/PageMeta";

const features = [
  {
    icon: CreditCard,
    title: "Automated Rent Collection",
    description:
      "Collect rent online with ease and get paid on time. Accept ACH, credit cards, and debit cards with automated reminders and auto-pay options.",
  },
  {
    icon: Users,
    title: "AI-Powered Tenant Screening",
    description:
      "Find the best tenants with our advanced screening tools. Get credit reports, background checks, and AI risk scores in minutes.",
  },
  {
    icon: Wrench,
    title: "Maintenance Request Management",
    description:
      "Streamline maintenance requests and keep your properties in top shape. AI routes requests to the right vendor and tracks resolution.",
  },
  {
    icon: BarChart,
    title: "Financial Reporting",
    description:
      "Get real-time financial insights and track your property performance. Export reports instantly for tax season and investor updates.",
  },
];

const stats = [
  { value: "15+", label: "Hours Saved Per Week" },
  { value: "98%", label: "On-Time Rent Collection" },
  { value: "4.9/5", label: "Customer Rating" },
  { value: "10K+", label: "Properties Managed" },
];

const testimonials = [
  {
    quote:
      "RealEstate AI transformed how I manage my portfolio. The automated rent collection alone saves me 10 hours a week. I cannot imagine going back to spreadsheets.",
    name: "Jennifer Walsh",
    role: "Property Manager, 35 Units",
    rating: 5,
  },
  {
    quote:
      "The AI tenant screening is incredibly accurate. Every tenant that scored low risk has been excellent. My vacancy rate dropped by 40% in six months.",
    name: "David Chen",
    role: "Landlord, 18 Units",
    rating: 5,
  },
  {
    quote:
      "Finally, a property management tool that does not cost a fortune. The financial reporting features give me the insights I need to grow my business confidently.",
    name: "Sarah Mitchell",
    role: "Independent Landlord, 8 Units",
    rating: 5,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RealEstate AI Property Management Software",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered property management software for landlords and property managers. Automate rent collection, tenant screening, and maintenance.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free plan available",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1250",
    bestRating: "5",
  },
  provider: {
    "@type": "Organization",
    name: "RealEstate AI",
  },
};

export const PropertyManagementPage: React.FC = () => {
  return (
    <main className="min-h-screen" role="main" style={{ backgroundColor: "#F7F5F2" }}>
      <PageMeta
        title="Property Management Software"
        description="RealEstate AI offers AI-powered property management software for landlords and property managers. Automate rent collection, tenant screening, and maintenance."
        keywords="property management software, rental property management tool, landlord software, tenant management platform, rent collection software"
        ogImage="/assets/generated/og-image.png"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section
        className="relative pt-24 pb-20 overflow-hidden"
        style={{ backgroundColor: "#6B6560" }}
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
            style={{ backgroundColor: "#C8B9A6" }}
          />
          <div
            className="absolute bottom-10 right-20 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: "#9E958C" }}
          />
        </div>
        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-6 font-inter"
                style={{ backgroundColor: "rgba(200, 185, 166, 0.2)", color: "#C8B9A6" }}
              >
                #1 AI-Powered Property Management
              </span>
              <h1
                id="hero-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-space-grotesk mb-6 leading-tight"
              >
                AI-Powered Property{" "}
                <span style={{ color: "#C8B9A6" }}>Management Software</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 font-inter max-w-xl leading-relaxed mb-4">
                Manage smarter, grow faster, stress less with RealEstate AI.
              </p>
              <p className="text-base text-gray-400 font-inter max-w-xl leading-relaxed mb-10">
                The all-in-one platform that automates rent collection, tenant screening,
                maintenance management, and financial reporting — powered by artificial intelligence.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  to="/trial/signup"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#1A4F5A" }}
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg border border-white text-white hover:bg-white transition-all duration-200"
                  style={{ ["--tw-text-opacity" as string]: 1 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#6B6560";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "white";
                  }}
                >
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/assets/generated/hero-home.png"
                alt="RealEstate AI property management dashboard showing rent collection, tenant screening, and maintenance tracking"
                className="rounded-2xl shadow-2xl w-full"
                loading="eager"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16" style={{ backgroundColor: "#F7F5F2" }} aria-labelledby="value-heading">
        <div className="section-container text-center">
          <h2 id="value-heading" className="sr-only">
            Why Choose RealEstate AI
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-3xl md:text-4xl font-bold font-space-grotesk mb-2"
                  style={{ color: "#6B6560" }}
                >
                  {stat.value}
                </p>
                <p className="text-sm font-inter" style={{ color: "#9E958C" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" aria-labelledby="features-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-4 font-inter"
              style={{ backgroundColor: "rgba(200, 185, 166, 0.15)", color: "#6B6560" }}
            >
              Features
            </span>
            <h2
              id="features-heading"
              className="text-heading font-space-grotesk mb-4"
              style={{ color: "#2A2725" }}
            >
              Everything You Need to Manage Properties Efficiently
            </h2>
            <p className="font-inter max-w-2xl mx-auto" style={{ color: "#9E958C" }}>
              From rent collection to financial reporting, RealEstate AI gives you the tools
              to manage your entire portfolio from a single dashboard.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                  style={{ backgroundColor: "#F7F5F2" }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: "rgba(200, 185, 166, 0.2)" }}
                  >
                    <IconComponent
                      className="w-7 h-7"
                      style={{ color: "#6B6560" }}
                      aria-hidden="true"
                    />
                  </div>
                  <h3
                    className="text-xl font-semibold font-space-grotesk mb-3"
                    style={{ color: "#2A2725" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="font-inter leading-relaxed" style={{ color: "#9E958C" }}>
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        className="py-20"
        style={{ backgroundColor: "#F7F5F2" }}
        aria-labelledby="why-heading"
      >
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span
                className="inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-4 font-inter"
                style={{ backgroundColor: "rgba(200, 185, 166, 0.15)", color: "#6B6560" }}
              >
                Why RealEstate AI
              </span>
              <h2
                id="why-heading"
                className="text-heading font-space-grotesk mb-4"
                style={{ color: "#2A2725" }}
              >
                Built for Modern Property Managers
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "AI automates tenant screening, rent pricing, and maintenance triage",
                "Collect rent online with zero transaction fees for landlords",
                "Real-time financial dashboard with export for tax season",
                "Mobile-friendly — manage properties from anywhere",
                "Bank-grade encryption protects financial and tenant data",
                "Set up in under 10 minutes with guided onboarding",
                "Free plan available with no credit card required",
                "Dedicated support from a team that understands property management",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 p-3">
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: "#6B6560" }}
                    aria-hidden="true"
                  />
                  <p className="font-inter" style={{ color: "#2A2725" }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white" aria-labelledby="testimonials-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-4 font-inter"
              style={{ backgroundColor: "rgba(200, 185, 166, 0.15)", color: "#6B6560" }}
            >
              Testimonials
            </span>
            <h2
              id="testimonials-heading"
              className="text-heading font-space-grotesk mb-4"
              style={{ color: "#2A2725" }}
            >
              Trusted by Property Managers Everywhere
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="p-8 rounded-2xl border border-gray-100 shadow-sm"
                style={{ backgroundColor: "#F7F5F2" }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current"
                      style={{ color: "#C8B9A6" }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote
                  className="font-inter leading-relaxed mb-6"
                  style={{ color: "#2A2725" }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold font-space-grotesk" style={{ color: "#6B6560" }}>
                    {testimonial.name}
                  </p>
                  <p className="text-sm font-inter" style={{ color: "#9E958C" }}>
                    {testimonial.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="py-20"
        style={{ backgroundColor: "#6B6560" }}
        aria-labelledby="how-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <h2
              id="how-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Get Started in Three Simple Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                icon: Building,
                title: "Add Your Properties",
                description: "Import your portfolio in minutes. Add property details, unit info, and lease terms.",
              },
              {
                step: "2",
                icon: Users,
                title: "Invite Your Tenants",
                description: "Send one-click invitations. Tenants set up payment methods and enable auto-pay.",
              },
              {
                step: "3",
                icon: Zap,
                title: "Let AI Do the Rest",
                description: "Automation handles rent collection, maintenance routing, and financial reporting.",
              },
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <article key={item.step} className="text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#C8B9A6", color: "#2A2725" }}
                  >
                    <IconComponent className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-white font-space-grotesk mb-2">
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

      {/* Final CTA Section */}
      <section className="py-20 bg-white" aria-labelledby="cta-heading">
        <div className="section-container">
          <div
            className="p-10 md:p-16 text-center rounded-3xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #6B6560, #2A2725)",
            }}
          >
            <Shield className="w-12 h-12 mx-auto mb-6" style={{ color: "#C8B9A6" }} aria-hidden="true" />
            <h2
              id="cta-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Ready to Manage Smarter?
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto mb-8 text-lg">
              Join thousands of property managers who have streamlined their operations
              with RealEstate AI. Free to start, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/trial/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#1A4F5A" }}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg border border-white text-white hover:bg-white transition-all duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#6B6560";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "white";
                }}
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

export default PropertyManagementPage;
