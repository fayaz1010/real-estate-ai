import {
  PrismaClient,
  UserRole,
  UserStatus,
  PropertyType,
  PropertyStatus,
  LeaseStatus,
  PaymentStatus,
  PaymentType,
  ApplicationStatus,
  MaintenanceSystemType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ==========================================
// SEED DATA
// ==========================================

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data in reverse dependency order
  console.log("Cleaning existing seed data...");
  await prisma.payment.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.applicationDocument.deleteMany();
  await prisma.application.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.maintenancePrediction.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.screeningRequest.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.financialReport.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.workflowExecution.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.userFeatureUsage.deleteMany();
  await prisma.tipDismissal.deleteMany();
  await prisma.pushSubscription.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.landlordProfile.deleteMany();
  await prisma.tenantProfile.deleteMany();
  await prisma.agentProfile.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  // ------------------------------------------
  // USERS
  // ------------------------------------------
  console.log("Creating users...");

  const adminPassword = await hashPassword("Admin@2026!Secure");
  const landlordPassword = await hashPassword("Landlord@2026!Secure");
  const tenantPassword = await hashPassword("Tenant@2026!Secure");
  const tenant2Password = await hashPassword("Tenant2@2026!Secure");

  await prisma.user.create({
    data: {
      email: "admin@realestate-ai.com",
      passwordHash: adminPassword,
      firstName: "Sarah",
      lastName: "Mitchell",
      phone: "+1-555-100-0001",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      profileCompletion: 100,
      lastLoginAt: new Date("2026-03-19T09:00:00Z"),
    },
  });

  const landlord = await prisma.user.create({
    data: {
      email: "james.hartwell@outlook.com",
      passwordHash: landlordPassword,
      firstName: "James",
      lastName: "Hartwell",
      phone: "+1-555-200-0002",
      role: UserRole.LANDLORD,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      profileCompletion: 95,
      lastLoginAt: new Date("2026-03-18T14:30:00Z"),
    },
  });

  const tenant = await prisma.user.create({
    data: {
      email: "maria.chen@gmail.com",
      passwordHash: tenantPassword,
      firstName: "Maria",
      lastName: "Chen",
      phone: "+1-555-300-0003",
      role: UserRole.TENANT,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      profileCompletion: 85,
      lastLoginAt: new Date("2026-03-20T08:15:00Z"),
    },
  });

  const tenant2 = await prisma.user.create({
    data: {
      email: "david.okafor@yahoo.com",
      passwordHash: tenant2Password,
      firstName: "David",
      lastName: "Okafor",
      phone: "+1-555-400-0004",
      role: UserRole.TENANT,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      profileCompletion: 70,
      lastLoginAt: new Date("2026-03-17T11:00:00Z"),
    },
  });

  console.log(`  Created ${4} users`);

  // ------------------------------------------
  // PROFILES
  // ------------------------------------------
  console.log("Creating profiles...");

  await prisma.landlordProfile.create({
    data: {
      userId: landlord.id,
      businessName: "Hartwell Property Group",
      taxId: "XX-XXXXXXX",
      bankAccountVerified: true,
      propertiesCount: 5,
      rating: 4.7,
      verificationStatus: "verified",
      bio: "Experienced property manager with over 12 years in residential and commercial real estate across the greater Austin area.",
      website: "https://hartwellproperties.example.com",
      languages: ["English", "Spanish"],
    },
  });

  await prisma.tenantProfile.create({
    data: {
      userId: tenant.id,
      employmentStatus: "Full-Time",
      employerName: "Meridian Health Systems",
      jobTitle: "Senior Data Analyst",
      annualIncome: 92000,
      creditScore: 745,
      hasPets: true,
      petsDescription: "1 small dog (Corgi, 25 lbs)",
      hasVehicle: true,
      vehicleDescription: "2024 Honda Civic",
      smoking: false,
      moveInDate: new Date("2026-04-01"),
      leaseTerm: 12,
      preferredLocations: ["Austin", "Round Rock", "Cedar Park"],
      budgetMin: 1500,
      budgetMax: 2500,
      preferredPropertyTypes: ["APARTMENT", "CONDO"],
    },
  });

  await prisma.tenantProfile.create({
    data: {
      userId: tenant2.id,
      employmentStatus: "Full-Time",
      employerName: "TechBridge Solutions",
      jobTitle: "Frontend Developer",
      annualIncome: 105000,
      creditScore: 710,
      hasPets: false,
      hasVehicle: true,
      vehicleDescription: "2023 Tesla Model 3",
      smoking: false,
      moveInDate: new Date("2026-05-01"),
      leaseTerm: 12,
      preferredLocations: ["Austin", "South Congress"],
      budgetMin: 1800,
      budgetMax: 3000,
      preferredPropertyTypes: ["APARTMENT", "LOFT"],
    },
  });

  // ------------------------------------------
  // PROPERTIES
  // ------------------------------------------
  console.log("Creating properties...");

  const properties = await Promise.all([
    prisma.property.create({
      data: {
        ownerId: landlord.id,
        title: "Modern Downtown Austin Loft",
        description:
          "Stunning open-concept loft in the heart of downtown Austin. Floor-to-ceiling windows flood the space with natural light, showcasing polished concrete floors and exposed brick walls. The chef-grade kitchen features quartz countertops and stainless steel appliances. Walking distance to Rainey Street entertainment district and Lady Bird Lake trails.",
        slug: "modern-downtown-austin-loft",
        propertyType: PropertyType.LOFT,
        status: PropertyStatus.ACTIVE,
        address: {
          street: "301 Congress Ave",
          unit: "Unit 1204",
          city: "Austin",
          state: "TX",
          zip: "78701",
          country: "US",
          lat: 30.2652,
          lng: -97.7443,
        },
        bedrooms: 1,
        bathrooms: 1,
        sqft: 850,
        yearBuilt: 2019,
        price: 2200,
        pricePerSqft: 2.59,
        deposit: 2200,
        amenities: [
          "Rooftop Pool",
          "Fitness Center",
          "Concierge",
          "Parking Garage",
          "Pet Friendly",
          "In-Unit Laundry",
        ],
        availableFrom: new Date("2026-04-01"),
        leaseTerm: 12,
        views: 342,
        featured: true,
        verified: true,
        publishedAt: new Date("2026-02-15"),
        images: {
          create: [
            {
              url: "/assets/generated/property-1-living.png",
              caption: "Open-concept living area",
              order: 0,
              isPrimary: true,
            },
            {
              url: "/assets/generated/property-1-kitchen.png",
              caption: "Modern kitchen with quartz countertops",
              order: 1,
            },
            {
              url: "/assets/generated/property-1-bedroom.png",
              caption: "Spacious bedroom with city views",
              order: 2,
            },
          ],
        },
      },
    }),

    prisma.property.create({
      data: {
        ownerId: landlord.id,
        title: "Charming Craftsman House in Travis Heights",
        description:
          "Beautifully restored 1940s Craftsman bungalow nestled on a tree-lined street in sought-after Travis Heights. Original hardwood floors, built-in bookshelves, and a wraparound porch create timeless character. Updated kitchen with farmhouse sink. Large backyard with mature pecan trees, perfect for entertaining. Minutes from South Congress shops and restaurants.",
        slug: "craftsman-house-travis-heights",
        propertyType: PropertyType.HOUSE,
        status: PropertyStatus.ACTIVE,
        address: {
          street: "1512 Travis Heights Blvd",
          city: "Austin",
          state: "TX",
          zip: "78704",
          country: "US",
          lat: 30.2437,
          lng: -97.7546,
        },
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1650,
        lotSize: 6500,
        yearBuilt: 1942,
        price: 3200,
        pricePerSqft: 1.94,
        deposit: 3200,
        amenities: [
          "Hardwood Floors",
          "Wraparound Porch",
          "Fenced Yard",
          "Pet Friendly",
          "Garage",
          "Washer/Dryer",
        ],
        availableFrom: new Date("2026-04-15"),
        leaseTerm: 12,
        views: 578,
        featured: true,
        verified: true,
        publishedAt: new Date("2026-02-20"),
        images: {
          create: [
            {
              url: "/assets/generated/property-2-exterior.png",
              caption: "Craftsman exterior with wraparound porch",
              order: 0,
              isPrimary: true,
            },
            {
              url: "/assets/generated/property-2-living.png",
              caption: "Living room with original hardwood floors",
              order: 1,
            },
            {
              url: "/assets/generated/property-2-backyard.png",
              caption: "Spacious backyard with pecan trees",
              order: 2,
            },
          ],
        },
      },
    }),

    prisma.property.create({
      data: {
        ownerId: landlord.id,
        title: "Luxury Condo at The Domain",
        description:
          "Upscale 2-bedroom condo in The Domain, Austin's premier mixed-use destination. This corner unit offers panoramic views and an open floor plan with designer finishes. Italian marble bathroom, custom closets, and a private balcony overlooking the courtyard. Resort-style amenities include infinity pool, spa, and 24-hour fitness center. Steps from world-class dining and shopping.",
        slug: "luxury-condo-the-domain",
        propertyType: PropertyType.CONDO,
        status: PropertyStatus.ACTIVE,
        address: {
          street: "11600 Domain Dr",
          unit: "Suite 3401",
          city: "Austin",
          state: "TX",
          zip: "78758",
          country: "US",
          lat: 30.4022,
          lng: -97.7253,
        },
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        yearBuilt: 2022,
        price: 2800,
        pricePerSqft: 2.33,
        deposit: 2800,
        amenities: [
          "Infinity Pool",
          "Spa",
          "24hr Fitness",
          "Concierge",
          "Valet Parking",
          "Dog Park",
          "Balcony",
          "In-Unit Laundry",
        ],
        availableFrom: new Date("2026-05-01"),
        leaseTerm: 12,
        views: 210,
        featured: false,
        verified: true,
        publishedAt: new Date("2026-03-01"),
        images: {
          create: [
            {
              url: "/assets/generated/property-3-living.png",
              caption: "Corner unit with panoramic views",
              order: 0,
              isPrimary: true,
            },
            {
              url: "/assets/generated/property-3-bathroom.png",
              caption: "Italian marble bathroom",
              order: 1,
            },
            {
              url: "/assets/generated/property-3-pool.png",
              caption: "Resort-style infinity pool",
              order: 2,
            },
          ],
        },
      },
    }),

    prisma.property.create({
      data: {
        ownerId: landlord.id,
        title: "Cozy Studio near UT Campus",
        description:
          "Efficient and well-designed studio apartment just two blocks from the University of Texas campus. Recently renovated with modern finishes, full kitchen with dishwasher, and spacious closet with built-in organizers. Large windows facing east bring in morning sunlight. Ideal for students or young professionals seeking walkable access to campus, restaurants, and public transit.",
        slug: "cozy-studio-ut-campus",
        propertyType: PropertyType.STUDIO,
        status: PropertyStatus.ACTIVE,
        address: {
          street: "2505 University Ave",
          unit: "Apt 210",
          city: "Austin",
          state: "TX",
          zip: "78712",
          country: "US",
          lat: 30.2862,
          lng: -97.7394,
        },
        bedrooms: 0,
        bathrooms: 1,
        sqft: 450,
        yearBuilt: 2018,
        price: 1350,
        pricePerSqft: 3.0,
        deposit: 1350,
        amenities: [
          "Dishwasher",
          "In-Unit Laundry",
          "Bike Storage",
          "Study Lounge",
          "Package Lockers",
          "Rooftop Deck",
        ],
        availableFrom: new Date("2026-06-01"),
        leaseTerm: 12,
        views: 125,
        featured: false,
        verified: true,
        publishedAt: new Date("2026-03-10"),
        images: {
          create: [
            {
              url: "/assets/generated/property-4-main.png",
              caption: "Bright studio with modern finishes",
              order: 0,
              isPrimary: true,
            },
            {
              url: "/assets/generated/property-4-kitchen.png",
              caption: "Full kitchen with dishwasher",
              order: 1,
            },
          ],
        },
      },
    }),

    prisma.property.create({
      data: {
        ownerId: landlord.id,
        title: "Spacious Townhouse in Mueller",
        description:
          "Contemporary 3-bedroom townhouse in the award-winning Mueller community. Open-plan living with 10-foot ceilings, hardwood floors throughout, and a gourmet kitchen with gas range and waterfall island. Private rooftop terrace with Hill Country views. Two-car garage and EV charging station. Walking distance to Mueller Lake Park, Thinkery children's museum, and H-E-B grocery.",
        slug: "spacious-townhouse-mueller",
        propertyType: PropertyType.TOWNHOUSE,
        status: PropertyStatus.RENTED,
        address: {
          street: "4209 Berkman Dr",
          city: "Austin",
          state: "TX",
          zip: "78723",
          country: "US",
          lat: 30.2988,
          lng: -97.7025,
        },
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 1850,
        yearBuilt: 2021,
        price: 2950,
        pricePerSqft: 1.59,
        deposit: 2950,
        amenities: [
          "Rooftop Terrace",
          "EV Charging",
          "2-Car Garage",
          "Hardwood Floors",
          "Gas Range",
          "Community Pool",
        ],
        availableFrom: null,
        leaseTerm: 12,
        views: 415,
        featured: true,
        verified: true,
        publishedAt: new Date("2026-01-10"),
        images: {
          create: [
            {
              url: "/assets/generated/property-5-exterior.png",
              caption: "Modern townhouse exterior",
              order: 0,
              isPrimary: true,
            },
            {
              url: "/assets/generated/property-5-kitchen.png",
              caption: "Gourmet kitchen with waterfall island",
              order: 1,
            },
            {
              url: "/assets/generated/property-5-rooftop.png",
              caption: "Private rooftop terrace",
              order: 2,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`  Created ${properties.length} properties`);

  // ------------------------------------------
  // LEASES
  // ------------------------------------------
  console.log("Creating leases...");

  const leases = await Promise.all([
    // Active lease — Mueller Townhouse
    prisma.lease.create({
      data: {
        propertyId: properties[4].id,
        tenantId: tenant.id,
        landlordId: landlord.id,
        status: LeaseStatus.ACTIVE,
        startDate: new Date("2026-01-15"),
        endDate: new Date("2027-01-14"),
        monthlyRent: 2950,
        depositAmount: 2950,
        depositPaid: true,
        lateFeeAmount: 75,
        lateFeeGraceDays: 5,
        leaseDocumentUrl: "/documents/leases/lease-mueller-townhouse.pdf",
        signedByTenant: true,
        signedByLandlord: true,
        signedAt: new Date("2026-01-10"),
      },
    }),

    // Active lease — Downtown Loft (tenant2)
    prisma.lease.create({
      data: {
        propertyId: properties[0].id,
        tenantId: tenant2.id,
        landlordId: landlord.id,
        status: LeaseStatus.PENDING_SIGNATURES,
        startDate: new Date("2026-04-01"),
        endDate: new Date("2027-03-31"),
        monthlyRent: 2200,
        depositAmount: 2200,
        depositPaid: false,
        lateFeeAmount: 50,
        lateFeeGraceDays: 5,
        leaseDocumentUrl: "/documents/leases/lease-downtown-loft.pdf",
        signedByTenant: true,
        signedByLandlord: false,
      },
    }),

    // Expired lease — Craftsman House
    prisma.lease.create({
      data: {
        propertyId: properties[1].id,
        tenantId: tenant.id,
        landlordId: landlord.id,
        status: LeaseStatus.EXPIRED,
        startDate: new Date("2025-02-01"),
        endDate: new Date("2026-01-31"),
        monthlyRent: 3000,
        depositAmount: 3000,
        depositPaid: true,
        lateFeeAmount: 75,
        lateFeeGraceDays: 5,
        leaseDocumentUrl: "/documents/leases/lease-craftsman-house.pdf",
        signedByTenant: true,
        signedByLandlord: true,
        signedAt: new Date("2025-01-25"),
      },
    }),
  ]);

  console.log(`  Created ${leases.length} leases`);

  // ------------------------------------------
  // PAYMENTS
  // ------------------------------------------
  console.log("Creating payments...");

  const payments = await Promise.all([
    // Paid rent — Mueller Townhouse (Feb 2026)
    prisma.payment.create({
      data: {
        leaseId: leases[0].id,
        payerId: tenant.id,
        type: PaymentType.RENT,
        status: PaymentStatus.PAID,
        amount: 2950,
        currency: "USD",
        dueDate: new Date("2026-02-01"),
        paidAt: new Date("2026-01-30"),
        description: "February 2026 rent — Mueller Townhouse",
      },
    }),

    // Paid rent — Mueller Townhouse (Mar 2026)
    prisma.payment.create({
      data: {
        leaseId: leases[0].id,
        payerId: tenant.id,
        type: PaymentType.RENT,
        status: PaymentStatus.PAID,
        amount: 2950,
        currency: "USD",
        dueDate: new Date("2026-03-01"),
        paidAt: new Date("2026-02-28"),
        description: "March 2026 rent — Mueller Townhouse",
      },
    }),

    // Pending rent — Mueller Townhouse (Apr 2026)
    prisma.payment.create({
      data: {
        leaseId: leases[0].id,
        payerId: tenant.id,
        type: PaymentType.RENT,
        status: PaymentStatus.PAYMENT_PENDING,
        amount: 2950,
        currency: "USD",
        dueDate: new Date("2026-04-01"),
        description: "April 2026 rent — Mueller Townhouse",
      },
    }),

    // Security deposit — Mueller Townhouse
    prisma.payment.create({
      data: {
        leaseId: leases[0].id,
        payerId: tenant.id,
        type: PaymentType.DEPOSIT,
        status: PaymentStatus.PAID,
        amount: 2950,
        currency: "USD",
        dueDate: new Date("2026-01-15"),
        paidAt: new Date("2026-01-10"),
        description: "Security deposit — Mueller Townhouse",
      },
    }),

    // Overdue from expired lease
    prisma.payment.create({
      data: {
        leaseId: leases[2].id,
        payerId: tenant.id,
        type: PaymentType.RENT,
        status: PaymentStatus.OVERDUE,
        amount: 3000,
        currency: "USD",
        dueDate: new Date("2026-01-01"),
        description: "January 2026 rent — Craftsman House (final month)",
      },
    }),
  ]);

  console.log(`  Created ${payments.length} payments`);

  // ------------------------------------------
  // MAINTENANCE RECORDS
  // ------------------------------------------
  console.log("Creating maintenance records...");

  const maintenanceRecords = await Promise.all([
    prisma.maintenanceRecord.create({
      data: {
        propertyId: properties[4].id,
        systemType: MaintenanceSystemType.PLUMBING,
        description:
          "Kitchen faucet leaking at the base. Water pooling under the sink cabinet, causing mild water damage to the shelf liner. Replaced cartridge and tightened connections.",
        cost: 185,
        completedAt: new Date("2026-03-05"),
        nextPredictedDate: new Date("2027-03-05"),
      },
    }),

    prisma.maintenanceRecord.create({
      data: {
        propertyId: properties[4].id,
        systemType: MaintenanceSystemType.HVAC,
        description:
          "Annual HVAC filter replacement and system tune-up. Cleaned condensate drain line and checked refrigerant levels. System operating within normal parameters.",
        cost: 250,
        completedAt: new Date("2026-02-15"),
        nextPredictedDate: new Date("2026-08-15"),
      },
    }),

    prisma.maintenanceRecord.create({
      data: {
        propertyId: properties[1].id,
        systemType: MaintenanceSystemType.ELECTRICAL,
        description:
          "GFCI outlet in master bathroom tripping intermittently. Replaced outlet and tested all bathroom circuits. Wiring in good condition.",
        cost: 120,
        completedAt: new Date("2026-01-20"),
      },
    }),

    prisma.maintenanceRecord.create({
      data: {
        propertyId: properties[0].id,
        systemType: MaintenanceSystemType.APPLIANCE,
        description:
          "Dishwasher not draining properly. Cleared clogged drain hose and cleaned filter basket. Ran test cycle successfully.",
        cost: 95,
        completedAt: new Date("2026-03-12"),
      },
    }),

    prisma.maintenanceRecord.create({
      data: {
        propertyId: properties[2].id,
        systemType: MaintenanceSystemType.HVAC,
        description:
          "Thermostat displaying incorrect temperature. Replaced batteries and recalibrated sensor. Verified readings against independent thermometer.",
        cost: 65,
        completedAt: new Date("2026-02-28"),
      },
    }),

    prisma.maintenanceRecord.create({
      data: {
        propertyId: properties[4].id,
        systemType: MaintenanceSystemType.STRUCTURAL,
        description:
          "Hairline crack noticed in garage ceiling drywall. Inspected and determined to be cosmetic settling crack, not structural. Patched and repainted.",
        cost: 175,
        completedAt: new Date("2026-03-18"),
      },
    }),
  ]);

  console.log(`  Created ${maintenanceRecords.length} maintenance records`);

  // ------------------------------------------
  // APPLICATIONS (with AI Smart Score data)
  // ------------------------------------------
  console.log("Creating applications...");

  const applications = await Promise.all([
    // Maria applying for Downtown Loft
    prisma.application.create({
      data: {
        propertyId: properties[0].id,
        primaryApplicantId: tenant.id,
        status: ApplicationStatus.APPROVED,
        score: 82,
        scoreBreakdown: {
          creditScore: { value: 745, weight: 0.3, normalizedScore: 85 },
          incomeToRent: { value: 3.48, weight: 0.25, normalizedScore: 90 },
          rentalHistory: {
            value: "positive",
            weight: 0.25,
            normalizedScore: 80,
          },
          employmentStability: {
            value: "3 years",
            weight: 0.2,
            normalizedScore: 70,
          },
          overallRisk: "low",
          recommendation:
            "Approve — strong income-to-rent ratio and solid credit history.",
        },
        personalInfo: {
          firstName: "Maria",
          lastName: "Chen",
          dateOfBirth: "1994-07-15",
          ssn: "***-**-4521",
          currentAddress: "908 E 5th St, Austin, TX 78702",
        },
        employment: [
          {
            employer: "Meridian Health Systems",
            title: "Senior Data Analyst",
            startDate: "2023-03-01",
            income: 92000,
            type: "Full-Time",
            supervisorPhone: "+1-555-600-7890",
          },
        ],
        income: [{ source: "Employment", monthlyAmount: 7666, verified: true }],
        rentalHistory: [
          {
            address: "908 E 5th St, Austin, TX 78702",
            landlordName: "Patricia Flores",
            landlordPhone: "+1-555-700-1234",
            monthlyRent: 1800,
            startDate: "2023-06-01",
            endDate: "2026-01-31",
            reasonForLeaving: "Seeking larger space",
          },
        ],
        references: [
          {
            name: "Patricia Flores",
            relationship: "Former Landlord",
            phone: "+1-555-700-1234",
          },
          {
            name: "Kevin Brooks",
            relationship: "Colleague",
            phone: "+1-555-800-5678",
          },
        ],
        creditCheck: {
          score: 745,
          provider: "TransUnion",
          date: "2026-02-20",
          status: "clean",
          derogatory: 0,
          collections: 0,
        },
        backgroundCheck: {
          status: "clear",
          provider: "GoodHire",
          date: "2026-02-22",
          criminalRecords: 0,
          evictions: 0,
        },
        moveInDate: new Date("2026-04-01"),
        leaseTerm: 12,
        pets: [{ type: "Dog", breed: "Corgi", weight: 25, name: "Biscuit" }],
        vehicles: [
          {
            make: "Honda",
            model: "Civic",
            year: 2024,
            licensePlate: "TX-BRK-4521",
          },
        ],
        emergencyContact: {
          name: "Lin Chen",
          relationship: "Mother",
          phone: "+1-555-900-1111",
        },
        coApplicants: [],
        submittedAt: new Date("2026-02-18"),
        reviewedBy: landlord.id,
        reviewedAt: new Date("2026-02-25"),
        documents: {
          create: [
            {
              type: "pay_stub",
              filename: "maria-chen-paystub-feb2026.pdf",
              url: "/documents/applications/maria-chen-paystub.pdf",
              size: 245000,
              uploadedBy: tenant.id,
              parsed: true,
              extractedData: {
                grossPay: 7666.67,
                netPay: 5800.12,
                payPeriod: "Monthly",
              },
            },
            {
              type: "id_document",
              filename: "maria-chen-drivers-license.pdf",
              url: "/documents/applications/maria-chen-id.pdf",
              size: 180000,
              uploadedBy: tenant.id,
              parsed: true,
              extractedData: {
                documentType: "Drivers License",
                state: "TX",
                expiry: "2028-07-15",
              },
            },
          ],
        },
      },
    }),

    // David applying for Luxury Condo
    prisma.application.create({
      data: {
        propertyId: properties[2].id,
        primaryApplicantId: tenant2.id,
        status: ApplicationStatus.UNDER_REVIEW,
        score: 74,
        scoreBreakdown: {
          creditScore: { value: 710, weight: 0.3, normalizedScore: 75 },
          incomeToRent: { value: 3.12, weight: 0.25, normalizedScore: 82 },
          rentalHistory: {
            value: "positive",
            weight: 0.25,
            normalizedScore: 70,
          },
          employmentStability: {
            value: "2 years",
            weight: 0.2,
            normalizedScore: 65,
          },
          overallRisk: "moderate",
          recommendation:
            "Conditionally approve — income adequate but shorter employment history. Consider requiring additional deposit.",
        },
        personalInfo: {
          firstName: "David",
          lastName: "Okafor",
          dateOfBirth: "1996-11-03",
          ssn: "***-**-8832",
          currentAddress: "4400 S Lamar Blvd, Apt 312, Austin, TX 78745",
        },
        employment: [
          {
            employer: "TechBridge Solutions",
            title: "Frontend Developer",
            startDate: "2024-05-15",
            income: 105000,
            type: "Full-Time",
            supervisorPhone: "+1-555-500-3456",
          },
        ],
        income: [{ source: "Employment", monthlyAmount: 8750, verified: true }],
        rentalHistory: [
          {
            address: "4400 S Lamar Blvd, Apt 312, Austin, TX 78745",
            landlordName: "Mark Stevenson",
            landlordPhone: "+1-555-600-9876",
            monthlyRent: 2100,
            startDate: "2024-08-01",
            endDate: "2026-04-30",
            reasonForLeaving: "Upgrading to larger unit",
          },
        ],
        references: [
          {
            name: "Mark Stevenson",
            relationship: "Current Landlord",
            phone: "+1-555-600-9876",
          },
          {
            name: "Amara Williams",
            relationship: "Colleague",
            phone: "+1-555-700-4321",
          },
        ],
        creditCheck: {
          score: 710,
          provider: "Equifax",
          date: "2026-03-10",
          status: "clean",
          derogatory: 0,
          collections: 0,
        },
        backgroundCheck: {
          status: "clear",
          provider: "GoodHire",
          date: "2026-03-12",
          criminalRecords: 0,
          evictions: 0,
        },
        moveInDate: new Date("2026-05-01"),
        leaseTerm: 12,
        pets: [],
        vehicles: [
          {
            make: "Tesla",
            model: "Model 3",
            year: 2023,
            licensePlate: "TX-EV-8832",
          },
        ],
        emergencyContact: {
          name: "Grace Okafor",
          relationship: "Sister",
          phone: "+1-555-900-2222",
        },
        coApplicants: [],
        submittedAt: new Date("2026-03-08"),
        documents: {
          create: [
            {
              type: "pay_stub",
              filename: "david-okafor-paystub-mar2026.pdf",
              url: "/documents/applications/david-okafor-paystub.pdf",
              size: 230000,
              uploadedBy: tenant2.id,
              parsed: true,
              extractedData: {
                grossPay: 8750.0,
                netPay: 6425.0,
                payPeriod: "Monthly",
              },
            },
          ],
        },
      },
    }),

    // Maria applying for Craftsman House (new application)
    prisma.application.create({
      data: {
        propertyId: properties[1].id,
        primaryApplicantId: tenant.id,
        status: ApplicationStatus.SUBMITTED,
        score: 78,
        scoreBreakdown: {
          creditScore: { value: 745, weight: 0.3, normalizedScore: 85 },
          incomeToRent: { value: 2.39, weight: 0.25, normalizedScore: 68 },
          rentalHistory: {
            value: "positive",
            weight: 0.25,
            normalizedScore: 80,
          },
          employmentStability: {
            value: "3 years",
            weight: 0.2,
            normalizedScore: 70,
          },
          overallRisk: "low-moderate",
          recommendation:
            "Approve — income-to-rent ratio is slightly below ideal but credit and history are solid.",
        },
        personalInfo: {
          firstName: "Maria",
          lastName: "Chen",
          dateOfBirth: "1994-07-15",
          ssn: "***-**-4521",
          currentAddress: "4209 Berkman Dr, Austin, TX 78723",
        },
        employment: [
          {
            employer: "Meridian Health Systems",
            title: "Senior Data Analyst",
            startDate: "2023-03-01",
            income: 92000,
            type: "Full-Time",
            supervisorPhone: "+1-555-600-7890",
          },
        ],
        income: [
          { source: "Employment", monthlyAmount: 7666, verified: false },
        ],
        rentalHistory: [
          {
            address: "4209 Berkman Dr, Austin, TX 78723",
            landlordName: "James Hartwell",
            landlordPhone: "+1-555-200-0002",
            monthlyRent: 2950,
            startDate: "2026-01-15",
            endDate: null,
            reasonForLeaving: "Seeking different neighborhood",
          },
        ],
        references: [
          {
            name: "James Hartwell",
            relationship: "Current Landlord",
            phone: "+1-555-200-0002",
          },
        ],
        moveInDate: new Date("2026-04-15"),
        leaseTerm: 12,
        pets: [{ type: "Dog", breed: "Corgi", weight: 25, name: "Biscuit" }],
        vehicles: [
          {
            make: "Honda",
            model: "Civic",
            year: 2024,
            licensePlate: "TX-BRK-4521",
          },
        ],
        emergencyContact: {
          name: "Lin Chen",
          relationship: "Mother",
          phone: "+1-555-900-1111",
        },
        coApplicants: [],
        submittedAt: new Date("2026-03-15"),
        documents: {
          create: [
            {
              type: "pay_stub",
              filename: "maria-chen-paystub-mar2026.pdf",
              url: "/documents/applications/maria-chen-paystub-mar.pdf",
              size: 248000,
              uploadedBy: tenant.id,
              parsed: false,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`  Created ${applications.length} applications`);

  // ------------------------------------------
  // SUBSCRIPTIONS
  // ------------------------------------------
  console.log("Creating subscriptions...");

  await prisma.subscription.create({
    data: {
      userId: landlord.id,
      plan: "PROFESSIONAL",
      status: "ACTIVE",
      currentPeriodStart: new Date("2026-03-01"),
      currentPeriodEnd: new Date("2026-04-01"),
    },
  });

  await prisma.subscription.create({
    data: {
      userId: tenant.id,
      plan: "FREE",
      status: "ACTIVE",
    },
  });

  // ------------------------------------------
  // NOTIFICATIONS
  // ------------------------------------------
  console.log("Creating notifications...");

  await prisma.notification.createMany({
    data: [
      {
        userId: tenant.id,
        type: "APPLICATION_STATUS",
        channel: "IN_APP",
        status: "DELIVERED",
        title: "Application Approved",
        message:
          "Your application for Modern Downtown Austin Loft has been approved. Please review and sign the lease agreement.",
        sentAt: new Date("2026-02-25"),
        readAt: new Date("2026-02-25"),
      },
      {
        userId: landlord.id,
        type: "SYSTEM",
        channel: "IN_APP",
        status: "DELIVERED",
        title: "New Application Received",
        message:
          "Maria Chen has submitted a new application for Charming Craftsman House in Travis Heights.",
        sentAt: new Date("2026-03-15"),
      },
      {
        userId: tenant.id,
        type: "SYSTEM",
        channel: "IN_APP",
        status: "DELIVERED",
        title: "Rent Payment Due Soon",
        message:
          "Your rent payment of $2,950 for Mueller Townhouse is due on April 1, 2026.",
        sentAt: new Date("2026-03-25"),
      },
    ],
  });

  console.log("  Created 3 notifications");

  // ------------------------------------------
  // DONE
  // ------------------------------------------
  console.log("");
  console.log("✅ Database seeded successfully!");
  console.log("");
  console.log("  Users:                4 (1 Admin, 1 Landlord, 2 Tenants)");
  console.log("  Properties:           5");
  console.log("  Leases:               3");
  console.log("  Payments:             5");
  console.log("  Maintenance Records:  6");
  console.log("  Applications:         3");
  console.log("  Subscriptions:        2");
  console.log("  Notifications:        3");
  console.log("");
  console.log("Demo credentials:");
  console.log("  Admin:    admin@realestate-ai.com     / Admin@2026!Secure");
  console.log("  Landlord: james.hartwell@outlook.com  / Landlord@2026!Secure");
  console.log("  Tenant:   maria.chen@gmail.com        / Tenant@2026!Secure");
  console.log("  Tenant2:  david.okafor@yahoo.com      / Tenant2@2026!Secure");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
