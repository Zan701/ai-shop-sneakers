import { auth } from "@/src/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Package, Truck, CreditCard, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { 
      id: id,
      userId: session.user.id
    },
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
    }
  });

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return "text-yellow-700";
      case 'PAID': return "text-blue-700";
      case 'SHIPPED': return "text-purple-700";
      case 'DELIVERED': return "text-green-700";
      case 'CANCELLED': return "text-red-700";
      default: return "text-gray-700";
    }
  };

  const getStatusIconBg = (status: string) => {
    switch(status) {
      case 'PENDING': return "bg-yellow-100 text-yellow-600";
      case 'PAID': return "bg-blue-100 text-blue-600";
      case 'SHIPPED': return "bg-purple-100 text-purple-600";
      case 'DELIVERED': return "bg-green-100 text-green-600";
      case 'CANCELLED': return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDING': return <Clock className="h-5 w-5" />;
      case 'PAID': return <CreditCard className="h-5 w-5" />;
      case 'SHIPPED': return <Truck className="h-5 w-5" />;
      case 'DELIVERED': return <CheckCircle2 className="h-5 w-5" />;
      case 'CANCELLED': return <XCircle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-4 border-b pb-6 mb-6">
          <Link href="/profile/orders" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold">Detail Pesanan</h2>
            <p className="text-sm text-muted-foreground">{order.invoiceNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Status Section */}
          <div className="border rounded-2xl p-5 flex items-start gap-4">
            <div className={cn("p-3 rounded-full shrink-0", getStatusIconBg(order.status))}>
              {getStatusIcon(order.status)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status Pesanan</p>
              <p className={cn("font-bold", getStatusColor(order.status))}>{order.status}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="border rounded-2xl p-5 flex items-start gap-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pembayaran</p>
              <p className="font-bold">{order.payment?.method || "-"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Status: {order.payment?.status || "-"}
              </p>
            </div>
          </div>

          {/* Shipment Section */}
          <div className="border rounded-2xl p-5 flex items-start gap-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pengiriman</p>
              <p className="font-bold">{order.shipment?.courier || "-"} - {order.shipment?.service || "-"}</p>
              {order.shipment?.trackingNumber && (
                <p className="text-xs text-muted-foreground mt-1">
                  Resi: {order.shipment.trackingNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border rounded-2xl overflow-hidden mb-8">
          <div className="bg-muted/30 px-6 py-4 border-b">
            <h3 className="font-semibold text-lg">Produk yang Dipesan</h3>
          </div>
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                <div className="w-20 h-20 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
                  {item.variant.product.images[0] ? (
                    <img src={item.variant.product.images[0].imageUrl} alt={item.variant.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-medium text-lg">{item.variant.product.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Size: {item.variant.size} | Color: {item.variant.color}
                  </p>
                </div>
                <div className="text-left sm:text-right flex flex-col justify-center mt-2 sm:mt-0">
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                  </p>
                  <p className="font-bold text-primary mt-1">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border rounded-2xl p-6 bg-muted/10">
          <div className="space-y-2 w-full sm:w-1/2 mb-4 sm:mb-0">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal Produk</span>
              <span className="font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ongkos Kirim</span>
              <span className="font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.shippingCost)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diskon</span>
                <span className="font-medium text-green-600">-{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.discount)}</span>
              </div>
            )}
          </div>
          
          <div className="w-full sm:w-auto text-left sm:text-right border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6">
            <p className="text-sm text-muted-foreground mb-1">Total Belanja</p>
            <p className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.grandTotal)}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
