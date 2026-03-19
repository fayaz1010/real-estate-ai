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
} from "./emailService";

export type { InspectionEmailVars } from "./emailService";
