import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import path from 'path';

const COLORS = [
  { bg: '#F5F0E8', accent: '#8B6914', name: 'cream-gold' },
  { bg: '#EDE4D3', accent: '#6B4F3A', name: 'beige-brown' },
  { bg: '#FAF7F2', accent: '#A08060', name: 'offwhite-warm' },
  { bg: '#E8DDD0', accent: '#4A3728', name: 'sand-charcoal' },
  { bg: '#F0EBE3', accent: '#7D6B5D', name: 'linen-taupe' },
];

async function generatePlaceholder(
  dir: string,
  filename: string,
  width: number,
  height: number,
  label: string,
  colorIndex: number,
) {
  const color = COLORS[colorIndex % COLORS.length];
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color.bg}"/>
      <circle cx="${width * 0.7}" cy="${height * 0.3}" r="${Math.min(width, height) * 0.15}" fill="${color.accent}" opacity="0.15"/>
      <circle cx="${width * 0.3}" cy="${height * 0.7}" r="${Math.min(width, height) * 0.2}" fill="${color.accent}" opacity="0.1"/>
      <text x="50%" y="50%" font-family="Georgia, serif" font-size="${Math.min(width, height) * 0.06}" fill="${color.accent}" text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>
  `;

  const outputPath = path.join(dir, filename);
  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(outputPath);
  return `/images/${path.basename(dir)}/${filename.replace('.webp', '')}.webp`;
}

async function generateCategoryImage(dir: string, name: string, index: number) {
  await mkdir(dir, { recursive: true });
  const filename = `category-${index}.webp`;
  await generatePlaceholder(dir, filename, 800, 600, name, index);
  return `/images/categories/${filename}`;
}

async function generateProductImages(dir: string, slug: string, name: string, index: number) {
  await mkdir(dir, { recursive: true });
  const images: string[] = [];
  const count = 3 + (index % 2);

  for (let i = 0; i < count; i++) {
    const filename = `${slug}-${String(i + 1).padStart(2, '0')}.webp`;
    const label = i === 0 ? name : `${name} ${i + 1}`;
    const url = await generatePlaceholder(dir, filename, 1000, 1000, label, index + i);
    images.push(url);
  }

  return images;
}

async function generateHeroImage() {
  const dir = path.join(process.cwd(), 'public', 'images', 'hero');
  await mkdir(dir, { recursive: true });
  await generatePlaceholder(dir, 'hero.webp', 1920, 1080, 'Wondacraft', 0);
  return '/images/hero/hero.webp';
}

async function generateAboutImage() {
  const dir = path.join(process.cwd(), 'public', 'images', 'about');
  await mkdir(dir, { recursive: true });
  await generatePlaceholder(dir, 'about.webp', 800, 600, 'Wondacraft', 2);
  return '/images/about/about.webp';
}

export async function generateAllPlaceholders() {
  const categoriesDir = path.join(process.cwd(), 'public', 'images', 'categories');
  const productsDir = path.join(process.cwd(), 'public', 'images', 'products');

  const hero = await generateHeroImage();
  const about = await generateAboutImage();

  return { categoriesDir, productsDir, hero, about, generateCategoryImage, generateProductImages };
}

if (require.main === module) {
  generateAllPlaceholders()
    .then(() => console.log('Placeholder images generated'))
    .catch(console.error);
}
