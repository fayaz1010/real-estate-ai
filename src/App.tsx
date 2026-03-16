// FILE PATH: src/App.tsx
// Main Application Component - Premium Design

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';
import { useAuth } from './modules/auth/hooks/useAuth';
import { LoginForm } from './modules/auth/components/LoginForm';
import { RegisterForm } from './modules/auth/components/RegisterForm';
import { ForgotPassword } from './modules/auth/components/ForgotPassword';
import { ProfileSetup } from './modules/auth/components/ProfileSetup';
import { PropertyListings } from './components/PropertyListings';
import { PropertyDetailsPage } from './modules/properties/components/PropertyDetails/PropertyDetailsPage';

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
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
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 w-full">
        {currentView === 'login' && (
          <LoginForm
            onSuccess={() => window.location.href = '/dashboard'}
            onForgotPassword={() => setCurrentView('forgot')}
            onRegister={() => setCurrentView('register')}
          />
        )}
        {currentView === 'register' && (
          <RegisterForm
            onSuccess={() => window.location.href = '/profile-setup'}
            onLogin={() => setCurrentView('login')}
          />
        )}
        {currentView === 'forgot' && (
          <ForgotPassword
            onBack={() => setCurrentView('login')}
          />
        )}
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PropManage
              </h1>
            </div>
            <div className="flex items-center gap-4">
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
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600 mb-8">
            Welcome to your dashboard! More features coming soon...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm">
              <h3 className="font-semibold text-blue-900 mb-2">Properties</h3>
              <p className="text-4xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm">
              <h3 className="font-semibold text-green-900 mb-2">Applications</h3>
              <p className="text-4xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-sm">
              <h3 className="font-semibold text-purple-900 mb-2">Active Leases</h3>
              <p className="text-4xl font-bold text-purple-600">0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Public Properties Page with Navigation
const PublicPropertiesPage: React.FC = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PropManage
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a href="/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Sign In
              </a>
              <a href="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-sm">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Property Listings Component */}
      <PropertyListings />
    </div>
  );
};

// App Content (Routes)
const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
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
                <ProfileSetup onComplete={() => window.location.href = '/dashboard'} />
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
    </BrowserRouter>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
