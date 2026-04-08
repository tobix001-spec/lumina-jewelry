/**
 * app/engagement-rings/page.tsx — Engagement Rings Listing Page
 *
 * Server Component with static product data. Filter bar is a client
 * component for interactivity; the rest renders on the server for SEO.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FilterBar } from "./FilterBar";

// ─── SEO Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Engagement Rings — Lumina Jewelry",
  description:
    "Discover our curated collection of handcrafted engagement rings. From classic solitaires to vintage-inspired halos, find the ring that tells your story. Ethically sourced, lifetime warranty.",
  openGraph: {
    title: "Engagement Rings — Lumina Jewelry",
    description:
      "Handcrafted engagement rings in platinum, white gold, yellow gold, and rose gold. Ethically sourced diamonds with lifetime warranty.",
    type: "website",
  },
  alternates: { canonical: "/engagement-rings" },
};

// ─── Product Data ────────────────────────────────────────────────────────────

interface EngagementRing {
  id: string;
  name: string;
  price: number;
  metal: string;
  style: string;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

const rings: EngagementRing[] = [
  {
    id: "er-001",
    name: "Petite Pavé Solitaire",
    price: 1290,
    metal: "14K White Gold",
    style: "Solitaire",
    image: "/generated/ring-1.jpg",
    rating: 4.9,
    reviewCount: 312,
    isBestseller: true,
  },
  {
    id: "er-002",
    name: "Waverly Halo",
    price: 2450,
    metal: "18K Yellow Gold",
    style: "Halo",
    image: "/generated/ring-2.jpg",
    rating: 4.8,
    reviewCount: 187,
  },
  {
    id: "er-003",
    name: "Three Stone Radiance",
    price: 3875,
    metal: "Platinum",
    style: "Three Stone",
    image: "/generated/ring-3.jpg",
    rating: 4.9,
    reviewCount: 256,
    isNew: true,
  },
  {
    id: "er-004",
    name: "Secret Garden Hidden Halo",
    price: 2190,
    metal: "14K Rose Gold",
    style: "Hidden Halo",
    image: "/generated/ring-4.jpg",
    rating: 4.7,
    reviewCount: 143,
  },
  {
    id: "er-005",
    name: "Aria Vintage Milgrain",
    price: 4250,
    metal: "Platinum",
    style: "Vintage",
    image: "/generated/ring-5.jpg",
    rating: 4.8,
    reviewCount: 98,
  },
  {
    id: "er-006",
    name: "Modern Bezel Solitaire",
    price: 1575,
    metal: "14K White Gold",
    style: "Bezel",
    image: "/generated/ring-6.jpg",
    rating: 4.6,
    reviewCount: 221,
  },
  {
    id: "er-007",
    name: "Willow Nature-Inspired",
    price: 3200,
    metal: "18K Yellow Gold",
    style: "Nature-Inspired",
    image: "/generated/ring-7.jpg",
    rating: 4.9,
    reviewCount: 167,
    isNew: true,
  },
  {
    id: "er-008",
    name: "Cathedral Brilliance",
    price: 5490,
    metal: "Platinum",
    style: "Cathedral",
    image: "/generated/ring-8.jpg",
    rating: 4.8,
    reviewCount: 204,
    isBestseller: true,
  },
  {
    id: "er-009",
    name: "Lunaria Cushion Halo",
    price: 2850,
    metal: "14K Rose Gold",
    style: "Halo",
    image: "/generated/ring-1.jpg",
    rating: 4.7,
    reviewCount: 132,
  },
  {
    id: "er-010",
    name: "Classic Six-Prong Solitaire",
    price: 1200,
    metal: "14K White Gold",
    style: "Solitaire",
    image: "/generated/ring-2.jpg",
    rating: 4.9,
    reviewCount: 489,
    isBestseller: true,
  },
  {
    id: "er-011",
    name: "Luxe Hidden Halo Oval",
    price: 6750,
    metal: "18K Yellow Gold",
    style: "Hidden Halo",
    image: "/generated/ring-3.jpg",
    rating: 4.8,
    reviewCount: 76,
    isNew: true,
  },
  {
    id: "er-012",
    name: "Éternelle Vintage Platinum",
    price: 8500,
    metal: "Platinum",
    style: "Vintage",
    image: "/generated/ring-4.jpg",
    rating: 5.0,
    reviewCount: 58,
  },
];

// ─── Helper ──────────────────────────────────────────────────────────────────

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.floor(rating) ? "text-gold" : "text-warm-border"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-2xs text-warm-gray ml-0.5">({rating})</span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EngagementRingsPage() {
  return (
    <main>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Engagement Rings",
                item: "/engagement-rings",
              },
            ],
          }),
        }}
      />

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <section className="bg-cream">
        <div className="container-luxury py-16 sm:py-20 lg:py-24 text-center">
          <p className="label-caps text-gold mb-4 tracking-[0.25em]">
            The Lumina Collection
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal tracking-wide leading-tight">
            Engagement Rings
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-warm-gray text-base sm:text-lg leading-relaxed">
            Each ring is handcrafted to order, set with ethically sourced diamonds
            and conflict-free gemstones. Discover the design that will mark
            the beginning of your forever.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-warm-gray">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Free Shipping
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lifetime Warranty
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              30-Day Returns
            </span>
          </div>
        </div>
      </section>

      {/* ── Filter Bar + Grid ───────────────────────────────────────────────── */}
      <section className="container-luxury py-12 sm:py-16">
        {/* Filter bar (client component for hover/click interactivity) */}
        <FilterBar />

        {/* Result count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-warm-gray">
            Showing <span className="font-semibold text-charcoal">{rings.length}</span> engagement rings
          </p>
          <p className="text-sm text-warm-gray hidden sm:block">
            Setting not included. Price is for the ring setting only.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {rings.map((ring) => (
            <Link
              key={ring.id}
              href={`/engagement-rings/${ring.id}`}
              className="group card-luxury relative overflow-hidden flex flex-col"
            >
              {/* Badges */}
              {(ring.isNew || ring.isBestseller) && (
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                  {ring.isNew && (
                    <span className="badge-gold text-2xs">New</span>
                  )}
                  {ring.isBestseller && (
                    <span className="badge-gold text-2xs">Bestseller</span>
                  )}
                </div>
              )}

              {/* Wishlist icon */}
              <button
                aria-label={`Add ${ring.name} to wishlist`}
                className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-warm-border opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:border-gold"
              >
                <svg className="w-4 h-4 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>

              {/* Image */}
              <div className="relative aspect-square bg-cream overflow-hidden img-zoom">
                <Image
                  src={ring.image}
                  alt={ring.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-5">
                <p className="label-caps text-warm-gray mb-1.5">{ring.style}</p>
                <h3 className="font-display text-lg font-medium text-charcoal leading-snug group-hover:text-gold-dark transition-colors duration-300">
                  {ring.name}
                </h3>
                <p className="text-sm text-warm-gray mt-1">{ring.metal}</p>

                <div className="mt-2">
                  <StarRating rating={ring.rating} />
                </div>

                <div className="mt-auto pt-4 flex items-end justify-between">
                  <div>
                    <p className="label-caps text-warm-gray text-2xs mb-0.5">Starting at</p>
                    <p className="text-lg font-semibold text-charcoal tracking-tight">
                      {formatPrice(ring.price)}
                    </p>
                  </div>
                  <span className="btn-primary text-xs px-5 py-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Select
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-cream">
        <div className="container-luxury py-16 sm:py-20 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-light text-charcoal">
            Can&rsquo;t find what you&rsquo;re looking for?
          </h2>
          <p className="mt-4 text-warm-gray max-w-xl mx-auto">
            Our jewelry consultants can help you design a custom engagement ring
            tailored to your vision. Complimentary consultations available.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/custom-design" className="btn-primary">
              Design Your Own
            </Link>
            <Link href="/appointment" className="btn-outline">
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
