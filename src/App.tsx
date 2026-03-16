// FILE PATH: src/App.tsx
// Main Application Component - Premium Design

import { Menu, X, Home, FileText, Calendar, TrendingUp } from "lucide-react";
import React, {
  useState,
  useEffect,
  useCallback,
  Component,
  ErrorInfo,
  ReactNode,
} from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { PropertyListings } from "./components/PropertyListings";
import { ForgotPassword } from "./modules/auth/components/ForgotPassword";
import { LoginForm } from "./modules/auth/components/LoginForm";
import { ProfileSetup } from "./modules/auth/components/ProfileSetup";
import { RegisterForm } from "./modules/auth/components/RegisterForm";
import { useAuth } from "./modules/auth/hooks/useAuth";
import { tokenManager } from "./modules/auth/utils/tokenManager";
import { PropertyDetailsPage } from "./modules/properties/components/PropertyDetails/PropertyDetailsPage";
import { store } from "./store";

// Error Boundary Component
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
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
          role="alert"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100">
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message ||
                "An unexpected error occurred. Please try again."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-sm"
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

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50"
    role="status"
    aria-label="Loading"
  >
    <div className="text-center">
      <div
        className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"
        aria-hidden="true"
      ></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Auth Pages Component with Premium Background
const AuthPages: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "login" | "register" | "forgot"
  >("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <main className="relative z-10 w-full" role="main">
        {currentView === "login" && (
          <LoginForm
            onSuccess={() => (window.location.href = "/dashboard")}
            onForgotPassword={() => setCurrentView("forgot")}
            onRegister={() => setCurrentView("register")}
          />
        )}
        {currentView === "register" && (
          <RegisterForm
            onSuccess={() => (window.location.href = "/profile-setup")}
            onLogin={() => setCurrentView("login")}
          />
        )}
        {currentView === "forgot" && (
          <ForgotPassword onBack={() => setCurrentView("login")} />
        )}
      </main>
    </div>
  );
};

// Dashboard data interface
interface DashboardData {
  stats: {
    properties: number;
    applications: number;
    activeInspections: number;
  };
  recentProperties: Array<{
    id: string;
    title: string;
    status: string;
    price: number;
    createdAt: string;
  }>;
  recentApplications: Array<{
    id: string;
    status: string;
    property: { title: string };
    createdAt: string;
  }>;
  upcomingInspections: Array<{
    id: string;
    scheduledDate: string;
    property: { title: string; address: Record<string, unknown> };
  }>;
}

// Dashboard Component with real API data
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoadingData, setIsLoadingData] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4041/api";

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch(`${API_BASE_URL}/auth/dashboard`, {
        headers: tokenManager.getAuthHeader(),
      });
      if (response.ok) {
        const result = await response.json();
        setDashboardData(result.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const stats = dashboardData?.stats || {
    properties: 0,
    applications: 0,
    activeInspections: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav
        className="bg-white shadow-sm border-b border-gray-200"
        role="navigation"
        aria-label="Dashboard navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PropManage
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="text-gray-700 font-medium">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all font-medium shadow-sm"
              >
                Logout
              </button>
            </div>
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-controls="dashboard-mobile-menu"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div
            id="dashboard-mobile-menu"
            className="md:hidden border-t border-gray-200 bg-white"
            role="menu"
          >
            <div className="px-4 py-3 space-y-3">
              <p className="text-gray-700 font-medium" role="menuitem">
                Welcome, {user?.firstName} {user?.lastName}
              </p>
              <button
                onClick={handleLogout}
                className="w-full text-left bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all font-medium shadow-sm"
                role="menuitem"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {/* Stats Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          role="list"
          aria-label="Dashboard statistics"
        >
          <div
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            role="listitem"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {isLoadingData ? "..." : stats.properties}
            </p>
            <p className="text-sm text-gray-500 mt-1">Properties</p>
          </div>
          <div
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            role="listitem"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {isLoadingData ? "..." : stats.applications}
            </p>
            <p className="text-sm text-gray-500 mt-1">Applications</p>
          </div>
          <div
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            role="listitem"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {isLoadingData ? "..." : stats.activeInspections}
            </p>
            <p className="text-sm text-gray-500 mt-1">Upcoming Inspections</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Properties */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Properties
            </h3>
            {isLoadingData ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg" />
                ))}
              </div>
            ) : dashboardData?.recentProperties &&
              dashboardData.recentProperties.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{prop.title}</p>
                      <p className="text-sm text-gray-500">
                        ${prop.price.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prop.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : prop.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {prop.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No properties yet
              </p>
            )}
          </div>

          {/* Upcoming Inspections */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Inspections
            </h3>
            {isLoadingData ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg" />
                ))}
              </div>
            ) : dashboardData?.upcomingInspections &&
              dashboardData.upcomingInspections.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.upcomingInspections.map((insp) => (
                  <div
                    key={insp.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {insp.property.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(insp.scheduledDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No upcoming inspections
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Public Properties Page with Navigation
const PublicPropertiesPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* Navigation Bar */}
      <nav
        className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                aria-label="PropManage home"
              >
                PropManage
              </a>
            </div>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-sm"
              >
                Get Started
              </a>
            </div>
            {/* Mobile hamburger */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-controls="public-mobile-menu"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div
            id="public-mobile-menu"
            className="md:hidden border-t border-gray-200 bg-white"
            role="menu"
          >
            <div className="px-4 py-3 space-y-2">
              <a
                href="/login"
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                role="menuitem"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="block px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-center"
                role="menuitem"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Property Listings Component */}
      <main role="main">
        <PropertyListings />
      </main>
    </div>
  );
};

// App Content (Routes)
const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-blue-600 focus:font-medium"
      >
        Skip to main content
      </a>
      <div id="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicPropertiesPage />} />
          <Route path="/properties" element={<PublicPropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/login" element={<AuthPages />} />
          <Route path="/register" element={<AuthPages />} />
          <Route path="/forgot-password" element={<AuthPages />} />

          {/* Protected Routes */}
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                  <ProfileSetup
                    onComplete={() => (window.location.href = "/dashboard")}
                  />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

// Main App Component
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
