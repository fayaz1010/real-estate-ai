import { Eye, EyeOff, Loader, Building, Shield, Zap } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAppDispatch } from "../../../store";
import { setAuthenticated, updateUser } from "../../auth/store/authSlice";
import { startTrial } from "../api/trialService";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  acceptTerms?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.firstName.trim()) errors.firstName = "First name is required";
  if (!data.lastName.trim()) errors.lastName = "Last name is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  if (!data.acceptTerms) {
    errors.acceptTerms = "You must agree to the terms";
  }
  return errors;
}

export const TrialSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) setServerError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await startTrial({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // Update Redux auth state
      dispatch(
        updateUser({
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
        }),
      );
      dispatch(setAuthenticated(true));

      navigate("/dashboard");
    } catch (err: unknown) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const features = [
    { icon: Building, text: "Manage unlimited properties" },
    { icon: Shield, text: "AI-powered tenant screening" },
    { icon: Zap, text: "Predictive maintenance alerts" },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Left panel - branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12"
        style={{ backgroundColor: "#1A1A2E" }}
      >
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "#FF6B35" }}
            >
              <Building className="h-8 w-8" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
          <h1
            className="text-4xl font-bold mb-4"
            style={{
              color: "#FFFFFF",
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Property Management,
            <br />
            Powered by AI
          </h1>
          <p
            className="text-lg mb-10 opacity-80"
            style={{
              color: "#FFFFFF",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Start your 14-day free trial and experience the future of property
            management. No credit card required.
          </p>
          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.text}
                  className="flex items-center gap-3 justify-center"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#FF6B3540" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: "#FFFFFF" }} />
                  </div>
                  <span
                    className="text-sm"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#1A1A2E" }}
            >
              <Building className="h-6 w-6" style={{ color: "#FFFFFF" }} />
            </div>
          </div>

          <h2
            className="text-2xl font-bold text-center mb-2"
            style={{
              color: "#1A1A2E",
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Start Your Free Trial
          </h2>
          <p
            className="text-center text-sm text-gray-500 mb-8"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            14-day free trial. No credit card required.
          </p>

          {serverError && (
            <div
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="trial-firstName"
                  className="block text-sm font-medium mb-1.5"
                  style={{
                    color: "#1A1A2E",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  First Name
                </label>
                <input
                  id="trial-firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="John"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    borderColor: errors.firstName ? "#ef4444" : "#1A1A2E30",
                  }}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="trial-lastName"
                  className="block text-sm font-medium mb-1.5"
                  style={{
                    color: "#1A1A2E",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Last Name
                </label>
                <input
                  id="trial-lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Doe"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    borderColor: errors.lastName ? "#ef4444" : "#1A1A2E30",
                  }}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="trial-email"
                className="block text-sm font-medium mb-1.5"
                style={{
                  color: "#1A1A2E",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Email Address
              </label>
              <input
                id="trial-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john@example.com"
                className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  borderColor: errors.email ? "#ef4444" : "#1A1A2E30",
                }}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="trial-password"
                className="block text-sm font-medium mb-1.5"
                style={{
                  color: "#1A1A2E",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="trial-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-lg border px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    borderColor: errors.password ? "#ef4444" : "#1A1A2E30",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) =>
                    handleChange("acceptTerms", e.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-gray-300"
                />
                <span
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  I agree to the{" "}
                  <Link to="/terms" className="underline hover:text-gray-900">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="underline hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{
                backgroundColor: "#1A1A2E",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              {isSubmitting ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                "Start Free 14-Day Trial (no credit card)"
              )}
            </button>

            <p
              className="text-center text-xs text-gray-400"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              No credit card required. Cancel anytime.
            </p>

            <p
              className="text-center text-sm text-gray-600"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-semibold underline hover:text-gray-900"
                style={{ color: "#1A1A2E" }}
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
