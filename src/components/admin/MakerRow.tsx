import Link from 'next/link';

interface MakerRowProps {
  maker: {
    id: string;
    name: string;
    craft: string;
    slug: string;
    isActive: boolean;
  };
}

export function MakerRow({ maker }: MakerRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-sm border bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <span className="font-medium break-words">{maker.name}</span>
        <span className="ml-2 text-sm text-gray-500">{maker.craft}</span>
        <span className="ml-2 text-xs text-gray-400">/{maker.slug}</span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${maker.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
        >
          {maker.isActive ? 'Active' : 'Inactive'}
        </span>
        <Link href={`/admin/makers/${maker.id}/edit`} className="text-sm text-warm-brown hover:underline">
          Edit
        </Link>
      </div>
    </div>
  );
}
