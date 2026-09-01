import { mkdir, writeFile, unlink } from 'fs/promises';
import path from 'path';
import type { StorageProvider, StorageUploadResult } from './types';

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;
  private publicPrefix: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    this.publicPrefix = '/uploads';
  }

  async upload(
    file: Buffer,
    filename: string,
    _contentType: string,
  ): Promise<StorageUploadResult> {
    await mkdir(this.uploadDir, { recursive: true });
    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(this.uploadDir, safeName);
    await writeFile(filePath, file);
    const url = `${this.publicPrefix}/${safeName}`;
    return { url, path: url };
  }

  async delete(filePath: string): Promise<void> {
    const filename = filePath.replace(this.publicPrefix + '/', '');
    const fullPath = path.join(this.uploadDir, filename);
    try {
      await unlink(fullPath);
    } catch {
      // file may not exist
    }
  }

  getPublicUrl(filePath: string): string {
    return filePath;
  }
}
