import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Leaf, Eye, Gem, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "Lumina Jewelry is committed to ethical sourcing, sustainability, and creating timeless fine jewelry with transparency and craftsmanship at every step.",
};

/* ─── Stats ────────────────────────────────────────────────────────────────── */
const STATS = [
  { value: "20+", label: "Years of Excellence" },
  { value: "40+", label: "Showrooms Worldwide" },
  { value: "150K+", label: "Diamonds Curated" },
  { value: "100%", label: "Recycled Gold" },
] as const;

/* ─── Values ───────────────────────────────────────────────────────────────── */
const VALUES = [
  {
    icon: Heart,
    title: "Ethical Sourcing",
    description:
      "Every diamond in our collection is conflict-free and responsibly sourced through our rigorous supply-chain standards, ensuring that beauty never comes at the cost of human dignity.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "From 100% recycled precious metals to carbon-neutral shipping, we continuously reduce our environmental footprint while raising the bar for luxury industry practices.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "We provide full provenance documentation, third-party certification, and honest pricing so you can make informed decisions with complete confidence.",
  },
  {
    icon: Gem,
    title: "Craftsmanship",
    description:
      "Our master jewelers bring decades of expertise to every piece, combining time-honored techniques with modern precision to create heirlooms that endure for generations.",
  },
] as const;

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function MissionPage() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <Image
          src="/generated/about-hero.jpg"
          alt="Lumina Jewelry atelier with artisans at work"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-overlay" />

        <div className="container-luxury relative z-10 flex h-full flex-col justify-center">
          <p className="label-caps mb-4 text-gold-light">About Lumina</p>
          <h1 className="heading-hero max-w-2xl text-4xl text-white sm:text-5xl lg:text-6xl">
            Our Mission
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            To redefine luxury jewelry through unwavering ethics, enduring
            craftsmanship, and a commitment to the world we share.
          </p>
        </div>
      </section>

      {/* ── Mission Statement ─────────────────────────────────────────────── */}
      <section className="bg-cream py-[var(--section-pad)]">
        <div className="container-luxury text-center">
          <p className="label-caps mb-3 text-gold">Our Promise</p>
          <h2 className="heading-section mx-auto max-w-3xl text-3xl text-charcoal sm:text-4xl lg:text-5xl">
            Beauty That Honors People&nbsp;&amp;&nbsp;Planet
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-warm-gray sm:text-lg">
            Since our founding, Lumina Jewelry has pursued a singular vision:
            that the world&rsquo;s most beautiful jewelry can also be the most
            responsibly made. We partner directly with mining communities,
            champion lab-grown alternatives, and reinvest in the ecosystems that
            make our craft possible.
          </p>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-display text-4xl font-light text-charcoal sm:text-5xl">
                  {stat.value}
                </span>
                <span className="label-caps mt-2 text-warm-gray">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-[var(--section-pad)]">
        <div className="container-luxury">
          <div className="mb-14 text-center">
            <p className="label-caps mb-3 text-gold">What Guides Us</p>
            <h2 className="heading-section text-3xl text-charcoal sm:text-4xl">
              Our Core Values
            </h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex flex-col items-center text-center"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-warm-border bg-cream transition-colors duration-300 group-hover:border-gold group-hover:bg-gold-pale">
                  <Icon
                    className="h-7 w-7 text-charcoal transition-colors duration-300 group-hover:text-gold-dark"
                    strokeWidth={1.4}
                  />
                </div>
                <h3 className="heading-section text-xl text-charcoal">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-gray">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────────────────────────── */}
      <section className="bg-cream-dark py-16">
        <div className="container-luxury flex flex-col items-center gap-6 text-center">
          <h2 className="heading-section text-2xl text-charcoal sm:text-3xl">
            Experience Lumina In Person
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-warm-gray">
            Visit one of our showrooms to see our commitment to quality and
            ethics firsthand, guided by a personal jewelry consultant.
          </p>
          <Link href="/showrooms" className="btn-primary">
            Find a Showroom
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
