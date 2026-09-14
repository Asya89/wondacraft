import { getAllCategoriesFlat } from '@/server/services/category.service';
import { getMakers } from '@/server/services/maker.service';
import { ProductForm } from '@/components/admin/ProductForm';
import { createProductAction } from '@/app/actions/admin';

export default async function CreateProductPage() {
  const [categories, makers] = await Promise.all([getAllCategoriesFlat(), getMakers(true)]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Create Product</h1>
      <ProductForm categories={categories} makers={makers} action={createProductAction} />
    </div>
  );
}
