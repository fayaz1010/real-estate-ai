// Contact Form Routes
import { Request, Response, Router } from "express";
import { z } from "zod/v4";

import {
  sendEmail,
  wrapEmailTemplate,
  COLORS,
  FONTS,
} from "../../utils/emailService";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(1, "Please select a subject."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

router.post("/", async (req: Request, res: Response) => {
  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Validation failed", fields: fieldErrors },
    });
    return;
  }

  const { name, email, subject, message } = result.data;

  console.log(
    `[Contact] New submission from ${name} <${email}> — Subject: ${subject}`,
  );

  try {
    // Send confirmation email to user
    const confirmationHtml = `
      <h2 style="margin: 0 0 16px; color: ${COLORS.primary}; font-family: ${FONTS.display}; font-size: 20px;">
        We Received Your Message
      </h2>
      <p>Hi ${name},</p>
      <p>Thank you for contacting us. We have received your message regarding <strong>${subject}</strong> and will get back to you within one business day.</p>
      <p style="margin: 16px 0; padding: 12px 16px; background-color: ${COLORS.background}; border-left: 4px solid ${COLORS.accent}; border-radius: 4px; font-size: 13px; color: ${COLORS.textPrimary};">
        <strong>Your message:</strong><br/>${message.replace(/\n/g, "<br/>")}
      </p>
      <p style="font-size: 13px; color: ${COLORS.textMuted};">If you have any urgent questions, feel free to call us at 1-800-555-0199.</p>
    `;

    await sendEmail({
      to: email,
      subject: `We received your message – RealEstateAI`,
      html: wrapEmailTemplate("Message Received", confirmationHtml),
      text: `Hi ${name}, thank you for contacting us about "${subject}". We will get back to you within one business day.`,
    });

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("[Contact] Failed to process submission:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An error occurred while sending your message. Please try again later.",
      },
    });
  }
});

export default router;
