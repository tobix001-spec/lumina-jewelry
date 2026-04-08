"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Diamond,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";

/* ─── Stat Cards Data ──────────────────────────────────────────────────────── */
const stats = [
  {
    label: "Total Revenue",
    value: "$2.4M",
    change: +12.5,
    icon: DollarSign,
    accent: "#C9A84C",
  },
  {
    label: "Orders",
    value: "1,247",
    change: +8.2,
    icon: ShoppingCart,
    accent: "#5B8C5A",
  },
  {
    label: "Products",
    value: "186",
    change: -2.4,
    icon: Package,
    accent: "#7C6EAF",
  },
  {
    label: "Diamonds",
    value: "200",
    change: +15.3,
    icon: Diamond,
    accent: "#4A90D9",
  },
];

/* ─── Recent Orders Data ───────────────────────────────────────────────────── */
const recentOrders = [
  {
    id: "#LUM-4821",
    customer: "Sophia Laurent",
    items: "Diamond Solitaire Ring",
    total: "$12,450",
    status: "Delivered",
    date: "Apr 7, 2026",
  },
  {
    id: "#LUM-4820",
    customer: "James Chen",
    items: "Platinum Wedding Band",
    total: "$3,890",
    status: "Shipped",
    date: "Apr 6, 2026",
  },
  {
    id: "#LUM-4819",
    customer: "Olivia Martinez",
    items: "Emerald Cut Pendant",
    total: "$8,720",
    status: "Processing",
    date: "Apr 6, 2026",
  },
  {
    id: "#LUM-4818",
    customer: "Alexander Kim",
    items: "Tennis Bracelet, Stud Earrings",
    total: "$15,300",
    status: "Delivered",
    date: "Apr 5, 2026",
  },
  {
    id: "#LUM-4817",
    customer: "Isabella Ross",
    items: "Oval Halo Engagement Ring",
    total: "$18,900",
    status: "Pending",
    date: "Apr 5, 2026",
  },
];

/* ─── Revenue Chart Data (last 7 days) ─────────────────────────────────────── */
const revenueData = [
  { day: "Mon", value: 42000, pct: 56 },
  { day: "Tue", value: 58000, pct: 77 },
  { day: "Wed", value: 35000, pct: 47 },
  { day: "Thu", value: 72000, pct: 96 },
  { day: "Fri", value: 65000, pct: 87 },
  { day: "Sat", value: 75000, pct: 100 },
  { day: "Sun", value: 48000, pct: 64 },
];

/* ─── Top Selling Products ─────────────────────────────────────────────────── */
const topProducts = [
  {
    name: "Diamond Solitaire Ring",
    sales: 142,
    revenue: "$1.2M",
    image: "/images/products/ring-solitaire.jpg",
  },
  {
    name: "Platinum Tennis Bracelet",
    sales: 98,
    revenue: "$784K",
    image: "/images/products/bracelet-tennis.jpg",
  },
  {
    name: "Oval Halo Pendant",
    sales: 87,
    revenue: "$521K",
    image: "/images/products/pendant-halo.jpg",
  },
  {
    name: "Emerald Cut Studs",
    sales: 76,
    revenue: "$456K",
    image: "/images/products/studs-emerald.jpg",
  },
  {
    name: "Cushion Cut Engagement Ring",
    sales: 64,
    revenue: "$384K",
    image: "/images/products/ring-cushion.jpg",
  },
];

/* ─── Status Badge ─────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-green-50 text-green-700 border-green-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
}

/* ─── Animation Variants ───────────────────────────────────────────────────── */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

