// Email Service - Production-ready with SendGrid (primary) + SMTP (fallback)
// Handles verification, password reset, lease renewal, payment confirmation,
// maintenance updates, and general notifications with rate limiting and retry logic.

import sgMail, { MailDataRequired } from "@sendgrid/mail";
import * as Sentry from "@sentry/node";
import nodemailer from "nodemailer";
import winston from "winston";

// ─── Logger ──────────────────────────────────────────────────────────────────
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console(),
  ],
});

// ─── Configuration ───────────────────────────────────────────────────────────
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@realestateai.com";
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || EMAIL_FROM;
const EMAIL_VERIFICATION_URL =
  process.env.EMAIL_VERIFICATION_URL || "http://localhost:3000/verify-email";
const PASSWORD_RESET_URL =
  process.env.PASSWORD_RESET_URL || "http://localhost:3000/reset-password";
const FROM_NAME = "RealEstate AI";

// SendGrid dynamic template IDs are read at call time so they can be
// configured after module load (e.g. in tests or late-binding config).
function getTemplateId(key: string): string | undefined {
  return process.env[key] || undefined;
}

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  logger.info("[EmailService] SendGrid configured as primary provider.");
} else {
  logger.warn("[EmailService] SENDGRID_API_KEY not set. SendGrid unavailable.");
}

// ─── SMTP Transport (fallback) ──────────────────────────────────────────────
let smtpTransport: nodemailer.Transporter | null = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  smtpTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  logger.info("[EmailService] SMTP configured as fallback provider.");
} else {
  logger.warn(
    "[EmailService] SMTP not fully configured. Fallback unavailable.",
  );
}

// ─── Design System Constants ─────────────────────────────────────────────────
const COLORS = {
  primary: "#008080",
  secondary: "#E0E0E0",
  accent: "#FF6B35",
  background: "#FFFFFF",
  textPrimary: "#1A1A2E",
  textMuted: "#6b7280",
  white: "#ffffff",
  border: "#e5e7eb",
  error: "#DC2626",
};

