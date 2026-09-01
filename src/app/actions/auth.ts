'use server';

import { redirect } from 'next/navigation';
import { createSession, destroySession, loginAdmin } from '@/lib/auth/session';
import { loginSchema } from '@/lib/validations';

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Սխալ email կամ գաղtնabар' };
  }

  const user = await loginAdmin(parsed.data.email, parsed.data.password);
  if (!user) {
    return { error: 'Սխal email kam gaxtnabar' };
  }

  await createSession(user);
  const redirectTo = (formData.get('redirect') as string) || '/admin/dashboard';
  redirect(redirectTo);
}

export async function logoutAction() {
  await destroySession();
  redirect('/admin/login');
}
