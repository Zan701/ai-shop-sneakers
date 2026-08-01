export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  badgeStyle?: "default" | "destructive" | "secondary" | "outline";
}

export const products: Product[] = [
  {
    id: "1",
    name: "Air Max Pulse",
    description: "Desain sporty dengan bantalan udara maksimal untuk kenyamanan sepanjang hari.",
    price: 2400000,
    originalPrice: 2800000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    badge: "Diskon",
    badgeStyle: "destructive",
  },
  {
    id: "2",
    name: "Classic OG Low",
    description: "Gaya klasik yang tak lekang oleh waktu, cocok untuk outfit kasual harian.",
    price: 1500000,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Trail Blazer X",
    description: "Ketangguhan ekstra untuk aktivitas outdoor dengan desain yang tetap stylish.",
    price: 3200000,
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop",
    badge: "Terbaru",
    badgeStyle: "default",
  },
  {
    id: "4",
    name: "Urban Glide",
    description: "Ringan, fleksibel, dan sangat responsif untuk pergerakan di jalanan kota.",
    price: 1800000,
    originalPrice: 2000000,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Retro Runner 90s",
    description: "Nuansa retro era 90-an yang dihidupkan kembali dengan material modern.",
    price: 2100000,
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Future Court",
    description: "Sepatu basket futuristik dengan grip superior untuk manuver tajam.",
    price: 3500000,
    image: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?q=80&w=800&auto=format&fit=crop",
    badge: "Laris Manis",
    badgeStyle: "secondary",
  },
  {
    id: "7",
    name: "Canvas Minimalist",
    description: "Kesederhanaan desain kanvas yang mudah dipadukan dengan berbagai gaya.",
    price: 850000,
    image: "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "8",
    name: "Boost Energy 2.0",
    description: "Teknologi pengembalian energi terbaik untuk lari jarak jauh.",
    price: 2800000,
    originalPrice: 3100000,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop",
    badge: "Stok Terbatas",
    badgeStyle: "outline",
  },
];
