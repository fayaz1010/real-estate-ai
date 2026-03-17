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
  Repeat,
  CheckCircle,
  DollarSign,
  Zap,
  Check,
  X,
} from "lucide-react";
import { PageMeta } from "../../components/seo/PageMeta";

const features = [
  {
    icon: Repeat,
    title: "Automated Payments",
    description:
      "Set up recurring payments and get paid on time. Tenants enable auto-pay and rent is deposited directly into your bank account every month.",
  },
  {
    icon: Bell,
    title: "Rent Reminders",
    description:
      "Send automated reminders to tenants to avoid late payments. AI optimizes reminder timing based on each tenant's payment history.",
  },
  {
    icon: BarChart,
    title: "Payment Tracking",
    description:
      "Track your income and expenses in real-time. See exactly who has paid, who is pending, and who is late across all your properties.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Protect your financial information with our secure payment gateway. 256-bit SSL encryption and PCI-compliant payment processors.",
  },
];

const additionalFeatures = [
  {
    icon: CreditCard,
    title: "Multiple Payment Methods",
    description: "Accept ACH, credit cards, and debit cards.",
  },
  {
    icon: DollarSign,
    title: "Automated Late Fees",
    description: "Define your policy once, enforced automatically.",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description: "Get notified the moment a tenant pays.",
  },
  {
    icon: Clock,
    title: "2-Day Deposits",
    description: "Funds deposited in your account within 2 days.",
  },
];

const pricingComparison = [
  {
    name: "RealEstate AI",
    price: "$29/month",
    highlight: true,
    features: {
      onlinePayments: true,
      autoPayTenants: true,
      smartReminders: true,
      lateFeeAutomation: true,
      realTimeDashboard: true,
      mobileApp: true,
      noTransactionFees: true,
      aiInsights: true,
    },
  },
  {
    name: "Competitor A",
    price: "$49/month",
    highlight: false,
    features: {
      onlinePayments: true,
      autoPayTenants: true,
      smartReminders: true,
      lateFeeAutomation: false,
      realTimeDashboard: true,
      mobileApp: true,
      noTransactionFees: false,
      aiInsights: false,
    },
  },
  {
    name: "Competitor B",
    price: "$79/month",
    highlight: false,
    features: {
      onlinePayments: true,
      autoPayTenants: true,
      smartReminders: true,
      lateFeeAutomation: true,
      realTimeDashboard: true,
      mobileApp: true,
      noTransactionFees: false,
      aiInsights: false,
    },
  },
];

const featureLabels: Record<string, string> = {
  onlinePayments: "Online Payments",
  autoPayTenants: "Auto-Pay for Tenants",
  smartReminders: "Smart Reminders",
  lateFeeAutomation: "Late Fee Automation",
  realTimeDashboard: "Real-Time Dashboard",
  mobileApp: "Mobile App",
  noTransactionFees: "No Transaction Fees",
  aiInsights: "AI Insights",
};

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RealEstate AI Rent Collection",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Collect rent online with RealEstate AI. Automate payments, send reminders, and track your income.",
  offers: {
    "@type": "Offer",
    price: "29",
    priceCurrency: "USD",
    description: "Starting at $29/month",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1100",
    bestRating: "5",
  },
  provider: {
    "@type": "Organization",
    name: "RealEstate AI",
  },
};

