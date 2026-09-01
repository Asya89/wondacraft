export interface StorageUploadResult {
  url: string;
  path: string;
}

export interface StorageProvider {
  upload(file: Buffer, filename: string, contentType: string): Promise<StorageUploadResult>;
  delete(path: string): Promise<void>;
  getPublicUrl(path: string): string;
}

export type StorageProviderType = 'local' | 's3';
