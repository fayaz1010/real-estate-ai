// FILE PATH: src/pages/ApplicationsPage.tsx
// Application Review Page - Protected standalone page

import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Users,
  ToggleLeft,
  ToggleRight,
  X,
  AlertTriangle,
  Shield,
  Briefcase,
  CreditCard,
  Home,
  Star,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  fetchApplications,
  fetchSmartScore,
  type ApplicationData,
} from "../services/dashboardService";

// ─── Types ───────────────────────────────────────────────────────────────────

type ApplicationStatus =
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Conditionally Approved";

interface ScoreCategory {
  label: string;
  score: number;
  maxScore: number;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  completed: boolean;
}

interface MockApplication {
  id: string;
  applicantName: string;
  initials: string;
  avatarColor: string;
  property: string;
  appliedDate: string;
  aiScore: number;
  status: ApplicationStatus;
  scoring: ScoreCategory[];
  timeline: TimelineEvent[];
}

// ─── Avatar colors for consistent display ────────────────────────────────────
const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-purple-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-cyan-600",
];

function mapApplicationStatus(status: string): ApplicationStatus {
  const s = status.toUpperCase();
  if (s === "APPROVED") return "Approved";
  if (s === "REJECTED") return "Rejected";
  if (s === "SUBMITTED" || s === "PENDING") return "Submitted";
  if (s === "UNDER_REVIEW" || s === "IN_REVIEW") return "Under Review";
  if (s === "CONDITIONALLY_APPROVED") return "Conditionally Approved";
  return "Submitted";
}

function apiDataToMockApplication(
  data: ApplicationData,
  index: number,
): MockApplication {
  const name = data.primaryApplicant
    ? `${data.primaryApplicant.firstName} ${data.primaryApplicant.lastName}`
    : `Applicant ${index + 1}`;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    id: data.id,
    applicantName: name,
    initials,
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    property: data.property?.title ?? "Property",
    appliedDate:
      data.createdAt?.split("T")[0] ?? new Date().toISOString().split("T")[0],
    aiScore: 0, // Will be filled by AI scoring
    status: mapApplicationStatus(data.status),
    scoring: [
      { label: "Credit Score", score: 0, maxScore: 100 },
      { label: "Income Verification", score: 0, maxScore: 100 },
      { label: "Rental History", score: 0, maxScore: 100 },
      { label: "Background Check", score: 0, maxScore: 100 },
    ],
    timeline: [
      {
        date: data.createdAt?.split("T")[0] ?? "",
        title: "Application Submitted",
        description: "Applicant submitted all required documents.",
        completed: true,
      },
    ],
  };
}

type FilterOption = "All" | "Pending" | "Approved" | "Rejected";

// ─── Helper Functions ────────────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score > 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBgColor(score: number): string {
  if (score > 75) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

function getScoreBadgeBg(score: number): string {
  if (score > 75) return "bg-green-50 border-green-200";
  if (score >= 50) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
}

function getStatusBadge(status: ApplicationStatus): {
  bg: string;
  text: string;
  icon: React.ReactNode;
} {
  switch (status) {
    case "Submitted":
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <FileText className="w-3 h-3" />,
      };
    case "Under Review":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <Clock className="w-3 h-3" />,
      };
    case "Approved":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle className="w-3 h-3" />,
      };
    case "Rejected":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle className="w-3 h-3" />,
      };
    case "Conditionally Approved":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        icon: <AlertTriangle className="w-3 h-3" />,
      };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800", icon: null };
  }
}

