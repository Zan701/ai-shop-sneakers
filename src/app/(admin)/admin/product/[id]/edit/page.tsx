import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Produk | AI Sneakers Admin",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = await params;
  
  // Ambil data produk yang mau diedit beserta gambarnya
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

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
        <h2 className="text-3xl font-extrabold tracking-tight">Edit Produk</h2>
        <p className="text-muted-foreground text-sm">Perbarui informasi, harga, atau gambar untuk sepatu "{product.name}".</p>
      </div>
      
      <ProductForm initialData={product} categories={categories} brands={brands} />
    </div>
  );
}
