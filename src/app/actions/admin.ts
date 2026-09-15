'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/session';
import { productFormSchema, categoryFormSchema, makerFormSchema, updateOrderStatusSchema } from '@/lib/validations';
import { slugifyText } from '@/lib/slugify';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  deleteProductImage,
  setMainProductImage,
} from '@/server/services/product.service';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/server/services/category.service';
import {
  createMaker,
  updateMaker,
  deleteMaker,
} from '@/server/services/maker.service';
import { updateOrderStatus } from '@/server/services/order.service';
import { OrderStatus } from '@prisma/client';

async function ensureAdmin() {
  try {
    return await requireAdmin();
  } catch {
    redirect('/admin/login');
  }
}

export async function createProductAction(formData: FormData) {
  await ensureAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = productFormSchema.safeParse({
    ...raw,
    isFeatured: raw.isFeatured === 'on' || raw.isFeatured === 'true',
    isNew: raw.isNew === 'on' || raw.isNew === 'true',
    isActive: raw.isActive === 'on' || raw.isActive === 'true' || raw.isActive === undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Validation error' };
  }

  const slug = parsed.data.slug || slugifyText(parsed.data.name);
  const product = await createProduct({ ...parsed.data, slug });
  revalidatePath('/products');
  revalidatePath('/admin/products');
  revalidatePath('/makers');
  redirect(`/admin/products/${product.id}/edit`);
}

export async function updateProductAction(id: string, formData: FormData) {
  await ensureAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = productFormSchema.safeParse({
    ...raw,
    isFeatured: raw.isFeatured === 'on' || raw.isFeatured === 'true',
    isNew: raw.isNew === 'on' || raw.isNew === 'true',
    isActive: raw.isActive === 'on' || raw.isActive === 'true',
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Validation error' };
  }

  const slug = parsed.data.slug || slugifyText(parsed.data.name);
  await updateProduct(id, { ...parsed.data, slug });
  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
  revalidatePath('/admin/products');
  revalidatePath('/makers');
  return { success: true };
}

export async function deleteProductAction(id: string) {
  await ensureAdmin();
  await deleteProduct(id);
  revalidatePath('/products');
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function createCategoryAction(formData: FormData) {
  await ensureAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = categoryFormSchema.safeParse({
    ...raw,
    parentId: raw.parentId || null,
    isActive: raw.isActive === 'on' || raw.isActive === 'true' || raw.isActive === undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Validation error' };
  }

  const slug = parsed.data.slug || slugifyText(parsed.data.name);
  await createCategory({ ...parsed.data, slug });
  revalidatePath('/admin/categories');
  revalidatePath('/');
  redirect('/admin/categories');
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await ensureAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = categoryFormSchema.safeParse({
    ...raw,
    parentId: raw.parentId || null,
    isActive: raw.isActive === 'on' || raw.isActive === 'true',
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Validation error' };
  }

  const slug = parsed.data.slug || slugifyText(parsed.data.name);
  await updateCategory(id, { ...parsed.data, slug });
  revalidatePath('/admin/categories');
  revalidatePath('/');
  return { success: true };
}

export async function deleteCategoryFormAction(id: string, _formData: FormData) {
  await ensureAdmin();
  try {
    await deleteCategory(id);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('CATEGORY_HAS')) {
      redirect(`/admin/categories/${id}/edit?error=has-relations`);
    }
    throw error;
  }
  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

export async function createMakerAction(formData: FormData) {
  await ensureAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = makerFormSchema.safeParse({
    ...raw,
    isActive: raw.isActive === 'on' || raw.isActive === 'true' || raw.isActive === undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Validation error' };
  }

  const slug = parsed.data.slug || slugifyText(parsed.data.name);
  await createMaker({ ...parsed.data, slug });
  revalidatePath('/admin/makers');
  revalidatePath('/makers');
  revalidatePath(`/makers/${slug}`);
  revalidatePath('/');
  redirect('/admin/makers');
}

export async function updateMakerAction(id: string, formData: FormData) {
  await ensureAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = makerFormSchema.safeParse({
    ...raw,
    isActive: raw.isActive === 'on' || raw.isActive === 'true',
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Validation error' };
  }

  const slug = parsed.data.slug || slugifyText(parsed.data.name);
  await updateMaker(id, { ...parsed.data, slug });
  revalidatePath('/admin/makers');
  revalidatePath('/makers');
  revalidatePath(`/makers/${slug}`);
  revalidatePath('/');
  return { success: true };
}

export async function deleteMakerFormAction(id: string, _formData: FormData) {
  await ensureAdmin();
  await deleteMaker(id);
  revalidatePath('/admin/makers');
  revalidatePath('/makers');
  revalidatePath('/');
  redirect('/admin/makers');
}

export async function deleteProductFormAction(id: string, _formData: FormData) {
  await ensureAdmin();
  await deleteProduct(id);
  revalidatePath('/products');
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function updateOrderStatusFormAction(id: string, formData: FormData) {
  await ensureAdmin();

  const parsed = updateOrderStatusSchema.safeParse({
    status: formData.get('status'),
  });

  if (!parsed.success) {
    redirect(`/admin/orders/${id}?error=invalid-status`);
  }

  await updateOrderStatus(id, parsed.data.status as OrderStatus);
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  redirect(`/admin/orders/${id}`);
}

export async function updateOrderStatusAction(id: string, formData: FormData) {
  await ensureAdmin();

  const parsed = updateOrderStatusSchema.safeParse({
    status: formData.get('status'),
  });

  if (!parsed.success) {
    return { error: 'Invalid status' };
  }

  await updateOrderStatus(id, parsed.data.status as OrderStatus);
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}

export async function deleteProductImageAction(imageId: string, productId: string) {
  await ensureAdmin();
  await deleteProductImage(imageId);
  revalidatePath(`/admin/products/${productId}/edit`);
  return { success: true };
}

export async function setMainImageAction(imageId: string, productId: string) {
  await ensureAdmin();
  await setMainProductImage(productId, imageId);
  revalidatePath(`/admin/products/${productId}/edit`);
  return { success: true };
}

export async function addProductImageAction(productId: string, imageUrl: string, alt?: string) {
  await ensureAdmin();
  const count = await addProductImage({
    productId,
    imageUrl,
    alt,
    isMain: false,
    sortOrder: 99,
  });
  revalidatePath(`/admin/products/${productId}/edit`);
  return count;
}
