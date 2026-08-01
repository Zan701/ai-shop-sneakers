import Link from "next/link";
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4 md:hidden">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            AI<span className="text-muted-foreground">Shop</span>
          </Link>
        </div>

        {/* Desktop Logo & Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            AI<span className="text-muted-foreground">Shop</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <Link href="/categories" className="hover:text-foreground transition-colors">
              Categories
            </Link>
            <Link href="/brands" className="hover:text-foreground transition-colors">
              Brands
            </Link>
            <Link href="/sale" className="hover:text-foreground transition-colors text-red-500">
              Sale
            </Link>
            <Link href="/ai-assistant" className="hover:text-foreground transition-colors flex items-center gap-1">
              AI Assistant ✨
            </Link>
          </nav>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
          <Button variant="outline" size="icon" className="relative rounded-full">
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Cart</span>
            {/* Badge Indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              0
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
