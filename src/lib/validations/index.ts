import { z } from 'zod';

const armenianPhoneRegex = /^(\+374|0)(10|11|33|41|43|44|55|77|91|92|93|94|95|96|97|98|99)\d{6}$/;

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
});

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Անունը պետք է լինի առնվազն 2 նիշ')
    .max(100)
    .transform((val) => val.trim()),
  customerPhone: z
    .string()
    .min(1, 'Հեռախոսahamysը պարտադիր է')
    .transform((val) => val.replace(/[\s\-()]/g, ''))
    .refine((val) => armenianPhoneRegex.test(val) || /^\+?\d{8,15}$/.test(val), {
      message: 'Մուտքագրեք վավեր հեռախոսahamys',
    }),
  customerAddress: z.string().max(500).optional().nullable(),
  comment: z.string().max(1000).optional().nullable(),
  items: z.array(orderItemSchema).min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const singleProductOrderSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(2).max(100).transform((val) => val.trim()),
  customerPhone: z
    .string()
    .min(1)
    .transform((val) => val.replace(/[\s\-()]/g, ''))
    .refine((val) => armenianPhoneRegex.test(val) || /^\+?\d{8,15}$/.test(val),
      'Մուտքագրեք վավեր հեռախոսahamys'),
  quantity: z.coerce.number().int().min(1).max(10),
  customerAddress: z.string().max(500).optional().nullable(),
  comment: z.string().max(1000).optional().nullable(),
});

export type SingleProductOrderInput = z.infer<typeof singleProductOrderSchema>;

export const loginSchema = z.object({
  email: z.string().email('Սխal email'),
  password: z.string().min(6, 'Գaxtnabary petq e lini kam 6 nish'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const productFormSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional(),
  categoryId: z.string().min(1),
  shortDescription: z.string().max(500).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  price: z.coerce.number().int().min(0),
  oldPrice: z.coerce.number().int().min(0).optional().nullable(),
  sku: z.string().max(50).optional().nullable(),
  stock: z.coerce.number().int().min(0),
  material: z.string().max(200).optional().nullable(),
  size: z.string().max(100).optional().nullable(),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

export const categoryFormSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  image: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;

export const orderStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
]);

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});
