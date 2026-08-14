import { CategoryForm } from "@/components/admin/category-form";
import { getCategories } from "@/src/app/actions/category";

export const metadata = {
  title: "Tambah Kategori | AI Sneakers Admin",
};

export default async function CreateCategoryPage() {
  const { data: categories = [] } = await getCategories();

  return (
    <div className="flex-1 space-y-6 md:p-6 pt-4 bg-muted/20 min-h-screen">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Tambah Kategori</h2>
        <p className="text-muted-foreground text-sm">Tambahkan kategori baru untuk mengelompokkan produk Anda.</p>
      </div>
      
      <CategoryForm categories={categories || []} />
    </div>
  );
}
