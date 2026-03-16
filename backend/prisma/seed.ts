// Database Seeding Script
// Creates realistic test data for all modules

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.applicationDocument.deleteMany();
  await prisma.application.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.landlordProfile.deleteMany();
  await prisma.tenantProfile.deleteMany();
  await prisma.agentProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👥 Creating users...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('SuperAdmin@2024', 10);

  // Super Admin
  await prisma.user.create({
    data: {
      email: 'admin@propmanage.com',
      passwordHash: adminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+1-555-0000',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 100,
    },
  });

  // Landlords
  const landlord1 = await prisma.user.create({
    data: {
      email: 'john.landlord@example.com',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1-555-0101',
      role: 'LANDLORD',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 100,
      landlordProfile: {
        create: {
          businessName: 'Smith Properties LLC',
          propertiesCount: 5,
          rating: 4.8,
          verificationStatus: 'verified',
          bio: 'Professional property management with 15+ years experience',
          languages: ['English', 'Spanish'],
        },
      },
    },
  });

  const landlord2 = await prisma.user.create({
    data: {
      email: 'sarah.property@example.com',
      passwordHash: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1-555-0102',
      role: 'LANDLORD',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 100,
      landlordProfile: {
        create: {
          businessName: 'Johnson Real Estate',
          propertiesCount: 3,
          rating: 4.9,
          verificationStatus: 'verified',
          bio: 'Luxury property specialist',
          languages: ['English'],
        },
      },
    },
  });

  // Tenants
  const tenant1 = await prisma.user.create({
    data: {
      email: 'mike.tenant@example.com',
      passwordHash: hashedPassword,
      firstName: 'Mike',
      lastName: 'Davis',
      phone: '+1-555-0201',
      role: 'TENANT',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 90,
      tenantProfile: {
        create: {
          employmentStatus: 'employed',
          employerName: 'Tech Corp',
          jobTitle: 'Software Engineer',
          annualIncome: 95000,
          creditScore: 750,
          hasPets: true,
          petsDescription: '1 cat, well-behaved',
          hasVehicle: true,
          vehicleDescription: '2020 Honda Civic',
          smoking: false,
          moveInDate: new Date('2024-12-01'),
          leaseTerm: 12,
          budgetMin: 1500,
          budgetMax: 2500,
          preferredPropertyTypes: ['APARTMENT', 'CONDO'],
        },
      },
    },
  });

  const tenant2 = await prisma.user.create({
    data: {
      email: 'emma.renter@example.com',
      passwordHash: hashedPassword,
      firstName: 'Emma',
      lastName: 'Wilson',
      phone: '+1-555-0202',
      role: 'TENANT',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 85,
      tenantProfile: {
        create: {
          employmentStatus: 'employed',
          employerName: 'Design Studio',
          jobTitle: 'UX Designer',
          annualIncome: 78000,
          creditScore: 720,
          hasPets: false,
          hasVehicle: false,
          smoking: false,
          moveInDate: new Date('2024-11-15'),
          leaseTerm: 12,
          budgetMin: 1200,
          budgetMax: 1800,
          preferredPropertyTypes: ['STUDIO', 'APARTMENT'],
        },
      },
    },
  });

  const tenant3 = await prisma.user.create({
    data: {
      email: 'alex.tenant@example.com',
      passwordHash: hashedPassword,
      firstName: 'Alex',
      lastName: 'Martinez',
      phone: '+1-555-0203',
      role: 'TENANT',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 95,
      tenantProfile: {
        create: {
          employmentStatus: 'employed',
          employerName: 'Marketing Agency',
          jobTitle: 'Marketing Manager',
          annualIncome: 85000,
          creditScore: 780,
          hasPets: false,
          hasVehicle: true,
          vehicleDescription: '2021 Toyota Camry',
          smoking: false,
          moveInDate: new Date('2024-12-15'),
          leaseTerm: 12,
          budgetMin: 1800,
          budgetMax: 2800,
          preferredPropertyTypes: ['APARTMENT', 'TOWNHOUSE'],
        },
      },
    },
  });

  // Agents
  await prisma.user.create({
    data: {
      email: 'lisa.agent@example.com',
      passwordHash: hashedPassword,
      firstName: 'Lisa',
      lastName: 'Anderson',
      phone: '+1-555-0301',
      role: 'AGENT',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 100,
      agentProfile: {
        create: {
          licenseNumber: 'CA-DRE-12345678',
          licenseState: 'CA',
          licenseExpiry: new Date('2026-12-31'),
          brokerageName: 'Premium Realty Group',
          yearsOfExperience: 8,
          specializations: ['Residential', 'Luxury'],
          services: ['Buying', 'Selling', 'Renting'],
          languages: ['English', 'French'],
          rating: 4.9,
          reviewCount: 127,
          propertiesListed: 45,
          propertiesSold: 38,
          verificationStatus: 'verified',
          isFeatured: true,
          bio: 'Award-winning real estate agent specializing in luxury properties',
          serviceAreas: ['San Francisco', 'Oakland', 'Berkeley'],
        },
      },
    },
  });

  console.log('✅ Created users');

  // Create Properties
  console.log('🏠 Creating properties...');

  const properties = [];

  // Property 1 - Luxury Apartment
  const prop1 = await prisma.property.create({
    data: {
      ownerId: landlord1.id,
      title: 'Luxury Downtown Apartment with City Views',
      description: 'Stunning 2-bedroom apartment in the heart of downtown. Features floor-to-ceiling windows, modern kitchen with stainless steel appliances, hardwood floors, and breathtaking city views. Building amenities include 24/7 concierge, fitness center, rooftop pool, and secure parking.',
      slug: 'luxury-downtown-apartment-city-views-' + Date.now(),
      propertyType: 'APARTMENT',
      status: 'ACTIVE',
      address: {
        street: '123 Main Street, Unit 1205',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
      },
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      yearBuilt: 2020,
      price: 3500,
      pricePerSqft: 2.92,
      deposit: 3500,
      amenities: ['Gym', 'Pool', 'Concierge', 'Parking', 'Pet Friendly', 'Balcony', 'In-unit Laundry'],
      utilities: { electric: 'tenant', water: 'included', gas: 'tenant', internet: 'tenant' },
      parking: { type: 'garage', spaces: 1, covered: true },
      petPolicy: { allowed: true, deposit: 500, restrictions: 'Max 2 pets, under 50lbs' },
      availableFrom: new Date('2024-11-01'),
      leaseTerm: 12,
      views: 245,
      featured: true,
      verified: true,
      publishedAt: new Date(),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', caption: 'Living Room', order: 1, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', caption: 'Kitchen', order: 2 },
          { url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77', caption: 'Bedroom', order: 3 },
          { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14', caption: 'Bathroom', order: 4 },
        ],
      },
    },
  });
  properties.push(prop1);

  // Property 2 - Modern Studio
  const prop2 = await prisma.property.create({
    data: {
      ownerId: landlord1.id,
      title: 'Modern Studio in Trendy Neighborhood',
      description: 'Charming studio apartment perfect for young professionals. Features an open floor plan, modern kitchen, large windows with natural light, and updated bathroom. Walking distance to cafes, restaurants, and public transit.',
      slug: 'modern-studio-trendy-neighborhood-' + Date.now(),
      propertyType: 'STUDIO',
      status: 'ACTIVE',
      address: {
        street: '456 Valencia Street, #3A',
        city: 'San Francisco',
        state: 'CA',
        zip: '94110',
        country: 'USA',
        lat: 37.7599,
        lng: -122.4216,
      },
      bedrooms: 0,
      bathrooms: 1,
      sqft: 550,
      yearBuilt: 2018,
      price: 1850,
      pricePerSqft: 3.36,
      deposit: 1850,
      amenities: ['Laundry', 'Bike Storage', 'Hardwood Floors'],
      utilities: { electric: 'tenant', water: 'included', gas: 'included', internet: 'tenant' },
      parking: { type: 'street', spaces: 0, covered: false },
      petPolicy: { allowed: false, deposit: 0, restrictions: 'No pets' },
      availableFrom: new Date('2024-10-15'),
      leaseTerm: 12,
      views: 189,
      featured: false,
      verified: true,
      publishedAt: new Date(),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', caption: 'Studio Overview', order: 1, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa', caption: 'Kitchen Area', order: 2 },
        ],
      },
    },
  });
  properties.push(prop2);

  // Property 3 - Spacious House
  const prop3 = await prisma.property.create({
    data: {
      ownerId: landlord2.id,
      title: 'Spacious Family House with Backyard',
      description: 'Beautiful 4-bedroom house perfect for families. Features include a large backyard, modern kitchen, spacious living areas, master suite with walk-in closet, and 2-car garage. Located in a quiet, family-friendly neighborhood with excellent schools nearby.',
      slug: 'spacious-family-house-backyard-' + Date.now(),
      propertyType: 'HOUSE',
      status: 'ACTIVE',
      address: {
        street: '789 Oak Avenue',
        city: 'Oakland',
        state: 'CA',
        zip: '94610',
        country: 'USA',
        lat: 37.8044,
        lng: -122.2712,
      },
      bedrooms: 4,
      bathrooms: 2.5,
      sqft: 2400,
      lotSize: 6000,
      yearBuilt: 2015,
      price: 4200,
      pricePerSqft: 1.75,
      deposit: 4200,
      amenities: ['Backyard', 'Garage', 'Fireplace', 'Central AC', 'Dishwasher', 'Washer/Dryer'],
      utilities: { electric: 'tenant', water: 'tenant', gas: 'tenant', internet: 'tenant' },
      parking: { type: 'garage', spaces: 2, covered: true },
      petPolicy: { allowed: true, deposit: 750, restrictions: 'Max 2 pets' },
      availableFrom: new Date('2024-11-15'),
      leaseTerm: 12,
      views: 312,
      featured: true,
      verified: true,
      publishedAt: new Date(),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994', caption: 'Front View', order: 1, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', caption: 'Living Room', order: 2 },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', caption: 'Kitchen', order: 3 },
          { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3', caption: 'Backyard', order: 4 },
        ],
      },
    },
  });
  properties.push(prop3);

  // Properties 4-10 (More variety)
  const moreProperties = [
    {
      title: 'Cozy 1-Bedroom Apartment Near Transit',
      type: 'APARTMENT',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 750,
      price: 2100,
      city: 'Berkeley',
    },
    {
      title: 'Elegant Condo with Bay Views',
      type: 'CONDO',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      price: 3200,
      city: 'San Francisco',
    },
    {
      title: 'Charming Townhouse in Quiet Area',
      type: 'TOWNHOUSE',
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1800,
      price: 3800,
      city: 'Oakland',
    },
    {
      title: 'Modern Loft in Arts District',
      type: 'LOFT',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 900,
      price: 2600,
      city: 'San Francisco',
    },
    {
      title: 'Affordable Studio Near University',
      type: 'STUDIO',
      bedrooms: 0,
      bathrooms: 1,
      sqft: 450,
      price: 1500,
      city: 'Berkeley',
    },
    {
      title: 'Luxury 3-Bedroom Penthouse',
      type: 'APARTMENT',
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2000,
      price: 5500,
      city: 'San Francisco',
    },
    {
      title: 'Pet-Friendly 2-Bedroom with Patio',
      type: 'APARTMENT',
      bedrooms: 2,
      bathrooms: 1.5,
      sqft: 1000,
      price: 2400,
      city: 'Oakland',
    },
  ];

  for (const propData of moreProperties) {
    const prop = await prisma.property.create({
      data: {
        ownerId: Math.random() > 0.5 ? landlord1.id : landlord2.id,
        title: propData.title,
        description: `Well-maintained ${propData.type.toLowerCase()} in ${propData.city}. Perfect for professionals and families.`,
        slug: propData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        propertyType: propData.type as any,
        status: 'ACTIVE',
        address: {
          street: `${Math.floor(Math.random() * 9000 + 1000)} ${['Main', 'Oak', 'Pine', 'Elm'][Math.floor(Math.random() * 4)]} St`,
          city: propData.city,
          state: 'CA',
          zip: `94${Math.floor(Math.random() * 900 + 100)}`,
          country: 'USA',
          lat: 37.7749 + (Math.random() - 0.5) * 0.1,
          lng: -122.4194 + (Math.random() - 0.5) * 0.1,
        },
        bedrooms: propData.bedrooms,
        bathrooms: propData.bathrooms,
        sqft: propData.sqft,
        yearBuilt: 2010 + Math.floor(Math.random() * 14),
        price: propData.price,
        pricePerSqft: propData.price / propData.sqft,
        deposit: propData.price,
        amenities: ['Parking', 'Laundry', 'AC'],
        availableFrom: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
        leaseTerm: 12,
        views: Math.floor(Math.random() * 200),
        featured: Math.random() > 0.7,
        verified: true,
        publishedAt: new Date(),
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', caption: 'Main View', order: 1, isPrimary: true },
          ],
        },
      },
    });
    properties.push(prop);
  }

  console.log('✅ Created 10 properties');

  // Create Inspections
  console.log('📅 Creating inspections...');

  await prisma.inspection.create({
    data: {
      propertyId: prop1.id,
      userId: tenant1.id,
      type: 'IN_PERSON',
      status: 'SCHEDULED',
      scheduledDate: new Date('2024-10-25'),
      scheduledTime: '14:00',
      duration: 30,
      tenantNotes: 'Very interested in this property. Would like to see the gym facilities.',
    },
  });

  await prisma.inspection.create({
    data: {
      propertyId: prop1.id,
      userId: tenant2.id,
      type: 'VIRTUAL',
      status: 'CONFIRMED',
      scheduledDate: new Date('2024-10-26'),
      scheduledTime: '10:00',
      duration: 30,
      tenantNotes: 'Cannot visit in person, virtual tour would be great.',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
    },
  });

  await prisma.inspection.create({
    data: {
      propertyId: prop2.id,
      userId: tenant2.id,
      type: 'IN_PERSON',
      status: 'COMPLETED',
      scheduledDate: new Date('2024-10-15'),
      scheduledTime: '15:00',
      duration: 30,
      completedAt: new Date('2024-10-15T15:30:00'),
      tenantNotes: 'Loved the location!',
      landlordNotes: 'Great potential tenant, very professional.',
    },
  });

  await prisma.inspection.create({
    data: {
      propertyId: prop3.id,
      userId: tenant3.id,
      type: 'IN_PERSON',
      status: 'SCHEDULED',
      scheduledDate: new Date('2024-10-28'),
      scheduledTime: '11:00',
      duration: 45,
      tenantNotes: 'Looking for family home, interested in the backyard.',
    },
  });

  await prisma.inspection.create({
    data: {
      propertyId: prop3.id,
      userId: tenant1.id,
      type: 'OPEN_HOUSE',
      status: 'SCHEDULED',
      scheduledDate: new Date('2024-10-30'),
      scheduledTime: '13:00',
      duration: 120,
    },
  });

  console.log('✅ Created 5 inspections');

  // Create Applications
  console.log('📝 Creating applications...');

  await prisma.application.create({
    data: {
      propertyId: prop1.id,
      primaryApplicantId: tenant1.id,
      status: 'SUBMITTED',
      score: 85,
      scoreBreakdown: { credit: 30, income: 25, employment: 20, rental: 10 },
      personalInfo: {
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike.tenant@example.com',
        phone: '+1-555-0201',
        dateOfBirth: '1990-05-15',
        ssn: '***-**-1234',
      },
      employment: [
        {
          employer: 'Tech Corp',
          position: 'Software Engineer',
          startDate: '2020-01-15',
          current: true,
          salary: 95000,
          supervisorName: 'Jane Smith',
          supervisorPhone: '+1-555-9999',
        },
      ],
      income: [
        {
          source: 'employment',
          amount: 95000,
          frequency: 'annual',
          verified: true,
        },
      ],
      rentalHistory: [
        {
          address: '123 Previous St, SF, CA',
          landlordName: 'Bob Johnson',
          landlordPhone: '+1-555-8888',
          monthlyRent: 2000,
          startDate: '2021-01-01',
          endDate: '2024-09-30',
          reasonForLeaving: 'Looking for larger space',
        },
      ],
      references: [
        {
          name: 'Sarah Williams',
          relationship: 'Colleague',
          phone: '+1-555-7777',
          email: 'sarah.w@example.com',
        },
      ],
      moveInDate: new Date('2024-12-01'),
      leaseTerm: 12,
      pets: [{ type: 'cat', breed: 'Domestic Shorthair', weight: 10, name: 'Whiskers' }],
      vehicles: [{ make: 'Honda', model: 'Civic', year: 2020, licensePlate: 'ABC1234' }],
      submittedAt: new Date(),
    },
  });

  await prisma.application.create({
    data: {
      propertyId: prop2.id,
      primaryApplicantId: tenant2.id,
      status: 'UNDER_REVIEW',
      score: 78,
      scoreBreakdown: { credit: 28, income: 22, employment: 18, rental: 10 },
      personalInfo: {
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.renter@example.com',
        phone: '+1-555-0202',
        dateOfBirth: '1992-08-22',
        ssn: '***-**-5678',
      },
      employment: [
        {
          employer: 'Design Studio',
          position: 'UX Designer',
          startDate: '2021-03-01',
          current: true,
          salary: 78000,
        },
      ],
      income: [
        {
          source: 'employment',
          amount: 78000,
          frequency: 'annual',
          verified: false,
        },
      ],
      rentalHistory: [],
      references: [],
      moveInDate: new Date('2024-11-15'),
      leaseTerm: 12,
      pets: [],
      vehicles: [],
      submittedAt: new Date(),
    },
  });

  await prisma.application.create({
    data: {
      propertyId: prop3.id,
      primaryApplicantId: tenant3.id,
      status: 'APPROVED',
      score: 92,
      scoreBreakdown: { credit: 35, income: 27, employment: 20, rental: 10 },
      personalInfo: {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.tenant@example.com',
        phone: '+1-555-0203',
        dateOfBirth: '1988-12-10',
        ssn: '***-**-9012',
      },
      employment: [
        {
          employer: 'Marketing Agency',
          position: 'Marketing Manager',
          startDate: '2019-06-01',
          current: true,
          salary: 85000,
        },
      ],
      income: [
        {
          source: 'employment',
          amount: 85000,
          frequency: 'annual',
          verified: true,
        },
      ],
      rentalHistory: [
        {
          address: '456 Old Place Ave, Oakland, CA',
          landlordName: 'Mary Chen',
          landlordPhone: '+1-555-6666',
          monthlyRent: 2200,
          startDate: '2020-01-01',
          endDate: '2024-10-31',
          reasonForLeaving: 'Need more space for family',
        },
      ],
      references: [
        {
          name: 'Tom Anderson',
          relationship: 'Former Landlord',
          phone: '+1-555-5555',
          email: 'tom.a@example.com',
        },
      ],
      moveInDate: new Date('2024-12-15'),
      leaseTerm: 12,
      pets: [],
      vehicles: [{ make: 'Toyota', model: 'Camry', year: 2021, licensePlate: 'XYZ5678' }],
      submittedAt: new Date('2024-10-10'),
      reviewedAt: new Date('2024-10-12'),
      reviewedBy: landlord2.id,
    },
  });

  await prisma.application.create({
    data: {
      propertyId: prop1.id,
      primaryApplicantId: tenant2.id,
      status: 'DRAFT',
      score: 0,
      personalInfo: {
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.renter@example.com',
      },
      employment: [],
      income: [],
      rentalHistory: [],
      references: [],
      pets: [],
      vehicles: [],
    },
  });

  console.log('✅ Created 4 applications');

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('  - Users: 7 (1 super admin, 2 landlords, 3 tenants, 1 agent)');
  console.log('  - Properties: 10');
  console.log('  - Inspections: 5');
  console.log('  - Applications: 4');
  console.log('');
  console.log('🔑 Test Credentials:');
  console.log('  ');
  console.log('  🔐 SUPER ADMIN:');
  console.log('     Email: admin@propmanage.com');
  console.log('     Password: SuperAdmin@2024');
  console.log('  ');
  console.log('  👤 Tenant:');
  console.log('     Email: mike.tenant@example.com');
  console.log('     Password: password123');
  console.log('  ');
  console.log('  🏠 Landlord:');
  console.log('     Email: john.landlord@example.com');
  console.log('     Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
