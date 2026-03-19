import React, { Component, ErrorInfo, ReactNode, Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Layout } from "./components/layout";
import { ProfileSetup } from "./modules/auth/components/ProfileSetup";
import { useAuth } from "./modules/auth/hooks/useAuth";
import { store } from "./store";

// Lazy-loaded page components (individual file imports for true code splitting)
const HomePage = React.lazy(() =>
  import("./pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const AboutPage = React.lazy(() =>
  import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const ContactPage = React.lazy(() =>
  import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);
const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const InspectionsPage = React.lazy(() => import("./pages/InspectionsPage"));
const ApplicationsPage = React.lazy(() => import("./pages/ApplicationsPage"));
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const AdminUsersPage = React.lazy(() => import("./pages/Admin/UsersPage"));
const AdminPropertiesPage = React.lazy(
  () => import("./pages/Admin/PropertiesPage"),
);
const AdminSettingsPage = React.lazy(
  () => import("./pages/Admin/SettingsPage"),
);
const PropertiesPage = React.lazy(() =>
  import("./pages/PropertiesPage").then((m) => ({ default: m.PropertiesPage })),
);
const TenantPortalPage = React.lazy(() =>
  import("./pages/TenantPortalPage").then((m) => ({
    default: m.TenantPortalPage,
  })),
);
const LandlordPortalPage = React.lazy(() =>
  import("./pages/LandlordPortalPage").then((m) => ({
    default: m.LandlordPortalPage,
  })),
);
const DeveloperPortalPage = React.lazy(() =>
  import("./pages/DeveloperPortalPage").then((m) => ({
    default: m.DeveloperPortalPage,
  })),
);
const MaintenanceRequestPage = React.lazy(() =>
  import("./pages/MaintenanceRequestPage").then((m) => ({
    default: m.MaintenanceRequestPage,
  })),
);
const LeaseManagementPage = React.lazy(() =>
  import("./pages/LeaseManagementPage").then((m) => ({
    default: m.LeaseManagementPage,
  })),
);
const PaymentCollectionPage = React.lazy(() =>
  import("./pages/PaymentCollectionPage").then((m) => ({
    default: m.PaymentCollectionPage,
  })),
);
const ReportingDashboardPage = React.lazy(() =>
  import("./pages/ReportingDashboardPage").then((m) => ({
    default: m.ReportingDashboardPage,
  })),
);
const OnboardingPage = React.lazy(
  () => import("./modules/onboarding/pages/OnboardingPage"),
);
const CommunicationPage = React.lazy(() =>
  import("./modules/communication/pages/CommunicationPage").then((m) => ({
    default: m.CommunicationPage,
  })),
);
const AccountingDashboardPage = React.lazy(() =>
  import("./modules/accounting/pages/AccountingDashboard").then((m) => ({
    default: m.AccountingDashboard,
  })),
);

// Lazy-loaded landing pages
const SmallLandlordsPage = React.lazy(() =>
  import("./pages/landing/SmallLandlordsPage").then((m) => ({
    default: m.SmallLandlordsPage,
  })),
);
const AppFolioAlternativePage = React.lazy(() =>
  import("./pages/landing/AppFolioAlternativePage").then((m) => ({
    default: m.AppFolioAlternativePage,
  })),
);
const AIPropertyManagementPage = React.lazy(() =>
  import("./pages/landing/AIPropertyManagementPage").then((m) => ({
    default: m.AIPropertyManagementPage,
  })),
);
const RentCollectionPage = React.lazy(() =>
  import("./pages/landing/RentCollectionPage").then((m) => ({
    default: m.RentCollectionPage,
  })),
);
const TenantScreeningPage = React.lazy(() =>
  import("./pages/landing/TenantScreeningPage").then((m) => ({
    default: m.TenantScreeningPage,
  })),
);
const PricingComparisonPage = React.lazy(() =>
  import("./pages/landing/PricingComparisonPage").then((m) => ({
    default: m.PricingComparisonPage,
  })),
);
const AutomateManagementPage = React.lazy(() =>
  import("./pages/landing/AutomateManagementPage").then((m) => ({
    default: m.AutomateManagementPage,
  })),
);
const PropertyManagementPage = React.lazy(() =>
  import("./pages/landing/PropertyManagementPage").then((m) => ({
    default: m.PropertyManagementPage,
  })),
);

// Lazy-loaded feature pages
const BookingPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({ default: m.BookingPage })),
);
const GoogleMapsPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({ default: m.GoogleMapsPage })),
);
const LeadGenerationPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({
    default: m.LeadGenerationPage,
  })),
);
const CRMPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({ default: m.CRMPage })),
);
const PropertyValuationPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({
    default: m.PropertyValuationPage,
  })),
);
const MarketAnalysisPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({
    default: m.MarketAnalysisPage,
  })),
);
const PredictiveAnalyticsPage_ = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({
    default: m.PredictiveAnalyticsPage,
  })),
);
const AIChatbotsPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({ default: m.AIChatbotsPage })),
);
const VirtualToursPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({ default: m.VirtualToursPage })),
);
const AutomatedMarketingPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({
    default: m.AutomatedMarketingPage,
  })),
);
const DocumentManagementPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({
    default: m.DocumentManagementPage,
  })),
);
const InteractiveDemoPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({
    default: m.InteractiveDemoPage,
  })),
);
const PricingCalculatorPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({
    default: m.PricingCalculatorPage,
  })),
);
const FeatureComparisonPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({
    default: m.FeatureComparisonPage,
  })),
);
const ROICalculatorPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({
    default: m.ROICalculatorPage,
  })),
);
const CheckoutPage = React.lazy(() =>
  import("./pages/FeaturePages").then((m) => ({ default: m.CheckoutPage })),
);

