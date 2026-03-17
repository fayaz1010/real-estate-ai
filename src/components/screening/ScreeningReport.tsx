import {
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  Briefcase,
  User,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { BackgroundCheckStatus } from "./BackgroundCheckStatus";

import { Skeleton } from "@/components/ui/skeleton";
import { screeningService } from "@/services/screeningService";
import type { ScreeningRequest } from "@/types/screening";

interface ScreeningReportProps {
  requestId: string;
}

export const ScreeningReport: React.FC<ScreeningReportProps> = ({
  requestId,
}) => {
  const [request, setRequest] = useState<ScreeningRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await screeningService.getScreeningRequestById(requestId);
        setRequest(data);
      } catch {
        setError("Failed to load screening report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [requestId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div
        className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
        role="alert"
      >
        <p
          className="text-red-700 font-medium"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          {error ?? "Screening request not found."}
        </p>
      </div>
    );
  }

  const ResultCard: React.FC<{
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    available: boolean;
  }> = ({ icon: Icon, label, value, available }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#091a2b]" aria-hidden="true" />
        </div>
        <h3
          className="text-sm font-semibold"
          style={{ fontFamily: "'Montserrat', sans-serif", color: "#091a2b" }}
        >
          {label}
        </h3>
      </div>
      {available ? (
        <div
          className="text-sm"
          style={{ fontFamily: "'Open Sans', sans-serif", color: "#091a2b" }}
        >
          {value}
        </div>
      ) : (
        <p
          className="text-sm text-gray-400 italic"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          No data available
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "'Montserrat', sans-serif", color: "#091a2b" }}
        >
          Screening Report
        </h2>
        <BackgroundCheckStatus status={request.status} />
      </div>

      {/* Tenant Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ fontFamily: "'Montserrat', sans-serif", color: "#091a2b" }}
        >
          Tenant Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <User
              className="w-4 h-4 text-gray-400 shrink-0"
              aria-hidden="true"
            />
            <div>
              <p
                className="text-xs text-gray-500"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Name
              </p>
              <p
                className="text-sm font-medium"
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: "#091a2b",
                }}
              >
                {request.tenantName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail
              className="w-4 h-4 text-gray-400 shrink-0"
              aria-hidden="true"
            />
            <div>
              <p
                className="text-xs text-gray-500"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Email
              </p>
              <p
                className="text-sm font-medium"
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: "#091a2b",
                }}
              >
                {request.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone
              className="w-4 h-4 text-gray-400 shrink-0"
              aria-hidden="true"
            />
            <div>
              <p
                className="text-xs text-gray-500"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Phone
              </p>
              <p
                className="text-sm font-medium"
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: "#091a2b",
                }}
              >
                {request.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building
              className="w-4 h-4 text-gray-400 shrink-0"
              aria-hidden="true"
            />
            <div>
              <p
                className="text-xs text-gray-500"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Property ID
              </p>
              <p
                className="text-sm font-medium"
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: "#091a2b",
                }}
              >
                {request.propertyId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Screening Results */}
      <div>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ fontFamily: "'Montserrat', sans-serif", color: "#091a2b" }}
        >
          Screening Results
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ResultCard
            icon={CreditCard}
            label="Credit Score"
            value={
              <span className="text-2xl font-bold">{request.creditScore}</span>
            }
            available={request.creditScore != null}
          />
          <ResultCard
            icon={ShieldCheck}
            label="Background Check"
            value={
              request.backgroundCheck ? (
                <span className="text-green-600 font-medium">Passed</span>
              ) : (
                <span className="text-red-600 font-medium">Issues Found</span>
              )
            }
            available={request.backgroundCheck != null}
          />
          <ResultCard
            icon={AlertTriangle}
            label="Eviction History"
            value={
              request.evictionHistory ? (
                <span className="text-red-600 font-medium">
                  Evictions Found
                </span>
              ) : (
                <span className="text-green-600 font-medium">No Evictions</span>
              )
            }
            available={request.evictionHistory != null}
          />
          <ResultCard
            icon={Briefcase}
            label="Employment Verification"
            value={
              request.employmentVerification ? (
                <span className="text-green-600 font-medium">Verified</span>
              ) : (
                <span className="text-red-600 font-medium">Not Verified</span>
              )
            }
            available={request.employmentVerification != null}
          />
        </div>
      </div>

      {/* Timestamps */}
      <div
        className="text-xs text-gray-400 flex gap-6"
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        <span>
          Created:{" "}
          {new Date(request.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span>
          Updated:{" "}
          {new Date(request.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};
