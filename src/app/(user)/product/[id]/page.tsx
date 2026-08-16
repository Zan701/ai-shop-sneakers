import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/src/app/actions/product";
import { ProductGallery } from "@/components/user/product-gallery";
import { ProductTabs } from "@/components/user/product-tabs";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  // Await params as required in Next.js 15+
  const { id } = await params;
  
  // Mencari produk berdasarkan ID dari URL ke Database
  const res = await getProductById(id);
  const product = res.success ? res.data : null;

  if (!product) {
    notFound();
  }

  // Extract Varian
  const variants = product.variants || [];
  const availableSizes = Array.from(new Set(variants.map((v: any) => v.size))).sort((a: any, b: any) => a - b);
  const availableColors = Array.from(new Set(variants.map((v: any) => v.color)));

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Link href="/product" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Produk
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Kolom Kiri: Gambar Produk (Gallery) */}
        <ProductGallery images={product.images || []} productName={product.name} />

        {/* Kolom Kanan: Detail Produk */}
        <div className="flex flex-col max-w-xl pt-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {product.name}
          </h1>
          
          <div className="mt-4 flex items-end gap-3">
            <span className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xl text-muted-foreground line-through mb-1">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
              </span>
            )}
          </div>

          <div className="mt-8 space-y-6">
            
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Pilih Warna</h3>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color: any) => (
                    <Button key={color} variant="outline" className="rounded-full px-5 font-medium">
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Pilih Ukuran</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size: any) => (
                    <Button key={size} variant="outline" className="h-12 w-12 rounded-full font-semibold">
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {availableColors.length === 0 && availableSizes.length === 0 && (
              <p className="text-muted-foreground text-sm italic border p-4 rounded-xl bg-muted/20">
                Varian untuk produk ini belum tersedia.
              </p>
            )}
          </div>

          <div className="mt-10 flex gap-4">
            <Button size="lg" className="flex-1 rounded-full h-14 text-base font-semibold">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Tambah ke Keranjang
            </Button>
            <Button size="icon" variant="outline" className="h-14 w-14 rounded-full">
              <Heart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Tabs Deskripsi & Review */}
      <ProductTabs description={product.description || ""} />
    </div>
  );
}
