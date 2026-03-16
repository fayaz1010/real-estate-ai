import React from 'react';
import { SystemRisk } from '../types';

interface RiskHeatMapProps {
  risks: SystemRisk[];
}

function getRiskColor(level: number): string {
  if (level >= 0.8) return 'bg-red-500';
  if (level >= 0.6) return 'bg-orange-500';
  if (level >= 0.4) return 'bg-yellow-500';
  if (level >= 0.2) return 'bg-green-400';
  return 'bg-green-300';
}

function getRiskTextColor(level: number): string {
  if (level >= 0.6) return 'text-white';
  return 'text-gray-900';
}

function getRiskLabel(level: number): string {
  if (level >= 0.8) return 'Critical';
  if (level >= 0.6) return 'High';
  if (level >= 0.4) return 'Medium';
  if (level >= 0.2) return 'Low';
  return 'Minimal';
}

const SYSTEM_ICONS: Record<string, string> = {
  HVAC: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  PLUMBING: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  ELECTRICAL: 'M13 10V3L4 14h7v7l9-11h-7z',
  ROOFING: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  APPLIANCE: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  STRUCTURAL: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
};

function getSystemLabel(type: string): string {
  const labels: Record<string, string> = {
    HVAC: 'HVAC',
    PLUMBING: 'Plumbing',
    ELECTRICAL: 'Electrical',
    ROOFING: 'Roofing',
    APPLIANCE: 'Appliances',
    STRUCTURAL: 'Structural',
  };
  return labels[type] ?? type;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const RiskHeatMap: React.FC<RiskHeatMapProps> = ({ risks }) => {
  const sortedRisks = [...risks].sort((a, b) => b.riskLevel - a.riskLevel);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="font-display text-lg font-semibold" style={{ color: '#091a2b' }}>
        System Risk Overview
      </h3>
      <p className="mt-1 font-body text-sm text-gray-500">
        Risk levels across all property systems
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sortedRisks.map((risk) => (
          <div
            key={risk.systemType}
            className={`relative overflow-hidden rounded-lg p-4 ${getRiskColor(risk.riskLevel)}`}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <svg
                  className={`h-5 w-5 ${getRiskTextColor(risk.riskLevel)}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={SYSTEM_ICONS[risk.systemType]}
                  />
                </svg>
                <span
                  className={`font-body text-sm font-semibold ${getRiskTextColor(risk.riskLevel)}`}
                >
                  {getSystemLabel(risk.systemType)}
                </span>
              </div>
              <div className="mt-2">
                <span
                  className={`font-body text-2xl font-bold ${getRiskTextColor(risk.riskLevel)}`}
                >
                  {Math.round(risk.riskLevel * 100)}%
                </span>
                <span
                  className={`ml-1 font-body text-xs ${getRiskTextColor(risk.riskLevel)} opacity-80`}
                >
                  {getRiskLabel(risk.riskLevel)}
                </span>
              </div>
              <div className={`mt-2 font-body text-xs ${getRiskTextColor(risk.riskLevel)} opacity-75`}>
                <div>Last: {formatDate(risk.lastMaintenance)}</div>
                <div>Next: {formatDate(risk.nextPredicted)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
