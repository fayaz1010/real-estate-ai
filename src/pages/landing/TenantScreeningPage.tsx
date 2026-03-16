import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Shield,
  ArrowRight,
  Star,
  CheckCircle,
  FileText,
  UserCheck,
  AlertTriangle,
  DollarSign,
  Clock,
  Cpu,
  Phone,
  Home,
  Briefcase,
  BarChart,
} from "lucide-react";

const checklistItems = [
  {
    icon: FileText,
    title: "Credit Report",
    description: "Review credit score, outstanding debts, payment history, and any collections or judgments.",
    priority: "Essential",
  },
  {
    icon: Search,
    title: "Criminal Background Check",
    description: "Search national, state, and county criminal databases for felonies and relevant misdemeanors.",
    priority: "Essential",
  },
  {
    icon: Home,
    title: "Eviction History",
    description: "Check court records for any previous eviction filings across all states the applicant has lived in.",
    priority: "Essential",
  },
  {
    icon: Briefcase,
    title: "Employment Verification",
    description: "Confirm current employer, job title, length of employment, and income level. Aim for 3x rent-to-income ratio.",
    priority: "Essential",
  },
  {
    icon: Phone,
    title: "Previous Landlord References",
    description: "Contact at least two prior landlords to ask about payment history, property condition, and lease violations.",
    priority: "Recommended",
  },
  {
    icon: UserCheck,
    title: "Identity Verification",
    description: "Verify government-issued ID matches the application. Check for identity fraud indicators.",
    priority: "Essential",
  },
  {
    icon: DollarSign,
    title: "Income Documentation",
    description: "Request recent pay stubs, tax returns, or bank statements. Self-employed applicants should provide additional documentation.",
    priority: "Essential",
  },
  {
    icon: Scale,
    title: "Fair Housing Compliance",
    description: "Ensure your screening criteria comply with federal, state, and local fair housing laws. Apply the same standards to every applicant.",
    priority: "Essential",
  },
];

const painPoints = [
  {
    icon: Clock,
    title: "Screening Takes Too Long",
    description:
      "Manually ordering reports, calling references, and verifying income can take days. Meanwhile, great tenants accept offers elsewhere.",
  },
  {
    icon: AlertTriangle,
    title: "One Bad Tenant Costs Thousands",
    description:
      "A single eviction can cost $5,000 to $10,000 in legal fees, lost rent, and property damage. Thorough screening is your best insurance.",
  },
  {
    icon: Scale,
    title: "Fair Housing Is Complex",
    description:
      "Navigating federal, state, and local fair housing regulations is challenging. Inconsistent screening processes expose you to legal risk.",
  },
];

const aiFeatures = [
  {
    icon: Brain,
    title: "AI Risk Scoring",
    description:
      "Our machine learning model analyzes hundreds of data points beyond the credit score to predict tenant reliability with 94% accuracy. You get a single, actionable risk score for every applicant.",
  },
  {
    icon: Clock,
    title: "Results in Minutes",
    description:
      "No more waiting days for reports. Credit checks, criminal background searches, and eviction history are returned in under 10 minutes through our automated pipeline.",
  },
  {
    icon: Shield,
    title: "Built-In Fair Housing Compliance",
    description:
      "Our system applies the same objective criteria to every applicant automatically. You define your standards once and the AI enforces them consistently, reducing legal exposure.",
  },
  {
    icon: BadgeCheck,
    title: "Comprehensive Reports",
    description:
      "Every screening includes credit report, criminal background, eviction history, identity verification, and income analysis in a single, easy-to-read dashboard.",
  },
  {
    icon: UserCheck,
    title: "Tenant-Initiated Applications",
    description:
      "Share a branded application link with prospective tenants. They fill out the form, authorize screening, and pay the application fee — zero manual work on your end.",
  },
  {
    icon: FileText,
    title: "Adverse Action Letters",
    description:
      "If you decline an applicant, the platform automatically generates and sends compliant adverse action notices with the required disclosures, protecting you legally.",
  },
];

