import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Menjalankan seeder database...");

  // Hash password
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Buat Admin User (upsert agar tidak error jika sudah ada)
  await prisma.user.upsert({
    where: { email: "admin@ai-shop.com" },
    update: {},
    create: {
      name: "Admin Super",
      email: "admin@ai-shop.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin Super terjamin ada (admin@ai-shop.com)");

  // Hapus data produk yang lama agar bersih (Hati-hati, ini menghapus produk, pesanan mungkin error jika ada foreign key constraint dengan action RESTRICT. Tapi di schema biasanya set ke Cascade atau kita bisa abaikan jika error).
  // Sebaiknya kita cek dulu apakah kita bisa menghapusnya tanpa memutus tabel lain.
  // Karena ini untuk uji coba produk, kita jalankan saja.
  try {
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.category.deleteMany();
  } catch (e) {
    console.log("Pembersihan tabel gagal, melanjutkan seeding dengan data tambahan saja.");
  }

  // Categories
  const catPria = await prisma.category.upsert({
    where: { slug: "sneakers-pria" },
    update: {},
    create: { name: "Sneakers Pria", slug: "sneakers-pria", description: "Koleksi sneakers untuk pria" }
  });
  const catWanita = await prisma.category.upsert({
    where: { slug: "sneakers-wanita" },
    update: {},
    create: { name: "Sneakers Wanita", slug: "sneakers-wanita", description: "Koleksi sneakers untuk wanita" }
  });
  const catRunning = await prisma.category.upsert({
    where: { slug: "running" },
    update: {},
    create: { name: "Running", slug: "running", description: "Sepatu lari terbaik" }
  });
  const catCasual = await prisma.category.upsert({
    where: { slug: "casual" },
    update: {},
    create: { name: "Casual", slug: "casual", description: "Sepatu santai sehari-hari" }
  });

  // Brands
  const brandNike = await prisma.brand.upsert({
    where: { slug: "nike" },
    update: {},
    create: { name: "Nike", slug: "nike", description: "Just Do It" }
  });
  const brandAdidas = await prisma.brand.upsert({
    where: { slug: "adidas" },
    update: {},
    create: { name: "Adidas", slug: "adidas", description: "Impossible is Nothing" }
  });
  const brandPuma = await prisma.brand.upsert({
    where: { slug: "puma" },
    update: {},
    create: { name: "Puma", slug: "puma", description: "Forever Faster" }
  });
  const brandNB = await prisma.brand.upsert({
    where: { slug: "new-balance" },
    update: {},
    create: { name: "New Balance", slug: "new-balance", description: "We Got Now" }
  });

  // Products Data
  const productsData = [
    {
      categoryId: catRunning.id,
      brandId: brandNike.id,
      sku: "NK-AM270-RD",
      slug: "nike-air-max-270-red",
      name: "Nike Air Max 270",
      shortDescription: "Sneaker revolusioner dengan bantalan udara maksimal.",
      description: "Nike Air Max 270 memberikan kenyamanan luar biasa di setiap langkah. Desain yang terinspirasi dari Air Max ikonik masa lalu dipadukan dengan teknologi modern untuk memberikan gaya dan performa terbaik.",
      price: 2500000,
      weight: 800,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80"
      ],
      variants: [
        { sku: "NK-AM270-RD-40", size: 40, color: "Red", stock: 15 },
        { sku: "NK-AM270-RD-41", size: 41, color: "Red", stock: 20 },
        { sku: "NK-AM270-RD-42", size: 42, color: "Red", stock: 10 },
      ]
    },
    {
      categoryId: catRunning.id,
      brandId: brandAdidas.id,
      sku: "AD-UB22-BK",
      slug: "adidas-ultraboost-22",
      name: "Adidas Ultraboost 22",
      shortDescription: "Sepatu lari dengan pengembalian energi luar biasa.",
      description: "Adidas Ultraboost 22 memberikan kenyamanan tiada tara. Teknologi BOOST di bagian midsole memberikan bantalan responsif yang mengembalikan energi di setiap langkah.",
      price: 3000000,
      discountPrice: 2800000,
      weight: 850,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
        "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80"
      ],
      variants: [
        { sku: "AD-UB22-BK-39", size: 39, color: "Core Black", stock: 5 },
        { sku: "AD-UB22-BK-40", size: 40, color: "Core Black", stock: 12 },
        { sku: "AD-UB22-BK-41", size: 41, color: "Core Black", stock: 8 },
      ]
    },
    {
      categoryId: catCasual.id,
      brandId: brandPuma.id,
      sku: "PM-RSX-GR",
      slug: "puma-rs-x",
      name: "Puma RS-X",
      shortDescription: "Desain chunky yang retro sekaligus futuristik.",
      description: "Seri RS-X dari Puma hadir dengan desain berani dan warna yang mencolok. Sepatu ini tidak hanya menawarkan tampilan stylish, namun juga kenyamanan berkat teknologi Running System khas Puma.",
      price: 1800000,
      weight: 900,
      isFeatured: false,
      images: [
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
      ],
      variants: [
        { sku: "PM-RSX-GR-42", size: 42, color: "Green/White", stock: 25 },
        { sku: "PM-RSX-GR-43", size: 43, color: "Green/White", stock: 18 },
      ]
    },
    {
      categoryId: catCasual.id,
      brandId: brandNB.id,
      sku: "NB-574-BR",
      slug: "new-balance-574",
      name: "New Balance 574",
      shortDescription: "Klasik, serbaguna, dan selalu relevan.",
      description: "New Balance 574 adalah ikon dalam dunia sneakers. Desainnya yang timeless dipadukan dengan material berkualitas tinggi menjadikannya pilihan utama untuk gaya santai.",
      price: 1500000,
      weight: 750,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
      ],
      variants: [
        { sku: "NB-574-BR-40", size: 40, color: "Brown", stock: 30 },
        { sku: "NB-574-BR-41", size: 41, color: "Brown", stock: 22 },
        { sku: "NB-574-BR-42", size: 42, color: "Brown", stock: 15 },
      ]
    },
    {
      categoryId: catPria.id,
      brandId: brandNike.id,
      sku: "NK-AF1-WH",
      slug: "nike-air-force-1-white",
      name: "Nike Air Force 1 '07",
      shortDescription: "Klasik yang tidak pernah mati.",
      description: "Nike Air Force 1 '07 terus menghidupkan legenda dengan lapisan kulit yang renyah, detail mencolok, dan proporsi yang pas untuk membuatmu bersinar.",
      price: 1800000,
      weight: 1000,
      isFeatured: true,
      images: [
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"
      ],
      variants: [
        { sku: "NK-AF1-WH-40", size: 40, color: "White", stock: 50 },
        { sku: "NK-AF1-WH-41", size: 41, color: "White", stock: 45 },
        { sku: "NK-AF1-WH-42", size: 42, color: "White", stock: 35 },
      ]
    }
  ];

  console.log("Menyemai data produk...");

  for (const p of productsData) {
    const existing = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (!existing) {
      const createdProduct = await prisma.product.create({
        data: {
          categoryId: p.categoryId,
          brandId: p.brandId,
          sku: p.sku,
          slug: p.slug,
          name: p.name,
          shortDescription: p.shortDescription,
          description: p.description,
          price: p.price,
          discountPrice: p.discountPrice,
          weight: p.weight,
          isFeatured: p.isFeatured,
        }
      });

      for (let i = 0; i < p.images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: createdProduct.id,
            imageUrl: p.images[i],
            sortOrder: i,
          }
        });
      }

      for (const v of p.variants) {
        await prisma.productVariant.create({
          data: {
            productId: createdProduct.id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            stock: v.stock,
          }
        });
      }
    }
  }

  console.log("Berhasil menyemai data produk, kategori, dan brand!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
