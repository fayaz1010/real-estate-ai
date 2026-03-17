import { Home, CreditCard, Wrench, ChevronRight, Menu, X } from "lucide-react";
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";

import { MaintenanceRequestForm } from "../components/MaintenanceRequestForm";
import { PaymentHistory } from "../components/PaymentHistory";
import { TenantDashboard } from "../components/TenantDashboard";

import { cn } from "@/lib/utils";

type TabKey = "dashboard" | "payments" | "maintenance";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Overview", icon: Home },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "maintenance", label: "Maintenance", icon: Wrench },
];

export const TenantPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = useCallback((tab: string) => {
    setActiveTab(tab as TabKey);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-tenant-bg font-open-sans">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-tenant-primary text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <button
          type="button"
          onClick={() => setSidebarOpen((o) => !o)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
        <h1 className="font-montserrat text-base font-bold tracking-tight">
          Tenant Portal
        </h1>
        <div className="w-8" aria-hidden="true" />
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-tenant-primary text-white transform transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
        aria-label="Tenant navigation"
      >
        <div className="p-6 hidden md:block">
          <h2 className="font-montserrat text-xl font-bold tracking-tight">
            Tenant Portal
          </h2>
          <p className="text-gray-400 text-sm mt-1 font-open-sans">
            Property Management, Powered by AI
          </p>
        </div>

        {/* Spacer for mobile top bar */}
        <div className="h-14 md:hidden" />

        <nav className="mt-2">
          <ul role="list" className="space-y-1 px-3">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <li key={tab.key}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(tab.key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors font-open-sans",
                      isActive
                        ? "bg-white/15 text-white font-medium"
                        : "text-gray-300 hover:bg-white/10 hover:text-white",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <tab.icon
                      className={cn(
                        "w-4 h-4",
                        isActive ? "text-white" : "text-gray-400",
                      )}
                      aria-hidden="true"
                    />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-open-sans"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pt-14 md:pt-0" role="main">
        {/* Mobile tab bar */}
        <div className="md:hidden sticky top-14 z-20 bg-white border-b border-gray-200 px-2">
          <div className="flex">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleNavigate(tab.key)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2",
                    isActive
                      ? "text-tenant-primary border-tenant-primary"
                      : "text-gray-400 border-transparent hover:text-gray-600",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <tab.icon className="w-4 h-4" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
          {activeTab === "dashboard" && (
            <TenantDashboard onNavigate={handleNavigate} />
          )}
          {activeTab === "payments" && <PaymentHistory />}
          {activeTab === "maintenance" && <MaintenanceRequestForm />}
        </div>
      </main>
    </div>
  );
};
