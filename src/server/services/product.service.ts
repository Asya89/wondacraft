import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { slugifyText } from '@/lib/utils';

export type ProductSortOption = 'newest' | 'price_asc' | 'price_desc' | 'name';

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  page?: number;
  limit?: number;
  sort?: ProductSortOption;
}

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: 'asc' as const } },
} satisfies Prisma.ProductInclude;

function getOrderBy(sort: ProductSortOption = 'newest'): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case 'price_asc':
      return { price: 'asc' };
    case 'price_desc':
      return { price: 'desc' };
    case 'name':
      return { name: 'asc' };
    default:
      return { createdAt: 'desc' };
  }
}

export async function getProducts(filters: ProductFilters = {}) {
  const { categorySlug, search, isFeatured, isNew, page = 1, limit = 12, sort = 'newest' } = filters;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(isFeatured !== undefined && { isFeatured }),
    ...(isNew !== undefined && { isNew }),
    ...(categorySlug && { category: { slug: categorySlug, isActive: true } }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: getOrderBy(sort),
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: productInclude,
  });
}

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getNewProducts(limit = 4) {
  return prisma.product.findMany({
    where: { isActive: true, isNew: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  return prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

// Admin functions
export async function getAllProductsAdmin() {
  return prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProductByIdAdmin(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function createProduct(data: {
  name: string;
  slug?: string;
  categoryId: string;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  oldPrice?: number | null;
  sku?: string | null;
  stock: number;
  material?: string | null;
  size?: string | null;
  isFeatured?: boolean;
  isNew?: boolean;
  isActive?: boolean;
}) {
  const slug = data.slug || slugifyText(data.name);
  return prisma.product.create({
    data: { ...data, slug },
    include: productInclude,
  });
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    categoryId: string;
    shortDescription: string | null;
    description: string | null;
    price: number;
    oldPrice: number | null;
    sku: string | null;
    stock: number;
    material: string | null;
    size: string | null;
    isFeatured: boolean;
    isNew: boolean;
    isActive: boolean;
  }>,
) {
  return prisma.product.update({
    where: { id },
    data,
    include: productInclude,
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function addProductImage(data: {
  productId: string;
  imageUrl: string;
  alt?: string;
  sortOrder?: number;
  isMain?: boolean;
}) {
  if (data.isMain) {
    await prisma.productImage.updateMany({
      where: { productId: data.productId },
      data: { isMain: false },
    });
  }
  return prisma.productImage.create({ data });
}

export async function deleteProductImage(id: string) {
  return prisma.productImage.delete({ where: { id } });
}

export async function setMainProductImage(productId: string, imageId: string) {
  await prisma.$transaction([
    prisma.productImage.updateMany({ where: { productId }, data: { isMain: false } }),
    prisma.productImage.update({ where: { id: imageId }, data: { isMain: true } }),
  ]);
}

export async function reorderProductImages(
  productId: string,
  imageOrders: Array<{ id: string; sortOrder: number }>,
) {
  await prisma.$transaction(
    imageOrders.map(({ id, sortOrder }) =>
      prisma.productImage.update({ where: { id, productId }, data: { sortOrder } }),
    ),
  );
}

export type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>;
