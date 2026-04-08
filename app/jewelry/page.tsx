import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Fine Jewelry",
  description:
    "Explore our curated collection of fine jewelry including earrings, necklaces, and bracelets. Ethically sourced, exquisitely crafted.",
  openGraph: {
    title: "Fine Jewelry — Lumina Jewelry",
    type: "website",
  },
};

/* ─── Product Data ────────────────────────────────────────────────────────── */

type Category = "Earrings" | "Necklaces" | "Bracelets";

interface JewelryProduct {
  id: string;
  name: string;
  price: number;
  type: string;
  category: Category;
  image: string;
}

const products: JewelryProduct[] = [
  // Earrings
  {
    id: "je-001",
    name: "Diamond Stud Earrings",
    price: 1250,
    type: "Stud",
    category: "Earrings",
    image: "/generated/earring-1.jpg",
  },
  {
    id: "je-002",
    name: "Gold Hoop Earrings",
    price: 680,
    type: "Hoop",
    category: "Earrings",
    image: "/generated/ring-1.jpg",
  },
  {
    id: "je-003",
    name: "Sapphire Drop Earrings",
    price: 2400,
    type: "Drop",
    category: "Earrings",
    image: "/generated/ring-2.jpg",
  },
  // Necklaces
  {
    id: "jn-001",
    name: "Pearl Pendant Necklace",
    price: 950,
    type: "Pendant",
    category: "Necklaces",
    image: "/generated/necklace-1.jpg",
  },
  {
    id: "jn-002",
    name: "Diamond Solitaire Necklace",
    price: 3200,
    type: "Solitaire",
    category: "Necklaces",
    image: "/generated/ring-3.jpg",
  },
  {
    id: "jn-003",
    name: "Gold Chain Layering Set",
    price: 750,
    type: "Chain",
    category: "Necklaces",
    image: "/generated/ring-4.jpg",
  },
  // Bracelets
  {
    id: "jb-001",
    name: "Tennis Bracelet",
    price: 5000,
    type: "Tennis",
    category: "Bracelets",
    image: "/generated/bracelet-1.jpg",
  },
  {
    id: "jb-002",
    name: "Rose Gold Bangle",
    price: 480,
    type: "Bangle",
    category: "Bracelets",
    image: "/generated/ring-1.jpg",
  },
  {
    id: "jb-003",
    name: "Diamond Link Bracelet",
    price: 3800,
    type: "Link",
    category: "Bracelets",
    image: "/generated/ring-2.jpg",
  },
];

const categories: Category[] = ["Earrings", "Necklaces", "Bracelets"];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

/* ─── Client-side Tab Component ───────────────────────────────────────────── */

function CategoryTabs() {
  return (
    <>
      {/* Hidden radio inputs for pure-CSS tab switching */}
      {categories.map((cat, i) => (
        <input
          key={cat}
          type="radio"
          name="jewelry-tab"
          id={`tab-${cat}`}
          defaultChecked={i === 0}
          className="peer sr-only"
          data-tab={cat}
        />
      ))}

      {/* Tab buttons */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-12">
        {categories.map((cat) => (
          <label
            key={cat}
            htmlFor={`tab-${cat}`}
            className="label-caps px-6 py-3 cursor-pointer border border-warm-border text-warm-gray
                       hover:border-charcoal hover:text-charcoal
                       transition-all duration-300
                       has-[~:checked]:bg-charcoal has-[~:checked]:text-white has-[~:checked]:border-charcoal"
          >
            {cat}
          </label>
        ))}
      </div>
    </>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function JewelryPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="container-luxury text-center">
          <span className="label-caps text-warm-gray mb-4 inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Curated Collection
          </span>
          <h1 className="heading-hero text-charcoal text-5xl sm:text-6xl lg:text-7xl mb-6">
            Fine Jewelry
          </h1>
          <p className="font-body text-warm-gray max-w-2xl mx-auto text-lg leading-relaxed">
            From statement earrings to delicate necklaces and elegant bracelets,
            each piece is crafted with ethically sourced materials and timeless
            artistry.
          </p>
        </div>
      </section>

      {/* Category Sections */}
      <section className="container-luxury py-16 sm:py-24">
        {categories.map((category) => {
          const categoryProducts = products.filter(
            (p) => p.category === category
          );

          return (
            <div key={category} className="mb-20 last:mb-0">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="heading-section text-charcoal text-3xl sm:text-4xl">
                    {category}
                  </h2>
                  <p className="text-warm-gray text-sm mt-1">
                    {categoryProducts.length} pieces
                  </p>
                </div>
                <Link
                  href={`/jewelry/${category.toLowerCase()}`}
                  className="label-caps text-charcoal flex items-center gap-2 hover:text-gold transition-colors duration-300"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Divider */}
              <div className="h-px bg-warm-border mb-8" />

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
                {categoryProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/jewelry/${product.id}`}
                    className="group card-luxury relative overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                      />
                      {/* Type badge */}
                      <span className="absolute top-3 left-3 badge-gold">
                        {product.type}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-display text-charcoal text-lg sm:text-xl font-medium leading-snug mb-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between border-t border-warm-border pt-3">
                        <span className="font-display text-charcoal text-xl font-semibold">
                          {formatPrice(product.price)}
                        </span>
                        <span className="label-caps text-warm-gray text-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                          Shop Now
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
