import React from "react";

import PredictiveMaintenanceDashboard from "@/components/maintenance/PredictiveMaintenanceDashboard";

const PredictiveMaintenancePage: React.FC = () => {
  // Replace with actual property ID from context or route params
  const propertyId = "your-property-id";

  return (
    <div>
      <PredictiveMaintenanceDashboard propertyId={propertyId} />
    </div>
  );
};

export default PredictiveMaintenancePage;
