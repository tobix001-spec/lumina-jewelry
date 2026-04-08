"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";
import {
  Reveal,
  StaggerContainer,
  StaggerItem,
  MagneticHover,
  motion,
  AnimatePresence,
} from "@/components/motion";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  );
}

const COLS = [
  { heading: "About", links: [
    { label: "Our Mission",           href: "/about/mission" },
    { label: "Responsible Sourcing",  href: "/about/sourcing" },
    { label: "Sustainability",        href: "/about/sustainability" },
    { label: "Blockchain Provenance", href: "/about/blockchain" },
    { label: "Press & Media",         href: "/about/press" },
    { label: "Careers",               href: "/careers" },
  ]},
  { heading: "Orders", links: [
    { label: "Track Your Order",  href: "/orders/track" },
    { label: "Returns & Exchanges", href: "/orders/returns" },
    { label: "Shipping Info",     href: "/orders/shipping" },
    { label: "Resize & Repair",   href: "/services/resize" },
    { label: "Diamond Upgrade",   href: "/services/upgrade" },
    { label: "Gift Cards",        href: "/gift-cards" },
  ]},
  { heading: "Support", links: [
    { label: "Contact Us",    href: "/contact" },
    { label: "Live Chat",     href: "/contact#chat" },
    { label: "FAQ",           href: "/faq" },
    { label: "Financing",     href: "/financing" },
    { label: "Warranty",      href: "/warranty" },
    { label: "Refer a Friend",href: "/refer" },
  ]},
  { heading: "Showrooms", links: [
    { label: "Find a Location",       href: "/showrooms" },
    { label: "Book Virtual Appt",     href: "/appointments/book" },
    { label: "New York",              href: "/showrooms/new-york" },
    { label: "Los Angeles",           href: "/showrooms/los-angeles" },
    { label: "Chicago",               href: "/showrooms/chicago" },
    { label: "All Locations",         href: "/showrooms" },
  ]},
  { heading: "Education", links: [
    { label: "Diamond Guide",        href: "/education/diamonds" },
    { label: "Engagement Ring Guide",href: "/education/engagement-ring-guide" },
    { label: "Ring Sizing",          href: "/education/ring-sizing" },
    { label: "Metal Guide",          href: "/education/metals" },
    { label: "Blog & Trends",        href: "/blog" },
  ]},
];

const CURRENCIES = [
  { code: "USD", label: "USD ($)" },
  { code: "CAD", label: "CAD (CA$)" },
  { code: "GBP", label: "GBP (£)" },
  { code: "AUD", label: "AUD (A$)" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-white" role="contentinfo">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <Reveal direction="up" duration={0.8} threshold={0.2}>
          <div className="container-luxury py-12 flex flex-col md:flex-row items-center gap-8">
            <div className="md:max-w-xs">
              <p className="font-display text-2xl mb-1.5" style={{ fontWeight: 400 }}>Stay in the Loop</p>
              <p className="text-sm text-white/50">New collections, sourcing updates, and exclusive offers.</p>
            </div>
            <form className="flex flex-1 max-w-md gap-0" onSubmit={e => e.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 bg-white/8 border border-white/15 text-white placeholder:text-white/30 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <button type="submit" className="px-6 py-3 bg-gold text-charcoal text-xs font-semibold tracking-widest uppercase hover:bg-gold-light transition-colors shrink-0">
                Join
              </button>
            </form>
          </div>
        </Reveal>
      </div>

      {/* Link columns */}
      <div className="container-luxury py-14">
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {COLS.map((col) => (
            <StaggerItem key={col.heading}>
              <div>
                <p className="label-caps text-white/40 mb-5">{col.heading}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors duration-200">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Bottom bar */}
      <Reveal direction="none" delay={0.3} duration={0.6} threshold={0.1}>
        <div className="border-t border-white/10">
          <div className="container-luxury py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo + copyright */}
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{
                  textShadow: "0 0 12px rgba(212, 175, 55, 0.7), 0 0 24px rgba(212, 175, 55, 0.4)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Link href="/" className="font-display text-xl tracking-[0.25em] text-white hover:text-gold transition-colors">LUMINA</Link>
              </motion.div>
              <p className="text-xs text-white/30">© {new Date().getFullYear()} Lumina Jewelry, Inc.</p>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4">
              {[
                { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
                { href: "https://facebook.com",  icon: Facebook,  label: "Facebook" },
                { href: "https://pinterest.com", icon: PinterestIcon, label: "Pinterest" },
                { href: "https://youtube.com",   icon: Youtube,   label: "YouTube" },
              ].map(({ href, icon: Icon, label }) => (
                <MagneticHover key={label}>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center text-white/35 hover:text-white border border-white/10 hover:border-white/30 transition-all duration-200"
                    aria-label={label}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </motion.a>
                </MagneticHover>
              ))}
            </div>

            {/* Currency */}
            <select
              defaultValue="USD"
              className="bg-white/8 border border-white/15 text-white/60 text-xs px-3 py-2 focus:outline-none focus:border-gold transition-colors"
              aria-label="Currency"
            >
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </div>

          {/* Legal */}
          <div className="container-luxury pb-5 flex flex-wrap gap-4">
            {[
              ["Privacy Policy",  "/legal/privacy"],
              ["Terms of Service","/legal/terms"],
              ["Cookie Policy",   "/legal/cookies"],
              ["Accessibility",   "/legal/accessibility"],
              ["Do Not Sell",     "/legal/ccpa"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-2xs text-white/25 hover:text-white/50 transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
