import React from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Clock,
  ArrowRight,
  Star,
  Bell,
  Shield,
  BarChart,
  Smartphone,
  Repeat,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    title: "Chasing Late Payments",
    description:
      "Sending reminders, making phone calls, and tracking who has paid and who hasn't eats up hours every month and strains your tenant relationships.",
  },
  {
    icon: AlertTriangle,
    title: "Manual Record-Keeping Errors",
    description:
      "When rent payments come in through checks, Venmo, Zelle, and cash, reconciling everything is a nightmare. Mistakes mean lost revenue.",
  },
  {
    icon: DollarSign,
    title: "Expensive Payment Platforms",
    description:
      "Many rent collection tools charge transaction fees, monthly per-unit costs, or both. These fees add up fast and cut directly into your margins.",
  },
];

const features = [
  {
    icon: CreditCard,
    title: "Multiple Payment Methods",
    description:
      "Accept ACH bank transfers, credit cards, and debit cards. Tenants choose how they want to pay, and funds are deposited directly into your bank account.",
  },
  {
    icon: Repeat,
    title: "Auto-Pay for Tenants",
    description:
      "Tenants can set up recurring automatic payments so rent is always on time. You get paid consistently without lifting a finger.",
  },
  {
    icon: Bell,
    title: "Smart Payment Reminders",
    description:
      "AI sends personalized reminders before rent is due, on the due date, and after missed payments. Reminder timing is optimized based on tenant payment history.",
  },
  {
    icon: DollarSign,
    title: "Automated Late Fee Calculation",
    description:
      "Define your late fee policy once and the system enforces it automatically. Late fees are calculated, applied, and communicated to tenants without manual intervention.",
  },
  {
    icon: BarChart,
    title: "Real-Time Payment Dashboard",
    description:
      "See exactly who has paid, who is pending, and who is late across all your properties in a single dashboard. Export reports for accounting in one click.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "All transactions are encrypted with 256-bit SSL and processed through PCI-compliant payment processors. Your money and your tenants' data are fully protected.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly Tenant Portal",
    description:
      "Tenants can pay from any device — phone, tablet, or computer. The portal also lets them view payment history, download receipts, and set up auto-pay.",
  },
  {
    icon: Zap,
    title: "Instant Payment Notifications",
    description:
      "Get notified the moment a tenant pays. No more wondering if the check is in the mail. Real-time status updates keep you informed around the clock.",
  },
];

const stats = [
  { value: "98%", label: "On-Time Payment Rate" },
  { value: "$0", label: "Landlord Transaction Fees" },
  { value: "2 Days", label: "Average Deposit Time" },
  { value: "85%", label: "Tenants Use Auto-Pay" },
];

const testimonials = [
  {
    quote:
      "I used to spend the first week of every month tracking down rent payments. Now 95% of my tenants are on auto-pay and the money just shows up in my account. It is genuinely life-changing.",
    name: "Angela Torres",
    role: "Landlord, 18 Units",
    rating: 5,
  },
  {
    quote:
      "The fact that there are no transaction fees for landlords sold me immediately. Other platforms were charging me 1% per transaction which added up to hundreds per month.",
    name: "Brian Whitfield",
    role: "Property Manager, 45 Units",
    rating: 5,
  },
  {
    quote:
      "The smart reminders actually work. My late payment rate dropped from 22% to under 3% in the first two months. Tenants appreciate the friendly automated nudges.",
    name: "Priya Sharma",
    role: "Independent Landlord, 7 Units",
    rating: 5,
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Connect Your Bank Account",
    description:
      "Securely link your bank account through our encrypted connection. Funds are deposited directly — no intermediary accounts.",
  },
  {
    step: "2",
    title: "Invite Your Tenants",
    description:
      "Send a one-click invitation to tenants. They create an account, link their payment method, and optionally enable auto-pay.",
  },
  {
    step: "3",
    title: "Rent Collects Itself",
    description:
      "Automatic reminders go out before due dates, auto-pay processes on schedule, and late fees are applied automatically. You just monitor the dashboard.",
  },
];

export const RentCollectionPage: React.FC = () => {
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
            Free Rent Collection Software
          </span>
          <h1
            id="hero-heading"
            className="text-display text-white font-space-grotesk mb-6"
          >
            Free Rent Collection Software
            <br className="hidden md:block" />
            <span className="text-realestate-accent"> for Landlords</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-inter max-w-3xl mx-auto leading-relaxed mb-10">
            Collect rent online with zero transaction fees for landlords. Automated
            reminders, auto-pay, late fee enforcement, and a real-time dashboard —
            all included in our free plan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/register"
              className="btn-accent inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              Start Collecting Rent Free
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              to="/pricing"
              className="btn-outline border-white text-white hover:bg-white hover:text-realestate-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              See All Features
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="problems-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              The Problem
            </span>
            <h2
              id="problems-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Rent Collection Shouldn't Be This Hard
            </h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              Most landlords still rely on a patchwork of checks, cash apps, and
              spreadsheets to collect rent. The result is wasted time, missed
              payments, and accounting headaches.
            </p>
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

      {/* How It Works Section */}
      <section className="py-20 bg-white" aria-labelledby="how-it-works-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              How It Works
            </span>
            <h2
              id="how-it-works-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Three Steps to Automated Rent Collection
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((item) => (
              <article key={item.step} className="text-center">
                <div className="w-14 h-14 bg-realestate-accent text-realestate-primary rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold font-space-grotesk">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-realestate-primary font-space-grotesk mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 font-inter leading-relaxed text-sm">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="features-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Features
            </span>
            <h2
              id="features-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Everything You Need to Collect Rent Online
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="card p-6 hover:shadow-realestate-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-realestate-accent/10 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-realestate-accent" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-realestate-primary font-space-grotesk mb-2">
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
      <section className="py-20 bg-realestate-primary" aria-labelledby="stats-heading">
        <div className="section-container">
          <h2 id="stats-heading" className="sr-only">Rent Collection Statistics</h2>
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
      <section className="py-20 bg-gray-50" aria-labelledby="testimonials-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Landlord Reviews
            </span>
            <h2
              id="testimonials-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Landlords Love Our Rent Collection Tools
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

      {/* Free vs Paid */}
      <section className="py-20 bg-white" aria-labelledby="free-heading">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h2
              id="free-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-8 text-center"
            >
              What's Included in the Free Plan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Unlimited online rent collection",
                "ACH and card payment processing",
                "Automated payment reminders",
                "Tenant auto-pay enrollment",
                "Late fee automation",
                "Real-time payment dashboard",
                "Payment receipt generation",
                "Mobile-friendly tenant portal",
                "Bank-grade encryption",
                "Email support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle
                    className="w-5 h-5 text-realestate-accent flex-shrink-0"
                    aria-hidden="true"
                  />
                  <p className="text-gray-700 font-inter text-sm">{item}</p>
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
              Start Collecting Rent Online Today
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto mb-8 text-lg">
              Free forever. No transaction fees for landlords. No credit card
              required to sign up. Set up in under five minutes.
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

export default RentCollectionPage;
