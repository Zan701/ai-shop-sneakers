"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCheckoutData, createOrder } from "@/src/app/actions/checkout";
import { MapPin, CreditCard, Loader2, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getCheckoutData();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        toast.error(res.error || "Gagal memuat data checkout");
        if (res.error?.includes("kosong")) {
          router.push("/cart");
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [router]);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    const res = await createOrder(paymentMethod);
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Pesanan berhasil dibuat!");
      // Dispatch event to clear cart badge in navbar
      window.dispatchEvent(new Event('cartUpdated'));
      router.push(`/checkout/success/${res.orderId}`);
    } else {
      toast.error(res.error || "Terjadi kesalahan saat memproses pesanan.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <p className="text-muted-foreground animate-pulse">Menyiapkan checkout...</p>
      </div>
    );
  }

  if (!data) return null;

  const items = data.cart.items;
  const subtotal = items.reduce((acc: number, item: any) => {
    return acc + (item.variant.product.price * item.quantity);
  }, 0);
  const shippingCost = 25000;
  const grandTotal = subtotal + shippingCost;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Kolom Kiri: Detail Pengiriman & Pembayaran */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section Alamat */}
          <section className="p-6 border rounded-2xl bg-card">
            <div className="flex items-center gap-3 mb-4 text-lg font-semibold">
              <MapPin className="h-5 w-5 text-primary" />
              Alamat Pengiriman
            </div>
            <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-foreground">Alamat Utama (Dummy)</p>
                  <p className="text-sm text-muted-foreground mt-1">John Doe - 08123456789</p>
                  <p className="text-sm text-muted-foreground mt-1">Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info("Fitur manajemen alamat akan tersedia di Profil")}>
                  Ubah
                </Button>
              </div>
            </div>
          </section>

          {/* Section Kurir */}
          <section className="p-6 border rounded-2xl bg-card">
            <div className="flex items-center gap-3 mb-4 text-lg font-semibold">
              <Truck className="h-5 w-5 text-primary" />
              Metode Pengiriman
            </div>
            <div className="p-4 border rounded-xl flex justify-between items-center bg-muted/20">
              <div>
                <p className="font-medium">Reguler (JNE / SiCepat)</p>
                <p className="text-sm text-muted-foreground mt-1">Estimasi tiba 2-3 hari kerja</p>
              </div>
              <p className="font-semibold text-primary">Rp 25.000</p>
            </div>
          </section>

          {/* Section Pembayaran */}
          <section className="p-6 border rounded-2xl bg-card">
            <div className="flex items-center gap-3 mb-4 text-lg font-semibold">
              <CreditCard className="h-5 w-5 text-primary" />
              Metode Pembayaran
            </div>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <div className="flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="Transfer Bank" id="transfer" />
                <Label htmlFor="transfer" className="flex-1 cursor-pointer font-medium">Transfer Bank (BCA, Mandiri, BNI)</Label>
              </div>
              <div className="flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="E-Wallet" id="ewallet" />
                <Label htmlFor="ewallet" className="flex-1 cursor-pointer font-medium">E-Wallet (GoPay, OVO, Dana)</Label>
              </div>
              <div className="flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="Kartu Kredit" id="cc" />
                <Label htmlFor="cc" className="flex-1 cursor-pointer font-medium">Kartu Kredit / Debit Online</Label>
              </div>
            </RadioGroup>
          </section>

        </div>

        {/* Kolom Kanan: Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border rounded-2xl bg-card p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-semibold">Ringkasan Pesanan</h3>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 bg-muted rounded-md overflow-hidden">
                    <img 
                      src={item.variant.product.images?.[0]?.imageUrl || "/placeholder.jpg"} 
                      alt={item.variant.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium line-clamp-1">{item.variant.product.name}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">Size: {item.variant.size} • {item.variant.color}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.variant.product.price)}</span>
                      <span className="text-muted-foreground">x{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Harga ({items.length} Barang)</span>
                <span className="font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Ongkos Kirim</span>
                <span className="font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(shippingCost)}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="font-semibold text-lg">Total Akhir</span>
              <span className="text-xl font-bold text-primary">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(grandTotal)}
              </span>
            </div>

            <Button 
              className="w-full h-12 text-base font-medium rounded-xl"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>Buat Pesanan <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
