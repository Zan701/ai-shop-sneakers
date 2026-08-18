"use server";

import { prisma } from "@/lib/prisma";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        orders: {
          select: {
            id: true,
            grandTotal: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Gagal memuat data pelanggan" };
  }
}
