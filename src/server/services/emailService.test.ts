// Set required env vars before anything loads
process.env.SENDGRID_API_KEY = "SG.test-api-key";
process.env.EMAIL_FROM = "noreply@realestateai.com";
process.env.EMAIL_REPLY_TO = "support@realestateai.com";
process.env.EMAIL_VERIFICATION_URL = "http://localhost:3000/verify-email";
process.env.PASSWORD_RESET_URL = "http://localhost:3000/reset-password";
process.env.SMTP_HOST = "smtp.test.com";
process.env.SMTP_PORT = "587";
process.env.SMTP_USER = "testuser";
process.env.SMTP_PASS = "testpass";

import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";

import {
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
} from "./emailService";

// Mock SendGrid
jest.mock("@sendgrid/mail", () => ({
  __esModule: true,
  default: {
    setApiKey: jest.fn(),
    send: jest.fn(),
  },
}));

// Mock nodemailer — store the mock transport in a variable accessible to tests.
// We access it through the mocked module's createTransport return value.
jest.mock("nodemailer", () => {
  const mockTransport = {
    sendMail: jest.fn().mockResolvedValue({ messageId: "init" }),
  };
  return {
    __esModule: true,
    default: {
      createTransport: jest.fn(() => mockTransport),
    },
    __mockTransport: mockTransport,
  };
});

// Mock Sentry
const mockCaptureException = jest.fn();
jest.mock("@sentry/node", () => ({
  captureException: (...args: unknown[]) => mockCaptureException(...args),
}));

// Mock winston
jest.mock("winston", () => ({
  __esModule: true,
  default: {
    createLogger: jest.fn(() => ({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    })),
    format: {
      json: jest.fn(() => ({})),
      combine: jest.fn((...args: unknown[]) => args),
      timestamp: jest.fn(() => ({})),
    },
    transports: {
      File: jest.fn(),
      Console: jest.fn(),
    },
  },
}));

const mockSgSend = sgMail.send as jest.Mock;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const smtpMock = require("nodemailer").__mockTransport as {
  sendMail: jest.Mock;
};

