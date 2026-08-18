import { SidebarNav } from "./SidebarNav";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Akun Saya</h1>
        <p className="text-muted-foreground">Kelola pengaturan profil, pesanan, dan preferensi Anda.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4">
          <div className="bg-card border rounded-3xl p-6 shadow-sm sticky top-24">
            <SidebarNav />
          </div>
        </aside>
        
        {/* Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
