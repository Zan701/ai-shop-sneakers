import { getUsers } from "@/src/app/actions/user";
import { UserTable } from "@/components/admin/user-table";
import { Users } from "lucide-react";

export const metadata = {
  title: "Kelola Pelanggan | AI-Admin",
  description: "Daftar pelanggan toko",
};

export default async function AdminUsersPage() {
  const res = await getUsers();
  const users = res.success ? res.data : [];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Pelanggan
          </h2>
          <p className="text-muted-foreground">
            Kelola data pelanggan yang terdaftar di sistem.
          </p>
        </div>
      </div>

      <UserTable users={users || []} />
    </div>
  );
}
