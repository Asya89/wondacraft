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
  { match: 'about.jpeg', dest: 'about.jpeg', maxWidth: 1600 },
  { match: 'about.jpeg', dest: 'about.webp', maxWidth: 1600 },

  // Categories — real product photos
  { match: 'bear_1.jpg', dest: 'categories/dzergagort-ayiukner.webp', maxWidth: 900 },
  { match: 'brelok_panda.jpg', dest: 'categories/ktoric-zajikner.webp', maxWidth: 900 },
  { match: 'photo_5283033142904173848_y.jpg', dest: 'categories/patayi-chasy.webp', maxWidth: 900 },

  // Toys — bears
  { match: 'bear_1.jpg', dest: 'products/lavanda-ayi-01.webp', maxWidth: 1200 },
  { match: 'photo_5283033142904173862_y.jpg', dest: 'products/lavanda-ayi-02.webp', maxWidth: 1200 },
  { match: 'photo_5283033142904173855_y.jpg', dest: 'products/mokhraguyn-ayi-01.webp', maxWidth: 1200 },
  { match: 'photo_5283033142904173856_y.jpg', dest: 'products/deghdzagayn-ayi-01.webp', maxWidth: 1200 },

  // Toys — bunnies
  { match: 'bunny_brown_1.jpg', dest: 'products/krem-zajik-01.webp', maxWidth: 1200 },
  { match: 'photo_5283033142904173854_y.jpg', dest: 'products/krem-zajik-02.webp', maxWidth: 1200 },
  { match: 'bunny_pink_1.png', dest: 'products/rozayin-zajik-01.webp', maxWidth: 1200 },
  { match: 'photo_5283033142904173861_y.jpg', dest: 'products/rozayin-zajik-02.webp', maxWidth: 1200 },
  { match: 'bunny_pink_2.jpg', dest: 'products/rozayin-zajik-03.webp', maxWidth: 1200 },
  { match: 'photo_5283033142904173857_y.jpg', dest: 'products/tsaghikov-zajik-01.webp', maxWidth: 1200 },

  // Accessories — keychains
  { match: 'brelok_heart.jpg', dest: 'products/brelok-heart-01.webp', maxWidth: 1200 },
  { match: 'brelok_panda.jpg', dest: 'products/brelok-panda-01.webp', maxWidth: 1200 },
  { match: 'brelok_tutle.jpg', dest: 'products/brelok-turtle-01.webp', maxWidth: 1200 },

  // Wooden works — clocks only (Gagik)
  { match: 'photo_5283033142904173848_y.jpg', dest: 'products/patayi-chasy-tree-01.webp', maxWidth: 1200 },
  { match: 'photo_5283033142904173851_y.jpg', dest: 'products/patayi-chasy-apple-01.webp', maxWidth: 1200 },
  { match: 'photo_5283033142904173852_y.jpg', dest: 'products/patayi-chasy-gloss-01.webp', maxWidth: 1200 },
  { match: 'photo_5283033142904173853_y.jpg', dest: 'products/patayi-chasy-orhnel-01.webp', maxWidth: 1200 },

  // Makers
  { match: 'Gagik.jpg', dest: 'makers/gagik.webp', maxWidth: 900 },
  { match: 'Gohar.jpg', dest: 'makers/gohar.webp', maxWidth: 900 },
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
