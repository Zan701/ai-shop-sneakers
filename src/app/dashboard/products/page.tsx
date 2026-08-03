import { getProducts } from "@/src/app/actions/product";
import { getCategories } from "@/src/app/actions/category";
import ProductsClient from "./products-client";

export const metadata = {
  title: "Kelola Produk | AI Sneakers Admin",
};

export default async function ProductsPage() {
  // Fetch both products and categories in parallel
  const [productsRes, categoriesRes] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <div className="flex-1 space-y-6 md:p-6 pt-4 bg-muted/20 min-h-screen">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Daftar Produk</h2>
        <p className="text-muted-foreground text-sm">Kelola semua inventaris produk sepatu dan harga di tokomu.</p>
      </div>

      {(!productsRes.success || !categoriesRes.success) && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm mb-4">
          Terjadi kesalahan saat mengambil data dari database.
        </div>
      )}

      <div className="bg-background/80 backdrop-blur-2xl border rounded-3xl p-6 shadow-sm">
        <ProductsClient 
          initialProducts={productsRes.data || []} 
          categories={categoriesRes.data || []} 
        />
      </div>
    </div>
  );
}
