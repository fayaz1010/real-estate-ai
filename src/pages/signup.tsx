import { Building2, Shield, Zap, BarChart3 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { TrialSignupForm } from "../components/trial/TrialSignupForm";

const benefits = [
  { icon: <Zap className="w-5 h-5" />, text: "AI-powered property management" },
  { icon: <Shield className="w-5 h-5" />, text: "Automated tenant screening" },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    text: "Predictive maintenance alerts",
  },
];

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f1f3f4" }}>
      {/* Left panel – branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24"
        style={{ backgroundColor: "#091a2b" }}
      >
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <Building2 className="w-9 h-9 text-white" />
            <span
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              RealEstate AI
            </span>
          </div>

          <h1
            className="text-4xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Manage Smarter, Not Harder — AI Does the Heavy Lifting
          </h1>

          <p
            className="text-lg mb-10"
            style={{
              color: "#f1f3f4",
              opacity: 0.8,
              fontFamily: "'Open Sans', sans-serif",
            }}
          >
            Join thousands of property managers who save 10+ hours every week
            with AI-powered automation.
          </p>

          <ul className="space-y-4">
            {benefits.map((b) => (
              <li
                key={b.text}
                className="flex items-center gap-3"
                style={{ color: "#f1f3f4" }}
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg"
                  style={{ backgroundColor: "#3b4876" }}
                >
                  {b.icon}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {b.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Building2 className="w-7 h-7" style={{ color: "#091a2b" }} />
            <span
              className="text-xl font-bold"
              style={{
                color: "#091a2b",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              RealEstate AI
            </span>
          </div>

          <h2
            className="text-2xl font-bold mb-1"
            style={{
              color: "#091a2b",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Start your free trial
          </h2>
          <p
            className="text-gray-500 mb-8 text-sm"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            14 days free. No credit card required.
          </p>

          <TrialSignupForm />

          <p
            className="mt-6 text-center text-sm text-gray-500"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold underline"
              style={{ color: "#091a2b" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
