import React from 'react';
import { Mail, CheckSquare, Building, MessageSquare, GripVertical, Trash2 } from 'lucide-react';
import type { WorkflowStep, WorkflowStepType } from '../../types/workflow';

const STEP_TYPES: { value: WorkflowStepType; label: string; icon: React.ReactNode }[] = [
  { value: 'send_email', label: 'Send Email', icon: <Mail className="w-4 h-4" /> },
  { value: 'create_task', label: 'Create Task', icon: <CheckSquare className="w-4 h-4" /> },
  { value: 'update_property', label: 'Update Property', icon: <Building className="w-4 h-4" /> },
  { value: 'send_sms', label: 'Send SMS', icon: <MessageSquare className="w-4 h-4" /> },
];

interface WorkflowStepEditorProps {
  step: WorkflowStep;
  onChange: (step: WorkflowStep) => void;
  onRemove: () => void;
}

const EmailConfig: React.FC<{ config: Record<string, unknown>; onChange: (config: Record<string, unknown>) => void }> = ({ config, onChange }) => (
  <div className="space-y-3">
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>Recipient</label>
      <input
        type="email"
        value={(config.recipient as string) || ''}
        onChange={(e) => onChange({ ...config, recipient: e.target.value })}
        placeholder="e.g. tenant@example.com or {{tenant.email}}"
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>Subject</label>
      <input
        type="text"
        value={(config.subject as string) || ''}
        onChange={(e) => onChange({ ...config, subject: e.target.value })}
        placeholder="Email subject"
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>Body</label>
      <textarea
        value={(config.body as string) || ''}
        onChange={(e) => onChange({ ...config, body: e.target.value })}
        placeholder="Email body content..."
        rows={3}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none resize-none"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      />
    </div>
  </div>
);

const TaskConfig: React.FC<{ config: Record<string, unknown>; onChange: (config: Record<string, unknown>) => void }> = ({ config, onChange }) => (
  <div className="space-y-3">
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>Task Title</label>
      <input
        type="text"
        value={(config.title as string) || ''}
        onChange={(e) => onChange({ ...config, title: e.target.value })}
        placeholder="Task title"
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>Description</label>
      <textarea
        value={(config.description as string) || ''}
        onChange={(e) => onChange({ ...config, description: e.target.value })}
        placeholder="Task description..."
        rows={2}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none resize-none"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>Assignee</label>
      <input
        type="text"
        value={(config.assignee as string) || ''}
        onChange={(e) => onChange({ ...config, assignee: e.target.value })}
        placeholder="Assigned to"
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      />
    </div>
  </div>
);

const PropertyUpdateConfig: React.FC<{ config: Record<string, unknown>; onChange: (config: Record<string, unknown>) => void }> = ({ config, onChange }) => (
  <div className="space-y-3">
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>Field to Update</label>
      <select
        value={(config.field as string) || ''}
        onChange={(e) => onChange({ ...config, field: e.target.value })}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        <option value="">Select field...</option>
        <option value="status">Status</option>
        <option value="featured">Featured</option>
        <option value="description">Description</option>
      </select>
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>New Value</label>
      <input
        type="text"
        value={(config.value as string) || ''}
        onChange={(e) => onChange({ ...config, value: e.target.value })}
        placeholder="New value"
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      />
    </div>
  </div>
);

const SmsConfig: React.FC<{ config: Record<string, unknown>; onChange: (config: Record<string, unknown>) => void }> = ({ config, onChange }) => (
  <div className="space-y-3">
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>Phone Number</label>
      <input
        type="tel"
        value={(config.phone as string) || ''}
        onChange={(e) => onChange({ ...config, phone: e.target.value })}
        placeholder="e.g. +61400000000 or {{tenant.phone}}"
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>Message</label>
      <textarea
        value={(config.message as string) || ''}
        onChange={(e) => onChange({ ...config, message: e.target.value })}
        placeholder="SMS message content..."
        rows={3}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#3b4876] focus:ring-1 focus:ring-[#3b4876] outline-none resize-none"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      />
    </div>
  </div>
);

const CONFIG_FORMS: Record<WorkflowStepType, React.FC<{ config: Record<string, unknown>; onChange: (config: Record<string, unknown>) => void }>> = {
  send_email: EmailConfig,
  create_task: TaskConfig,
  update_property: PropertyUpdateConfig,
  send_sms: SmsConfig,
};

export const WorkflowStepEditor: React.FC<WorkflowStepEditorProps> = ({ step, onChange, onRemove }) => {
  const ConfigForm = CONFIG_FORMS[step.type];

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
          <span className="text-xs font-bold text-[#3b4876] bg-[#3b4876]/10 px-2 py-0.5 rounded" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Step {step.order}
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          aria-label="Remove step"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-500 mb-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>Action Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STEP_TYPES.map((st) => (
            <button
              key={st.value}
              type="button"
              onClick={() => onChange({ ...step, type: st.value, configuration: {} })}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                step.type === st.value
                  ? 'bg-[#3b4876] text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              {st.icon}
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <ConfigForm config={step.configuration} onChange={(configuration) => onChange({ ...step, configuration })} />
    </div>
  );
};