describe("emailService", () => {
  beforeEach(() => {
    mockSgSend.mockReset();
    smtpMock.sendMail.mockReset();
    mockCaptureException.mockReset();
    mockSgSend.mockResolvedValue([{ statusCode: 202, body: "", headers: {} }]);
    smtpMock.sendMail.mockResolvedValue({ messageId: "test-id" });
    _resetRateLimits();
  });

  // ─── Provider Configuration ──────────────────────────────────────────────
  describe("provider configuration", () => {
    it("should configure SendGrid API key on module load", () => {
      expect(sgMail.setApiKey).toHaveBeenCalledWith("SG.test-api-key");
    });

    it("should configure SMTP transport on module load", () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: "smtp.test.com",
          port: 587,
          auth: { user: "testuser", pass: "testpass" },
        }),
      );
    });
  });

  // ─── Core sendEmail ──────────────────────────────────────────────────────
  describe("sendEmail", () => {
    it("should send a raw email via SendGrid API", async () => {
      await sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        html: "<p>HTML body</p>",
      });

      expect(mockSgSend).toHaveBeenCalledTimes(1);
      expect(mockSgSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "test@example.com",
          subject: "Test Subject",
          html: "<p>HTML body</p>",
          from: { email: "noreply@realestateai.com", name: "RealEstate AI" },
          replyTo: "support@realestateai.com",
        }),
      );
    });

    it("should include text field when provided", async () => {
      await sendEmail({
        to: "test@example.com",
        subject: "Test",
        html: "<p>html</p>",
        text: "plain text",
      });

      expect(mockSgSend).toHaveBeenCalledWith(
        expect.objectContaining({ text: "plain text" }),
      );
    });

    it("should sanitize email address (strip newlines)", async () => {
      await sendEmail({
        to: "test@example.com\r\nBcc: evil@hacker.com",
        subject: "Test",
        html: "<p>test</p>",
      });

      expect(mockSgSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "test@example.comBcc: evil@hacker.com",
        }),
      );
    });
  });

  // ─── SendGrid to SMTP Fallback ───────────────────────────────────────────
  describe("SMTP fallback", () => {
    it("should fall back to SMTP when SendGrid fails with non-transient error", async () => {
      const error = new Error("Forbidden");
      (error as unknown as { code: number }).code = 403;
      mockSgSend.mockRejectedValue(error);

      await sendEmail({
        to: "fallback@example.com",
        subject: "Fallback Test",
        html: "<p>test</p>",
      });

      expect(mockSgSend).toHaveBeenCalledTimes(1);
      expect(smtpMock.sendMail).toHaveBeenCalledTimes(1);
      expect(smtpMock.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "fallback@example.com",
          subject: "Fallback Test",
          html: "<p>test</p>",
          replyTo: "support@realestateai.com",
        }),
      );
    });

    it("should throw when both SendGrid and SMTP fail", async () => {
      const sgError = new Error("SendGrid down");
      (sgError as unknown as { code: number }).code = 403;
      mockSgSend.mockRejectedValue(sgError);
      smtpMock.sendMail.mockRejectedValue(new Error("SMTP down"));

      await expect(
        sendEmail({
          to: "both-fail@example.com",
          subject: "Fail",
          html: "<p>test</p>",
        }),
      ).rejects.toThrow("SMTP down");
    });

    it("should report SMTP fallback failure to Sentry", async () => {
      const sgError = new Error("SendGrid down");
      (sgError as unknown as { code: number }).code = 403;
      mockSgSend.mockRejectedValue(sgError);
      const smtpError = new Error("SMTP down");
      smtpMock.sendMail.mockRejectedValue(smtpError);

      await expect(
        sendEmail({
          to: "sentry@example.com",
          subject: "Sentry",
          html: "<p>t</p>",
        }),
      ).rejects.toThrow();

      expect(mockCaptureException).toHaveBeenCalledWith(
        smtpError,
        expect.objectContaining({
          tags: { service: "email", provider: "smtp-fallback" },
        }),
      );
    });
  });

  // ─── Retry Logic ─────────────────────────────────────────────────────────
  describe("retry logic", () => {
    it("should retry on transient 5xx errors", async () => {
      const transientError = new Error("Internal Server Error");
      (transientError as unknown as { code: number }).code = 500;
      mockSgSend
        .mockRejectedValueOnce(transientError)
        .mockResolvedValueOnce([{ statusCode: 202, body: "", headers: {} }]);

      await sendEmail({
        to: "retry@example.com",
        subject: "Retry Test",
        html: "<p>test</p>",
      });

      expect(mockSgSend).toHaveBeenCalledTimes(2);
    });

    it("should retry on 429 rate limit errors", async () => {
      const rateLimitError = new Error("Too Many Requests");
      (rateLimitError as unknown as { code: number }).code = 429;
      mockSgSend
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValueOnce([{ statusCode: 202, body: "", headers: {} }]);

      await sendEmail({
        to: "ratelimit-retry@example.com",
        subject: "Rate Limit Test",
        html: "<p>test</p>",
      });

      expect(mockSgSend).toHaveBeenCalledTimes(2);
    });

    it("should not retry on non-transient errors (e.g. 403)", async () => {
      const error = new Error("Forbidden");
      (error as unknown as { code: number }).code = 403;
      mockSgSend.mockRejectedValue(error);

      // Will fall back to SMTP instead of retrying
      await sendEmail({
        to: "no-retry@example.com",
        subject: "No Retry",
        html: "<p>test</p>",
      });

      expect(mockSgSend).toHaveBeenCalledTimes(1);
      expect(smtpMock.sendMail).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Rate Limiting ───────────────────────────────────────────────────────
  describe("rate limiting", () => {
    it("should enforce per-recipient rate limiting", async () => {
      const recipient = "ratelimited-user@example.com";

      for (let i = 0; i < 10; i++) {
        await sendEmail({
          to: recipient,
          subject: `Email ${i}`,
          html: "<p>test</p>",
        });
      }

      await expect(
        sendEmail({
          to: recipient,
          subject: "Over limit",
          html: "<p>test</p>",
        }),
      ).rejects.toThrow(/rate limit exceeded/i);
    });

    it("should allow emails to different recipients independently", async () => {
      for (let i = 0; i < 10; i++) {
        await sendEmail({
          to: "user-a@example.com",
          subject: `Email ${i}`,
          html: "<p>t</p>",
        });
      }

      // Different recipient should still work
      await expect(
        sendEmail({
          to: "user-b@example.com",
          subject: "OK",
          html: "<p>t</p>",
        }),
      ).resolves.toBeUndefined();
    });

    it("should reset rate limits via _resetRateLimits helper", async () => {
      const recipient = "reset-test@example.com";

      for (let i = 0; i < 10; i++) {
        await sendEmail({
          to: recipient,
          subject: `Email ${i}`,
          html: "<p>t</p>",
        });
      }

      _resetRateLimits();

      await expect(
        sendEmail({ to: recipient, subject: "After reset", html: "<p>t</p>" }),
      ).resolves.toBeUndefined();
    });
  });

  // ─── SendGrid Templates ──────────────────────────────────────────────────
  describe("SendGrid templates", () => {
    it("should use SendGrid template for verification when template ID is set", async () => {
      process.env.SENDGRID_TEMPLATE_ID_EMAIL_VERIFICATION =
        "d-verify-template-id";

      // Re-import to pick up new env var — template check reads env at call time
      await sendVerificationEmail("template-user@example.com", "token123");

      const call = mockSgSend.mock.calls[0][0];
      expect(call.templateId).toBe("d-verify-template-id");
      expect(call.dynamicTemplateData).toEqual(
        expect.objectContaining({
          verify_url: expect.stringContaining("token123"),
        }),
      );

      delete process.env.SENDGRID_TEMPLATE_ID_EMAIL_VERIFICATION;
    });

    it("should use SendGrid template for password reset when template ID is set", async () => {
      process.env.SENDGRID_TEMPLATE_ID_PASSWORD_RESET = "d-reset-template-id";

      await sendPasswordResetEmail("reset-tmpl@example.com", "reset-token");

      const call = mockSgSend.mock.calls[0][0];
      expect(call.templateId).toBe("d-reset-template-id");
      expect(call.dynamicTemplateData).toEqual(
        expect.objectContaining({
          reset_url: expect.stringContaining("reset-token"),
        }),
      );

      delete process.env.SENDGRID_TEMPLATE_ID_PASSWORD_RESET;
    });

    it("should use SendGrid template for welcome email when template ID is set", async () => {
      process.env.SENDGRID_TEMPLATE_ID_WELCOME = "d-welcome-template-id";

      await sendWelcomeEmail("welcome-tmpl@example.com", "Alice");

      const call = mockSgSend.mock.calls[0][0];
      expect(call.templateId).toBe("d-welcome-template-id");
      expect(call.dynamicTemplateData).toEqual(
        expect.objectContaining({ user_name: "Alice" }),
      );

      delete process.env.SENDGRID_TEMPLATE_ID_WELCOME;
    });

    it("should fall back to built-in HTML when no template ID is set", async () => {
      delete process.env.SENDGRID_TEMPLATE_ID_EMAIL_VERIFICATION;

      await sendVerificationEmail("no-tmpl@example.com", "fallback-token");

      const call = mockSgSend.mock.calls[0][0];
      expect(call.templateId).toBeUndefined();
      expect(call.html).toContain("verify-email?token=fallback-token");
      expect(call.html).toContain("RealEstateAI");
    });
  });

  // ─── Email Template Content ──────────────────────────────────────────────
  describe("email template content", () => {
    it("should send verification email with correct template", async () => {
      await sendVerificationEmail("user@example.com", "abc123");

      expect(mockSgSend).toHaveBeenCalledTimes(1);
      const call = mockSgSend.mock.calls[0][0];
      expect(call.to).toBe("user@example.com");
      expect(call.subject).toContain("Verify Your Email");
      expect(call.html).toContain("verify-email?token=abc123");
      expect(call.html).toContain("RealEstateAI");
      expect(call.html).toContain("#008080");
    });

    it("should send welcome email with user name", async () => {
      await sendWelcomeEmail("newuser@example.com", "Bob");

      const call = mockSgSend.mock.calls[0][0];
      expect(call.subject).toContain("Welcome to RealEstateAI");
      expect(call.html).toContain("Bob");
    });

    it("should send password reset email with correct template", async () => {
      await sendPasswordResetEmail("user@example.com", "reset-token-xyz");

      const call = mockSgSend.mock.calls[0][0];
      expect(call.subject).toContain("Reset Your Password");
      expect(call.html).toContain("reset-password?token=reset-token-xyz");
      expect(call.html).toContain("1 hour");
    });

    it("should send lease renewal reminder email", async () => {
      await sendLeaseRenewalReminderEmail("tenant@example.com", {
        userName: "John Doe",
        propertyTitle: "Sunset Apartments #301",
        leaseEndDate: "2026-06-30",
        renewalDeadline: "2026-05-30",
        monthlyRent: "$1,500",
        leaseId: "lease-123",
      });

      const call = mockSgSend.mock.calls[0][0];
      expect(call.subject).toContain("Lease Renewal Reminder");
      expect(call.html).toContain("Sunset Apartments #301");
      expect(call.html).toContain("$1,500");
      expect(call.html).toContain("2026-06-30");
    });

    it("should send payment confirmation email", async () => {
      await sendPaymentConfirmationEmail("tenant@example.com", {
        userName: "Jane Smith",
        propertyTitle: "Harbor View #12",
        amount: "$2,000.00",
        paymentDate: "2026-03-15",
        paymentMethod: "Visa ****4242",
        transactionId: "txn_abc123",
      });

      const call = mockSgSend.mock.calls[0][0];
      expect(call.subject).toContain("Payment Confirmed");
      expect(call.html).toContain("$2,000.00");
      expect(call.html).toContain("txn_abc123");
    });

    it("should send maintenance update email", async () => {
      await sendMaintenanceUpdateEmail("manager@example.com", {
        userName: "Bob Manager",
        propertyTitle: "Oak Street #5",
        requestTitle: "Leaky Faucet",
        priority: "urgent",
        description: "Kitchen faucet dripping constantly",
        requestId: "maint-456",
        status: "In Progress",
      });

      const call = mockSgSend.mock.calls[0][0];
      expect(call.subject).toContain("Maintenance Update");
      expect(call.html).toContain("Leaky Faucet");
      expect(call.html).toContain("In Progress");
      expect(call.html).toContain("#DC2626");
    });

    it("should send notification email with CTA", async () => {
      await sendNotificationEmail(
        "user@example.com",
        "New Message",
        "You have a new message from your tenant.",
        "http://localhost:3000/messages",
        "View Messages",
      );

      const call = mockSgSend.mock.calls[0][0];
      expect(call.subject).toContain("New Message");
      expect(call.html).toContain("View Messages");
      expect(call.html).toContain("http://localhost:3000/messages");
    });

    it("should send test email with provider info", async () => {
      await sendTestEmail("admin@example.com");

      const call = mockSgSend.mock.calls[0][0];
      expect(call.subject).toContain("Test Email");
      expect(call.html).toContain("SendGrid API");
      expect(call.html).toContain("noreply@realestateai.com");
    });
  });

  // ─── Input Sanitization ──────────────────────────────────────────────────
  describe("input sanitization", () => {
    it("should sanitize user input to prevent XSS in email templates", async () => {
      await sendNotificationEmail(
        "user@example.com",
        '<script>alert("xss")</script>',
        'Hello <img src=x onerror=alert("xss")>',
      );

      const call = mockSgSend.mock.calls[0][0];
      expect(call.html).not.toContain("<script>");
      expect(call.html).not.toContain("<img src=x");
      expect(call.html).toContain("&lt;script&gt;");
      expect(call.html).toContain("&lt;img");
    });

    it("should sanitize user names in welcome email", async () => {
      await sendWelcomeEmail(
        "xss@example.com",
        '<b onmouseover="alert(1)">Evil</b>',
      );

      const call = mockSgSend.mock.calls[0][0];
      expect(call.html).not.toContain("<b onmouseover");
      expect(call.html).toContain("&lt;b");
    });
  });

  // ─── Sentry Error Reporting ──────────────────────────────────────────────
  describe("Sentry error reporting", () => {
    it("should report SendGrid failure to Sentry when no SMTP fallback succeeds", async () => {
      const sgError = new Error("SG Fail");
      (sgError as unknown as { code: number }).code = 403;
      mockSgSend.mockRejectedValue(sgError);
      smtpMock.sendMail.mockRejectedValue(new Error("SMTP Fail"));

      await expect(
        sendEmail({
          to: "sentry-test@example.com",
          subject: "S",
          html: "<p>t</p>",
        }),
      ).rejects.toThrow();

      expect(mockCaptureException).toHaveBeenCalled();
    });
  });
});
