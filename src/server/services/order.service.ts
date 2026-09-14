import { OrderStatus, PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import { createOrderSchema, type CreateOrderInput } from '@/lib/validations';
import { getNotificationService } from '@/lib/services/notification';

const orderInclude = {
  items: {
    include: { product: { include: { images: { where: { isMain: true }, take: 1 } } } },
  },
} satisfies Prisma.OrderInclude;

export async function createOrder(input: CreateOrderInput) {
  const validated = createOrderSchema.parse(input);

  const productIds = validated.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (products.length !== productIds.length) {
    throw new Error('PRODUCT_NOT_FOUND');
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  let totalAmount = 0;
  const orderItems = validated.items.map((item) => {
    const product = productMap.get(item.productId)!;

    if (product.stock < item.quantity) {
      throw new Error(`INSUFFICIENT_STOCK:${product.name}`);
    }

    const unitPrice = product.price;
    const totalPrice = unitPrice * item.quantity;
    totalAmount += totalPrice;

    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
    };
  });

  const orderNumber = generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        customerName: validated.customerName,
        customerPhone: validated.customerPhone,
        customerCity: validated.customerCity ?? null,
        customerAddress: validated.customerAddress ?? null,
        comment: validated.comment ?? null,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.MANUAL,
        totalAmount,
        items: { create: orderItems },
      },
      include: orderInclude,
    });

    for (const item of validated.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  const notificationService = getNotificationService();
  await notificationService.sendNewOrderNotification({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    items: order.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    })),
    totalAmount: order.totalAmount,
  });

  return order;
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: orderInclude,
  });
}

export async function getAllOrdersAdmin(status?: OrderStatus) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrderByIdAdmin(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id },
    data: { status },
    include: orderInclude,
  });
}

export async function getDashboardStats() {
  const [
    totalProducts,
    activeProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { status: OrderStatus.COMPLETED } }),
    prisma.order.aggregate({
      where: { status: OrderStatus.COMPLETED },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
  ]);

  return {
    totalProducts,
    activeProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue: revenueResult._sum.totalAmount ?? 0,
    recentOrders,
  };
}

export type OrderWithItems = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;
