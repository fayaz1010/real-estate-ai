// Create Super Admin User
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Creating Super Admin...');

  const hashedPassword = await bcrypt.hash('SuperAdmin@2024', 10);

  await prisma.user.upsert({
    where: { email: 'admin@propmanage.com' },
    update: {
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
    create: {
      email: 'admin@propmanage.com',
      passwordHash: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+1-555-0000',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      profileCompletion: 100,
    },
  });

  console.log('✅ Super Admin created successfully!');
  console.log('');
  console.log('🔑 Super Admin Credentials:');
  console.log('   Email: admin@propmanage.com');
  console.log('   Password: SuperAdmin@2024');
  console.log('');
  console.log('⚠️  IMPORTANT: Change this password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
