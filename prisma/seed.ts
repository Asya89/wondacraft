import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { syncAssets } from '../scripts/sync-assets';

const prisma = new PrismaClient();

const img = (path: string) => `/images/${path}`;

async function setProductImages(
  productId: string,
  images: Array<{ url: string; alt: string; isMain?: boolean }>,
) {
  await prisma.productImage.deleteMany({ where: { productId } });

  for (let i = 0; i < images.length; i++) {
    await prisma.productImage.create({
      data: {
        productId,
        imageUrl: images[i].url,
        alt: images[i].alt,
        sortOrder: i,
        isMain: images[i].isMain ?? i === 0,
      },
    });
  }
}

async function main() {
  console.log('Syncing assets from _assets/ ...');
  await syncAssets();

  console.log('Seeding database...');

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@wondacraft.am';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123456';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      role: UserRole.ADMIN,
    },
  });

  const categoriesData = [
    {
      name: 'Ամիգուրումի արջուկներ',
      slug: 'amigurumi-ayiukner',
      description: 'Ձեռագործ ամիգուրումի արջուկներ՝ 30 սմ, անվտանգ նյութերից',
      image: img('categories/dzergagort-ayiukner.webp'),
      sortOrder: 1,
    },
    {
      name: 'Ձեռագործ zajikner',
      slug: 'crochet-zajikner',
      description: 'Ձեռagort crochet zajikner՝ soft plush yarn-ից',
      image: img('categories/ktoric-zajikner.webp'),
      sortOrder: 2,
    },
    {
      name: 'Պատayin jamatsuytsner',
      slug: 'patayi-chasy',
      description: 'Ձեռagort patayin jamatsuytsner bnakan paytic',
      image: img('categories/patayi-chasy.webp'),
      sortOrder: 3,
    },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoryMap.set(cat.slug, created.id);
  }

  const productsData = [
    {
      name: 'Լavanda amigurumi archuk «Milo»',
      slug: 'lavanda-amigurumi-ayi-milo',
      categorySlug: 'amigurumi-ayiukner',
      shortDescription: '30 սմ amigurumi archuk, lavanda guyn',
      description:
        'Ձեռagort amigurumi archuk lavanda guyni plush yarn-ից։ Naxaravorman e cream kochoyn u bow-ov։ Anvtanq nytqer, ideal nver mankakan hamar։',
      price: 18000,
      oldPrice: 22000,
      sku: 'WC-BEAR-001',
      stock: 4,
      material: 'Plush yarn, hypoallergenic stuffing',
      size: '30 սմ',
      isFeatured: true,
      isNew: true,
      images: [
        { url: img('products/lavanda-ayi-01.webp'), alt: 'Lavanda amigurumi archuk' },
        { url: img('products/lavanda-ayi-02.webp'), alt: 'Lavanda archuk naxaravorman' },
        { url: img('products/lavanda-ayi-03.webp'), alt: 'Lavanda archuk nkaragir' },
        { url: img('products/lavanda-ayi-04.webp'), alt: 'Amigurumi steghtman proces' },
      ],
    },
    {
      name: 'Rozayin crochet zajik «Sofi»',
      slug: 'rozayin-crochet-zajik-sofi',
      categorySlug: 'crochet-zajikner',
      shortDescription: 'Crochet zajik rozayin ev cream guynov',
      description:
        'Yurahatuk crochet zajik chunky yarn-ից։ Naxaravorman e hstak koch quti u shredded filler-ov՝ ideal nveri hamar։',
      price: 16000,
      sku: 'WC-BUNNY-001',
      stock: 5,
      material: 'Chenille yarn, cotton stuffing',
      size: '28 սմ',
      isFeatured: true,
      isNew: true,
      images: [
        { url: img('products/rozayin-zajik-01.webp'), alt: 'Rozayin crochet zajik' },
        { url: img('products/rozayin-zajik-02.webp'), alt: 'Zajik naxaravorman' },
      ],
    },
    {
      name: 'Patayi jamatsuyts bnakan paytic 35 սմ',
      slug: 'patayi-chasy-35-sm',
      categorySlug: 'patayi-chasy',
      shortDescription: '35 սմ patayi jamatsuyts, bnakan payt',
      description:
        'Ձեռagort patayi jamatsuyts bnakan paytic։ Romakan tverakner, tepl ev yurahatuk mshakuyt interyeri hamar։',
      price: 25000,
      oldPrice: 29000,
      sku: 'WC-CLOCK-001',
      stock: 3,
      material: 'Bnakan payt, metal tverakner',
      size: '35 սմ',
      isFeatured: true,
      isNew: false,
      images: [
        { url: img('products/patayi-chasy-35-01.webp'), alt: 'Patayi jamatsuyts 35 sm' },
        { url: img('products/patayi-chasy-35-02.webp'), alt: 'Patayi jamatsuyts dzeragort' },
      ],
    },
    {
      name: 'Patayi jamatsuyts bnakan paytic 40 սմ',
      slug: 'patayi-chasy-40-sm',
      categorySlug: 'patayi-chasy',
      shortDescription: '40 սմ patayi jamatsuyts, bnakan payt',
      description:
        'Mec chapy patayi jamatsuyts bnakan paytic։ Yurahatuk grain, romakan tverakner։',
      price: 32000,
      sku: 'WC-CLOCK-002',
      stock: 2,
      material: 'Bnakan payt, metal tverakner',
      size: '40 սմ',
      isFeatured: true,
      isNew: true,
      images: [
        { url: img('products/patayi-chasy-40-01.webp'), alt: 'Patayi jamatsuyts 40 sm' },
        { url: img('products/patayi-chasy-40-02.webp'), alt: 'Bnakan payti texture' },
      ],
    },
    {
      name: 'Patayi jamatsuyts «Interyer»',
      slug: 'patayi-chasy-interyer',
      categorySlug: 'patayi-chasy',
      shortDescription: 'Patayi jamatsuyts modern interyeri hamar',
      description:
        'Elegan patayi jamatsuyts bnakan paytic։ Ideal e minimal ev tepl interyerneri hamar։',
      price: 28000,
      sku: 'WC-CLOCK-003',
      stock: 3,
      material: 'Bnakan payt',
      size: '35 սմ',
      isFeatured: false,
      isNew: true,
      images: [{ url: img('products/patayi-chasy-interyer-01.webp'), alt: 'Patayi jamatsuyts interyerum' }],
    },
  ];

  await prisma.product.updateMany({
    where: { slug: { notIn: productsData.map((p) => p.slug) } },
    data: { isActive: false, sku: null },
  });

  await prisma.category.updateMany({
    where: { slug: { notIn: categoriesData.map((c) => c.slug) } },
    data: { isActive: false },
  });

  for (const p of productsData) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) continue;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        sku: p.sku,
        stock: p.stock,
        material: p.material,
        size: p.size,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        isActive: true,
      },
      create: {
        name: p.name,
        slug: p.slug,
        categoryId,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        sku: p.sku,
        stock: p.stock,
        material: p.material,
        size: p.size,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        isActive: true,
      },
    });

    await setProductImages(product.id, p.images);
  }

  console.log('Seed completed successfully!');
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
