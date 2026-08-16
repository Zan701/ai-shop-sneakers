import { BrandForm } from "@/components/admin/brand-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Brand | AI Sneakers Admin",
};

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: brandId } = await params;
  
  // Ambil data brand yang mau diedit
  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
  });

  if (!brand) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-6 md:p-6 pt-4 bg-muted/20 min-h-screen">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Edit Brand</h2>
        <p className="text-muted-foreground text-sm">Perbarui informasi untuk brand "{brand.name}".</p>
      </div>
      
      <BrandForm initialData={brand} />
    </div>
  );
}
