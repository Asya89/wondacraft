import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { slugifyText } from '@/lib/slugify';
import type { ProductSortOption } from '@/server/services/product.service';

const categoryInclude = {
  parent: true,
  children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' as const } },
  _count: { select: { products: { where: { isActive: true } } } },
} satisfies Prisma.CategoryInclude;

export async function getCategories(includeInactive = false) {
  return prisma.category.findMany({
    where: includeInactive ? {} : { isActive: true, parentId: null },
    include: categoryInclude,
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getAllCategoriesFlat(includeInactive = false) {
  return prisma.category.findMany({
    where: includeInactive ? {} : { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      parent: { select: { name: true } },
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
}

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findFirst({
    where: { slug, isActive: true },
    include: categoryInclude,
  });
});

export async function getCategoryProducts(
  slug: string,
  options: { page?: number; limit?: number; sort?: ProductSortOption } = {},
) {
  const { page = 1, limit = 12, sort = 'newest' } = options;

  const category = await getCategoryBySlug(slug);
  if (!category) return null;

  const categoryIds = [category.id, ...category.children.map((c) => c.id)];

  const orderBy = (() => {
    switch (sort) {
      case 'price_asc':
        return { price: 'asc' as const };
      case 'price_desc':
        return { price: 'desc' as const };
      case 'name':
        return { name: 'asc' as const };
      default:
        return { createdAt: 'desc' as const };
    }
  })();

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    categoryId: { in: categoryIds },
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        oldPrice: true,
        isNew: true,
        isFeatured: true,
        shortDescription: true,
        size: true,
        images: {
          orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }],
          take: 1,
          select: { imageUrl: true, alt: true, isMain: true },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { category, products, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getCategoryByIdAdmin(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: categoryInclude,
  });
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const slug = data.slug || slugifyText(data.name);
  return prisma.category.create({ data: { ...data, slug }, include: categoryInclude });
}

export async function updateCategory(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    sortOrder: number;
    isActive: boolean;
  }>,
) {
  return prisma.category.update({
    where: { id },
    data,
    include: categoryInclude,
  });
}

export async function deleteCategory(id: string) {
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw new Error('CATEGORY_HAS_PRODUCTS');
  }
  const childCount = await prisma.category.count({ where: { parentId: id } });
  if (childCount > 0) {
    throw new Error('CATEGORY_HAS_CHILDREN');
  }
  return prisma.category.delete({ where: { id } });
}

export type CategoryWithRelations = Prisma.CategoryGetPayload<{ include: typeof categoryInclude }>;
