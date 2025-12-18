import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/shared/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Lumière Blog | Modern Dijital Düşünceler",
    template: "%s | Lumière Blog"
  },
  description: "Modern UI/UX, teknoloji ve ürün kültürü üzerine animasyonlu blog.",
  alternates: {
    canonical: "/blog"
  },
  openGraph: {
    title: "Lumière Blog",
    description: "Modern UI/UX, teknoloji ve ürün kültürü üzerine animasyonlu blog.",
    url: "https://example.com/blog",
    siteName: "Lumière Blog",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background text-foreground`}>
        <Providers>
          <Navbar />
          <main className="container py-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
