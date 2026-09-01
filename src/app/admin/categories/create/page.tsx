import { getAllCategoriesFlat } from '@/server/services/category.service';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { createCategoryAction } from '@/app/actions/admin';

export default async function CreateCategoryPage() {
  const categories = await getAllCategoriesFlat();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Create Category</h1>
      <CategoryForm parentCategories={categories} action={createCategoryAction} />
    </div>
  );
}
