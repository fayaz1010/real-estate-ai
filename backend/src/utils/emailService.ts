// Email Service - Comprehensive SMTP Email Integration
// Handles email verification, password reset, 2FA notifications, and all 8 inspection notification types
import nodemailer from "nodemailer";

import { config } from "../config/env";

import logger from "./logger";

// ─── Design System Constants ─────────────────────────────────────────────────
export const COLORS = {
  primary: "#008080",
  secondary: "#E0E0E0",
  accent: "#FF6B35",
  background: "#FFFFFF",
  textPrimary: "#1A1A2E",
  textMuted: "#6b7280",
  white: "#ffffff",
  border: "#e5e7eb",
};

export const FONTS = {
  display: "'Manrope', 'Helvetica Neue', Arial, sans-serif",
  body: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

// ─── Email Rate Limiter (per recipient) ──────────────────────────────────────
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const emailRateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of emailRateLimitStore) {
    if (now >= entry.resetTime) {
      emailRateLimitStore.delete(key);
    }
  }
}, 60000);

function checkEmailRateLimit(recipient: string): boolean {
  const { windowMs, max } = config.emailRateLimit;
  const now = Date.now();
  const entry = emailRateLimitStore.get(recipient);

  if (!entry || now >= entry.resetTime) {
    emailRateLimitStore.set(recipient, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= max) {
    logger.warn(
      `[EmailService] Rate limit exceeded for recipient: ${maskEmail(recipient)}`,
    );
    return false;
  }

  entry.count++;
  return true;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function maskEmail(email: string): string {
  return email.replace(/(.{3}).*(@.*)/, "$1***$2");
}

// ─── Transporter (lazy-initialized) ─────────────────────────────────────────
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    if (!config.smtp.pass) {
      logger.warn(
        "[EmailService] No SMTP password / SendGrid API key configured. Set SENDGRID_API_KEY or SMTP_PASS in .env",
      );
    }

    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 10, // max 10 messages/second to respect SendGrid limits
    });
    logger.info(
      `[EmailService] Transporter initialized (host: ${config.smtp.host}, port: ${config.smtp.port})`,
    );
  }
  return transporter;
}

/**
 * Verify SMTP connection. Call on server startup to catch config errors early.
 * Returns true if connection is valid, false otherwise.
 */
export const verifyEmailConnection = async (): Promise<boolean> => {
  if (config.nodeEnv === "development" && !config.smtp.pass) {
    logger.info(
      "[EmailService] Skipping SMTP verification in dev (no credentials configured)",
    );
    return false;
  }

  try {
    const transport = getTransporter();
    await transport.verify();
    logger.info("[EmailService] SMTP connection verified successfully");
    return true;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown verification error";
    logger.error(
      `[EmailService] SMTP connection verification failed: ${message}`,
    );
    return false;
  }
};

