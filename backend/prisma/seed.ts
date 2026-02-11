import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/encryption';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword('Admin123!');
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agentforge.io' },
    update: {},
    create: {
      email: 'admin@agentforge.io',
      password: adminPassword,
      name: 'Admin User',
      emailVerified: true,
      subscriptionTier: 'ENTERPRISE',
    },
  });

  // Create admin subscription
  await prisma.subscription.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      tier: 'ENTERPRISE',
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  // Create admin credits
  await prisma.credit.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      balance: 10000,
    },
  });

  // Create test user
  const testPassword = await hashPassword('Test123!');
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: testPassword,
      name: 'Test User',
      emailVerified: true,
      subscriptionTier: 'FREE',
    },
  });

  await prisma.subscription.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      tier: 'FREE',
      status: 'ACTIVE',
    },
  });

  await prisma.credit.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      balance: 100,
    },
  });

  console.log('Seeding completed!');
  console.log('Admin user:', { email: 'admin@agentforge.io', password: 'Admin123!' });
  console.log('Test user:', { email: 'test@example.com', password: 'Test123!' });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
