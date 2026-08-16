import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Tambah Produk | AI Sneakers Admin",
};

export default async function CreateProductPage() {
  // Ambil data untuk dropdown Form
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });
  
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="flex-1 space-y-6 md:p-6 pt-4 bg-muted/20 min-h-screen">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Tambah Produk Baru</h2>
        <p className="text-muted-foreground text-sm">Tambahkan koleksi sepatu baru ke dalam toko Anda beserta detail spesifikasinya.</p>
      </div>
      
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
