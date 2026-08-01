import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductCategories() {
  return (
    <section className="py-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1 - Left Column */}
          <div className="relative group overflow-hidden rounded-[32px] bg-muted h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop"
              alt="Mens Sneakers"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Soft white gradient at top for text readability */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/60 to-transparent"></div>
            
            <div className="absolute top-8 left-8 z-10">
              <h3 className="text-3xl font-semibold text-black">Gaya Effortless</h3>
              <p className="text-black/80 mt-2 text-lg">Diskon hingga 50%</p>
            </div>
            
            <div className="absolute bottom-6 right-6 z-10">
              <Button size="icon" className="h-12 w-12 rounded-full bg-black text-white hover:bg-black/80">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Card 2 - Right Column */}
          <div className="relative group overflow-hidden rounded-[32px] bg-muted h-[500px] lg:col-span-2">
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"
              alt="Womens Sneakers"
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"/>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/90 via-white/40 to-transparent"></div>
            
            <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center z-10 text-center px-4">
              <h3 className="text-3xl font-semibold text-black">Esensial Sehari-hari</h3>
              <p className="text-black/80 mt-2 mb-6 text-lg">Koleksi terbaru untuk kenyamanan optimal</p>
              <Button size="lg" className="rounded-full px-8 bg-black text-white hover:bg-black/80 font-medium">
                Lihat Selengkapnya
              </Button>
            </div>

            <div className="absolute bottom-6 right-6 z-10">
              <Button size="icon" className="h-12 w-12 rounded-full bg-black text-white hover:bg-black/80">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
