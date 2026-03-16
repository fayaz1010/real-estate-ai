// FILE PATH: src/pages/MaintenanceRequestPage.tsx
// Maintenance Request Management Page - Submit, track, and communicate on requests

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  MessageSquare,
  Calendar,
  ChevronRight,
  X,
  Send,
  Upload,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RequestStatus = "open" | "in_progress" | "completed";
type Priority = "low" | "medium" | "high" | "urgent";
type TabKey = "all" | "open" | "in_progress" | "completed";

interface Message {
  id: string;
  sender: string;
  role: "tenant" | "vendor" | "manager";
  text: string;
  timestamp: string;
}

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  priority: Priority;
  property: string;
  unit: string;
  tenant: string;
  vendor: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_REQUESTS: MaintenanceRequest[] = [
  {
    id: "MR-1001",
    title: "Leaking kitchen faucet",
    description: "The kitchen faucet has been dripping steadily for two days. Water pools under the sink cabinet.",
    status: "open",
    priority: "high",
    property: "Coastal Villas",
    unit: "Unit 4B",
    tenant: "Sarah Mitchell",
    vendor: "QuickFix Plumbing",
    createdAt: "2026-03-14",
    updatedAt: "2026-03-15",
    messages: [
      { id: "m1", sender: "Sarah Mitchell", role: "tenant", text: "The dripping is getting worse overnight.", timestamp: "2026-03-15 09:12" },
      { id: "m2", sender: "QuickFix Plumbing", role: "vendor", text: "We can schedule a visit for tomorrow morning.", timestamp: "2026-03-15 10:30" },
    ],
  },
  {
    id: "MR-1002",
    title: "Broken window latch – bedroom",
    description: "The latch on the master bedroom window won't lock. Security concern.",
    status: "in_progress",
    priority: "urgent",
    property: "Harbor View Apartments",
    unit: "Unit 12A",
    tenant: "James Carter",
    vendor: "SecureLock Services",
    createdAt: "2026-03-10",
    updatedAt: "2026-03-16",
    messages: [
      { id: "m3", sender: "SecureLock Services", role: "vendor", text: "Part ordered, ETA 2 days.", timestamp: "2026-03-14 14:00" },
    ],
  },
  {
    id: "MR-1003",
    title: "HVAC not cooling properly",
    description: "Air conditioning runs but does not cool below 78 °F even on max.",
    status: "in_progress",
    priority: "medium",
    property: "Coastal Villas",
    unit: "Unit 7C",
    tenant: "Olivia Nguyen",
    vendor: "CoolAir HVAC",
    createdAt: "2026-03-12",
    updatedAt: "2026-03-16",
    messages: [],
  },
  {
    id: "MR-1004",
    title: "Garage door remote malfunction",
    description: "Remote stopped working after battery replacement. Likely receiver issue.",
    status: "completed",
    priority: "low",
    property: "Harbor View Apartments",
    unit: "Unit 3D",
    tenant: "Kevin Brooks",
    vendor: "GarageTech Co.",
    createdAt: "2026-03-05",
    updatedAt: "2026-03-11",
    messages: [
      { id: "m4", sender: "GarageTech Co.", role: "vendor", text: "Receiver replaced and tested. All good.", timestamp: "2026-03-11 16:45" },
    ],
  },
];

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Requests" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusConfig: Record<RequestStatus, { label: string; color: string; icon: React.ReactNode }> = {
  open: { label: "Open", color: "bg-amber-100 text-amber-800", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: <Clock className="w-3.5 h-3.5" /> },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle className="w-3.5 h-3.5" /> },
};

