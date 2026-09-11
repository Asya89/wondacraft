import { LocalStorageProvider } from './local';
import type { StorageProvider } from './types';

let storageInstance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (storageInstance) return storageInstance;

  const provider = process.env.STORAGE_PROVIDER ?? 'local';

  switch (provider) {
    case 'local':
      storageInstance = new LocalStorageProvider();
      break;
    case 's3':
      // Not used yet — images are kept in git (public/images/).
      // When volume grows: implement S3/R2 using STORAGE_* env vars.
      throw new Error(
        'S3 storage is not yet implemented. Keep images in git (public/images/) or set STORAGE_PROVIDER=local.',
      );
    default:
      storageInstance = new LocalStorageProvider();
  }

  return storageInstance;
}

export { type StorageProvider, type StorageUploadResult } from './types';
