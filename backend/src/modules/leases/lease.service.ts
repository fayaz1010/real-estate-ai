// Lease Service - Business Logic
import prisma from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

export class LeaseService {
  async create(
    landlordId: string,
    data: {
      propertyId: string;
      tenantId: string;
      startDate: string;
      endDate: string;
      monthlyRent: number;
      depositAmount: number;
      lateFeeAmount?: number;
      lateFeeGraceDays?: number;
    },
  ) {
    const property = await prisma.property.findFirst({
      where: { id: data.propertyId, ownerId: landlordId },
    });
    if (!property)
      throw new AppError("Property not found or access denied", 404);

    const lease = await prisma.lease.create({
      data: {
        propertyId: data.propertyId,
        tenantId: data.tenantId,
        landlordId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        monthlyRent: data.monthlyRent,
        depositAmount: data.depositAmount,
        lateFeeAmount: data.lateFeeAmount || 0,
        lateFeeGraceDays: data.lateFeeGraceDays || 5,
        status: "DRAFT",
      },
      include: {
        property: { select: { title: true, address: true } },
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return lease;
  }

  async getById(leaseId: string, userId: string) {
    const lease = await prisma.lease.findFirst({
      where: {
        id: leaseId,
        OR: [{ tenantId: userId }, { landlordId: userId }],
      },
      include: {
        property: { select: { id: true, title: true, address: true } },
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        landlord: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        payments: { orderBy: { dueDate: "desc" }, take: 10 },
      },
    });

    if (!lease) throw new AppError("Lease not found", 404);
    return lease;
  }

  async getMyLeases(userId: string, role: "tenant" | "landlord") {
    const where =
      role === "landlord" ? { landlordId: userId } : { tenantId: userId };
    return prisma.lease.findMany({
      where,
      include: {
        property: { select: { id: true, title: true, address: true } },
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        landlord: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(leaseId: string, userId: string, status: string) {
    const lease = await prisma.lease.findFirst({
      where: { id: leaseId, landlordId: userId },
    });
    if (!lease) throw new AppError("Lease not found or access denied", 404);

    return prisma.lease.update({
      where: { id: leaseId },
      data: { status: status as Parameters<typeof prisma.lease.update>[0]["data"]["status"] },
    });
  }

  async signLease(leaseId: string, userId: string) {
    const lease = await prisma.lease.findFirst({
      where: {
        id: leaseId,
        OR: [{ tenantId: userId }, { landlordId: userId }],
      },
    });
    if (!lease) throw new AppError("Lease not found", 404);

    const updateData: Record<string, boolean> = {};
    if (lease.tenantId === userId) updateData.signedByTenant = true;
    if (lease.landlordId === userId) updateData.signedByLandlord = true;

    const updated = await prisma.lease.update({
      where: { id: leaseId },
      data: updateData,
    });

    // If both signed, activate the lease
    if (updated.signedByTenant && updated.signedByLandlord) {
      await prisma.lease.update({
        where: { id: leaseId },
        data: { status: "ACTIVE", signedAt: new Date() },
      });
    }

    return updated;
  }

  async terminate(leaseId: string, userId: string, reason: string) {
    const lease = await prisma.lease.findFirst({
      where: { id: leaseId, landlordId: userId },
    });
    if (!lease) throw new AppError("Lease not found or access denied", 404);

    return prisma.lease.update({
      where: { id: leaseId },
      data: {
        status: "TERMINATED",
        terminatedAt: new Date(),
        terminationReason: reason,
      },
    });
  }
}

export default new LeaseService();
