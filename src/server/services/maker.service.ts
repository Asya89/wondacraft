import type { Maker, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { slugifyText } from '@/lib/utils';

export type MakerRecord = Maker;

export async function getMakers(includeInactive = false) {
  return prisma.maker.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
}

export async function getFeaturedMakers(limit = 3) {
  return prisma.maker.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    take: limit,
  });
}

export async function getMakerById(id: string) {
  return prisma.maker.findUnique({ where: { id } });
}

export async function getMakerBySlug(slug: string) {
  return prisma.maker.findFirst({ where: { slug, isActive: true } });
}

export async function createMaker(data: {
  name: string;
  slug?: string;
  craft: string;
  bio: string;
  image?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const slug = data.slug || slugifyText(data.name);
  return prisma.maker.create({
    data: {
      name: data.name,
      slug,
      craft: data.craft,
      bio: data.bio,
      image: data.image,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateMaker(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    craft: string;
    bio: string;
    image: string | null;
    sortOrder: number;
    isActive: boolean;
  }>,
) {
  return prisma.maker.update({ where: { id }, data });
}

export async function deleteMaker(id: string) {
  return prisma.maker.delete({ where: { id } });
}

export type MakerCreateInput = Prisma.MakerCreateInput;
