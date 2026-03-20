// Email Service - Re-exports from emailService.ts
// This file maintains backward compatibility for existing imports
export {
  COLORS,
  FONTS,
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  send2FAEnabledEmail,
  sendNotificationEmail,
  sendTestEmail,
  verifyEmailConnection,
  wrapEmailTemplate,
  sendInspectionConfirmationEmail,
  sendInspectionReminderEmail,
  sendInspectionCancellationEmail,
  sendInspectionRescheduleEmail,
  sendInspectionCheckInEmail,
  sendInspectionCheckOutEmail,
  sendInspectionFollowUpEmail,
  sendInspectionNoShowEmail,
  INSPECTION_EMAIL_SENDERS,
  sendMaintenanceRequestEmail,
  sendMaintenanceStatusUpdateEmail,
  sendLeaseRenewalReminderEmail,
  sendLeaseRenewalConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendPaymentFailedEmail,
} from "./emailService";

export type {
  InspectionEmailVars,
  MaintenanceEmailVars,
  LeaseRenewalEmailVars,
  PaymentEmailVars,
} from "./emailService";
