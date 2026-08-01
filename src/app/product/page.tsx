import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { products } from "../../data/products";

export default function ProductPage() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 md:px-8">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Semua Koleksi Sneakers</h1>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Jelajahi koleksi sneakers terbaru dan terbaik dari kami. Dapatkan kenyamanan dan gaya maksimal di setiap langkah.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <div key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                            <div className="relative aspect-square w-full overflow-hidden bg-muted">
                                {product.badge && (
                                    <span
                                        className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.badgeStyle === "destructive" ? "bg-destructive text-destructive-foreground" :
                                                product.badgeStyle === "secondary" ? "bg-secondary text-secondary-foreground" :
                                                    product.badgeStyle === "outline" ? "border border-input bg-background text-foreground" :
                                                        "bg-primary text-primary-foreground"
                                            }`}
                                    >
                                        {product.badge}
                                    </span>
                                )}
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
                                    {product.description}
                                </p>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="font-bold text-lg">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-xs text-muted-foreground line-through">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.originalPrice)}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-5">
                                    <Link href={`/product/${product.id}`} className={cn(buttonVariants(), "w-full font-semibold rounded-lg h-10")}>
                                        Show Detail
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
