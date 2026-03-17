// @ts-nocheck
// Booking Service
import { BookingType } from "@prisma/client";

import prisma from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

export class BookingService {
  async create(userId: string, data: Record<string, unknown>) {
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId as string },
    });

    if (!property) {
      throw new AppError("Property not found", 404, "PROPERTY_NOT_FOUND");
    }

    const startTime = new Date(data.startTime as string);
    const endTime = new Date(data.endTime as string);

    if (endTime <= startTime) {
      throw new AppError(
        "End time must be after start time",
        400,
        "INVALID_TIME_RANGE",
      );
    }

    const booking = await prisma.booking.create({
      data: {
        propertyId: data.propertyId as string,
        tenantId: userId,
        type: data.type as BookingType,
        title: data.title as string,
        startTime,
        endTime,
        status: "PENDING",
        notes: (data.notes as string) || null,
        location: (data.location as string) || null,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return booking;
  }

  async getAll(filters: Record<string, unknown> = {}) {
    const {
      page = 1,
      limit = 50,
      propertyId,
      status,
      type,
      startDate,
      endDate,
    } = filters;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const where: Record<string, unknown> = {};
    if (propertyId) where.propertyId = propertyId;
    if (status) where.status = status;
    if (type) where.type = type;

    if (startDate || endDate) {
      const timeFilter: Record<string, Date> = {};
      if (startDate) timeFilter.gte = new Date(startDate as string);
      if (endDate) timeFilter.lte = new Date(endDate as string);
      where.startTime = timeFilter;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              address: true,
            },
          },
          tenant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { startTime: "asc" },
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async getById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    return booking;
  }

  async getMyBookings(userId: string, filters: Record<string, unknown> = {}) {
    const { page = 1, limit = 50, startDate, endDate } = filters;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const where: Record<string, unknown> = { tenantId: userId };

    if (startDate || endDate) {
      const timeFilter: Record<string, Date> = {};
      if (startDate) timeFilter.gte = new Date(startDate as string);
      if (endDate) timeFilter.lte = new Date(endDate as string);
      where.startTime = timeFilter;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              address: true,
            },
          },
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { startTime: "asc" },
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async update(id: string, userId: string, data: Record<string, unknown>) {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    if (booking.tenantId !== userId) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }

    const updateData: Record<string, unknown> = {};
    if (data.type !== undefined) updateData.type = data.type;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.startTime !== undefined)
      updateData.startTime = new Date(data.startTime as string);
    if (data.endTime !== undefined)
      updateData.endTime = new Date(data.endTime as string);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.location !== undefined) updateData.location = data.location;

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updated;
  }

  async delete(id: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    if (booking.tenantId !== userId) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }

    await prisma.booking.delete({ where: { id } });
  }
}

export default new BookingService();
