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
      name: '🧸 Խաղալիքներ',
      slug: 'khaghalikner',
      description: 'Ձեռագործ ամիգուրումի խաղալիքներ՝ նապաստակներ և արջուկներ',
      image: img('categories/dzergagort-ayiukner.webp'),
      sortOrder: 1,
    },
    {
      name: '👜 Աքսեսուարներ',
      slug: 'aksessuarner',
      description: 'Ձեռագործ բռելոկներ՝ ամենօրյա և նվերային',
      image: img('categories/ktoric-zajikner.webp'),
      sortOrder: 2,
    },
    {
      name: '🪵 Փայտե աշխատանքներ',
      slug: 'payte-ashkhatankner',
      description: 'Ձեռագործ փայտե ժամացույցներ՝ բնական փայտից',
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

  const makersData = [
    {
      name: 'Գոհար',
      slug: 'gohar',
      craft: 'Ամիգուրումի և բռելոկներ',
      bio: 'Գոհարը ստեղծում է փափուկ ամիգուրումի խաղալիքներ և նուրբ բռելոկներ։ Յուրաքանչյուր աշխատանք կարվում է ձեռքով՝ ուշադրությամբ և սիրով, որպեսզի դառնա ջերմ նվեր կամ առօրյա ուրախություն։',
      image: img('makers/gohar.webp'),
      sortOrder: 1,
    },
    {
      name: 'Գագիկ',
      slug: 'gagik',
      craft: 'Փայտե ժամացույցներ',
      bio: 'Գագիկը պատրաստում է փայտե ժամացույցներ բնական փայտից։ Յուրաքանչյուր ժամացույց ունի իր հյուսվածքը և բնույթը՝ տունը լցնելով տաք և յուրահատուկ մթնոլորտով։',
      image: img('makers/gagik.webp'),
      sortOrder: 2,
    },
  ];

  for (const maker of makersData) {
    await prisma.maker.upsert({
      where: { slug: maker.slug },
      update: {
        name: maker.name,
        craft: maker.craft,
        bio: maker.bio,
        image: maker.image,
        sortOrder: maker.sortOrder,
        isActive: true,
      },
      create: {
        name: maker.name,
        slug: maker.slug,
        craft: maker.craft,
        bio: maker.bio,
        image: maker.image,
        sortOrder: maker.sortOrder,
        isActive: true,
      },
    });
  }

  await prisma.maker.updateMany({
    where: { slug: { notIn: makersData.map((m) => m.slug) } },
    data: { isActive: false },
  });

  const makerMap = new Map<string, string>();
  const makers = await prisma.maker.findMany({
    where: { slug: { in: makersData.map((m) => m.slug) } },
    select: { id: true, slug: true },
  });
  for (const maker of makers) {
    makerMap.set(maker.slug, maker.id);
  }

  const productsData = [
    // Toys — bears & bunnies (Gohar)
    {
      name: 'Լավանդա ամիգուրումի արջուկ',
      slug: 'lavanda-amigurumi-ayi',
      categorySlug: 'khaghalikner',
      makerSlug: 'gohar',
      shortDescription: 'Փափուկ լավանդա արջուկ՝ կրեմ զգեստով և ժապավենով',
      description:
        'Ձեռագործ ամիգուրումի արջուկ՝ լավանդա գույնի պլյուշ թելից։ Կրեմ զգեստով և ժապավենով՝ իդեալական նվեր մանկական համար։',
      price: 18000,
      oldPrice: 22000,
      sku: 'WC-BEAR-001',
      stock: 3,
      material: 'Պլյուշ թել, հիպոալերգեն լիցք',
      size: '30 սմ',
      isFeatured: true,
      isNew: true,
      images: [
        { url: img('products/lavanda-ayi-01.webp'), alt: 'Լավանդա ամիգուրումի արջուկ' },
        { url: img('products/lavanda-ayi-02.webp'), alt: 'Լավանդա արջուկ՝ ձեռքում' },
      ],
    },
    {
      name: 'Մոխրագույն արջուկ կապույտ կոմբինեզոնով',
      slug: 'mokhraguyn-ayi-kapuyt',
      categorySlug: 'khaghalikner',
      makerSlug: 'gohar',
      shortDescription: 'Մոխրագույն ամիգուրումի արջուկ՝ կապույտ կոմբինեզոնով',
      description:
        'Ձեռագործ մոխրագույն արջուկ՝ շագանակագույն թաթերով և կապույտ կոմբինեզոնով։ Փափուկ և ջերմ նվեր։',
      price: 17000,
      sku: 'WC-BEAR-002',
      stock: 2,
      material: 'Պլյուշ թել, հիպոալերգեն լիցք',
      size: '28 սմ',
      isFeatured: true,
      isNew: true,
      images: [{ url: img('products/mokhraguyn-ayi-01.webp'), alt: 'Մոխրագույն արջուկ կապույտ կոմբինեզոնով' }],
    },
    {
      name: 'Դեղձագույն արջուկ կապույտ կոմբինեզոնով',
      slug: 'deghdzagayn-ayi-kapuyt',
      categorySlug: 'khaghalikner',
      makerSlug: 'gohar',
      shortDescription: 'Դեղձագույն ամիգուրումի արջուկ՝ կապույտ կոմբինեզոնով',
      description:
        'Փափուկ դեղձագույն արջուկ՝ սպիտակ շապիկով և վառ կապույտ կոմբինեզոնով։ Ձեռագործ ամիգուրումի աշխատանք։',
      price: 17000,
      sku: 'WC-BEAR-003',
      stock: 2,
      material: 'Պլյուշ թել, հիպոալերգեն լիցք',
      size: '26 սմ',
      isFeatured: false,
      isNew: true,
      images: [{ url: img('products/deghdzagayn-ayi-01.webp'), alt: 'Դեղձագույն արջուկ կապույտ կոմբինեզոնով' }],
    },
    {
      name: 'Կրեմ նապաստակ շագանակագույն զգեստով',
      slug: 'krem-zajik-shaganakaguyn',
      categorySlug: 'khaghalikner',
      makerSlug: 'gohar',
      shortDescription: 'Կրեմ նապաստակ՝ շագանակագույն զգեստով և ժապավենով',
      description:
        'Ձեռագործ կրոշե նապաստակ՝ կրեմ և շագանակագույն գույներով։ Փափուկ լիցքով՝ իդեալական նվերի համար։',
      price: 16000,
      sku: 'WC-BUNNY-001',
      stock: 3,
      material: 'Պլյուշ թել, բամբակյա լիցք',
      size: '28 սմ',
      isFeatured: true,
      isNew: true,
      images: [
        { url: img('products/krem-zajik-01.webp'), alt: 'Կրեմ նապաստակ շագանակագույն զգեստով' },
        { url: img('products/krem-zajik-02.webp'), alt: 'Կրեմ նապաստակ՝ ձեռքում' },
      ],
    },
    {
      name: 'Վարդագույն զգեստով նապաստակ',
      slug: 'rozayin-zajik-zghestov',
      categorySlug: 'khaghalikner',
      makerSlug: 'gohar',
      shortDescription: 'Կրեմ նապաստակ՝ վարդագույն զգեստով և ժապավենով',
      description:
        'Յուրահատուկ կրոշե նապաստակ՝ վարդագույն զգեստով։ Փափուկ և նուրբ՝ նվերի համար։',
      price: 16000,
      sku: 'WC-BUNNY-002',
      stock: 4,
      material: 'Պլյուշ թել, բամբակյա լիցք',
      size: '28 սմ',
      isFeatured: true,
      isNew: true,
      images: [
        { url: img('products/rozayin-zajik-01.webp'), alt: 'Վարդագույն զգեստով նապաստակ' },
        { url: img('products/rozayin-zajik-02.webp'), alt: 'Նապաստակ այգում' },
        { url: img('products/rozayin-zajik-03.webp'), alt: 'Նապաստակ՝ մոտիկից' },
      ],
    },
    {
      name: 'Նապաստակ ծաղիկով',
      slug: 'zajik-tsaghikov',
      categorySlug: 'khaghalikner',
      makerSlug: 'gohar',
      shortDescription: 'Բեժ նապաստակ՝ կրեմ ծաղիկով և զգեստով',
      description:
        'Ձեռագործ ամիգուրումի նապաստակ՝ ականջին ծաղիկով։ Նուրբ գույներ և փափուկ հյուսվածք։',
      price: 15500,
      sku: 'WC-BUNNY-003',
      stock: 2,
      material: 'Պլյուշ թել, բամբակյա լիցք',
      size: '27 սմ',
      isFeatured: false,
      isNew: true,
      images: [{ url: img('products/tsaghikov-zajik-01.webp'), alt: 'Նապաստակ ծաղիկով' }],
    },

    // Accessories — keychains only (Gohar)
    {
      name: 'Սրտաձև բռելոկ',
      slug: 'brelok-heart',
      categorySlug: 'aksessuarner',
      makerSlug: 'gohar',
      shortDescription: 'Փափուկ կրոշե սրտաձև բռելոկ',
      description: 'Ձեռագործ սրտաձև բռելոկ՝ բեժ պլյուշ թելից և մետաղական օղակով։',
      price: 3500,
      sku: 'WC-KEY-001',
      stock: 8,
      material: 'Պլյուշ թել, մետաղական օղակ',
      size: '8 սմ',
      isFeatured: true,
      isNew: true,
      images: [{ url: img('products/brelok-heart-01.webp'), alt: 'Սրտաձև բռելոկ' }],
    },
    {
      name: 'Պանդա բռելոկ',
      slug: 'brelok-panda',
      categorySlug: 'aksessuarner',
      makerSlug: 'gohar',
      shortDescription: 'Փոքր ամիգուրումի պանդա բռելոկ',
      description: 'Ձեռագործ պանդա բռելոկ՝ սպիտակ և սև պլյուշ թելից։ Հարմար նվեր և առօրյա աքսեսուար։',
      price: 4000,
      sku: 'WC-KEY-002',
      stock: 6,
      material: 'Պլյուշ թել, մետաղական օղակ',
      size: '7 սմ',
      isFeatured: true,
      isNew: true,
      images: [{ url: img('products/brelok-panda-01.webp'), alt: 'Պանդա բռելոկ' }],
    },
    {
      name: 'Կրիա բռելոկ',
      slug: 'brelok-turtle',
      categorySlug: 'aksessuarner',
      makerSlug: 'gohar',
      shortDescription: 'Կանաչ կրոշե կրիա բռելոկ',
      description: 'Ձեռագործ կրիա բռելոկ՝ կանաչ խեցիով և սպիտակ թաթերով։',
      price: 4000,
      sku: 'WC-KEY-003',
      stock: 5,
      material: 'Պլյուշ թել, մետաղական օղակ',
      size: '8 սմ',
      isFeatured: false,
      isNew: true,
      images: [{ url: img('products/brelok-turtle-01.webp'), alt: 'Կրիա բռելոկ' }],
    },

    // Wooden works — clocks only (Gagik)
    {
      name: 'Փայտե ժամացույց՝ ծառի կտրվածք',
      slug: 'patayi-chasy-tsar',
      categorySlug: 'payte-ashkhatankner',
      makerSlug: 'gagik',
      shortDescription: 'Բնական ծառի կտրվածքից ժամացույց՝ հռոմեական թվանշաններով',
      description:
        'Ձեռագործ ժամացույց բնական ծառի կտրվածքից՝ հռոմեական թվանշաններով և պարանով կախելու համար։',
      price: 28000,
      oldPrice: 32000,
      sku: 'WC-CLOCK-001',
      stock: 2,
      material: 'Բնական փայտ, մետաղական թվանշաններ',
      size: '≈35 սմ',
      isFeatured: true,
      isNew: true,
      images: [{ url: img('products/patayi-chasy-tree-01.webp'), alt: 'Փայտե ժամացույց ծառի կտրվածքից' }],
    },
    {
      name: 'Փայտե ժամացույց «Խնձոր»',
      slug: 'patayi-chasy-khndzor',
      categorySlug: 'payte-ashkhatankner',
      makerSlug: 'gagik',
      shortDescription: 'Խնձորաձև փայտե ժամացույց՝ ոսկեգույն թվանշաններով',
      description:
        'Ձեռագործ խնձորաձև փայտե ժամացույց՝ հյուսված եզրով և ոսկեգույն հռոմեական թվանշաններով։',
      price: 30000,
      sku: 'WC-CLOCK-002',
      stock: 1,
      material: 'Բնական փայտ, մետաղական թվանշաններ',
      size: '≈40 սմ',
      isFeatured: true,
      isNew: true,
      images: [{ url: img('products/patayi-chasy-apple-01.webp'), alt: 'Խնձորաձև փայտե ժամացույց' }],
    },
    {
      name: 'Փայտե ժամացույց՝ փայլուն մակերեսով',
      slug: 'patayi-chasy-paylun',
      categorySlug: 'payte-ashkhatankner',
      makerSlug: 'gagik',
      shortDescription: 'Կլոր փայտե ժամացույց՝ փայլուն ծածկույթով և արաբական թվանշաններով',
      description:
        'Էլեգանտ կլոր ժամացույց բնական փայտից՝ փայլուն ծածկույթով և սև արաբական թվանշաններով։',
      price: 27000,
      sku: 'WC-CLOCK-003',
      stock: 2,
      material: 'Բնական փայտ',
      size: '≈35 սմ',
      isFeatured: true,
      isNew: false,
      images: [{ url: img('products/patayi-chasy-gloss-01.webp'), alt: 'Փայլուն փայտե ժամացույց' }],
    },
    {
      name: 'Փայտե ժամացույց «Աստված օրհնի այս տունը»',
      slug: 'patayi-chasy-orhnel',
      categorySlug: 'payte-ashkhatankner',
      makerSlug: 'gagik',
      shortDescription: 'Փայտե ժամացույց՝ հայերեն օրհնությամբ',
      description:
        'Ձեռագործ փայտե ժամացույց՝ ոսկեգույն թվանշաններով և «Աստված օրհնի այս տունը» գրությամբ։',
      price: 29000,
      sku: 'WC-CLOCK-004',
      stock: 2,
      material: 'Բնական փայտ, մետաղական թվանշաններ',
      size: '≈35 սմ',
      isFeatured: true,
      isNew: true,
      images: [{ url: img('products/patayi-chasy-orhnel-01.webp'), alt: 'Փայտե ժամացույց օրհնությամբ' }],
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
    const makerId = p.makerSlug ? (makerMap.get(p.makerSlug) ?? null) : null;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId,
        makerId,
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
        makerId,
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
