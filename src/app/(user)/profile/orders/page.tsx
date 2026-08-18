import { auth } from "@/src/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Package, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "@/components/ui/button";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { images: true }
              }
            }
          }
        }
      },
      payment: true,
      shipment: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Riwayat Pesanan</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Belum Ada Pesanan</h3>
            <p className="text-muted-foreground mb-6">Anda belum pernah melakukan pemesanan apapun.</p>
            <Link href="/" className={cn(buttonVariants(), "rounded-xl h-11 px-8")}>
              Mulai Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{order.invoiceNumber}</span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        order.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                        order.status === 'PAID' ? "bg-blue-100 text-blue-700" :
                        order.status === 'SHIPPED' ? "bg-purple-100 text-purple-700" :
                        order.status === 'DELIVERED' ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-muted-foreground mb-1">Total Belanja</p>
                    <p className="font-bold text-primary text-lg">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.grandTotal)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
                        {item.variant.product.images[0] ? (
                          <img src={item.variant.product.images[0].imageUrl} alt={item.variant.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-1">{item.variant.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-end gap-3">
                  <Link href={"/checkout/success/" + order.id} className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
                    Lihat Invoice <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                  <Link href={"/profile/orders/" + order.id} className={cn(buttonVariants(), "rounded-xl")}>
                    Lihat Detail Pesanan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



