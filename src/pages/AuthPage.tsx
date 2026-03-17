import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Home,
  User as UserIcon,
  Shield,
  BarChart,
  Building,
  ArrowRight,
  Zap,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../modules/auth/hooks/useAuth";
import { UserRole } from "../modules/auth/types/auth.types";
import { validators } from "../modules/auth/utils/validation";

type AuthTab = "login" | "register";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormData {
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] =
  [
    {
      value: UserRole.LANDLORD,
      label: "Landlord",
      description: "List and manage your rental properties",
    },
    {
      value: UserRole.TENANT,
      label: "Tenant",
      description: "Find and apply for rental homes",
    },
    {
      value: UserRole.AGENT,
      label: "Agent",
      description: "Connect buyers, sellers, and renters",
    },
  ];

const PLATFORM_BENEFITS = [
  {
    icon: <BarChart size={20} className="text-realestate-accent" />,
    title: "AI-Powered Insights",
    description:
      "Get data-driven property valuations and market analysis powered by advanced AI.",
  },
  {
    icon: <Shield size={20} className="text-realestate-accent" />,
    title: "Secure Transactions",
    description:
      "End-to-end encrypted payments and document handling to protect every deal.",
  },
  {
    icon: <Zap size={20} className="text-realestate-accent" />,
    title: "Streamlined Workflows",
    description:
      "Automate lease management, rent collection, and maintenance requests.",
  },
];

