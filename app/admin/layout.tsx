"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Diamond,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Diamonds", href: "/admin/diamonds", icon: Diamond },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <Diamond className="w-5 h-5 text-[#C9A84C]" />
          <span
            className="font-display text-lg tracking-[0.15em] text-white font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            LUMINA <span className="text-[#C9A84C]">ADMIN</span>
          </span>
        </Link>
        {/* Desktop collapse */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-white/60" />
        </button>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 relative
                ${
                  active
                    ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {active && (
                <motion.div
                  layoutId="admin-nav-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[#C9A84C]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={`w-[18px] h-[18px] flex-shrink-0 ${
                  active ? "text-[#C9A84C]" : "text-white/40 group-hover:text-white/70"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] text-xs font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">Admin</p>
            <p className="text-xs text-white/40 truncate">admin@lumina.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#FAF8F5" }}>
      {/* Desktop Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:flex flex-col flex-shrink-0 overflow-hidden"
            style={{ background: "#1A1714" }}
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
              style={{ background: "#1A1714" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header
          className="flex items-center justify-between h-16 px-4 lg:px-8 flex-shrink-0 border-b"
          style={{
            background: "#ffffff",
            borderColor: "var(--border, #E8E2DA)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-cream-dark transition-colors"
            >
              <Menu className="w-5 h-5" style={{ color: "#1A1714" }} />
            </button>

            {/* Collapsed sidebar reopen */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-cream-dark transition-colors"
              >
                <Menu className="w-5 h-5" style={{ color: "#1A1714" }} />
              </button>
            )}

            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
              <input
                type="text"
                placeholder="Search products, orders..."
                className="input-luxury pl-10 pr-4 py-2 text-sm rounded-lg w-64 lg:w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-cream-dark transition-colors">
              <Bell className="w-[18px] h-[18px]" style={{ color: "#6B6560" }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C9A84C] ring-2 ring-white" />
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-3 border-l" style={{ borderColor: "var(--border)" }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "#1A1714", color: "#C9A84C" }}
              >
                A
              </div>
              <span className="hidden sm:block text-sm font-medium" style={{ color: "#1A1714" }}>
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main
          className="flex-1 overflow-y-auto p-4 lg:p-8"
          style={{ background: "#FAF8F5" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
