'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { MakerRecord } from '@/server/services/maker.service';

interface MakerFormProps {
  maker?: MakerRecord;
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean } | void>;
}

export function MakerForm({ maker, action }: MakerFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      const result = await action(formData);
      return result ?? { success: true };
    },
    null,
  );

  return (
    <form action={formAction} className="max-w-lg space-y-4 rounded-sm border bg-white p-4 shadow-sm sm:p-6">
      <Input name="name" label="Անուն ազգանուն *" defaultValue={maker?.name} required />
      <Input name="slug" label="Slug" defaultValue={maker?.slug ?? ''} />
      <Input
        name="craft"
        label="Ինչ է անում *"
        defaultValue={maker?.craft}
        required
        placeholder="օր. Ամիգուրումի, փայտե ժամացույցներ"
      />
      <Textarea
        name="bio"
        label="Մասին (կարճ պարբերություն) *"
        defaultValue={maker?.bio ?? ''}
        required
        rows={5}
      />
      <Input name="image" label="Նկարի URL" defaultValue={maker?.image ?? ''} />
      <Input name="sortOrder" label="Տեսակավորման հերթ" type="number" defaultValue={maker?.sortOrder ?? 0} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={maker?.isActive ?? true} />
        Ակտիվ
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">Պահպանված է</p>}

      <Button type="submit" loading={pending}>
        {maker ? 'Պահպանել' : 'Ստեղծել հեղինակ'}
      </Button>
    </form>
  );
}
