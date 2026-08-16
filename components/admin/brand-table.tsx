"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brand } from "@prisma/client";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteBrand } from "@/src/app/actions/brand";

export function BrandTable({ initialBrands }: { initialBrands: Brand[] }) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const handleOpenDelete = (brand: Brand) => {
    setBrandToDelete(brand);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;
    setLoading(true);
    
    const res = await deleteBrand(brandToDelete.id);
    if (res.success) {
      setIsDeleteDialogOpen(false);
      setBrandToDelete(null);
      router.refresh(); 
    } else {
      alert("Gagal menghapus brand: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold tracking-tight">Daftar Brand</h3>
        <Link href="/admin/brands/create">
          <Button className="rounded-full shadow-md">
            <Plus className="h-4 w-4 mr-2" /> Tambah Brand
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">No</TableHead>
              <TableHead>Gambar</TableHead>
              <TableHead>Nama Brand</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialBrands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Belum ada brand yang ditambahkan.
                </TableCell>
              </TableRow>
            ) : (
              initialBrands.map((b, index) => (
                <TableRow key={b.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {b.image ? (
                      <div className="w-12 h-12 rounded-lg border overflow-hidden bg-white flex items-center justify-center">
                        <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground/80">
                    {b.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{b.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/brands/${b.id}/edit`}>
                        <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                          <Edit2 className="h-4 w-4 mr-1.5" /> Edit
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDelete(b)} className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30">
                        <Trash2 className="h-4 w-4 mr-1.5" /> Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus brand <span className="font-bold text-foreground">"{brandToDelete?.name}"</span>? 
              Aksi ini tidak dapat dibatalkan.
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
