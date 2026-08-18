import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Home } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { auth } from "@/src/auth";
import { notFound, redirect } from "next/navigation";

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { 
      id: id,
      userId: session.user.id
    },
    include: {
      payment: true,
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <div className="bg-card border rounded-3xl p-8 md:p-12 shadow-sm">
        <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Pesanan Berhasil Dibuat!</h1>
        <p className="text-muted-foreground mb-8">
          Terima kasih telah berbelanja di Sneakers. Pesanan Anda sedang menunggu pembayaran.
        </p>

        <div className="bg-muted/30 border rounded-2xl p-6 mb-8 text-left space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <span className="text-muted-foreground">Nomor Invoice</span>
            <span className="font-semibold text-primary">{order.invoiceNumber}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-4">
            <span className="text-muted-foreground">Metode Pembayaran</span>
            <span className="font-medium">{order.payment?.method || "-"}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-semibold">Total Tagihan</span>
            <span className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.grandTotal)}
            </span>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-10 text-left">
          <h3 className="font-semibold text-lg mb-2">Instruksi Pembayaran (Simulasi)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Karena ini adalah versi simulasi/demo, Anda tidak perlu melakukan transfer sungguhan. Pesanan Anda sudah terekam di sistem. Anda bisa mengecek status pesanan ini melalui halaman Admin.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "h-12 px-8 rounded-xl flex items-center")}>
            <Home className="mr-2 h-4 w-4" /> Kembali ke Beranda
          </Link>
          <Link href="/profile" className={cn(buttonVariants(), "h-12 px-8 rounded-xl flex items-center")}>
            Lihat Pesanan <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