/* ─── Dashboard Page ───────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-[1400px] mx-auto"
    >
      {/* Page Header */}
      <motion.div variants={item}>
        <h1
          className="text-2xl lg:text-3xl font-semibold tracking-tight"
          style={{ color: "#1A1714", fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B6560" }}>
          Welcome back. Here is what is happening with your store today.
        </p>
      </motion.div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────────── */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          const positive = stat.change >= 0;
          return (
            <div
              key={stat.label}
              className="card-luxury relative overflow-hidden rounded-xl p-5 lg:p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#6B6560" }}>
                    {stat.label}
                  </p>
                  <p
                    className="mt-2 text-2xl lg:text-3xl font-semibold tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "#1A1714" }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{ background: `${stat.accent}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.accent }} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {positive ? (
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                )}
                <span
                  className={`text-xs font-semibold ${
                    positive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {positive ? "+" : ""}
                  {stat.change}%
                </span>
                <span className="text-xs" style={{ color: "#A89E95" }}>
                  vs last month
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ── Revenue Chart + Top Products ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Revenue Chart */}
        <motion.div
          variants={item}
          className="lg:col-span-2 card-luxury relative overflow-hidden rounded-xl p-5 lg:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: "#1A1714", fontFamily: "var(--font-display)" }}
              >
                Revenue Overview
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#6B6560" }}>
                Last 7 days
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: "#C9A84C" }} />
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "#1A1714" }}
              >
                $395K
              </span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 lg:gap-4 h-48">
            {revenueData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-2xs font-medium" style={{ color: "#6B6560" }}>
                  ${(d.value / 1000).toFixed(0)}K
                </span>
                <motion.div
                  className="w-full rounded-t-md"
                  style={{ background: i === 5 ? "#C9A84C" : "#E8D5A3" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${d.pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                />
                <span className="text-2xs font-medium" style={{ color: "#A89E95" }}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Selling Products */}
        <motion.div
          variants={item}
          className="card-luxury relative overflow-hidden rounded-xl p-5 lg:p-6"
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "#1A1714", fontFamily: "var(--font-display)" }}
          >
            Top Selling
          </h2>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div
                key={product.name}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream-dark/50 transition-colors"
              >
                {/* Product image placeholder */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{
                    background: "#F2EDE6",
                    color: "#C9A84C",
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "#1A1714" }}
                  >
                    {product.name}
                  </p>
                  <p className="text-xs" style={{ color: "#6B6560" }}>
                    {product.sales} sold
                  </p>
                </div>
                <span
                  className="text-sm font-semibold flex-shrink-0"
                  style={{ fontFamily: "var(--font-display)", color: "#1A1714" }}
                >
                  {product.revenue}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Recent Orders Table ─────────────────────────────────────────────────── */}
      <motion.div
        variants={item}
        className="card-luxury relative overflow-hidden rounded-xl"
      >
        <div className="p-5 lg:p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-semibold"
              style={{ color: "#1A1714", fontFamily: "var(--font-display)" }}
            >
              Recent Orders
            </h2>
            <button className="text-xs font-semibold tracking-wider uppercase hover:underline" style={{ color: "#C9A84C" }}>
              View All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr
                className="text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#6B6560" }}
              >
                <th className="px-5 lg:px-6 py-3">Order</th>
                <th className="px-5 lg:px-6 py-3">Customer</th>
                <th className="px-5 lg:px-6 py-3 hidden sm:table-cell">Items</th>
                <th className="px-5 lg:px-6 py-3">Total</th>
                <th className="px-5 lg:px-6 py-3">Status</th>
                <th className="px-5 lg:px-6 py-3 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-cream-dark/30 transition-colors"
                >
                  <td className="px-5 lg:px-6 py-4">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#1A1714" }}
                    >
                      {order.id}
                    </span>
                  </td>
                  <td className="px-5 lg:px-6 py-4">
                    <span className="text-sm" style={{ color: "#1A1714" }}>
                      {order.customer}
                    </span>
                  </td>
                  <td className="px-5 lg:px-6 py-4 hidden sm:table-cell">
                    <span className="text-sm" style={{ color: "#6B6560" }}>
                      {order.items}
                    </span>
                  </td>
                  <td className="px-5 lg:px-6 py-4">
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "#1A1714" }}
                    >
                      {order.total}
                    </span>
                  </td>
                  <td className="px-5 lg:px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 lg:px-6 py-4 hidden md:table-cell">
                    <span className="text-sm" style={{ color: "#A89E95" }}>
                      {order.date}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
