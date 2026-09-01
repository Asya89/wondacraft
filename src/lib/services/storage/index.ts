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
      // Future: implement S3StorageProvider using STORAGE_* env vars
      throw new Error(
        'S3 storage is not yet implemented. Set STORAGE_PROVIDER=local for development.',
      );
    default:
      storageInstance = new LocalStorageProvider();
  }

  return storageInstance;
}

export { type StorageProvider, type StorageUploadResult } from './types';
