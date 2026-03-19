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

    // If full-text search query is provided, use raw SQL with tsvector
    if (search && typeof search === "string" && search.trim()) {
      return this.fullTextSearch(filters);
    }

    const where: Record<string, unknown> = {
      deletedAt: null,
      status: status || "ACTIVE",
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

  // Full-text search using PostgreSQL tsvector
  private async fullTextSearch(filters: Record<string, unknown>) {
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

    const searchQuery = (search as string).trim();
    const offset = ((page as number) - 1) * (limit as number);

    // Build WHERE conditions
    const conditions: string[] = [
      `p."deletedAt" IS NULL`,
      `p.status = $1`,
      `p.search_vector @@ plainto_tsquery('english', $2)`,
    ];
    const params: unknown[] = [status || "ACTIVE", searchQuery];
    let paramIdx = 3;

    if (propertyType) {
      conditions.push(`p."propertyType" = $${paramIdx}::"PropertyType"`);
      params.push(propertyType);
      paramIdx++;
    }
    if (minPrice) {
      conditions.push(`p.price >= $${paramIdx}`);
      params.push(parseFloat(minPrice as string));
      paramIdx++;
    }
    if (maxPrice) {
      conditions.push(`p.price <= $${paramIdx}`);
      params.push(parseFloat(maxPrice as string));
      paramIdx++;
    }
    if (bedrooms) {
      conditions.push(`p.bedrooms = $${paramIdx}`);
      params.push(parseInt(bedrooms as string));
      paramIdx++;
    }
    if (bathrooms) {
      conditions.push(`p.bathrooms = $${paramIdx}`);
      params.push(parseFloat(bathrooms as string));
      paramIdx++;
    }

    const whereClause = conditions.join(" AND ");

    // Count query
    const countResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) as count FROM "Property" p WHERE ${whereClause}`,
      ...params,
    );
    const total = Number(countResult[0].count);

    // Main query with rank ordering and joined data
    const limitParam = paramIdx;
    const offsetParam = paramIdx + 1;
    params.push(limit as number, offset);

    const properties = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT p.id, p."ownerId", p.title, p.description, p.slug, p."propertyType", p.status,
              p.address, p.bedrooms, p.bathrooms, p.sqft, p."lotSize", p."yearBuilt",
              p.price, p."pricePerSqft", p.deposit, p.amenities, p.utilities, p.parking,
              p."petPolicy", p."virtualTourUrl", p."videoUrl", p."floorPlanUrl",
              p."availableFrom", p."leaseTerm", p.views, p.featured, p.verified,
              p."publishedAt", p."createdAt", p."updatedAt", p."deletedAt",
              ts_rank(p.search_vector, plainto_tsquery('english', $2)) as search_rank,
              json_build_object('id', u.id, 'firstName', u."firstName", 'lastName', u."lastName") as owner
       FROM "Property" p
       LEFT JOIN "User" u ON p."ownerId" = u.id
       WHERE ${whereClause}
       ORDER BY search_rank DESC, p."createdAt" DESC
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      ...params,
    );

    // Fetch images for the returned properties
    const propertyIds = properties.map((p) => p.id as string);
    const images =
      propertyIds.length > 0
        ? await prisma.propertyImage.findMany({
            where: { propertyId: { in: propertyIds } },
            orderBy: { order: "asc" },
          })
        : [];

    // Attach images to properties
    const imagesByProperty = new Map<string, typeof images>();
    for (const img of images) {
      const list = imagesByProperty.get(img.propertyId) || [];
      list.push(img);
      imagesByProperty.set(img.propertyId, list);
    }

    const propertiesWithImages = properties.map((p) => ({
      ...p,
      images: imagesByProperty.get(p.id as string) || [],
    }));

    return {
      properties: propertiesWithImages,
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
