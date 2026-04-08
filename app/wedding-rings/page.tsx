import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Ruler, CircleDot } from "lucide-react";

export const metadata: Metadata = {
  title: "Wedding Rings",
  description:
    "Discover our collection of men's and women's wedding bands in platinum, gold, and rose gold. Timeless designs crafted for a lifetime of love.",
  openGraph: {
    title: "Wedding Rings — Lumina Jewelry",
    type: "website",
  },
};

/* ─── Product Data ────────────────────────────────────────────────────────── */

const weddingBands = [
  {
    id: "wb-001",
    name: "Classic Platinum Band",
    price: 1850,
    metal: "Platinum",
    width: "4mm",
    image: "/generated/ring-5.jpg",
    gender: "Women's",
  },
  {
    id: "wb-002",
    name: "Brushed Gold Comfort Fit",
    price: 1200,
    metal: "14K Yellow Gold",
    width: "6mm",
    image: "/generated/ring-6.jpg",
    gender: "Men's",
  },
  {
    id: "wb-003",
    name: "Rose Gold Milgrain Band",
    price: 980,
    metal: "18K Rose Gold",
    width: "3mm",
    image: "/generated/ring-7.jpg",
    gender: "Women's",
  },
  {
    id: "wb-004",
    name: "Hammered White Gold Band",
    price: 1450,
    metal: "18K White Gold",
    width: "5mm",
    image: "/generated/ring-8.jpg",
    gender: "Men's",
  },
  {
    id: "wb-005",
    name: "Diamond Eternity Band",
    price: 3500,
    metal: "Platinum",
    width: "2.5mm",
    image: "/generated/ring-5.jpg",
    gender: "Women's",
  },
  {
    id: "wb-006",
    name: "Tungsten Carbide Band",
    price: 400,
    metal: "Tungsten Carbide",
    width: "8mm",
    image: "/generated/ring-6.jpg",
    gender: "Men's",
  },
  {
    id: "wb-007",
    name: "Pavé Diamond Half Band",
    price: 2750,
    metal: "18K White Gold",
    width: "3mm",
    image: "/generated/ring-7.jpg",
    gender: "Women's",
  },
  {
    id: "wb-008",
    name: "Satin Finish Platinum Band",
    price: 2100,
    metal: "Platinum",
    width: "6mm",
    image: "/generated/ring-8.jpg",
    gender: "Men's",
  },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents);
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function WeddingRingsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="container-luxury text-center">
          <span className="label-caps text-warm-gray mb-4 block">
            Symbols of Forever
          </span>
          <h1 className="heading-hero text-charcoal text-5xl sm:text-6xl lg:text-7xl mb-6">
            Wedding Rings
          </h1>
          <p className="font-body text-warm-gray max-w-2xl mx-auto text-lg leading-relaxed">
            Handcrafted wedding bands designed to celebrate your eternal bond.
            From classic platinum to contemporary rose gold, find the ring that
            tells your story.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="container-luxury">
        <div className="divider-label">
          <span className="label-caps text-warm-gray">Our Collection</span>
        </div>
      </div>

      {/* Product Grid */}
      <section className="container-luxury pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger">
          {weddingBands.map((band) => (
            <Link
              key={band.id}
              href={`/wedding-rings/${band.id}`}
              className="group card-luxury relative overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
                <Image
                  src={band.image}
                  alt={band.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                />
                {/* Gender badge */}
                <span className="absolute top-3 left-3 badge-gold">
                  {band.gender}
                </span>
              </div>

              {/* Details */}
              <div className="p-4 sm:p-5">
                <h3 className="font-display text-charcoal text-lg sm:text-xl font-medium leading-snug mb-1">
                  {band.name}
                </h3>

                <div className="flex items-center gap-3 text-warm-gray text-xs mt-2 mb-3">
                  <span className="flex items-center gap-1">
                    <CircleDot className="w-3.5 h-3.5" />
                    {band.metal}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5" />
                    {band.width}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-warm-border pt-3">
                  <span className="font-display text-charcoal text-xl font-semibold">
                    {formatPrice(band.price)}
                  </span>
                  <Heart className="w-4.5 h-4.5 text-warm-gray opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
