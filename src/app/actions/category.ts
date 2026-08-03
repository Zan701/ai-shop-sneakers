"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});
const prisma = new PrismaClient({ adapter });

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: categories };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    const image = (formData.get("image") as string)?.trim() || null;
    
    if (!name || name.trim() === "") {
      return { success: false, error: "Nama kategori tidak boleh kosong" };
    }

    const category = await prisma.category.create({
      data: { 
        name: name.trim(),
        slug: slug,
        description: description,
        image: image,
      },
    });

    revalidatePath("/dashboard/categories");
    return { success: true, data: category };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    const image = (formData.get("image") as string)?.trim() || null;
    
    if (!name || name.trim() === "") {
      return { success: false, error: "Nama kategori tidak boleh kosong" };
    }

    const category = await prisma.category.update({
      where: { id },
      data: { 
        name: name.trim(),
        slug: slug,
        description: description,
        image: image,
      },
    });

    revalidatePath("/dashboard/categories");
    return { success: true, data: category };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
