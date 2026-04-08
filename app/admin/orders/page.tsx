"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
type PaymentStatus = "Paid" | "Pending" | "Refunded";

interface Order {
  orderNumber: string;
  customer: string;
  email: string;
  items: string;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  date: string;
  shippingAddress: string;
  trackingNumber: string | null;
}

/* ------------------------------------------------------------------ */
/*  Dummy data                                                         */
/* ------------------------------------------------------------------ */
const orders: Order[] = [
  {
    orderNumber: "LUM-2026-4201",
    customer: "Olivia Chen",
    email: "olivia.chen@email.com",
    items: "1.52ct Round Diamond + Petite Solitaire Setting",
    total: 12450,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    date: "2026-03-28",
    shippingAddress: "482 Park Ave, New York, NY 10022",
    trackingNumber: "1Z999AA10123456784",
  },
  {
    orderNumber: "LUM-2026-4202",
    customer: "James Whitfield",
    email: "j.whitfield@inbox.com",
    items: "2.01ct Oval Diamond + Halo Pave Band",
    total: 15200,
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    date: "2026-03-30",
    shippingAddress: "1100 Wilshire Blvd, Los Angeles, CA 90017",
    trackingNumber: "1Z999AA10123456785",
  },
  {
    orderNumber: "LUM-2026-4203",
    customer: "Sophia Marquez",
    email: "sophia.m@proton.me",
    items: "0.90ct Cushion Diamond + Vintage Milgrain Band",
    total: 4800,
    paymentStatus: "Paid",
    orderStatus: "Processing",
    date: "2026-04-02",
    shippingAddress: "77 Massachusetts Ave, Cambridge, MA 02139",
    trackingNumber: null,
  },
  {
    orderNumber: "LUM-2026-4204",
    customer: "Alexander Brooks",
    email: "alex.brooks@work.co",
    items: "1.20ct Princess Diamond + Classic Channel Set Band",
    total: 6300,
    paymentStatus: "Pending",
    orderStatus: "Pending",
    date: "2026-04-05",
    shippingAddress: "200 E Randolph St, Chicago, IL 60601",
    trackingNumber: null,
  },
  {
    orderNumber: "LUM-2026-4205",
    customer: "Isabella Fontaine",
    email: "isabella.f@gmail.com",
    items: "3.15ct Pear Diamond Loose Stone",
    total: 45000,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    date: "2026-03-15",
    shippingAddress: "1 Rodeo Dr, Beverly Hills, CA 90210",
    trackingNumber: "1Z999AA10123456786",
  },
  {
    orderNumber: "LUM-2026-4206",
    customer: "David Nakamura",
    email: "d.nakamura@email.jp",
    items: "1.75ct Emerald Diamond + Tapered Baguette Setting",
    total: 11200,
    paymentStatus: "Paid",
    orderStatus: "Processing",
    date: "2026-04-03",
    shippingAddress: "550 Madison Ave, New York, NY 10022",
    trackingNumber: null,
  },
  {
    orderNumber: "LUM-2026-4207",
    customer: "Emma Richardson",
    email: "emma.r@outlook.com",
    items: "0.85ct Marquise Diamond + Twisted Vine Band",
    total: 3950,
    paymentStatus: "Refunded",
    orderStatus: "Cancelled",
    date: "2026-03-20",
    shippingAddress: "430 N Michigan Ave, Chicago, IL 60611",
    trackingNumber: null,
  },
  {
    orderNumber: "LUM-2026-4208",
    customer: "Marcus Sullivan",
    email: "marcus.s@icloud.com",
    items: "2.30ct Radiant Diamond + Cathedral Pave Setting",
    total: 13600,
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    date: "2026-03-31",
    shippingAddress: "900 N Michigan Ave, Chicago, IL 60611",
    trackingNumber: "1Z999AA10123456787",
  },
  {
    orderNumber: "LUM-2026-4209",
    customer: "Chloe Andersson",
    email: "chloe.a@mail.se",
    items: "0.50ct Round Diamond Stud Earrings (Pair)",
    total: 2100,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    date: "2026-03-18",
    shippingAddress: "25 Columbus Cir, New York, NY 10019",
    trackingNumber: "1Z999AA10123456788",
  },
  {
    orderNumber: "LUM-2026-4210",
    customer: "Ryan Patel",
    email: "ryan.patel@company.io",
    items: "1.80ct Oval Diamond + Three-Stone Trillion Setting",
    total: 9800,
    paymentStatus: "Pending",
    orderStatus: "Pending",
    date: "2026-04-07",
    shippingAddress: "2000 Purchase St, Purchase, NY 10577",
    trackingNumber: null,
  },
];

