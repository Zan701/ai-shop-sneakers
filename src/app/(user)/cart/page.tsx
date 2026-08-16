"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, updateCartItemQuantity, removeCartItem } from "@/src/app/actions/cart";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    setIsLoading(true);
    const res = await getCart();
    if (res.success) {
      setCart(res.data);
    } else {
      toast.error(res.error || "Gagal memuat keranjang");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQty = async (itemId: string, newQty: number) => {
    const res = await updateCartItemQuantity(itemId, newQty);
    if (res.success) {
      fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      toast.error(res.error);
    }
  };

  const handleRemove = async (itemId: string) => {
    const res = await removeCartItem(itemId);
    if (res.success) {
      toast.success(res.message);
      fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      toast.error(res.error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <p className="text-muted-foreground animate-pulse">Memuat keranjang...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  
  // Hitung subtotal
  const subtotal = items.reduce((acc: number, item: any) => {
    return acc + (item.variant.product.price * item.quantity);
  }, 0);

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Keranjang Belanja</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 border rounded-2xl bg-muted/30">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Keranjang masih kosong</h2>
          <p className="text-muted-foreground mb-6">Yuk, cari sepatu favoritmu sekarang!</p>
          <Link href="/" className={buttonVariants({ variant: "default" })}>
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Kolom Kiri: Daftar Item */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item: any) => {
              const product = item.variant.product;
              const image = product.images?.[0]?.imageUrl;
              
              return (
                <div key={item.id} className="flex gap-4 p-4 border rounded-2xl bg-card">
                  <div className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 bg-muted/50 rounded-xl overflow-hidden">
                    {image ? (
                      <img src={image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                    )}
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Size: {item.variant.size} &bull; {item.variant.color}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-2 -mr-2 -mt-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-lg font-bold">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                      </div>
                      
                      <div className="flex items-center border rounded-lg h-9 w-28 bg-background">
                        <button 
                          className="w-8 h-full flex items-center justify-center hover:bg-muted text-muted-foreground"
                          onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        >-</button>
                        <div className="flex-1 text-center text-sm font-medium">{item.quantity}</div>
                        <button 
                          className="w-8 h-full flex items-center justify-center hover:bg-muted text-muted-foreground"
                          onClick={() => handleUpdateQty(item.id, Math.min(item.variant.stock, item.quantity + 1))}
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kolom Kanan: Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border rounded-2xl bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Ringkasan Belanja</h3>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Harga ({items.length} Barang)</span>
                  <span className="font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diskon</span>
                  <span className="font-medium text-green-600">- Rp 0</span>
                </div>
              </div>
              
              <div className="pt-4 border-t flex justify-between items-center mb-6">
                <span className="font-semibold">Total Akhir</span>
                <span className="text-xl font-bold text-primary">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(subtotal)}
                </span>
              </div>

              <Button 
                className="w-full h-12 text-base font-medium rounded-xl"
                onClick={() => toast.info("Fitur Checkout akan segera hadir!")}
              >
                Beli Sekarang <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