// Lazy-loaded module pages
const PropertyDetailsPage = React.lazy(() =>
  import("./modules/properties/components/PropertyDetails/PropertyDetailsPage").then(
    (m) => ({ default: m.PropertyDetailsPage }),
  ),
);
const TrialSignupPage = React.lazy(() =>
  import("./modules/trial/pages/TrialSignupPage").then((m) => ({
    default: m.TrialSignupPage,
  })),
);
const SchedulingPage = React.lazy(
  () => import("./modules/scheduling/pages/SchedulingPage"),
);
const WorkflowsPage = React.lazy(() =>
  import("./modules/workflows/pages/WorkflowsPage").then((m) => ({
    default: m.WorkflowsPage,
  })),
);
const GoogleCallbackPage = React.lazy(
  () => import("./pages/GoogleCallbackPage"),
);
const PrivacyPage = React.lazy(() =>
  import("./pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage })),
);
const TermsPage = React.lazy(() =>
  import("./pages/TermsPage").then((m) => ({ default: m.TermsPage })),
);
const CookiePolicyPage = React.lazy(() =>
  import("./pages/CookiePolicyPage").then((m) => ({
    default: m.CookiePolicyPage,
  })),
);

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    import("@sentry/react").then((Sentry) => {
      Sentry.captureException(error, {
        extra: { componentStack: errorInfo.componentStack },
      });
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-[#F0F9FF] p-4"
          role="alert"
        >
          <div className="bg-white rounded-lg shadow-realestate-md p-8 max-w-md w-full text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-space-grotesk font-bold text-realestate-primary mb-2">
              Something went wrong
            </h2>
            <p className="text-realestate-secondary mb-6">
              {this.state.error?.message ||
                "An unexpected error occurred. Please try again."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              className="btn-accent"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const LoadingSpinner: React.FC = () => (
  <div
    className="min-h-screen flex items-center justify-center bg-[#F0F9FF]"
    role="status"
    aria-label="Loading"
  >
    <div className="text-center">
      <div
        className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-realestate-accent mx-auto mb-4"
        aria-hidden="true"
      />
      <p className="text-realestate-secondary font-medium text-sm">
        Loading...
      </p>
    </div>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/login" replace />
  );
};

const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-realestate-accent focus:font-medium"
      >
        Skip to main content
      </a>
      <div id="main-content">
        <Routes>
          {/* Public Routes with Layout (Navbar + Footer) */}
          <Route
            path="/"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <HomePage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/properties"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <PropertiesPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <PropertyDetailsPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/pricing"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <PricingPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <AboutPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <ContactPage />
                </Suspense>
              </Layout>
            }
          />

          {/* Auth Routes (no Layout - custom design) */}
          <Route
            path="/auth/login"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AuthPage />
              </Suspense>
            }
          />
          <Route
            path="/auth/register"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AuthPage />
              </Suspense>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AuthPage />
              </Suspense>
            }
          />
          <Route
            path="/auth/google/callback"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <GoogleCallbackPage />
              </Suspense>
            }
          />
          <Route
            path="/trial/signup"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <TrialSignupPage />
              </Suspense>
            }
          />

          {/* Legacy auth routes - redirect */}
          <Route
            path="/login"
            element={<Navigate to="/auth/login" replace />}
          />
          <Route
            path="/register"
            element={<Navigate to="/auth/register" replace />}
          />
          <Route
            path="/forgot-password"
            element={<Navigate to="/auth/forgot-password" replace />}
          />

          {/* SEO Landing Pages with Layout */}
          <Route
            path="/landing/small-landlords"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <SmallLandlordsPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/appfolio-alternative"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <AppFolioAlternativePage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/ai-property-management"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <AIPropertyManagementPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/rent-collection"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <RentCollectionPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/tenant-screening"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <TenantScreeningPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/pricing-comparison"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <PricingComparisonPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/automate-management"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <AutomateManagementPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/property-management"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <PropertyManagementPage />
                </Suspense>
              </Layout>
            }
          />

          {/* Legal Pages with Layout */}
          <Route
            path="/privacy"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <PrivacyPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/terms"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <TermsPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/cookies"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <CookiePolicyPage />
                </Suspense>
              </Layout>
            }
          />

          {/* Onboarding Route (protected, no Layout - custom design) */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <OnboardingPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes (own layout - dashboard style) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <DashboardPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inspections"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <InspectionsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ApplicationsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ApplicationsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminUsersPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/properties"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminPropertiesPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminSettingsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4">
                  <ProfileSetup
                    onComplete={() => (window.location.href = "/dashboard")}
                  />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Portal Routes (protected, dashboard style) */}
          <Route
            path="/tenant-portal"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <TenantPortalPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord-portal"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <LandlordPortalPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer-portal"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <DeveloperPortalPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <MaintenanceRequestPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leases"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <LeaseManagementPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <PaymentCollectionPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/communication"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <CommunicationPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reporting"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ReportingDashboardPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/accounting"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <AccountingDashboardPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/scheduling"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <SchedulingPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflows"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <WorkflowsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Feature Pages with Layout */}
          <Route
            path="/booking"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <BookingPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/google-maps"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <GoogleMapsPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/lead-generation"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <LeadGenerationPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/crm"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <CRMPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/property-valuation"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <PropertyValuationPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/market-analysis"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <MarketAnalysisPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/predictive-analytics"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <PredictiveAnalyticsPage_ />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/ai-chatbots"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <AIChatbotsPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/virtual-tours"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <VirtualToursPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/automated-marketing"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <AutomatedMarketingPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/document-management"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <DocumentManagementPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/interactive-demo"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <InteractiveDemoPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/pricing-calculator"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <PricingCalculatorPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/feature-comparison"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <FeatureComparisonPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/roi-calculator"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <ROICalculatorPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/checkout"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <CheckoutPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/property-listings"
            element={<Navigate to="/properties" replace />}
          />
          <Route
            path="/onboarding-wizard"
            element={<Navigate to="/onboarding" replace />}
          />

          {/* SEO-friendly root-level landing page routes */}
          <Route
            path="/property-management-software"
            element={<Navigate to="/landing/property-management" replace />}
          />
          <Route
            path="/landlord-software"
            element={<Navigate to="/landing/small-landlords" replace />}
          />
          <Route
            path="/rent-collection-app"
            element={<Navigate to="/landing/rent-collection" replace />}
          />
          <Route
            path="/tenant-screening-software"
            element={<Navigate to="/landing/tenant-screening" replace />}
          />
          <Route
            path="/property-management-ai"
            element={<Navigate to="/landing/ai-property-management" replace />}
          />
          <Route
            path="/small-landlords"
            element={<Navigate to="/landing/small-landlords" replace />}
          />
          <Route
            path="/appfolio-alternative"
            element={<Navigate to="/landing/appfolio-alternative" replace />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
