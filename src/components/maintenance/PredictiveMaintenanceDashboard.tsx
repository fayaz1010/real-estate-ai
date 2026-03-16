import React, { useState, useEffect } from 'react';
import { getPredictiveMaintenanceInsights, getPropertyRiskScore } from '@/services/predictiveMaintenanceService';
import { PredictiveMaintenanceInsight } from '@/types/maintenance';
import RiskAssessmentCard from './RiskAssessmentCard';
import MaintenanceTimeline from './MaintenanceTimeline';
import AIInsightsPanel from './AIInsightsPanel';

interface PredictiveMaintenanceDashboardProps {
  propertyId: string;
}

const PredictiveMaintenanceDashboard: React.FC<PredictiveMaintenanceDashboardProps> = ({ propertyId }) => {
  const [insights, setInsights] = useState<PredictiveMaintenanceInsight[]>([]);
  const [propertyRiskScore, setPropertyRiskScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const insightsData = await getPredictiveMaintenanceInsights(propertyId);
      const riskScore = await getPropertyRiskScore(propertyId);
      setInsights(insightsData);
      setPropertyRiskScore(riskScore);
      setLoading(false);
    };

    fetchData();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f1f3f4] min-h-screen">
      <h2 className="text-2xl font-display font-bold text-[#091a2b] mb-6">
        Predictive Maintenance Dashboard
      </h2>
      <RiskAssessmentCard propertyId={propertyId} riskScore={propertyRiskScore} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaintenanceTimeline insights={insights} />
        <AIInsightsPanel insights={insights} />
      </div>
    </div>
  );
};

export default PredictiveMaintenanceDashboard;
