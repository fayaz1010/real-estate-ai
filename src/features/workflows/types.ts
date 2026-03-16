import { z } from 'zod';

export enum WorkflowTriggerType {
  MANUAL = 'MANUAL',
  NEW_TENANT = 'NEW_TENANT',
  LEASE_EXPIRY = 'LEASE_EXPIRY',
  MAINTENANCE_REQUEST = 'MAINTENANCE_REQUEST',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  SCHEDULED = 'SCHEDULED',
}

export enum WorkflowExecutionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export type WorkflowStepType =
  | 'send_email'
  | 'create_task'
  | 'update_property'
  | 'send_notification'
  | 'change_subscription_tier'
  | 'optimize_listing_seo';

export interface SendEmailConfig {
  recipient: string;
  subject: string;
  body: string;
}

export interface CreateTaskConfig {
  assignee: string;
  dueDate: string;
  description: string;
}

export interface UpdatePropertyConfig {
  propertyId: string;
  field: string;
  value: string;
}

export interface SendNotificationConfig {
  recipientType: 'tenant' | 'landlord' | 'agent';
  recipientId: string;
  message: string;
}

export interface ChangeSubscriptionTierConfig {
  userId: string;
  newTier: 'Starter' | 'Professional' | 'Business' | 'Enterprise';
}

export interface OptimizeListingSEOConfig {
  propertyId: string;
  keywords: string[];
}

export type StepConfiguration =
  | SendEmailConfig
  | CreateTaskConfig
  | UpdatePropertyConfig
  | SendNotificationConfig
  | ChangeSubscriptionTierConfig
  | OptimizeListingSEOConfig;

export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  configuration: StepConfiguration;
}

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description?: string;
  triggerType: WorkflowTriggerType;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: WorkflowExecutionStatus;
  log?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Zod Schemas

export const sendEmailConfigSchema = z.object({
  recipient: z.string().min(1, 'Recipient is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
});

export const createTaskConfigSchema = z.object({
  assignee: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  description: z.string().min(1, 'Description is required'),
});

export const updatePropertyConfigSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  field: z.string().min(1, 'Field is required'),
  value: z.string().min(1, 'Value is required'),
});

export const sendNotificationConfigSchema = z.object({
  recipientType: z.enum(['tenant', 'landlord', 'agent']),
  recipientId: z.string().min(1, 'Recipient ID is required'),
  message: z.string().min(1, 'Message is required'),
});

export const changeSubscriptionTierConfigSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  newTier: z.enum(['Starter', 'Professional', 'Business', 'Enterprise']),
});

export const optimizeListingSEOConfigSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
});

export const workflowStepSchema = z.object({
  id: z.string(),
  type: z.enum([
    'send_email',
    'create_task',
    'update_property',
    'send_notification',
    'change_subscription_tier',
    'optimize_listing_seo',
  ]),
  configuration: z.any(),
});

export const workflowSchema = z.object({
  name: z.string().min(3, 'Workflow name must be at least 3 characters'),
  description: z.string().optional(),
  triggerType: z.nativeEnum(WorkflowTriggerType),
  steps: z.array(workflowStepSchema).min(1, 'At least one step is required'),
  isActive: z.boolean().default(true),
});

export type WorkflowFormData = z.infer<typeof workflowSchema>;

export const STEP_TYPE_LABELS: Record<WorkflowStepType, string> = {
  send_email: 'Send Email',
  create_task: 'Create Task',
  update_property: 'Update Property',
  send_notification: 'Send Notification',
  change_subscription_tier: 'Change Subscription Tier',
  optimize_listing_seo: 'Optimize Listing SEO',
};

export const TRIGGER_TYPE_LABELS: Record<WorkflowTriggerType, string> = {
  [WorkflowTriggerType.MANUAL]: 'Manual',
  [WorkflowTriggerType.NEW_TENANT]: 'New Tenant',
  [WorkflowTriggerType.LEASE_EXPIRY]: 'Lease Expiry',
  [WorkflowTriggerType.MAINTENANCE_REQUEST]: 'Maintenance Request',
  [WorkflowTriggerType.PAYMENT_RECEIVED]: 'Payment Received',
  [WorkflowTriggerType.SCHEDULED]: 'Scheduled',
};

export const PRICING_TIERS = {
  Starter: { price: 49, units: 25, label: 'Starter' },
  Professional: { price: 149, units: 100, label: 'Professional' },
  Business: { price: 399, units: 500, label: 'Business' },
  Enterprise: { price: 800, units: -1, label: 'Enterprise' },
} as const;

export const SEO_KEYWORDS = [
  'property management software',
  'AI property management',
  'rental management software',
  'landlord software',
  'tenant screening software',
  'property management automation',
  'best property management software for landlords',
  'property management software pricing',
  'automated rent collection software',
  'property management AI tools',
] as const;
