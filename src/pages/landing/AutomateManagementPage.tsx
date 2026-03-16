import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Zap,
  Cpu,
  Clock,
  CheckCircle,
  Settings,
  Bell,
  CreditCard,
  Search,
  Tool,
  FileText,
  BarChart,
  TrendingUp,
  Users,
  GitBranch,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Settings,
    title: "Set Up Your Properties and Tenants",
    description:
      "Start by adding your rental properties to RealEstate AI. Enter property details, unit information, and lease terms. Import existing tenant data from spreadsheets or another platform — our migration tool handles the heavy lifting. Within minutes, your entire portfolio is organized in a single dashboard.",
    tip: "Use our CSV import feature to bulk-upload properties. The system automatically validates addresses and detects duplicate entries.",
  },
  {
    number: "02",
    icon: CreditCard,
    title: "Automate Rent Collection",
    description:
      "Connect your bank account and invite tenants to the tenant portal. They can set up auto-pay with ACH, credit, or debit cards. Configure your rent schedule, grace periods, and late fee rules once — the system handles everything from there. Automatic reminders are sent before the due date, on the due date, and after missed payments.",
    tip: "Enable AI-optimized reminder timing. The system learns each tenant's payment patterns and sends reminders at the moment they are most likely to act.",
  },
  {
    number: "03",
    icon: Search,
    title: "Enable AI-Powered Tenant Screening",
    description:
      "Create a branded application link and share it on your listings. Prospective tenants fill out the application, authorize screening, and pay the application fee online. AI runs credit checks, criminal backgrounds, eviction history, and income verification in under 10 minutes. You receive a comprehensive risk score and a recommendation.",
    tip: "Set your screening criteria once (minimum credit score, income ratio, etc.) and the AI will auto-flag applicants who don't meet your standards while remaining fair-housing compliant.",
  },
  {
    number: "04",
    icon: Tool,
    title: "Automate Maintenance Workflows",
    description:
      "Tenants submit maintenance requests through the portal with photos and descriptions. AI categorizes each request by type and urgency, matches it with the best available contractor based on specialty, rating, and proximity, and schedules the repair. You approve or adjust with one tap. The tenant and contractor both receive automatic status updates throughout the process.",
    tip: "Build your contractor network in the platform. Rate contractors after each job and the AI will increasingly route to your highest-performing vendors.",
  },
  {
    number: "05",
    icon: FileText,
    title: "Set Up Smart Lease Management",
    description:
      "Upload your lease templates and the system tracks every lease in your portfolio. AI sends renewal reminders 60 to 90 days before expiration, drafts renewal offers with AI-recommended rent adjustments based on market data, and handles the electronic signature process. Expired or soon-to-expire leases are flagged automatically on your dashboard.",
    tip: "Enable auto-renewal offers with pre-approved rent ranges. The AI will generate and send renewal proposals at the optimal time without any manual intervention.",
  },
  {
    number: "06",
    icon: BarChart,
    title: "Monitor Everything from Your Dashboard",
    description:
      "Your AI-powered dashboard provides a real-time overview of your entire portfolio: rent collection status, vacancy rates, maintenance pipeline, upcoming lease expirations, and financial performance. Weekly AI-generated insight reports highlight what needs your attention and recommend specific actions. Export reports for accounting and tax preparation in one click.",
    tip: "Set up custom alerts for the metrics that matter most to you. Get notified via email or mobile push when occupancy drops, expenses spike, or maintenance tickets exceed targets.",
  },
];

const automationBenefits = [
  { icon: Clock, title: "Save 15+ Hours/Week", description: "Eliminate repetitive tasks and focus on portfolio growth." },
  { icon: TrendingUp, title: "Increase Revenue 8%", description: "AI rent optimization maximizes income across every unit." },
  { icon: Users, title: "Improve Tenant Satisfaction", description: "Faster responses and self-service portals keep tenants happy." },
  { icon: Zap, title: "Scale Without Hiring", description: "Manage more units without adding staff or overhead." },
];

const testimonials = [
  {
    quote:
      "Following this exact automation playbook, I went from managing 15 units part-time to 45 units with less effort than the original 15 required. The AI handles 90% of the day-to-day work.",
    name: "Rachel Simmons",
    role: "Portfolio Owner, 45 Units",
    rating: 5,
  },
  {
    quote:
      "I automated everything step by step as described here. The maintenance routing alone saved me from hiring a full-time coordinator. AI picks the right contractor every time.",
    name: "David Kowalski",
    role: "Property Manager, 80 Units",
    rating: 5,
  },
  {
    quote:
      "The lease management automation was the game-changer for me. I used to lose track of renewals constantly. Now AI handles the entire process from reminder to signed renewal.",
    name: "Natalie Chen",
    role: "Independent Landlord, 20 Units",
    rating: 5,
  },
];