const statuses: ("All" | OrderStatus)[] = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const orderStatusStyle: Record<OrderStatus, { bg: string; icon: React.ElementType }> = {
  Pending:    { bg: "bg-amber-100 text-amber-800",   icon: Clock },
  Processing: { bg: "bg-blue-100 text-blue-800",     icon: Package },
  Shipped:    { bg: "bg-purple-100 text-purple-800",  icon: Truck },
  Delivered:  { bg: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
  Cancelled:  { bg: "bg-red-100 text-red-800",        icon: XCircle },
};

const paymentStatusStyle: Record<PaymentStatus, string> = {
  Paid:     "text-emerald-700",
  Pending:  "text-amber-700",
  Refunded: "text-red-700",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage] = useState(1);

  const filtered = orders.filter((o) => {
    if (statusFilter !== "All" && o.orderStatus !== statusFilter) return false;
    if (
      search &&
      !o.orderNumber.toLowerCase().includes(search.toLowerCase()) &&
      !o.customer.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <section className="relative min-h-screen bg-cream px-6 py-10 lg:px-12">
      <div className="mx-auto max-w-8xl">
        {/* ---- Header ---- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-charcoal">
            Orders
          </h1>
          <button className="btn-primary flex items-center gap-2 !px-5 !py-2.5 text-xs">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* ---- Stats ---- */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Orders", value: "1,247", icon: Package },
            { label: "Pending",      value: "23",    icon: Clock },
            { label: "Processing",   value: "45",    icon: Truck },
            { label: "Completed",    value: "1,179", icon: CheckCircle },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-lg border border-warm-border bg-white p-5 shadow-luxury-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="label-caps text-warm-gray">{s.label}</p>
                  <Icon className="h-4 w-4 text-warm-gray" />
                </div>
                <p className="mt-1 font-display text-2xl font-semibold text-charcoal">
                  {s.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* ---- Filters ---- */}
        <div className="mt-8 flex flex-col gap-3 rounded-lg border border-warm-border bg-white p-4 shadow-luxury-sm sm:flex-row sm:items-end">
          <div className="w-full sm:w-48">
            <label className="label-caps mb-1 block text-warm-gray">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | OrderStatus)}
              className="input-luxury"
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="label-caps mb-1 block text-warm-gray">Date Range</label>
            <div className="flex gap-2">
              <input type="date" className="input-luxury" defaultValue="2026-03-09" />
              <input type="date" className="input-luxury" defaultValue="2026-04-08" />
            </div>
          </div>

          <div className="flex-1">
            <label className="label-caps mb-1 block text-warm-gray">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Order # or customer name"
                className="input-luxury !pl-9"
              />
            </div>
          </div>

          <button className="flex items-center gap-2 rounded border border-warm-border px-4 py-3 text-sm text-charcoal transition-colors hover:bg-cream-dark">
            <Filter className="h-4 w-4" />
            Reset
          </button>
        </div>

        {/* ---- Table ---- */}
        <div className="mt-6 overflow-x-auto rounded-lg border border-warm-border bg-white shadow-luxury-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-warm-border bg-cream">
                <th className="label-caps px-4 py-3 text-warm-gray">Order #</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Customer</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Email</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Items</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Total</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Payment</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Status</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Date</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const StatusIcon = orderStatusStyle[o.orderStatus].icon;
                return (
                  <tr
                    key={o.orderNumber}
                    onClick={() => setSelectedOrder(o)}
                    className="cursor-pointer border-b border-warm-border transition-colors last:border-0 hover:bg-cream/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-charcoal">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-charcoal">{o.customer}</td>
                    <td className="px-4 py-3 text-warm-gray">{o.email}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-charcoal" title={o.items}>
                      {o.items}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-display font-semibold text-charcoal">
                      {fmt(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${paymentStatusStyle[o.paymentStatus]}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${orderStatusStyle[o.orderStatus].bg}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-warm-gray">
                      {formatDate(o.date)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(o);
                        }}
                        className="rounded p-1 text-warm-gray transition-colors hover:bg-cream hover:text-charcoal"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-warm-gray">
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ---- Pagination ---- */}
        <div className="mt-4 flex items-center justify-between text-sm text-warm-gray">
          <span>
            Showing <span className="font-medium text-charcoal">1&ndash;10</span> of{" "}
            <span className="font-medium text-charcoal">1,247</span> orders
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              className="rounded border border-warm-border p-2 transition-colors hover:bg-cream disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                className={`min-w-[2rem] rounded border px-2 py-1.5 text-center transition-colors ${
                  p === currentPage
                    ? "border-charcoal bg-charcoal font-semibold text-white"
                    : "border-warm-border hover:bg-cream"
                }`}
              >
                {p}
              </button>
            ))}
            <span className="px-1">...</span>
            <button className="min-w-[2rem] rounded border border-warm-border px-2 py-1.5 text-center transition-colors hover:bg-cream">
              125
            </button>
            <button className="rounded border border-warm-border p-2 transition-colors hover:bg-cream">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Order Detail Slide-Out Panel                                     */}
      {/* ================================================================ */}
      {selectedOrder && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Panel */}
          <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-warm-border bg-white shadow-luxury-lg animate-fade-in">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-warm-border px-6 py-5">
              <div>
                <p className="label-caps text-warm-gray">Order Details</p>
                <h2 className="font-display text-xl font-semibold text-charcoal">
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded p-2 text-warm-gray transition-colors hover:bg-cream hover:text-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Status badge */}
              {(() => {
                const StatusIcon = orderStatusStyle[selectedOrder.orderStatus].icon;
                return (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${orderStatusStyle[selectedOrder.orderStatus].bg}`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    {selectedOrder.orderStatus}
                  </span>
                );
              })()}

              {/* Customer info */}
              <div className="mt-6 rounded-lg border border-warm-border p-4">
                <p className="label-caps mb-3 text-warm-gray">Customer Information</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Name</span>
                    <span className="font-medium text-charcoal">{selectedOrder.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Email</span>
                    <span className="text-charcoal">{selectedOrder.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Shipping Address</span>
                    <span className="text-right text-charcoal">{selectedOrder.shippingAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order items */}
              <div className="mt-4 rounded-lg border border-warm-border p-4">
                <p className="label-caps mb-3 text-warm-gray">Order Items</p>
                <div className="text-sm text-charcoal">{selectedOrder.items}</div>
              </div>

              {/* Payment & totals */}
              <div className="mt-4 rounded-lg border border-warm-border p-4">
                <p className="label-caps mb-3 text-warm-gray">Payment</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Payment Status</span>
                    <span className={`font-semibold ${paymentStatusStyle[selectedOrder.paymentStatus]}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Subtotal</span>
                    <span className="text-charcoal">{fmt(selectedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Shipping</span>
                    <span className="text-charcoal">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-warm-border pt-2">
                    <span className="font-semibold text-charcoal">Total</span>
                    <span className="font-display text-lg font-semibold text-charcoal">
                      {fmt(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tracking */}
              <div className="mt-4 rounded-lg border border-warm-border p-4">
                <p className="label-caps mb-3 text-warm-gray">Shipping & Tracking</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Order Date</span>
                    <span className="text-charcoal">{formatDate(selectedOrder.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Tracking #</span>
                    <span className="font-medium text-charcoal">
                      {selectedOrder.trackingNumber ?? "Not available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel footer */}
            <div className="border-t border-warm-border px-6 py-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 rounded border border-warm-border px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-cream"
                >
                  Close
                </button>
                <button className="btn-primary flex-1 !py-2.5 text-xs">
                  Update Order
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </section>
  );
}
