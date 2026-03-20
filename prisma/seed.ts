import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // =============================================
  // CLEAR EXISTING DATA (respecting FK constraints)
  // =============================================
  console.log('🗑️  Clearing existing data...');

  const tablesToClear = [
    // Leaf / dependent tables first
    'TipDismissal',
    'UserFeatureUsage',
    'PushSubscription',
    'NotificationPreference',
    'WorkflowExecution',
    'Notification',
    'Transaction',
    'FinancialReport',
    'MaintenancePrediction',
    'MaintenanceRecord',
    'Workflow',
    'Availability',
    'Booking',
    'ScreeningRequest',
    'Inspection',
    'ApplicationDocument',
    'Application',
    'Payment',
    'Lease',
    'PropertyImage',
    'Property',
    'Subscription',
    'AgentProfile',
    'TenantProfile',
    'LandlordProfile',
    'EmailVerificationToken',
    'PasswordResetToken',
    'RefreshToken',
    'User',
  ];

  for (const table of tablesToClear) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
  }

  console.log('✅ Existing data cleared.');

  // =============================================
  // HASH PASSWORD
  // =============================================
  const passwordHash = bcrypt.hashSync('password123', 10);

  // =============================================
  // CREATE USERS
  // =============================================
  console.log('👤 Creating users...');

  const landlord = await prisma.user.create({
    data: {
      email: 'landlord@example.com',
      passwordHash,
      firstName: 'James',
      lastName: 'Mitchell',
      phone: '+1-555-100-2000',
      role: 'LANDLORD',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 100,
      lastLoginAt: new Date('2026-03-19T10:00:00Z'),
    },
  });

  const tenant = await prisma.user.create({
    data: {
      email: 'tenant@example.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Chen',
      phone: '+1-555-200-3000',
      role: 'TENANT',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 85,
      lastLoginAt: new Date('2026-03-18T14:30:00Z'),
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Rivera',
      phone: '+1-555-300-4000',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 100,
      lastLoginAt: new Date('2026-03-20T08:00:00Z'),
    },
  });

  const tenant2 = await prisma.user.create({
    data: {
      email: 'tenant2@example.com',
      passwordHash,
      firstName: 'Marcus',
      lastName: 'Johnson',
      phone: '+1-555-400-5000',
      role: 'TENANT',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 70,
      lastLoginAt: new Date('2026-03-17T16:00:00Z'),
    },
  });

  const tenant3 = await prisma.user.create({
    data: {
      email: 'tenant3@example.com',
      passwordHash,
      firstName: 'Emily',
      lastName: 'Park',
      phone: '+1-555-500-6000',
      role: 'TENANT',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 90,
      lastLoginAt: new Date('2026-03-16T11:00:00Z'),
    },
  });

  console.log('✅ Users created.');

  // =============================================
  // CREATE PROFILES
  // =============================================
  console.log('📋 Creating profiles...');

  await prisma.landlordProfile.create({
    data: {
      userId: landlord.id,
      businessName: 'Mitchell Property Group',
      taxId: 'EIN-12-3456789',
      bankAccountVerified: true,
      propertiesCount: 5,
      rating: 4.7,
      verificationStatus: 'verified',
      bio: 'Professional property manager with over 10 years of experience in residential real estate.',
      languages: ['English', 'Spanish'],
    },
  });

  await prisma.tenantProfile.create({
    data: {
      userId: tenant.id,
      employmentStatus: 'Full-time',
      employerName: 'Acme Corp',
      jobTitle: 'Senior Software Engineer',
      annualIncome: 125000,
      creditScore: 780,
      hasPets: true,
      petsDescription: 'One small dog (Corgi, 25 lbs)',
      hasVehicle: true,
      vehicleDescription: '2024 Toyota Camry',
      moveInDate: new Date('2025-06-01'),
      budgetMin: 1500,
      budgetMax: 3000,
      preferredPropertyTypes: ['APARTMENT', 'CONDO'],
    },
  });

  await prisma.tenantProfile.create({
    data: {
      userId: tenant2.id,
      employmentStatus: 'Full-time',
      employerName: 'Global Finance Inc',
      jobTitle: 'Financial Analyst',
      annualIncome: 95000,
      creditScore: 720,
      hasPets: false,
      hasVehicle: true,
      vehicleDescription: '2023 Honda Civic',
      budgetMin: 1200,
      budgetMax: 2200,
      preferredPropertyTypes: ['APARTMENT'],
    },
  });

  await prisma.tenantProfile.create({
    data: {
      userId: tenant3.id,
      employmentStatus: 'Full-time',
      employerName: 'City General Hospital',
      jobTitle: 'Registered Nurse',
      annualIncome: 82000,
      creditScore: 750,
      hasPets: true,
      petsDescription: 'One cat (indoor)',
      hasVehicle: false,
      budgetMin: 1000,
      budgetMax: 1800,
      preferredPropertyTypes: ['APARTMENT', 'STUDIO'],
    },
  });

  console.log('✅ Profiles created.');

  // =============================================
  // CREATE SUBSCRIPTIONS
  // =============================================
  console.log('💳 Creating subscriptions...');

  await prisma.subscription.create({
    data: {
      userId: landlord.id,
      plan: 'PROFESSIONAL',
      status: 'ACTIVE',
      currentPeriodStart: new Date('2026-03-01'),
      currentPeriodEnd: new Date('2026-04-01'),
    },
  });

  await prisma.subscription.create({
    data: {
      userId: admin.id,
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      currentPeriodStart: new Date('2026-03-01'),
      currentPeriodEnd: new Date('2026-04-01'),
    },
  });

  console.log('✅ Subscriptions created.');

  // =============================================
  // CREATE PROPERTIES
  // =============================================
  console.log('🏠 Creating properties...');

  const properties = await Promise.all([
    prisma.property.create({
      data: {
        ownerId: landlord.id,
        title: 'Modern Downtown Apartment',
        description:
          'Stylish 2-bedroom apartment in the heart of downtown with panoramic city views, modern finishes, and access to premium amenities including a rooftop pool and fitness center.',
        slug: 'modern-downtown-apartment',
        propertyType: 'APARTMENT',
        status: 'RENTED',
        address: {
          street: '450 Market Street',
          unit: 'Apt 1204',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'US',
          lat: 37.7911,
          lng: -122.3986,
        },
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1100,
        yearBuilt: 2020,
        price: 2200,
        deposit: 4400,
        amenities: [
          'Rooftop Pool',
          'Fitness Center',
          'In-unit Laundry',
          'Parking Garage',
          'Doorman',
          'EV Charging',
        ],
        availableFrom: new Date('2025-06-01'),
        leaseTerm: 12,
        views: 342,
        featured: true,
        verified: true,
        publishedAt: new Date('2025-04-15'),
      },
    }),
    prisma.property.create({
      data: {
        ownerId: landlord.id,
        title: 'Charming Victorian House',
        description:
          'Beautifully restored 3-bedroom Victorian home with original hardwood floors, a private garden, and a detached garage. Located in a quiet, tree-lined neighborhood.',
        slug: 'charming-victorian-house',
        propertyType: 'HOUSE',
        status: 'RENTED',
        address: {
          street: '782 Oak Avenue',
          city: 'Portland',
          state: 'OR',
          zip: '97205',
          country: 'US',
          lat: 45.5231,
          lng: -122.6765,
        },
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 1800,
        yearBuilt: 1905,
        price: 3000,
        deposit: 6000,
        amenities: [
          'Private Garden',
          'Detached Garage',
          'Hardwood Floors',
          'Fireplace',
          'Basement Storage',
        ],
        availableFrom: new Date('2025-05-01'),
        leaseTerm: 12,
        views: 518,
        featured: true,
        verified: true,
        publishedAt: new Date('2025-03-20'),
      },
    }),
    prisma.property.create({
      data: {
        ownerId: landlord.id,
        title: 'Luxury Waterfront Condo',
        description:
          'Premium 2-bedroom waterfront condo with floor-to-ceiling windows, a chef-grade kitchen, and a private balcony overlooking the harbor. Building includes concierge service.',
        slug: 'luxury-waterfront-condo',
        propertyType: 'CONDO',
        status: 'ACTIVE',
        address: {
          street: '100 Harbor Boulevard',
          unit: 'Unit 3501',
          city: 'Seattle',
          state: 'WA',
          zip: '98101',
          country: 'US',
          lat: 47.6062,
          lng: -122.3321,
        },
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1350,
        yearBuilt: 2022,
        price: 3500,
        deposit: 7000,
        amenities: [
          'Concierge',
          'Private Balcony',
          'Wine Cellar',
          'Spa',
          'Theater Room',
          'Dog Park',
        ],
        availableFrom: new Date('2026-04-01'),
        leaseTerm: 12,
        views: 215,
        featured: false,
        verified: true,
        publishedAt: new Date('2026-02-10'),
      },
    }),
    prisma.property.create({
      data: {
        ownerId: landlord.id,
        title: 'Cozy Studio Near University',
        description:
          'Efficient and well-designed studio apartment steps from the university campus. Features built-in storage, a kitchenette, and high-speed internet included.',
        slug: 'cozy-studio-near-university',
        propertyType: 'STUDIO',
        status: 'RENTED',
        address: {
          street: '55 College Road',
          unit: 'Studio 8B',
          city: 'Austin',
          state: 'TX',
          zip: '78705',
          country: 'US',
          lat: 30.2849,
          lng: -97.7341,
        },
        bedrooms: 0,
        bathrooms: 1,
        sqft: 450,
        yearBuilt: 2018,
        price: 1500,
        deposit: 1500,
        amenities: [
          'High-speed Internet',
          'Laundry Room',
          'Bike Storage',
          'Study Lounge',
          'Package Lockers',
        ],
        availableFrom: new Date('2025-08-01'),
        leaseTerm: 12,
        views: 189,
        featured: false,
        verified: true,
        publishedAt: new Date('2025-06-01'),
      },
    }),
    prisma.property.create({
      data: {
        ownerId: landlord.id,
        title: 'Spacious Family Townhouse',
        description:
          'A 4-bedroom townhouse perfect for families, featuring an open-concept living area, a modern kitchen with stainless steel appliances, and a private backyard.',
        slug: 'spacious-family-townhouse',
        propertyType: 'TOWNHOUSE',
        status: 'ACTIVE',
        address: {
          street: '1220 Maple Drive',
          city: 'Denver',
          state: 'CO',
          zip: '80220',
          country: 'US',
          lat: 39.7392,
          lng: -104.9903,
        },
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2200,
        yearBuilt: 2015,
        price: 2800,
        deposit: 5600,
        amenities: [
          'Private Backyard',
          'Attached Garage',
          'Central Air',
          'Stainless Steel Appliances',
          'Walk-in Closets',
          'Patio',
        ],
        availableFrom: new Date('2026-05-01'),
        leaseTerm: 12,
        views: 127,
        featured: true,
        verified: true,
        publishedAt: new Date('2026-03-01'),
      },
    }),
  ]);

  console.log('✅ Properties created.');

  // =============================================
  // CREATE PROPERTY IMAGES
  // =============================================
  console.log('📸 Creating property images...');

  for (let i = 0; i < properties.length; i++) {
    await prisma.propertyImage.createMany({
      data: [
        {
          propertyId: properties[i].id,
          url: `/assets/properties/property-${i + 1}-main.jpg`,
          caption: 'Main view',
          order: 0,
          isPrimary: true,
        },
        {
          propertyId: properties[i].id,
          url: `/assets/properties/property-${i + 1}-interior.jpg`,
          caption: 'Living area',
          order: 1,
          isPrimary: false,
        },
      ],
    });
  }

  console.log('✅ Property images created.');

  // =============================================
  // CREATE LEASES
  // =============================================
  console.log('📝 Creating leases...');

  const leases = await Promise.all([
    prisma.lease.create({
      data: {
        propertyId: properties[0].id,
        tenantId: tenant.id,
        landlordId: landlord.id,
        status: 'ACTIVE',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2026-06-01'),
        monthlyRent: 2200,
        depositAmount: 4400,
        depositPaid: true,
        lateFeeAmount: 50,
        lateFeeGraceDays: 5,
        signedByTenant: true,
        signedByLandlord: true,
        signedAt: new Date('2025-05-20'),
      },
    }),
    prisma.lease.create({
      data: {
        propertyId: properties[1].id,
        tenantId: tenant2.id,
        landlordId: landlord.id,
        status: 'ACTIVE',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2026-07-01'),
        monthlyRent: 3000,
        depositAmount: 6000,
        depositPaid: true,
        lateFeeAmount: 75,
        lateFeeGraceDays: 5,
        signedByTenant: true,
        signedByLandlord: true,
        signedAt: new Date('2025-06-25'),
      },
    }),
    prisma.lease.create({
      data: {
        propertyId: properties[3].id,
        tenantId: tenant3.id,
        landlordId: landlord.id,
        status: 'ACTIVE',
        startDate: new Date('2025-08-15'),
        endDate: new Date('2026-08-15'),
        monthlyRent: 1500,
        depositAmount: 1500,
        depositPaid: true,
        lateFeeAmount: 35,
        lateFeeGraceDays: 5,
        signedByTenant: true,
        signedByLandlord: true,
        signedAt: new Date('2025-08-10'),
      },
    }),
    prisma.lease.create({
      data: {
        propertyId: properties[2].id,
        tenantId: tenant.id,
        landlordId: landlord.id,
        status: 'PENDING_SIGNATURES',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2027-04-01'),
        monthlyRent: 3500,
        depositAmount: 7000,
        depositPaid: false,
        lateFeeAmount: 100,
        lateFeeGraceDays: 5,
      },
    }),
    prisma.lease.create({
      data: {
        propertyId: properties[4].id,
        tenantId: tenant2.id,
        landlordId: landlord.id,
        status: 'DRAFT',
        startDate: new Date('2026-05-01'),
        endDate: new Date('2027-05-01'),
        monthlyRent: 2800,
        depositAmount: 5600,
        depositPaid: false,
        lateFeeAmount: 65,
        lateFeeGraceDays: 5,
      },
    }),
  ]);

  console.log('✅ Leases created.');

  // =============================================
  // CREATE PAYMENTS
  // =============================================
  console.log('💰 Creating payments...');

  // Lease 1 — Downtown Apartment $2,200/mo
  const lease1Payments: Parameters<typeof prisma.payment.createMany>[0]['data'] = [];
  for (let month = 6; month <= 12; month++) {
    const dueDate = new Date(`2025-${String(month).padStart(2, '0')}-01`);
    lease1Payments.push({
      leaseId: leases[0].id,
      payerId: tenant.id,
      type: 'RENT',
      status: 'PAID',
      amount: 2200,
      dueDate,
      paidAt: new Date(dueDate.getTime() + 2 * 86400000),
      description: `Rent — ${dueDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
    });
  }
  for (let month = 1; month <= 2; month++) {
    const dueDate = new Date(`2026-${String(month).padStart(2, '0')}-01`);
    lease1Payments.push({
      leaseId: leases[0].id,
      payerId: tenant.id,
      type: 'RENT',
      status: 'PAID',
      amount: 2200,
      dueDate,
      paidAt: new Date(dueDate.getTime() + 86400000),
      description: `Rent — ${dueDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
    });
  }
  // March 2026 — overdue
  lease1Payments.push({
    leaseId: leases[0].id,
    payerId: tenant.id,
    type: 'RENT',
    status: 'OVERDUE',
    amount: 2200,
    dueDate: new Date('2026-03-01'),
    description: 'Rent — March 2026',
  });
  // Deposit
  lease1Payments.push({
    leaseId: leases[0].id,
    payerId: tenant.id,
    type: 'DEPOSIT',
    status: 'PAID',
    amount: 4400,
    dueDate: new Date('2025-05-25'),
    paidAt: new Date('2025-05-25'),
    description: 'Security deposit',
  });
  await prisma.payment.createMany({ data: lease1Payments });

  // Lease 2 — Victorian House $3,000/mo
  const lease2Payments: Parameters<typeof prisma.payment.createMany>[0]['data'] = [];
  for (let month = 7; month <= 12; month++) {
    const dueDate = new Date(`2025-${String(month).padStart(2, '0')}-01`);
    lease2Payments.push({
      leaseId: leases[1].id,
      payerId: tenant2.id,
      type: 'RENT',
      status: 'PAID',
      amount: 3000,
      dueDate,
      paidAt: new Date(dueDate.getTime() + 86400000),
      description: `Rent — ${dueDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
    });
  }
  for (let month = 1; month <= 3; month++) {
    const dueDate = new Date(`2026-${String(month).padStart(2, '0')}-01`);
    lease2Payments.push({
      leaseId: leases[1].id,
      payerId: tenant2.id,
      type: 'RENT',
      status: 'PAID',
      amount: 3000,
      dueDate,
      paidAt: new Date(dueDate.getTime() + 3 * 86400000),
      description: `Rent — ${dueDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
    });
  }
  await prisma.payment.createMany({ data: lease2Payments });

  // Lease 3 — Studio $1,500/mo
  const lease3Payments: Parameters<typeof prisma.payment.createMany>[0]['data'] = [];
  for (let month = 9; month <= 12; month++) {
    const dueDate = new Date(`2025-${String(month).padStart(2, '0')}-01`);
    lease3Payments.push({
      leaseId: leases[2].id,
      payerId: tenant3.id,
      type: 'RENT',
      status: 'PAID',
      amount: 1500,
      dueDate,
      paidAt: new Date(dueDate.getTime() + 86400000),
      description: `Rent — ${dueDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
    });
  }
  lease3Payments.push({
    leaseId: leases[2].id,
    payerId: tenant3.id,
    type: 'RENT',
    status: 'PAID',
    amount: 1500,
    dueDate: new Date('2026-01-01'),
    paidAt: new Date('2026-01-02'),
    description: 'Rent — January 2026',
  });
  lease3Payments.push({
    leaseId: leases[2].id,
    payerId: tenant3.id,
    type: 'RENT',
    status: 'PAID',
    amount: 1500,
    dueDate: new Date('2026-02-01'),
    paidAt: new Date('2026-02-08'),
    description: 'Rent — February 2026',
  });
  lease3Payments.push({
    leaseId: leases[2].id,
    payerId: tenant3.id,
    type: 'RENT',
    status: 'PAYMENT_PENDING',
    amount: 1500,
    dueDate: new Date('2026-03-01'),
    description: 'Rent — March 2026',
  });
  await prisma.payment.createMany({ data: lease3Payments });

  console.log('✅ Payments created.');

  // =============================================
  // CREATE MAINTENANCE RECORDS
  // =============================================
  console.log('🔧 Creating maintenance records...');

  await prisma.maintenanceRecord.createMany({
    data: [
      {
        propertyId: properties[0].id,
        systemType: 'PLUMBING',
        description: 'Kitchen faucet leak repaired — replaced cartridge and seals.',
        cost: 250,
        completedAt: new Date('2025-11-15'),
      },
      {
        propertyId: properties[0].id,
        systemType: 'HVAC',
        description: 'Annual HVAC inspection and filter replacement.',
        cost: 180,
        completedAt: new Date('2025-10-01'),
        nextPredictedDate: new Date('2026-10-01'),
      },
      {
        propertyId: properties[1].id,
        systemType: 'ELECTRICAL',
        description: 'Replaced outdated wiring in the kitchen. Upgraded to meet current code.',
        cost: 1200,
        completedAt: new Date('2025-09-20'),
      },
      {
        propertyId: properties[1].id,
        systemType: 'ROOFING',
        description: 'Patched minor roof leak near chimney flashing.',
        cost: 650,
        completedAt: new Date('2026-01-10'),
        nextPredictedDate: new Date('2027-01-10'),
      },
      {
        propertyId: properties[3].id,
        systemType: 'APPLIANCE',
        description: 'Replaced dishwasher with energy-efficient model.',
        cost: 800,
        completedAt: new Date('2026-02-05'),
      },
    ],
  });

  console.log('✅ Maintenance records created.');

  // =============================================
  // CREATE MAINTENANCE PREDICTIONS
  // =============================================
  console.log('🔮 Creating maintenance predictions...');

  await prisma.maintenancePrediction.createMany({
    data: [
      {
        propertyId: properties[0].id,
        systemType: 'HVAC',
        predictedFailureDate: new Date('2026-09-15'),
        confidence: 0.82,
      },
      {
        propertyId: properties[1].id,
        systemType: 'PLUMBING',
        predictedFailureDate: new Date('2026-07-20'),
        confidence: 0.65,
      },
      {
        propertyId: properties[4].id,
        systemType: 'STRUCTURAL',
        predictedFailureDate: new Date('2027-01-10'),
        confidence: 0.45,
      },
    ],
  });

  console.log('✅ Maintenance predictions created.');

  // =============================================
  // CREATE INSPECTIONS
  // =============================================
  console.log('🔍 Creating inspections...');

  await prisma.inspection.createMany({
    data: [
      {
        propertyId: properties[0].id,
        userId: tenant.id,
        type: 'IN_PERSON',
        status: 'COMPLETED',
        scheduledDate: new Date('2025-05-15'),
        scheduledTime: '10:00',
        duration: 30,
        tenantNotes: 'Great condition, loved the views.',
        confirmedAt: new Date('2025-05-14'),
        completedAt: new Date('2025-05-15T10:35:00Z'),
        reminderSent: true,
        reminderSentAt: new Date('2025-05-14T18:00:00Z'),
      },
      {
        propertyId: properties[1].id,
        userId: tenant2.id,
        type: 'VIRTUAL',
        status: 'COMPLETED',
        scheduledDate: new Date('2025-06-10'),
        scheduledTime: '14:00',
        duration: 20,
        meetingLink: 'https://meet.example.com/inspection-abc',
        confirmedAt: new Date('2025-06-09'),
        completedAt: new Date('2025-06-10T14:25:00Z'),
        reminderSent: true,
      },
      {
        propertyId: properties[2].id,
        userId: tenant.id,
        type: 'IN_PERSON',
        status: 'SCHEDULED',
        scheduledDate: new Date('2026-03-25'),
        scheduledTime: '11:00',
        duration: 45,
        tenantNotes: 'Interested in the harbor view unit.',
        reminderSent: false,
      },
      {
        propertyId: properties[4].id,
        userId: tenant2.id,
        type: 'OPEN_HOUSE',
        status: 'CONFIRMED',
        scheduledDate: new Date('2026-04-05'),
        scheduledTime: '13:00',
        duration: 60,
        confirmedAt: new Date('2026-03-20'),
        reminderSent: false,
      },
    ],
  });

  console.log('✅ Inspections created.');

  // =============================================
  // CREATE APPLICATIONS
  // =============================================
  console.log('📄 Creating applications...');

  await prisma.application.createMany({
    data: [
      {
        propertyId: properties[0].id,
        primaryApplicantId: tenant.id,
        status: 'APPROVED',
        score: 92,
        scoreBreakdown: { creditScore: 30, income: 25, rentalHistory: 20, employment: 17 },
        personalInfo: {
          firstName: 'Sarah',
          lastName: 'Chen',
          email: 'tenant@example.com',
          phone: '+1-555-200-3000',
          dateOfBirth: '1992-08-15',
        },
        employment: [
          { employer: 'Acme Corp', title: 'Senior Software Engineer', startDate: '2021-03-01', current: true, monthlyIncome: 10417 },
        ],
        income: [{ source: 'Employment', monthlyAmount: 10417, verified: true }],
        rentalHistory: [
          { address: '200 Pine St, San Francisco, CA', duration: '3 years', landlordName: 'Bay Area Rentals', reasonForLeaving: 'Seeking larger space' },
        ],
        references: [{ name: 'John Smith', relationship: 'Former Landlord', phone: '+1-555-999-0001' }],
        moveInDate: new Date('2025-06-01'),
        leaseTerm: 12,
        pets: [{ type: 'Dog', breed: 'Corgi', weight: 25 }],
        vehicles: [{ make: 'Toyota', model: 'Camry', year: 2024 }],
        emergencyContact: { name: 'David Chen', relationship: 'Brother', phone: '+1-555-200-3001' },
        coApplicants: [],
        submittedAt: new Date('2025-05-10'),
        reviewedBy: landlord.id,
        reviewedAt: new Date('2025-05-15'),
      },
      {
        propertyId: properties[1].id,
        primaryApplicantId: tenant2.id,
        status: 'APPROVED',
        score: 85,
        scoreBreakdown: { creditScore: 26, income: 22, rentalHistory: 20, employment: 17 },
        personalInfo: {
          firstName: 'Marcus',
          lastName: 'Johnson',
          email: 'tenant2@example.com',
          phone: '+1-555-400-5000',
        },
        employment: [
          { employer: 'Global Finance Inc', title: 'Financial Analyst', startDate: '2022-01-15', current: true, monthlyIncome: 7917 },
        ],
        income: [{ source: 'Employment', monthlyAmount: 7917, verified: true }],
        rentalHistory: [
          { address: '55 Elm St, Portland, OR', duration: '2 years', landlordName: 'Rose City Properties', reasonForLeaving: 'Relocating for work' },
        ],
        references: [{ name: 'Lisa Wang', relationship: 'Employer', phone: '+1-555-999-0002' }],
        moveInDate: new Date('2025-07-01'),
        leaseTerm: 12,
        pets: [],
        vehicles: [{ make: 'Honda', model: 'Civic', year: 2023 }],
        coApplicants: [],
        submittedAt: new Date('2025-06-05'),
        reviewedBy: landlord.id,
        reviewedAt: new Date('2025-06-12'),
      },
      {
        propertyId: properties[2].id,
        primaryApplicantId: tenant.id,
        status: 'UNDER_REVIEW',
        score: 0,
        personalInfo: {
          firstName: 'Sarah',
          lastName: 'Chen',
          email: 'tenant@example.com',
          phone: '+1-555-200-3000',
        },
        employment: [
          { employer: 'Acme Corp', title: 'Senior Software Engineer', startDate: '2021-03-01', current: true, monthlyIncome: 10417 },
        ],
        income: [{ source: 'Employment', monthlyAmount: 10417, verified: false }],
        rentalHistory: [],
        references: [],
        pets: [{ type: 'Dog', breed: 'Corgi', weight: 25 }],
        vehicles: [],
        coApplicants: [],
        submittedAt: new Date('2026-03-15'),
      },
    ],
  });

  console.log('✅ Applications created.');

  // =============================================
  // CREATE NOTIFICATIONS
  // =============================================
  console.log('🔔 Creating notifications...');

  await prisma.notification.createMany({
    data: [
      {
        userId: tenant.id,
        type: 'INSPECTION_CONFIRMATION',
        channel: 'EMAIL',
        status: 'DELIVERED',
        title: 'Inspection Confirmed',
        message: 'Your inspection for Modern Downtown Apartment on May 15, 2025 at 10:00 AM has been confirmed.',
        sentAt: new Date('2025-05-14T09:00:00Z'),
        readAt: new Date('2025-05-14T09:15:00Z'),
      },
      {
        userId: tenant.id,
        type: 'APPLICATION_STATUS',
        channel: 'IN_APP',
        status: 'READ',
        title: 'Application Approved',
        message: 'Your rental application for Modern Downtown Apartment has been approved. Congratulations!',
        sentAt: new Date('2025-05-15T12:00:00Z'),
        readAt: new Date('2025-05-15T12:30:00Z'),
      },
      {
        userId: tenant2.id,
        type: 'INSPECTION_REMINDER',
        channel: 'SMS',
        status: 'DELIVERED',
        title: 'Upcoming Open House',
        message: 'Reminder: Open house for Spacious Family Townhouse is on April 5, 2026 at 1:00 PM.',
        sentAt: new Date('2026-03-20T10:00:00Z'),
      },
      {
        userId: landlord.id,
        type: 'SYSTEM',
        channel: 'IN_APP',
        status: 'SENT',
        title: 'New Application Received',
        message: 'A new rental application has been submitted for Luxury Waterfront Condo by Sarah Chen.',
        sentAt: new Date('2026-03-15T08:00:00Z'),
      },
      {
        userId: tenant3.id,
        type: 'SYSTEM',
        channel: 'IN_APP',
        status: 'PENDING',
        title: 'Rent Payment Due',
        message: 'Your rent payment of $1,500 for March 2026 is due. Please submit payment at your earliest convenience.',
      },
    ],
  });

  console.log('✅ Notifications created.');

  // =============================================
  // CREATE BOOKINGS
  // =============================================
  console.log('📅 Creating bookings...');

  await prisma.booking.createMany({
    data: [
      {
        propertyId: properties[2].id,
        tenantId: tenant.id,
        type: 'VIEWING',
        title: 'Property Viewing — Luxury Waterfront Condo',
        startTime: new Date('2026-03-25T11:00:00Z'),
        endTime: new Date('2026-03-25T11:45:00Z'),
        status: 'CONFIRMED',
        notes: 'Prospective tenant wants to see the harbor view.',
        location: '100 Harbor Boulevard, Unit 3501, Seattle, WA',
      },
      {
        propertyId: properties[4].id,
        tenantId: tenant2.id,
        type: 'VIEWING',
        title: 'Open House — Spacious Family Townhouse',
        startTime: new Date('2026-04-05T13:00:00Z'),
        endTime: new Date('2026-04-05T14:00:00Z'),
        status: 'PENDING',
        location: '1220 Maple Drive, Denver, CO',
      },
    ],
  });

  console.log('✅ Bookings created.');

  // =============================================
  // CREATE WORKFLOWS
  // =============================================
  console.log('⚙️ Creating workflows...');

  await prisma.workflow.createMany({
    data: [
      {
        userId: landlord.id,
        name: 'New Tenant Welcome',
        description: 'Automated welcome sequence for new tenants after lease signing.',
        triggerType: 'NEW_TENANT',
        steps: [
          { order: 1, action: 'send_email', template: 'welcome_email' },
          { order: 2, action: 'create_checklist', template: 'move_in_checklist' },
          { order: 3, action: 'schedule_inspection', type: 'move_in', daysAfter: 3 },
        ],
        isActive: true,
      },
      {
        userId: landlord.id,
        name: 'Lease Expiry Reminder',
        description: 'Sends reminders 90, 60, and 30 days before lease expiry.',
        triggerType: 'LEASE_EXPIRY',
        steps: [
          { order: 1, action: 'send_email', daysBefore: 90, template: 'lease_expiry_90' },
          { order: 2, action: 'send_email', daysBefore: 60, template: 'lease_expiry_60' },
          { order: 3, action: 'send_email', daysBefore: 30, template: 'lease_expiry_30' },
        ],
        isActive: true,
      },
    ],
  });

  console.log('✅ Workflows created.');

  // =============================================
  // CREATE TRANSACTIONS & FINANCIAL REPORTS
  // =============================================
  console.log('📊 Creating financial data...');

  await prisma.transaction.createMany({
    data: [
      {
        propertyId: properties[0].id,
        type: 'INCOME',
        category: 'Rent',
        amount: 2200,
        date: new Date('2026-02-01'),
        description: 'February 2026 rent — Modern Downtown Apartment',
      },
      {
        propertyId: properties[0].id,
        type: 'EXPENSE',
        category: 'Maintenance',
        amount: 250,
        date: new Date('2025-11-15'),
        description: 'Kitchen faucet repair',
      },
      {
        propertyId: properties[1].id,
        type: 'INCOME',
        category: 'Rent',
        amount: 3000,
        date: new Date('2026-03-01'),
        description: 'March 2026 rent — Charming Victorian House',
      },
      {
        propertyId: properties[1].id,
        type: 'EXPENSE',
        category: 'Repairs',
        amount: 650,
        date: new Date('2026-01-10'),
        description: 'Roof leak patch near chimney',
      },
    ],
  });

  await prisma.financialReport.createMany({
    data: [
      {
        propertyId: properties[0].id,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-01-31'),
        netIncome: 2020,
        grossIncome: 2200,
        expenses: 180,
      },
      {
        propertyId: properties[1].id,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-01-31'),
        netIncome: 2350,
        grossIncome: 3000,
        expenses: 650,
      },
    ],
  });

  console.log('✅ Financial data created.');

  // =============================================
  // DONE
  // =============================================
  console.log('');
  console.log('🎉 Database seed completed successfully!');
  console.log('');
  console.log('   Users:          5 (1 landlord, 3 tenants, 1 admin)');
  console.log('   Properties:     5');
  console.log('   Leases:         5');
  console.log('   Payments:       ~30');
  console.log('   Inspections:    4');
  console.log('   Applications:   3');
  console.log('   Notifications:  5');
  console.log('   Bookings:       2');
  console.log('   Workflows:      2');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
