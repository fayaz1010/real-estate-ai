
// ============================================================================
// EXAMPLE USAGE & API INTEGRATION GUIDE
// ============================================================================

/*
=============================================================================
BACKEND API ENDPOINTS REQUIRED
=============================================================================

POST   /api/auth/register
Body: { email, password, firstName, lastName, phone?, role, acceptedTerms }
Returns: { user: User, tokens: { accessToken, refreshToken, expiresIn } }

POST   /api/auth/login
Body: { email, password, rememberMe? }
Returns: { user: User, tokens: { accessToken, refreshToken, expiresIn } }

POST   /api/auth/logout
Headers: Authorization: Bearer {token}
Returns: { success: true }

POST   /api/auth/refresh
Body: { refreshToken }
Returns: { accessToken, refreshToken, expiresIn }

GET    /api/auth/me
Headers: Authorization: Bearer {token}
Returns: User

POST   /api/auth/password-reset-request
Body: { email }
Returns: { success: true }

POST   /api/auth/password-reset-confirm
Body: { token, newPassword }
Returns: { success: true }

POST   /api/auth/verify-email
Body: { token }
Returns: { success: true }

POST   /api/auth/resend-verification
Headers: Authorization: Bearer {token}
Returns: { success: true }

POST   /api/auth/2fa/enable
Headers: Authorization: Bearer {token}
Returns: { qrCode: string, secret: string }

POST   /api/auth/2fa/verify
Headers: Authorization: Bearer {token}
Body: { code }
Returns: { success: true }

POST   /api/auth/2fa/disable
Headers: Authorization: Bearer {token}
Body: { code }
Returns: { success: true }

PATCH  /api/users/profile
Headers: Authorization: Bearer {token}
Body: Partial<User>
Returns: User

POST   /api/users/avatar
Headers: Authorization: Bearer {token}
Body: FormData with 'avatar' file
Returns: { avatarUrl: string }

POST   /api/users/change-password
Headers: Authorization: Bearer {token}
Body: { currentPassword, newPassword }
Returns: { success: true }

DELETE /api/users/account
Headers: Authorization: Bearer {token}
Body: { password }
Returns: { success: true }

=============================================================================
DATABASE SCHEMA (PostgreSQL)
=============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    avatar TEXT,
    status VARCHAR(50) DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    profile_completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE landlord_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    business_registration VARCHAR(100),
    tax_id VARCHAR(50),
    bank_account_verified BOOLEAN DEFAULT FALSE,
    properties_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    verification_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employment_status VARCHAR(100),
    annual_income DECIMAL(12,2),
    credit_score INTEGER,
    move_in_date DATE,
    has_pets BOOLEAN DEFAULT FALSE,
    number_of_occupants INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) NOT NULL,
    license_state VARCHAR(2) NOT NULL,
    brokerage_name VARCHAR(255) NOT NULL,
    years_of_experience INTEGER,
    specializations TEXT[],
    rating DECIMAL(3,2),
    verification_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rental_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_profile_id UUID REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    landlord_name VARCHAR(255),
    landlord_contact VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

=============================================================================
REDUX STORE SETUP
=============================================================================

// FILE: src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../modules/auth/store/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Other module reducers will be added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

=============================================================================
APP ENTRY POINT SETUP
=============================================================================

// FILE: src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';
import { useAuth } from './modules/auth/hooks/useAuth';
import { LoginForm } from './modules/auth/components/LoginForm';
import { RegisterForm } from './modules/auth/components/RegisterForm';
import { ForgotPassword } from './modules/auth/components/ForgotPassword';
import { ProfileSetup } from './modules/auth/components/ProfileSetup';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Main App Component
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<'login' | 'register' | 'forgot'>('login');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
        } />

        {/* Protected Routes */}
        <Route path="/profile-setup" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <ProfileSetup />
            </div>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 p-4">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome to your dashboard!</p>
            </div>
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;

=============================================================================
BACKEND IMPLEMENTATION EXAMPLE (Node.js + Express + Prisma)
=============================================================================

// FILE: backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { sendVerificationEmail } from '../services/emailService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role, acceptedTerms } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName || !role || !acceptedTerms) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        role,
        status: 'pending_verification'
      }
    });

    // Create role-specific profile
    if (role === 'landlord') {
      await prisma.landlordProfile.create({
        data: { userId: user.id }
      });
    } else if (role === 'tenant') {
      await prisma.tenantProfile.create({
        data: { userId: user.id }
      });
    } else if (role === 'agent') {
      await prisma.agentProfile.create({
        data: {
          userId: user.id,
          licenseNumber: '',
          licenseState: '',
          brokerageName: ''
        }
      });
    }

    // Generate tokens
    const accessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '15m'
    });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    });

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.id);

    // Remove password from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(201).json({
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900 // 15 minutes in seconds
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {// ============================================================================
// MODULE 1.1: USER AUTHENTICATION & MANAGEMENT
// Complete TypeScript Implementation
// ============================================================================