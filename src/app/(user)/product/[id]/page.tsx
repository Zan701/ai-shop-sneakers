import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/src/app/actions/product";
import { ProductGallery } from "@/components/user/product-gallery";
import { ProductTabs } from "@/components/user/product-tabs";
import { AddToCartForm } from "@/components/user/add-to-cart-form";
import { auth } from "@/src/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  // Await params as required in Next.js 15+
  const { id } = await params;
  const session = await auth();
  const isLoggedIn = !!session?.user;
  
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

          <div className="mt-8">
            <AddToCartForm variants={product.variants} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Tabs Deskripsi & Review */}
      <ProductTabs description={product.description || ""} />
    </div>
  );
}
