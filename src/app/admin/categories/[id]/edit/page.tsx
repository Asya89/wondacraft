import { notFound } from 'next/navigation';
import { getCategoryByIdAdmin, getAllCategoriesFlat } from '@/server/services/category.service';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { updateCategoryAction, deleteCategoryFormAction } from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const [category, allCategories] = await Promise.all([
    getCategoryByIdAdmin(id),
    getAllCategoriesFlat(),
  ]);

  if (!category) notFound();

  const parentCategories = allCategories.filter((c) => c.id !== id);
  const boundUpdate = updateCategoryAction.bind(null, id);
  const boundDelete = deleteCategoryFormAction.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit: {category.name}</h1>
        <form action={boundDelete}>
          <Button type="submit" variant="danger" size="sm">
            Delete
          </Button>
        </form>
      </div>
      <CategoryForm
        category={category}
        parentCategories={parentCategories}
        action={boundUpdate}
      />
    </div>
  );
}
