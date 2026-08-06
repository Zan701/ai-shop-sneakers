"use client";

import { useState } from "react";
import { Category } from "@prisma/client";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createCategory, updateCategory, deleteCategory } from "@/src/app/actions/category";

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State for form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryImageUrl, setCategoryImageUrl] = useState("");
  const [categoryIsActive, setCategoryIsActive] = useState(true);
  const [categoryParentId, setCategoryParentId] = useState("");

  const handleOpenDialog = (category?: Category) => {
    setError("");
    if (category) {
      setEditingId(category.id);
      setCategoryName(category.name);
      setCategorySlug(category.slug || "");
      setCategoryDescription(category.description || "");
      setCategoryImageUrl(category.image || "");
      setCategoryImageFile(null);
      setCategoryIsActive(category.isActive ?? true);
      setCategoryParentId(category.parentId || "");
    } else {
      setEditingId(null);
      setCategoryName("");
      setCategorySlug("");
      setCategoryDescription("");
      setCategoryImageUrl("");
      setCategoryImageFile(null);
      setCategoryIsActive(true);
      setCategoryParentId("");
    }
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setEditingId(category.id);
    setCategoryName(category.name);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("slug", categorySlug);
    formData.append("description", categoryDescription);
    if (categoryImageFile) {
      formData.append("image", categoryImageFile);
    }
    if (categoryImageUrl) {
      formData.append("existingImageUrl", categoryImageUrl);
    }
    formData.append("isActive", String(categoryIsActive ?? true));
    formData.append("parentId", categoryParentId);

    let res;
    if (editingId) {
      res = await updateCategory(editingId, formData);
    } else {
      res = await createCategory(formData);
    }

    if (res.success) {
      setIsDialogOpen(false);
    } else {
      setError(res.error || "Terjadi kesalahan");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!editingId) return;
    setLoading(true);
    
    const res = await deleteCategory(editingId);
    if (res.success) {
      setIsDeleteDialogOpen(false);
    } else {
      alert("Gagal menghapus kategori: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold tracking-tight">Daftar Kategori</h3>
        <Button onClick={() => handleOpenDialog()} className="rounded-full shadow-md">
          <Plus className="h-4 w-4 mr-2" /> Tambah Kategori
        </Button>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">No</TableHead>
              <TableHead>Nama Kategori</TableHead>
              <TableHead>Total Produk</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Belum ada kategori yang ditambahkan.
                </TableCell>
              </TableRow>
            ) : (
              initialCategories.map((cat, index) => (
                <TableRow key={cat.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-semibold text-foreground/80">
                    {cat.name}
                    {!cat.isActive && (
                      <span className="ml-2 text-xs font-normal bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">
                        Nonaktif
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(cat)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(cat)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Kategori" : "Tambah Kategori Baru"}</DialogTitle>
              <DialogDescription>
                Masukkan nama kategori untuk mengelompokkan produk Anda.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Kategori</Label>
                <Input
                  id="name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Misal: Sneakers Pria"
                  className="rounded-xl"
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug (Opsional)</Label>
                <Input
                  id="slug"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  placeholder="Misal: sneakers-pria"
                  className="rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Input
                  id="description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Deskripsi singkat kategori ini..."
                  className="rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Gambar Kategori (Opsional)</Label>
                {categoryImageUrl && (
                  <div className="mb-2 text-xs text-muted-foreground">
                    Gambar saat ini: <a href={categoryImageUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Lihat Gambar</a>
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCategoryImageFile(e.target.files[0]);
                    } else {
                      setCategoryImageFile(null);
                    }
                  }}
                  className="rounded-xl cursor-pointer file:cursor-pointer"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parentId">Kategori Induk (Opsional)</Label>
                <select
                  id="parentId"
                  value={categoryParentId}
                  onChange={(e) => setCategoryParentId(e.target.value)}
                  className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">-- Tidak ada (Kategori Utama) --</option>
                  {initialCategories
                    .filter(c => c.id !== editingId) // Jangan izinkan pilih diri sendiri
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={categoryIsActive}
                  onChange={(e) => setCategoryIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <Label htmlFor="isActive" className="cursor-pointer font-medium">Kategori Aktif</Label>
              </div>
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full">
                Batal
              </Button>
              <Button type="submit" disabled={loading} className="rounded-full shadow-md">
                {loading ? "Menyimpan..." : "Simpan Kategori"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kategori <span className="font-bold text-foreground">"{categoryName}"</span>? 
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
