import { beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

beforeAll(async () => {
  // Ensure DB is connected
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
