import Link from 'next/link';
import { getMakers } from '@/server/services/maker.service';
import { Button } from '@/components/ui/Button';
import { MakerRow } from '@/components/admin/MakerRow';

export default async function AdminMakersPage() {
  const makers = await getMakers(true);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Հեղինակներ</h1>
        <Link href="/admin/makers/create">
          <Button size="sm">+ Ավելացնել հեղինակ</Button>
        </Link>
      </div>

      {makers.length === 0 ? (
        <p className="text-sm text-gray-500">Դեռ հեղինակներ չկան։</p>
      ) : (
        <div className="space-y-2">
          {makers.map((maker) => (
            <MakerRow key={maker.id} maker={maker} />
          ))}
        </div>
      )}
    </div>
  );
}
