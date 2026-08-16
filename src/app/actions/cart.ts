"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/src/auth";
import { revalidatePath } from "next/cache";

export async function addToCart(variantId: string, quantity: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Silakan login terlebih dahulu." };
    }
    const userId = session.user.id;

    // 1. Cari atau buat Cart untuk user ini
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // 2. Cek apakah item sudah ada di keranjang
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId: variantId,
      },
    });

    if (existingItem) {
      // Jika sudah ada, tambahkan quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Jika belum, buat baru
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId: variantId,
          quantity,
        },
      });
    }

    revalidatePath("/cart");
    return { success: true, message: "Produk berhasil ditambahkan ke keranjang" };
  } catch (error) {
    console.error("Error addToCart:", error);
    return { success: false, error: "Gagal menambahkan produk ke keranjang" };
  }
}

export async function getCart() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    
    const userId = session.user.id;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      orderBy: { sortOrder: 'asc' },
                      take: 1
                    }
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return { success: true, data: cart };
  } catch (error) {
    console.error("Error getCart:", error);
    return { success: false, error: "Gagal mengambil data keranjang" };
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    if (quantity <= 0) {
      return removeCartItem(cartItemId);
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    revalidatePath("/cart");
    return { success: true, message: "Jumlah diubah" };
  } catch (error) {
    console.error("Error updateCartItemQuantity:", error);
    return { success: false, error: "Gagal mengubah jumlah barang" };
  }
}

export async function removeCartItem(cartItemId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    revalidatePath("/cart");
    return { success: true, message: "Barang dihapus dari keranjang" };
  } catch (error) {
    console.error("Error removeCartItem:", error);
    return { success: false, error: "Gagal menghapus barang" };
  }
}
