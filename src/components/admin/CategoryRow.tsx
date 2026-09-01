import Link from 'next/link';

interface CategoryRowProps {
  category: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    parent?: { name: string } | null;
  };
}

export function CategoryRow({ category }: CategoryRowProps) {
  return (
    <div className="flex items-center justify-between rounded-sm border bg-white px-4 py-3 shadow-sm">
      <div>
        <span className="font-medium">{category.name}</span>
        {category.parent && (
          <span className="ml-2 text-sm text-gray-500">← {category.parent.name}</span>
        )}
        <span className="ml-2 text-xs text-gray-400">/{category.slug}</span>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
        >
          {category.isActive ? 'Active' : 'Inactive'}
        </span>
        <Link href={`/admin/categories/${category.id}/edit`} className="text-sm text-warm-brown hover:underline">
          Edit
        </Link>
      </div>
    </div>
  );
}