// ─── Email Template Wrapper ─────────────────────────────────────────────────
export function wrapEmailTemplate(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: ${FONTS.body};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F5; padding: 32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: ${COLORS.white}; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: ${COLORS.primary}; padding: 24px 32px; text-align: center;">
              <h1 style="margin: 0; color: ${COLORS.white}; font-family: ${FONTS.display}; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
                RealEstateAI
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px; font-family: ${FONTS.body}; font-size: 15px; line-height: 1.6; color: ${COLORS.textPrimary};">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #F5F5F5; border-top: 1px solid ${COLORS.border}; text-align: center;">
              <p style="margin: 0; font-family: ${FONTS.body}; font-size: 12px; color: ${COLORS.textMuted};">
                &copy; ${new Date().getFullYear()} RealEstateAI. All rights reserved.
              </p>
              <p style="margin: 4px 0 0; font-family: ${FONTS.body}; font-size: 12px; color: ${COLORS.textMuted};">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── CTA Button Builder ─────────────────────────────────────────────────────
function buildCtaButton(url: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px;">
      <tr>
        <td style="border-radius: 6px; background-color: ${COLORS.primary};">
          <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; color: ${COLORS.white}; font-family: ${FONTS.body}; font-size: 15px; font-weight: 600; text-decoration: none;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`;
}

// ─── Info Box Builder ───────────────────────────────────────────────────────
function buildInfoBox(content: string): string {
  return `
    <div style="padding: 12px 16px; background-color: #F5F5F5; border-left: 4px solid ${COLORS.accent}; border-radius: 4px; margin: 12px 0;">
      <p style="margin: 0; font-size: 13px; color: ${COLORS.textPrimary};">${content}</p>
    </div>`;
}

// ─── Core Send Function ─────────────────────────────────────────────────────
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Rate limit check
  if (!checkEmailRateLimit(options.to)) {
    const error = new Error(
      `Email rate limit exceeded for recipient. Max ${config.emailRateLimit.max} emails per ${config.emailRateLimit.windowMs / 60000} minutes.`,
    );
    logger.error("[EmailService] Rate limit error:", error.message);
    throw error;
  }

  const mailOptions = {
    from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
    replyTo: config.smtp.replyToEmail,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  // In development without SMTP credentials, log instead of sending
  if (config.nodeEnv === "development" && !config.smtp.user) {
    logger.info("[EmailService] [DEV] Email would be sent:", {
      to: options.to,
      subject: options.subject,
    });
    return;
  }

  try {
    const transport = getTransporter();
    const info = await transport.sendMail(mailOptions);
    logger.info(
      `[EmailService] Email sent successfully to ${maskEmail(options.to)} (messageId: ${info.messageId})`,
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown email error";
    logger.error(
      `[EmailService] Failed to send email to ${maskEmail(options.to)}: ${message}`,
    );
    throw error;
  }
};

// ─── Auth Emails ────────────────────────────────────────────────────────────

export const sendVerificationEmail = async (
  to: string,
  verificationToken: string,
): Promise<void> => {
  const verifyUrl = `${config.frontendUrl}/verify-email?token=${verificationToken}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Verify Your Email
    </h2>
    <p style="margin: 0 0 12px;">Welcome to RealEstateAI! Please verify your email address to get started.</p>
    <p style="margin: 0 0 24px;">Click the button below to confirm your email:</p>
    ${buildCtaButton(verifyUrl, "Verify Email Address")}
    <p style="margin: 0 0 8px; font-size: 13px; color: ${COLORS.textMuted};">This link expires in 24 hours.</p>
    <p style="margin: 0; font-size: 13px; color: ${COLORS.textMuted};">If you didn't create an account, you can safely ignore this email.</p>
  `;

  await sendEmail({
    to,
    subject: "Verify Your Email – RealEstateAI",
    html: wrapEmailTemplate("Verify Your Email", bodyHtml),
    text: `Welcome to RealEstateAI! Verify your email by visiting: ${verifyUrl} (expires in 24 hours)`,
  });
};

export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string,
): Promise<void> => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Reset Your Password
    </h2>
    <p style="margin: 0 0 12px;">We received a request to reset your password. Click the button below to choose a new one:</p>
    ${buildCtaButton(resetUrl, "Reset Password")}
    <p style="margin: 0 0 8px; font-size: 13px; color: ${COLORS.textMuted};">This link expires in 1 hour.</p>
    <p style="margin: 0; font-size: 13px; color: ${COLORS.textMuted};">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
  `;

  await sendEmail({
    to,
    subject: "Reset Your Password – RealEstateAI",
    html: wrapEmailTemplate("Reset Your Password", bodyHtml),
    text: `Reset your password by visiting: ${resetUrl} (expires in 1 hour). If you didn't request this, ignore this email.`,
  });
};

export const send2FAEnabledEmail = async (to: string): Promise<void> => {
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Two-Factor Authentication Enabled
    </h2>
    <p style="margin: 0 0 12px;">Two-factor authentication has been successfully enabled on your account.</p>
    <p style="margin: 0 0 12px;">From now on, you will need your authenticator app to sign in.</p>
    ${buildInfoBox("<strong>Security Notice:</strong> If you did not enable 2FA, please contact our support team immediately and change your password.")}
  `;

  await sendEmail({
    to,
    subject: "Two-Factor Authentication Enabled – RealEstateAI",
    html: wrapEmailTemplate("2FA Enabled", bodyHtml),
    text: "Two-factor authentication has been enabled on your RealEstateAI account. If you didn't do this, contact support immediately.",
  });
};

// ─── General Notification ───────────────────────────────────────────────────

export const sendNotificationEmail = async (
  to: string,
  title: string,
  message: string,
  ctaUrl?: string,
  ctaLabel?: string,
): Promise<void> => {
  const ctaHtml = ctaUrl && ctaLabel ? buildCtaButton(ctaUrl, ctaLabel) : "";

  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      ${title}
    </h2>
    <p style="margin: 0 0 16px;">${message}</p>
    ${ctaHtml}
  `;

  await sendEmail({
    to,
    subject: `${title} – RealEstateAI`,
    html: wrapEmailTemplate(title, bodyHtml),
    text: `${title}: ${message}${ctaUrl ? ` Visit: ${ctaUrl}` : ""}`,
  });
};

// ─── Inspection Notification Emails (8 templates) ───────────────────────────

export interface InspectionEmailVars {
  userName: string;
  propertyTitle: string;
  date?: string;
  time?: string;
  type?: string;
  meetingLink?: string;
  reminderTime?: string;
  reason?: string;
  newDate?: string;
  newTime?: string;
  tenantName?: string;
}

export const sendInspectionConfirmationEmail = async (
  to: string,
  vars: InspectionEmailVars,
): Promise<void> => {
  const subject = `Inspection Confirmed – ${vars.propertyTitle}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Inspection Confirmed</h2>
    <p>Hi ${vars.userName},</p>
    <p>Your inspection for <strong>${vars.propertyTitle}</strong> has been confirmed.</p>
    <p><strong>Date:</strong> ${vars.date}</p>
    <p><strong>Time:</strong> ${vars.time}</p>
    <p><strong>Type:</strong> ${vars.type}</p>
    ${vars.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${vars.meetingLink}" style="color: ${COLORS.primary};">${vars.meetingLink}</a></p>` : ""}
    <p style="color: ${COLORS.textMuted}; font-size: 13px;">Please arrive on time. If you need to reschedule, please do so at least 24 hours in advance.</p>
  `;

  await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate(subject, bodyHtml),
    text: `Hi ${vars.userName}, your inspection for ${vars.propertyTitle} on ${vars.date} at ${vars.time} has been confirmed.`,
  });
};

export const sendInspectionReminderEmail = async (
  to: string,
  vars: InspectionEmailVars,
): Promise<void> => {
  const subject = `Reminder: Inspection in ${vars.reminderTime} – ${vars.propertyTitle}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Inspection Reminder</h2>
    <p>Hi ${vars.userName},</p>
    <p>This is a reminder that your inspection for <strong>${vars.propertyTitle}</strong> is coming up in <strong>${vars.reminderTime}</strong>.</p>
    <p><strong>Date:</strong> ${vars.date}</p>
    <p><strong>Time:</strong> ${vars.time}</p>
    ${vars.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${vars.meetingLink}" style="color: ${COLORS.primary};">${vars.meetingLink}</a></p>` : ""}
  `;

  await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate(subject, bodyHtml),
    text: `Hi ${vars.userName}, reminder: your inspection for ${vars.propertyTitle} is in ${vars.reminderTime} on ${vars.date} at ${vars.time}.`,
  });
};

export const sendInspectionCancellationEmail = async (
  to: string,
  vars: InspectionEmailVars,
): Promise<void> => {
  const subject = `Inspection Cancelled – ${vars.propertyTitle}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Inspection Cancelled</h2>
    <p>Hi ${vars.userName},</p>
    <p>The inspection for <strong>${vars.propertyTitle}</strong> scheduled on ${vars.date} at ${vars.time} has been cancelled.</p>
    ${vars.reason ? buildInfoBox(`<strong>Reason:</strong> ${vars.reason}`) : ""}
    <p>You can reschedule a new inspection at any time.</p>
  `;

  await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate(subject, bodyHtml),
    text: `Hi ${vars.userName}, your inspection for ${vars.propertyTitle} on ${vars.date} at ${vars.time} has been cancelled.${vars.reason ? ` Reason: ${vars.reason}` : ""}`,
  });
};

export const sendInspectionRescheduleEmail = async (
  to: string,
  vars: InspectionEmailVars,
): Promise<void> => {
  const subject = `Inspection Rescheduled – ${vars.propertyTitle}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Inspection Rescheduled</h2>
    <p>Hi ${vars.userName},</p>
    <p>Your inspection for <strong>${vars.propertyTitle}</strong> has been rescheduled.</p>
    <p><strong>New Date:</strong> ${vars.newDate}</p>
    <p><strong>New Time:</strong> ${vars.newTime}</p>
  `;

  await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate(subject, bodyHtml),
    text: `Hi ${vars.userName}, your inspection for ${vars.propertyTitle} has been rescheduled to ${vars.newDate} at ${vars.newTime}.`,
  });
};

export const sendInspectionCheckInEmail = async (
  to: string,
  vars: InspectionEmailVars,
): Promise<void> => {
  const subject = `Tenant Checked In – ${vars.propertyTitle}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Tenant Checked In</h2>
    <p>Hi ${vars.userName},</p>
    <p><strong>${vars.tenantName}</strong> has checked in for the inspection at <strong>${vars.propertyTitle}</strong>.</p>
    <p><strong>Time:</strong> ${vars.time}</p>
  `;

  await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate(subject, bodyHtml),
    text: `Hi ${vars.userName}, ${vars.tenantName} has checked in for the inspection at ${vars.propertyTitle} at ${vars.time}.`,
  });
};

export const sendInspectionCheckOutEmail = async (
  to: string,
  vars: InspectionEmailVars,
): Promise<void> => {
  const subject = `Inspection Completed – ${vars.propertyTitle}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Inspection Completed</h2>
    <p>Hi ${vars.userName},</p>
    <p>The inspection for <strong>${vars.propertyTitle}</strong> has been completed.</p>
    <p><strong>${vars.tenantName}</strong> has checked out.</p>
  `;

  await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate(subject, bodyHtml),
    text: `Hi ${vars.userName}, the inspection for ${vars.propertyTitle} has been completed. ${vars.tenantName} has checked out.`,
  });
};

export const sendInspectionFollowUpEmail = async (
  to: string,
  vars: InspectionEmailVars,
): Promise<void> => {
  const subject = `How was your inspection? – ${vars.propertyTitle}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">We'd love your feedback!</h2>
    <p>Hi ${vars.userName},</p>
    <p>Thanks for visiting <strong>${vars.propertyTitle}</strong>. We'd love to hear about your experience.</p>
    <p>If you're interested in applying, you can do so directly from your dashboard.</p>
  `;

  await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate(subject, bodyHtml),
    text: `Hi ${vars.userName}, thanks for visiting ${vars.propertyTitle}. We'd love your feedback! You can apply from your dashboard.`,
  });
};

