"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

// ----------------------------------------------------------------------
// GET PRODUCTS
// ----------------------------------------------------------------------
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------------------------
// HELPER: UPLOAD IMAGE
// ----------------------------------------------------------------------
async function handleImageUpload(imageFile: File | null) {
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Ciptakan nama file unik
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${imageFile.name.replace(/\s+/g, '-')}`;
    
    const uploadDir = path.join(process.cwd(), "public/uploads/products");
    await mkdir(uploadDir, { recursive: true });
    
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/uploads/products/${filename}`;
  }
  return null;
}

// ----------------------------------------------------------------------
// HELPER: DELETE PHYSICAL IMAGE
// ----------------------------------------------------------------------
async function deletePhysicalImage(imageUrl: string) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/products/")) return;
  try {
    const filename = imageUrl.replace("/uploads/products/", "");
    const filepath = path.join(process.cwd(), "public/uploads/products", filename);
    await unlink(filepath);
  } catch (err) {
    console.error("Gagal menghapus file fisik:", err);
  }
}

// ----------------------------------------------------------------------
// CREATE PRODUCT
// ----------------------------------------------------------------------
export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    let slug = (formData.get("slug") as string)?.trim();
    const categoryId = formData.get("categoryId") as string;
    const brandId = formData.get("brandId") as string;
    const price = parseInt(formData.get("price") as string) || 0;
    const discountPriceStr = formData.get("discountPrice") as string;
    const discountPrice = discountPriceStr ? parseInt(discountPriceStr) : null;
    const weight = parseInt(formData.get("weight") as string) || 0;
    const shortDescription = (formData.get("shortDescription") as string)?.trim() || null;
    const description = formData.get("description") as string;
    const status = formData.get("status") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    
    // Validasi basic
    if (!name || name.trim() === "") return { success: false, error: "Nama produk wajib diisi" };
    if (!categoryId) return { success: false, error: "Kategori wajib dipilih" };
    if (!brandId) return { success: false, error: "Brand wajib dipilih" };
    if (!description) return { success: false, error: "Deskripsi wajib diisi" };

    // Auto Slug jika kosong
    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Cek duplikasi slug
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`; // Auto append jika kembar
    }

    // Auto SKU Generation (Format: PRD-TIMESTAMP-RANDOM)
    const sku = `PRD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // Handle Upload Multiple Images
    const imageFiles = formData.getAll("images") as File[];
    const imageUrls: { imageUrl: string; sortOrder: number }[] = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file && file.size > 0) {
        const url = await handleImageUpload(file);
        if (url) {
          imageUrls.push({ imageUrl: url, sortOrder: i });
        }
      }
    }

    // Simpan ke Database
    const product = await prisma.product.create({
      data: { 
        name: name.trim(),
        slug: slug,
        sku: sku,
        categoryId: categoryId,
        brandId: brandId,
        price: price,
        discountPrice: discountPrice,
        weight: weight,
        shortDescription: shortDescription,
        description: description,
        status: status,
        isFeatured: isFeatured,
        images: {
          create: imageUrls
        }
      },
    });

    revalidatePath("/admin/product");
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------------------------
// UPDATE PRODUCT
// ----------------------------------------------------------------------
export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    let slug = (formData.get("slug") as string)?.trim();
    const categoryId = formData.get("categoryId") as string;
    const brandId = formData.get("brandId") as string;
    const price = parseInt(formData.get("price") as string) || 0;
    const discountPriceStr = formData.get("discountPrice") as string;
    const discountPrice = discountPriceStr ? parseInt(discountPriceStr) : null;
    const weight = parseInt(formData.get("weight") as string) || 0;
    const shortDescription = (formData.get("shortDescription") as string)?.trim() || null;
    const description = formData.get("description") as string;
    const status = formData.get("status") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    
    if (!name || name.trim() === "") return { success: false, error: "Nama produk wajib diisi" };

    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug && existingSlug.id !== id) {
      return { success: false, error: "Slug sudah digunakan oleh produk lain" };
    }

    // Simpan Perubahan Basic Data
    await prisma.product.update({
      where: { id },
      data: { 
        name: name.trim(),
        slug: slug,
        categoryId: categoryId,
        brandId: brandId,
        price: price,
        discountPrice: discountPrice,
        weight: weight,
        shortDescription: shortDescription,
        description: description,
        status: status,
        isFeatured: isFeatured,
      },
    });

    // Handle Penghapusan Gambar Lama (List ID yang dikirim dari form)
    const imagesToDeleteStr = formData.get("imagesToDelete") as string;
    if (imagesToDeleteStr) {
      const idsToDelete = JSON.parse(imagesToDeleteStr) as string[];
      if (idsToDelete.length > 0) {
        // Ambil data url untuk menghapus file fisik
        const imagesToDelete = await prisma.productImage.findMany({
          where: { id: { in: idsToDelete } }
        });
        
        for (const img of imagesToDelete) {
          await deletePhysicalImage(img.imageUrl);
        }

        // Hapus dari database
        await prisma.productImage.deleteMany({
          where: { id: { in: idsToDelete } }
        });
      }
    }

    // Handle Upload Gambar Baru
    const newImageFiles = formData.getAll("newImages") as File[];
    // Ambil order terakhir
    const lastImage = await prisma.productImage.findFirst({
      where: { productId: id },
      orderBy: { sortOrder: 'desc' }
    });
    let nextSortOrder = lastImage ? lastImage.sortOrder + 1 : 0;

    const newImageUrls: { productId: string; imageUrl: string; sortOrder: number }[] = [];
    
    for (const file of newImageFiles) {
      if (file && file.size > 0) {
        const url = await handleImageUpload(file);
        if (url) {
          newImageUrls.push({ productId: id, imageUrl: url, sortOrder: nextSortOrder });
          nextSortOrder++;
        }
      }
    }

    if (newImageUrls.length > 0) {
      await prisma.productImage.createMany({
        data: newImageUrls
      });
    }

    revalidatePath("/admin/product");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------------------------
// DELETE PRODUCT
// ----------------------------------------------------------------------
export async function deleteProduct(id: string) {
  try {
    // Cari semua gambar produk ini
    const images = await prisma.productImage.findMany({
      where: { productId: id }
    });

    // Hapus file fisik gambar
    for (const img of images) {
      await deletePhysicalImage(img.imageUrl);
    }

    // Hapus Produk dari database (otomatis hapus relasi cascade di database)
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/product");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------------------------
// GET PRODUCT BY ID
// ----------------------------------------------------------------------
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: true,
      },
    });
    if (!product) return { success: false, error: "Produk tidak ditemukan" };
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
