// Email Service - Nodemailer Integration
import nodemailer from "nodemailer";

import { config } from "../config/env";

// ─── Design System Constants ─────────────────────────────────────────────────
const COLORS = {
  primary: "#091a2b",
  secondary: "#005163",
  accent: "#3b4876",
  background: "#f1f3f4",
  textPrimary: "#091a2b",
  textMuted: "#6b7280",
  white: "#ffffff",
  border: "#e5e7eb",
};

const FONTS = {
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
      `[EmailService] Rate limit exceeded for recipient: ${recipient.replace(/(.{3}).*(@.*)/, "$1***$2")}`,
    );
    return false;
  }

  entry.count++;
  return true;
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
  }
  return transporter;
}

// ─── Email Template Wrapper ─────────────────────────────────────────────────
function wrapEmailTemplate(title: string, bodyHtml: string): string {
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
      `[EmailService] Email sent successfully to ${options.to.replace(/(.{3}).*(@.*)/, "$1***$2")} (messageId: ${info.messageId})`,
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown email error";
    console.error(`[EmailService] Failed to send email to ${options.to.replace(/(.{3}).*(@.*)/, "$1***$2")}:`, message);
    throw error;
  }
};

// ─── Email Verification ─────────────────────────────────────────────────────
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
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px;">
      <tr>
        <td style="border-radius: 6px; background-color: ${COLORS.secondary};">
          <a href="${verifyUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; color: ${COLORS.white}; font-family: ${FONTS.body}; font-size: 15px; font-weight: 600; text-decoration: none;">
            Verify Email Address
          </a>
        </td>
      </tr>
    </table>
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

// ─── Password Reset ─────────────────────────────────────────────────────────
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
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px;">
      <tr>
        <td style="border-radius: 6px; background-color: ${COLORS.secondary};">
          <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; color: ${COLORS.white}; font-family: ${FONTS.body}; font-size: 15px; font-weight: 600; text-decoration: none;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>
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

// ─── 2FA Enabled Notification ───────────────────────────────────────────────
export const send2FAEnabledEmail = async (to: string): Promise<void> => {
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Two-Factor Authentication Enabled
    </h2>
    <p style="margin: 0 0 12px;">Two-factor authentication has been successfully enabled on your account.</p>
    <p style="margin: 0 0 12px;">From now on, you will need your authenticator app to sign in.</p>
    <div style="padding: 16px; background-color: ${COLORS.background}; border-left: 4px solid ${COLORS.accent}; border-radius: 4px; margin: 16px 0;">
      <p style="margin: 0; font-size: 13px; color: ${COLORS.textPrimary};">
        <strong>Security Notice:</strong> If you did not enable 2FA, please contact our support team immediately and change your password.
      </p>
    </div>
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
  const ctaHtml =
    ctaUrl && ctaLabel
      ? `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px;">
      <tr>
        <td style="border-radius: 6px; background-color: ${COLORS.secondary};">
          <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; color: ${COLORS.white}; font-family: ${FONTS.body}; font-size: 15px; font-weight: 600; text-decoration: none;">
            ${ctaLabel}
          </a>
        </td>
      </tr>
    </table>`
      : "";

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

// ─── Shared Template Builder (for notification service) ─────────────────────
export { wrapEmailTemplate, COLORS, FONTS };
