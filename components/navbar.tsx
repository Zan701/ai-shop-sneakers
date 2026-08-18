"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { getCart } from "@/src/app/actions/cart";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (isLoggedIn) {
        const res = await getCart();
        if (res.success && res.data) {
          const count = res.data.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
          setCartCount(count);
        }
      }
    };

    fetchCartCount();

    // Listen for custom event when cart changes
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, [isLoggedIn, pathname]);

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left Side (Logo & Mobile Menu) */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl md:text-2xl tracking-tighter">
            Sneakers
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm font-medium">
          <Link href="/" className={cn("transition-colors hover:text-foreground", pathname === "/" ? "text-foreground font-semibold" : "text-muted-foreground")}>
            Home
          </Link>
          <Link href="/product" className={cn("transition-colors hover:text-foreground", pathname === "/product" ? "text-foreground font-semibold" : "text-muted-foreground")}>
            Product
          </Link>
          <Link href="/about" className={cn("transition-colors hover:text-foreground", pathname === "/about" ? "text-foreground font-semibold" : "text-muted-foreground")}>
            About
          </Link>
          <Link href="/faq" className={cn("transition-colors hover:text-foreground", pathname === "/faq" ? "text-foreground font-semibold" : "text-muted-foreground")}>
            FAQ
          </Link>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full overflow-hidden outline-none")}
                >
                  <Avatar className="h-full w-full">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {(session?.user?.name || session?.user?.email || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Account Menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive focus:text-destructive">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/cart" className={cn(buttonVariants({ variant: "outline", size: "icon" }), "relative rounded-full")}>
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">Cart</span>
                {/* Badge Indicator */}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
                Login
              </Link>
              <Link href="/register" className={buttonVariants()}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
