import { auth } from "@/src/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      addresses: {
        where: { isDefault: true },
        take: 1
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const profile = user.profile;
  const defaultAddress = user.addresses[0];

  return (
    <ProfileForm user={user} profile={profile} address={defaultAddress} />
  );
}
