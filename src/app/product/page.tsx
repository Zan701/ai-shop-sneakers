import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProducts } from "@/src/app/actions/product";
import { ProductListClient } from "./product-list-client";

export const dynamic = "force-dynamic";

export default async function ProductPage() {
    const res = await getProducts();
    const products = res.success ? (res.data || []) : [];
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 md:px-8">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Semua Koleksi Sneakers</h1>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Jelajahi koleksi sneakers terbaru dan terbaik dari kami. Dapatkan kenyamanan dan gaya maksimal di setiap langkah.
                    </p>
                </div>

                <ProductListClient initialProducts={products} />
            </div>
        </section>
    );
}
