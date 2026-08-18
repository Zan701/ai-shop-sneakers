"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateProfile, updateAddress } from "@/src/app/actions/profile";

export function ProfileForm({ user, profile, address }: { user: any, profile: any, address: any }) {
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmittingProfile(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsSubmittingProfile(false);
  }

  async function handleAddressSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmittingAddress(true);
    const formData = new FormData(e.currentTarget);
    if (address?.id) {
      formData.append("addressId", address.id);
    }
    const res = await updateAddress(formData);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsSubmittingAddress(false);
  }

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <section className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Informasi Pribadi</h2>
        <form key={profile?.updatedAt ? new Date(profile.updatedAt).getTime() : 'profile'} onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" defaultValue={user?.name || ""} required className="rounded-xl h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Tidak bisa diubah)</Label>
            <Input id="email" type="email" defaultValue={user?.email || ""} disabled className="rounded-xl h-11 bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input id="phone" name="phone" defaultValue={profile?.phone || ""} placeholder="Contoh: 08123456789" className="rounded-xl h-11" />
          </div>
          <div className="pt-4">
            <Button type="submit" disabled={isSubmittingProfile} className="rounded-xl h-11 px-8">
              {isSubmittingProfile ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </section>

      {/* Address Section */}
      <section className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Alamat Pengiriman Default</h2>
        <form key={address?.updatedAt ? new Date(address.updatedAt).getTime() : 'address'} onSubmit={handleAddressSubmit} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Nama Penerima</Label>
              <Input id="recipientName" name="recipientName" defaultValue={address?.recipientName || ""} required className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressPhone">Nomor Telepon Penerima</Label>
              <Input id="addressPhone" name="phone" defaultValue={address?.phone || ""} required className="rounded-xl h-11" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">Provinsi</Label>
              <Input id="province" name="province" defaultValue={address?.province || ""} required className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Kota/Kabupaten</Label>
              <Input id="city" name="city" defaultValue={address?.city || ""} required className="rounded-xl h-11" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district">Kecamatan</Label>
              <Input id="district" name="district" defaultValue={address?.district || ""} required className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Kode Pos</Label>
              <Input id="postalCode" name="postalCode" defaultValue={address?.postalCode || ""} required className="rounded-xl h-11" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap</Label>
            <textarea 
              id="address" 
              name="address" 
              defaultValue={address?.address || ""} 
              required 
              className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isSubmittingAddress} className="rounded-xl h-11 px-8">
              {isSubmittingAddress ? "Menyimpan..." : "Simpan Alamat"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
