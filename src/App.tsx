import React, { Component, ErrorInfo, ReactNode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Layout } from "./components/layout";
import { useAuth } from "./modules/auth/hooks/useAuth";
import { ProfileSetup } from "./modules/auth/components/ProfileSetup";
import { PropertyDetailsPage } from "./modules/properties/components/PropertyDetails/PropertyDetailsPage";
import {
  HomePage,
  PricingPage,
  AboutPage,
  ContactPage,
  AuthPage,
  DashboardPage,
  InspectionsPage,
  ApplicationsPage,
  AdminPage,
  PropertiesPage,
  TenantPortalPage,
  LandlordPortalPage,
  DeveloperPortalPage,
  MaintenanceRequestPage,
  LeaseManagementPage,
  PaymentCollectionPage,
  PredictiveMaintenancePage,
} from "./pages";
import {
  SmallLandlordsPage,
  AppFolioAlternativePage,
  AIPropertyManagementPage,
  RentCollectionPage,
  TenantScreeningPage,
  PricingComparisonPage,
  AutomateManagementPage,
} from "./pages/landing";
import { store } from "./store";

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

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" replace />;
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
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/properties"
            element={
              <Layout>
                <PropertiesPage />
              </Layout>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <Layout>
                <PropertyDetailsPage />
              </Layout>
            }
          />
          <Route
            path="/pricing"
            element={
              <Layout>
                <PricingPage />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <ContactPage />
              </Layout>
            }
          />

          {/* Auth Routes (no Layout - custom design) */}
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/auth/register" element={<AuthPage />} />
          <Route path="/auth/forgot-password" element={<AuthPage />} />

          {/* Legacy auth routes - redirect */}
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />
          <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />

          {/* SEO Landing Pages with Layout */}
          <Route
            path="/landing/small-landlords"
            element={
              <Layout>
                <SmallLandlordsPage />
              </Layout>
            }
          />
          <Route
            path="/landing/appfolio-alternative"
            element={
              <Layout>
                <AppFolioAlternativePage />
              </Layout>
            }
          />
          <Route
            path="/landing/ai-property-management"
            element={
              <Layout>
                <AIPropertyManagementPage />
              </Layout>
            }
          />
          <Route
            path="/landing/rent-collection"
            element={
              <Layout>
                <RentCollectionPage />
              </Layout>
            }
          />
          <Route
            path="/landing/tenant-screening"
            element={
              <Layout>
                <TenantScreeningPage />
              </Layout>
            }
          />
          <Route
            path="/landing/pricing-comparison"
            element={
              <Layout>
                <PricingComparisonPage />
              </Layout>
            }
          />
          <Route
            path="/landing/automate-management"
            element={
              <Layout>
                <AutomateManagementPage />
              </Layout>
            }
          />

          {/* Protected Routes (own layout - dashboard style) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inspections"
            element={
              <ProtectedRoute>
                <InspectionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <ProtectedRoute>
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
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
                <TenantPortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord-portal"
            element={
              <ProtectedRoute>
                <LandlordPortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer-portal"
            element={
              <ProtectedRoute>
                <DeveloperPortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <MaintenanceRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leases"
            element={
              <ProtectedRoute>
                <LeaseManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentCollectionPage />
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
