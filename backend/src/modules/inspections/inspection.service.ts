// Inspection Service
import prisma from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

export class InspectionService {
  async create(userId: string, data: Record<string, unknown>) {
    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!property) {
      throw new AppError("Property not found", 404, "PROPERTY_NOT_FOUND");
    }

    const inspection = await prisma.inspection.create({
      data: {
        ...data,
        userId,
        status: "SCHEDULED",
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return inspection;
  }

  async getAll(filters: Record<string, unknown> = {}) {
    const { page = 1, limit = 20, propertyId, userId, status } = filters;

    const where: Record<string, unknown> = {};
    if (propertyId) where.propertyId = propertyId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [inspections, total] = await Promise.all([
      prisma.inspection.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              address: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { scheduledDate: "asc" },
      }),
      prisma.inspection.count({ where }),
    ]);

    return {
      inspections,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const inspection = await prisma.inspection.findUnique({
      where: { id },
      include: {
        property: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!inspection) {
      throw new AppError("Inspection not found", 404, "INSPECTION_NOT_FOUND");
    }

    return inspection;
  }

  async update(id: string, userId: string, data: Record<string, unknown>) {
    const inspection = await prisma.inspection.findUnique({
      where: { id },
    });

    if (!inspection) {
      throw new AppError("Inspection not found", 404, "INSPECTION_NOT_FOUND");
    }

    if (inspection.userId !== userId) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }

    const updated = await prisma.inspection.update({
      where: { id },
      data,
    });

    return updated;
  }

  async cancel(id: string, userId: string, reason: string) {
    const inspection = await prisma.inspection.findUnique({
      where: { id },
    });

    if (!inspection) {
      throw new AppError("Inspection not found", 404, "INSPECTION_NOT_FOUND");
    }

    if (inspection.userId !== userId) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }

    const updated = await prisma.inspection.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });

    return updated;
  }

  async getMyInspections(userId: string, page = 1, limit = 20) {
    const [inspections, total] = await Promise.all([
      prisma.inspection.findMany({
        where: { userId },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              address: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { scheduledDate: "asc" },
      }),
      prisma.inspection.count({ where: { userId } }),
    ]);

    return {
      inspections,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

export default new InspectionService();
