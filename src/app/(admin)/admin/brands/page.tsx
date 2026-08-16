import { BrandTable } from "@/components/admin/brand-table";
import { getBrands } from "@/src/app/actions/brand";

export const metadata = {
  title: "Kelola Brand | AI Sneakers Admin",
};

export default async function BrandsPage() {
  const { data: brands = [] } = await getBrands();

  return (
    <div className="flex-1 space-y-4 md:p-6 pt-4 min-h-screen">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Manajemen Brand</h2>
          <p className="text-muted-foreground mt-1">
            Kelola daftar brand, tambah brand baru, dan atur status brand untuk toko Anda.
          </p>
        </div>
      </div>
      
      <BrandTable initialBrands={brands || []} />
    </div>
  );
}
