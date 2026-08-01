import Link from "next/link";

interface Category {
  title: string;
  description: string;
  image: string;
  href: string;
}

const defaultCategories: Category[] = [
  {
    title: "Running",
    description: "Performa maksimal untuk pelari",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
    href: "/category/running",
  },
  {
    title: "Basketball",
    description: "Dominasi lapangan dengan gaya",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    href: "/category/basketball",
  },
  {
    title: "Lifestyle",
    description: "Nyaman untuk aktivitas harian",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop",
    href: "/category/lifestyle",
  },
  {
    title: "Skateboarding",
    description: "Daya tahan tinggi dan grip optimal",
    image: "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=600&auto=format&fit=crop",
    href: "/category/skateboarding",
  },
  {
    title: "Training",
    description: "Stabilitas untuk workout intens",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600&auto=format&fit=crop",
    href: "/category/training",
  },
  {
    title: "Classics",
    description: "Desain ikonik sepanjang masa",
    image: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?q=80&w=600&auto=format&fit=crop",
    href: "/category/classics",
  },
];

export function ProductCategoriesGrid() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Kategori Produk</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {defaultCategories.map((category, index) => (
            <Link key={index} href={category.href} className="group flex flex-col items-center text-center">
              <div className="relative mb-5 w-full overflow-hidden rounded-2xl aspect-[4/3] bg-muted shadow-sm">
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-medium text-foreground">{category.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
