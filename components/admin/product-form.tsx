"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, Category, Brand, ProductImage } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/src/app/actions/product";
import { Trash2 } from "lucide-react";

type ProductWithImages = Product & {
  images: ProductImage[];
};

interface ProductFormProps {
  initialData?: ProductWithImages | null;
  categories: Category[];
  brands: Brand[];
}

export function ProductForm({ initialData, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [brandId, setBrandId] = useState(initialData?.brandId || "");
  const [price, setPrice] = useState(initialData?.price.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(initialData?.discountPrice?.toString() || "");
  const [weight, setWeight] = useState(initialData?.weight.toString() || "1000"); // Default 1kg
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState(initialData?.status ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);

  // Image Handling
  const [existingImages, setExistingImages] = useState<ProductImage[]>(initialData?.images || []);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const markExistingImageForDeletion = (imageId: string) => {
    setImagesToDelete((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!categoryId) {
      setError("Pilih kategori produk!");
      setLoading(false);
      return;
    }
    if (!brandId) {
      setError("Pilih brand produk!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("categoryId", categoryId);
    formData.append("brandId", brandId);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("weight", weight);
    formData.append("shortDescription", shortDescription);
    formData.append("description", description);
    formData.append("status", String(status));
    formData.append("isFeatured", String(isFeatured));

    if (initialData?.id) {
      // Edit Mode
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
      newImages.forEach((file) => {
        formData.append("newImages", file);
      });
      const res = await updateProduct(initialData.id, formData);
      if (res.success) {
        router.push("/admin/product");
        router.refresh();
      } else {
        setError(res.error || "Terjadi kesalahan saat mengedit");
      }
    } else {
      // Create Mode
      newImages.forEach((file) => {
        formData.append("images", file);
      });
      const res = await createProduct(formData);
      if (res.success) {
        router.push("/admin/product");
        router.refresh();
      } else {
        setError(res.error || "Terjadi kesalahan saat menyimpan");
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-background/80 backdrop-blur-2xl border rounded-3xl p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ROW 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk <span className="text-red-500">*</span></Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Misal: Nike Air Max 2024" required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (Opsional)</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Auto-generate jika kosong" className="rounded-xl" />
          </div>
        </div>

        {/* ROW 2: Relations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Kategori <span className="text-red-500">*</span></Label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandId">Brand <span className="text-red-500">*</span></Label>
            <select
              id="brandId"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              required
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">-- Pilih Brand --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ROW 3: Pricing & Weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Harga Normal (Rp) <span className="text-red-500">*</span></Label>
            <Input id="price" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1500000" required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountPrice">Harga Diskon (Opsional)</Label>
            <Input id="discountPrice" type="number" min="0" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="1200000" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Berat (Gram) <span className="text-red-500">*</span></Label>
            <Input id="weight" type="number" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="1000" required className="rounded-xl" />
          </div>
        </div>

        {/* ROW 4: Descriptions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Deskripsi Singkat (Opsional)</Label>
            <Input id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Kalimat promosi singkat..." className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Lengkap <span className="text-red-500">*</span></Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detail spesifikasi lengkap produk..." rows={6} required className="rounded-xl" />
          </div>
        </div>

        {/* ROW 5: Images */}
        <div className="space-y-4 border rounded-2xl p-6 bg-muted/20">
          <Label>Gambar Produk (Bisa Pilih Banyak)</Label>
          
          <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="rounded-xl cursor-pointer bg-white" />
          
          {/* Preview Existing Images (Edit Mode) */}
          {existingImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Gambar Tersimpan:</p>
              <div className="flex flex-wrap gap-4">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative group w-24 h-24 rounded-xl border overflow-hidden bg-white">
                    <img src={img.imageUrl} alt="Produk" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => markExistingImageForDeletion(img.id)} className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white transition-all">
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview New Images */}
          {newImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Gambar Baru Akan Diupload:</p>
              <div className="flex flex-wrap gap-4">
                {newImages.map((file, idx) => (
                  <div key={idx} className="relative group w-24 h-24 rounded-xl border overflow-hidden bg-white">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewImage(idx)} className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white transition-all">
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ROW 6: Toggles */}
        <div className="flex gap-8 border rounded-2xl p-6 bg-muted/20">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="status" checked={status} onChange={(e) => setStatus(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-primary cursor-pointer" />
            <Label htmlFor="status" className="cursor-pointer font-medium text-base">Produk Aktif (Tampil di Toko)</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-primary cursor-pointer" />
            <Label htmlFor="isFeatured" className="cursor-pointer font-medium text-base">Produk Unggulan (Featured)</Label>
          </div>
        </div>
        
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-200">{error}</div>}
        
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/product")} className="rounded-full px-8">
            Batal
          </Button>
          <Button type="submit" disabled={loading} className="rounded-full shadow-md px-8">
            {loading ? "Menyimpan Data..." : (initialData ? "Simpan Perubahan" : "Tambah Produk Baru")}
          </Button>
        </div>
      </form>
    </div>
  );
}
