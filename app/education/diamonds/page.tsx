import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Scissors, Palette, Sparkles, Scale, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Diamond Education Guide",
  description:
    "Learn everything about the 4Cs of diamond quality — Cut, Color, Clarity, and Carat Weight — plus popular diamond shapes to help you choose the perfect stone.",
};

/* ─── 4Cs Data ─────────────────────────────────────────────────────────────── */
interface FourCSection {
  id: string;
  icon: typeof Scissors;
  title: string;
  description: string;
  scale: { label: string; sublabel: string; level: number }[];
}

const FOUR_CS: FourCSection[] = [
  {
    id: "cut",
    icon: Scissors,
    title: "Cut",
    description:
      "Cut is the most important factor in a diamond's beauty. It determines how well a diamond interacts with light, creating the brilliance, fire, and scintillation that make a diamond sparkle. Our master gemologists evaluate symmetry, proportion, and polish to ensure every Lumina diamond achieves maximum light performance.",
    scale: [
      { label: "Ideal", sublabel: "Maximum brilliance", level: 5 },
      { label: "Excellent", sublabel: "Exceptional sparkle", level: 4 },
      { label: "Very Good", sublabel: "Above-average light return", level: 3 },
      { label: "Good", sublabel: "Solid performance", level: 2 },
      { label: "Fair", sublabel: "Below average", level: 1 },
    ],
  },
  {
    id: "color",
    icon: Palette,
    title: "Color",
    description:
      "Diamond color actually measures the absence of color. The most chemically pure diamonds are completely colorless and therefore the most valuable. The GIA grades color on a scale from D (colorless) to Z (light yellow or brown). Most distinctions are invisible to the untrained eye, yet they significantly impact quality and price.",
    scale: [
      { label: "D — F", sublabel: "Colorless", level: 5 },
      { label: "G — H", sublabel: "Near colorless", level: 4 },
      { label: "I — J", sublabel: "Slight warmth", level: 3 },
      { label: "K — M", sublabel: "Faint tint", level: 2 },
      { label: "N — Z", sublabel: "Noticeable color", level: 1 },
    ],
  },
  {
    id: "clarity",
    icon: Sparkles,
    title: "Clarity",
    description:
      "Clarity measures the presence of internal inclusions and external blemishes under 10x magnification. Because diamonds form deep within the earth under tremendous heat and pressure, most contain unique birthmarks. Diamonds with fewer and smaller inclusions receive higher clarity grades and are rarer.",
    scale: [
      { label: "FL / IF", sublabel: "Flawless to internally flawless", level: 5 },
      { label: "VVS1 / VVS2", sublabel: "Very very slightly included", level: 4 },
      { label: "VS1 / VS2", sublabel: "Very slightly included", level: 3 },
      { label: "SI1 / SI2", sublabel: "Slightly included", level: 2 },
      { label: "I1 — I3", sublabel: "Included", level: 1 },
    ],
  },
  {
    id: "carat",
    icon: Scale,
    title: "Carat Weight",
    description:
      "Carat is the standard unit of weight for diamonds, where one carat equals 200 milligrams. While carat weight influences size perception, the diamond's cut proportions and shape also play a significant role in how large it appears. Two diamonds of equal carat weight can appear quite different in size depending on their cut.",
    scale: [
      { label: "0.50 ct", sublabel: "Delicate accent", level: 1 },
      { label: "0.75 ct", sublabel: "Classic petite", level: 2 },
      { label: "1.00 ct", sublabel: "Popular choice", level: 3 },
      { label: "1.50 ct", sublabel: "Statement size", level: 4 },
      { label: "2.00 ct+", sublabel: "Exceptional presence", level: 5 },
    ],
  },
];

/* ─── Diamond Shapes ───────────────────────────────────────────────────────── */
const SHAPES = [
  { name: "Round", file: "round.jpg" },
  { name: "Oval", file: "oval.jpg" },
  { name: "Emerald", file: "emerald.jpg" },
  { name: "Marquise", file: "marquise.jpg" },
  { name: "Pear", file: "pear.jpg" },
  { name: "Radiant", file: "radiant.jpg" },
  { name: "Cushion", file: "cushion.jpg" },
  { name: "Princess", file: "princess.jpg" },
  { name: "Asscher", file: "asscher.jpg" },
  { name: "Elongated Cushion", file: "elongated-cushion.jpg" },
] as const;

