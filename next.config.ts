import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Menonaktifkan SEMUA indikator dev Next.js secara paksa
  devIndicators: false as any,
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
};

export default nextConfig;