const priorityColor: Record<Priority, string> = {
  low: "text-slate-500",
  medium: "text-amber-600",
  high: "text-orange-600",
  urgent: "text-red-600 font-semibold",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const MaintenanceRequestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // New request form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState<Priority>("medium");

  const filtered = MOCK_REQUESTS.filter((r) => {
    if (activeTab !== "all" && r.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.property.toLowerCase().includes(q) ||
        r.tenant.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSubmitNew = () => {
    if (!formTitle.trim()) return;
    setShowNewForm(false);
    setFormTitle("");
    setFormDescription("");
    setFormPriority("medium");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRequest) return;
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="section-container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Wrench className="w-6 h-6" style={{ color: "#2a5f73" }} />
            <h1 className="text-display text-xl font-bold" style={{ color: "#2a5f73" }}>
              Maintenance Requests
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-slate-500 hover:text-slate-700 hidden sm:inline">
              Dashboard
            </Link>
            <button
              onClick={() => setShowNewForm(true)}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: "#2a5f73" }}
              aria-label="Create new maintenance request"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Request</span>
            </button>
          </div>
        </div>
      </header>

      <main className="section-container py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Panel – List */}
        <div className={`flex-1 min-w-0 ${selectedRequest ? "hidden lg:block" : ""}`}>
          {/* Search & Filter */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, property, tenant, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2"
                style={{ focusRingColor: "#3aa9c3" } as React.CSSProperties}
                aria-label="Search maintenance requests"
              />
            </div>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" aria-label="Filter requests">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 mb-5 overflow-x-auto" role="tablist" aria-label="Request status tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                style={activeTab === tab.key ? { backgroundColor: "#2a5f73" } : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Request Cards */}
          {filtered.length === 0 ? (
            <div className="card text-center py-12 text-slate-400">
              <Wrench className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No requests match your criteria.</p>
            </div>
          ) : (
            <ul className="space-y-3" aria-label="Maintenance requests list">
              {filtered.map((req) => {
                const sc = statusConfig[req.status];
                return (
                  <li key={req.id}>
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className={`card w-full text-left p-4 rounded-xl border transition-shadow hover:shadow-md ${
                        selectedRequest?.id === req.id ? "ring-2" : "border-slate-200"
                      }`}
                      style={selectedRequest?.id === req.id ? { borderColor: "#3aa9c3", ringColor: "#3aa9c3" } as React.CSSProperties : undefined}
                      aria-label={`View request ${req.id}: ${req.title}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-slate-400">{req.id}</span>
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${sc.color}`}>
                              {sc.icon} {sc.label}
                            </span>
                          </div>
                          <h3 className="text-heading text-sm font-semibold text-slate-800 truncate">{req.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{req.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
                        <span>{req.property} &middot; {req.unit}</span>
                        <span className={priorityColor[req.priority]}>
                          {req.priority.charAt(0).toUpperCase() + req.priority.slice(1)} Priority
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {req.createdAt}
                        </span>
                        {req.messages.length > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> {req.messages.length}
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right Panel – Detail */}
        {selectedRequest && (
          <aside className="lg:w-[420px] shrink-0" aria-label="Request detail">
            <div className="card-elevated rounded-xl border border-slate-200 bg-white sticky top-20">
              {/* Detail Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-heading font-semibold text-slate-800 text-sm truncate pr-2">
                  {selectedRequest.id}: {selectedRequest.title}
                </h2>
                <button onClick={() => setSelectedRequest(null)} aria-label="Close detail panel" className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detail Body */}
              <div className="p-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusConfig[selectedRequest.status].color}`}>
                      {statusConfig[selectedRequest.status].icon} {statusConfig[selectedRequest.status].label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Priority</span>
                    <span className={priorityColor[selectedRequest.priority]}>
                      {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Property</span>
                    <span className="text-slate-700">{selectedRequest.property} &middot; {selectedRequest.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tenant</span>
                    <span className="text-slate-700">{selectedRequest.tenant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vendor</span>
                    <span className="font-medium" style={{ color: "#2a5f73" }}>{selectedRequest.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Opened</span>
                    <span className="text-slate-700">{selectedRequest.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Updated</span>
                    <span className="text-slate-700">{selectedRequest.updatedAt}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{selectedRequest.description}</p>

                {/* Communication Thread */}
                <div>
                  <h3 className="text-heading text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Communication
                  </h3>
                  {selectedRequest.messages.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No messages yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {selectedRequest.messages.map((msg) => (
                        <li key={msg.id} className="text-sm">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-slate-700">{msg.sender}</span>
                            <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                          </div>
                          <p className="text-slate-600 bg-slate-50 rounded-lg px-3 py-2 text-xs">{msg.text}</p>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Message Input */}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                      aria-label="Type a message to the communication thread"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 rounded-lg text-white disabled:opacity-40"
                      style={{ backgroundColor: "#3aa9c3" }}
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </main>

      {/* New Request Modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true" aria-label="New maintenance request">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-heading font-bold" style={{ color: "#2a5f73" }}>New Maintenance Request</h2>
              <button onClick={() => setShowNewForm(false)} aria-label="Close form" className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitNew();
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label htmlFor="req-title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  id="req-title"
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Brief description of the issue"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label htmlFor="req-desc" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  id="req-desc"
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Provide details, location within the unit, and any relevant context..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
                />
              </div>
              <div>
                <label htmlFor="req-priority" className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select
                  id="req-priority"
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as Priority)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Attachment</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:border-slate-300 transition-colors">
                  <Upload className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500">Drag & drop or click to upload photos</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: "#2a5f73" }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
