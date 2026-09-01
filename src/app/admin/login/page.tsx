import { LoginForm } from '@/components/admin/LoginForm';
import { Logo } from '@/components/layout/Logo';

interface AdminLoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { redirect: redirectTo } = await searchParams;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-sm border bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Logo height={56} href="/" />
        </div>
        <h1 className="mb-6 text-center font-serif text-xl text-warm-brown">Admin Մուտք</h1>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
