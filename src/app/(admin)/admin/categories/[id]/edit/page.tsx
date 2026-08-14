import { CategoryForm } from "@/components/admin/category-form";
import { getCategories } from "@/src/app/actions/category";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Kategori | AI Sneakers Admin",
};

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const categoryId = params.id;
  
  // Ambil data kategori yang mau diedit
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    notFound();
  }

  // Ambil semua kategori untuk pilihan parentId
  const { data: allCategories = [] } = await getCategories();

  return (
    <div className="flex-1 space-y-6 md:p-6 pt-4 bg-muted/20 min-h-screen">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Edit Kategori</h2>
        <p className="text-muted-foreground text-sm">Perbarui informasi untuk kategori "{category.name}".</p>
      </div>
      
      <CategoryForm initialData={category} categories={allCategories || []} />
    </div>
  );
}
