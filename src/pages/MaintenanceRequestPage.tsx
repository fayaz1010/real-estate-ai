// FILE PATH: src/pages/MaintenanceRequestPage.tsx
// Maintenance Request Management Page - Submit, track, and manage maintenance requests

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Wrench, Plus, Loader2 } from "lucide-react";
import apiClient from "@/api/client";
import { MaintenanceRequestForm } from "@/components/MaintenanceRequestForm";
import { MaintenanceRequestList } from "@/components/MaintenanceRequestList";
import type { MaintenanceRequest, Property } from "@/types";

export const MaintenanceRequestPage: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<MaintenanceRequest[]>("/maintenance");
      setRequests(
        Array.isArray(res.data)
          ? res.data
          : (res.data as { data?: MaintenanceRequest[] })?.data ?? []
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load maintenance requests"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await apiClient.get<Property[]>("/properties");
      setProperties(
        Array.isArray(res.data)
          ? res.data
          : (res.data as { data?: Property[] })?.data ?? []
      );
    } catch {
      // Properties fetch is non-critical; form will show empty list
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchProperties();
  }, [fetchRequests, fetchProperties]);

  const handleFormSuccess = () => {
    setShowNewForm(false);
    fetchRequests();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F1" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#C4A882" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Wrench className="w-6 h-6" style={{ color: "#8B7355" }} />
            <h1
              className="text-xl font-bold"
              style={{
                fontFamily: "DM Serif Display, serif",
                color: "#8B7355",
              }}
            >
              Maintenance Requests
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-sm hidden sm:inline hover:opacity-80 transition-opacity"
              style={{
                fontFamily: "Inter, sans-serif",
                color: "#A0926B",
              }}
            >
              Dashboard
            </Link>
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
              style={{
                fontFamily: "Inter, sans-serif",
                backgroundColor: "#C4A882",
              }}
              aria-label="Create new maintenance request"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Request</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Page-level loading */}
        {loading && requests.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2
              className="w-10 h-10 animate-spin"
              style={{ color: "#8B7355" }}
            />
          </div>
        ) : (
          <MaintenanceRequestList
            requests={requests}
            loading={loading}
            error={error}
            onRefresh={fetchRequests}
          />
        )}
      </main>

      {/* New Request Modal */}
      {showNewForm && (
        <MaintenanceRequestForm
          properties={properties}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowNewForm(false)}
        />
      )}
    </div>
  );
};
