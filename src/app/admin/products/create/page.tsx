import { getAllCategoriesFlat } from '@/server/services/category.service';
import { ProductForm } from '@/components/admin/ProductForm';
import { createProductAction } from '@/app/actions/admin';

export default async function CreateProductPage() {
  const categories = await getAllCategoriesFlat();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Create Product</h1>
      <ProductForm categories={categories} action={createProductAction} />
    </div>
  );
}
