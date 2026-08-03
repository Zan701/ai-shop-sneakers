"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Initialize Prisma with pg adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const size = parseInt(formData.get("size") as string);
    const categoryId = formData.get("categoryId") as string;
    const image = formData.get("image") as string;
    
    if (!name || !price || !stock || !categoryId) {
      return { success: false, error: "Semua kolom wajib harus diisi" };
    }

    const product = await prisma.product.create({
      data: { 
        name,
        description: description || "",
        price,
        stock,
        size: size || null,
        categoryId,
        image: image || null
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const size = parseInt(formData.get("size") as string);
    const categoryId = formData.get("categoryId") as string;
    const image = formData.get("image") as string;
    
    if (!name || !price || !stock || !categoryId) {
      return { success: false, error: "Semua kolom wajib harus diisi" };
    }

    const product = await prisma.product.update({
      where: { id },
      data: { 
        name,
        description: description || "",
        price,
        stock,
        size: size || null,
        categoryId,
        image: image || null
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
