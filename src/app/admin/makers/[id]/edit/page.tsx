import { notFound } from 'next/navigation';
import { getMakerById } from '@/server/services/maker.service';
import { MakerForm } from '@/components/admin/MakerForm';
import { updateMakerAction, deleteMakerFormAction } from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';

interface EditMakerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMakerPage({ params }: EditMakerPageProps) {
  const { id } = await params;
  const maker = await getMakerById(id);
  if (!maker) notFound();

  const boundUpdate = updateMakerAction.bind(null, id);
  const boundDelete = deleteMakerFormAction.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Խմբագրել՝ {maker.name}</h1>
        <form action={boundDelete}>
          <Button type="submit" variant="danger" size="sm">
            Ջնջել
          </Button>
        </form>
      </div>
      <MakerForm maker={maker} action={boundUpdate} />
    </div>
  );
}
