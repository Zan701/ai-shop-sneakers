import { createOllama } from 'ollama-ai-provider';
import { streamText } from 'ai';
import { prisma } from "@/lib/prisma";

// Inisialisasi provider Ollama yang berjalan di laptop kamu
const ollama = createOllama({
  baseURL: 'http://127.0.0.1:11434/api',
});

// Waktu maksimal eksekusi (karena AI butuh waktu berpikir)
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // 1. Ambil data produk dari database menggunakan Prisma
    const products = await prisma.product.findMany({
      where: { status: true }, // Hanya ambil sepatu yang statusnya aktif
      include: {
        brand: true, // Sertakan juga nama brand/merk-nya
      },
    });

    // 2. Format data sepatu menjadi daftar teks yang gampang dibaca oleh AI
    const katalogSepatu = products
      .map((p) => {
        const hargaTeks = p.discountPrice 
          ? `SEDANG DISKON menjadi Rp${p.discountPrice.toLocaleString("id-ID")} (Harga Normal: Rp${p.price.toLocaleString("id-ID")})` 
          : `Harga Rp${p.price.toLocaleString("id-ID")}`;
        return `- ${p.name} (Merk: ${p.brand.name}): ${hargaTeks}. ${p.shortDescription || ""}`;
      })
      .join("\n");

    // Menangkap riwayat chat yang dikirim dari tampilan web (frontend)
    const { messages } = await req.json();

    // Memanggil model Llama dan meminta balasan (stream)
    const result = await streamText({
      // @ts-expect-error Mismatch tipe data dari library, secara fungsi aman
      model: ollama('llama3.2:1b'), // Pastikan nama model sesuai yang kamu download
      messages,
      system: `Kamu adalah AI Assistant yang ramah untuk toko sepatu bernama AI Sneakers. 
      Tugasmu adalah membantu pelanggan berbelanja.

      Berikut adalah DAFTAR KATALOG SEPATU yang saat ini tersedia di toko kita:
      ${katalogSepatu}

      INFORMASI PENTING TENTANG TOKO:
      - Cara Belanja/Order: Pelanggan bisa masuk ke menu 'Product', klik sepatu yang disuka, pilih ukuran, tekan tombol "Add to Cart", lalu masuk ke menu "Cart" (Keranjang) di pojok kanan atas untuk Checkout dan bayar.
      - Pembayaran & Pengiriman: Pembayaran akan dicek otomatis. Pengiriman diproses 1-2 hari kerja.

      Gunakan bahasa Indonesia yang santai, gaul (menggunakan kata 'aku' dan 'kamu' atau 'bro'), tapi tetap sopan.
      Jika pelanggan bertanya harga sepatu, pastikan kamu memberitahu jika ada DISKON sesuai data di katalog.
      Jelaskan cara order jika mereka bertanya. Jangan pernah memberikan informasi palsu atau mengarang sepatu yang tidak ada di katalog.`,
    });

    // Kembalikan hasilnya ke frontend perlahan-lahan (efek mengetik)
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("AI Chat Error:", error);
    return new Response("Terjadi kesalahan pada server AI", { status: 500 });
  }
}
