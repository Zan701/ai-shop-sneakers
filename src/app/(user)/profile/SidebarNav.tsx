"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { User, ShoppingBag, Heart } from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const items = [
    {
      title: "Profil Saya",
      href: "/profile",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      title: "Riwayat Pesanan",
      href: "/profile/orders",
      icon: <ShoppingBag className="mr-2 h-4 w-4" />,
    },
    {
      title: "Favorit",
      href: "/profile/favorites",
      icon: <Heart className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted font-medium text-primary"
              : "hover:bg-transparent hover:underline text-muted-foreground",
            "justify-start rounded-xl"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
