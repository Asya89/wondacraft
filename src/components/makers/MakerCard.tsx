import Image from 'next/image';
import type { MakerRecord } from '@/server/services/maker.service';

interface MakerCardProps {
  maker: MakerRecord;
}

export function MakerCard({ maker }: MakerCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        {maker.image ? (
          <Image
            src={maker.image}
            alt={maker.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-2xl text-muted">
            {maker.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 text-center">
        <h3 className="font-serif text-xl text-warm-brown">{maker.name}</h3>
        <p className="mt-1 text-sm font-medium tracking-wide text-accent">{maker.craft}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{maker.bio}</p>
      </div>
    </article>
  );
}
