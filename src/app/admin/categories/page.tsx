import Link from 'next/link';
import { getAllCategoriesFlat } from '@/server/services/category.service';
import { Button } from '@/components/ui/Button';
import { CategoryRow } from '@/components/admin/CategoryRow';

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesFlat();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link href="/admin/categories/create">
          <Button size="sm">+ Create Category</Button>
        </Link>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <CategoryRow key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
