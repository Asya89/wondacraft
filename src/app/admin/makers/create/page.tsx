import { MakerForm } from '@/components/admin/MakerForm';
import { createMakerAction } from '@/app/actions/admin';

export default function CreateMakerPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Նոր հեղինակ</h1>
      <MakerForm action={createMakerAction} />
    </div>
  );
}
