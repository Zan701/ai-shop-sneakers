import { ProductTable } from "@/components/admin/product-table";
import { getProducts } from "@/src/app/actions/product";

export const metadata = {
  title: "Kelola Produk | AI Sneakers Admin",
};

export default async function ProductPage() {
  const { data: products = [] } = await getProducts();

  return (
    <div className="flex-1 space-y-4 md:p-6 pt-4 min-h-screen">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Manajemen Produk</h2>
          <p className="text-muted-foreground mt-1">
            Kelola katalog sepatu, tambah koleksi baru, dan atur detail harga serta kategori.
          </p>
        </div>
      </div>
      
      <ProductTable initialProducts={products || []} />
    </div>
  );
}
