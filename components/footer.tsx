import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { cn } from "@/lib/utils";
import Link from "next/link";

const defaultProps = {
  description: "Toko sepatu pintar pertama dengan AI assistant yang siap membantumu menemukan sneakers impian yang paling cocok dengan gayamu.",
  sections: [
    {
      title: "Produk",
      links: [
        { name: "Semua Sneakers", href: "/shop" },
        { name: "Koleksi Terbaru", href: "/collections/new" },
        { name: "Pria", href: "/collections/men" },
        { name: "Wanita", href: "/collections/women" },
        { name: "Diskon", href: "/sale" },
      ],
    },
    {
      title: "Perusahaan",
      links: [
        { name: "Tentang Kami", href: "/about" },
        { name: "Karir", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Hubungi Kami", href: "/contact" },
      ],
    },
    {
      title: "Bantuan",
      links: [
        { name: "FAQ", href: "/faq" },
        { name: "Tanya AI Assistant", href: "/chat" },
        { name: "Pengiriman", href: "/shipping" },
        { name: "Pengembalian", href: "/returns" },
      ],
    },
  ],
  copyright: "© 2026 AI Shop Sneakers. All rights reserved.",
  legalLinks: [
    { name: "Syarat & Ketentuan", href: "/terms" },
    { name: "Kebijakan Privasi", href: "/privacy" },
  ],
};

const Footer = ({ className }: { className?: string }) => {
  const { description, sections, copyright, legalLinks } = defaultProps;

  return (
    <section className={cn("py-16 mt-20 bg-muted/30 border-t", className)}>
      <div className="container mx-auto">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center lg:justify-start">
                <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
                  AI<span className="text-muted-foreground">Shop</span>
                </Link>
              </div>
              <p className="mt-4 text-sm font-medium text-muted-foreground max-w-sm">
                {description}
              </p>
              <div className="flex gap-4 mt-6">
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <FaInstagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <FaFacebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <FaTwitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 text-sm font-semibold tracking-tight">
                  {section.title}
                </h3>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-col justify-between gap-4 border-t pt-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {legalLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-primary">
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
