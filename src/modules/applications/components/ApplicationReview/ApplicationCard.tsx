// PLACEHOLDER FILE: components\ApplicationReview\ApplicationCard.tsx
// TODO: Add your implementation here

import {
  User,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  MapPin,
  DollarSign,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Application } from "../../types/application.types";
import { getScoreRating } from "../../utils/scoringAlgorithm";
import { calculateMonthlyIncome } from "../../utils/scoringAlgorithm";

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const navigate = useNavigate();
  const scoreRating = getScoreRating(application.score);
  const monthlyIncome = calculateMonthlyIncome(application.income);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "verification_pending":
        return "bg-purple-100 text-purple-800";
      case "conditionally_approved":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "approved_with_conditions":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 75) return "text-blue-600 bg-blue-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleClick = () => {
    navigate(`/applications/${application.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        {/* Applicant Info */}
        <div className="flex items-start flex-1">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {application.personalInfo.firstName}{" "}
                {application.personalInfo.lastName}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
              >
                {formatStatus(application.status)}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {application.personalInfo.email}
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                {application.personalInfo.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Score Badge */}
        <div
          className={`ml-4 text-center px-4 py-3 rounded-lg ${getScoreColor(application.score)}`}
        >
          <div className="text-2xl font-bold">{application.score}</div>
          <div className="text-xs font-medium mt-1">{scoreRating.label}</div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Property */}
        {application.property && (
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-gray-600">Property</p>
              <p className="font-medium text-gray-900">
                {application.property.address.street}
              </p>
            </div>
          </div>
        )}

        {/* Employment */}
        {application.employment.length > 0 && (
          <div className="flex items-start">
            <Briefcase className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-gray-600">Employment</p>
              <p className="font-medium text-gray-900 truncate">
                {application.employment[0].employerName}
              </p>
            </div>
          </div>
        )}

        {/* Monthly Income */}
        <div className="flex items-start">
          <DollarSign className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-gray-600">Monthly Income</p>
            <p className="font-medium text-gray-900">
              ${monthlyIncome.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Application Date */}
        <div className="flex items-start">
          <Calendar className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-gray-600">Applied</p>
            <p className="font-medium text-gray-900">
              {new Date(
                application.submittedAt || application.createdAt,
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Score Breakdown Preview */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <span className="text-gray-600">
                Credit: {application.scoreBreakdown.creditScore.score}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
              <span className="text-gray-600">
                Income: {application.scoreBreakdown.incomeRatio.score}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
              <span className="text-gray-600">
                Employment:{" "}
                {application.scoreBreakdown.employmentStability.score}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
              <span className="text-gray-600">
                Background: {application.scoreBreakdown.backgroundCheck.score}
              </span>
            </div>
          </div>

          <div className="flex items-center text-blue-600 font-medium">
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>

      {/* Co-applicants indicator */}
      {application.coApplicants.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">
              {application.coApplicants.length}
            </span>{" "}
            co-applicant
            {application.coApplicants.length > 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Needs Attention Badge */}
      {(application.status === "submitted" ||
        application.status === "under_review") && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-orange-600 mr-2" />
            <span className="text-orange-600 font-medium">
              Needs Your Attention
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
