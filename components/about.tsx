import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface About3Props {
  className?: string;
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src?: string;
    alt?: string;
    title: string;
    description: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companies?: Array<{
    src: string;
    alt: string;
  }> | null;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
  contentSections?: Array<{
    title: string;
    content: string;
  }>;
}

const About3 = ({
  className,
  title = "Tentang AI Sneakers",
  description = "Kami adalah destinasi utama bagi para pecinta sneakers. Dengan memadukan gaya hidup modern dan teknologi AI, kami membantu kamu menemukan sepatu yang paling cocok untuk setiap langkahmu.",
  mainImage = {
    src: "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=1200&auto=format&fit=crop",
    alt: "Koleksi Sneakers",
  },
  secondaryImage = {
    src: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop",
    alt: "Sneakers Keren",
  },
  breakout = {
    src: "https://cdn-icons-png.flaticon.com/512/88/88746.png",
    alt: "Sneaker Icon",
    title: "Ratusan Koleksi Original",
    description:
      "Menyediakan sepatu berkualitas tinggi dari berbagai brand ternama dunia dengan garansi keaslian 100%.",
    buttonText: "Lihat Produk",
    buttonUrl: "/product",
  },
  companies = [
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
      alt: "Nike",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
      alt: "Adidas",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg",
      alt: "New Balance",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/8/87/Puma_logo.svg",
      alt: "Puma",
    },
  ],
  achievementsTitle = "Pencapaian Kami",
  achievementsDescription = "Kami bangga telah menjadi bagian dari perjalanan gaya hidup ribuan pelanggan di seluruh Indonesia.",
  achievements = [
    { label: "Pelanggan Puas", value: "10K+" },
    { label: "Koleksi Sepatu", value: "500+" },
    { label: "Review Positif", value: "99%" },
    { label: "Brand Partner", value: "20+" },
  ],
  contentSections = [
    {
      title: "Visi Kami",
      content:
        "Mencari sepatu yang tepat seringkali memakan waktu. Banyak pilihan di luar sana, namun sulit menemukan yang benar-benar pas dengan karakter dan kebutuhan kakimu.\n\nBagaimana jika kamu bisa menemukan sepatu impianmu tanpa pusing memilih? Dengan asisten cerdas (AI) kami, pengalaman berbelanjamu akan menjadi jauh lebih personal dan efisien.\n\nKami percaya bahwa setiap orang berhak melangkah dengan penuh percaya diri dan kenyamanan maksimal.",
    },
    {
      title: "Tim Kami",
      content:
        "AI Sneakers dibangun oleh sekumpulan sneakerhead dan tech-enthusiast yang memiliki passion mendalam terhadap budaya jalanan (street culture) dan inovasi teknologi.\n\nKami mengurasi setiap produk dengan ketat untuk memastikan hanya sepatu terbaik yang sampai ke tanganmu. Dari edisi klasik hingga rilisan terbatas (limited edition), semuanya ada di sini.\n\nKami berkomitmen untuk terus berinovasi memberikan layanan terbaik, garansi keaslian, dan pengalaman berbelanja sneakers yang belum pernah ada sebelumnya.",
    },
  ],
}: About3Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mb-14 flex flex-col gap-5 lg:w-2/3">
          <h1 className="text-5xl font-semibold tracking-tighter lg:text-6xl">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          <img
            src={mainImage.src}
            alt={mainImage.alt}
            className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
          />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted p-7 md:w-1/2 lg:w-auto">
              <img
                src={breakout.src}
                alt={breakout.alt}
                className="mr-auto h-12 dark:invert object-contain opacity-50"
              />
              <div>
                <p className="mb-2 text-lg font-semibold">{breakout.title}</p>
                <p className="text-muted-foreground">{breakout.description}</p>
              </div>
              <a href={breakout.buttonUrl} className={cn(buttonVariants({ variant: "outline" }), "mr-auto")}>
                  {breakout.buttonText}
              </a>
            </div>
            <img
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
            />
          </div>
        </div>
        {companies && (
          <div className="py-24 border-y mt-24">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60">
                {companies.map((company, idx) => (
                  <img
                    key={idx}
                    src={company.src}
                    alt={company.alt}
                    className="h-8 md:h-12 w-auto dark:invert object-contain"
                  />
                ))}
            </div>
          </div>
        )}
        <div className="relative overflow-hidden rounded-xl bg-muted p-7 md:p-16 mt-24">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h2 className="text-3xl font-medium md:text-4xl">
              {achievementsTitle}
            </h2>
            <p className="max-w-xl text-muted-foreground">
              {achievementsDescription}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:flex md:flex-wrap md:justify-between">
            {achievements.map((item, idx) => (
              <div
                className="flex flex-col gap-2 text-center md:text-left"
                key={item.label + idx}
              >
                <span className="font-mono text-4xl font-semibold md:text-5xl">
                  {item.value}
                </span>
                <p className="text-sm md:text-base">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        {contentSections && contentSections.length > 0 && (
          <div className="mx-auto grid max-w-5xl gap-16 py-28 md:grid-cols-2 md:gap-28">
            {contentSections.map((section, idx) => (
              <div key={section.title + idx}>
                <h2 className="mb-5 text-4xl font-medium">{section.title}</h2>
                <p className="text-lg leading-7 whitespace-pre-line text-muted-foreground">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export { About3 };
