import { WorkflowTriggerType, type WorkflowStep } from "../types";

export interface WorkflowTemplate {
  name: string;
  description: string;
  triggerType: WorkflowTriggerType;
  steps: WorkflowStep[];
  category: string;
}

export const defaultWorkflows: WorkflowTemplate[] = [
  {
    name: "Welcome New Tenant",
    description: "Sends a welcome email to new tenants after they are created.",
    triggerType: WorkflowTriggerType.NEW_TENANT,
    category: "Tenant Management",
    steps: [
      {
        id: "welcome-1",
        type: "send_email",
        configuration: {
          recipient: "{{tenant.email}}",
          subject: "Welcome to Your New Home!",
          body: "Dear {{tenant.firstName}},\n\nWelcome! We are thrilled to have you as a new tenant. Here is everything you need to know to get started:\n\n- Move-in date: {{lease.startDate}}\n- Property address: {{property.address}}\n- Emergency contact: {{landlord.phone}}\n\nPlease do not hesitate to reach out if you have any questions.\n\nBest regards,\nProperty Management Team",
        },
      },
      {
        id: "welcome-2",
        type: "create_task",
        configuration: {
          assignee: "{{landlord.id}}",
          dueDate: "{{lease.startDate}}",
          description:
            "Prepare welcome package and key handover for {{tenant.firstName}} {{tenant.lastName}} at {{property.address}}",
        },
      },
      {
        id: "welcome-3",
        type: "send_notification",
        configuration: {
          recipientType: "landlord",
          recipientId: "{{landlord.id}}",
          message:
            "New tenant {{tenant.firstName}} {{tenant.lastName}} has been added to {{property.address}}. Lease starts on {{lease.startDate}}.",
        },
      },
    ],
  },
  {
    name: "Lease Expiry Reminder",
    description:
      "Reminds tenants and landlords about upcoming lease expirations 30 days before the end date.",
    triggerType: WorkflowTriggerType.LEASE_EXPIRY,
    category: "Lease Management",
    steps: [
      {
        id: "lease-exp-1",
        type: "send_email",
        configuration: {
          recipient: "{{tenant.email}}",
          subject: "Your Lease is Expiring Soon - Action Required",
          body: "Dear {{tenant.firstName}},\n\nThis is a friendly reminder that your lease for {{property.address}} expires on {{lease.endDate}}.\n\nPlease let us know if you would like to:\n1. Renew your lease\n2. Discuss new terms\n3. Plan your move-out\n\nPlease respond within 14 days so we can plan accordingly.\n\nBest regards,\nProperty Management Team",
        },
      },
      {
        id: "lease-exp-2",
        type: "send_notification",
        configuration: {
          recipientType: "landlord",
          recipientId: "{{landlord.id}}",
          message:
            "Lease for {{tenant.firstName}} {{tenant.lastName}} at {{property.address}} expires on {{lease.endDate}}. Follow up on renewal.",
        },
      },
      {
        id: "lease-exp-3",
        type: "create_task",
        configuration: {
          assignee: "{{landlord.id}}",
          dueDate: "{{lease.endDate}}",
          description:
            "Follow up on lease renewal for {{property.address}} - Tenant: {{tenant.firstName}} {{tenant.lastName}}",
        },
      },
    ],
  },
  {
    name: "Maintenance Request Handler",
    description:
      "Creates a task and notifies the landlord when a new maintenance request is submitted.",
    triggerType: WorkflowTriggerType.MAINTENANCE_REQUEST,
    category: "Maintenance",
    steps: [
      {
        id: "maint-1",
        type: "create_task",
        configuration: {
          assignee: "{{landlord.id}}",
          dueDate: "{{dueDate}}",
          description:
            "Maintenance request from {{tenant.firstName}}: {{maintenanceRequest.description}} at {{property.address}}",
        },
      },
      {
        id: "maint-2",
        type: "send_notification",
        configuration: {
          recipientType: "landlord",
          recipientId: "{{landlord.id}}",
          message:
            "New maintenance request at {{property.address}}: {{maintenanceRequest.description}}. Priority: {{maintenanceRequest.priority}}",
        },
      },
      {
        id: "maint-3",
        type: "send_email",
        configuration: {
          recipient: "{{tenant.email}}",
          subject: "Maintenance Request Received - {{property.address}}",
          body: 'Dear {{tenant.firstName}},\n\nWe have received your maintenance request:\n\n"{{maintenanceRequest.description}}"\n\nOur team will review and address this promptly. You will receive updates as progress is made.\n\nThank you for reporting this issue.\n\nBest regards,\nProperty Management Team',
        },
      },
    ],
  },
  {
    name: "Payment Received Confirmation",
    description:
      "Sends a thank-you email and notification after a rent payment is received.",
    triggerType: WorkflowTriggerType.PAYMENT_RECEIVED,
    category: "Payments",
    steps: [
      {
        id: "payment-1",
        type: "send_email",
        configuration: {
          recipient: "{{tenant.email}}",
          subject: "Payment Received - Thank You!",
          body: "Dear {{tenant.firstName}},\n\nWe have received your payment of {{payment.amount}} for {{property.address}}.\n\nPayment details:\n- Amount: {{payment.amount}}\n- Date: {{payment.date}}\n- Receipt: {{payment.receiptUrl}}\n\nThank you for your timely payment!\n\nBest regards,\nProperty Management Team",
        },
      },
      {
        id: "payment-2",
        type: "send_notification",
        configuration: {
          recipientType: "landlord",
          recipientId: "{{landlord.id}}",
          message:
            "Payment of {{payment.amount}} received from {{tenant.firstName}} {{tenant.lastName}} for {{property.address}}.",
        },
      },
    ],
  },
  {
    name: "Push Notification for Late Payments",
    description:
      "Sends push notifications for time-sensitive late payment alerts.",
    triggerType: WorkflowTriggerType.SCHEDULED,
    category: "Payments",
    steps: [
      {
        id: "late-pay-1",
        type: "send_notification",
        configuration: {
          recipientType: "tenant",
          recipientId: "{{tenant.id}}",
          message:
            "Reminder: Your rent payment of {{payment.amount}} for {{property.address}} is overdue. Please make your payment as soon as possible to avoid late fees.",
        },
      },
      {
        id: "late-pay-2",
        type: "send_notification",
        configuration: {
          recipientType: "landlord",
          recipientId: "{{landlord.id}}",
          message:
            "Late payment alert: {{tenant.firstName}} {{tenant.lastName}} has an overdue payment of {{payment.amount}} for {{property.address}}.",
        },
      },
    ],
  },
  {
    name: "SEO Listing Optimizer",
    description:
      "Optimizes property listing SEO based on high-intent commercial keywords and market data.",
    triggerType: WorkflowTriggerType.MANUAL,
    category: "Marketing",
    steps: [
      {
        id: "seo-1",
        type: "optimize_listing_seo",
        configuration: {
          propertyId: "{{property.id}}",
          keywords: [
            "property management software",
            "AI property management",
            "rental management software",
            "landlord software",
            "automated rent collection software",
          ],
        },
      },
      {
        id: "seo-2",
        type: "send_notification",
        configuration: {
          recipientType: "landlord",
          recipientId: "{{landlord.id}}",
          message:
            "SEO optimization completed for {{property.address}}. Keywords updated to improve search visibility.",
        },
      },
    ],
  },
  {
    name: "Subscription Upgrade Prompt",
    description:
      "Prompts users to upgrade their subscription when they hit plan limits.",
    triggerType: WorkflowTriggerType.MANUAL,
    category: "Subscription",
    steps: [
      {
        id: "sub-1",
        type: "send_email",
        configuration: {
          recipient: "{{user.email}}",
          subject: "Unlock More Features - Upgrade Your Plan",
          body: "Hi {{user.firstName}},\n\nYou are approaching the limits of your current plan. Upgrade to unlock:\n\n- Professional ($149/mo): Up to 100 units, Full AI assistant, Automated tenant screening\n- Business ($399/mo): Up to 500 units, Custom workflows, Advanced AI analytics\n- Enterprise (Custom): Unlimited units, Dedicated AI model training\n\nUpgrade today to continue growing your portfolio!\n\nBest regards,\nRealEstate AI Team",
        },
      },
      {
        id: "sub-2",
        type: "change_subscription_tier",
        configuration: {
          userId: "{{user.id}}",
          newTier: "Professional",
        },
      },
    ],
  },
  {
    name: "Daily AI Dashboard Digest",
    description:
      "Sends a daily digest with vacancy alerts, maintenance predictions, and rent optimization opportunities.",
    triggerType: WorkflowTriggerType.SCHEDULED,
    category: "Engagement",
    steps: [
      {
        id: "digest-1",
        type: "send_email",
        configuration: {
          recipient: "{{user.email}}",
          subject: "Your Daily Property Management Digest",
          body: "Good morning {{user.firstName}},\n\nHere is your daily AI-powered digest:\n\n--- Vacancy Alerts ---\n{{vacancyAlerts}}\n\n--- Maintenance Predictions ---\n{{maintenancePredictions}}\n\n--- Rent Optimization ---\n{{rentOptimization}}\n\n--- Action Items ---\n{{actionItems}}\n\nLog in to your dashboard for full details.\n\nBest regards,\nRealEstate AI",
        },
      },
    ],
  },
];
