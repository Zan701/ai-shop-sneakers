import { BrandForm } from "@/components/admin/brand-form";

export const metadata = {
  title: "Tambah Brand | AI Sneakers Admin",
};

export default function CreateBrandPage() {
  return (
    <div className="flex-1 space-y-6 md:p-6 pt-4 bg-muted/20 min-h-screen">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Tambah Brand Baru</h2>
        <p className="text-muted-foreground text-sm">Tambahkan brand baru ke dalam sistem untuk digunakan pada produk-produk Anda.</p>
      </div>
      
      <BrandForm />
    </div>
  );
}
