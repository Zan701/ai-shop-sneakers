"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, Category, Brand, ProductImage } from "@prisma/client";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteProduct } from "@/src/app/actions/product";

type ProductWithRelations = Product & {
  category: Category;
  brand: Brand;
  images: ProductImage[];
};

export function ProductTable({ initialProducts }: { initialProducts: ProductWithRelations[] }) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductWithRelations | null>(null);

  const handleOpenDelete = (product: ProductWithRelations) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setLoading(true);
    
    const res = await deleteProduct(productToDelete.id);
    if (res.success) {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      router.refresh(); 
    } else {
      alert("Gagal menghapus produk: " + res.error);
    }
    setLoading(false);
  };

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      maximumFractionDigits: 0 
    }).format(price);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold tracking-tight">Daftar Produk</h3>
        <Link href="/admin/product/create">
          <Button className="rounded-full shadow-md">
            <Plus className="h-4 w-4 mr-2" /> Tambah Produk
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">No</TableHead>
              <TableHead>Gambar</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Belum ada produk yang ditambahkan.
                </TableCell>
              </TableRow>
            ) : (
              initialProducts.map((p, index) => {
                const mainImage = p.images.length > 0 ? p.images[0].imageUrl : null;
                return (
                  <TableRow key={p.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      {mainImage ? (
                        <div className="w-12 h-12 rounded-lg border overflow-hidden bg-white flex items-center justify-center">
                          <img src={mainImage} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No Img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground/80">
                      <div>{p.name}</div>
                      <div className="text-xs font-normal text-muted-foreground">SKU: {p.sku}</div>
                    </TableCell>
                    <TableCell>{p.category.name}</TableCell>
                    <TableCell>{p.brand.name}</TableCell>
                    <TableCell className="font-medium text-green-600 dark:text-green-500">
                      {formatRupiah(p.price)}
                    </TableCell>
                    <TableCell>
                      {p.status ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Nonaktif
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/product/${p.id}/variant`}>
                          <Button variant="outline" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30">
                            <Plus className="h-4 w-4 mr-1.5" /> Varian
                          </Button>
                        </Link>
                        <Link href={`/admin/product/${p.id}/edit`}>
                          <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                            <Edit2 className="h-4 w-4 mr-1.5" /> Edit
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleOpenDelete(p)} className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30">
                          <Trash2 className="h-4 w-4 mr-1.5" /> Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus produk <span className="font-bold text-foreground">"{productToDelete?.name}"</span>? 
              Aksi ini tidak dapat dibatalkan. Semua gambar fisik juga akan dihapus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-full">
              Batal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading} className="rounded-full shadow-md">
              {loading ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
