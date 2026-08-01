"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { registerAction } from "@/src/app/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RegisterProps {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
    className?: string;
  };
  buttonText?: string;
  loginText?: string;
  loginUrl?: string;
  className?: string;
}

export default function RegisterPage({
  heading = "Daftar Akun Baru",
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
    alt: "logo",
    title: "AI Shop Sneakers",
  },
  buttonText = "Daftar",
  loginText = "Sudah punya akun?",
  loginUrl = "/login",
  className,
}: RegisterProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await registerAction(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success) {
      router.push("/login?registered=true");
    }
  }

  return (
    <section className={cn("min-h-[calc(100vh-4rem)] bg-muted py-8", className)}>
      <div className="flex h-full min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        {/* Logo & Container */}
        <div className="flex flex-col items-center gap-6 lg:justify-start w-full">
          <a href={logo.url} className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            🛒 AI Shop Sneakers
          </a>
          <div className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md">
            {heading && <h1 className="text-xl font-semibold mb-2">{heading}</h1>}
            
            {/* GOOGLE REGISTER BUTTON */}
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Daftar dengan Google
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Atau dengan email</span>
              </div>
            </div>

            {/* EMAIL REGISTER FORM */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                  {error}
                </div>
              )}
              <Input
                name="name"
                type="text"
                placeholder="Nama Lengkap"
                className="text-sm"
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                className="text-sm"
                required
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                className="text-sm"
                required
              />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Konfirmasi Password"
                className="text-sm"
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Mendaftar..." : buttonText}
              </Button>
            </form>
          </div>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{loginText}</p>
            <a
              href={loginUrl}
              className="font-medium text-primary hover:underline"
            >
              Masuk di sini
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
