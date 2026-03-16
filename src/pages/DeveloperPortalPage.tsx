// FILE PATH: src/pages/DeveloperPortalPage.tsx
// Developer Portal – New development listings, project management & marketing

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  Plus,
  BarChart,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Eye,
  ChevronRight,
  Star,
  CheckCircle,
  Clock,
  MapPin,
  Layers,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Project {
  id: number;
  name: string;
  location: string;
  phase: string;
  completion: number;
  unitsSold: number;
  unitsTotal: number;
  image: string;
  rating: number;
}

interface PipelineItem {
  id: number;
  name: string;
  milestone: string;
  date: string;
  status: "completed" | "in-progress" | "upcoming";
}

interface Lead {
  id: number;
  name: string;
  project: string;
  interest: string;
  date: string;
  status: "hot" | "warm" | "new";
}

// ---------------------------------------------------------------------------
// Mock Data (structured for API replacement)
// ---------------------------------------------------------------------------

const STATS = [
  { label: "Active Projects", value: 12, icon: Building, change: "+2", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Units Under Construction", value: 348, icon: Layers, change: "+56", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Pre-sales", value: 214, icon: TrendingUp, change: "+18%", color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Marketing Reach", value: "1.2M", icon: Eye, change: "+32%", color: "text-violet-600", bg: "bg-violet-50" },
];

const PROJECTS: Project[] = [
  { id: 1, name: "Harbour Residences", location: "Darling Harbour, Sydney", phase: "Construction", completion: 68, unitsSold: 42, unitsTotal: 60, image: "/images/project-1.jpg", rating: 4.8 },
  { id: 2, name: "Parkview Towers", location: "South Bank, Brisbane", phase: "Pre-sale", completion: 25, unitsSold: 18, unitsTotal: 80, image: "/images/project-2.jpg", rating: 4.5 },
  { id: 3, name: "Coastal Edge", location: "Surfers Paradise, QLD", phase: "Planning", completion: 10, unitsSold: 5, unitsTotal: 120, image: "/images/project-3.jpg", rating: 4.9 },
  { id: 4, name: "Urban Nest", location: "Fitzroy, Melbourne", phase: "Construction", completion: 85, unitsSold: 55, unitsTotal: 64, image: "/images/project-4.jpg", rating: 4.7 },
];

const PIPELINE: PipelineItem[] = [
  { id: 1, name: "Harbour Residences", milestone: "Structural completion", date: "2026-04-15", status: "in-progress" },
  { id: 2, name: "Parkview Towers", milestone: "DA approval", date: "2026-03-28", status: "upcoming" },
  { id: 3, name: "Urban Nest", milestone: "Fit-out phase", date: "2026-03-10", status: "completed" },
  { id: 4, name: "Coastal Edge", milestone: "Site preparation", date: "2026-05-01", status: "upcoming" },
  { id: 5, name: "Harbour Residences", milestone: "Foundation pour", date: "2026-02-20", status: "completed" },
];

const MARKETING_METRICS = [
  { label: "Campaign Impressions", value: "1.2M", change: "+32%" },
  { label: "Website Visits", value: "84K", change: "+18%" },
  { label: "Brochure Downloads", value: "2,340", change: "+9%" },
  { label: "Enquiry Conversion", value: "14.2%", change: "+2.1%" },
];

const LEADS: Lead[] = [
  { id: 1, name: "Sarah Mitchell", project: "Harbour Residences", interest: "2-bed apartment", date: "2 hrs ago", status: "hot" },
  { id: 2, name: "James Cooper", project: "Parkview Towers", interest: "Penthouse", date: "5 hrs ago", status: "warm" },
  { id: 3, name: "Emily Tran", project: "Coastal Edge", interest: "3-bed townhouse", date: "1 day ago", status: "new" },
  { id: 4, name: "David Nguyen", project: "Urban Nest", interest: "Studio apartment", date: "1 day ago", status: "hot" },
  { id: 5, name: "Lisa Park", project: "Harbour Residences", interest: "1-bed apartment", date: "2 days ago", status: "warm" },
];

const NAV_ITEMS = [
  { label: "Overview", icon: BarChart, href: "/developer" },
  { label: "Projects", icon: Building, href: "/developer/projects" },
  { label: "Listings", icon: FileText, href: "/developer/listings" },
  { label: "Marketing", icon: TrendingUp, href: "/developer/marketing" },
  { label: "Leads", icon: Users, href: "/developer/leads" },
  { label: "Schedule", icon: Calendar, href: "/developer/schedule" },
];

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

const statusColor: Record<PipelineItem["status"], string> = {
  completed: "text-green-600 bg-green-50",
  "in-progress": "text-amber-600 bg-amber-50",
  upcoming: "text-blue-600 bg-blue-50",
};

const leadStatusStyle: Record<Lead["status"], string> = {
  hot: "bg-red-100 text-red-700",
  warm: "bg-amber-100 text-amber-700",
  new: "bg-blue-100 text-blue-700",
};

const StatusIcon = ({ status }: { status: PipelineItem["status"] }) => {
  if (status === "completed") return <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />;
  if (status === "in-progress") return <Clock className="w-4 h-4 text-amber-600" aria-hidden="true" />;
  return <Calendar className="w-4 h-4 text-blue-600" aria-hidden="true" />;
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export const DeveloperPortalPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState("Overview");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ---- Sidebar ---- */}
      <aside className="hidden lg:flex flex-col w-64 bg-realestate-primary text-white shrink-0">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-heading text-lg font-semibold flex items-center gap-2">
            <Building className="w-5 h-5 text-realestate-accent" aria-hidden="true" />
            Developer Portal
          </h2>
          <p className="text-sm text-gray-300 mt-1">Project Management Hub</p>
        </div>
        <nav className="flex-1 py-4" aria-label="Developer navigation">
          <ul className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  onClick={() => setActiveNav(item.label)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeNav === item.label
                      ? "bg-white/15 text-white font-medium"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link
            to="/developer/projects/new"
            className="btn-primary flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium bg-realestate-secondary hover:bg-realestate-secondary/90 transition-colors"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            New Project
          </Link>
        </div>
      </aside>

      {/* ---- Main Content ---- */}
      <main className="flex-1 overflow-y-auto">
        <div className="section-container py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-display text-2xl sm:text-3xl text-gray-900">Developer Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage your developments, marketing, and sales pipeline</p>
            </div>
            <Link
              to="/developer/projects/new"
              className="btn-accent inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-realestate-secondary text-white hover:bg-realestate-secondary/90 transition-colors lg:hidden"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              New Project
            </Link>
          </div>

          {/* Stats Row */}
          <section aria-label="Key statistics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="card bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className={`${stat.bg} ${stat.color} p-2.5 rounded-lg`}>
                    <stat.icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* Active Projects */}
          <section aria-label="Active projects" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading text-lg font-semibold text-gray-900">Active Projects</h2>
              <Link to="/developer/projects" className="text-sm text-realestate-secondary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {PROJECTS.map((project) => (
                <Link
                  key={project.id}
                  to={`/developer/projects/${project.id}`}
                  className="card-elevated bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  <div className="h-36 bg-realestate-primary/10 flex items-center justify-center">
                    <Building className="w-12 h-12 text-realestate-primary/40" aria-hidden="true" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-realestate-secondary transition-colors">
                        {project.name}
                      </h3>
                      <span className="flex items-center gap-0.5 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                        {project.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      {project.location}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-realestate-accent/20 text-realestate-primary font-medium">
                        {project.phase}
                      </span>
                      <span className="text-gray-500">
                        {project.unitsSold}/{project.unitsTotal} sold
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2" role="progressbar" aria-valuenow={project.completion} aria-valuemin={0} aria-valuemax={100}>
                      <div
                        className="bg-realestate-secondary h-2 rounded-full transition-all"
                        style={{ width: `${project.completion}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">{project.completion}% complete</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Pipeline & Marketing side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Project Pipeline */}
            <section aria-label="Project pipeline" className="card bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-heading text-lg font-semibold text-gray-900 mb-4">Project Pipeline</h2>
              <ul className="space-y-3">
                {PIPELINE.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <StatusIcon status={item.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.milestone}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[item.status]}`}>
                        {item.status.replace("-", " ")}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Marketing Performance */}
            <section aria-label="Marketing performance" className="card bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-heading text-lg font-semibold text-gray-900 mb-4">Marketing Performance</h2>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {MARKETING_METRICS.map((metric) => (
                  <div key={metric.label} className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                    <span className="text-xs font-medium text-green-600">{metric.change}</span>
                  </div>
                ))}
              </div>
              <div className="h-32 bg-realestate-accent/10 rounded-lg flex items-center justify-center">
                <BarChart className="w-8 h-8 text-realestate-primary/30" aria-hidden="true" />
                <span className="ml-2 text-sm text-gray-400">Chart placeholder</span>
              </div>
            </section>
          </div>

          {/* Recent Leads */}
          <section aria-label="Recent leads" className="card bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading text-lg font-semibold text-gray-900">Recent Leads</h2>
              <Link to="/developer/leads" className="text-sm text-realestate-secondary hover:underline flex items-center gap-1">
                All leads <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Project</th>
                    <th className="pb-2 font-medium hidden sm:table-cell">Interest</th>
                    <th className="pb-2 font-medium hidden md:table-cell">Date</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {LEADS.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-medium text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
                        {lead.name}
                      </td>
                      <td className="py-3 text-gray-600">{lead.project}</td>
                      <td className="py-3 text-gray-500 hidden sm:table-cell">{lead.interest}</td>
                      <td className="py-3 text-gray-400 hidden md:table-cell">{lead.date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${leadStatusStyle[lead.status]}`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
