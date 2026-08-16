import { ArrowUpRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Hero47Props {
  heading?: string;
  subheading?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  className?: string;
}

const Hero47 = ({
  heading = "Step Into",
  subheading = " The Future of Sneakers",
  description = "Toko sepatu pintar pertama dengan AI assistant yang siap membantumu menemukan sneakers impian yang paling cocok dengan gayamu.",
  buttons = {
    primary: {
      text: "Shop Now",
      url: "/shop",
    },
    secondary: {
      text: "Tanya AI Assistant",
      url: "/chat",
    },
  },
  image = {
    src: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Sneakers Collection",
  },
  className,
}: Hero47Props) => {
  return (
    <section className={cn("bg-background py-20 lg:py-32 overflow-hidden", className)}>
      <div className="container flex flex-col items-center gap-10 lg:my-0 lg:flex-row">
        <div className="flex flex-col gap-7 lg:w-2/3">
          <h2 className="text-5xl font-semibold text-foreground md:text-5xl lg:text-8xl">
            <span>{heading}</span>
            <span className="text-muted-foreground">{subheading}</span>
          </h2>
          <p className="text-base text-muted-foreground md:text-lg lg:text-xl max-w-2xl">
            {description}
          </p>
          <div className="flex flex-wrap items-start gap-5 lg:gap-7">
            <a href={buttons.primary?.url} className={buttonVariants({ size: "lg", className: "rounded-full" })}>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="size-4" />
              </div>
              <span className="pr-6 pl-4 text-sm whitespace-nowrap lg:pr-8 lg:pl-6 lg:text-base">
                {buttons.primary?.text}
              </span>
            </a>
            <a href={buttons.secondary?.url} className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full" })}>
              {buttons.secondary?.text}
            </a>
          </div>
        </div>
        <div className="relative z-10 w-full lg:w-1/3 flex justify-center">
          {/* Diganti dari Mockup HP jadi Gambar Sepatu yang estetik */}
          <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-[35px] overflow-hidden shadow-2xl border bg-muted">
            <img
              src={image.src}
              alt={image.alt}
              className="size-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero47 };
