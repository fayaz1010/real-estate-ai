// FILE PATH: src/pages/DeveloperPortalPage.tsx
// Developer Portal – Projects, Pipelines & Leads

import {
  Building,
  Users,
  Mail,
  Phone,
  ChevronRight,
  FolderKanban,
  GitBranch,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Project {
  name: string;
  description: string;
  status: "In Development" | "Completed" | "On Hold";
}

interface PipelineEntry {
  projectName: string;
  stage: string;
}

interface Lead {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  status: "New" | "Contacted" | "Qualified" | "Converted";
}

// ---------------------------------------------------------------------------
// Mock Data (structured for easy API replacement)
// ---------------------------------------------------------------------------

const mockProjects: Project[] = [
  {
    name: "Project Alpha",
    description: "Developing a new feature for tenant screening.",
    status: "In Development",
  },
  {
    name: "Project Beta",
    description: "Improving the rent collection process.",
    status: "Completed",
  },
  {
    name: "Project Gamma",
    description: "Building an AI-powered maintenance prediction engine.",
    status: "In Development",
  },
  {
    name: "Project Delta",
    description: "Redesigning the landlord onboarding flow.",
    status: "On Hold",
  },
];

const mockPipeline: PipelineEntry[] = [
  { projectName: "Project Alpha", stage: "Development" },
  { projectName: "Project Beta", stage: "Deployment" },
  { projectName: "Project Gamma", stage: "Testing" },
  { projectName: "Project Delta", stage: "Planning" },
];

const mockLeads: Lead[] = [
  {
    contactInfo: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-123-4567",
    },
    status: "New",
  },
  {
    contactInfo: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "555-987-6543",
    },
    status: "Contacted",
  },
  {
    contactInfo: {
      name: "Robert Chen",
      email: "robert.chen@example.com",
      phone: "555-456-7890",
    },
    status: "Qualified",
  },
  {
    contactInfo: {
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "555-321-9876",
    },
    status: "Converted",
  },
];

// ---------------------------------------------------------------------------
// Pipeline stages (ordered)
// ---------------------------------------------------------------------------

const PIPELINE_STAGES = [
  "Planning",
  "Development",
  "Testing",
  "Deployment",
] as const;

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const projectStatusStyle: Record<Project["status"], string> = {
  "In Development": "bg-[#C4A882]/20 text-[#8B7355]",
  Completed: "bg-emerald-100 text-emerald-700",
  "On Hold": "bg-gray-200 text-gray-600",
};

const leadStatusStyle: Record<Lead["status"], string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-[#C4A882]/25 text-[#8B7355]",
  Qualified: "bg-amber-100 text-amber-700",
  Converted: "bg-emerald-100 text-emerald-700",
};

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

