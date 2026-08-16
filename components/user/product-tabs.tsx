"use client";

import { useState } from "react";

export function ProductTabs({ description }: { description: string }) {
  const [activeTab, setActiveTab] = useState<"description" | "review">("description");

  return (
    <div className="mt-20 w-full">
      <div className="flex border-b border-border gap-6 md:gap-10 overflow-x-auto">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-3 pt-1 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "description" 
              ? "border-primary text-primary font-semibold" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Deskripsi Produk
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`pb-3 pt-1 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "review" 
              ? "border-primary text-primary font-semibold" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Ulasan Pembeli
        </button>
      </div>

      <div className="py-8 min-h-[200px]">
        {activeTab === "description" && (
          <div className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {description}
          </div>
        )}
        
        {activeTab === "review" && (
          <div className="space-y-6">
            <div className="text-center py-16 border border-dashed rounded-3xl bg-muted/10">
              <h4 className="text-lg font-bold mb-2">Belum ada ulasan</h4>
              <p className="text-sm text-muted-foreground">Jadilah yang pertama memberikan ulasan untuk produk ini!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
