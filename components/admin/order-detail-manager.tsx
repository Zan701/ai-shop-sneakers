"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus, PaymentStatus, ShipmentStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { updateOrderStatus, updatePaymentStatus, updateShipmentInfo } from "@/src/app/actions/order";
import { Loader2 } from "lucide-react";

interface OrderDetailManagerProps {
  orderId: string;
  paymentId?: string;
  shipmentId?: string;
  initialOrderStatus: OrderStatus;
  initialPaymentStatus: PaymentStatus;
  initialShipmentStatus: ShipmentStatus;
  initialCourier?: string;
  initialTracking?: string;
}

export function OrderDetailManager({
  orderId,
  paymentId,
  shipmentId,
  initialOrderStatus,
  initialPaymentStatus,
  initialShipmentStatus,
  initialCourier,
  initialTracking,
}: OrderDetailManagerProps) {
  const router = useRouter();
  
  // States
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(initialOrderStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(initialPaymentStatus);
  const [shipmentStatus, setShipmentStatus] = useState<ShipmentStatus>(initialShipmentStatus);
  const [courier, setCourier] = useState(initialCourier || "");
  const [trackingNumber, setTrackingNumber] = useState(initialTracking || "");

  // Loaders
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isUpdatingShipment, setIsUpdatingShipment] = useState(false);

  // Handlers
  const handleUpdateOrder = async () => {
    setIsUpdatingOrder(true);
    const res = await updateOrderStatus(orderId, orderStatus);
    if (res.success) {
      toast.success("Status pesanan berhasil diperbarui");
      router.refresh();
    } else {
      toast.error(res.error || "Gagal memperbarui status");
    }
    setIsUpdatingOrder(false);
  };

  const handleUpdatePayment = async () => {
    if (!paymentId) return toast.error("Data pembayaran tidak ditemukan");
    setIsUpdatingPayment(true);
    const res = await updatePaymentStatus(orderId, paymentId, paymentStatus);
    if (res.success) {
      toast.success("Status pembayaran berhasil diperbarui");
      router.refresh();
    } else {
      toast.error(res.error || "Gagal memperbarui pembayaran");
    }
    setIsUpdatingPayment(false);
  };

  const handleUpdateShipment = async () => {
    if (!shipmentId) return toast.error("Data pengiriman tidak ditemukan");
    setIsUpdatingShipment(true);
    const res = await updateShipmentInfo(orderId, shipmentId, {
      status: shipmentStatus,
      courier,
      trackingNumber,
    });
    if (res.success) {
      toast.success("Informasi pengiriman berhasil diperbarui");
      router.refresh();
    } else {
      toast.error(res.error || "Gagal memperbarui pengiriman");
    }
    setIsUpdatingShipment(false);
  };

  return (
    <div className="space-y-6">
      {/* Update Order Status */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Status Pesanan Utama</CardTitle>
          <CardDescription>Ubah status pesanan secara keseluruhan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label>Status</Label>
              <Select value={orderStatus} onValueChange={(val) => setOrderStatus(val as OrderStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending (Menunggu)</SelectItem>
                  <SelectItem value="PAID">Paid (Dibayar)</SelectItem>
                  <SelectItem value="SHIPPED">Shipped (Dikirim)</SelectItem>
                  <SelectItem value="DELIVERED">Delivered (Diterima)</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled (Dibatalkan)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateOrder} disabled={isUpdatingOrder || orderStatus === initialOrderStatus}>
              {isUpdatingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Update Payment Status */}
      {paymentId && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Status Pembayaran</CardTitle>
            <CardDescription>Kelola status transaksi pembayaran.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label>Status</Label>
                <Select value={paymentStatus} onValueChange={(val) => setPaymentStatus(val as PaymentStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdatePayment} disabled={isUpdatingPayment || paymentStatus === initialPaymentStatus}>
                {isUpdatingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Pembayaran
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Update Shipment Info */}
      {shipmentId && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Informasi Pengiriman</CardTitle>
            <CardDescription>Input resi dan pantau status kurir.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kurir (Ekspedisi)</Label>
                <Input 
                  value={courier} 
                  onChange={(e) => setCourier(e.target.value)} 
                  placeholder="Misal: JNE, J&T, Sicepat"
                />
              </div>
              <div className="space-y-2">
                <Label>Nomor Resi (Tracking Number)</Label>
                <Input 
                  value={trackingNumber} 
                  onChange={(e) => setTrackingNumber(e.target.value)} 
                  placeholder="Masukkan nomor resi..."
                />
              </div>
            </div>
            
            <div className="flex items-end gap-4 mt-4">
              <div className="flex-1 space-y-2">
                <Label>Status Pengiriman</Label>
                <Select value={shipmentStatus} onValueChange={(val) => setShipmentStatus(val as ShipmentStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending (Menyiapkan)</SelectItem>
                    <SelectItem value="PROCESSING">Processing (Diproses)</SelectItem>
                    <SelectItem value="SHIPPED">Shipped (Dikirim)</SelectItem>
                    <SelectItem value="DELIVERED">Delivered (Sampai)</SelectItem>
                    <SelectItem value="RETURNED">Returned (Dikembalikan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleUpdateShipment} 
                disabled={
                  isUpdatingShipment || 
                  (shipmentStatus === initialShipmentStatus && courier === initialCourier && trackingNumber === initialTracking)
                }
              >
                {isUpdatingShipment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Pengiriman
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
