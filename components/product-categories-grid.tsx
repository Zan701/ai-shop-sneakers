import Link from "next/link";
import { getCategories } from "@/src/app/actions/category";

export async function ProductCategoriesGrid() {
  const res = await getCategories();
  const categories = res.success ? (res.data || []) : [];
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Kategori Produk</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug || category.id}`} className="group flex flex-col items-center text-center">
              <div className="relative mb-5 w-full overflow-hidden rounded-2xl aspect-[4/3] bg-muted shadow-sm">
                <img
                  src={category.image || "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop"}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-medium text-foreground">{category.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
