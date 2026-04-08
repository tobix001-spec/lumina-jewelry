import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Showrooms",
  description:
    "Visit a Lumina Jewelry showroom near you. Experience our curated diamond collection in person and book a complimentary consultation with a jewelry expert.",
};

/* ─── Showroom Data ────────────────────────────────────────────────────────── */
interface Showroom {
  city: string;
  neighborhood: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
}

const SHOWROOMS: Showroom[] = [
  {
    city: "New York",
    neighborhood: "5th Avenue",
    address: "645 Fifth Avenue, 3rd Floor, New York, NY 10022",
    phone: "(212) 555-0170",
    hours: "Mon — Sat: 10 AM — 7 PM  |  Sun: 12 PM — 6 PM",
    image: "/generated/showroom-interior.jpg",
  },
  {
    city: "Los Angeles",
    neighborhood: "Beverly Hills",
    address: "350 N Rodeo Drive, Suite 200, Beverly Hills, CA 90210",
    phone: "(310) 555-0234",
    hours: "Mon — Sat: 10 AM — 7 PM  |  Sun: 11 AM — 6 PM",
    image: "/generated/showroom-interior.jpg",
  },
  {
    city: "Chicago",
    neighborhood: "Magnificent Mile",
    address: "900 N Michigan Avenue, Level 4, Chicago, IL 60611",
    phone: "(312) 555-0189",
    hours: "Mon — Sat: 10 AM — 7 PM  |  Sun: 12 PM — 5 PM",
    image: "/generated/showroom-interior.jpg",
  },
  {
    city: "San Francisco",
    neighborhood: "Union Square",
    address: "250 Post Street, Suite 310, San Francisco, CA 94108",
    phone: "(415) 555-0312",
    hours: "Mon — Sat: 10 AM — 6 PM  |  Sun: 12 PM — 5 PM",
    image: "/generated/showroom-interior.jpg",
  },
  {
    city: "Boston",
    neighborhood: "Back Bay",
    address: "100 Newbury Street, 2nd Floor, Boston, MA 02116",
    phone: "(617) 555-0278",
    hours: "Mon — Sat: 10 AM — 6 PM  |  Sun: 12 PM — 5 PM",
    image: "/generated/showroom-interior.jpg",
  },
  {
    city: "Washington DC",
    neighborhood: "Georgetown",
    address: "3222 M Street NW, Washington, DC 20007",
    phone: "(202) 555-0145",
    hours: "Mon — Sat: 10 AM — 7 PM  |  Sun: 12 PM — 6 PM",
    image: "/generated/showroom-interior.jpg",
  },
];

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ShowroomsPage() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="/generated/showroom-interior.jpg"
          alt="Lumina Jewelry showroom interior with elegant display cases"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-overlay" />

        <div className="container-luxury relative z-10 flex h-full flex-col justify-center">
          <p className="label-caps mb-4 text-gold-light">Visit Us</p>
          <h1 className="heading-hero max-w-2xl text-4xl text-white sm:text-5xl lg:text-6xl">
            Our Showrooms
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            Step inside a world of curated brilliance. Our jewelry consultants
            are ready to guide your journey in person.
          </p>
        </div>
      </section>

      {/* ── Showroom Grid ─────────────────────────────────────────────────── */}
      <section className="bg-cream py-[var(--section-pad)]">
        <div className="container-luxury">
          <div className="mb-14 text-center">
            <p className="label-caps mb-3 text-gold">Locations</p>
            <h2 className="heading-section text-3xl text-charcoal sm:text-4xl">
              Find a Showroom Near&nbsp;You
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWROOMS.map((s) => (
              <article
                key={s.city}
                className="card-luxury group relative flex flex-col overflow-hidden bg-white"
              >
                {/* Image */}
                <div className="img-zoom relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={`Lumina Jewelry ${s.city} showroom`}
                    fill
                    className="object-cover"
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-card-overlay opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="heading-section text-xl text-charcoal">
                    {s.city}
                  </h3>
                  <p className="label-caps mt-1 text-gold">{s.neighborhood}</p>

                  <div className="mt-5 space-y-3 text-sm text-warm-gray">
                    <div className="flex items-start gap-2.5">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                        strokeWidth={1.5}
                      />
                      <span>{s.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone
                        className="h-4 w-4 shrink-0 text-gold"
                        strokeWidth={1.5}
                      />
                      <span>{s.phone}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                        strokeWidth={1.5}
                      />
                      <span>{s.hours}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <Link
                      href={`/showrooms/${s.city.toLowerCase().replace(/\s+/g, "-")}/book`}
                      className="btn-primary w-full text-center"
                    >
                      Book Appointment
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="container-luxury flex flex-col items-center gap-6 text-center">
          <h2 className="heading-section text-2xl text-charcoal sm:text-3xl">
            Can&rsquo;t Visit In Person?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-warm-gray">
            Schedule a complimentary virtual consultation with one of our
            diamond experts from the comfort of your home.
          </p>
          <Link href="/configure" className="btn-outline">
            Start Designing Online
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
