'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/actions/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}
      <Input name="email" label="Email" type="email" required autoComplete="email" />
      <Input name="password" label="Գaxtnabar" type="password" required autoComplete="current-password" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" className="w-full" loading={pending}>
        Մուտք
      </Button>
    </form>
  );
}
