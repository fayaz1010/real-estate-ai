import React from 'react';
import { Play, Edit, Trash2, Calendar, Clock, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Workflow } from '../../types/workflow';

const TRIGGER_LABELS: Record<string, string> = {
  event: 'Event-based',
  schedule: 'Scheduled',
  manual: 'Manual',
};

const EVENT_LABELS: Record<string, string> = {
  lease_expiring: 'Lease Expiring',
  rent_overdue: 'Rent Overdue',
  maintenance_request_created: 'Maintenance Request',
  tenant_application_received: 'New Application',
};

function formatDate(date: Date | string | undefined): string {
  if (!date) return 'Never';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface WorkflowListProps {
  workflows: Workflow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onExecute: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

export const WorkflowList: React.FC<WorkflowListProps> = ({
  workflows,
  onEdit,
  onDelete,
  onExecute,
  onToggle,
}) => {
  if (workflows.length === 0) {
    return (
      <div className="text-center py-16">
        <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#091a2b] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          No workflows yet
        </h3>
        <p className="text-sm text-gray-500" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Create your first workflow to automate your property management tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workflows.map((workflow) => (
        <div
          key={workflow.id}
          className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-bold text-[#091a2b] truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {workflow.name}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  workflow.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`} style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {workflow.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              {workflow.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {workflow.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {TRIGGER_LABELS[workflow.triggerType] || workflow.triggerType}
                  {workflow.triggerEvent && ` — ${EVENT_LABELS[workflow.triggerEvent] || workflow.triggerEvent}`}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Last run: {formatDate(workflow.lastRunAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {workflow.steps.length} step{workflow.steps.length !== 1 ? 's' : ''}
                </span>
                <span>Runs: {workflow.runCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => onToggle(workflow.id, !workflow.enabled)}
                className="p-2 rounded-md text-gray-400 hover:text-[#3b4876] hover:bg-gray-50 transition-colors"
                title={workflow.enabled ? 'Disable' : 'Enable'}
              >
                {workflow.enabled ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
              {workflow.triggerType === 'manual' && (
                <button
                  type="button"
                  onClick={() => onExecute(workflow.id)}
                  className="p-2 rounded-md text-gray-400 hover:text-[#091a2b] hover:bg-[#091a2b]/5 transition-colors"
                  title="Execute workflow"
                >
                  <Play className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onEdit(workflow.id)}
                className="p-2 rounded-md text-gray-400 hover:text-[#3b4876] hover:bg-[#3b4876]/5 transition-colors"
                title="Edit workflow"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(workflow.id)}
                className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Delete workflow"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
