import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/prisma';
import { getProductBySlug, getFeaturedProducts } from '@/server/services/product.service';
import { getCategories, getCategoryBySlug } from '@/server/services/category.service';
import { createOrder } from '@/server/services/order.service';
import { createOrderSchema } from '@/lib/validations';

describe('Product Service', () => {
  it('should retrieve products from database', async () => {
    const products = await getFeaturedProducts(10);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('price');
    expect(products[0]).toHaveProperty('images');
  });

  it('should retrieve product by slug', async () => {
    const products = await prisma.product.findFirst({ where: { isActive: true } });
    expect(products).not.toBeNull();

    const product = await getProductBySlug(products!.slug);
    expect(product).not.toBeNull();
    expect(product!.slug).toBe(products!.slug);
  });
});

describe('Category Service', () => {
  it('should retrieve categories', async () => {
    const categories = await getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty('name');
    expect(categories[0]).toHaveProperty('slug');
  });

  it('should retrieve category by slug', async () => {
    const category = await prisma.category.findFirst({ where: { isActive: true } });
    expect(category).not.toBeNull();

    const result = await getCategoryBySlug(category!.slug);
    expect(result).not.toBeNull();
    expect(result!.slug).toBe(category!.slug);
  });
});

describe('Order Service', () => {
  it('should create order with server-side price calculation', async () => {
    const product = await prisma.product.findFirst({
      where: { isActive: true, stock: { gt: 0 } },
    });
    expect(product).not.toBeNull();

    const order = await createOrder({
      customerName: 'Test User',
      customerPhone: '+37499123456',
      items: [{ productId: product!.id, quantity: 1 }],
    });

    expect(order.orderNumber).toBeTruthy();
    expect(order.totalAmount).toBe(product!.price);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].unitPrice).toBe(product!.price);
    expect(order.items[0].productName).toBe(product!.name);
    expect(order.paymentMethod).toBe('MANUAL');
    expect(order.paymentStatus).toBe('PENDING');

    // Cleanup
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.product.update({
      where: { id: product!.id },
      data: { stock: { increment: 1 } },
    });
  });

  it('should reject invalid order submission', () => {
    const result = createOrderSchema.safeParse({
      customerName: 'A',
      customerPhone: 'invalid',
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it('should reject order with non-existent product', async () => {
    await expect(
      createOrder({
        customerName: 'Test User',
        customerPhone: '+37499123456',
        items: [{ productId: 'non-existent-id', quantity: 1 }],
      }),
    ).rejects.toThrow('PRODUCT_NOT_FOUND');
  });
});

describe('Admin Authorization', () => {
  it('should have admin user in database', async () => {
    const admin = await prisma.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL ?? 'admin@wondacraft.am' },
    });
    expect(admin).not.toBeNull();
    expect(admin!.role).toBe('ADMIN');
  });
});
