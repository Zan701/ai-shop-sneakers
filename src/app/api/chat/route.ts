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

    // Memanggil model Qwen dan meminta balasan (stream)
    const result = await streamText({
      // @ts-expect-error Mismatch tipe data dari library, secara fungsi aman
      model: ollama('qwen2.5:1.5b'), // Menggunakan Qwen 2.5 1.5B
      messages,
      system: `Kamu adalah "Bro AI", asisten virtual gaul untuk toko SEPATU ONLINE bernama "AI Sneakers". 
      Toko ini 100% ONLINE berbasis website, TIDAK ADA TOKO FISIK/OFFLINE. 
      Jika pelanggan ingin melihat produk, arahkan mereka untuk klik menu "Product" di navigasi website. JANGAN PERNAH menyuruh pelanggan datang ke toko fisik.

      Gaya Bahasa:
      - Wajib pakai bahasa pertemanan Indonesia yang santai (pakai kata: aku, kamu, bro, banget, dong, sih). 
      - DILARANG KERAS bilang "Saya" atau "Anda" karena terdengar kaku seperti customer service bank.
      - Pakai 1 atau 2 emoji saja sesekali biar asik.

      Katalog Sepatu Online Kita (Hanya jual yang ada di daftar ini):
      ${katalogSepatu}

      Aturan Berjualan:
      1. Jawab HANYA menggunakan Bahasa Indonesia. Haram pakai bahasa Inggris.
      2. Jika pembeli menyapa, balas dengan santai, misal: "Halo bro! Ada yang bisa aku bantu? Lagi nyari sepatu apa nih?"
      3. Jika ditanya di mana melihat katalog, jawab: "Tinggal klik aja menu 'Product' di bagian atas web ini bro, nanti kelihatan semua koleksi sepatu kita."
      4. Jika ditanya cara beli, jawab: "Pilih aja sepatunya di menu Product, klik 'Add to Cart', terus bayar deh di Keranjang pojok kanan atas."
      5. Jika menyebutkan sepatu, WAJIB SEBUTKAN NAMA DAN HARGA DENGAN JELAS. Kalau ada diskon, kasih tau harga diskonnya.
      6. DILARANG NGARANG produk. Jika ditanya barang di luar katalog (jual baju, ikan, merk sepatu lain), bilang saja "Wah maaf bro, kita cuma jualan sepatu yang ada di katalog web ini aja nih."`,
    });

    // Kembalikan hasilnya ke frontend perlahan-lahan (efek mengetik)
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("AI Chat Error:", error);
    return new Response("Terjadi kesalahan pada server AI", { status: 500 });
  }
}
