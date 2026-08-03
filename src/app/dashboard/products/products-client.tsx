"use client";

import { useState } from "react";
import { Product, Category } from "@prisma/client";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogScrollArea } from "@/components/ui/dialog";
import { createProduct, updateProduct, deleteProduct } from "@/src/app/actions/product";

type ProductWithCategory = Product & { category: Category };

export default function ProductsClient({ 
  initialProducts, 
  categories 
}: { 
  initialProducts: ProductWithCategory[], 
  categories: Category[] 
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State for form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    size: "",
    categoryId: "",
    image: ""
  });

  const handleOpenDialog = (product?: ProductWithCategory) => {
    setError("");
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        size: product.size ? product.size.toString() : "",
        categoryId: product.categoryId,
        image: product.image || ""
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        size: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        image: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (product: ProductWithCategory) => {
    setEditingId(product.id);
    setFormData({ ...formData, name: product.name });
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("size", formData.size);
    data.append("categoryId", formData.categoryId);
    data.append("image", formData.image);

    let res;
    if (editingId) {
      res = await updateProduct(editingId, data);
    } else {
      res = await createProduct(data);
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
    
    const res = await deleteProduct(editingId);
    if (res.success) {
      setIsDeleteDialogOpen(false);
    } else {
      alert("Gagal menghapus produk: " + res.error);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold tracking-tight">Inventaris Toko</h3>
        <Button onClick={() => handleOpenDialog()} className="rounded-full shadow-md" disabled={categories.length === 0}>
          <Plus className="h-4 w-4 mr-2" /> Tambah Produk
        </Button>
      </div>

      {categories.length === 0 && (
        <div className="bg-orange-100 text-orange-800 p-4 rounded-xl text-sm mb-4">
          Anda belum memiliki Kategori! Silakan tambah Kategori terlebih dahulu sebelum menambah Produk.
        </div>
      )}

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[60px]">Gambar</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Belum ada produk yang ditambahkan.
                </TableCell>
              </TableRow>
            ) : (
              initialProducts.map((product) => (
                <TableRow key={product.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell>
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover border" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center border">
                        <ImageIcon className="h-5 w-5 text-muted-foreground opacity-50" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground/80">{product.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {product.category?.name}
                    </span>
                  </TableCell>
                  <TableCell>Rp {product.price.toLocaleString("id-ID")}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(product)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30">
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
        <DialogContent className="sm:max-w-[500px] rounded-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
              <DialogDescription>
                Lengkapi detail informasi produk sneaker di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Produk</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Air Jordan 1 Retro" className="rounded-xl" autoFocus required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Harga (Rp)</Label>
                  <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="1500000" className="rounded-xl" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stok</Label>
                  <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="50" className="rounded-xl" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="size">Ukuran (Opsional)</Label>
                  <Input id="size" name="size" type="number" value={formData.size} onChange={handleChange} placeholder="42" className="rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoryId">Kategori</Label>
                  <select 
                    id="categoryId" 
                    name="categoryId" 
                    value={formData.categoryId} 
                    onChange={handleChange}
                    className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">URL Gambar (Opsional)</Label>
                <Input id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" className="rounded-xl" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Penjelasan detail tentang produk..."
                />
              </div>

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full">
                Batal
              </Button>
              <Button type="submit" disabled={loading} className="rounded-full shadow-md">
                {loading ? "Menyimpan..." : "Simpan Produk"}
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
              Apakah Anda yakin ingin menghapus <span className="font-bold text-foreground">"{formData.name}"</span>? 
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