type Tab = "projects" | "pipelines" | "leads";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "pipelines", label: "Pipelines", icon: GitBranch },
  { key: "leads", label: "Leads", icon: UserCheck },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProjectsSection() {
  return (
    <section aria-label="Developer projects">
      <h2
        className="text-xl font-semibold mb-6"
        style={{ fontFamily: "var(--font-display)", color: "#2D2A26" }}
      >
        Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {mockProjects.map((project) => (
          <div
            key={project.name}
            className="rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #C4A882/15",
            }}
          >
            <div
              className="h-2 w-full"
              style={{
                backgroundColor:
                  project.status === "Completed"
                    ? "#6BB07A"
                    : project.status === "On Hold"
                      ? "#9CA3AF"
                      : "#C4A882",
              }}
            />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "rgba(196,168,130,0.12)" }}
                >
                  <Building
                    className="w-5 h-5"
                    style={{ color: "#8B7355" }}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${projectStatusStyle[project.status]}`}
                >
                  {project.status}
                </span>
              </div>
              <h3
                className="font-semibold text-base mb-2"
                style={{ fontFamily: "var(--font-display)", color: "#2D2A26" }}
              >
                {project.name}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-body)", color: "#6B6560" }}
              >
                {project.description}
              </p>
              <button
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "#8B7355" }}
              >
                View Details
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PipelinesSection() {
  const stageIndex = (stage: string) =>
    PIPELINE_STAGES.indexOf(stage as (typeof PIPELINE_STAGES)[number]);

  return (
    <section aria-label="Development pipelines">
      <h2
        className="text-xl font-semibold mb-6"
        style={{ fontFamily: "var(--font-display)", color: "#2D2A26" }}
      >
        Pipelines
      </h2>

      {/* Stage labels */}
      <div className="hidden sm:grid grid-cols-4 gap-0 mb-2 px-2">
        {PIPELINE_STAGES.map((stage) => (
          <p
            key={stage}
            className="text-xs font-semibold text-center uppercase tracking-wider"
            style={{ color: "#8B7355" }}
          >
            {stage}
          </p>
        ))}
      </div>

      {/* Pipeline rows */}
      <div className="space-y-4">
        {mockPipeline.map((entry) => {
          const currentIdx = stageIndex(entry.stage);
          return (
            <div
              key={entry.projectName}
              className="rounded-xl shadow-sm p-4"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <p
                className="text-sm font-medium mb-3"
                style={{ fontFamily: "var(--font-display)", color: "#2D2A26" }}
              >
                {entry.projectName}
              </p>

              {/* Horizontal timeline */}
              <div className="relative flex items-center">
                {/* Track line */}
                <div
                  className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2"
                  style={{ backgroundColor: "#E8E2DA" }}
                />

                <div className="relative grid grid-cols-4 w-full">
                  {PIPELINE_STAGES.map((stage, idx) => {
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div
                        key={stage}
                        className="flex flex-col items-center gap-2"
                      >
                        {/* Node */}
                        <div
                          className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                          style={{
                            backgroundColor: isCurrent
                              ? "#8B7355"
                              : isCompleted
                                ? "#A0926B"
                                : "#E8E2DA",
                            color:
                              isCurrent || isCompleted ? "#FFFFFF" : "#8B7355",
                            boxShadow: isCurrent
                              ? "0 0 0 4px rgba(139,115,85,0.2)"
                              : "none",
                          }}
                        >
                          {idx + 1}
                        </div>
                        {/* Label (mobile-friendly) */}
                        <span
                          className="text-[10px] sm:text-xs text-center leading-tight"
                          style={{
                            fontFamily: "var(--font-body)",
                            color: isCurrent ? "#8B7355" : "#9A9490",
                            fontWeight: isCurrent ? 600 : 400,
                          }}
                        >
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LeadsSection() {
  return (
    <section aria-label="Leads">
      <h2
        className="text-xl font-semibold mb-6"
        style={{ fontFamily: "var(--font-display)", color: "#2D2A26" }}
      >
        Leads
      </h2>

      {/* Desktop table */}
      <div
        className="hidden md:block rounded-xl shadow-sm overflow-hidden"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <table
          className="w-full text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <thead>
            <tr style={{ backgroundColor: "rgba(196,168,130,0.08)" }}>
              <th
                className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#8B7355" }}
              >
                Name
              </th>
              <th
                className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#8B7355" }}
              >
                Email
              </th>
              <th
                className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#8B7355" }}
              >
                Phone
              </th>
              <th
                className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#8B7355" }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {mockLeads.map((lead) => (
              <tr
                key={lead.contactInfo.email}
                className="border-t hover:bg-gray-50/50 transition-colors"
                style={{ borderColor: "#F0EBE4" }}
              >
                <td
                  className="py-3.5 px-5 font-medium"
                  style={{ color: "#2D2A26" }}
                >
                  <span className="flex items-center gap-2">
                    <Users
                      className="w-4 h-4 shrink-0"
                      style={{ color: "#A0926B" }}
                      aria-hidden="true"
                    />
                    {lead.contactInfo.name}
                  </span>
                </td>
                <td className="py-3.5 px-5" style={{ color: "#6B6560" }}>
                  <span className="flex items-center gap-2">
                    <Mail
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: "#A0926B" }}
                      aria-hidden="true"
                    />
                    {lead.contactInfo.email}
                  </span>
                </td>
                <td className="py-3.5 px-5" style={{ color: "#6B6560" }}>
                  <span className="flex items-center gap-2">
                    <Phone
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: "#A0926B" }}
                      aria-hidden="true"
                    />
                    {lead.contactInfo.phone}
                  </span>
                </td>
                <td className="py-3.5 px-5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${leadStatusStyle[lead.status]}`}
                  >
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {mockLeads.map((lead) => (
          <div
            key={lead.contactInfo.email}
            className="rounded-xl shadow-sm p-4"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium" style={{ color: "#2D2A26" }}>
                {lead.contactInfo.name}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${leadStatusStyle[lead.status]}`}
              >
                {lead.status}
              </span>
            </div>
            <div className="space-y-1.5 text-sm" style={{ color: "#6B6560" }}>
              <p className="flex items-center gap-2">
                <Mail
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "#A0926B" }}
                  aria-hidden="true"
                />
                {lead.contactInfo.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "#A0926B" }}
                  aria-hidden="true"
                />
                {lead.contactInfo.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export const DeveloperPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("projects");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F1" }}>
      {/* Header */}
      <header
        className="border-b"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E2DA" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#2D2A26" }}
          >
            Developer Portal
          </h1>
          <p
            className="mt-2 text-sm sm:text-base"
            style={{ fontFamily: "var(--font-body)", color: "#8B7355" }}
          >
            Manage projects, track pipelines, and nurture leads
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav
        className="border-b sticky top-0 z-10"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E2DA" }}
        aria-label="Portal sections"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
                style={{
                  fontFamily: "var(--font-body)",
                  color: activeTab === tab.key ? "#8B7355" : "#9A9490",
                }}
                aria-current={activeTab === tab.key ? "page" : undefined}
              >
                <tab.icon className="w-4 h-4" aria-hidden="true" />
                {tab.label}
                {activeTab === tab.key && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                    style={{ backgroundColor: "#8B7355" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "projects" && <ProjectsSection />}
        {activeTab === "pipelines" && <PipelinesSection />}
        {activeTab === "leads" && <LeadsSection />}
      </main>
    </div>
  );
};
