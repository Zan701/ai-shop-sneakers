"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/src/auth";
import { revalidatePath } from "next/cache";

export async function getCheckoutData() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    
    const userId = session.user.id;
    
    // Get Cart Data
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

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Keranjang belanja kosong" };
    }

    // Fetch default user address
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: {
          where: { isDefault: true },
          take: 1
        }
      }
    });

    const address = user?.addresses?.[0] || null;
    
    return { success: true, data: { cart, address } };
  } catch (error) {
    console.error("Error getCheckoutData:", error);
    return { success: false, error: "Gagal mengambil data checkout" };
  }
}

export async function createOrder(paymentMethod: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    
    const userId = session.user.id;

    // Fetch the cart again to calculate total
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Keranjang kosong" };
    }

    // 1. Calculate totals
    const shippingCost = 25000; // Flat dummy shipping cost
    let subtotal = 0;
    
    // 2. Validate stock
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        return { success: false, error: `Stok produk ${item.variant.product.name} (Size: ${item.variant.size}) tidak mencukupi.` };
      }
      subtotal += item.variant.product.price * item.quantity;
    }

    const discount = 0;
    const grandTotal = subtotal + shippingCost - discount;
    const invoiceNumber = "INV-" + new Date().getTime();

    // 3. Create the order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // 3a. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          invoiceNumber,
          subtotal,
          shippingCost,
          discount,
          grandTotal,
          status: "PENDING",
        }
      });

      // 3b. Create OrderItems and decrease stock
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.variant.product.price,
            subtotal: item.variant.product.price * item.quantity,
          }
        });

        // Decrease stock
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 3c. Create Payment
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          method: paymentMethod,
          amount: grandTotal,
          status: "PENDING",
        }
      });

      // 3d. Create Shipment
      await tx.shipment.create({
        data: {
          orderId: newOrder.id,
          courier: "JNE", // Dummy courier
          service: "REG",
          status: "PENDING",
        }
      });

      // 3e. Delete Cart Items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    revalidatePath("/cart");
    revalidatePath("/admin/orders");
    
    return { success: true, orderId: order.id, invoiceNumber: order.invoiceNumber };

  } catch (error) {
    console.error("Error createOrder:", error);
    return { success: false, error: "Gagal membuat pesanan. Silakan coba lagi." };
  }
}