export const sendInspectionNoShowEmail = async (
  to: string,
  vars: InspectionEmailVars,
): Promise<void> => {
  const subject = `Missed Inspection – ${vars.propertyTitle}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">Missed Inspection</h2>
    <p>Hi ${vars.userName},</p>
    <p>It looks like you missed your inspection for <strong>${vars.propertyTitle}</strong> scheduled on ${vars.date} at ${vars.time}.</p>
    <p>If this was a mistake, please reschedule at your earliest convenience.</p>
  `;

  await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate(subject, bodyHtml),
    text: `Hi ${vars.userName}, you missed your inspection for ${vars.propertyTitle} on ${vars.date} at ${vars.time}. Please reschedule at your convenience.`,
  });
};

// ─── Maintenance Request Notification ────────────────────────────────────────

export interface MaintenanceEmailVars {
  userName: string;
  propertyTitle: string;
  requestTitle: string;
  priority: string;
  description: string;
  requestId: string;
  status?: string;
}

export const sendMaintenanceRequestEmail = async (
  to: string,
  vars: MaintenanceEmailVars,
): Promise<void> => {
  const dashboardUrl = `${config.frontendUrl}/maintenance/${vars.requestId}`;
  const priorityColor =
    vars.priority === "urgent" || vars.priority === "emergency"
      ? "#DC2626"
      : vars.priority === "high"
        ? "#F59E0B"
        : COLORS.primary;

  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      New Maintenance Request
    </h2>
    <p>Hi ${vars.userName},</p>
    <p>A new maintenance request has been submitted for <strong>${vars.propertyTitle}</strong>.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 16px 0;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};"><strong>Title:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">${vars.requestTitle}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};"><strong>Priority:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">
          <span style="display: inline-block; padding: 2px 10px; border-radius: 12px; background-color: ${priorityColor}; color: #fff; font-size: 12px; font-weight: 600; text-transform: uppercase;">${vars.priority}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Description:</strong></td>
        <td style="padding: 8px 0;">${vars.description}</td>
      </tr>
    </table>
    ${buildCtaButton(dashboardUrl, "View Request")}
  `;

  await sendEmail({
    to,
    subject: `Maintenance Request: ${vars.requestTitle} – ${vars.propertyTitle}`,
    html: wrapEmailTemplate("New Maintenance Request", bodyHtml),
    text: `Hi ${vars.userName}, a new maintenance request "${vars.requestTitle}" (${vars.priority}) has been submitted for ${vars.propertyTitle}. Description: ${vars.description}. View it at: ${dashboardUrl}`,
  });
};

export const sendMaintenanceStatusUpdateEmail = async (
  to: string,
  vars: MaintenanceEmailVars,
): Promise<void> => {
  const dashboardUrl = `${config.frontendUrl}/maintenance/${vars.requestId}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Maintenance Request Updated
    </h2>
    <p>Hi ${vars.userName},</p>
    <p>The maintenance request <strong>"${vars.requestTitle}"</strong> for <strong>${vars.propertyTitle}</strong> has been updated.</p>
    ${buildInfoBox(`<strong>New Status:</strong> ${vars.status || "Updated"}`)}
    ${buildCtaButton(dashboardUrl, "View Details")}
  `;

  await sendEmail({
    to,
    subject: `Maintenance Update: ${vars.requestTitle} – ${vars.propertyTitle}`,
    html: wrapEmailTemplate("Maintenance Request Updated", bodyHtml),
    text: `Hi ${vars.userName}, the maintenance request "${vars.requestTitle}" for ${vars.propertyTitle} has been updated to: ${vars.status || "Updated"}. View details at: ${dashboardUrl}`,
  });
};

// ─── Lease Renewal Notification ─────────────────────────────────────────────

export interface LeaseRenewalEmailVars {
  userName: string;
  propertyTitle: string;
  leaseEndDate: string;
  renewalDeadline: string;
  monthlyRent: string;
  leaseId: string;
  newTerms?: string;
}

export const sendLeaseRenewalReminderEmail = async (
  to: string,
  vars: LeaseRenewalEmailVars,
): Promise<void> => {
  const renewalUrl = `${config.frontendUrl}/leases/${vars.leaseId}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Lease Renewal Reminder
    </h2>
    <p>Hi ${vars.userName},</p>
    <p>Your lease for <strong>${vars.propertyTitle}</strong> is approaching its end date. Please review the details below and take action before the renewal deadline.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 16px 0;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};"><strong>Lease End Date:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">${vars.leaseEndDate}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};"><strong>Renewal Deadline:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">${vars.renewalDeadline}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Monthly Rent:</strong></td>
        <td style="padding: 8px 0;">${vars.monthlyRent}</td>
      </tr>
    </table>
    ${vars.newTerms ? buildInfoBox(`<strong>Updated Terms:</strong> ${vars.newTerms}`) : ""}
    ${buildCtaButton(renewalUrl, "Review & Renew Lease")}
    <p style="font-size: 13px; color: ${COLORS.textMuted};">If you do not wish to renew, please notify your property manager before the deadline.</p>
  `;

  await sendEmail({
    to,
    subject: `Lease Renewal Reminder – ${vars.propertyTitle}`,
    html: wrapEmailTemplate("Lease Renewal Reminder", bodyHtml),
    text: `Hi ${vars.userName}, your lease for ${vars.propertyTitle} ends on ${vars.leaseEndDate}. Renewal deadline: ${vars.renewalDeadline}. Monthly rent: ${vars.monthlyRent}. Review at: ${renewalUrl}`,
  });
};

export const sendLeaseRenewalConfirmationEmail = async (
  to: string,
  vars: LeaseRenewalEmailVars,
): Promise<void> => {
  const leaseUrl = `${config.frontendUrl}/leases/${vars.leaseId}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Lease Renewed Successfully
    </h2>
    <p>Hi ${vars.userName},</p>
    <p>Great news! Your lease for <strong>${vars.propertyTitle}</strong> has been successfully renewed.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 16px 0;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};"><strong>New End Date:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">${vars.leaseEndDate}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Monthly Rent:</strong></td>
        <td style="padding: 8px 0;">${vars.monthlyRent}</td>
      </tr>
    </table>
    ${buildCtaButton(leaseUrl, "View Lease Details")}
  `;

  await sendEmail({
    to,
    subject: `Lease Renewed – ${vars.propertyTitle}`,
    html: wrapEmailTemplate("Lease Renewed", bodyHtml),
    text: `Hi ${vars.userName}, your lease for ${vars.propertyTitle} has been renewed. New end date: ${vars.leaseEndDate}. Monthly rent: ${vars.monthlyRent}. View at: ${leaseUrl}`,
  });
};

// ─── Payment Confirmation Notification ──────────────────────────────────────

export interface PaymentEmailVars {
  userName: string;
  propertyTitle: string;
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  periodCovered?: string;
  receiptUrl?: string;
}

export const sendPaymentConfirmationEmail = async (
  to: string,
  vars: PaymentEmailVars,
): Promise<void> => {
  const receiptUrl =
    vars.receiptUrl || `${config.frontendUrl}/payments/${vars.transactionId}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Payment Confirmed
    </h2>
    <p>Hi ${vars.userName},</p>
    <p>Your payment has been received and processed successfully.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 16px 0; border: 1px solid ${COLORS.border}; border-radius: 6px;">
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}; background-color: #F5F5F5;"><strong>Property:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}; background-color: #F5F5F5;">${vars.propertyTitle}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border};"><strong>Amount:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border};">
          <span style="font-family: ${FONTS.mono}; font-size: 16px; font-weight: 700; color: ${COLORS.primary};">${vars.amount}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}; background-color: #F5F5F5;"><strong>Date:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}; background-color: #F5F5F5;">${vars.paymentDate}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border};"><strong>Method:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border};">${vars.paymentMethod}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; background-color: #F5F5F5;"><strong>Transaction ID:</strong></td>
        <td style="padding: 12px 16px; background-color: #F5F5F5;"><span style="font-family: ${FONTS.mono}; font-size: 13px;">${vars.transactionId}</span></td>
      </tr>
      ${vars.periodCovered ? `<tr><td style="padding: 12px 16px; border-top: 1px solid ${COLORS.border};"><strong>Period:</strong></td><td style="padding: 12px 16px; border-top: 1px solid ${COLORS.border};">${vars.periodCovered}</td></tr>` : ""}
    </table>
    ${buildCtaButton(receiptUrl, "View Receipt")}
    <p style="font-size: 13px; color: ${COLORS.textMuted};">Keep this email as your payment receipt. If you have any questions about this payment, please contact your property manager.</p>
  `;

  await sendEmail({
    to,
    subject: `Payment Confirmed: ${vars.amount} – ${vars.propertyTitle}`,
    html: wrapEmailTemplate("Payment Confirmed", bodyHtml),
    text: `Hi ${vars.userName}, your payment of ${vars.amount} for ${vars.propertyTitle} on ${vars.paymentDate} has been confirmed. Transaction ID: ${vars.transactionId}. View receipt at: ${receiptUrl}`,
  });
};

export const sendPaymentFailedEmail = async (
  to: string,
  vars: PaymentEmailVars & { failureReason?: string },
): Promise<void> => {
  const retryUrl = `${config.frontendUrl}/payments/retry/${vars.transactionId}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: #DC2626; font-family: ${FONTS.display}; font-size: 20px;">
      Payment Failed
    </h2>
    <p>Hi ${vars.userName},</p>
    <p>We were unable to process your payment for <strong>${vars.propertyTitle}</strong>.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 16px 0;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};"><strong>Amount:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">${vars.amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Date:</strong></td>
        <td style="padding: 8px 0;">${vars.paymentDate}</td>
      </tr>
    </table>
    ${vars.failureReason ? buildInfoBox(`<strong>Reason:</strong> ${vars.failureReason}`) : ""}
    <p>Please update your payment method and try again.</p>
    ${buildCtaButton(retryUrl, "Retry Payment")}
  `;

  await sendEmail({
    to,
    subject: `Payment Failed – ${vars.propertyTitle}`,
    html: wrapEmailTemplate("Payment Failed", bodyHtml),
    text: `Hi ${vars.userName}, your payment of ${vars.amount} for ${vars.propertyTitle} failed.${vars.failureReason ? ` Reason: ${vars.failureReason}` : ""} Please retry at: ${retryUrl}`,
  });
};

// ─── Test Email ────────────────────────────────────────────────────────────
export const sendTestEmail = async (to: string): Promise<void> => {
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Email Configuration Test
    </h2>
    <p style="margin: 0 0 12px;">This is a test email from RealEstateAI.</p>
    <p style="margin: 0 0 12px;">If you received this email, the email service is configured correctly.</p>
    ${buildInfoBox(`<strong>SMTP Host:</strong> ${config.smtp.host}<br/><strong>From:</strong> ${config.smtp.fromEmail}<br/><strong>Sent at:</strong> ${new Date().toISOString()}`)}
  `;

  await sendEmail({
    to,
    subject: "Test Email – RealEstateAI",
    html: wrapEmailTemplate("Email Configuration Test", bodyHtml),
    text: `This is a test email from RealEstateAI. SMTP Host: ${config.smtp.host}. From: ${config.smtp.fromEmail}. Sent at: ${new Date().toISOString()}.`,
  });
};

// ─── Inspection Email Dispatcher ────────────────────────────────────────────
// Maps notification types to their email sender functions for use by the notification service

type InspectionEmailSender = (
  to: string,
  vars: InspectionEmailVars,
) => Promise<void>;

export const INSPECTION_EMAIL_SENDERS: Record<string, InspectionEmailSender> = {
  INSPECTION_CONFIRMATION: sendInspectionConfirmationEmail,
  INSPECTION_REMINDER: sendInspectionReminderEmail,
  INSPECTION_CANCELLATION: sendInspectionCancellationEmail,
  INSPECTION_RESCHEDULE: sendInspectionRescheduleEmail,
  INSPECTION_CHECK_IN: sendInspectionCheckInEmail,
  INSPECTION_CHECK_OUT: sendInspectionCheckOutEmail,
  INSPECTION_FOLLOW_UP: sendInspectionFollowUpEmail,
  INSPECTION_NO_SHOW: sendInspectionNoShowEmail,
};
