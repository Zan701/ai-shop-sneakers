import { getOrders } from "@/src/app/actions/order";
import { OrderTable } from "@/components/admin/order-table";
import { Package } from "lucide-react";

export const metadata = {
  title: "Kelola Pesanan | AI-Admin",
  description: "Daftar pesanan masuk",
};

export default async function AdminOrdersPage() {
  const res = await getOrders();
  const orders = res.success ? res.data : [];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8" />
            Pesanan
          </h2>
          <p className="text-muted-foreground">
            Kelola pesanan pelanggan, status pembayaran, dan pengiriman.
          </p>
        </div>
      </div>

      <OrderTable orders={orders || []} />
    </div>
  );
}
