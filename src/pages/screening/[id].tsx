import { ArrowLeft } from "lucide-react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ScreeningReport } from "@/components/screening/ScreeningReport";
import { Button } from "@/components/ui/button";

export const ScreeningDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center">
        <p
          className="text-gray-500"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          Invalid screening request ID.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/screening")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Screening
        </Button>

        <ScreeningReport requestId={id} />
      </div>
    </div>
  );
};

export default ScreeningDetailsPage;
