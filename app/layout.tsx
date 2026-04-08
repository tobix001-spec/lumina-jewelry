import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Navigation/Header";
import { Footer } from "@/components/Navigation/Footer";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://luminajewelry.com"
  ),
  title: {
    default: "Lumina Jewelry — Ethically Sourced Fine Jewelry",
    template: "%s — Lumina Jewelry",
  },
  description:
    "Design your own engagement ring from 150,000+ certified natural and lab-grown diamonds. Free lifetime warranty, ethical sourcing, 30-day returns.",
  authors: [{ name: "Lumina Jewelry" }],
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#1A1714",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body
        className="bg-white text-charcoal antialiased"
        style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
      >
        <Providers>
          <Header />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
