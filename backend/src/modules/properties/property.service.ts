// Property Service - Business Logic
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

export class PropertyService {
  // Create property
  async create(ownerId: string, data: any) {
    // Generate slug from title
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const property = await prisma.property.create({
      data: {
        ...data,
        slug,
        ownerId,
        status: 'DRAFT',
      },
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
  async getAll(filters: any = {}) {
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

    const where: any = {
      deletedAt: null,
      status: status || 'ACTIVE', // Default to ACTIVE properties
    };

    if (propertyType) where.propertyType = propertyType;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (bedrooms) where.bedrooms = parseInt(bedrooms);
    if (bathrooms) where.bathrooms = parseFloat(bathrooms);
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.property.count({ where }),
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

  // Get property by ID
  async getById(id: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
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
      throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
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
          orderBy: { order: 'asc' },
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
      throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
    }

    return property;
  }

  // Update property
  async update(id: string, ownerId: string, data: any) {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property || property.deletedAt) {
      throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
    }

    if (property.ownerId !== ownerId) {
      throw new AppError('Not authorized', 403, 'FORBIDDEN');
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
      throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
    }

    if (property.ownerId !== ownerId) {
      throw new AppError('Not authorized', 403, 'FORBIDDEN');
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
            orderBy: { order: 'asc' },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
    }

    if (property.ownerId !== ownerId) {
      throw new AppError('Not authorized', 403, 'FORBIDDEN');
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        publishedAt: new Date(),
      },
    });

    return updated;
  }
}

export default new PropertyService();
