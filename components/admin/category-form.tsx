"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, updateCategory } from "@/src/app/actions/category";

interface CategoryFormProps {
  initialData?: Category | null;
  categories: Category[];
}

export function CategoryForm({ initialData, categories }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categoryName, setCategoryName] = useState(initialData?.name || "");
  const [categorySlug, setCategorySlug] = useState(initialData?.slug || "");
  const [categoryDescription, setCategoryDescription] = useState(initialData?.description || "");
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryImageUrl, setCategoryImageUrl] = useState(initialData?.image || "");
  const [categoryIsActive, setCategoryIsActive] = useState(initialData?.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
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
    formData.append("isActive", String(categoryIsActive));

    let res;
    if (initialData?.id) {
      res = await updateCategory(initialData.id, formData);
    } else {
      res = await createCategory(formData);
    }

    if (res.success) {
      router.push("/admin/categories");
      router.refresh();
    } else {
      setError(res.error || "Terjadi kesalahan");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-background/80 backdrop-blur-2xl border rounded-3xl p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Nama Kategori</Label>
          <Input
            id="name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Misal: Sneakers Pria"
            className="rounded-xl"
            required
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
        
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")} className="rounded-full flex-1">
            Batal
          </Button>
          <Button type="submit" disabled={loading} className="rounded-full shadow-md flex-1">
            {loading ? "Menyimpan..." : (initialData ? "Simpan Perubahan" : "Simpan Kategori")}
          </Button>
        </div>
      </form>
    </div>
  );
}
