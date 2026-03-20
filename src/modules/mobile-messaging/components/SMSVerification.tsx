import React, { useState, useRef, useEffect } from "react";

import { messagingService } from "../api/messagingService";

type VerificationStep = "phone" | "code" | "success";

interface SMSVerificationProps {
  onVerified?: () => void;
}

const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/;
const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export const SMSVerification: React.FC<SMSVerificationProps> = ({
  onVerified,
}) => {
  const [step, setStep] = useState<VerificationStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const sanitizePhone = (value: string): string => {
    return value.replace(/[^\d+]/g, "");
  };

  const handleSendCode = async () => {
    setError(null);
    const cleaned = sanitizePhone(phoneNumber);

    if (!PHONE_REGEX.test(cleaned)) {
      setError("Please enter a valid phone number (e.g., +61412345678)");
      return;
    }

    setIsLoading(true);
    try {
      await messagingService.sendSMSVerificationCode(cleaned);
      setPhoneNumber(cleaned);
      setStep("code");
      setResendTimer(RESEND_COOLDOWN);
      setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send verification code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError(null);

    if (value && index < CODE_LENGTH - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;

    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);

    const nextEmpty = Math.min(pasted.length, CODE_LENGTH - 1);
    codeInputRefs.current[nextEmpty]?.focus();
  };

  const handleVerifyCode = async () => {
    setError(null);
    const fullCode = code.join("");

    if (fullCode.length !== CODE_LENGTH) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const verified = await messagingService.verifySMSCode(
        phoneNumber,
        fullCode,
      );
      if (verified) {
        setStep("success");
        setTimeout(() => onVerified?.(), 2000);
      } else {
        setError("Invalid verification code. Please try again.");
        setCode(Array(CODE_LENGTH).fill(""));
        codeInputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError(null);
    setIsLoading(true);

    try {
      await messagingService.sendSMSVerificationCode(phoneNumber);
      setResendTimer(RESEND_COOLDOWN);
      setCode(Array(CODE_LENGTH).fill(""));
      codeInputRefs.current[0]?.focus();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to resend code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md font-['Inter']">
      <div className="rounded-xl bg-white p-6 shadow-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#008080]/10">
            <svg
              className="h-8 w-8 text-[#008080]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#1A1A2E]">
            {step === "success" ? "Phone Verified" : "Verify Your Phone"}
          </h2>
          <p className="mt-1 text-sm text-[#1A1A2E]/60">
            {step === "phone" &&
              "Enter your phone number to receive a verification code"}
            {step === "code" && `We sent a 6-digit code to ${phoneNumber}`}
            {step === "success" &&
              "Your phone number has been verified successfully"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Phone Number Step */}
        {step === "phone" && (
          <div>
            <label
              htmlFor="phone-number"
              className="mb-1.5 block text-sm font-medium text-[#1A1A2E]"
            >
              Phone Number
            </label>
            <input
              id="phone-number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
              placeholder="+61 412 345 678"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[#1A1A2E] placeholder:text-gray-400 focus:border-[#008080] focus:outline-none focus:ring-2 focus:ring-[#008080]/20"
              disabled={isLoading}
            />
            <p className="mt-1.5 text-xs text-[#1A1A2E]/50">
              Include country code (e.g., +61 for Australia)
            </p>
            <button
              onClick={handleSendCode}
              disabled={isLoading || !phoneNumber.trim()}
              className="mt-4 w-full rounded-lg bg-[#008080] py-3 text-sm font-medium text-white transition-colors hover:bg-[#008080]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </span>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </div>
        )}

        {/* Code Verification Step */}
        {step === "code" && (
          <div>
            <label className="mb-3 block text-center text-sm font-medium text-[#1A1A2E]">
              Verification Code
            </label>
            <div
              className="mb-4 flex justify-center gap-2"
              onPaste={handleCodePaste}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    codeInputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg font-semibold text-[#1A1A2E] focus:border-[#008080] focus:outline-none focus:ring-2 focus:ring-[#008080]/20"
                  disabled={isLoading}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={isLoading || code.some((d) => !d)}
              className="w-full rounded-lg bg-[#008080] py-3 text-sm font-medium text-white transition-colors hover:bg-[#008080]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </button>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setStep("phone");
                  setCode(Array(CODE_LENGTH).fill(""));
                  setError(null);
                }}
                className="text-sm text-[#008080] hover:underline"
              >
                Change number
              </button>
              <button
                onClick={handleResend}
                disabled={resendTimer > 0 || isLoading}
                className="text-sm text-[#008080] hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-[#1A1A2E]/60">
              Redirecting you to the next step...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMSVerification;
