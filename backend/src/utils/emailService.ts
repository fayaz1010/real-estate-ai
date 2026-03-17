// Email Service - Comprehensive SMTP Email Integration
// Handles email verification, password reset, 2FA notifications, and all 8 inspection notification types
import nodemailer from "nodemailer";

import { config } from "../config/env";

// ─── Design System Constants ─────────────────────────────────────────────────
export const COLORS = {
  primary: "#091a2b",
  secondary: "#005163",
  accent: "#3b4876",
  background: "#f1f3f4",
  textPrimary: "#091a2b",
  textMuted: "#6b7280",
  white: "#ffffff",
  border: "#e5e7eb",
};

export const FONTS = {
  display: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
  body: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
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
    console.warn(
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
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
    console.log(
      `[EmailService] Transporter initialized (host: ${config.smtp.host}, port: ${config.smtp.port})`,
    );
  }
  return transporter;
}

// ─── Email Template Wrapper ─────────────────────────────────────────────────
export function wrapEmailTemplate(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.background}; font-family: ${FONTS.body};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.background}; padding: 32px 0;">
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
            <td style="padding: 20px 32px; background-color: ${COLORS.background}; border-top: 1px solid ${COLORS.border}; text-align: center;">
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
        <td style="border-radius: 6px; background-color: ${COLORS.secondary};">
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
    <div style="padding: 12px 16px; background-color: ${COLORS.background}; border-left: 4px solid ${COLORS.accent}; border-radius: 4px; margin: 12px 0;">
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
    console.error("[EmailService] Rate limit error:", error.message);
    throw error;
  }

  const mailOptions = {
    from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  // In development without SMTP credentials, log instead of sending
  if (config.nodeEnv === "development" && !config.smtp.user) {
    console.log("[EmailService] [DEV] Email would be sent:", {
      to: options.to,
      subject: options.subject,
    });
    return;
  }

  try {
    const transport = getTransporter();
    const info = await transport.sendMail(mailOptions);
    console.log(
      `[EmailService] Email sent successfully to ${maskEmail(options.to)} (messageId: ${info.messageId})`,
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown email error";
    console.error(
      `[EmailService] Failed to send email to ${maskEmail(options.to)}:`,
      message,
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
    ${vars.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${vars.meetingLink}" style="color: ${COLORS.secondary};">${vars.meetingLink}</a></p>` : ""}
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
    ${vars.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${vars.meetingLink}" style="color: ${COLORS.secondary};">${vars.meetingLink}</a></p>` : ""}
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