/* ─── Scale Bar Component ──────────────────────────────────────────────────── */
function ScaleBar({
  items,
}: {
  items: FourCSection["scale"];
}) {
  return (
    <div className="mt-8 space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-4">
          <span className="w-28 shrink-0 text-right text-xs font-semibold tracking-wide text-charcoal sm:w-36 sm:text-sm">
            {item.label}
          </span>
          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-cream-dark">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{
                width: `${item.level * 20}%`,
                background:
                  "linear-gradient(90deg, #C9A84C 0%, #E8D5A3 100%)",
              }}
            />
          </div>
          <span className="hidden w-40 shrink-0 text-xs text-warm-gray sm:block">
            {item.sublabel}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function DiamondEducationPage() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="/generated/education-hero.jpg"
          alt="Close-up of a brilliant-cut diamond refracting light"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-overlay" />

        <div className="container-luxury relative z-10 flex h-full flex-col justify-center">
          <p className="label-caps mb-4 text-gold-light">Education</p>
          <h1 className="heading-hero max-w-2xl text-4xl text-white sm:text-5xl lg:text-6xl">
            Diamond Education Guide
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            Understanding the 4Cs empowers you to choose a diamond that
            perfectly balances beauty, quality, and value.
          </p>
        </div>
      </section>

      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <section className="bg-cream py-[var(--section-pad)]">
        <div className="container-luxury text-center">
          <p className="label-caps mb-3 text-gold">The 4Cs</p>
          <h2 className="heading-section mx-auto max-w-3xl text-3xl text-charcoal sm:text-4xl lg:text-5xl">
            Cut &middot; Color &middot; Clarity &middot; Carat
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-warm-gray sm:text-lg">
            Developed by the Gemological Institute of America, the 4Cs are the
            universal standard for evaluating diamond quality. Together they
            determine a diamond&rsquo;s rarity, beauty, and value.
          </p>
        </div>
      </section>

      {/* ── 4C Sections ───────────────────────────────────────────────────── */}
      {FOUR_CS.map(({ id, icon: Icon, title, description, scale }, idx) => (
        <section
          key={id}
          id={id}
          className={`${idx % 2 === 0 ? "bg-white" : "bg-cream-dark"} py-[var(--section-pad)]`}
        >
          <div className="container-luxury">
            <div className="grid items-start gap-12 lg:grid-cols-2">
              {/* Text */}
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-warm-border bg-cream">
                    <Icon
                      className="h-6 w-6 text-gold"
                      strokeWidth={1.4}
                    />
                  </div>
                  <div>
                    <p className="label-caps text-gold">The 4Cs</p>
                    <h2 className="heading-section text-3xl text-charcoal sm:text-4xl">
                      {title}
                    </h2>
                  </div>
                </div>
                <p className="text-base leading-relaxed text-warm-gray sm:text-lg">
                  {description}
                </p>
              </div>

              {/* Visual Scale */}
              <div className="rounded-lg border border-warm-border bg-white p-6 shadow-luxury-sm sm:p-8">
                <p className="label-caps mb-2 text-charcoal">
                  {title} Grading Scale
                </p>
                <p className="mb-4 text-xs text-warm-gray">
                  Higher bars indicate greater rarity and value
                </p>
                <ScaleBar items={scale} />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Diamond Shapes ────────────────────────────────────────────────── */}
      <section className="bg-cream py-[var(--section-pad)]">
        <div className="container-luxury">
          <div className="mb-14 text-center">
            <p className="label-caps mb-3 text-gold">Shape Guide</p>
            <h2 className="heading-section text-3xl text-charcoal sm:text-4xl">
              Popular Diamond Shapes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-warm-gray">
              A diamond&rsquo;s shape is the first thing you notice. Each shape
              has its own character, brilliance pattern, and style personality.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
            {SHAPES.map((shape) => (
              <Link
                key={shape.name}
                href={`/configure?entry=START_WITH_DIAMOND&shape=${shape.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full border border-warm-border bg-white p-3 transition-all duration-300 group-hover:border-gold group-hover:shadow-gold sm:h-32 sm:w-32">
                  <Image
                    src={`/shapes/${shape.file}`}
                    alt={`${shape.name} cut diamond`}
                    fill
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                    sizes="128px"
                  />
                </div>
                <span className="label-caps text-charcoal transition-colors duration-200 group-hover:text-gold-dark">
                  {shape.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-cream-dark py-16">
        <div className="container-luxury flex flex-col items-center gap-6 text-center">
          <h2 className="heading-section text-2xl text-charcoal sm:text-3xl">
            Ready to Find Your Diamond?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-warm-gray">
            Put your newfound knowledge to work. Browse over 150,000 certified
            diamonds and design the ring of your dreams.
          </p>
          <Link href="/configure?entry=START_WITH_DIAMOND" className="btn-primary">
            Start with a Diamond
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
