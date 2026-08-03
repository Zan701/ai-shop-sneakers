import { getCategories } from "@/src/app/actions/category";
import CategoriesClient from "./categories-client"; // Added comment to force TS Server refresh

export const metadata = {
  title: "Kelola Kategori | AI Sneakers Admin",
};

export default async function CategoriesPage() {
  const { data: categories = [], success, error } = await getCategories();

  return (
    <div className="flex-1 space-y-6 md:p-6 pt-4 bg-muted/20 min-h-screen">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Kategori Produk</h2>
        <p className="text-muted-foreground text-sm">Kelola master data kategori untuk produk-produk di toko.</p>
      </div>

      {!success && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm mb-4">
          Gagal mengambil data kategori: {error}
        </div>
      )}

      <div className="bg-background/80 backdrop-blur-2xl border rounded-3xl p-6 shadow-sm">
        <CategoriesClient initialCategories={categories || []} />
      </div>
    </div>
  );
}
