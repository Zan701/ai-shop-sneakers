"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/src/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Unauthorized" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const gender = formData.get("gender") as "MALE" | "FEMALE";

  try {
    // Update basic user
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    // Update profile
    await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: { phone, gender },
      create: {
        userId: session.user.id,
        phone,
        gender,
      },
    });

    revalidatePath("/profile");
    return { success: true, message: "Profil berhasil diperbarui" };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, message: "Gagal memperbarui profil" };
  }
}

export async function updateAddress(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Unauthorized" };

  const addressId = formData.get("addressId") as string;
  const label = formData.get("label") as string || "Rumah";
  const recipientName = formData.get("recipientName") as string;
  const phone = formData.get("phone") as string;
  const province = formData.get("province") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;
  const postalCode = formData.get("postalCode") as string;
  const address = formData.get("address") as string;

  try {
    if (addressId) {
      await prisma.userAddress.update({
        where: { id: addressId, userId: session.user.id },
        data: { label, recipientName, phone, province, city, district, postalCode, address },
      });
    } else {
      // De-default others
      await prisma.userAddress.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
      
      await prisma.userAddress.create({
        data: {
          userId: session.user.id,
          label, recipientName, phone, province, city, district, postalCode, address,
          isDefault: true
        }
      });
    }

    revalidatePath("/profile");
    return { success: true, message: "Alamat berhasil disimpan" };
  } catch (error) {
    console.error("Failed to update address:", error);
    return { success: false, message: "Gagal menyimpan alamat" };
  }
}