function getScoringIcon(label: string): React.ReactNode {
  switch (label) {
    case "Credit Score":
      return <CreditCard className="w-4 h-4" />;
    case "Income Verification":
      return <Briefcase className="w-4 h-4" />;
    case "Rental History":
      return <Home className="w-4 h-4" />;
    case "Background Check":
      return <Shield className="w-4 h-4" />;
    default:
      return <Star className="w-4 h-4" />;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

const StatsBar: React.FC<{
  stats: {
    total: number;
    underReview: number;
    approved: number;
    rejected: number;
  };
}> = ({ stats: s }) => {
  const items = [
    {
      label: "Total Applications",
      value: s.total,
      icon: <FileText className="w-5 h-5" />,
      color: "text-realestate-accent",
      bg: "bg-realestate-accent/10",
    },
    {
      label: "Under Review",
      value: s.underReview,
      icon: <Clock className="w-5 h-5" />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Approved",
      value: s.approved,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Rejected",
      value: s.rejected,
      icon: <XCircle className="w-5 h-5" />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-realestate-lg shadow-realestate-sm border border-gray-100 p-4 sm:p-5 transition-shadow hover:shadow-realestate-md"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${item.bg}`}>
              <span className={item.color}>{item.icon}</span>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-space-grotesk text-realestate-primary">
            {item.value}
          </p>
          <p className="text-sm font-inter text-gray-500 mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

interface ApplicationCardItemProps {
  application: MockApplication;
  isSelected: boolean;
  onSelect: (id: string) => void;
  compareMode: boolean;
  isCompareSelected: boolean;
  onCompareToggle: (id: string) => void;
}

const ApplicationCardItem: React.FC<ApplicationCardItemProps> = ({
  application,
  isSelected,
  onSelect,
  compareMode,
  isCompareSelected,
  onCompareToggle,
}) => {
  const badge = getStatusBadge(application.status);
  return (
    <div
      className={`bg-white rounded-realestate-lg shadow-realestate-sm border transition-all cursor-pointer ${
        isSelected
          ? "border-realestate-accent shadow-realestate-md ring-2 ring-realestate-accent/20"
          : "border-gray-100 hover:shadow-realestate-md hover:border-gray-200"
      }`}
      onClick={() => onSelect(application.id)}
      role="button"
      tabIndex={0}
      aria-label={`View application from ${application.applicantName}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(application.id);
        }
      }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {compareMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCompareToggle(application.id);
                }}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isCompareSelected
                    ? "bg-realestate-accent border-realestate-accent"
                    : "border-gray-300 hover:border-realestate-accent"
                }`}
                aria-label={`Select ${application.applicantName} for comparison`}
              >
                {isCompareSelected && (
                  <CheckCircle className="w-3 h-3 text-realestate-primary" />
                )}
              </button>
            )}
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${application.avatarColor} flex items-center justify-center flex-shrink-0`}
            >
              <span className="text-white font-space-grotesk font-bold text-sm sm:text-base">
                {application.initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-space-grotesk font-semibold text-realestate-primary text-base sm:text-lg truncate">
                {application.applicantName}
              </h3>
              <p className="font-inter text-sm text-gray-500 truncate">
                {application.property}
              </p>
              <p className="font-inter text-xs text-gray-400 mt-1">
                Applied {formatDate(application.appliedDate)}
              </p>
            </div>
          </div>

          {/* Right: Score + Status */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div
              className={`px-3 py-1.5 rounded-lg border ${getScoreBadgeBg(application.aiScore)}`}
            >
              <span
                className={`font-space-grotesk font-bold text-lg ${getScoreColor(application.aiScore)}`}
              >
                {application.aiScore}
              </span>
              <span className="text-xs text-gray-500 ml-1 font-inter">
                /100
              </span>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium font-inter ${badge.bg} ${badge.text}`}
            >
              {badge.icon}
              {application.status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(application.id);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-inter font-medium text-realestate-secondary hover:text-realestate-primary transition-colors rounded-md hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View Details</span>
          </button>
          {application.status !== "Approved" &&
            application.status !== "Rejected" && (
              <>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-inter font-medium text-green-700 hover:bg-green-50 transition-colors rounded-md"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Approve</span>
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-inter font-medium text-red-700 hover:bg-red-50 transition-colors rounded-md"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="hidden sm:inline">Reject</span>
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

interface DetailPanelProps {
  application: MockApplication;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ application, onClose }) => {
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);
  const overallScore = Math.round(
    application.scoring.reduce((sum, s) => sum + s.score, 0) /
      application.scoring.length,
  );

  return (
    <div className="bg-white rounded-realestate-lg shadow-realestate-lg border border-gray-100 animate-fade-in">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${application.avatarColor} flex items-center justify-center`}
          >
            <span className="text-white font-space-grotesk font-bold text-sm">
              {application.initials}
            </span>
          </div>
          <div>
            <h3 className="font-space-grotesk font-bold text-realestate-primary text-lg">
              {application.applicantName}
            </h3>
            <p className="font-inter text-sm text-gray-500">{application.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Close detail panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scoring Breakdown */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h4 className="font-space-grotesk font-semibold text-realestate-primary mb-4">
          AI Scoring Breakdown
        </h4>

        {/* Overall Score */}
        <div
          className={`mb-5 p-4 rounded-lg border ${getScoreBadgeBg(overallScore)}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-inter font-medium text-gray-700">
              Overall AI Score
            </span>
            <span
              className={`font-space-grotesk font-bold text-2xl ${getScoreColor(overallScore)}`}
            >
              {overallScore}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-700 ${getScoreBgColor(overallScore)}`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>

        {/* Individual Scores */}
        <div className="space-y-4">
          {application.scoring.map((category) => (
            <div key={category.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`${getScoreColor(category.score)}`}>
                    {getScoringIcon(category.label)}
                  </span>
                  <span className="font-inter text-sm font-medium text-gray-700">
                    {category.label}
                  </span>
                </div>
                <span
                  className={`font-space-grotesk font-bold text-sm ${getScoreColor(category.score)}`}
                >
                  {category.score}/{category.maxScore}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getScoreBgColor(category.score)}`}
                  style={{
                    width: `${(category.score / category.maxScore) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Timeline */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h4 className="font-space-grotesk font-semibold text-realestate-primary mb-4">
          Application Timeline
        </h4>
        <div className="relative">
          {application.timeline.map((event, index) => (
            <div key={index} className="flex gap-3 mb-4 last:mb-0">
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${
                    event.completed ? "bg-realestate-accent" : "bg-gray-300"
                  }`}
                />
                {index < application.timeline.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 mt-1 ${
                      event.completed
                        ? "bg-realestate-accent/30"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              {/* Content */}
              <div className="pb-4">
                <p className="font-inter text-sm font-semibold text-realestate-primary">
                  {event.title}
                </p>
                <p className="font-inter text-xs text-gray-400 mt-0.5">
                  {formatDate(event.date)}
                </p>
                <p className="font-inter text-sm text-gray-500 mt-1">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Workflow */}
      <div className="p-4 sm:p-6">
        <h4 className="font-space-grotesk font-semibold text-realestate-primary mb-4">
          Approval Workflow
        </h4>

        {confirmAction ? (
          <div className="animate-fade-in">
            <div
              className={`p-4 rounded-lg border mb-4 ${
                confirmAction === "approve"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="font-inter text-sm font-medium text-gray-800 mb-1">
                {confirmAction === "approve"
                  ? "Confirm approval for this application?"
                  : "Confirm rejection of this application?"}
              </p>
              <p className="font-inter text-xs text-gray-500">
                This action will notify the applicant via email.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-2.5 text-sm font-inter font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className={`flex-1 px-4 py-2.5 text-sm font-inter font-medium text-white rounded-lg transition-colors ${
                  confirmAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmAction === "approve" ? "Yes, Approve" : "Yes, Reject"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmAction("approve")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-inter font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-realestate-sm"
            >
              <ThumbsUp className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => setConfirmAction("reject")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-inter font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-realestate-sm"
            >
              <ThumbsDown className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface ComparisonTableProps {
  applications: MockApplication[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ applications }) => {
  if (applications.length < 2) {
    return (
      <div className="bg-white rounded-realestate-lg shadow-realestate-sm border border-gray-100 p-8 text-center">
        <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="font-inter text-gray-500">
          Select at least 2 applications to compare.
        </p>
      </div>
    );
  }

  const categories = applications[0].scoring.map((s) => s.label);

  return (
    <div className="bg-white rounded-realestate-lg shadow-realestate-md border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-4 sm:p-5 border-b border-gray-100">
        <h4 className="font-space-grotesk font-semibold text-realestate-primary">
          Application Comparison
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-[#F0F9FF]">
              <th className="text-left p-3 sm:p-4 font-inter font-medium text-gray-600 text-sm">
                Criteria
              </th>
              {applications.map((app) => (
                <th
                  key={app.id}
                  className="text-center p-3 sm:p-4 font-inter font-medium text-gray-600 text-sm"
                >
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full ${app.avatarColor} flex items-center justify-center`}
                    >
                      <span className="text-white font-space-grotesk font-bold text-xs">
                        {app.initials}
                      </span>
                    </div>
                    <span className="truncate max-w-[120px]">
                      {app.applicantName}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Overall AI Score */}
            <tr className="border-b border-gray-50">
              <td className="p-3 sm:p-4 font-inter font-semibold text-realestate-primary text-sm">
                Overall AI Score
              </td>
              {applications.map((app) => (
                <td key={app.id} className="p-3 sm:p-4 text-center">
                  <span
                    className={`font-space-grotesk font-bold text-xl ${getScoreColor(app.aiScore)}`}
                  >
                    {app.aiScore}
                  </span>
                </td>
              ))}
            </tr>
            {/* Category Scores */}
            {categories.map((cat) => (
              <tr key={cat} className="border-b border-gray-50">
                <td className="p-3 sm:p-4 font-inter text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    {getScoringIcon(cat)}
                    {cat}
                  </div>
                </td>
                {applications.map((app) => {
                  const scoreItem = app.scoring.find((s) => s.label === cat);
                  const score = scoreItem?.score ?? 0;
                  return (
                    <td key={app.id} className="p-3 sm:p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`font-space-grotesk font-bold ${getScoreColor(score)}`}
                        >
                          {score}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5 mx-auto">
                          <div
                            className={`h-1.5 rounded-full ${getScoreBgColor(score)}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Status */}
            <tr className="border-b border-gray-50">
              <td className="p-3 sm:p-4 font-inter text-sm text-gray-600">
                Status
              </td>
              {applications.map((app) => {
                const badge = getStatusBadge(app.status);
                return (
                  <td key={app.id} className="p-3 sm:p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                    >
                      {badge.icon}
                      {app.status}
                    </span>
                  </td>
                );
              })}
            </tr>
            {/* Property */}
            <tr>
              <td className="p-3 sm:p-4 font-inter text-sm text-gray-600">
                Property
              </td>
              {applications.map((app) => (
                <td
                  key={app.id}
                  className="p-3 sm:p-4 text-center font-inter text-xs text-gray-500"
                >
                  {app.property}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Main Page Component ─────────────────────────────────────────────────────

const ApplicationsPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterOption>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<MockApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [appStats, setAppStats] = useState({
    total: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
  });

  // Fetch applications from backend and AI scoring
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchApplications();
        if (cancelled) return;

        const mapped = (Array.isArray(data) ? data : []).map(
          apiDataToMockApplication,
        );

        // Fetch AI scores for each application
        const scored = await Promise.all(
          mapped.map(async (app) => {
            try {
              const score = await fetchSmartScore(app.id);
              return {
                ...app,
                aiScore: score.overallScore,
                scoring: score.categories.map((c) => ({
                  label: c.label,
                  score: c.score,
                  maxScore: c.maxScore,
                })),
              };
            } catch {
              return app;
            }
          }),
        );

        if (!cancelled) {
          setApplications(scored);
          setAppStats({
            total: scored.length,
            underReview: scored.filter(
              (a) => a.status === "Under Review" || a.status === "Submitted",
            ).length,
            approved: scored.filter(
              (a) =>
                a.status === "Approved" ||
                a.status === "Conditionally Approved",
            ).length,
            rejected: scored.filter((a) => a.status === "Rejected").length,
          });
        }
      } catch {
        // Keep empty on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredApplications = useMemo(() => {
    if (filter === "All") return applications;
    if (filter === "Pending") {
      return applications.filter(
        (app) =>
          app.status === "Submitted" ||
          app.status === "Under Review" ||
          app.status === "Conditionally Approved",
      );
    }
    return applications.filter((app) => app.status === filter);
  }, [filter, applications]);

  const selectedApplication = useMemo(
    () => applications.find((app) => app.id === selectedId) ?? null,
    [selectedId, applications],
  );

  const compareApplications = useMemo(
    () => applications.filter((app) => compareIds.includes(app.id)),
    [compareIds, applications],
  );

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleCompareToggle = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleCompareMode = () => {
    setCompareMode((prev) => {
      if (prev) setCompareIds([]);
      return !prev;
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      {/* Header */}
      <header className="bg-realestate-primary shadow-realestate-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left */}
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="font-space-grotesk font-bold text-xl sm:text-2xl text-white">
                Applications
              </h1>
            </div>

            {/* Right: Filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-inter text-sm font-medium transition-colors"
                aria-expanded={filterOpen}
                aria-haspopup="listbox"
                aria-label="Filter applications"
              >
                {filter}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`}
                />
              </button>
              {filterOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-realestate-lg border border-gray-100 py-1 z-40 animate-fade-in"
                  role="listbox"
                  aria-label="Filter options"
                >
                  {(
                    ["All", "Pending", "Approved", "Rejected"] as FilterOption[]
                  ).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilter(option);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-inter transition-colors ${
                        filter === option
                          ? "bg-realestate-accent/10 text-realestate-primary font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      role="option"
                      aria-selected={filter === option}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Bar */}
        <section className="mb-6 sm:mb-8" aria-label="Application statistics">
          <StatsBar stats={appStats} />
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-realestate-accent" />
            <span className="ml-3 text-sm text-gray-500">
              Loading applications...
            </span>
          </div>
        )}

        {/* Compare Mode Toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-inter text-sm text-gray-500">
            {filteredApplications.length} application
            {filteredApplications.length !== 1 ? "s" : ""} found
          </p>
          <button
            onClick={toggleCompareMode}
            className="flex items-center gap-2 px-3 py-2 text-sm font-inter font-medium rounded-lg transition-colors hover:bg-white border border-gray-200 bg-white/60 text-realestate-secondary"
            aria-pressed={compareMode}
          >
            {compareMode ? (
              <ToggleRight className="w-5 h-5 text-realestate-accent" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
            Compare Mode
            {compareMode && compareIds.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-realestate-accent text-realestate-primary text-xs font-bold rounded-full">
                {compareIds.length}
              </span>
            )}
          </button>
        </div>

        {/* Comparison Table */}
        {compareMode && compareIds.length > 0 && (
          <section className="mb-6" aria-label="Application comparison">
            <ComparisonTable applications={compareApplications} />
          </section>
        )}

        {/* Applications List + Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List */}
          <section
            className={`space-y-3 ${
              selectedApplication ? "lg:col-span-5" : "lg:col-span-12"
            }`}
            aria-label="Applications list"
          >
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-realestate-lg shadow-realestate-sm border border-gray-100 p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-inter text-gray-500">
                  No applications match the selected filter.
                </p>
              </div>
            ) : (
              filteredApplications.map((app) => (
                <ApplicationCardItem
                  key={app.id}
                  application={app}
                  isSelected={selectedId === app.id}
                  onSelect={handleSelect}
                  compareMode={compareMode}
                  isCompareSelected={compareIds.includes(app.id)}
                  onCompareToggle={handleCompareToggle}
                />
              ))
            )}
          </section>

          {/* Detail Panel */}
          {selectedApplication && (
            <aside
              className="lg:col-span-7 lg:sticky lg:top-24 lg:self-start"
              aria-label="Application details"
            >
              <DetailPanel
                application={selectedApplication}
                onClose={() => setSelectedId(null)}
              />
            </aside>
          )}
        </div>
      </main>

      {/* Click outside dropdown to close */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setFilterOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default ApplicationsPage;