export const AutomateManagementPage: React.FC = () => {
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
            Step-by-Step Guide
          </span>
          <h1
            id="hero-heading"
            className="text-display text-white font-space-grotesk mb-6"
          >
            How to Automate Rental
            <br className="hidden md:block" />
            Property Management
            <span className="text-realestate-accent"> with AI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-inter max-w-3xl mx-auto leading-relaxed mb-10">
            A practical, step-by-step guide to automating every aspect of rental
            property management — from rent collection and tenant screening to
            maintenance and lease renewals — using AI-powered tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/register"
              className="btn-accent inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              Start Automating Free
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <a
              href="#step-01"
              className="btn-outline border-white text-white hover:bg-white hover:text-realestate-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              Read the Guide
            </a>
          </div>
        </div>
      </section>

      {/* Why Automate Section */}
      <section className="py-20 bg-gray-50" aria-labelledby="why-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Why Automate
            </span>
            <h2
              id="why-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              The Case for Automating Property Management
            </h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              Manual property management does not scale. As your portfolio grows,
              the hours multiply, mistakes compound, and your quality of life
              suffers. AI automation breaks this cycle by handling routine tasks
              with greater speed, accuracy, and consistency than any human team.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {automationBenefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <article key={benefit.title} className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-realestate-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-realestate-accent" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-realestate-primary font-space-grotesk mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-inter">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-20 bg-white" aria-labelledby="guide-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              The Automation Playbook
            </span>
            <h2
              id="guide-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              6 Steps to Fully Automated Property Management
            </h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              Follow these steps in order. Each one builds on the previous, and
              together they create a fully automated property management system
              that runs with minimal daily oversight.
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <article
                  key={step.number}
                  id={`step-${step.number}`}
                  className="card-elevated p-8 scroll-mt-24"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 hidden sm:flex flex-col items-center">
                      <div className="w-14 h-14 bg-realestate-accent text-realestate-primary rounded-2xl flex items-center justify-center text-xl font-bold font-space-grotesk">
                        {step.number}
                      </div>
                      <div className="w-0.5 h-full bg-realestate-accent/20 mt-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="sm:hidden w-8 h-8 bg-realestate-accent text-realestate-primary rounded-lg flex items-center justify-center text-sm font-bold font-space-grotesk">
                          {step.number}
                        </span>
                        <IconComponent className="w-5 h-5 text-realestate-secondary" aria-hidden="true" />
                        <h3 className="text-xl font-semibold text-realestate-primary font-space-grotesk">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 font-inter leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="bg-realestate-accent/5 border border-realestate-accent/20 rounded-xl p-4">
                        <div className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-realestate-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <p className="text-sm text-gray-700 font-inter">
                            <span className="font-semibold text-realestate-primary">Pro Tip:</span>{" "}
                            {step.tip}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* What You Can Automate Checklist */}
      <section className="py-20 bg-realestate-primary" aria-labelledby="automate-list-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2
              id="automate-list-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Everything You Can Automate Today
            </h2>
          </div>
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Online rent collection with auto-pay",
              "Payment reminders and late fee enforcement",
              "Tenant screening and risk scoring",
              "Application processing and adverse action notices",
              "Maintenance request intake and triage",
              "Contractor matching and scheduling",
              "Lease expiration tracking and renewal offers",
              "E-signature for leases and documents",
              "Vacancy forecasting and pre-marketing",
              "Dynamic rent pricing recommendations",
              "Financial reporting and tax exports",
              "Tenant and owner communication logs",
              "Move-in and move-out inspections",
              "Utility billing and cost tracking",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-realestate-accent flex-shrink-0" aria-hidden="true" />
                <p className="text-gray-300 font-inter text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50" aria-labelledby="results-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2
              id="results-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Results from Automated Portfolios
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: "15+", label: "Hours Saved Weekly" },
              { value: "98%", label: "On-Time Payments" },
              { value: "3x", label: "Portfolio Scale" },
              { value: "60%", label: "Lower Costs" },
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

      {/* Testimonials */}
      <section className="py-20 bg-white" aria-labelledby="testimonials-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Success Stories
            </span>
            <h2
              id="testimonials-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Landlords Who Automated Successfully
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

      {/* Final CTA */}
      <section className="py-20 bg-white" aria-labelledby="cta-heading">
        <div className="section-container">
          <div className="card-elevated bg-gradient-to-br from-realestate-primary to-realestate-secondary p-10 md:p-16 text-center rounded-3xl shadow-realestate-lg">
            <h2
              id="cta-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Ready to Automate Your Property Management?
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto mb-8 text-lg">
              Follow the playbook above and transform your rental business in a
              single afternoon. Start free — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth/register"
                className="btn-accent inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
              >
                Start Automating Free
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                to="/pricing"
                className="btn-outline border-white text-white hover:bg-white hover:text-realestate-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
              >
                View Pricing Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AutomateManagementPage;
