"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrand, updateBrand } from "@/src/app/actions/brand";

interface BrandFormProps {
  initialData?: Brand | null;
}

export function BrandForm({ initialData }: BrandFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [brandName, setBrandName] = useState(initialData?.name || "");
  const [brandSlug, setBrandSlug] = useState(initialData?.slug || "");
  const [brandDescription, setBrandDescription] = useState(initialData?.description || "");
  const [brandImageFile, setBrandImageFile] = useState<File | null>(null);
  const [brandImageUrl, setBrandImageUrl] = useState(initialData?.image || "");
  const [brandIsActive, setBrandIsActive] = useState(initialData?.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", brandName);
    formData.append("slug", brandSlug);
    formData.append("description", brandDescription);
    if (brandImageFile) {
      formData.append("image", brandImageFile);
    }
    if (brandImageUrl) {
      formData.append("existingImageUrl", brandImageUrl);
    }
    formData.append("isActive", String(brandIsActive));

    let res;
    if (initialData?.id) {
      res = await updateBrand(initialData.id, formData);
    } else {
      res = await createBrand(formData);
    }

    if (res.success) {
      router.push("/admin/brands");
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
          <Label htmlFor="name">Nama Brand</Label>
          <Input
            id="name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Misal: Nike"
            className="rounded-xl"
            required
            autoFocus
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug (Opsional)</Label>
          <Input
            id="slug"
            value={brandSlug}
            onChange={(e) => setBrandSlug(e.target.value)}
            placeholder="Misal: nike"
            className="rounded-xl"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Deskripsi (Opsional)</Label>
          <Input
            id="description"
            value={brandDescription}
            onChange={(e) => setBrandDescription(e.target.value)}
            placeholder="Deskripsi singkat brand ini..."
            className="rounded-xl"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="image">Logo / Gambar Brand (Opsional)</Label>
          {brandImageUrl && (
            <div className="mb-2 text-xs text-muted-foreground">
              Gambar saat ini: <a href={brandImageUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Lihat Gambar</a>
            </div>
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setBrandImageFile(e.target.files[0]);
              } else {
                setBrandImageFile(null);
              }
            }}
            className="rounded-xl cursor-pointer file:cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="isActive"
            checked={brandIsActive}
            onChange={(e) => setBrandIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <Label htmlFor="isActive" className="cursor-pointer font-medium">Brand Aktif</Label>
        </div>
        
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/brands")} className="rounded-full flex-1">
            Batal
          </Button>
          <Button type="submit" disabled={loading} className="rounded-full shadow-md flex-1">
            {loading ? "Menyimpan..." : (initialData ? "Simpan Perubahan" : "Simpan Brand")}
          </Button>
        </div>
      </form>
    </div>
  );
}
