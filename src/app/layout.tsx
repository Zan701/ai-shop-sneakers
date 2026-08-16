import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { NextAuthProvider } from "@/components/session-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sneakers",
  description: "Toko sepatu pintar dengan AI assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <NextAuthProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
