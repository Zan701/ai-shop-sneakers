"use client";

import { useState } from "react";
import { ProductImage } from "@prisma/client";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Gunakan gambar pertama sebagai default, atau gambar dummy jika kosong
  const defaultImage = images.length > 0
    ? images[0].imageUrl
    : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop";

  const [activeImage, setActiveImage] = useState(defaultImage);

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto w-full">
      {/* Gambar Utama */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-muted border">
        <img
          src={activeImage}
          alt={productName}
          className="h-full w-full object-cover object-center transition-opacity duration-300"
        />
      </div>

      {/* Thumbnail Gallery (Hanya tampil jika gambar > 1) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.imageUrl)}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${activeImage === img.imageUrl
                  ? "border-primary opacity-100 ring-2 ring-primary ring-offset-1"
                  : "border-transparent opacity-60 hover:opacity-100 bg-muted"
                }`}
            >
              <img
                src={img.imageUrl}
                alt={`${productName} thumbnail`}
                className="h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
