// Property Service - Business Logic
import prisma from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

export class PropertyService {
  // Create property
  async create(ownerId: string, data: Record<string, unknown>) {
    // Generate slug from title
    const slug =
      (data.title as string).toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Date.now();

    const property = await prisma.property.create({
      data: {
        ...data,
        slug,
        ownerId,
        status: "DRAFT",
      } as Parameters<typeof prisma.property.create>[0]["data"],
      include: {
        images: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return property;
  }

  // Get all properties with filters
  async getAll(filters: Record<string, unknown> = {}) {
    const {
      page = 1,
      limit = 20,
      propertyType,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      search,
    } = filters;

    const where: Record<string, unknown> = {
      deletedAt: null,
      status: status || "ACTIVE", // Default to ACTIVE properties
    };

    if (propertyType) where.propertyType = propertyType;
    if (minPrice || maxPrice) {
      const price: Record<string, number> = {};
      if (minPrice) price.gte = parseFloat(minPrice as string);
      if (maxPrice) price.lte = parseFloat(maxPrice as string);
      where.price = price;
    }
    if (bedrooms) where.bedrooms = parseInt(bedrooms as string);
    if (bathrooms) where.bathrooms = parseFloat(bathrooms as string);
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: {
            orderBy: { order: "asc" },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        skip: ((page as number) - 1) * (limit as number),
        take: limit as number,
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where }),
    ]);

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / (limit as number)),
      },
    };
  }

  // Get property by ID
  async getById(id: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        owner: {
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

    if (!property || property.deletedAt) {
      throw new AppError("Property not found", 404, "PROPERTY_NOT_FOUND");
    }

    // Increment view count
    await prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return property;
  }

  // Get property by slug
  async getBySlug(slug: string) {
    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!property || property.deletedAt) {
      throw new AppError("Property not found", 404, "PROPERTY_NOT_FOUND");
    }

    return property;
  }

  // Update property
  async update(id: string, ownerId: string, data: Record<string, unknown>) {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property || property.deletedAt) {
      throw new AppError("Property not found", 404, "PROPERTY_NOT_FOUND");
    }

    if (property.ownerId !== ownerId) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }

    const updated = await prisma.property.update({
      where: { id },
      data,
      include: {
        images: true,
      },
    });

    return updated;
  }

  // Delete property
  async delete(id: string, ownerId: string) {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property || property.deletedAt) {
      throw new AppError("Property not found", 404, "PROPERTY_NOT_FOUND");
    }

    if (property.ownerId !== ownerId) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }

    // Soft delete
    await prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Get user's properties
  async getMyProperties(ownerId: string, page = 1, limit = 20) {
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: {
          ownerId,
          deletedAt: null,
        },
        include: {
          images: {
            orderBy: { order: "asc" },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({
        where: {
          ownerId,
          deletedAt: null,
        },
      }),
    ]);

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Publish property
  async publish(id: string, ownerId: string) {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property || property.deletedAt) {
      throw new AppError("Property not found", 404, "PROPERTY_NOT_FOUND");
    }

    if (property.ownerId !== ownerId) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        status: "ACTIVE",
        publishedAt: new Date(),
      },
    });

    return updated;
  }
}

export default new PropertyService();
