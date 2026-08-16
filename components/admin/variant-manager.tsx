"use client";

import { useState } from "react";
import { ProductVariant } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit2, Save, X } from "lucide-react";
import { createVariant, updateVariantStock, deleteVariant } from "@/src/app/actions/variant";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Warna umum yang sering ada di sepatu
const COMMON_COLORS = ["Hitam", "Putih", "Merah", "Biru", "Abu-abu", "Hijau", "Kuning", "Navy", "Coklat"];

export function VariantManager({ productId, initialVariants }: { productId: string, initialVariants: ProductVariant[] }) {
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
  const [loading, setLoading] = useState(false);
  
  // State Form Tambah Varian
  const [color, setColor] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [size, setSize] = useState("");
  const [stock, setStock] = useState("0");
  const [error, setError] = useState("");

  // State Edit Stok inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStockValue, setEditStockValue] = useState("");

  // State Delete Dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // --- Handlers ---

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const finalColor = color === "CUSTOM" ? customColor : color;

    if (!finalColor || !size) {
      setError("Warna dan Ukuran wajib diisi");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("color", finalColor);
    formData.append("size", size);
    formData.append("stock", stock);

    const res = await createVariant(formData);
    if (res.success && res.data) {
      // Tambah ke daftar UI agar tidak perlu reload halaman penuh
      setVariants([...variants, res.data as ProductVariant]);
      // Reset form
      setColor("");
      setCustomColor("");
      setSize("");
      setStock("0");
    } else {
      setError(res.error || "Gagal menambah varian");
    }
    setLoading(false);
  };

  const handleSaveEditStock = async (id: string) => {
    setLoading(true);
    const newStock = parseInt(editStockValue);
    if (isNaN(newStock) || newStock < 0) {
      alert("Stok tidak valid");
      setLoading(false);
      return;
    }

    const res = await updateVariantStock(id, newStock, productId);
    if (res.success && res.data) {
      setVariants(variants.map(v => v.id === id ? { ...v, stock: res.data.stock } : v));
      setEditingId(null);
    } else {
      alert(res.error || "Gagal update stok");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    const res = await deleteVariant(deleteId, productId);
    if (res.success) {
      setVariants(variants.filter(v => v.id !== deleteId));
      setDeleteId(null);
    } else {
      alert(res.error || "Gagal menghapus varian");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: FORM TAMBAH VARIAN */}
      <div className="bg-background/80 backdrop-blur-2xl border rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Tambah Varian Baru</h3>
        <form onSubmit={handleAddVariant} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          
          <div className="space-y-2">
            <Label htmlFor="color">Pilih Warna</Label>
            <select
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="">-- Warna --</option>
              {COMMON_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="CUSTOM">++ Ketik Warna Lain ++</option>
            </select>
          </div>

          {color === "CUSTOM" && (
            <div className="space-y-2">
              <Label htmlFor="customColor">Ketik Warna</Label>
              <Input id="customColor" value={customColor} onChange={e => setCustomColor(e.target.value)} placeholder="Misal: Oreo, Bred" required className="rounded-xl" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="size">Ukuran</Label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="">-- Size --</option>
              {Array.from({ length: 15 }, (_, i) => 35 + i).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stok Awal</Label>
            <Input id="stock" type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} required className="rounded-xl" />
          </div>

          <Button type="submit" disabled={loading} className="rounded-xl shadow-md h-10">
            {loading ? "..." : <><Plus className="w-4 h-4 mr-2"/> Tambah</>}
          </Button>

        </form>
        {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
      </div>

      {/* SECTION 2: TABEL DAFTAR VARIAN */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Warna</TableHead>
              <TableHead>Ukuran</TableHead>
              <TableHead>SKU Barcode</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Produk ini belum memiliki varian. Silakan tambah di atas.
                </TableCell>
              </TableRow>
            ) : (
              variants.map((v) => (
                <TableRow key={v.id} className="group hover:bg-muted/30">
                  <TableCell className="font-semibold">{v.color}</TableCell>
                  <TableCell>{v.size}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{v.sku}</TableCell>
                  <TableCell>
                    {editingId === v.id ? (
                      <div className="flex items-center gap-2 max-w-[150px]">
                        <Input 
                          type="number" 
                          min="0"
                          value={editStockValue} 
                          onChange={(e) => setEditStockValue(e.target.value)} 
                          className="h-8 rounded-lg"
                        />
                        <Button size="icon" variant="ghost" onClick={() => handleSaveEditStock(v.id)} className="text-green-600 hover:text-green-700 h-8 w-8">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="text-red-600 hover:text-red-700 h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`font-bold px-2 py-1 rounded-md text-sm ${v.stock > 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30" : "bg-red-100 text-red-700 dark:bg-red-900/30"}`}>
                          {v.stock}
                        </span>
                        <Button size="icon" variant="ghost" onClick={() => { setEditingId(v.id); setEditStockValue(v.stock.toString()); }} className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setDeleteId(v.id)} className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30">
                      <Trash2 className="h-4 w-4 mr-1.5" /> Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Hapus Varian</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus varian ini? 
              Penghapusan ini tidak bisa dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)} className="rounded-full">Batal</Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading} className="rounded-full shadow-md">
              {loading ? "Memproses..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
