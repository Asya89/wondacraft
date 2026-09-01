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
          src="/images/about/about.webp"
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
          Wondacraft-ում մենք հ верим, որ յուրաքանչյուր ձեռagort արտadranq ունի իր պատմությունը։
          Մեր արտadranqner@ պատրastvum en bnavakan nyuteric՝ bambak, felt, ktori ev ayln։
        </p>
        <p>
          Մենք ստeghծում ենք ոչ միայն khaghalikner, ayl nayev tan dekorativ artadranq,
          voronq kardagrum en tepl ev yurahatuk mshakuyt shenq masin։
        </p>
      </div>
    </div>
  );
}
