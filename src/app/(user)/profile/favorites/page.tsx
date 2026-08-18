import { auth } from "@/src/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch wishlist
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: { images: true }
          }
        }
      }
    }
  });

  const items = wishlist?.items || [];

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Produk Favorit (Wishlist)</h2>
        
        {items.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">Belum Ada Favorit</h3>
            <p className="text-muted-foreground mb-6">Anda belum menambahkan produk apapun ke daftar favorit.</p>
            <Link href="/" className={cn(buttonVariants(), "rounded-xl h-11 px-8")}>
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="border rounded-2xl p-4 flex gap-4 items-center">
                 <div className="w-20 h-20 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0].imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                    <p className="text-sm font-bold text-primary mt-1">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.product.price)}
                    </p>
                    <Link href={"/product/" + item.product.slug} className="text-xs text-muted-foreground hover:text-primary mt-2 flex items-center gap-1 group">
                      Lihat Produk <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

