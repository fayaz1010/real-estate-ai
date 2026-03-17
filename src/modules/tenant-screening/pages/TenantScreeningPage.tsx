import React, { useState } from "react";
import { TenantScreeningForm } from "../components/TenantScreeningForm";
import {
  tenantScreeningService,
  type TenantScreeningFormData,
} from "../api/tenantScreeningService";

export function TenantScreeningPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(data: TenantScreeningFormData) {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      await tenantScreeningService.submitTenantScreeningForm(data);
      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f1f3f4]">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-[#091a2b] font-[Montserrat] mb-3">
          Tenant Screening
        </h1>

        <p className="text-[#091a2b]/70 font-[Open_Sans] mb-2 max-w-2xl">
          Submit tenant information for a comprehensive screening that includes
          credit checks, criminal background verification, and eviction history.
          Results are typically available within 24-48 hours.
        </p>

        <p className="text-sm text-[#3b4876] font-[Open_Sans] mb-8 max-w-2xl italic">
          AI that actively manages your properties — predicting maintenance
          issues, optimizing rent prices, screening tenants, and reducing vacancy
          — so you manage more units with less effort.
        </p>

        {submitStatus === "success" && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="font-semibold text-green-800 font-[Montserrat]">
              Screening request submitted successfully!
            </p>
            <p className="text-sm text-green-700 font-[Open_Sans] mt-1">
              You will be notified once the screening results are available.
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-800 font-[Montserrat]">
              Submission failed
            </p>
            <p className="text-sm text-red-700 font-[Open_Sans] mt-1">
              {errorMessage}
            </p>
          </div>
        )}

        <TenantScreeningForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