const AuthPage: React.FC = () => {
  const location = useLocation();
  const { login, register, isLoading, error, clearError } = useAuth();

  const getInitialTab = (): AuthTab => {
    if (
      location.pathname.includes("/auth/register") ||
      location.pathname.includes("/register")
    ) {
      return "register";
    }
    return "login";
  };

  const [activeTab, setActiveTab] = useState<AuthTab>(getInitialTab);

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    role: UserRole.TENANT,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    clearError();
    setValidationErrors({});
  }, [activeTab, clearError]);

  useEffect(() => {
    setActiveTab(getInitialTab());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleTabSwitch = (tab: AuthTab) => {
    setActiveTab(tab);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ---------- Login ----------

  const validateLogin = (): boolean => {
    const errors: Record<string, string> = {};
    if (!validators.email(loginData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!loginData.password) {
      errors.password = "Password is required";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    try {
      await login({
        email: loginData.email,
        password: loginData.password,
        rememberMe: loginData.rememberMe,
      });
    } catch {
      // handled by Redux
    }
  };

  const handleLoginChange = (
    field: keyof LoginFormData,
    value: string | boolean,
  ) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ---------- Register ----------

  const validateRegister = (): boolean => {
    const errors: Record<string, string> = {};

    if (!validators.name(registerData.firstName)) {
      errors.firstName = "First name must be 2-50 characters";
    }
    if (!validators.name(registerData.lastName)) {
      errors.lastName = "Last name must be 2-50 characters";
    }
    if (!validators.email(registerData.email)) {
      errors.email = "Please enter a valid email address";
    }
    const pwResult = validators.password(registerData.password);
    if (!pwResult.valid) {
      errors.password = pwResult.errors[0];
    }
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!registerData.acceptedTerms) {
      errors.terms = "You must accept the terms and conditions";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    try {
      await register({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        role: registerData.role,
        acceptedTerms: registerData.acceptedTerms,
      });
    } catch {
      // handled by Redux
    }
  };

  const handleRegisterChange = (
    field: keyof RegisterFormData,
    value: string | boolean | UserRole,
  ) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const passwordStrength = validators.getPasswordStrength(
    registerData.password,
  );
  const strengthConfig = {
    weak: { color: "bg-red-500", width: "33%", label: "Weak" },
    medium: { color: "bg-yellow-500", width: "66%", label: "Medium" },
    strong: { color: "bg-emerald-500", width: "100%", label: "Strong" },
  };

  const handleGoogleOAuth = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId) {
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scope = "openid email profile";
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F0F9FF]">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] bg-realestate-primary relative overflow-hidden flex-col">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 -left-10 w-72 h-72 border border-white/20 rounded-full" />
          <div className="absolute bottom-32 -right-16 w-96 h-96 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-white/10 rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col h-full px-10 xl:px-14 py-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-realestate-accent rounded-xl flex items-center justify-center">
              <Home size={22} className="text-realestate-primary" />
            </div>
            <span className="text-xl font-bold font-space-grotesk text-white">
              RealEstate AI
            </span>
          </Link>

          {/* Tagline */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl xl:text-4xl font-bold font-space-grotesk text-white leading-tight mb-4">
              Property Management,
              <br />
              <span className="text-realestate-accent">
                Powered by Intelligence
              </span>
            </h2>
            <p className="text-white/60 font-inter text-base mb-10 max-w-sm">
              Join thousands of property professionals who trust our platform to
              manage, analyze, and grow their portfolios.
            </p>

            {/* Benefit Points */}
            <div className="space-y-6">
              {PLATFORM_BENEFITS.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold font-space-grotesk text-sm mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-white/50 font-inter text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-realestate-accent" />
                <span className="text-white/70 text-sm font-inter">
                  12,000+ Users
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Building size={16} className="text-realestate-accent" />
                <span className="text-white/70 text-sm font-inter">
                  3,200+ Properties
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-realestate-accent" />
                <span className="text-white/70 text-sm font-inter">
                  256-bit SSL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Forms */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-realestate-accent rounded-xl flex items-center justify-center">
                <Home size={22} className="text-realestate-primary" />
              </div>
              <span className="text-xl font-bold font-space-grotesk text-realestate-primary">
                RealEstate AI
              </span>
            </Link>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-white rounded-xl p-1 shadow-realestate-sm mb-8">
            <button
              type="button"
              onClick={() => handleTabSwitch("login")}
              className={`flex-1 py-3 text-sm font-semibold font-inter rounded-lg transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-realestate-primary text-white shadow-realestate-sm"
                  : "text-realestate-secondary hover:text-realestate-primary"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("register")}
              className={`flex-1 py-3 text-sm font-semibold font-inter rounded-lg transition-all duration-200 ${
                activeTab === "register"
                  ? "bg-realestate-primary text-white shadow-realestate-sm"
                  : "text-realestate-secondary hover:text-realestate-primary"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-slide-up">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-700 font-inter">{error}</span>
            </div>
          )}

          {/* ===================== LOGIN FORM ===================== */}
          {activeTab === "login" && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-space-grotesk text-realestate-primary">
                  Welcome back
                </h2>
                <p className="text-realestate-secondary font-inter text-sm mt-1">
                  Sign in to access your dashboard
                </p>
              </div>

              <form
                onSubmit={handleLoginSubmit}
                className="space-y-5"
                noValidate
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-medium text-realestate-primary mb-1.5 font-inter"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-realestate-secondary"
                    />
                    <input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) =>
                        handleLoginChange("email", e.target.value)
                      }
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-inter focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors.email
                          ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                          : "border-gray-200 focus:ring-realestate-accent/30 focus:border-realestate-accent"
                      }`}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 font-inter">
                      <AlertCircle size={14} />
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-realestate-primary mb-1.5 font-inter"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-realestate-secondary"
                    />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) =>
                        handleLoginChange("password", e.target.value)
                      }
                      className={`w-full pl-11 pr-11 py-3 border rounded-xl text-sm font-inter focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors.password
                          ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                          : "border-gray-200 focus:ring-realestate-accent/30 focus:border-realestate-accent"
                      }`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-realestate-secondary hover:text-realestate-primary transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 font-inter">
                      <AlertCircle size={14} />
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label
                    className="flex items-center gap-2 cursor-pointer"
                    htmlFor="remember-me"
                  >
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) =>
                        handleLoginChange("rememberMe", e.target.checked)
                      }
                      className="w-4 h-4 text-realestate-accent border-gray-300 rounded focus:ring-2 focus:ring-realestate-accent/50 cursor-pointer"
                    />
                    <span className="text-sm text-realestate-secondary font-inter">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-medium text-realestate-accent hover:text-amber-600 transition-colors font-inter"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-realestate-secondary font-inter uppercase tracking-wide">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google OAuth */}
              <button
                type="button"
                onClick={handleGoogleOAuth}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-realestate-primary py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium font-inter shadow-realestate-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Switch to Register */}
              <p className="mt-8 text-center text-sm text-realestate-secondary font-inter">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("register")}
                  className="font-semibold text-realestate-accent hover:text-amber-600 transition-colors"
                >
                  Create one free
                </button>
              </p>
            </div>
          )}

          {/* ===================== REGISTER FORM ===================== */}
          {activeTab === "register" && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-space-grotesk text-realestate-primary">
                  Create your account
                </h2>
                <p className="text-realestate-secondary font-inter text-sm mt-1">
                  Start managing properties smarter today
                </p>
              </div>

              <form
                onSubmit={handleRegisterSubmit}
                className="space-y-5"
                noValidate
              >
                {/* Role Selector */}
                <div>
                  <label className="block text-sm font-medium text-realestate-primary mb-2 font-inter">
                    I am a...
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLE_OPTIONS.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleRegisterChange("role", role.value)}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                          registerData.role === role.value
                            ? "border-realestate-accent bg-amber-50 shadow-realestate-sm"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                        aria-pressed={registerData.role === role.value}
                      >
                        <p
                          className={`text-sm font-semibold font-inter ${
                            registerData.role === role.value
                              ? "text-realestate-primary"
                              : "text-realestate-secondary"
                          }`}
                        >
                          {role.label}
                        </p>
                        <p className="text-xs text-realestate-secondary/70 mt-0.5 font-inter hidden sm:block">
                          {role.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reg-first-name"
                      className="block text-sm font-medium text-realestate-primary mb-1.5 font-inter"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <UserIcon
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-realestate-secondary"
                      />
                      <input
                        id="reg-first-name"
                        type="text"
                        value={registerData.firstName}
                        onChange={(e) =>
                          handleRegisterChange("firstName", e.target.value)
                        }
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-inter focus:outline-none focus:ring-2 transition-colors ${
                          validationErrors.firstName
                            ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                            : "border-gray-200 focus:ring-realestate-accent/30 focus:border-realestate-accent"
                        }`}
                        placeholder="John"
                        autoComplete="given-name"
                      />
                    </div>
                    {validationErrors.firstName && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-inter">
                        <AlertCircle size={12} />
                        {validationErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="reg-last-name"
                      className="block text-sm font-medium text-realestate-primary mb-1.5 font-inter"
                    >
                      Last Name
                    </label>
                    <input
                      id="reg-last-name"
                      type="text"
                      value={registerData.lastName}
                      onChange={(e) =>
                        handleRegisterChange("lastName", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl text-sm font-inter focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors.lastName
                          ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                          : "border-gray-200 focus:ring-realestate-accent/30 focus:border-realestate-accent"
                      }`}
                      placeholder="Doe"
                      autoComplete="family-name"
                    />
                    {validationErrors.lastName && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-inter">
                        <AlertCircle size={12} />
                        {validationErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-sm font-medium text-realestate-primary mb-1.5 font-inter"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-realestate-secondary"
                    />
                    <input
                      id="reg-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) =>
                        handleRegisterChange("email", e.target.value)
                      }
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-inter focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors.email
                          ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                          : "border-gray-200 focus:ring-realestate-accent/30 focus:border-realestate-accent"
                      }`}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 font-inter">
                      <AlertCircle size={14} />
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-sm font-medium text-realestate-primary mb-1.5 font-inter"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-realestate-secondary"
                    />
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) =>
                        handleRegisterChange("password", e.target.value)
                      }
                      className={`w-full pl-11 pr-11 py-3 border rounded-xl text-sm font-inter focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors.password
                          ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                          : "border-gray-200 focus:ring-realestate-accent/30 focus:border-realestate-accent"
                      }`}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-realestate-secondary hover:text-realestate-primary transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {registerData.password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strengthConfig[passwordStrength].color}`}
                          style={{
                            width: strengthConfig[passwordStrength].width,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-realestate-secondary font-inter">
                        {strengthConfig[passwordStrength].label}
                      </span>
                    </div>
                  )}
                  {validationErrors.password && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 font-inter">
                      <AlertCircle size={14} />
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="reg-confirm-password"
                    className="block text-sm font-medium text-realestate-primary mb-1.5 font-inter"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-realestate-secondary"
                    />
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        handleRegisterChange("confirmPassword", e.target.value)
                      }
                      className={`w-full pl-11 pr-11 py-3 border rounded-xl text-sm font-inter focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors.confirmPassword
                          ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                          : "border-gray-200 focus:ring-realestate-accent/30 focus:border-realestate-accent"
                      }`}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-realestate-secondary hover:text-realestate-primary transition-colors"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {registerData.confirmPassword &&
                    registerData.password === registerData.confirmPassword && (
                      <p className="mt-1.5 text-sm text-emerald-600 flex items-center gap-1 font-inter">
                        <CheckCircle size={14} />
                        Passwords match
                      </p>
                    )}
                  {validationErrors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 font-inter">
                      <AlertCircle size={14} />
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div>
                  <label
                    className="flex items-start gap-3 cursor-pointer"
                    htmlFor="accept-terms"
                  >
                    <input
                      id="accept-terms"
                      type="checkbox"
                      checked={registerData.acceptedTerms}
                      onChange={(e) =>
                        handleRegisterChange("acceptedTerms", e.target.checked)
                      }
                      className="w-4 h-4 mt-0.5 text-realestate-accent border-gray-300 rounded focus:ring-2 focus:ring-realestate-accent/50 cursor-pointer"
                    />
                    <span className="text-sm text-realestate-secondary font-inter leading-snug">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-realestate-accent hover:text-amber-600 font-medium transition-colors"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-realestate-accent hover:text-amber-600 font-medium transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {validationErrors.terms && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 font-inter ml-7">
                      <AlertCircle size={14} />
                      {validationErrors.terms}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-accent w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-realestate-secondary font-inter uppercase tracking-wide">
                  or sign up with
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google OAuth */}
              <button
                type="button"
                onClick={handleGoogleOAuth}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-realestate-primary py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium font-inter shadow-realestate-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Switch to Login */}
              <p className="mt-8 text-center text-sm text-realestate-secondary font-inter">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("login")}
                  className="font-semibold text-realestate-accent hover:text-amber-600 transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
