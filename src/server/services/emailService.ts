import sgMail from "@sendgrid/mail";
import * as Sentry from "@sentry/node";
import winston from "winston";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@realestate.ai";
const FROM_NAME = process.env.SENDGRID_FROM_NAME || "RealEstate AI";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html: string,
) {
  try {
    const msg = {
      to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    logger.info(`Email sent to ${to} with subject ${subject}`);
  } catch (error: unknown) {
    logger.error(
      `Error sending email to ${to} with subject ${subject}: ${error}`,
    );
    Sentry.captureException(error);
    throw error; // Re-throw to allow upstream error handling
  }
}

export { sendEmail };
