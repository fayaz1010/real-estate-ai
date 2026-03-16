// Email Service - Nodemailer Integration
import nodemailer from "nodemailer";

import { config } from "../config/env";

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  if (config.nodeEnv === "development" && !config.smtp.user) {
    console.log("[DEV] Email would be sent:", {
      to: options.to,
      subject: options.subject,
    });
    return;
  }

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string,
): Promise<void> => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
  await sendEmail({
    to,
    subject: "Reset Your Password - PropManage",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reset Your Password</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #6b7280; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

export const sendVerificationEmail = async (
  to: string,
  verificationToken: string,
): Promise<void> => {
  const verifyUrl = `${config.frontendUrl}/verify-email?token=${verificationToken}`;
  await sendEmail({
    to,
    subject: "Verify Your Email - PropManage",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Verify Your Email</h2>
        <p>Welcome to PropManage! Please verify your email address:</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #6b7280; font-size: 14px;">This link expires in 24 hours.</p>
      </div>
    `,
  });
};

export const send2FAEnabledEmail = async (to: string): Promise<void> => {
  await sendEmail({
    to,
    subject: "Two-Factor Authentication Enabled - PropManage",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">2FA Enabled</h2>
        <p>Two-factor authentication has been enabled on your account. You will need your authenticator app to sign in.</p>
        <p style="color: #6b7280; font-size: 14px;">If you didn't do this, please contact support immediately.</p>
      </div>
    `,
  });
};
