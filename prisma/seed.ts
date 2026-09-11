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
      description: 'Ձեռագործ խաղալիքներ՝ ամիգուրումի, կրոշե և այլ յուրահատուկ աշխատանքներ',
      image: img('categories/dzergagort-ayiukner.webp'),
      sortOrder: 1,
    },
    {
      name: '👜 Աքսեսուարներ',
      slug: 'aksessuarner',
      description: 'Ձեռագործ աքսեսուարներ՝ ամենօրյա և նվերային',
      image: img('categories/ktoric-zajikner.webp'),
      sortOrder: 2,
    },
    {
      name: '🪵 Փայտե աշխատանքներ',
      slug: 'payte-ashkhatankner',
      description: 'Բնական փայտից ստեղծված ձեռագործ իրեր',
      image: img('categories/patayi-chasy.webp'),
      sortOrder: 3,
    },
    {
      name: 'Պատի նկարներ',
      slug: 'pati-nkarner',
      description: 'Յուրահատուկ պատի նկարներ և դեկորատիվ աշխատանքներ',
      image: img('about.jpeg'),
      sortOrder: 4,
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
      name: 'Լավանդա ամիգուրումի արջուկ «Միլո»',
      slug: 'lavanda-amigurumi-ayi-milo',
      categorySlug: 'khaghalikner',
      shortDescription: '30 սմ ամիգուրումի արջուկ՝ լավանդա գույնով',
      description:
        'Ձեռագործ ամիգուրումի արջուկ՝ լավանդա գույնի պլյուշ թելից։ Նախագծված է կրեմ գույնի կոճակով և ժապավենով։ Անվտանգ նյութեր՝ իդեալական նվեր մանկական համար։',
      price: 18000,
      oldPrice: 22000,
      sku: 'WC-BEAR-001',
      stock: 4,
      material: 'Պլյուշ թել, հիպոալերգեն լիցք',
      size: '30 սմ',
      isFeatured: true,
      isNew: true,
      images: [
        { url: img('products/lavanda-ayi-01.webp'), alt: 'Լավանդա ամիգուրումի արջուկ' },
        { url: img('products/lavanda-ayi-02.webp'), alt: 'Լավանդա արջուկ՝ մոտիկից' },
        { url: img('products/lavanda-ayi-03.webp'), alt: 'Լավանդա արջուկ՝ մանրամասներ' },
        { url: img('products/lavanda-ayi-04.webp'), alt: 'Ամիգուրումի ստեղծման պրոցես' },
      ],
    },
    {
      name: 'Վարդագույն կրոշե նապաստակ «Սոֆի»',
      slug: 'rozayin-crochet-zajik-sofi',
      categorySlug: 'khaghalikner',
      shortDescription: 'Կրոշե նապաստակ՝ վարդագույն և կրեմ գույներով',
      description:
        'Յուրահատուկ կրոշե նապաստակ՝ հաստ թելից։ Նախագծված է փափուկ լիցքով՝ իդեալական նվերի համար։',
      price: 16000,
      sku: 'WC-BUNNY-001',
      stock: 5,
      material: 'Շենիլ թել, բամբակյա լիցք',
      size: '28 սմ',
      isFeatured: true,
      isNew: true,
      images: [
        { url: img('products/rozayin-zajik-01.webp'), alt: 'Վարդագույն կրոշե նապաստակ' },
        { url: img('products/rozayin-zajik-02.webp'), alt: 'Նապաստակ՝ մոտիկից' },
      ],
    },
    {
      name: 'Փայտե ժամացույց 35 սմ',
      slug: 'patayi-chasy-35-sm',
      categorySlug: 'payte-ashkhatankner',
      shortDescription: '35 սմ փայտե ժամացույց՝ բնական ու մնացորդային փայտից',
      description:
        'Ձեռագործ փայտե ժամացույց՝ բնական ու մնացորդային փայտից։ Հռոմեական թվանշաններով՝ տաք և յուրահատուկ մթնոլորտ ինտերիերի համար։',
      price: 25000,
      oldPrice: 29000,
      sku: 'WC-CLOCK-001',
      stock: 3,
      material: 'Բնական փայտ, մետաղական թվանշաններ',
      size: '35 սմ',
      isFeatured: true,
      isNew: false,
      images: [
        { url: img('products/patayi-chasy-35-01.webp'), alt: 'Փայտե ժամացույց 35 սմ' },
        { url: img('products/patayi-chasy-35-02.webp'), alt: 'Ձեռագործ փայտե ժամացույց' },
      ],
    },
    {
      name: 'Փայտե ժամացույց 40 սմ',
      slug: 'patayi-chasy-40-sm',
      categorySlug: 'payte-ashkhatankner',
      shortDescription: '40 սմ փայտե ժամացույց՝ բնական ու մնացորդային փայտից',
      description:
        'Մեծ չափի փայտե ժամացույց՝ բնական ու մնացորդային փայտից։ Յուրահատուկ հյուսվածք, հռոմեական թվանշաններ։',
      price: 32000,
      sku: 'WC-CLOCK-002',
      stock: 2,
      material: 'Բնական փայտ, մետաղական թվանշաններ',
      size: '40 սմ',
      isFeatured: true,
      isNew: true,
      images: [
        { url: img('products/patayi-chasy-40-01.webp'), alt: 'Փայտե ժամացույց 40 սմ' },
        { url: img('products/patayi-chasy-40-02.webp'), alt: 'Բնական փայտի հյուսվածք' },
      ],
    },
    {
      name: 'Փայտե ժամացույց «Ինտերիեր»',
      slug: 'patayi-chasy-interyer',
      categorySlug: 'payte-ashkhatankner',
      shortDescription: 'Փայտե ժամացույց ժամանակակից ինտերիերի համար',
      description:
        'Էլեգանտ փայտե ժամացույց՝ բնական ու մնացորդային փայտից։ Իդեալական է մինիմալ և տաք ինտերիերների համար։',
      price: 28000,
      sku: 'WC-CLOCK-003',
      stock: 3,
      material: 'Բնական փայտ',
      size: '35 սմ',
      isFeatured: false,
      isNew: true,
      images: [{ url: img('products/patayi-chasy-interyer-01.webp'), alt: 'Փայտե ժամացույց ինտերիերում' }],
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

  const makersData = [
    {
      name: 'Լիլիթ Հակոբյան',
      slug: 'lilit-hakobyan',
      craft: 'Պատի նկարներ',
      bio: 'Լիլիթը ստեղծում է բարդ ու նուրբ մանդալա նկարներ, որոնք համադրում են երկրաչափությունն ու բուսական մոտիվները։ Նրա աշխատանքներում կարևոր են համբերությունը, մանրամասների ճշգրտությունը և հանգիստ գեղագիտությունը։ Յուրաքանչյուր նկար երկար ժամանակ է պահանջում և կրում է հեղինակի ուշադրության հետքը։ Լիլիթը հավատում է, որ պատի վրայի արվեստը կարող է փոխել տան մթնոլորտը և դառնալ առօրյայի մի փոքր ծիսակարգ։ WondaCraft-ում նա ներկայացնում է այն աշխատանքները, որոնք ստեղծվել են սիրով ու մեծ նվիրումով։',
      image: img('makers/lilit-hakobyan.webp'),
      sortOrder: 1,
    },
    {
      name: 'Անի Մարտիրոսյան',
      slug: 'ani-martirosyan',
      craft: 'Ձեռքի նկարազարդում',
      bio: 'Անին աշխատում է նուրբ վրձինով և ստեղծում է մանրանկարչական ձևավորված աշխատանքներ։ Նրա արհեստանոցում ամեն մանրուք կարևոր է՝ գույնի ընտրությունից մինչև վերջնական դետալը։ Նա սիրում է միավորել մաքուր գծերն ու վառ շեշտերը՝ յուրահատուկ ոճ ստեղծելու համար։ Անիի համար ձեռագործը ոչ միայն տեխնիկա է, այլև ուշադրությամբ ու հոգատարությամբ արված աշխատանք։ WondaCraft-ում նա կիսվում է իր ստեղծած իրերով, որոնք նախատեսված են նրանց համար, ովքեր գնահատում են անհատական մոտեցումը։',
      image: img('makers/ani-martirosyan.webp'),
      sortOrder: 2,
    },
    {
      name: 'Վահան Գրիգորյան',
      slug: 'vahan-grigoryan',
      craft: 'Կավագործություն',
      bio: 'Վահանը աշխատում է բրուտի անիվի վրա և ստեղծում է կավե անոթներ ու դեկորատիվ ձևեր։ Նրա համար կարևոր է նյութի հետ անմիջական շփումը՝ ձեռքերով զգալ կավի խոնավությունն ու շարժումը։ Յուրաքանչյուր իր անցնում է համբերատար ձևավորման փուլերով և ստանում է յուրահատուկ բնույթ։ Վահանը հավատում է, որ լավ ձեռագործը պետք է լինի և գեղեցիկ, և օգտակար։ WondaCraft-ում նա ներկայացնում է աշխատանքներ, որոնք միավորում են ավանդական տեխնիկան ու ժամանակակից պարզ գեղագիտությունը։',
      image: img('makers/vahan-grigoryan.webp'),
      sortOrder: 3,
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
