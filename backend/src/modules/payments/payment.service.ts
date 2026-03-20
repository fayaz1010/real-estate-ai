// Payment Service - Business Logic with Stripe Integration
import Stripe from "stripe";

import prisma from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import logger from "../../utils/logger";

// Initialize Stripe (optional - only if key is configured)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
    })
  : null;

export class PaymentService {
  // Create a payment record
  async createPayment(data: {
    leaseId: string;
    payerId: string;
    type: string;
    amount: number;
    dueDate: string;
    description?: string;
  }) {
    const lease = await prisma.lease.findFirst({
      where: {
        id: data.leaseId,
        OR: [{ tenantId: data.payerId }, { landlordId: data.payerId }],
      },
    });
    if (!lease) throw new AppError("Lease not found or access denied", 404);

    return prisma.payment.create({
      data: {
        leaseId: data.leaseId,
        payerId: data.payerId,
        type: data.type as Parameters<
          typeof prisma.payment.create
        >[0]["data"]["type"],
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        description: data.description,
        status: "PAYMENT_PENDING",
      },
    });
  }

  // Create Stripe payment intent with full metadata
  async createPaymentIntent(paymentId: string, userId: string) {
    if (!stripe) {
      throw new AppError(
        "Payment processing is not configured. Set STRIPE_SECRET_KEY.",
        503,
      );
    }

    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, payerId: userId },
      include: { lease: { include: { property: true } } },
    });
    if (!payment) throw new AppError("Payment not found", 404);
    if (payment.status === "PAID")
      throw new AppError("Payment already completed", 400);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(payment.amount * 100), // Convert to cents
      currency: payment.currency.toLowerCase(),
      metadata: {
        paymentId: payment.id,
        userId,
        propertyId: payment.lease.property.id,
        leaseId: payment.leaseId,
        paymentType: payment.type.toLowerCase(),
        propertyTitle: payment.lease.property.title,
      },
    });

    await prisma.payment.update({
      where: { id: paymentId },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  // Create a direct payment intent (for checkout flow without existing payment record)
  async createDirectPaymentIntent(data: {
    amount: number;
    userId: string;
    propertyId: string;
    paymentType: string;
    leaseId?: string;
    description?: string;
  }) {
    if (!stripe) {
      throw new AppError(
        "Payment processing is not configured. Set STRIPE_SECRET_KEY.",
        503,
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: "usd",
      metadata: {
        userId: data.userId,
        propertyId: data.propertyId,
        paymentType: data.paymentType,
        ...(data.leaseId && { leaseId: data.leaseId }),
      },
      description: data.description,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  // Confirm payment (called after Stripe webhook or manual confirmation)
  async confirmPayment(paymentId: string) {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });
    return payment;
  }

  // Get payments for a lease
  async getLeasePayments(leaseId: string, userId: string) {
    const lease = await prisma.lease.findFirst({
      where: {
        id: leaseId,
        OR: [{ tenantId: userId }, { landlordId: userId }],
      },
    });
    if (!lease) throw new AppError("Lease not found or access denied", 404);

    return prisma.payment.findMany({
      where: { leaseId },
      orderBy: { dueDate: "desc" },
    });
  }

  // Get my payments
  async getMyPayments(userId: string, status?: string) {
    const where: Record<string, unknown> = { payerId: userId };
    if (status) where.status = status;

    return prisma.payment.findMany({
      where,
      include: {
        lease: {
          include: {
            property: { select: { title: true, address: true } },
          },
        },
      },
      orderBy: { dueDate: "desc" },
    });
  }

  // Handle Stripe webhook with comprehensive event processing
  async handleStripeWebhook(event: Stripe.Event) {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const paymentId = paymentIntent.metadata.paymentId;

        if (paymentId) {
          try {
            await this.confirmPayment(paymentId);
            logger.info(
              `[Stripe Webhook] Payment confirmed: ${paymentId} (intent: ${paymentIntent.id})`,
            );
          } catch (err) {
            logger.error(
              `[Stripe Webhook] Failed to confirm payment ${paymentId}:`,
              { error: err },
            );
            throw err;
          }
        } else {
          logger.warn(
            `[Stripe Webhook] payment_intent.succeeded without paymentId in metadata: ${paymentIntent.id}`,
          );
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        const failedPaymentId = failedIntent.metadata.paymentId;
        if (failedPaymentId) {
          logger.error(
            `[Stripe Webhook] Payment failed: ${failedPaymentId} (intent: ${failedIntent.id})`,
          );
        }
        break;
      }

      default:
        logger.info(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
  }

  // Generate rent payments for a lease
  async generateRentPayments(leaseId: string, userId: string) {
    const lease = await prisma.lease.findFirst({
      where: { id: leaseId, landlordId: userId },
    });
    if (!lease) throw new AppError("Lease not found or access denied", 404);

    const payments = [];
    const start = new Date(lease.startDate);
    const end = new Date(lease.endDate);
    const current = new Date(start);

    while (current <= end) {
      payments.push({
        leaseId,
        payerId: lease.tenantId,
        type: "RENT" as const,
        status: "PAYMENT_PENDING" as const,
        amount: lease.monthlyRent,
        currency: "USD",
        dueDate: new Date(current),
        description: `Rent for ${current.toLocaleString("en-US", { month: "long", year: "numeric" })}`,
      });
      current.setMonth(current.getMonth() + 1);
    }

    const created = await prisma.payment.createMany({ data: payments });
    return { count: created.count };
  }
}

export default new PaymentService();
