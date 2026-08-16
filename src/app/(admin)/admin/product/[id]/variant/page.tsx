import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { VariantManager } from "@/components/admin/variant-manager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Kelola Varian Produk | AI Sneakers Admin",
};

export default async function VariantProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = await params;
  
  // Ambil data produk dan varian awalnya
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: {
        orderBy: [
          { color: "asc" },
          { size: "asc" },
        ]
      }
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-6 md:p-6 pt-4 bg-muted/20 min-h-screen">
      <div className="mb-2">
        <Link href="/admin/product">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Daftar Produk
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Kelola Varian</h2>
        <p className="text-muted-foreground text-sm">
          Atur pilihan ukuran, warna, dan stok untuk produk <span className="font-bold text-foreground">"{product.name}"</span>.
        </p>
      </div>
      
      <VariantManager productId={product.id} initialVariants={product.variants} />
    </div>
  );
}
