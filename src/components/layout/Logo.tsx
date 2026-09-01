import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const LOGO_SRC = '/images/logo.jpg';

interface LogoProps {
  className?: string;
  height?: number;
  href?: string;
  priority?: boolean;
}

export function Logo({ className, height = 48, href = '/', priority = false }: LogoProps) {
  const image = (
    <Image
      src={LOGO_SRC}
      alt="WondaCraft"
      width={1280}
      height={853}
      priority={priority}
      className={cn('w-auto object-contain', className)}
      style={{ height }}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {image}
    </Link>
  );
}
