/**
 * app/diamonds/page.tsx — Diamond Product Listing Page
 *
 * Architecture:
 *  - Page component is a Server Component (SEO meta, URL param parsing)
 *  - DiamondGrid and DiamondFilters are Client Components for interactivity
 *  - URL search params drive initial filter state (shareable, bookmarkable)
 *  - React Query manages data fetching with background refetch
 *  - Filter changes update URL params for SEO/link sharing
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { DiamondListingClient } from "@/components/diamonds/DiamondListingClient";
import type { DiamondShape, DiamondOrigin } from "@/types";

// ─── Dynamic SEO ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string>;
}): Promise<Metadata> {
  const shape = searchParams.shape;
  const origin = searchParams.origin;

  const originLabel =
    origin === "LAB_GROWN"
      ? "Lab Grown"
      : origin === "NATURAL"
      ? "Natural"
      : "";

  const shapeLabel = shape
    ? shape.charAt(0) + shape.slice(1).toLowerCase().replace("_", " ")
    : "";

  const title = [originLabel, shapeLabel, "Diamonds — Lumina Jewelry"]
    .filter(Boolean)
    .join(" ");

  return {
    title,
    description: `Browse ${originLabel} ${shapeLabel} diamonds from our virtual inventory of 150,000+ certified stones. Filter by carat, color, clarity, cut, and ethical origin.`,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      type: "website",
    },
  };
}

export default function DiamondsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  // Parse initial filter values from URL to pass as initial state to Client Component
  const initialFilters = parseSearchParams(searchParams);

  return (
    <main>
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Diamonds", item: "/diamonds" },
            ],
          }),
        }}
      />

      <Suspense fallback={<DiamondPageSkeleton />}>
        <DiamondListingClient initialFilters={initialFilters} />
      </Suspense>
    </main>
  );
}

// ─── URL param → filter state parser ────────────────────────────────────────

function parseSearchParams(params: Record<string, string | string[]>) {
  const toArray = (v: string | string[] | undefined): string[] => {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  const toFloat = (v: string | undefined, fallback: number): number => {
    const parsed = parseFloat(v ?? "");
    return isNaN(parsed) ? fallback : parsed;
  };

  return {
    shapes: toArray(params.shape) as DiamondShape[],
    caratRange: [
      toFloat(toArray(params.minCarat)[0], 0.5),
      toFloat(toArray(params.maxCarat)[0], 5),
    ] as [number, number],
    colors: toArray(params.color),
    clarities: toArray(params.clarity),
    cutGrades: toArray(params.cutGrade),
    polish: toArray(params.polish),
    symmetry: toArray(params.symmetry),
    tableRange: [55, 65] as [number, number],
    depthRange: [55, 70] as [number, number],
    fluorescence: toArray(params.fluorescence),
    eyeClean: params.eyeClean === "true" ? true : params.eyeClean === "false" ? false : null,
    origins: toArray(params.origin) as DiamondOrigin[],
    renewableEnergy: params.renewableEnergy === "true",
    carbonCapture: params.carbonCapture === "true",
    blockchainEnabled: params.blockchainEnabled === "true",
    priceRange: [
      toFloat(toArray(params.minPrice)[0], 500),
      toFloat(toArray(params.maxPrice)[0], 50000),
    ] as [number, number],
    preset: null as "MOST_SPARKLE" | "BEST_BALANCE" | "BEST_VALUE" | null,
  };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DiamondPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex gap-8 animate-pulse">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="h-8 bg-stone-100 rounded-lg mb-6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mb-4 space-y-2">
            <div className="h-4 bg-stone-100 rounded w-1/2" />
            <div className="h-10 bg-stone-100 rounded-lg" />
          </div>
        ))}
      </aside>
      {/* Grid skeleton */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-stone-100 aspect-square" />
        ))}
      </div>
    </div>
  );
}
