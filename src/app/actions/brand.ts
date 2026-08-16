"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: brands };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function handleImageUpload(imageFile: File | null, existingUrl: string | null = null) {
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
    
    const uploadDir = path.join(process.cwd(), "public/uploads/brands");
    await mkdir(uploadDir, { recursive: true });
    
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/uploads/brands/${filename}`;
  }
  return existingUrl;
}

export async function createBrand(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    let slug = (formData.get("slug") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const isActive = formData.get("isActive") === "true";
    
    if (!name || name.trim() === "") {
      return { success: false, error: "Nama brand tidak boleh kosong" };
    }

    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const existingSlug = await prisma.brand.findUnique({ where: { slug } });
    if (existingSlug) {
      return { success: false, error: "Slug sudah digunakan oleh brand lain" };
    }

    // Handle File Upload
    const imageFile = formData.get("image") as File | null;
    const imageUrl = await handleImageUpload(imageFile);

    const brand = await prisma.brand.create({
      data: { 
        name: name.trim(),
        slug: slug,
        description: description,
        image: imageUrl,
        isActive: isActive,
      },
    });

    revalidatePath("/admin/brands");
    return { success: true, data: brand };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBrand(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    let slug = (formData.get("slug") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const isActive = formData.get("isActive") === "true";
    
    if (!name || name.trim() === "") {
      return { success: false, error: "Nama brand tidak boleh kosong" };
    }

    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const existingSlug = await prisma.brand.findUnique({ where: { slug } });
    if (existingSlug && existingSlug.id !== id) {
      return { success: false, error: "Slug sudah digunakan oleh brand lain" };
    }

    // Handle File Upload
    const imageFile = formData.get("image") as File | null;
    const existingImageUrl = formData.get("existingImageUrl") as string | null;
    const imageUrl = await handleImageUpload(imageFile, existingImageUrl);

    const brand = await prisma.brand.update({
      where: { id },
      data: { 
        name: name.trim(),
        slug: slug,
        description: description,
        image: imageUrl,
        isActive: isActive,
      },
    });

    revalidatePath("/admin/brands");
    return { success: true, data: brand };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBrand(id: string) {
  try {
    // Check if brand has products
    const productsCount = await prisma.product.count({
      where: { brandId: id }
    });

    if (productsCount > 0) {
      return { success: false, error: `Tidak dapat menghapus brand. Ada ${productsCount} produk yang menggunakan brand ini.` };
    }

    await prisma.brand.delete({
      where: { id },
    });

    revalidatePath("/admin/brands");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
