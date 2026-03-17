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
const PredictiveMaintenancePage = React.lazy(
  () => import("./pages/maintenance/predictive"),
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
    void errorInfo;
    void error;
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
                <Suspense fallback={<div>Loading...</div>}>
                  <HomePage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/properties"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PropertiesPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PropertyDetailsPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/pricing"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PricingPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <AboutPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <ContactPage />
                </Suspense>
              </Layout>
            }
          />

          {/* Auth Routes (no Layout - custom design) */}
          <Route
            path="/auth/login"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthPage />
              </Suspense>
            }
          />
          <Route
            path="/auth/register"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthPage />
              </Suspense>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AuthPage />
              </Suspense>
            }
          />
          <Route
            path="/auth/google/callback"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <GoogleCallbackPage />
              </Suspense>
            }
          />
          <Route
            path="/trial/signup"
            element={
              <Suspense fallback={<div>Loading...</div>}>
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
                <Suspense fallback={<div>Loading...</div>}>
                  <SmallLandlordsPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/appfolio-alternative"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <AppFolioAlternativePage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/ai-property-management"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <AIPropertyManagementPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/rent-collection"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <RentCollectionPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/tenant-screening"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <TenantScreeningPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/pricing-comparison"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PricingComparisonPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/automate-management"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <AutomateManagementPage />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="/landing/property-management"
            element={
              <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                  <PropertyManagementPage />
                </Suspense>
              </Layout>
            }
          />

          {/* Onboarding Route (protected, no Layout - custom design) */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
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
                <Suspense fallback={<div>Loading...</div>}>
                  <DashboardPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inspections"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <InspectionsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <ApplicationsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <ApplicationsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <AdminPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <AdminUsersPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/properties"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <AdminPropertiesPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
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
                <Suspense fallback={<div>Loading...</div>}>
                  <TenantPortalPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord-portal"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <LandlordPortalPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer-portal"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <DeveloperPortalPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <MaintenanceRequestPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leases"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <LeaseManagementPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <PaymentCollectionPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/communication"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <CommunicationPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reporting"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <ReportingDashboardPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/accounting"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <AccountingDashboardPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/scheduling"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <SchedulingPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflows"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <WorkflowsPage />
                </Suspense>
              </ProtectedRoute>
            }
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
