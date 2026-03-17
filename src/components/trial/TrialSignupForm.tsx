import { Eye, EyeOff, Loader } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { startTrial } from "../../services/trialService";

interface FormData {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  acceptTerms?: string;
}

export const TrialSignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    if (!formData.acceptTerms) {
      errs.acceptTerms = "You must agree to the terms of service";
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await startTrial("new-user");
      navigate("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Open Sans', sans-serif",
    borderColor: "#091a2b30",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label
          htmlFor="signup-name"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#091a2b", fontFamily: "'Open Sans', sans-serif" }}
        >
          Full Name
        </label>
        <input
          id="signup-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="John Doe"
          className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
          style={{
            ...inputStyle,
            ...(errors.name ? { borderColor: "#ef4444" } : {}),
          }}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#091a2b", fontFamily: "'Open Sans', sans-serif" }}
        >
          Email Address
        </label>
        <input
          id="signup-email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="john@example.com"
          className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
          style={{
            ...inputStyle,
            ...(errors.email ? { borderColor: "#ef4444" } : {}),
          }}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#091a2b", fontFamily: "'Open Sans', sans-serif" }}
        >
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="At least 8 characters"
            className="w-full rounded-lg border px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2"
            style={{
              ...inputStyle,
              ...(errors.password ? { borderColor: "#ef4444" } : {}),
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
            onChange={(e) => handleChange("acceptTerms", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300"
          />
          <span
            className="text-sm text-gray-600"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            I agree to the{" "}
            <a href="/terms" className="underline hover:text-gray-900">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-gray-900">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1 text-xs text-red-500">{errors.acceptTerms}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{
          backgroundColor: "#091a2b",
          fontFamily: "'Montserrat', sans-serif",
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
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        No credit card required. Cancel anytime.
      </p>
    </form>
  );
};
