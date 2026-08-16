"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderTableProps {
  orders: any[]; // Ideally typed with Prisma schema types
}

export function OrderTable({ orders }: OrderTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter((order) => 
    order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500 text-white";
      case "PAID": return "bg-blue-500 text-white";
      case "SHIPPED": return "bg-indigo-500 text-white";
      case "DELIVERED": return "bg-green-500 text-white";
      case "CANCELLED": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS": return "bg-green-500 text-white";
      case "PENDING": return "bg-yellow-500 text-white";
      case "FAILED": return "bg-red-500 text-white";
      case "REFUNDED": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const renderProductSummary = (items: any[]) => {
    if (!items || items.length === 0) return "-";
    const firstItem = items[0].variant?.product?.name || "Unknown Product";
    if (items.length === 1) return firstItem;
    return `${firstItem} (+${items.length - 1} lainnya)`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari Invoice / Nama..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Invoice & Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Pembayaran</TableHead>
              <TableHead>Status Pesanan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.invoiceNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{order.user.name || "User"}</div>
                    <div className="text-xs text-muted-foreground">{order.user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium line-clamp-2" title={order.items?.map((i: any) => i.variant?.product?.name).join(', ')}>
                      {renderProductSummary(order.items)}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.grandTotal)}
                  </TableCell>
                  <TableCell>
                    {order.payment ? (
                      <Badge className={getPaymentStatusColor(order.payment.status)}>
                        {order.payment.status}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getOrderStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      <Eye className="mr-2 h-4 w-4" /> Detail
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Tidak ada data pesanan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
