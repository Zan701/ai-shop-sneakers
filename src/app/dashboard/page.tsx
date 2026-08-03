"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, CreditCard, DollarSign, Users, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", total: 3450 },
  { name: "Feb", total: 4210 },
  { name: "Mar", total: 5120 },
  { name: "Apr", total: 4890 },
  { name: "Mei", total: 5800 },
  { name: "Jun", total: 4300 },
  { name: "Jul", total: 6100 },
  { name: "Agu", total: 6800 },
  { name: "Sep", total: 7200 },
  { name: "Okt", total: 6900 },
  { name: "Nov", total: 8100 },
  { name: "Des", total: 9500 },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 md:p-6 pt-4 bg-muted/20 min-h-screen">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Pantau performa penjualan dan aktivitas pelanggan secara real-time.</p>
      </div>
      
      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-2xl border bg-background/50 backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex flex-row items-center justify-between pb-4">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Total Pendapatan</h3>
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tighter">Rp 45.231K</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+20.1% dari bulan lalu</span>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border bg-background/50 backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex flex-row items-center justify-between pb-4">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Pengguna Baru</h3>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tighter">+2,350</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+18% dari bulan lalu</span>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border bg-background/50 backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex flex-row items-center justify-between pb-4">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Penjualan</h3>
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tighter">+12,234</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+19% dari bulan lalu</span>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border bg-background/50 backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex flex-row items-center justify-between pb-4">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Aktif Sekarang</h3>
            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tighter">+573</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
              <Activity className="h-3 w-3" />
              <span>+201 sejak jam terakhir</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        {/* Chart Panel */}
        <div className="col-span-4 rounded-3xl border bg-background/80 backdrop-blur-2xl p-6 shadow-sm flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Grafik Penjualan</h3>
            <p className="text-sm text-muted-foreground">Statistik pendapatan bulanan tahun ini</p>
          </div>
          <div className="flex-1 w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  style={{ fontFamily: 'inherit' }}
                  dy={10}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rp${value}`}
                  style={{ fontFamily: 'inherit' }}
                />
                <Tooltip 
                  cursor={{ fill: "hsl(var(--muted) / 0.5)" }} 
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "1px solid hsl(var(--border))", 
                    backgroundColor: "hsl(var(--background))",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontFamily: 'inherit',
                    fontWeight: 500
                  }} 
                />
                <Bar 
                  dataKey="total" 
                  radius={[6, 6, 0, 0]} 
                  className="fill-primary hover:opacity-80 transition-opacity" 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Sales Panel */}
        <div className="col-span-3 rounded-3xl border bg-background/80 backdrop-blur-2xl p-6 shadow-sm flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Penjualan Terbaru</h3>
            <p className="text-sm text-muted-foreground">Ada 265 transaksi sukses dalam bulan ini.</p>
          </div>
          <div className="flex flex-col gap-6 mt-2">
            {[
              { name: "Budi Santoso", email: "budi.s@gmail.com", amount: "+Rp 1.599.000", time: "2 menit yang lalu" },
              { name: "Siti Rahma", email: "siti.rahma@yahoo.com", amount: "+Rp 899.000", time: "15 menit yang lalu" },
              { name: "Andi Saputra", email: "andi.s@outlook.com", amount: "+Rp 2.199.000", time: "1 jam yang lalu" },
              { name: "Dewi Lestari", email: "dewi.l@gmail.com", amount: "+Rp 1.150.000", time: "3 jam yang lalu" },
              { name: "Reza Oktovian", email: "reza.o@gmail.com", amount: "+Rp 3.499.000", time: "Kemarin" },
            ].map((user, i) => (
              <div key={i} className="flex items-center group cursor-pointer">
                <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary/20 transition-all">
                  <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-0.5">
                  <p className="text-sm font-semibold tracking-tight group-hover:text-primary transition-colors">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.time}</p>
                </div>
                <div className="ml-auto font-bold tracking-tight text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">{user.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
