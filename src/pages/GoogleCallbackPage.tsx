// Google OAuth Callback Handler
// Receives the authorization code from Google and sends it to the backend

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import apiClient from "@/api/client";

const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      console.error("Google OAuth error:", error);
      setStatus("error");
      setErrorMessage(`Google authentication was denied: ${error}`);
      return;
    }

    if (!code) {
      console.error("No authorization code received from Google");
      setStatus("error");
      setErrorMessage("No authorization code received from Google.");
      return;
    }

    // Log the authorization code (as per requirements)
    console.log("Google OAuth authorization code received:", code);

    // Send code to backend for token exchange
    async function exchangeCode() {
      try {
        const response = await apiClient.post("/auth/google", {
          code,
          redirectUri: `${window.location.origin}/auth/google/callback`,
        });

        if (response.data?.data?.tokens) {
          // Store tokens
          const { accessToken, refreshToken } = response.data.data.tokens;
          localStorage.setItem("accessToken", accessToken);
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }
          setStatus("success");
          setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
        } else {
          setStatus("success");
          setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
        }
      } catch (err) {
        console.error("Google OAuth exchange failed:", err);
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to complete Google authentication.",
        );
      }
    }

    exchangeCode();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF]">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-realestate-accent mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#091a2b] font-['Montserrat'] mb-2">
              Completing Sign In
            </h2>
            <p className="text-sm text-gray-500 font-['Open_Sans']">
              Processing your Google authentication...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#091a2b] font-['Montserrat'] mb-2">
              Sign In Successful
            </h2>
            <p className="text-sm text-gray-500 font-['Open_Sans']">
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#091a2b] font-['Montserrat'] mb-2">
              Authentication Failed
            </h2>
            <p className="text-sm text-gray-500 font-['Open_Sans'] mb-4">
              {errorMessage}
            </p>
            <button
              onClick={() => navigate("/auth/login", { replace: true })}
              className="px-6 py-2.5 bg-[#005163] text-white rounded-lg font-medium hover:bg-[#003d4a] transition-colors"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
