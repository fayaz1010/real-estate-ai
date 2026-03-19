import {
  Cpu,
  ArrowRight,
  Star,
  MessageSquare,
  TrendingUp,
  Search,
  Hammer,
  FileText,
  BarChart,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const timeSavings = [
  {
    task: "Tenant Screening & Background Checks",
    manualTime: "3 hours",
    aiTime: "10 minutes",
    saved: "2h 50m",
    icon: Search,
  },
  {
    task: "Rent Collection & Follow-Ups",
    manualTime: "4 hours",
    aiTime: "15 minutes",
    saved: "3h 45m",
    icon: TrendingUp,
  },
  {
    task: "Maintenance Request Triage",
    manualTime: "3 hours",
    aiTime: "20 minutes",
    saved: "2h 40m",
    icon: Hammer,
  },
  {
    task: "Lease Renewals & Documentation",
    manualTime: "2.5 hours",
    aiTime: "15 minutes",
    saved: "2h 15m",
    icon: FileText,
  },
  {
    task: "Financial Reporting",
    manualTime: "2 hours",
    aiTime: "5 minutes",
    saved: "1h 55m",
    icon: BarChart,
  },
  {
    task: "Tenant Communication",
    manualTime: "3 hours",
    aiTime: "25 minutes",
    saved: "2h 35m",
    icon: MessageSquare,
  },
];

const totalManual = "17.5 hours";
const totalAI = "1.5 hours";
const totalSaved = "16 hours";

const aiFeatures = [
  {
    icon: Cpu,
    title: "Predictive Vacancy Forecasting",
    description:
      "Our machine learning models analyze lease terms, tenant behavior patterns, local market conditions, and seasonal trends to predict which units are at risk of vacancy up to 90 days in advance. This gives you time to pre-market and minimize turnover costs.",
  },
  {
    icon: TrendingUp,
    title: "Dynamic Rent Optimization",
    description:
      "AI continuously monitors comparable listings, neighborhood demand, and economic indicators to recommend the ideal rent price for each unit. Landlords using this feature see an average 8% increase in rental income within the first year.",
  },
  {
    icon: Hammer,
    title: "Intelligent Maintenance Routing",
    description:
      "When a tenant submits a maintenance request, AI categorizes the issue by urgency, matches it with the best available contractor based on specialty and past performance, and auto-schedules the repair — often before you even see the ticket.",
  },
  {
    icon: Search,
    title: "AI-Enhanced Tenant Screening",
    description:
      "Go beyond credit scores. Our AI evaluates rental history patterns, income stability, employment verification, and behavioral indicators to give you a comprehensive risk score that predicts tenant reliability with 94% accuracy.",
  },
  {
    icon: MessageSquare,
    title: "Natural Language Property Search",
    description:
      "Ask questions in plain English like 'Which units have leases expiring next quarter?' or 'Show me properties with maintenance costs above average.' AI understands your intent and delivers instant answers.",
  },
  {
    icon: FileText,
    title: "Automated Lease Intelligence",
    description:
      "AI tracks every lease in your portfolio, sends renewal reminders at the optimal time, drafts renewal offers based on market conditions, and flags non-standard clauses that may need legal review.",
  },
];

const testimonials = [
  {
    quote:
      "The time savings are real. I used to spend every Saturday on property management tasks. Now the AI handles most of it during the week and I just review a summary on my phone.",
    name: "Kevin Underwood",
    role: "Portfolio Owner, 28 Units",
    rating: 5,
  },
  {
    quote:
      "Predictive vacancy forecasting changed our business. We went from a 12% vacancy rate to under 4% in eight months because we can now pre-market units before tenants even give notice.",
    name: "Sarah Montague",
    role: "Property Management Firm, 120 Units",
    rating: 5,
  },
  {
    quote:
      "The AI maintenance routing is brilliant. It categorizes requests, finds the right contractor, and schedules everything automatically. Our average resolution time dropped from five days to 1.5.",
    name: "Chris Nakamura",
    role: "Regional Property Manager",
    rating: 5,
  },
];

export const AIPropertyManagementPage: React.FC = () => {
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
            AI-Powered Property Management
          </span>
          <h1
            id="hero-heading"
            className="text-display text-white font-space-grotesk mb-6"
          >
            AI-Powered Property Management:
            <br className="hidden md:block" />
            <span className="text-realestate-accent">
              {" "}
              How It Saves 15+ Hours/Week
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-inter max-w-3xl mx-auto leading-relaxed mb-10">
            Stop spending your time on tasks a machine can do better. RealEstate
            AI uses advanced machine learning to automate screening, rent
            collection, maintenance, and reporting — giving you back 15+ hours
            every single week.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/register"
              className="btn-accent inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              Try AI Management Free
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              to="/pricing"
              className="btn-outline border-white text-white hover:bg-white hover:text-realestate-primary inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50" aria-labelledby="problem-heading">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              The Problem
            </span>
            <h2
              id="problem-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-6"
            >
              Property Management Is Stuck in the Past
            </h2>
            <p className="text-gray-600 font-inter text-lg leading-relaxed">
              The average property manager spends 17+ hours per week on
              repetitive administrative tasks: chasing rent payments, screening
              tenants manually, coordinating maintenance calls, and generating
              reports by hand. These are tasks that artificial intelligence can
              handle faster, more accurately, and around the clock — freeing you
              to focus on growing your portfolio and building tenant
              relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Time Savings Breakdown */}
      <section
        className="py-20 bg-white"
        aria-labelledby="time-savings-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Time Savings Breakdown
            </span>
            <h2
              id="time-savings-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Where Your 15+ Hours Come From
            </h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              Here is a detailed breakdown of how AI transforms each property
              management workflow from hours of manual effort to minutes of
              oversight.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="card-elevated overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-realestate-primary text-white">
                      <th className="text-left py-4 px-6 font-space-grotesk font-semibold">
                        Task
                      </th>
                      <th className="text-center py-4 px-6 font-space-grotesk font-semibold">
                        Manual
                      </th>
                      <th className="text-center py-4 px-6 font-space-grotesk font-semibold">
                        With AI
                      </th>
                      <th className="text-center py-4 px-6 font-space-grotesk font-semibold text-realestate-accent">
                        Saved
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSavings.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <tr
                          key={item.task}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <IconComponent
                                className="w-5 h-5 text-realestate-secondary flex-shrink-0"
                                aria-hidden="true"
                              />
                              <span className="font-inter text-sm text-realestate-primary font-medium">
                                {item.task}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 text-center text-red-500 font-inter text-sm font-medium">
                            {item.manualTime}
                          </td>
                          <td className="py-3.5 px-6 text-center text-green-600 font-inter text-sm font-medium">
                            {item.aiTime}
                          </td>
                          <td className="py-3.5 px-6 text-center text-realestate-accent font-inter text-sm font-bold">
                            {item.saved}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-realestate-primary/5 border-t-2 border-realestate-accent">
                      <td className="py-4 px-6 font-space-grotesk font-bold text-realestate-primary">
                        Weekly Total
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-red-500 font-space-grotesk">
                        {totalManual}
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-green-600 font-space-grotesk">
                        {totalAI}
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-realestate-accent font-space-grotesk">
                        {totalSaved}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section
        className="py-20 bg-realestate-primary"
        aria-labelledby="ai-features-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/20 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              AI Features
            </span>
            <h2
              id="ai-features-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Six AI Capabilities That Change Everything
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto">
              Each feature is powered by purpose-built machine learning models
              trained on millions of real estate data points.
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
                    <IconComponent
                      className="w-6 h-6 text-realestate-accent"
                      aria-hidden="true"
                    />
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
      <section className="py-20 bg-gray-50" aria-labelledby="results-heading">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2
              id="results-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Measurable Results from Real Users
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: "15+", label: "Hours Saved Weekly" },
              { value: "94%", label: "Screening Accuracy" },
              { value: "8%", label: "Average Rent Increase" },
              { value: "60%", label: "Faster Maintenance" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card-elevated text-center p-6 md:p-8"
              >
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
      <section
        className="py-20 bg-white"
        aria-labelledby="testimonials-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Real Stories
            </span>
            <h2
              id="testimonials-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              How AI Transformed Their Property Management
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
                  &ldquo;{testimonial.quote}&rdquo;
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

      {/* How It Works */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="how-it-works-heading"
      >
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              id="how-it-works-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-8"
            >
              Getting Started Takes 10 Minutes
            </h2>
            <div className="space-y-4 text-left">
              {[
                "Create your free account — no credit card required",
                "Add your properties and import existing tenant data",
                "AI immediately begins analyzing your portfolio for optimization opportunities",
                "Automated workflows activate for rent collection, screening, and maintenance",
                "Review weekly AI-generated insights and recommendations from your dashboard",
              ].map((step, index) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-realestate-accent text-realestate-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold font-space-grotesk text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 font-inter pt-1">{step}</p>
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
              Reclaim 15+ Hours Every Week
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto mb-8 text-lg">
              Let AI handle the repetitive work so you can focus on what
              matters. Start your free trial today and see the difference in
              your first week.
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
                View Pricing Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AIPropertyManagementPage;