const FONTS = {
  display: "'Manrope', 'Helvetica Neue', Arial, sans-serif",
  body: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

// ─── Rate Limiter (per recipient) ────────────────────────────────────────────
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = parseInt(
  process.env.EMAIL_RATE_LIMIT_WINDOW_MS || "3600000",
  10,
);
const RATE_LIMIT_MAX = parseInt(process.env.EMAIL_RATE_LIMIT_MAX || "10", 10);

const cleanupInterval = setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((entry, key) => {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}, 60_000);

if (typeof cleanupInterval.unref === "function") {
  cleanupInterval.unref();
}

function checkRateLimit(recipient: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(recipient);

  if (!entry || now >= entry.resetTime) {
    rateLimitStore.set(recipient, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    logger.warn(
      `[EmailService] Rate limit exceeded for ${maskEmail(recipient)}`,
    );
    return false;
  }

  entry.count++;
  return true;
}

// Exported for testing
function _resetRateLimits(): void {
  rateLimitStore.clear();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function maskEmail(email: string): string {
  return email.replace(/(.{3}).*(@.*)/, "$1***$2");
}

function sanitize(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\r?\n/g, " ")
    .replace(/\0/g, "");
}

function sanitizeEmailAddress(email: string): string {
  return email.replace(/[\r\n\t]/g, "").trim();
}

// ─── Email Template Wrapper ──────────────────────────────────────────────────
function wrapEmailTemplate(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sanitize(title)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: ${FONTS.body};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F5; padding: 32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: ${COLORS.white}; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
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
            ${sanitize(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

// ─── Info Box Builder ────────────────────────────────────────────────────────
function buildInfoBox(content: string): string {
  return `
    <div style="padding: 12px 16px; background-color: #F5F5F5; border-left: 4px solid ${COLORS.accent}; border-radius: 4px; margin: 12px 0;">
      <p style="margin: 0; font-size: 13px; color: ${COLORS.textPrimary};">${content}</p>
    </div>`;
}

// ─── Core Send Functions ─────────────────────────────────────────────────────
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 10000];

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientError(statusCode: number | undefined): boolean {
  return statusCode !== undefined && (statusCode === 429 || statusCode >= 500);
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, unknown>;
}

async function sendViaSendGrid(options: SendEmailOptions): Promise<void> {
  const msg: MailDataRequired = {
    to: options.to,
    from: { email: EMAIL_FROM, name: FROM_NAME },
    replyTo: EMAIL_REPLY_TO,
    subject: options.subject,
    html: options.html,
    ...(options.text && { text: options.text }),
  };

  // Use SendGrid dynamic template if a templateId is provided
  if (options.templateId) {
    (
      msg as MailDataRequired & {
        templateId: string;
        dynamicTemplateData?: Record<string, unknown>;
      }
    ).templateId = options.templateId;
    if (options.dynamicTemplateData) {
      (
        msg as MailDataRequired & {
          dynamicTemplateData: Record<string, unknown>;
        }
      ).dynamicTemplateData = options.dynamicTemplateData;
    }
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      await sgMail.send(msg);
      logger.info(
        `[EmailService] Email sent via SendGrid to ${maskEmail(options.to)} (subject: "${options.subject}")`,
      );
      return;
    } catch (error: unknown) {
      lastError = error;
      const statusCode = (error as { code?: number }).code;

      if (attempt < MAX_RETRIES && isTransientError(statusCode)) {
        logger.warn(
          `[EmailService] SendGrid transient error (status ${statusCode}), retrying in ${RETRY_DELAYS[attempt]}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
        );
        await sleep(RETRY_DELAYS[attempt]);
        continue;
      }

      break;
    }
  }

  throw lastError;
}

async function sendViaSmtp(options: SendEmailOptions): Promise<void> {
  if (!smtpTransport) {
    throw new Error("SMTP transport not configured");
  }

  await smtpTransport.sendMail({
    from: `"${FROM_NAME}" <${EMAIL_FROM}>`,
    replyTo: EMAIL_REPLY_TO,
    to: options.to,
    subject: options.subject,
    html: options.html,
    ...(options.text && { text: options.text }),
  });

  logger.info(
    `[EmailService] Email sent via SMTP to ${maskEmail(options.to)} (subject: "${options.subject}")`,
  );
}

async function sendEmail(options: SendEmailOptions): Promise<void> {
  const sanitizedTo = sanitizeEmailAddress(options.to);

  // Rate limit check
  if (!checkRateLimit(sanitizedTo)) {
    const error = new Error(
      `Email rate limit exceeded for recipient. Max ${RATE_LIMIT_MAX} emails per ${RATE_LIMIT_WINDOW_MS / 60000} minutes.`,
    );
    logger.error("[EmailService] Rate limit error:", error.message);
    throw error;
  }

  const sanitizedOptions = { ...options, to: sanitizedTo };

  // No providers configured — log in dev mode
  if (!SENDGRID_API_KEY && !smtpTransport) {
    logger.info("[EmailService] [DEV] Email would be sent:", {
      to: sanitizedTo,
      subject: options.subject,
    });
    return;
  }

  // Try SendGrid first
  if (SENDGRID_API_KEY) {
    try {
      await sendViaSendGrid(sanitizedOptions);
      return;
    } catch (sgError: unknown) {
      const message =
        sgError instanceof Error ? sgError.message : "Unknown SendGrid error";
      logger.error(`[EmailService] SendGrid failed: ${message}`);

      // If SMTP fallback is available, try it
      if (smtpTransport) {
        logger.info("[EmailService] Falling back to SMTP...");
        try {
          await sendViaSmtp(sanitizedOptions);
          return;
        } catch (smtpError: unknown) {
          const smtpMessage =
            smtpError instanceof Error
              ? smtpError.message
              : "Unknown SMTP error";
          logger.error(
            `[EmailService] SMTP fallback also failed: ${smtpMessage}`,
          );

          try {
            Sentry.captureException(smtpError, {
              tags: { service: "email", provider: "smtp-fallback" },
              extra: { to: maskEmail(sanitizedTo), subject: options.subject },
            });
          } catch {
            /* Sentry may not be initialized */
          }

          throw smtpError;
        }
      }

      // No SMTP fallback — report SendGrid error
      try {
        Sentry.captureException(sgError, {
          tags: { service: "email", provider: "sendgrid" },
          extra: { to: maskEmail(sanitizedTo), subject: options.subject },
        });
      } catch {
        /* Sentry may not be initialized */
      }

      throw sgError;
    }
  }

  // No SendGrid key but SMTP is available — use SMTP directly
  try {
    await sendViaSmtp(sanitizedOptions);
  } catch (smtpError: unknown) {
    const smtpMessage =
      smtpError instanceof Error ? smtpError.message : "Unknown SMTP error";
    logger.error(`[EmailService] SMTP failed: ${smtpMessage}`);

    try {
      Sentry.captureException(smtpError, {
        tags: { service: "email", provider: "smtp" },
        extra: { to: maskEmail(sanitizedTo), subject: options.subject },
      });
    } catch {
      /* Sentry may not be initialized */
    }

    throw smtpError;
  }
}

// ─── Auth Emails ─────────────────────────────────────────────────────────────

async function sendVerificationEmail(
  to: string,
  verificationToken: string,
): Promise<void> {
  const verifyUrl = `${EMAIL_VERIFICATION_URL}?token=${encodeURIComponent(verificationToken)}`;

  // Use SendGrid template if configured
  const verifyTemplateId = getTemplateId(
    "SENDGRID_TEMPLATE_ID_EMAIL_VERIFICATION",
  );
  if (SENDGRID_API_KEY && verifyTemplateId) {
    await sendEmail({
      to,
      subject: "Verify Your Email – RealEstateAI",
      html: "",
      templateId: verifyTemplateId,
      dynamicTemplateData: {
        verify_url: verifyUrl,
        subject: "Verify Your Email – RealEstateAI",
      },
    });
    return;
  }

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
}

async function sendWelcomeEmail(to: string, userName: string): Promise<void> {
  // Use SendGrid template if configured
  const welcomeTemplateId = getTemplateId("SENDGRID_TEMPLATE_ID_WELCOME");
  if (SENDGRID_API_KEY && welcomeTemplateId) {
    await sendEmail({
      to,
      subject: "Welcome to RealEstateAI!",
      html: "",
      templateId: welcomeTemplateId,
      dynamicTemplateData: {
        user_name: userName,
        subject: "Welcome to RealEstateAI!",
      },
    });
    return;
  }

  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Welcome, ${sanitize(userName)}!
    </h2>
    <p style="margin: 0 0 12px;">Thank you for joining RealEstateAI. We're excited to help you manage your real estate portfolio with intelligent tools and insights.</p>
    <p style="margin: 0 0 24px;">Get started by exploring your dashboard:</p>
    ${buildCtaButton(EMAIL_VERIFICATION_URL.replace("/verify-email", "/dashboard"), "Go to Dashboard")}
  `;

  await sendEmail({
    to,
    subject: "Welcome to RealEstateAI!",
    html: wrapEmailTemplate("Welcome to RealEstateAI", bodyHtml),
    text: `Welcome to RealEstateAI, ${userName}! Get started by visiting your dashboard.`,
  });
}

async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
): Promise<void> {
  const resetUrl = `${PASSWORD_RESET_URL}?token=${encodeURIComponent(resetToken)}`;

  // Use SendGrid template if configured
  const resetTemplateId = getTemplateId("SENDGRID_TEMPLATE_ID_PASSWORD_RESET");
  if (SENDGRID_API_KEY && resetTemplateId) {
    await sendEmail({
      to,
      subject: "Reset Your Password – RealEstateAI",
      html: "",
      templateId: resetTemplateId,
      dynamicTemplateData: {
        reset_url: resetUrl,
        subject: "Reset Your Password – RealEstateAI",
      },
    });
    return;
  }

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
}

// ─── Lease Renewal Emails ────────────────────────────────────────────────────

interface LeaseRenewalEmailVars {
  userName: string;
  propertyTitle: string;
  leaseEndDate: string;
  renewalDeadline: string;
  monthlyRent: string;
  leaseId: string;
  newTerms?: string;
}

async function sendLeaseRenewalReminderEmail(
  to: string,
  vars: LeaseRenewalEmailVars,
): Promise<void> {
  const baseUrl = EMAIL_VERIFICATION_URL.replace("/verify-email", "");
  const renewalUrl = `${baseUrl}/leases/${encodeURIComponent(vars.leaseId)}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Lease Renewal Reminder
    </h2>
    <p>Hi ${sanitize(vars.userName)},</p>
    <p>Your lease for <strong>${sanitize(vars.propertyTitle)}</strong> is approaching its end date. Please review the details below and take action before the renewal deadline.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 16px 0;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};"><strong>Lease End Date:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">${sanitize(vars.leaseEndDate)}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};"><strong>Renewal Deadline:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">${sanitize(vars.renewalDeadline)}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Monthly Rent:</strong></td>
        <td style="padding: 8px 0;">${sanitize(vars.monthlyRent)}</td>
      </tr>
    </table>
    ${vars.newTerms ? buildInfoBox(`<strong>Updated Terms:</strong> ${sanitize(vars.newTerms)}`) : ""}
    ${buildCtaButton(renewalUrl, "Review & Renew Lease")}
    <p style="font-size: 13px; color: ${COLORS.textMuted};">If you do not wish to renew, please notify your property manager before the deadline.</p>
  `;

  await sendEmail({
    to,
    subject: `Lease Renewal Reminder – ${vars.propertyTitle}`,
    html: wrapEmailTemplate("Lease Renewal Reminder", bodyHtml),
    text: `Hi ${vars.userName}, your lease for ${vars.propertyTitle} ends on ${vars.leaseEndDate}. Renewal deadline: ${vars.renewalDeadline}. Monthly rent: ${vars.monthlyRent}. Review at: ${renewalUrl}`,
  });
}

// ─── Payment Emails ──────────────────────────────────────────────────────────

interface PaymentEmailVars {
  userName: string;
  propertyTitle: string;
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  periodCovered?: string;
  receiptUrl?: string;
}

async function sendPaymentConfirmationEmail(
  to: string,
  vars: PaymentEmailVars,
): Promise<void> {
  const baseUrl = EMAIL_VERIFICATION_URL.replace("/verify-email", "");
  const receiptUrl =
    vars.receiptUrl ||
    `${baseUrl}/payments/${encodeURIComponent(vars.transactionId)}`;
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Payment Confirmed
    </h2>
    <p>Hi ${sanitize(vars.userName)},</p>
    <p>Your payment has been received and processed successfully.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 16px 0; border: 1px solid ${COLORS.border}; border-radius: 6px;">
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}; background-color: #F5F5F5;"><strong>Property:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}; background-color: #F5F5F5;">${sanitize(vars.propertyTitle)}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border};"><strong>Amount:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border};">
          <span style="font-family: ${FONTS.mono}; font-size: 16px; font-weight: 700; color: ${COLORS.primary};">${sanitize(vars.amount)}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}; background-color: #F5F5F5;"><strong>Date:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}; background-color: #F5F5F5;">${sanitize(vars.paymentDate)}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border};"><strong>Method:</strong></td>
        <td style="padding: 12px 16px; border-bottom: 1px solid ${COLORS.border};">${sanitize(vars.paymentMethod)}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; background-color: #F5F5F5;"><strong>Transaction ID:</strong></td>
        <td style="padding: 12px 16px; background-color: #F5F5F5;"><span style="font-family: ${FONTS.mono}; font-size: 13px;">${sanitize(vars.transactionId)}</span></td>
      </tr>
      ${vars.periodCovered ? `<tr><td style="padding: 12px 16px; border-top: 1px solid ${COLORS.border};"><strong>Period:</strong></td><td style="padding: 12px 16px; border-top: 1px solid ${COLORS.border};">${sanitize(vars.periodCovered)}</td></tr>` : ""}
    </table>
    ${buildCtaButton(receiptUrl, "View Receipt")}
    <p style="font-size: 13px; color: ${COLORS.textMuted};">Keep this email as your payment receipt. If you have any questions, contact your property manager.</p>
  `;

  await sendEmail({
    to,
    subject: `Payment Confirmed: ${vars.amount} – ${vars.propertyTitle}`,
    html: wrapEmailTemplate("Payment Confirmed", bodyHtml),
    text: `Hi ${vars.userName}, your payment of ${vars.amount} for ${vars.propertyTitle} on ${vars.paymentDate} has been confirmed. Transaction ID: ${vars.transactionId}. View receipt: ${receiptUrl}`,
  });
}

// ─── Maintenance Emails ──────────────────────────────────────────────────────

interface MaintenanceEmailVars {
  userName: string;
  propertyTitle: string;
  requestTitle: string;
  priority: string;
  description: string;
  requestId: string;
  status?: string;
}

async function sendMaintenanceUpdateEmail(
  to: string,
  vars: MaintenanceEmailVars,
): Promise<void> {
  const baseUrl = EMAIL_VERIFICATION_URL.replace("/verify-email", "");
  const dashboardUrl = `${baseUrl}/maintenance/${encodeURIComponent(vars.requestId)}`;
  const priorityColor =
    vars.priority === "urgent" || vars.priority === "emergency"
      ? COLORS.error
      : vars.priority === "high"
        ? "#F59E0B"
        : COLORS.primary;

  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Maintenance Request ${vars.status ? "Updated" : "Submitted"}
    </h2>
    <p>Hi ${sanitize(vars.userName)},</p>
    <p>${vars.status ? `The maintenance request for <strong>${sanitize(vars.propertyTitle)}</strong> has been updated.` : `A new maintenance request has been submitted for <strong>${sanitize(vars.propertyTitle)}</strong>.`}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 16px 0;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};"><strong>Title:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">${sanitize(vars.requestTitle)}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};"><strong>Priority:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">
          <span style="display: inline-block; padding: 2px 10px; border-radius: 12px; background-color: ${priorityColor}; color: #fff; font-size: 12px; font-weight: 600; text-transform: uppercase;">${sanitize(vars.priority)}</span>
        </td>
      </tr>
      ${vars.status ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};"><strong>Status:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">${sanitize(vars.status)}</td></tr>` : ""}
      <tr>
        <td style="padding: 8px 0;"><strong>Description:</strong></td>
        <td style="padding: 8px 0;">${sanitize(vars.description)}</td>
      </tr>
    </table>
    ${buildCtaButton(dashboardUrl, "View Request")}
  `;

  await sendEmail({
    to,
    subject: `Maintenance ${vars.status ? "Update" : "Request"}: ${vars.requestTitle} – ${vars.propertyTitle}`,
    html: wrapEmailTemplate("Maintenance Request", bodyHtml),
    text: `Hi ${vars.userName}, maintenance request "${vars.requestTitle}" (${vars.priority}) for ${vars.propertyTitle}${vars.status ? ` - Status: ${vars.status}` : ""}. View at: ${dashboardUrl}`,
  });
}

// ─── General Notification Email ──────────────────────────────────────────────

async function sendNotificationEmail(
  to: string,
  title: string,
  message: string,
  ctaUrl?: string,
  ctaLabel?: string,
): Promise<void> {
  const ctaHtml = ctaUrl && ctaLabel ? buildCtaButton(ctaUrl, ctaLabel) : "";

  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      ${sanitize(title)}
    </h2>
    <p style="margin: 0 0 16px;">${sanitize(message)}</p>
    ${ctaHtml}
  `;

  await sendEmail({
    to,
    subject: `${title} – RealEstateAI`,
    html: wrapEmailTemplate(title, bodyHtml),
    text: `${title}: ${message}${ctaUrl ? ` Visit: ${ctaUrl}` : ""}`,
  });
}

// ─── Test Email ──────────────────────────────────────────────────────────────

async function sendTestEmail(to: string): Promise<void> {
  const provider = SENDGRID_API_KEY
    ? "SendGrid API"
    : smtpTransport
      ? "SMTP"
      : "None (dev mode)";
  const bodyHtml = `
    <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
      Email Configuration Test
    </h2>
    <p style="margin: 0 0 12px;">This is a test email from RealEstateAI.</p>
    <p style="margin: 0 0 12px;">If you received this email, the email integration is configured correctly.</p>
    ${buildInfoBox(`<strong>Provider:</strong> ${sanitize(provider)}<br/><strong>From:</strong> ${sanitize(EMAIL_FROM)}<br/><strong>Sent at:</strong> ${new Date().toISOString()}`)}
  `;

  await sendEmail({
    to,
    subject: "Test Email – RealEstateAI",
    html: wrapEmailTemplate("Email Configuration Test", bodyHtml),
    text: `This is a test email from RealEstateAI. Provider: ${provider}. From: ${EMAIL_FROM}. Sent at: ${new Date().toISOString()}.`,
  });
}

// ─── Exports ─────────────────────────────────────────────────────────────────
export {
  sendEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendLeaseRenewalReminderEmail,
  sendPaymentConfirmationEmail,
  sendMaintenanceUpdateEmail,
  sendNotificationEmail,
  sendTestEmail,
  _resetRateLimits,
};

export type {
  SendEmailOptions,
  LeaseRenewalEmailVars,
  PaymentEmailVars,
  MaintenanceEmailVars,
};
