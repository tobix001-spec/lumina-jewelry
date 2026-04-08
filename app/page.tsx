import type { Metadata } from "next";
import { HeroCarousel } from "@/components/homepage/HeroCarousel";
import { DiamondShapesCarousel } from "@/components/homepage/DiamondShapesCarousel";
import { CollectionsCarousel } from "@/components/homepage/CollectionsCarousel";
import {
  AnimatedDesignCTA,
  AnimatedCategoryGrid,
  AnimatedFeaturedCollections,
  AnimatedTrendReport,
  AnimatedOmnichannelSection,
  AnimatedBenefits,
  AnimatedMission,
} from "@/components/homepage/AnimatedSections";

export const metadata: Metadata = {
  title: "Lumina Jewelry — Ethically Sourced Fine Jewelry & Engagement Rings",
  description: "Design your own engagement ring from 150,000+ certified natural and lab-grown diamonds. Free lifetime warranty, 30-day returns, sustainable sourcing.",
  openGraph: {
    title: "Lumina Jewelry — Ethically Sourced Fine Jewelry",
    description: "Design your perfect ring from 150,000+ certified diamonds.",
    type: "website",
  },
  alternates: { canonical: "/" },
};

export const revalidate = 3600;

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "JewelryStore",
          name: "Lumina Jewelry",
          url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://luminajewelry.com",
          description: "Ethically sourced fine jewelry, engagement rings, and certified diamonds.",
          priceRange: "$$$",
        })}}
      />
      <main>
        <HeroCarousel />
        <AnimatedDesignCTA />
        <AnimatedCategoryGrid />
        <DiamondShapesCarousel />
        <AnimatedFeaturedCollections />
        <AnimatedTrendReport />
        <AnimatedOmnichannelSection />
        <AnimatedBenefits />
        <AnimatedMission />
        <CollectionsCarousel />
      </main>
    </>
  );
}
