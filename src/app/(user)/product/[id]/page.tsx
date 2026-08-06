import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/src/app/actions/product";

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

  // Jika produk tidak ditemukan, arahkan ke halaman 404 (Not Found)
  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Link href="/product" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Produk
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Kolom Kiri: Gambar Produk */}
        <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-3xl bg-muted border">
          <img
            src={product.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
          {(product as any).badge && (
            <span 
              className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-sm font-semibold shadow-sm ${
                (product as any).badgeStyle === "destructive" ? "bg-destructive text-destructive-foreground" :
                (product as any).badgeStyle === "secondary" ? "bg-secondary text-secondary-foreground" :
                (product as any).badgeStyle === "outline" ? "border border-input bg-background text-foreground" :
                "bg-primary text-primary-foreground"
              }`}
            >
              {(product as any).badge}
            </span>
          )}
        </div>

        {/* Kolom Kanan: Detail Produk */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {product.name}
          </h1>
          
          <div className="mt-6 flex items-end gap-3">
            <span className="text-3xl font-bold text-foreground">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
            </span>
            {(product as any).originalPrice && (
              <span className="text-xl text-muted-foreground line-through mb-1">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format((product as any).originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="mt-10 space-y-4">
            <h3 className="font-semibold text-foreground">Pilih Ukuran</h3>
            <div className="flex flex-wrap gap-3">
              {[39, 40, 41, 42, 43, 44].map((size) => (
                <Button key={size} variant="outline" className="h-12 w-12 rounded-full font-semibold">
                  {size}
                </Button>
              ))}
            </div>
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
    </div>
  );
}
