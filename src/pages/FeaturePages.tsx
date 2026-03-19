// FILE PATH: src/pages/FeaturePages.tsx
// RealEstate AI - Feature landing pages for marketing routes

import {
  ArrowRight,
  BarChart,
  Bot,
  Building,
  Calculator,
  Calendar,
  Camera,
  CheckCircle,
  CreditCard,
  FileText,
  Globe,
  Layout,
  LineChart,
  Map,
  MapPin,
  MessageSquare,
  Monitor,
  PieChart,
  Search,
  Send,
  Shield,
  Star,
  Target,
  TrendingUp,
  Upload,
  Users,
  Video,
  Zap,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { PageMeta } from "../components/seo";

/* ------------------------------------------------------------------ */
/*  SHARED FEATURE PAGE LAYOUT                                         */
/* ------------------------------------------------------------------ */
interface Feature {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

interface FeaturePageProps {
  title: string;
  metaDescription: string;
  keywords: string;
  headline: string;
  subheadline: string;
  features: Feature[];
  ctaText?: string;
  ctaLink?: string;
}

const FeaturePageLayout: React.FC<FeaturePageProps> = ({
  title,
  metaDescription,
  keywords,
  headline,
  subheadline,
  features,
  ctaText = "Start Free Trial",
  ctaLink = "/auth/register",
}) => (
  <>
    <PageMeta title={title} description={metaDescription} keywords={keywords} />

    {/* Hero */}
    <section className="relative bg-realestate-primary overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-realestate-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-realestate-secondary/15 blur-3xl" />
      </div>
      <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
        <h1 className="text-display text-4xl sm:text-5xl text-white leading-tight mb-6">
          {headline}
        </h1>
        <p className="font-inter text-lg text-gray-300 mb-10 leading-relaxed">
          {subheadline}
        </p>
        <Link
          to={ctaLink}
          className="btn-accent text-base px-8 py-4 rounded-lg shadow-realestate-lg inline-flex items-center gap-2"
        >
          {ctaText}
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </Link>
      </div>
    </section>

    {/* Features Grid */}
    <section className="py-20 bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-realestate-md transition-shadow"
            >
              <div className="w-12 h-12 bg-realestate-accent/10 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-realestate-accent" />
              </div>
              <h3 className="text-heading text-lg text-realestate-primary mb-2">
                {f.title}
              </h3>
              <p className="font-inter text-sm text-gray-600 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-16 bg-realestate-primary">
      <div className="section-container text-center">
        <h2 className="text-display text-3xl text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="font-inter text-gray-300 max-w-xl mx-auto mb-8">
          Join thousands of property managers using RealEstate AI. No credit
          card required.
        </p>
        <Link
          to={ctaLink}
          className="btn-accent text-base px-10 py-4 rounded-lg shadow-realestate-lg inline-flex items-center gap-2"
        >
          Get Started Free
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  </>
);

/* ------------------------------------------------------------------ */
/*  INDIVIDUAL FEATURE PAGES                                           */
/* ------------------------------------------------------------------ */

export const BookingPage: React.FC = () => (
  <FeaturePageLayout
    title="Online Property Booking"
    metaDescription="Book property viewings and inspections online with RealEstate AI. Instant scheduling, payment options, and automated confirmations."
    keywords="property booking, online scheduling, property viewing, inspection booking"
    headline="Effortless Property Booking"
    subheadline="Let tenants and buyers book property viewings online with instant confirmation, integrated payments, and automated reminders."
    features={[
      {
        title: "Instant Scheduling",
        description:
          "Real-time availability calendar with one-click booking for property viewings and inspections.",
        icon: Calendar,
      },
      {
        title: "Secure Payments",
        description:
          "Accept deposits and booking fees securely through integrated Stripe payment processing.",
        icon: CreditCard,
      },
      {
        title: "Automated Confirmations",
        description:
          "Send instant booking confirmations, reminders, and follow-ups via email and SMS.",
        icon: CheckCircle,
      },
      {
        title: "Multi-Property Support",
        description:
          "Manage bookings across your entire portfolio from a single dashboard.",
        icon: Building,
      },
      {
        title: "Calendar Sync",
        description:
          "Sync with Google Calendar, Outlook, and Apple Calendar to avoid double-bookings.",
        icon: Calendar,
      },
      {
        title: "Analytics",
        description:
          "Track booking conversion rates, popular viewing times, and no-show patterns.",
        icon: BarChart,
      },
    ]}
  />
);

export const GoogleMapsPage: React.FC = () => (
  <FeaturePageLayout
    title="Google Maps Integration"
    metaDescription="Visualize your property portfolio on Google Maps. Interactive markers, neighborhood insights, and location-based search."
    keywords="property map, Google Maps integration, property location, neighborhood analysis"
    headline="Properties on the Map"
    subheadline="Visualize your entire portfolio with interactive Google Maps integration. Help tenants find their perfect location with neighborhood insights."
    features={[
      {
        title: "Interactive Map",
        description:
          "Browse properties on a fully interactive map with custom markers and clustering.",
        icon: Map,
      },
      {
        title: "Property Markers",
        description:
          "Custom markers showing price, availability, and property type at a glance.",
        icon: MapPin,
      },
      {
        title: "Neighborhood Data",
        description:
          "Display nearby amenities, schools, transport links, and walkability scores.",
        icon: Globe,
      },
      {
        title: "Location Search",
        description:
          "Search by address, suburb, or draw custom boundaries on the map.",
        icon: Search,
      },
      {
        title: "Street View",
        description:
          "Integrated Street View so prospects can explore the neighborhood virtually.",
        icon: Camera,
      },
      {
        title: "Commute Calculator",
        description:
          "Calculate commute times to work, school, or other key destinations.",
        icon: TrendingUp,
      },
    ]}
  />
);

export const LeadGenerationPage: React.FC = () => (
  <FeaturePageLayout
    title="Lead Generation"
    metaDescription="Generate and nurture property leads automatically with AI-powered scoring, automated follow-ups, and conversion tracking."
    keywords="lead generation, property leads, real estate CRM, lead scoring, lead nurturing"
    headline="Turn Visitors Into Tenants"
    subheadline="Capture, score, and nurture leads automatically with AI-powered lead generation tools built for property managers."
    features={[
      {
        title: "Smart Lead Forms",
        description:
          "Customizable forms that capture the right information and auto-qualify leads.",
        icon: FileText,
      },
      {
        title: "AI Lead Scoring",
        description:
          "Machine learning scores leads based on engagement, intent, and fit to prioritize follow-ups.",
        icon: Target,
      },
      {
        title: "Automated Follow-Up",
        description:
          "Trigger personalized email sequences and SMS follow-ups based on lead behavior.",
        icon: Send,
      },
      {
        title: "Lead Dashboard",
        description:
          "Track every lead through your pipeline with real-time analytics and conversion rates.",
        icon: BarChart,
      },
      {
        title: "Source Tracking",
        description:
          "Know exactly which channels drive your best leads — listings, ads, or referrals.",
        icon: PieChart,
      },
      {
        title: "Integration Ready",
        description:
          "Connect with your existing marketing tools, listing sites, and social platforms.",
        icon: Zap,
      },
    ]}
  />
);

export const CRMPage: React.FC = () => (
  <FeaturePageLayout
    title="Property CRM"
    metaDescription="Manage all tenant and owner relationships in one place. Communication history, task management, and automated workflows."
    keywords="property CRM, tenant relationship management, landlord CRM, property management CRM"
    headline="Relationships That Build Portfolios"
    subheadline="Manage every tenant, owner, and vendor relationship from a single CRM built specifically for property management."
    features={[
      {
        title: "Customer Profiles",
        description:
          "Complete 360-degree profiles with contact details, lease history, and communication logs.",
        icon: Users,
      },
      {
        title: "Communication Hub",
        description:
          "All emails, calls, SMS, and notes in one timeline per contact.",
        icon: MessageSquare,
      },
      {
        title: "Task Management",
        description:
          "Create, assign, and track tasks with deadlines and automated reminders.",
        icon: CheckCircle,
      },
      {
        title: "Pipeline Views",
        description:
          "Visual pipelines for leads, applications, lease renewals, and maintenance.",
        icon: Layout,
      },
      {
        title: "Automated Workflows",
        description:
          "Set up triggers for follow-ups, lease reminders, and satisfaction surveys.",
        icon: Zap,
      },
      {
        title: "Reporting",
        description:
          "Track occupancy rates, tenant satisfaction, and team productivity metrics.",
        icon: BarChart,
      },
    ]}
  />
);

export const PropertyValuationPage: React.FC = () => (
  <FeaturePageLayout
    title="AI Property Valuation"
    metaDescription="Get instant AI-powered property valuations using comparable sales, rental yields, and market trends."
    keywords="property valuation, AI valuation, property appraisal, rental yield calculator"
    headline="Know What Your Property Is Worth"
    subheadline="Get instant, AI-powered property valuations using comparable sales data, rental yields, and real-time market trends."
    features={[
      {
        title: "Instant Valuation",
        description:
          "Enter an address and get an AI-estimated market value in seconds.",
        icon: Calculator,
      },
      {
        title: "Comparable Sales",
        description:
          "See recent sales of similar properties in the area to validate your valuation.",
        icon: BarChart,
      },
      {
        title: "Rental Yield",
        description:
          "Calculate potential rental income and gross/net yields for any property.",
        icon: TrendingUp,
      },
      {
        title: "Market Trends",
        description:
          "Historical price trends and growth forecasts for the suburb and region.",
        icon: LineChart,
      },
      {
        title: "Investment Score",
        description:
          "AI-generated score combining capital growth potential, rental demand, and risk.",
        icon: Star,
      },
      {
        title: "PDF Reports",
        description:
          "Generate professional valuation reports to share with stakeholders.",
        icon: FileText,
      },
    ]}
  />
);

export const MarketAnalysisPage: React.FC = () => (
  <FeaturePageLayout
    title="Market Analysis"
    metaDescription="Deep dive into real estate market data with AI-powered trend analysis, suburb reports, and investment insights."
    keywords="market analysis, real estate trends, property market data, suburb analysis"
    headline="Data-Driven Market Intelligence"
    subheadline="Make informed investment decisions with AI-powered market analysis covering trends, demographics, and growth forecasts."
    features={[
      {
        title: "Market Data",
        description:
          "Real-time market data including median prices, days on market, and inventory levels.",
        icon: BarChart,
      },
      {
        title: "Trend Analysis",
        description:
          "Identify emerging markets and price trends before they become obvious.",
        icon: TrendingUp,
      },
      {
        title: "Suburb Reports",
        description:
          "Comprehensive suburb profiles with demographics, infrastructure, and growth drivers.",
        icon: Globe,
      },
      {
        title: "Demand Indicators",
        description:
          "Track rental demand, vacancy rates, and tenant search volume by area.",
        icon: LineChart,
      },
      {
        title: "Competition Mapping",
        description:
          "See what other landlords are charging and how your properties compare.",
        icon: Map,
      },
      {
        title: "Custom Reports",
        description:
          "Build and export custom reports for stakeholders and investment committees.",
        icon: FileText,
      },
    ]}
  />
);

export const PredictiveAnalyticsPage: React.FC = () => (
  <FeaturePageLayout
    title="Predictive Analytics"
    metaDescription="AI-powered predictive analytics for property investment. Forecast returns, assess risk, and optimize your portfolio."
    keywords="predictive analytics, property investment, AI forecasting, risk assessment, portfolio optimization"
    headline="See the Future of Your Portfolio"
    subheadline="AI-powered predictive analytics that forecast returns, assess risk, and recommend portfolio optimization strategies."
    features={[
      {
        title: "Return Forecasting",
        description:
          "Predict capital growth and rental returns over 1, 5, and 10 year horizons.",
        icon: TrendingUp,
      },
      {
        title: "Risk Assessment",
        description:
          "AI-generated risk scores considering market volatility, location factors, and economic indicators.",
        icon: Shield,
      },
      {
        title: "Investment Recommendations",
        description:
          "Personalized buy/hold/sell recommendations based on your portfolio and goals.",
        icon: Target,
      },
      {
        title: "What-If Scenarios",
        description:
          "Model different scenarios — rate changes, renovation, refinancing — and see projected outcomes.",
        icon: Calculator,
      },
      {
        title: "Portfolio Analytics",
        description:
          "Diversification analysis, correlation metrics, and portfolio health dashboard.",
        icon: PieChart,
      },
      {
        title: "Alerts & Triggers",
        description:
          "Set alerts for market conditions that match your investment criteria.",
        icon: Zap,
      },
    ]}
  />
);

export const AIChatbotsPage: React.FC = () => (
  <FeaturePageLayout
    title="AI Chatbots"
    metaDescription="24/7 AI chatbot for tenant inquiries, property questions, and customer support. Reduce response times by 90%."
    keywords="AI chatbot, property chatbot, tenant support, automated customer service"
    headline="AI That Answers 24/7"
    subheadline="Deploy intelligent chatbots that handle tenant inquiries, schedule viewings, and provide instant support around the clock."
    features={[
      {
        title: "Instant Responses",
        description:
          "Answer tenant questions about rent, maintenance, and policies in seconds, not hours.",
        icon: Bot,
      },
      {
        title: "Knowledge Base",
        description:
          "Train your chatbot with property details, FAQs, and company policies.",
        icon: FileText,
      },
      {
        title: "Lead Capture",
        description:
          "Qualify and capture leads from website visitors with conversational flows.",
        icon: Target,
      },
      {
        title: "Viewing Scheduling",
        description:
          "Let the chatbot book property viewings directly from the conversation.",
        icon: Calendar,
      },
      {
        title: "Human Handoff",
        description:
          "Seamless escalation to your team when the chatbot can't resolve an issue.",
        icon: Users,
      },
      {
        title: "Multi-Channel",
        description:
          "Deploy across your website, WhatsApp, Facebook Messenger, and SMS.",
        icon: MessageSquare,
      },
    ]}
  />
);

export const VirtualToursPage: React.FC = () => (
  <FeaturePageLayout
    title="Virtual Tours"
    metaDescription="Create and share immersive 3D virtual property tours. Reduce in-person viewings by 60% while improving tenant satisfaction."
    keywords="virtual tours, 3D property tour, virtual viewing, property walkthrough"
    headline="Tour Properties From Anywhere"
    subheadline="Create immersive 3D virtual tours that let prospects explore properties from anywhere, reducing in-person viewings by 60%."
    features={[
      {
        title: "3D Virtual Tours",
        description:
          "Create stunning 360-degree virtual tours with hotspots and annotations.",
        icon: Video,
      },
      {
        title: "Self-Guided Viewing",
        description:
          "Let prospects explore at their own pace with interactive floor plans.",
        icon: Monitor,
      },
      {
        title: "Live Virtual Tours",
        description:
          "Host live guided tours via video with screen sharing and Q&A.",
        icon: Camera,
      },
      {
        title: "Embeddable",
        description:
          "Embed tours on your website, listings, and social media for maximum reach.",
        icon: Globe,
      },
      {
        title: "Analytics",
        description:
          "Track which rooms get the most attention and where prospects spend time.",
        icon: BarChart,
      },
      {
        title: "Mobile Optimized",
        description:
          "Tours work beautifully on mobile devices with touch and gyroscope support.",
        icon: Monitor,
      },
    ]}
  />
);

export const AutomatedMarketingPage: React.FC = () => (
  <FeaturePageLayout
    title="Automated Marketing"
    metaDescription="Automate property marketing across listing sites, email, and social media. AI-generated descriptions and smart targeting."
    keywords="automated marketing, property marketing, listing syndication, email campaigns"
    headline="Marketing That Runs Itself"
    subheadline="Automate your property marketing across listing sites, email campaigns, and social media with AI-powered content generation."
    features={[
      {
        title: "Campaign Builder",
        description:
          "Visual drag-and-drop campaign builder for email, SMS, and social media.",
        icon: Layout,
      },
      {
        title: "AI Copywriting",
        description:
          "Generate compelling property descriptions and ad copy with AI.",
        icon: FileText,
      },
      {
        title: "Listing Syndication",
        description:
          "Push listings to multiple platforms simultaneously with one click.",
        icon: Send,
      },
      {
        title: "Email Templates",
        description:
          "Professional email templates for every stage of the tenant lifecycle.",
        icon: MessageSquare,
      },
      {
        title: "Lead Tracking",
        description:
          "Track which campaigns drive the most inquiries and applications.",
        icon: Target,
      },
      {
        title: "A/B Testing",
        description:
          "Test different headlines, images, and CTAs to optimize conversion rates.",
        icon: BarChart,
      },
    ]}
  />
);

export const DocumentManagementPage: React.FC = () => (
  <FeaturePageLayout
    title="Document Management"
    metaDescription="Secure digital document management for leases, contracts, and compliance documents. E-signatures and version control."
    keywords="document management, lease management, e-signatures, digital documents, property documents"
    headline="All Your Documents, Organized"
    subheadline="Securely manage leases, contracts, and compliance documents with e-signatures, version control, and instant search."
    features={[
      {
        title: "Document Library",
        description:
          "Centralized, searchable library for all property-related documents.",
        icon: FileText,
      },
      {
        title: "E-Signatures",
        description:
          "Send documents for electronic signature and track completion in real-time.",
        icon: CheckCircle,
      },
      {
        title: "Version Control",
        description:
          "Track every change with automatic versioning and audit trails.",
        icon: Shield,
      },
      {
        title: "Smart Upload",
        description:
          "AI automatically categorizes and tags uploaded documents.",
        icon: Upload,
      },
      {
        title: "Document Search",
        description:
          "Full-text search across all documents to find what you need instantly.",
        icon: Search,
      },
      {
        title: "Compliance Tracking",
        description:
          "Automated reminders for expiring certificates, licenses, and insurance.",
        icon: Calendar,
      },
    ]}
  />
);

export const InteractiveDemoPage: React.FC = () => (
  <FeaturePageLayout
    title="Interactive Demo"
    metaDescription="Try RealEstate AI with our interactive demo. Explore AI-powered property management features without signing up."
    keywords="interactive demo, property management demo, try free, product tour"
    headline="See RealEstate AI in Action"
    subheadline="Explore our AI-powered property management platform with a guided interactive demo. No signup required."
    ctaText="Start Interactive Demo"
    features={[
      {
        title: "Guided Tour",
        description:
          "Step-by-step walkthrough of key features with interactive highlights.",
        icon: Monitor,
      },
      {
        title: "Live Data",
        description:
          "Explore with realistic sample data showing AI insights and analytics.",
        icon: BarChart,
      },
      {
        title: "Feature Highlights",
        description:
          "Deep-dive into specific features like AI screening, rent collection, and maintenance.",
        icon: Star,
      },
      {
        title: "Try AI Features",
        description:
          "Test AI chatbot, property valuation, and predictive maintenance in real-time.",
        icon: Zap,
      },
      {
        title: "Compare Plans",
        description:
          "See which features are available on each plan as you explore.",
        icon: CheckCircle,
      },
      {
        title: "Custom Demo",
        description:
          "Request a personalized demo tailored to your portfolio size and needs.",
        icon: Users,
      },
    ]}
  />
);

export const PricingCalculatorPage: React.FC = () => (
  <FeaturePageLayout
    title="Pricing Calculator"
    metaDescription="Calculate the exact cost of RealEstate AI for your portfolio. Dynamic pricing based on property count and features needed."
    keywords="pricing calculator, property management cost, pricing plans, cost estimator"
    headline="Find Your Perfect Plan"
    subheadline="Calculate the exact cost for your portfolio size. See a breakdown of features, savings, and ROI for each plan."
    ctaText="Start Free Trial"
    features={[
      {
        title: "Dynamic Pricing",
        description:
          "Enter your property count and see pricing update in real-time.",
        icon: Calculator,
      },
      {
        title: "Feature Breakdown",
        description:
          "Detailed comparison of what's included in each plan tier.",
        icon: CheckCircle,
      },
      {
        title: "Cost Estimates",
        description:
          "Monthly and annual pricing with savings highlighted for annual billing.",
        icon: CreditCard,
      },
      {
        title: "ROI Preview",
        description:
          "Estimated time and money savings based on your portfolio size.",
        icon: TrendingUp,
      },
      {
        title: "Custom Quotes",
        description:
          "Request a custom quote for enterprise needs and special requirements.",
        icon: FileText,
      },
      {
        title: "No Hidden Fees",
        description:
          "Transparent pricing with no setup fees, contracts, or surprises.",
        icon: Shield,
      },
    ]}
  />
);

export const FeatureComparisonPage: React.FC = () => (
  <FeaturePageLayout
    title="Feature Comparison"
    metaDescription="Compare RealEstate AI plans side by side. See every feature across Free, Starter, Growth, Professional, and Enterprise."
    keywords="feature comparison, plan comparison, property management features, pricing comparison"
    headline="Compare Plans Side by Side"
    subheadline="Every feature, every plan, laid out clearly so you can choose with confidence."
    features={[
      {
        title: "Plan Details",
        description:
          "Complete feature list for Free, Starter, Growth, Professional, and Enterprise plans.",
        icon: CheckCircle,
      },
      {
        title: "AI Features",
        description:
          "Compare AI capabilities across plans — from basic insights to custom models.",
        icon: Zap,
      },
      {
        title: "Support Levels",
        description:
          "Email, priority, phone, and dedicated support options by plan.",
        icon: MessageSquare,
      },
      {
        title: "Integrations",
        description: "See which integrations are available on each plan tier.",
        icon: Globe,
      },
      {
        title: "Usage Limits",
        description:
          "Property counts, user seats, API calls, and storage limits per plan.",
        icon: BarChart,
      },
      {
        title: "Security",
        description:
          "Compare security features including SSO, audit logs, and compliance certifications.",
        icon: Shield,
      },
    ]}
  />
);

export const ROICalculatorPage: React.FC = () => (
  <FeaturePageLayout
    title="ROI Calculator"
    metaDescription="Calculate your return on investment with RealEstate AI. See how much time and money you'll save on property management."
    keywords="ROI calculator, property management ROI, investment analysis, cost savings calculator"
    headline="Calculate Your Savings"
    subheadline="Enter your portfolio details and see exactly how much time and money RealEstate AI saves you every month."
    ctaText="Start Saving Today"
    features={[
      {
        title: "Time Savings",
        description:
          "Calculate hours saved per week on rent collection, maintenance, and admin tasks.",
        icon: Calendar,
      },
      {
        title: "Cost Reduction",
        description:
          "See projected savings on late payments, vacancy costs, and manual processes.",
        icon: TrendingUp,
      },
      {
        title: "Revenue Impact",
        description:
          "Estimate additional revenue from faster leasing, better retention, and fewer vacancies.",
        icon: BarChart,
      },
      {
        title: "Investment Analysis",
        description:
          "Compare your current costs vs RealEstate AI for a clear ROI picture.",
        icon: PieChart,
      },
      {
        title: "Custom Scenarios",
        description: "Model different portfolio sizes and growth scenarios.",
        icon: Calculator,
      },
      {
        title: "Shareable Report",
        description:
          "Generate a PDF ROI report to share with partners and stakeholders.",
        icon: FileText,
      },
    ]}
  />
);

export const CheckoutPage: React.FC = () => (
  <FeaturePageLayout
    title="Checkout"
    metaDescription="Complete your RealEstate AI subscription. Secure checkout with Stripe, multiple payment options, and instant access."
    keywords="checkout, subscribe, payment, RealEstate AI subscription"
    headline="Complete Your Subscription"
    subheadline="You're one step away from smarter property management. Secure checkout powered by Stripe."
    ctaText="Complete Purchase"
    features={[
      {
        title: "Secure Payment",
        description:
          "Enterprise-grade encryption and PCI-compliant payment processing via Stripe.",
        icon: Shield,
      },
      {
        title: "Multiple Methods",
        description:
          "Pay with credit card, debit card, or bank transfer. Apple Pay and Google Pay supported.",
        icon: CreditCard,
      },
      {
        title: "Instant Access",
        description:
          "Get immediate access to your dashboard and start managing properties right away.",
        icon: Zap,
      },
      {
        title: "Flexible Billing",
        description:
          "Choose monthly or annual billing. Save 20% with annual plans.",
        icon: Calculator,
      },
      {
        title: "Money-Back Guarantee",
        description:
          "30-day money-back guarantee if RealEstate AI isn't right for you.",
        icon: CheckCircle,
      },
      {
        title: "Order Confirmation",
        description:
          "Instant email confirmation with receipt and getting-started guide.",
        icon: FileText,
      },
    ]}
  />
);
