"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./navData";
import type { NavItem } from "@/types";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, ChevronRight, MapPin, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Promo Banner ─────────────────────────────────────────────────────────── */
function PromoBanner() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (sessionStorage.getItem("promo_v2")) setVisible(false);
  }, []);
  if (!visible) return null;
  return (
    <div className="relative bg-charcoal text-white text-center py-2.5 px-10" role="banner">
      <p className="text-2xs tracking-[0.18em] uppercase font-medium">
        Complimentary 1/4ct Lab Diamond Studs on orders over $1,000 &nbsp;·&nbsp;
        <span className="underline underline-offset-2 cursor-pointer">Code STUDS25</span>
      </p>
      <button
        onClick={() => { setVisible(false); sessionStorage.setItem("promo_v2","1"); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ── Mega Menu ────────────────────────────────────────────────────────────── */
function MegaMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  if (!item.groups?.length) return null;
  const cols = Math.min(item.groups.length, 4);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-0 right-0 bg-white border-t border-warm-border shadow-luxury-lg z-50"
      role="region"
      aria-label={`${item.label} menu`}
    >
      <div className="container-luxury py-10">
        <div className="grid gap-10" style={{ gridTemplateColumns: `repeat(${cols},1fr) 280px` }}>
          {item.groups.map((group) => (
            <div key={group.heading}>
              <p className="label-caps text-warm-gray mb-4">{group.heading}</p>
              <ul className="space-y-2.5">
                {group.items.map((nav) => (
                  <li key={nav.href}>
                    <Link
                      href={nav.href}
                      onClick={onClose}
                      className="group flex items-center gap-2 text-sm text-charcoal/70 hover:text-charcoal transition-colors duration-200"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-gold transition-all duration-300 shrink-0" />
                      {nav.label}
                      {nav.isNew && (
                        <span className="text-2xs font-semibold px-1.5 py-0.5 bg-gold/15 text-gold-dark rounded-sm tracking-wide">NEW</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Right panel */}
          <div className="border-l border-warm-border pl-10">
            {item.featured && (
              <>
                <p className="label-caps text-warm-gray mb-4">Resources</p>
                <div className="space-y-5 mb-8">
                  {item.featured.map((f) => (
                    <Link key={f.href} href={f.href} onClick={onClose} className="group block">
                      <p className="text-sm font-medium text-charcoal group-hover:text-gold-dark transition-colors flex items-center gap-1.5">
                        {f.label}
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                      </p>
                      {f.description && <p className="text-xs text-warm-gray mt-0.5">{f.description}</p>}
                    </Link>
                  ))}
                </div>
              </>
            )}
            <div className="space-y-3 pt-5 border-t border-warm-border">
              <Link href="/showrooms" onClick={onClose} className="flex items-center gap-2.5 text-xs text-warm-gray hover:text-charcoal transition-colors group">
                <span className="w-7 h-7 rounded-full border border-warm-border flex items-center justify-center group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-white transition-all">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                Visit a Showroom
              </Link>
              <Link href="/appointments/book" onClick={onClose} className="flex items-center gap-2.5 text-xs text-warm-gray hover:text-charcoal transition-colors group">
                <span className="w-7 h-7 rounded-full border border-warm-border flex items-center justify-center group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-white transition-all">
                  <Calendar className="w-3.5 h-3.5" />
                </span>
                Book Virtual Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Mobile Drawer ────────────────────────────────────────────────────────── */
function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        className={cn("fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300", open ? "opacity-100" : "opacity-0 pointer-events-none")}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn("fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-cream z-50 flex flex-col lg:hidden transition-transform duration-400 shadow-luxury-xl", open ? "translate-x-0" : "-translate-x-full")}
        role="dialog" aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-warm-border">
          <Link href="/" onClick={onClose} className="font-display text-2xl tracking-[0.25em] text-charcoal">LUMINA</Link>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-warm-gray hover:text-charcoal transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="border-b border-warm-border/60">
              {item.groups ? (
                <>
                  <button
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-charcoal"
                    onClick={() => setExpanded(e => e === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown className={cn("w-4 h-4 text-warm-gray transition-transform duration-200", expanded === item.label && "rotate-180")} />
                  </button>
                  {expanded === item.label && (
                    <div className="bg-cream-dark pb-4 animate-fade-in">
                      {item.groups.map(g => (
                        <div key={g.heading} className="px-6 pt-4">
                          <p className="label-caps text-warm-gray mb-2.5">{g.heading}</p>
                          {g.items.map(nav => (
                            <Link key={nav.href} href={nav.href} onClick={onClose}
                              className="block py-1.5 text-sm text-charcoal/70 hover:text-charcoal transition-colors">
                              {nav.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href ?? "/"} onClick={onClose}
                  className="block px-6 py-4 text-sm font-medium text-charcoal hover:text-gold-dark transition-colors">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer links */}
        <div className="border-t border-warm-border px-6 py-5 space-y-3">
          {[
            { icon: MapPin, label: "Visit a Showroom", href: "/showrooms" },
            { icon: Calendar, label: "Book Appointment", href: "/appointments/book" },
            { icon: User, label: "My Account", href: "/account" },
          ].map(({ icon: Icon, label, href }) => (
            <Link key={href} href={href} onClick={onClose}
              className="flex items-center gap-3 text-sm text-warm-gray hover:text-charcoal transition-colors">
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Main Header ──────────────────────────────────────────────────────────── */
export function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => { setActiveMenu(null); setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onEnter = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  }, []);
  const onLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 140);
  }, []);
  const close = useCallback(() => setActiveMenu(null), []);

  return (
    <>
      <PromoBanner />
      <header
        className={cn(
          "sticky top-0 z-30 bg-white transition-all duration-300",
          scrolled ? "shadow-luxury-sm border-b border-warm-border/60" : "border-b border-transparent"
        )}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-[68px]">
            {/* Hamburger */}
            <button className="lg:hidden p-2 -ml-2 text-charcoal" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="font-display text-[1.6rem] tracking-[0.28em] text-charcoal hover:text-gold-dark transition-colors duration-300 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              LUMINA
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} onMouseEnter={() => onEnter(item.label)} onMouseLeave={onLeave} className="relative">
                  <button
                    className={cn(
                      "flex items-center gap-1 px-3.5 py-2 label-caps transition-colors duration-200",
                      activeMenu === item.label ? "text-charcoal" : "text-warm-gray hover:text-charcoal"
                    )}
                    aria-expanded={activeMenu === item.label}
                  >
                    {item.label}
                    {item.groups && (
                      <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", activeMenu === item.label && "rotate-180")} />
                    )}
                  </button>
                  {/* Active underline */}
                  <div className={cn("absolute bottom-0 left-3.5 right-3.5 h-px bg-charcoal transition-opacity duration-200", activeMenu === item.label ? "opacity-100" : "opacity-0")} />
                </div>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-0.5">
              {[
                { href: null, icon: Search, label: "Search" },
                { href: "/wishlist", icon: Heart, label: "Wishlist" },
                { href: "/account", icon: User, label: "Account" },
                { href: "/cart", icon: ShoppingBag, label: "Cart" },
              ].map(({ href, icon: Icon, label }) => {
                const cls = "w-10 h-10 flex items-center justify-center text-warm-gray hover:text-charcoal transition-colors rounded-full hover:bg-cream duration-200 relative";
                const inner = (
                  <>
                    <Icon className="w-[18px] h-[18px]" />
                    {label === "Cart" && (
                      <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-charcoal text-white text-2xs font-semibold rounded-full flex items-center justify-center leading-none">0</span>
                    )}
                  </>
                );
                return href ? (
                  <Link key={label} href={href} className={cls} aria-label={label}>{inner}</Link>
                ) : (
                  <button key={label} className={cls} aria-label={label}>{inner}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {activeMenu && (() => {
            const item = NAV_ITEMS.find(i => i.label === activeMenu);
            return item ? (
              <div key={activeMenu} onMouseEnter={() => onEnter(activeMenu)} onMouseLeave={onLeave}>
                <MegaMenu item={item} onClose={close} />
              </div>
            ) : null;
          })()}
        </AnimatePresence>
      </header>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
