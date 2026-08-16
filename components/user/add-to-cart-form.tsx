"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addToCart } from "@/src/app/actions/cart";

interface Variant {
  id: string;
  size: number;
  color: string;
  stock: number;
}

interface AddToCartFormProps {
  variants: Variant[];
  isLoggedIn: boolean;
}

export function AddToCartForm({ variants, isLoggedIn }: AddToCartFormProps) {
  const router = useRouter();
  
  // Extract unique colors and sizes from variants
  const colors = Array.from(new Set(variants.map(v => v.color)));
  
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Available sizes for the selected color
  const availableSizes = variants
    .filter(v => v.color === selectedColor)
    .sort((a, b) => a.size - b.size);

  const currentVariant = variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Silakan login terlebih dahulu untuk berbelanja");
      router.push("/api/auth/signin"); // Or your custom login page
      return;
    }

    if (!currentVariant) {
      toast.error("Silakan pilih ukuran yang tersedia");
      return;
    }

    if (currentVariant.stock < quantity) {
      toast.error("Stok tidak mencukupi");
      return;
    }

    setIsLoading(true);
    const res = await addToCart(currentVariant.id, quantity);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      window.dispatchEvent(new Event('cartUpdated'));
      // Optional: open a mini-cart or redirect
    } else {
      toast.error(res.error);
      if (res.error?.includes("Unauthorized")) {
        router.push("/api/auth/signin");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Warna */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Warna</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setSelectedSize(null); // reset size when color changes
                }}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  selectedColor === color 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ukuran */}
      {selectedColor && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Ukuran (EU)</h3>
            <button className="text-xs text-muted-foreground underline">Panduan Ukuran</button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {availableSizes.map(variant => (
              <button
                key={variant.id}
                onClick={() => setSelectedSize(variant.size)}
                disabled={variant.stock === 0}
                className={`py-2 text-sm rounded-md border text-center transition-colors ${
                  selectedSize === variant.size 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : variant.stock === 0
                      ? "border-border/50 bg-muted/50 text-muted-foreground cursor-not-allowed line-through"
                      : "border-border hover:border-primary/50"
                }`}
              >
                {variant.size}
              </button>
            ))}
          </div>
          {!selectedSize && (
            <p className="text-xs text-muted-foreground">Silakan pilih ukuran terlebih dahulu</p>
          )}
          {currentVariant && currentVariant.stock > 0 && (
            <p className="text-xs text-green-600 font-medium">Stok tersedia: {currentVariant.stock}</p>
          )}
          {currentVariant && currentVariant.stock === 0 && (
            <p className="text-xs text-red-500 font-medium">Stok habis</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <div className="flex items-center border rounded-md h-12 w-32">
          <button 
            className="w-10 h-full flex items-center justify-center hover:bg-muted"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >-</button>
          <div className="flex-1 text-center text-sm font-medium">{quantity}</div>
          <button 
            className="w-10 h-full flex items-center justify-center hover:bg-muted"
            onClick={() => setQuantity(currentVariant ? Math.min(currentVariant.stock, quantity + 1) : quantity + 1)}
          >+</button>
        </div>
        
        <Button 
          className="flex-1 h-12" 
          onClick={handleAddToCart}
          disabled={!currentVariant || currentVariant.stock === 0 || isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-5 w-5" />
          )}
          Tambah ke Keranjang
        </Button>
      </div>
    </div>
  );
}
