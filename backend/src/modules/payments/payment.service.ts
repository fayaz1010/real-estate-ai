// Payment Service - Business Logic with Stripe Integration
import Stripe from "stripe";

import prisma from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
// Stripe key read directly from env

// Initialize Stripe (optional - only if key is configured)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20" as "2024-06-20",
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
        type: data.type as Parameters<typeof prisma.payment.create>[0]["data"]["type"],
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        description: data.description,
        status: "PAYMENT_PENDING",
      },
    });
  }

  // Create Stripe payment intent
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
        leaseId: payment.leaseId,
        propertyTitle: payment.lease.property.title,
      },
    });

    await prisma.payment.update({
      where: { id: paymentId },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return { clientSecret: paymentIntent.client_secret };
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

  // Handle Stripe webhook
  async handleStripeWebhook(event: Stripe.Event) {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const paymentId = paymentIntent.metadata.paymentId;

      if (paymentId) {
        await this.confirmPayment(paymentId);
      }
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
