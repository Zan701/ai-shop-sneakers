import { getOrderById } from "@/src/app/actions/order";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Receipt, Package, Truck, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderDetailManager } from "@/components/admin/order-detail-manager";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Detail Pesanan | AI-Admin",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  const res = await getOrderById(id);
  const order = res.success ? res.data : null;

  if (!order) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 pb-20 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-4">
        <Link href="/admin/orders" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Pesanan
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Detail Pesanan</h2>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Receipt className="h-4 w-4" /> 
              <span className="font-medium text-foreground">{order.invoiceNumber}</span>
              &bull; 
              {new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <Badge variant="outline" className="text-base py-1 px-4">
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Kolom Kiri: Informasi Pelanggan & Alamat, Daftar Barang */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Informasi Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium text-base">{order.user.name || "N/A"}</p>
                <p className="text-muted-foreground">{order.user.email}</p>
                {order.user.profile?.phone && <p className="text-muted-foreground">{order.user.profile.phone}</p>}
              </CardContent>
            </Card>

            {/* Address Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Alamat Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {order.shippingAddress ? (
                  <>
                    <p className="font-medium">{order.shippingAddress.recipientName}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                    <p className="text-muted-foreground mt-2 line-clamp-2">{order.shippingAddress.address}</p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.district}, {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground italic">Alamat tidak tersedia</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Daftar Barang
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 items-start border-b pb-4 last:border-0 last:pb-0">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted/50">
                      {item.variant.product.images?.[0]?.imageUrl ? (
                        <img 
                          src={item.variant.product.images[0].imageUrl} 
                          alt={item.variant.product.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="font-semibold line-clamp-1">{item.variant.product.name}</h4>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                          <span className="bg-muted px-2 py-0.5 rounded-full border">Size: {item.variant.size}</span>
                          <span className="bg-muted px-2 py-0.5 rounded-full border">Color: {item.variant.color}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm font-medium">
                          {item.quantity} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                        </div>
                        <div className="font-semibold text-base">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.subtotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Summary & Management */}
        <div className="space-y-6">
          
          {/* Order Summary */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Ringkasan Biaya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal Produk</span>
                <span className="font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya Pengiriman</span>
                <span className="font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.shippingCost)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Diskon</span>
                  <span className="font-medium">-{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.discount)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Akhir</span>
                <span className="text-primary">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.grandTotal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Manager Component */}
          <OrderDetailManager 
            orderId={order.id}
            paymentId={order.payment?.id}
            shipmentId={order.shipment?.id}
            initialOrderStatus={order.status}
            initialPaymentStatus={order.payment?.status || "PENDING"}
            initialShipmentStatus={order.shipment?.status || "PENDING"}
            initialCourier={order.shipment?.courier || ""}
            initialTracking={order.shipment?.trackingNumber || ""}
          />

        </div>
      </div>
    </div>
  );
}
