// PLACEHOLDER FILE: components\ApplicationReview\ApplicationDetails.tsx
// TODO: Add your implementation here

import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Home,
  Users,
  Shield,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useApplication } from "../../hooks/useApplication";
import { maskSSN } from "../../utils/applicationValidation";
import { calculateMonthlyIncome } from "../../utils/scoringAlgorithm";

import ApplicationTimeline from "./ApplicationTimeline";
import ApprovalWorkflow from "./ApprovalWorkflow";
import ScoringBreakdown from "./ScoringBreakdown";

const ApplicationDetails: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { application, loading } = useApplication(applicationId);
  const [activeTab, setActiveTab] = useState<
    "overview" | "scoring" | "timeline" | "actions"
  >("overview");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">
            Application Not Found
          </h2>
          <p className="text-red-700">
            The application you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  const monthlyIncome = calculateMonthlyIncome(application.income);
  const incomeToRentRatio = application.property
    ? (monthlyIncome / application.property.price).toFixed(2)
    : "0";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "scoring", label: "Score Breakdown" },
    { id: "timeline", label: "Timeline" },
    { id: "actions", label: "Actions" },
  ];

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {application.personalInfo.firstName}{" "}
                {application.personalInfo.lastName}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {application.personalInfo.email}
                </span>
                <span className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {application.personalInfo.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {application.score}
            </div>
            <p className="text-sm text-gray-600">Application Score</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "scoring" | "timeline" | "actions")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Property Info */}
              {application.property && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Property Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">
                        {application.property.address.street}
                      </p>
                      <p className="text-sm text-gray-600">
                        {application.property.address.city},{" "}
                        {application.property.address.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Rent</p>
                      <p className="font-medium text-lg">
                        ${application.property.price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Income-to-Rent Ratio
                      </p>
                      <p
                        className={`font-medium text-lg ${
                          parseFloat(incomeToRentRatio) >= 3
                            ? "text-green-600"
                            : parseFloat(incomeToRentRatio) >= 2
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {incomeToRentRatio}x
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">
                      {application.personalInfo.dateOfBirth}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">SSN</p>
                    <p className="font-medium">
                      {maskSSN(application.personalInfo.ssn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Address</p>
                    <p className="font-medium text-sm">
                      {application.personalInfo.currentAddress?.street},{" "}
                      {application.personalInfo.currentAddress?.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Employment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Employment History ({application.employment.length})
                </h3>
                <div className="space-y-3">
                  {application.employment.map((emp, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {emp.jobTitle}
                          </p>
                          <p className="text-sm text-gray-600">
                            {emp.employerName}
                          </p>
                        </div>
                        {getVerificationIcon(emp.verificationStatus)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {emp.employmentType.replace("_", " ").toUpperCase()} •{" "}
                        {emp.startDate} -{" "}
                        {emp.isCurrent ? "Present" : emp.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Income */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Income Sources ({application.income.length})
                </h3>
                <div className="space-y-3">
                  {application.income.map((inc, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {inc.source.replace("_", " ")}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${inc.amount.toLocaleString()} / {inc.frequency}
                          </p>
                        </div>
                        {getVerificationIcon(inc.verificationStatus)}
                      </div>
                    </div>
                  ))}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 mb-1">
                      Total Monthly Income
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      ${monthlyIncome.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rental History */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Rental History ({application.rentalHistory.length})
                </h3>
                <div className="space-y-3">
                  {application.rentalHistory.map((rental, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {rental.address.street}
                          </p>
                          <p className="text-sm text-gray-600">
                            {rental.address.city}, {rental.address.state}
                          </p>
                        </div>
                        {getVerificationIcon(rental.verificationStatus)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        ${rental.monthlyRent}/mo • {rental.startDate} -{" "}
                        {rental.endDate}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Landlord:</span>{" "}
                        {rental.landlordName} • {rental.landlordPhone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* References */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  References ({application.references.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {application.references.map((ref, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">{ref.name}</p>
                      <p className="text-sm text-gray-600 capitalize mb-2">
                        {ref.relationship.replace("_", " ")}
                      </p>
                      <p className="text-sm text-gray-700">{ref.phone}</p>
                      {ref.contacted && (
                        <p className="text-xs text-green-600 mt-2">
                          ✓ Contacted on {ref.contactedAt}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Documents ({application.documents.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {application.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {doc.filename}
                          </p>
                          <p className="text-xs text-gray-600 capitalize">
                            {doc.type.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      {doc.parsed && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "scoring" && (
            <ScoringBreakdown application={application} />
          )}

          {activeTab === "timeline" && (
            <ApplicationTimeline application={application} />
          )}

          {activeTab === "actions" && (
            <ApprovalWorkflow application={application} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
