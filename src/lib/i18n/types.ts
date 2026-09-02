import type { hy } from './locales/hy';

type DeepStringify<T> = T extends readonly (infer U)[]
  ? readonly DeepStringify<U>[]
  : T extends object
    ? { [K in keyof T]: DeepStringify<T[K]> }
    : string;

export type TranslationKey = DeepStringify<typeof hy>;
