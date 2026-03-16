// Application Service
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

export class ApplicationService {
  async create(userId: string, propertyId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
    }

    const application = await prisma.application.create({
      data: {
        propertyId,
        primaryApplicantId: userId,
        status: 'DRAFT',
        personalInfo: {},
        employment: [],
        income: [],
        rentalHistory: [],
        references: [],
        coApplicants: [],
        pets: [],
        vehicles: [],
        conditions: [],
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
      },
    });

    return application;
  }

  async getById(id: string) {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        property: true,
        primaryApplicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        documents: true,
      },
    });

    if (!application) {
      throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
    }

    return application;
  }

  async update(id: string, userId: string, data: any) {
    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
    }

    if (application.primaryApplicantId !== userId) {
      throw new AppError('Not authorized', 403, 'FORBIDDEN');
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return updated;
  }

  async submit(id: string, userId: string) {
    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
    }

    if (application.primaryApplicantId !== userId) {
      throw new AppError('Not authorized', 403, 'FORBIDDEN');
    }

    if (application.status !== 'DRAFT') {
      throw new AppError('Application already submitted', 400, 'ALREADY_SUBMITTED');
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    return updated;
  }

  async getMyApplications(userId: string, page = 1, limit = 20) {
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { primaryApplicantId: userId },
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
        orderBy: { createdAt: 'desc' },
      }),
      prisma.application.count({ where: { primaryApplicantId: userId } }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async approve(id: string, landlordId: string, conditions?: string[]) {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!application) {
      throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
    }

    if (application.property.ownerId !== landlordId) {
      throw new AppError('Not authorized', 403, 'FORBIDDEN');
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: conditions && conditions.length > 0 ? 'APPROVED_WITH_CONDITIONS' : 'APPROVED',
        conditions: conditions || [],
        reviewedBy: landlordId,
        reviewedAt: new Date(),
      },
    });

    return updated;
  }

  async reject(id: string, landlordId: string, reason: string) {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!application) {
      throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
    }

    if (application.property.ownerId !== landlordId) {
      throw new AppError('Not authorized', 403, 'FORBIDDEN');
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        reviewedBy: landlordId,
        reviewedAt: new Date(),
      },
    });

    return updated;
  }
}

export default new ApplicationService();
