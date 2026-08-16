"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ----------------------------------------------------------------------
// GET VARIANTS BY PRODUCT ID
// ----------------------------------------------------------------------
export async function getVariantsByProduct(productId: string) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { productId },
      orderBy: [
        { color: "asc" },
        { size: "asc" },
      ],
    });
    return { success: true, data: variants };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------------------------
// CREATE VARIANT
// ----------------------------------------------------------------------
export async function createVariant(formData: FormData) {
  try {
    const productId = formData.get("productId") as string;
    const color = formData.get("color") as string;
    const size = parseInt(formData.get("size") as string) || 0;
    const stock = parseInt(formData.get("stock") as string) || 0;

    if (!productId || !color || !size) {
      return { success: false, error: "Data produk, warna, dan ukuran wajib diisi" };
    }

    // Cek apakah varian warna dan ukuran ini sudah ada
    const existingVariant = await prisma.productVariant.findUnique({
      where: {
        productId_size_color: {
          productId,
          size,
          color,
        },
      },
    });

    if (existingVariant) {
      return { success: false, error: "Varian dengan warna dan ukuran ini sudah ada." };
    }

    // Ambil Data Produk untuk bikin SKU Base
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return { success: false, error: "Produk tidak ditemukan" };
    }

    // Auto-Generate SKU Varian (Format: PRD-SKU-COLOR-SIZE)
    const colorCode = color.replace(/[^a-zA-Z0-9]/g, "").substring(0, 3).toUpperCase();
    const sku = `${product.sku}-${colorCode}-${size}`;

    // Cek apakah SKU hasil generate tabrakan (sangat jarang tapi mungkin jika colorCode sama)
    let finalSku = sku;
    const existingSku = await prisma.productVariant.findUnique({ where: { sku: finalSku } });
    if (existingSku) {
      finalSku = `${sku}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        sku: finalSku,
        color,
        size,
        stock,
      },
    });

    revalidatePath(`/admin/product/${productId}/variant`);
    return { success: true, data: variant };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------------------------
// UPDATE VARIANT STOCK
// ----------------------------------------------------------------------
export async function updateVariantStock(id: string, newStock: number, productId: string) {
  try {
    if (newStock < 0) return { success: false, error: "Stok tidak boleh minus" };

    const variant = await prisma.productVariant.update({
      where: { id },
      data: { stock: newStock },
    });

    revalidatePath(`/admin/product/${productId}/variant`);
    return { success: true, data: variant };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------------------------
// DELETE VARIANT
// ----------------------------------------------------------------------
export async function deleteVariant(id: string, productId: string) {
  try {
    await prisma.productVariant.delete({
      where: { id },
    });

    revalidatePath(`/admin/product/${productId}/variant`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
