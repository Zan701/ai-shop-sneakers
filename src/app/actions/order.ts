"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus, ShipmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// 1. Ambil semua pesanan
export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        payment: true,
        shipment: true,
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true } }
              }
            }
          }
        }
      },
    });
    return { success: true, data: orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

// 2. Ambil detail pesanan
export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: { 
            name: true, 
            email: true, 
            profile: { select: { phone: true } } 
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { take: 1 }
                  }
                }
              }
            }
          }
        },
        payment: true,
        shipment: true,
      },
    });

    if (!order) return { success: false, error: "Order not found" };

    // Fetch user address (assuming we pick the default one or the first one if default isn't marked, though ideally order should snapshot address)
    // In current schema, order is linked to User, not a specific snapshot of Address. We'll fetch the user's default address for display.
    const address = await prisma.userAddress.findFirst({
      where: { userId: order.userId, isDefault: true },
    }) || await prisma.userAddress.findFirst({
      where: { userId: order.userId },
    });

    return { success: true, data: { ...order, shippingAddress: address } };
  } catch (error) {
    console.error("Error fetching order detail:", error);
    return { success: false, error: "Failed to fetch order detail" };
  }
}

// 3. Update Order Status
export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

// 4. Update Payment Status
export async function updatePaymentStatus(id: string, paymentId: string, status: PaymentStatus) {
  try {
    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}

// 5. Update Shipment Status & Resi
export async function updateShipmentInfo(
  orderId: string, 
  shipmentId: string, 
  data: { status?: ShipmentStatus, trackingNumber?: string, courier?: string, service?: string }
) {
  try {
    const updated = await prisma.shipment.update({
      where: { id: shipmentId },
      data,
    });
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating shipment:", error);
    return { success: false, error: "Failed to update shipment info" };
  }
}
