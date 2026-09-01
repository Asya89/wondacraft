import type { Metadata } from 'next';
import Image from 'next/image';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Մեր մասին',
};

export default function AboutPage() {
  const translations = t();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-sm">
        <Image
          src="/images/about.webp"
          alt={translations.about.title}
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>
      <h1 className="font-serif text-4xl text-warm-brown">{translations.about.title}</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-muted">
        <p>{translations.home.aboutText}</p>
        <p>
          WondaCraft-ում մենք հավատում ենք, որ յուրաքանչյուր ձեռagort արտadranq ունի իր պատmuթyunը։
          Մեր արտadranqner@ պատrastvum են բnakan nyuteric՝ plush yarn, bnakan payt և այլն։
        </p>
        <p>
          Մենք ստeghծum ենք amigurumi ayiukner, zajikner և patayi jamatsuytsner՝ յուրahatuk
          մթnokaidi համar։
        </p>
      </div>
    </div>
  );
}
