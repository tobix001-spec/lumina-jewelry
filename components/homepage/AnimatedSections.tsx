"use client";

import React, { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Leaf, Sparkles, Shield, RefreshCw, Truck, CheckCircle2 } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem, MagneticHover, TextReveal, LineReveal, motion, HoverScale } from "@/components/motion";

// ─── Animated Design CTA ─────────────────────────────────────────────────────

const CTA_ENTRIES = [
  { label: "Start with a Setting", href: "/configure?entry=START_WITH_SETTING", sub: "Choose the ring first" },
  { label: "Start with a Diamond", href: "/configure?entry=START_WITH_DIAMOND", sub: "Pick your stone first" },
  { label: "Start with a Lab Diamond", href: "/configure?entry=START_WITH_LAB_DIAMOND", sub: "Eco-conscious choice" },
];

export function AnimatedDesignCTA() {
  return (
    <section className="bg-cream-dark py-16 sm:py-20">
      <Reveal className="container-luxury text-center mb-12">
        <p className="label-caps text-gold-dark mb-3">Design Your Own</p>
        <h2 className="font-display text-4xl sm:text-5xl text-charcoal" style={{ fontWeight: 300 }}>
          <TextReveal text="Where Would You Like to Begin?" />
        </h2>
      </Reveal>
      <StaggerContainer className="container-luxury grid grid-cols-3 gap-3">
        {CTA_ENTRIES.map((e) => (
          <StaggerItem key={e.href}>
            <Link
              href={e.href}
              className="group flex flex-col items-center text-center p-6 bg-white border border-warm-border hover:border-gold hover:shadow-gold transition-all duration-400"
            >
              <motion.div
                whileHover={{ rotate: 180, scale: 1.15 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-10 h-10 rounded-full border border-warm-border flex items-center justify-center mb-4 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 text-warm-gray group-hover:text-gold-dark transition-colors" />
              </motion.div>
              <p className="text-sm font-semibold text-charcoal group-hover:text-gold-dark transition-colors mb-1 leading-snug">{e.label}</p>
              <p className="text-xs text-warm-gray">{e.sub}</p>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

// ─── Animated Category Grid ──────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Engagement Rings", href: "/engagement-rings",            img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=85&auto=format&fit=crop", alt: "Diamond engagement ring" },
  { label: "Wedding Rings",    href: "/wedding-rings",               img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=700&q=85&auto=format&fit=crop", alt: "Wedding bands" },
  { label: "Fine Jewelry",     href: "/jewelry",                     img: "https://images.unsplash.com/photo-1561828995-aa79a2db86dd?w=700&q=85&auto=format&fit=crop", alt: "Diamond necklace" },
  { label: "Lab Diamonds",     href: "/diamonds?origin=LAB_GROWN",   img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=700&q=85&auto=format&fit=crop", alt: "Lab grown diamond" },
  { label: "Best Sellers",     href: "/jewelry?collection=best-sellers", img: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=700&q=85&auto=format&fit=crop", alt: "Best sellers" },
];

export function AnimatedCategoryGrid() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-luxury">
        <Reveal className="text-center mb-12">
          <p className="label-caps text-gold-dark mb-3">The Collection</p>
          <h2 className="font-display text-4xl sm:text-5xl text-charcoal" style={{ fontWeight: 300 }}>Shop by Category</h2>
        </Reveal>
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <StaggerItem key={cat.label}>
              <Link
                href={cat.href}
                className="group relative overflow-hidden block"
                style={{ aspectRatio: "3/4" }}
              >
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={cat.img}
                    alt={cat.alt}
                    fill
                    sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,16vw"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-charcoal/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-white text-sm font-medium leading-tight">{cat.label}</p>
                  <motion.div
                    className="flex items-center gap-1 mt-1"
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                  >
                    <span className="text-white/70 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">Shop Now</span>
                    <ArrowRight className="w-3 h-3 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── Animated Collections ────────────────────────────────────────────────────

const COLLECTIONS = [
  { label: "Solitaire", sub: "Timeless simplicity", href: "/engagement-rings?style=SOLITAIRE",      img: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&q=85&auto=format&fit=crop", alt: "Solitaire ring" },
  { label: "Hidden Halo", sub: "Secret sparkle", href: "/engagement-rings?style=HIDDEN_HALO",        img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=85&auto=format&fit=crop", alt: "Hidden halo ring" },
  { label: "Nature-Inspired", sub: "Organic beauty", href: "/engagement-rings?style=NATURE_INSPIRED", img: "https://images.unsplash.com/photo-1532453288672-3a17f2e980ae?w=600&q=85&auto=format&fit=crop", alt: "Nature inspired ring" },
  { label: "Ready to Ship", sub: "In 7–10 days", href: "/engagement-rings?collection=ready-to-ship", img: "https://images.unsplash.com/photo-1548691717-5e48df8d44db?w=600&q=85&auto=format&fit=crop", alt: "Ready to ship rings" },
];

export function AnimatedFeaturedCollections() {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="container-luxury">
        <Reveal className="flex items-end justify-between mb-10">
          <div>
            <p className="label-caps text-gold-dark mb-2">Curated For You</p>
            <h2 className="font-display text-4xl sm:text-5xl text-charcoal" style={{ fontWeight: 300 }}>Popular Styles</h2>
          </div>
          <Link href="/engagement-rings" className="hidden sm:flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-warm-gray hover:text-charcoal transition-colors">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Reveal>
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {COLLECTIONS.map((c) => (
            <StaggerItem key={c.label}>
              <Link href={c.href} className="group block">
                <motion.div
                  className="overflow-hidden mb-4"
                  style={{ aspectRatio: "4/5" }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={c.img}
                      alt={c.alt}
                      width={600}
                      height={750}
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                </motion.div>
                <p className="font-display text-xl text-charcoal group-hover:text-gold-dark transition-colors" style={{ fontWeight: 400 }}>{c.label}</p>
                <p className="text-xs text-warm-gray mt-0.5">{c.sub}</p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── Animated Trend Report ───────────────────────────────────────────────────

const TRENDS = [
  { label: "Fine Jewelry", href: "/blog/fine-jewelry-trends-2026",         img: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=900&q=85&auto=format&fit=crop", alt: "Fine jewelry editorial" },
  { label: "Engagement Rings", href: "/blog/engagement-ring-trends-2026",  img: "https://images.unsplash.com/photo-1589394942756-28de60a7dd5c?w=900&q=85&auto=format&fit=crop", alt: "Engagement ring trends" },
  { label: "Wedding Bands", href: "/blog/wedding-band-trends-2026",        img: "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=900&q=85&auto=format&fit=crop", alt: "Wedding band trends" },
];

export function AnimatedTrendReport() {
  return (
    <section className="bg-charcoal py-20 sm:py-28">
      <div className="container-luxury">
        <Reveal className="text-center mb-14">
          <p className="label-caps text-gold mb-3">Editorial</p>
          <h2 className="font-display text-4xl sm:text-5xl text-white" style={{ fontWeight: 300 }}>The 2026 Trend Report</h2>
        </Reveal>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRENDS.map((t) => (
            <StaggerItem key={t.label}>
              <Link
                href={t.href}
                className="group relative overflow-hidden block"
                style={{ aspectRatio: "4/5" }}
              >
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image src={t.img} alt={t.alt} fill sizes="(max-width:768px) 100vw,33vw" className="object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="label-caps text-gold mb-2">2026 Trends</p>
                  <p className="font-display text-2xl text-white" style={{ fontWeight: 400 }}>{t.label}</p>
                  <motion.div
                    className="flex items-center gap-2 mt-3 text-white/60 text-xs font-medium tracking-wide"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 0 }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300" />
                  </motion.div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── Animated Omnichannel Section ────────────────────────────────────────────

export function AnimatedOmnichannelSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal delay={0}>
              <p className="label-caps text-gold-dark mb-4">In Person & Online</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl text-charcoal mb-6 leading-tight" style={{ fontWeight: 300 }}>
                We're With You Every Step of the Way
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-warm-gray leading-relaxed mb-10 text-base max-w-md">
                Visit one of our 40+ showrooms for an intimate, hands-on experience with our expert gemologists — or connect from anywhere via a private virtual appointment.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticHover>
                  <Link href="/showrooms" className="btn-primary">
                    <MapPin className="w-4 h-4" />
                    Visit a Showroom
                  </Link>
                </MagneticHover>
                <MagneticHover>
                  <Link href="/appointments/book" className="btn-outline">
                    <Calendar className="w-4 h-4" />
                    Book Virtual
                  </Link>
                </MagneticHover>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex gap-10 mt-12 pt-10 border-t border-warm-border">
                {[["40+","Showrooms"],["150K+","Diamonds"],["20yr","Heritage"]].map(([val,lab]) => (
                  <div key={lab}>
                    <p className="font-display text-3xl text-charcoal" style={{ fontWeight: 400 }}>{val}</p>
                    <p className="text-xs text-warm-gray mt-0.5 tracking-wide">{lab}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal direction="right" delay={0.2}>
            <div className="relative">
              <div className="overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <Image
                  src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=900&q=90&auto=format&fit=crop"
                  alt="Consultant showing an engagement ring to a couple"
                  fill
                  sizes="(max-width:1024px) 100vw,50vw"
                  className="object-cover"
                />
              </div>
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white border border-warm-border p-5 shadow-luxury max-w-[200px] hidden lg:block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                <p className="text-2xs font-semibold tracking-widest uppercase text-warm-gray mb-2">Current Wait</p>
                <p className="font-display text-2xl text-charcoal" style={{ fontWeight: 400 }}>3–5 Days</p>
                <p className="text-xs text-warm-gray mt-1">For consultations</p>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Animated Benefits ───────────────────────────────────────────────────────

const BENEFITS = [
  { icon: Truck,        title: "Free Insured Shipping", desc: "Complimentary on every order, worldwide.", href: "/orders/shipping" },
  { icon: Shield,       title: "Lifetime Warranty",     desc: "Free prong tightening, polishing & plating, forever.", href: "/warranty" },
  { icon: Sparkles,     title: "24/7 Expert Support",   desc: "Real gemologists available by chat, call, or email.", href: "/contact" },
  { icon: RefreshCw,    title: "Diamond Upgrade",        desc: "Trade up to a larger stone at any time.", href: "/services/upgrade" },
  { icon: CheckCircle2, title: "Free 1-Year Resizing",   desc: "Perfect fit guaranteed within your first year.", href: "/services/resize" },
];

export function AnimatedBenefits() {
  return (
    <section className="bg-cream-dark border-y border-warm-border py-14 sm:py-16">
      <div className="container-luxury">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {BENEFITS.map(({ icon: Icon, title, desc, href }) => (
            <StaggerItem key={title}>
              <Link href={href} className="group flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-11 h-11 rounded-full border border-warm-border flex items-center justify-center mb-4 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300"
                >
                  <Icon className="w-4.5 h-4.5 text-warm-gray group-hover:text-gold-dark transition-colors" />
                </motion.div>
                <p className="label-caps text-charcoal mb-1.5 group-hover:text-gold-dark transition-colors">{title}</p>
                <p className="text-xs text-warm-gray leading-relaxed">{desc}</p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── Animated Mission ────────────────────────────────────────────────────────

export function AnimatedMission() {
  return (
    <section className="py-20 sm:py-28 overflow-hidden">
      <div className="container-luxury">
        <Reveal>
          <div className="relative overflow-hidden bg-charcoal text-white px-8 sm:px-16 lg:px-24 py-16 sm:py-20 lg:py-24 text-center">
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&q=60&auto=format&fit=crop"
                alt=""
                fill
                className="object-cover opacity-15"
                aria-hidden
              />
            </motion.div>
            <div className="relative z-10">
              <Reveal delay={0.1}>
                <div className="inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-4 py-1.5 mb-8">
                  <Leaf className="w-3.5 h-3.5 text-gold" />
                  <span className="label-caps text-gold">Voted #1 Most Sustainable Jewelry Brand</span>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mb-6" style={{ fontWeight: 300, lineHeight: 1.05 }}>
                  20 Years of<br />Our Mission
                </h2>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
                  From conflict-free natural diamonds and 100% recycled gold to lab-grown diamonds powered by renewable energy — transparency, ethics, and respect for our planet guide every decision.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <MagneticHover className="inline-block">
                  <Link href="/about/mission" className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-white hover:text-charcoal transition-all duration-300">
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </MagneticHover>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
