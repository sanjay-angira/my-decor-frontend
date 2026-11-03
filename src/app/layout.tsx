import type { Metadata } from "next";
import { Figtree, Geist_Mono, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StoreProvider } from "@/services/redux/provider";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "India Decor – Metal Wall Art, Planters & Home Décor Online",
  description:
    "Shop handcrafted metal wall art, planters, lamps and home décor at India Decor. Premium, made-in-India pieces to transform every room.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${figtree.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans">
        <StoreProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
