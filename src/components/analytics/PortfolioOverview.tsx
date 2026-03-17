import React from 'react';
import {
  Building2,
  DoorClosed,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Percent,
} from 'lucide-react';
import type { PortfolioMetrics } from '../../types/analytics';

interface PortfolioOverviewProps {
  metrics: PortfolioMetrics;
}

const metricCards = [
  {
    key: 'totalProperties' as const,
    label: 'Total Properties',
    icon: Building2,
    format: (v: number) => v.toLocaleString(),
    color: '#091a2b',
  },
  {
    key: 'totalUnits' as const,
    label: 'Total Units',
    icon: DoorClosed,
    format: (v: number) => v.toLocaleString(),
    color: '#005163',
  },
  {
    key: 'occupancyRate' as const,
    label: 'Occupancy Rate',
    icon: Users,
    format: (v: number) => `${v}%`,
    color: '#0e7c3a',
  },
  {
    key: 'avgRent' as const,
    label: 'Average Rent',
    icon: DollarSign,
    format: (v: number) => `$${v.toLocaleString()}`,
    color: '#3b4876',
  },
  {
    key: 'totalRevenue' as const,
    label: 'Total Revenue',
    icon: TrendingUp,
    format: (v: number) => `$${v.toLocaleString()}`,
    color: '#0e7c3a',
  },
  {
    key: 'totalExpenses' as const,
    label: 'Total Expenses',
    icon: TrendingDown,
    format: (v: number) => `$${v.toLocaleString()}`,
    color: '#b91c1c',
  },
  {
    key: 'noi' as const,
    label: 'Net Operating Income',
    icon: PieChart,
    format: (v: number) => `$${v.toLocaleString()}`,
    color: '#005163',
  },
  {
    key: 'capRate' as const,
    label: 'Cap Rate',
    icon: Percent,
    format: (v: number) => `${v}%`,
    color: '#3b4876',
  },
];

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((card) => {
        const Icon = card.icon;
        const value = metrics[card.key];
        return (
          <div
            key={card.key}
            className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#5a6a7a', fontFamily: 'Open Sans, sans-serif' }}
              >
                {card.label}
              </span>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${card.color}12` }}
              >
                <Icon size={18} style={{ color: card.color }} />
              </div>
            </div>
            <p
              className="text-2xl font-bold"
              style={{ color: '#091a2b', fontFamily: 'Montserrat, sans-serif' }}
            >
              {card.format(value)}
            </p>
          </div>
        );
      })}
    </div>
  );
};
