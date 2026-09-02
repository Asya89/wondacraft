import sharp from 'sharp';
import { mkdir, readdir } from 'fs/promises';
import path from 'path';

const ASSETS_DIR = path.join(process.cwd(), '_assets');
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'images');

type AssetMapping = {
  match: string;
  dest: string;
  maxWidth?: number;
};

const MAPPINGS: AssetMapping[] = [
  { match: 'photo_5195446467542323919_y.jpg', dest: 'logo.webp', maxWidth: 800 },
  { match: 'Aug 24, 2026, 02_13_56 PM', dest: 'hero.webp', maxWidth: 1920 },
  { match: 'Aug 28, 2026, 12_12_00 PM', dest: 'about.webp', maxWidth: 1200 },
  { match: 'Aug 27, 2026, 01_09_47 PM', dest: 'categories/dzergagort-ayiukner.webp', maxWidth: 900 },
  { match: 'Aug 26, 2026, 03_23_38 PM', dest: 'categories/ktoric-zajikner.webp', maxWidth: 900 },
  { match: 'Aug 24, 2026, 02_13_56 PM', dest: 'categories/patayi-chasy.webp', maxWidth: 900 },
  { match: 'Aug 27, 2026, 01_09_47 PM', dest: 'products/lavanda-ayi-01.webp', maxWidth: 1200 },
  { match: 'Aug 28, 2026, 12_03_56 PM', dest: 'products/lavanda-ayi-02.webp', maxWidth: 1200 },
  { match: 'Aug 28, 2026, 12_05_18 PM', dest: 'products/lavanda-ayi-03.webp', maxWidth: 1200 },
  { match: 'Aug 28, 2026, 12_12_00 PM', dest: 'products/lavanda-ayi-04.webp', maxWidth: 1200 },
  { match: 'Aug 26, 2026, 03_23_38 PM', dest: 'products/rozayin-zajik-01.webp', maxWidth: 1200 },
  { match: 'Aug 25, 2026, 02_31_46 PM', dest: 'products/rozayin-zajik-02.webp', maxWidth: 1200 },
  { match: 'Aug 31, 2026, 04_44_57 PM', dest: 'products/patayi-chasy-35-01.webp', maxWidth: 1200 },
  { match: 'Aug 24, 2026, 02_12_58 PM', dest: 'products/patayi-chasy-35-02.webp', maxWidth: 1200 },
  { match: 'Aug 24, 2026, 02_14_07 PM', dest: 'products/patayi-chasy-40-01.webp', maxWidth: 1200 },
  { match: 'Aug 24, 2026, 02_13_49 PM', dest: 'products/patayi-chasy-40-02.webp', maxWidth: 1200 },
  { match: 'Aug 24, 2026, 02_13_56 PM', dest: 'products/patayi-chasy-interyer-01.webp', maxWidth: 1200 },
];

async function convertAsset(srcPath: string, destPath: string, maxWidth = 1200) {
  await mkdir(path.dirname(destPath), { recursive: true });

  const ext = path.extname(destPath).toLowerCase();
  let pipeline = sharp(srcPath).rotate().resize({ width: maxWidth, withoutEnlargement: true });

  if (ext === '.jpg' || ext === '.jpeg') {
    await pipeline.jpeg({ quality: 88, progressive: true }).toFile(destPath);
  } else {
    await pipeline.webp({ quality: 85 }).toFile(destPath);
  }
}

async function convertOvalLogo(srcPath: string, destPath: string, maxWidth = 800) {
  await mkdir(path.dirname(destPath), { recursive: true });

  const meta = await sharp(srcPath).metadata();
  if (!meta.width || !meta.height) throw new Error('Invalid logo dimensions');

  const width = maxWidth;
  const height = Math.round(maxWidth * (meta.height / meta.width));
  const rx = width * 0.455;
  const ry = height * 0.435;
  const mask = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="${width / 2}" cy="${height / 2}" rx="${rx}" ry="${ry}" fill="white"/>
    </svg>`,
  );

  await sharp(srcPath)
    .rotate()
    .resize({ width, height, fit: 'fill' })
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .webp({ quality: 90 })
    .toFile(destPath);
}

export async function syncAssets(): Promise<Map<string, string>> {
  const files = await readdir(ASSETS_DIR);
  const urlMap = new Map<string, string>();

  for (const mapping of MAPPINGS) {
    const source = files.find((file) => file.includes(mapping.match));
    if (!source) {
      console.warn(`Asset not found for: ${mapping.match}`);
      continue;
    }

    const srcPath = path.join(ASSETS_DIR, source);
    const destPath = path.join(PUBLIC_DIR, mapping.dest);
    if (mapping.dest === 'logo.webp') {
      await convertOvalLogo(srcPath, destPath, mapping.maxWidth);
    } else {
      await convertAsset(srcPath, destPath, mapping.maxWidth);
    }

    const publicUrl = `/images/${mapping.dest.replace(/\\/g, '/')}`;
    urlMap.set(mapping.dest, publicUrl);
    console.log(`  ✓ ${source} → ${mapping.dest}`);
  }

  return urlMap;
}

if (require.main === module) {
  syncAssets()
    .then(() => console.log('Assets synced successfully'))
    .catch(console.error);
}