export const RentCollectionPage: React.FC = () => {
  return (
    <main className="min-h-screen" role="main" style={{ backgroundColor: "#F4F7FB" }}>
      <PageMeta
        title="Online Rent Collection"
        description="Collect rent online with RealEstate AI. Automate payments, send reminders, and track your income."
        keywords="rent collection software, online rent payment, rent reminder, automated rent collection, landlord payment"
        ogImage="/assets/generated/og-image.png"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section
        className="relative pt-24 pb-20 overflow-hidden"
        style={{ backgroundColor: "#1B3A6B" }}
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
            style={{ backgroundColor: "#4A90D9" }}
          />
          <div
            className="absolute bottom-10 right-20 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: "#2C5AA0" }}
          />
        </div>
        <div className="section-container relative z-10 text-center">
          <span
            className="inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-6 font-inter"
            style={{ backgroundColor: "rgba(74, 144, 217, 0.2)", color: "#4A90D9" }}
          >
            Starting at $29/month
          </span>
          <h1
            id="hero-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-space-grotesk mb-6 leading-tight"
          >
            Automated Online{" "}
            <span style={{ color: "#4A90D9" }}>Rent Collection</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-inter max-w-3xl mx-auto leading-relaxed mb-10">
            Collect rent online with zero hassle. Automated payments, smart reminders,
            real-time tracking, and bank-grade security — everything you need to get paid
            on time, every time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/trial/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#1A4F5A" }}
            >
              Try it Free for 14 Days
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <a
              href="#pricing-comparison"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg border border-white text-white hover:bg-white transition-all duration-200"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#1B3A6B";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "white";
              }}
            >
              Compare Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16" style={{ backgroundColor: "#F4F7FB" }} aria-labelledby="stats-heading">
        <div className="section-container">
          <h2 id="stats-heading" className="sr-only">
            Rent Collection Statistics
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white shadow-sm"
              >
                <p
                  className="text-3xl md:text-4xl font-bold font-space-grotesk mb-2"
                  style={{ color: "#1B3A6B" }}
                >
                  {stat.value}
                </p>
                <p className="text-sm font-inter" style={{ color: "#2C5AA0" }}>
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
              style={{ backgroundColor: "rgba(74, 144, 217, 0.1)", color: "#1B3A6B" }}
            >
              Key Features
            </span>
            <h2
              id="features-heading"
              className="text-heading font-space-grotesk mb-4"
              style={{ color: "#0F1C33" }}
            >
              Everything You Need to Collect Rent Online
            </h2>
            <p className="font-inter max-w-2xl mx-auto" style={{ color: "#2C5AA0" }}>
              From automated payments to real-time tracking, RealEstate AI makes
              rent collection effortless for landlords and convenient for tenants.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                  style={{ backgroundColor: "#F4F7FB" }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: "rgba(74, 144, 217, 0.1)" }}
                  >
                    <IconComponent
                      className="w-7 h-7"
                      style={{ color: "#1B3A6B" }}
                      aria-hidden="true"
                    />
                  </div>
                  <h3
                    className="text-xl font-semibold font-space-grotesk mb-3"
                    style={{ color: "#0F1C33" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="font-inter leading-relaxed" style={{ color: "#2C5AA0" }}>
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Bar */}
      <section
        className="py-16"
        style={{ backgroundColor: "#1B3A6B" }}
        aria-labelledby="extras-heading"
      >
        <div className="section-container">
          <h2 id="extras-heading" className="sr-only">
            Additional Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {additionalFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: "rgba(74, 144, 217, 0.2)" }}
                  >
                    <IconComponent
                      className="w-6 h-6"
                      style={{ color: "#4A90D9" }}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-white font-space-grotesk mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-300 font-inter">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section
        id="pricing-comparison"
        className="py-20 bg-white scroll-mt-24"
        aria-labelledby="pricing-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-4 font-inter"
              style={{ backgroundColor: "rgba(74, 144, 217, 0.1)", color: "#1B3A6B" }}
            >
              Pricing Comparison
            </span>
            <h2
              id="pricing-heading"
              className="text-heading font-space-grotesk mb-4"
              style={{ color: "#0F1C33" }}
            >
              See How We Compare
            </h2>
            <p className="font-inter max-w-2xl mx-auto" style={{ color: "#2C5AA0" }}>
              RealEstate AI offers more features at a fraction of the cost.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full" role="table">
                <thead>
                  <tr style={{ backgroundColor: "#F4F7FB" }}>
                    <th className="text-left p-4 font-inter font-semibold text-sm" style={{ color: "#0F1C33" }}>
                      Feature
                    </th>
                    {pricingComparison.map((plan) => (
                      <th
                        key={plan.name}
                        className="text-center p-4 font-space-grotesk font-semibold"
                        style={{
                          color: plan.highlight ? "#1B3A6B" : "#0F1C33",
                          backgroundColor: plan.highlight ? "rgba(74, 144, 217, 0.08)" : undefined,
                        }}
                      >
                        <div className="text-base">{plan.name}</div>
                        <div
                          className="text-lg font-bold mt-1"
                          style={{ color: plan.highlight ? "#1B3A6B" : "#2C5AA0" }}
                        >
                          {plan.price}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(featureLabels).map((featureKey, index) => (
                    <tr
                      key={featureKey}
                      className={index % 2 === 0 ? "bg-white" : ""}
                      style={index % 2 !== 0 ? { backgroundColor: "#F4F7FB" } : undefined}
                    >
                      <td className="p-4 font-inter text-sm" style={{ color: "#0F1C33" }}>
                        {featureLabels[featureKey]}
                      </td>
                      {pricingComparison.map((plan) => (
                        <td
                          key={`${plan.name}-${featureKey}`}
                          className="text-center p-4"
                          style={
                            plan.highlight
                              ? { backgroundColor: "rgba(74, 144, 217, 0.04)" }
                              : undefined
                          }
                        >
                          {plan.features[featureKey as keyof typeof plan.features] ? (
                            <Check
                              className="w-5 h-5 mx-auto"
                              style={{ color: "#5B7F63" }}
                              aria-label="Included"
                            />
                          ) : (
                            <X
                              className="w-5 h-5 mx-auto text-gray-300"
                              aria-label="Not included"
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-6">
            {pricingComparison.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl p-6 border"
                style={{
                  borderColor: plan.highlight ? "#1B3A6B" : "#e5e7eb",
                  backgroundColor: plan.highlight ? "rgba(74, 144, 217, 0.04)" : "white",
                }}
              >
                <div className="text-center mb-4">
                  <h3
                    className="text-lg font-semibold font-space-grotesk"
                    style={{ color: plan.highlight ? "#1B3A6B" : "#0F1C33" }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="text-2xl font-bold font-space-grotesk mt-1"
                    style={{ color: "#1B3A6B" }}
                  >
                    {plan.price}
                  </p>
                </div>
                <ul className="space-y-3">
                  {Object.entries(plan.features).map(([key, value]) => (
                    <li key={key} className="flex items-center gap-3">
                      {value ? (
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#5B7F63" }} aria-hidden="true" />
                      ) : (
                        <X className="w-4 h-4 flex-shrink-0 text-gray-300" aria-hidden="true" />
                      )}
                      <span
                        className="text-sm font-inter"
                        style={{ color: value ? "#0F1C33" : "#9ca3af" }}
                      >
                        {featureLabels[key]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{ backgroundColor: "#F4F7FB" }} aria-labelledby="testimonials-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-4 font-inter"
              style={{ backgroundColor: "rgba(74, 144, 217, 0.1)", color: "#1B3A6B" }}
            >
              Landlord Reviews
            </span>
            <h2
              id="testimonials-heading"
              className="text-heading font-space-grotesk mb-4"
              style={{ color: "#0F1C33" }}
            >
              Landlords Love Our Rent Collection Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current"
                      style={{ color: "#4A90D9" }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote
                  className="font-inter leading-relaxed mb-6"
                  style={{ color: "#0F1C33" }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold font-space-grotesk" style={{ color: "#1B3A6B" }}>
                    {testimonial.name}
                  </p>
                  <p className="text-sm font-inter" style={{ color: "#2C5AA0" }}>
                    {testimonial.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-white" aria-labelledby="included-heading">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h2
              id="included-heading"
              className="text-heading font-space-grotesk mb-8 text-center"
              style={{ color: "#0F1C33" }}
            >
              What You Get with RealEstate AI
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
                "Priority email support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-2">
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "#1B3A6B" }}
                    aria-hidden="true"
                  />
                  <p className="font-inter text-sm" style={{ color: "#0F1C33" }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20" style={{ backgroundColor: "#F4F7FB" }} aria-labelledby="cta-heading">
        <div className="section-container">
          <div
            className="p-10 md:p-16 text-center rounded-3xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #1B3A6B, #0F1C33)",
            }}
          >
            <h2
              id="cta-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Start Collecting Rent Online Today
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto mb-8 text-lg">
              14-day free trial. No credit card required. Set up in under five minutes
              and start getting paid on time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/trial/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#1A4F5A" }}
              >
                Try it Free for 14 Days
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg border border-white text-white hover:bg-white transition-all duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1B3A6B";
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

export default RentCollectionPage;
