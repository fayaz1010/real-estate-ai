// PLACEHOLDER FILE: components\Verification\VerificationBadge.tsx
// TODO: Add your implementation here

import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Loader } from 'lucide-react';
import { VerificationStatus } from '../../types/application.types';

interface VerificationBadgeProps {
  status: VerificationStatus;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  status, 
  label,
  size = 'md',
  showIcon = true,
  showLabel = true,
}) => {
  const getConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          iconColor: 'text-green-600',
          text: label || 'Verified',
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          iconColor: 'text-red-600',
          text: label || 'Failed',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          iconColor: 'text-yellow-600',
          text: label || 'Pending',
        };
      case 'in_progress':
        return {
          icon: Loader,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          iconColor: 'text-blue-600',
          text: label || 'In Progress',
          animate: true,
        };
      case 'manual_review':
        return {
          icon: AlertTriangle,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          iconColor: 'text-purple-600',
          text: label || 'Manual Review',
        };
      case 'not_started':
      default:
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          iconColor: 'text-gray-600',
          text: label || 'Not Started',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      badge: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
    },
    md: {
      badge: 'px-3 py-1 text-sm',
      icon: 'w-4 h-4',
    },
    lg: {
      badge: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
    },
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${config.color} ${sizeClasses[size].badge}`}>
      {showIcon && (
        <Icon className={`${sizeClasses[size].icon} ${config.iconColor} ${config.animate ? 'animate-spin' : ''} ${showLabel ? 'mr-1.5' : ''}`} />
      )}
      {showLabel && config.text}
    </span>
  );
};

export default VerificationBadge;