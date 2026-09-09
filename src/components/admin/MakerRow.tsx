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
    <div className="flex items-center justify-between rounded-sm border bg-white px-4 py-3 shadow-sm">
      <div>
        <span className="font-medium">{maker.name}</span>
        <span className="ml-2 text-sm text-gray-500">{maker.craft}</span>
        <span className="ml-2 text-xs text-gray-400">/{maker.slug}</span>
      </div>
      <div className="flex items-center gap-3">
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