const testimonials = [
  {
    quote:
      "The AI risk score has been incredibly accurate. Every tenant that scored 'low risk' has been excellent. I have not had a single eviction since I started using RealEstate AI for screening.",
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

export const TenantScreeningPage: React.FC = () => {
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
            Tenant Screening Guide + Free Tools
          </span>
          <h1
            id="hero-heading"
            className="text-display text-white font-space-grotesk mb-6"
          >
            Tenant Screening: Complete Guide
            <br className="hidden md:block" />
            <span className="text-realestate-accent"> + Free Checklist</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-inter max-w-3xl mx-auto leading-relaxed mb-10">
            Learn everything you need to know about screening tenants effectively.
            Plus, use our AI-powered tenant screening software to automate the
            entire process and make data-driven decisions in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/register"
              className="btn-accent inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              Screen Tenants Free
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <a
              href="#checklist"
              className="btn-outline border-white text-white hover:bg-white hover:text-realestate-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              View Free Checklist
            </a>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-50" aria-labelledby="problems-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Why Screening Matters
            </span>
            <h2
              id="problems-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              The True Cost of Skipping Tenant Screening
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

      {/* Checklist Section */}
      <section
        id="checklist"
        className="py-20 bg-white scroll-mt-24"
        aria-labelledby="checklist-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Free Checklist
            </span>
            <h2
              id="checklist-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Complete Tenant Screening Checklist
            </h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              Use this checklist for every applicant to ensure thorough, consistent,
              and legally compliant screening. Every item marked "Essential" should
              be completed before approving a tenancy.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checklistItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <article
                    key={item.title}
                    className="card p-5 hover:shadow-realestate-md transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-realestate-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <IconComponent
                          className="w-5 h-5 text-realestate-accent"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-realestate-primary font-space-grotesk">
                            {item.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-inter font-medium ${
                              item.priority === "Essential"
                                ? "bg-realestate-accent/10 text-realestate-accent"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-inter leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* AI Screening Features */}
      <section
        className="py-20 bg-realestate-primary"
        aria-labelledby="ai-features-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/20 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              AI-Powered Screening
            </span>
            <h2
              id="ai-features-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Automate Your Screening with AI
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto">
              The checklist above is your foundation. RealEstate AI automates every
              step and adds intelligent analysis that goes beyond what manual
              screening can achieve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {aiFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="w-12 h-12 bg-realestate-accent/20 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-realestate-accent" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-white font-space-grotesk mb-3">
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

      {/* Stats Section */}
      <section className="py-20 bg-gray-50" aria-labelledby="stats-heading">
        <div className="section-container">
          <h2 id="stats-heading" className="sr-only">Screening Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: "94%", label: "AI Prediction Accuracy" },
              { value: "<10min", label: "Average Report Time" },
              { value: "50K+", label: "Screenings Completed" },
              { value: "0", label: "Fair Housing Violations" },
            ].map((stat) => (
              <div key={stat.label} className="card-elevated text-center p-6 md:p-8">
                <p className="text-3xl md:text-4xl font-bold text-realestate-accent font-space-grotesk mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 font-inter">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white" aria-labelledby="testimonials-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Landlord Reviews
            </span>
            <h2
              id="testimonials-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Trusted by Thousands of Landlords
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
                  "{testimonial.quote}"
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

      {/* Final CTA Section */}
      <section className="py-20 bg-white" aria-labelledby="cta-heading">
        <div className="section-container">
          <div className="card-elevated bg-gradient-to-br from-realestate-primary to-realestate-secondary p-10 md:p-16 text-center rounded-3xl shadow-realestate-lg">
            <h2
              id="cta-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Screen Smarter, Not Harder
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto mb-8 text-lg">
              Let AI handle the heavy lifting. Get comprehensive tenant screening
              reports with AI risk scores in under 10 minutes. Free to start.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth/register"
                className="btn-accent inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
              >
                Start Screening Free
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
        </div>
      </section>
    </main>
  );
};

export default TenantScreeningPage;
