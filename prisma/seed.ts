import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Menjalankan seeder database...");

  // Hapus data lama (optional, karena sudah direset)
  await prisma.user.deleteMany({
    where: { email: "admin@ai-shop.com" }
  });

  // Hash password
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Buat Admin User
  const admin = await prisma.user.create({
    data: {
      name: "Admin Super",
      email: "admin@ai-shop.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Berhasil membuat Admin!");
  console.log("Email: admin@ai-shop.com");
  console.log("Password: admin123");

  // Buat beberapa kategori default agar tidak kosong
  const cat1 = await prisma.category.create({
    data: {
      name: "Sneakers Pria",
      slug: "sneakers-pria",
      description: "Koleksi sneakers untuk pria",
    }
  });

  const cat2 = await prisma.category.create({
    data: {
      name: "Sneakers Wanita",
      slug: "sneakers-wanita",
      description: "Koleksi sneakers untuk wanita",
    }
  });

  console.log("Berhasil membuat kategori awal.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
