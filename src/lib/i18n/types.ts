import type { hy } from './locales/hy';

type WhyFeatureIconKey = 'handmade' | 'unique' | 'quality' | 'love';
type WhyFeatureItem = { title: string; icon: WhyFeatureIconKey };

type DeepStringify<T> = T extends readonly WhyFeatureItem[]
  ? readonly WhyFeatureItem[]
  : T extends readonly (infer U)[]
    ? readonly DeepStringify<U>[]
    : T extends object
      ? { [K in keyof T]: DeepStringify<T[K]> }
      : string;

export type TranslationKey = DeepStringify<typeof hy>;
