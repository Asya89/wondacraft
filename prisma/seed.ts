import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAllPlaceholders } from '../scripts/generate-placeholders';

const prisma = new PrismaClient();

async function main() {
  console.log('Generating placeholder images...');
  const { generateCategoryImage, generateProductImages } = await generateAllPlaceholders();

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
      name: 'Ձեռագործ արջուկներ',
      slug: 'dzergagort-archukner',
      description: 'Ձեռագործ արջուկներ բնական նյութերից',
      sortOrder: 1,
    },
    {
      name: 'Կտորից խաղալիքներ',
      slug: 'ktoric-khaghaliqner',
      description: 'Կտորից և felt-ից պատրաստված խաղալիքներ',
      sortOrder: 2,
    },
    {
      name: 'Տան դեկոր',
      slug: 'tan-dekor',
      description: 'Ձեռագործ տան դեկորատիվ արտադրանք',
      sortOrder: 3,
      children: [
        {
          name: 'Մոմեր',
          slug: 'momer',
          description: 'Ձեռագործ մոմեր',
          sortOrder: 1,
        },
        {
          name: 'Ծաղկամաններ',
          slug: 'tsaghkanmanner',
          description: 'Ձեռագործ ծաղկամաններ',
          sortOrder: 2,
        },
        {
          name: 'Պատային դեկոր',
          slug: 'patayin-dekor',
          description: 'Պատի ձեռագործ դեկոր',
          sortOrder: 3,
        },
      ],
    },
  ];

  const categoryMap = new Map<string, string>();

  for (let i = 0; i < categoriesData.length; i++) {
    const cat = categoriesData[i];
    const image = await generateCategoryImage(
      `${process.cwd()}/public/images/categories`,
      cat.name.substring(0, 12),
      i,
    );

    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoryMap.set(cat.slug, created.id);

    if (cat.children) {
      for (let j = 0; j < cat.children.length; j++) {
        const child = cat.children[j];
        const childImage = await generateCategoryImage(
          `${process.cwd()}/public/images/categories`,
          child.name.substring(0, 12),
          i + j + 10,
        );
        const childCreated = await prisma.category.upsert({
          where: { slug: child.slug },
          update: {},
          create: {
            name: child.name,
            slug: child.slug,
            description: child.description,
            image: childImage,
            parentId: created.id,
            sortOrder: child.sortOrder,
            isActive: true,
          },
        });
        categoryMap.set(child.slug, childCreated.id);
      }
    }
  }

  const productsData = [
    {
      name: 'Ձեռագործ արջուկ «Միքի»',
      slug: 'dzergagort-archuk-miki',
      categorySlug: 'dzergagort-archukner',
      shortDescription: 'Բամբակի արջուկ 35 սմ',
      description:
        'Ձեռագործ բամբակի արջուկ «Միքի»՝ պատրաստված բնական կտորից և hypoallergenic լցofill-ից։ Յուրաքանչյուր արջուկ ունի իր յուրահատuk character:',
      price: 15000,
      oldPrice: 18000,
      sku: 'WC-BEAR-001',
      stock: 5,
      material: 'Բամբակ, felt',
      size: '35 սմ',
      isFeatured: true,
      isNew: true,
    },
    {
      name: 'Ձեռագործ արջուկ «Լուսի»',
      slug: 'dzergagort-archuk-lusi',
      categorySlug: 'dzergagort-archukner',
      shortDescription: 'Կրեմ գույնի արջուկ 40 սմ',
      description: 'Մեծ չափի ձեռագործ արջուկ կրեմ գույնի բնական կտորից։',
      price: 18000,
      sku: 'WC-BEAR-002',
      stock: 3,
      material: 'Բամբակ, լանyarn',
      size: '40 սմ',
      isFeatured: true,
      isNew: false,
    },
    {
      name: 'Ձեռագործ արջուկ «Նորի»',
      slug: 'dzergagort-archuk-nori',
      categorySlug: 'dzergagort-archukner',
      shortDescription: 'Փոքր արջուկ 25 սմ',
      description: 'Փոքր չափի ձեռագործ արջուկ՝ իդéal նվեր մանկան համար։',
      price: 10000,
      sku: 'WC-BEAR-003',
      stock: 8,
      material: 'Բամբակ',
      size: '25 սմ',
      isFeatured: false,
      isNew: true,
    },
    {
      name: 'Felt կատու «Սօֆի»',
      slug: 'felt-katu-sofi',
      categorySlug: 'ktoric-khaghaliqner',
      shortDescription: 'Felt կatու խաղalիք',
      description: 'Ձեռagort felt կatու՝ պատրastված բnakan felt-ից։',
      price: 8000,
      sku: 'WC-CAT-001',
      stock: 6,
      material: 'Felt',
      size: '20 սմ',
      isFeatured: true,
      isNew: true,
    },
    {
      name: 'Felt նապաստak «Լeo»',
      slug: 'felt-napastak-leo',
      categorySlug: 'ktoric-khaghaliqner',
      shortDescription: 'Felt նapastak խaghalik',
      description: 'Ձեռagort felt napastak bnavakan nyuteric.',
      price: 12000,
      sku: 'WC-FOX-001',
      stock: 4,
      material: 'Felt, կտor',
      size: '22 սմ',
      isFeatured: false,
      isNew: true,
    },
    {
      name: 'Կտorից zajik «Մaral»',
      slug: 'ktoric-zajik-maral',
      categorySlug: 'ktoric-khaghaliqner',
      shortDescription: 'Ktoric zajik khaghalik',
      description: 'Yurahatuk ktoric zajik snvats bnavakan nyuteric.',
      price: 9500,
      sku: 'WC-BUNNY-001',
      stock: 7,
      material: 'Բambak, ktori',
      size: '28 սմ',
      isFeatured: true,
      isNew: false,
    },
    {
      name: 'Ձեռagort mom lavanda',
      slug: 'dzergagort-mom-lavanda',
      categorySlug: 'momer',
      shortDescription: 'Lavanda hatkov mom',
      description: '100% soy mom lavanda hatkov, 200g.',
      price: 4500,
      sku: 'WC-CANDLE-001',
      stock: 15,
      material: 'Soy mom, esential oil',
      size: '200 գ',
      isFeatured: true,
      isNew: false,
    },
    {
      name: 'Ձեռagort mom vanil',
      slug: 'dzergagort-mom-vanil',
      categorySlug: 'momer',
      shortDescription: 'Vanil hatkov mom',
      description: '100% soy mom vanil hatkov, 200g.',
      price: 4500,
      sku: 'WC-CANDLE-002',
      stock: 12,
      material: 'Soy mom',
      size: '200 գ',
      isFeatured: false,
      isNew: true,
    },
    {
      name: 'Ceramic tsaghkanman',
      slug: 'ceramic-tsaghkanman',
      categorySlug: 'tsaghkanmanner',
      shortDescription: 'Dzeragort ceramic tsaghkanman',
      description: 'Yurahatuk ceramic tsaghkanman dzeragort steghtsvats.',
      price: 12000,
      sku: 'WC-VASE-001',
      stock: 4,
      material: 'Ceramic',
      size: '25 սմ',
      isFeatured: true,
      isNew: false,
    },
    {
      name: 'Ceramic tsaghkanman klor',
      slug: 'ceramic-tsaghkanman-klor',
      categorySlug: 'tsaghkanmanner',
      shortDescription: 'Klor ceramic tsaghkanman',
      description: 'Minimalist klor ceramic tsaghkanman.',
      price: 10000,
      sku: 'WC-VASE-002',
      stock: 5,
      material: 'Ceramic',
      size: '20 սմ',
      isFeatured: false,
      isNew: true,
    },
    {
      name: 'Patayi dekor panel',
      slug: 'patayi-dekor-panel',
      categorySlug: 'patayin-dekor',
      shortDescription: 'Macramé patayi dekor',
      description: 'Dzeragort macramé patayi dekor panel.',
      price: 15000,
      sku: 'WC-WALL-001',
      stock: 3,
      material: 'Bambak shnor, ktori',
      size: '40 × 60 սմ',
      isFeatured: true,
      isNew: false,
    },
    {
      name: 'Patayi dekor goyner',
      slug: 'patayi-dekor-goyner',
      categorySlug: 'patayin-dekor',
      shortDescription: 'Tepi goyner patayi dekor',
      description: 'Dzeragort patayi dekor tepi goynerov.',
      price: 8000,
      sku: 'WC-WALL-002',
      stock: 6,
      material: 'Ktori, bambak',
      size: '30 × 40 սմ',
      isFeatured: false,
      isNew: true,
    },
  ];

  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found: ${p.categorySlug}`);
      continue;
    }

    const images = await generateProductImages(
      `${process.cwd()}/public/images/products`,
      p.slug,
      p.name.substring(0, 15),
      i,
    );

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
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

    const existingImages = await prisma.productImage.count({ where: { productId: product.id } });
    if (existingImages === 0) {
      for (let j = 0; j < images.length; j++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: images[j],
            alt: p.name,
            sortOrder: j,
            isMain: j === 0,
          },
        });
      }
    }
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
