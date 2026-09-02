import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const LOGO_SRC = '/images/logo.webp';
const LOGO_WIDTH = 800;
const LOGO_HEIGHT = 533;

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
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn('w-auto object-contain', className)}
      style={{ height }}
    />
  );

  if (!href) return image;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-[0.98]"
    >
      {image}
    </Link>
  );
}
