import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ScreeningDashboard } from "@/components/screening/ScreeningDashboard";
import { ScreeningRequestForm } from "@/components/screening/ScreeningRequestForm";
import { Button } from "@/components/ui/button";

const mockProperties = [
  {
    id: "1",
    title: "Sunset Apartments #201",
    address: "123 Sunset Blvd, Los Angeles, CA",
  },
  { id: "2", title: "Downtown Loft", address: "456 Main St, New York, NY" },
  {
    id: "3",
    title: "Parkview Residence",
    address: "789 Park Ave, Chicago, IL",
  },
];

export const ScreeningIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: "#091a2b",
              }}
            >
              Tenant Screening
            </h1>
            <p
              className="text-gray-500 mt-1"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Manage and review tenant screening requests
            </p>
          </div>
          <Button onClick={() => setShowForm((prev) => !prev)}>
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            {showForm ? "View Dashboard" : "New Screening Request"}
          </Button>
        </div>

        {/* Content */}
        {showForm ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-xl">
            <h2
              className="text-xl font-semibold mb-6"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: "#091a2b",
              }}
            >
              New Screening Request
            </h2>
            <ScreeningRequestForm
              properties={mockProperties}
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : (
          <ScreeningDashboard
            onViewReport={(id) => navigate(`/screening/${id}`)}
          />
        )}
      </div>
    </div>
  );
};

export default ScreeningIndexPage;
