"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type DiamondStatus = "Available" | "Reserved" | "Sold";

interface Diamond {
  id: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  origin: "Natural" | "Lab Grown";
  price: number;
  certLab: string;
  status: DiamondStatus;
}

/* ------------------------------------------------------------------ */
/*  Dummy data                                                         */
/* ------------------------------------------------------------------ */
const diamonds: Diamond[] = [
  { id: "DIA-10421", shape: "Round",     carat: 1.52, color: "D",  clarity: "VVS1",  cut: "Ideal",     origin: "Natural",   price: 18750, certLab: "GIA", status: "Available" },
  { id: "DIA-10422", shape: "Oval",      carat: 2.01, color: "E",  clarity: "VS1",   cut: "Excellent", origin: "Natural",   price: 24300, certLab: "GIA", status: "Reserved"  },
  { id: "DIA-10423", shape: "Emerald",   carat: 1.75, color: "F",  clarity: "VVS2",  cut: "Excellent", origin: "Lab Grown", price: 8400,  certLab: "IGI", status: "Available" },
  { id: "DIA-10424", shape: "Cushion",   carat: 0.90, color: "G",  clarity: "SI1",   cut: "Very Good", origin: "Natural",   price: 3200,  certLab: "AGS", status: "Available" },
  { id: "DIA-10425", shape: "Pear",      carat: 3.15, color: "D",  clarity: "FL",    cut: "Ideal",     origin: "Natural",   price: 45000, certLab: "GIA", status: "Sold"      },
  { id: "DIA-10426", shape: "Princess",  carat: 1.20, color: "H",  clarity: "VS2",   cut: "Excellent", origin: "Lab Grown", price: 4100,  certLab: "IGI", status: "Available" },
  { id: "DIA-10427", shape: "Marquise",  carat: 0.85, color: "E",  clarity: "SI2",   cut: "Very Good", origin: "Natural",   price: 2650,  certLab: "GIA", status: "Reserved"  },
  { id: "DIA-10428", shape: "Radiant",   carat: 2.30, color: "F",  clarity: "VS1",   cut: "Ideal",     origin: "Lab Grown", price: 9800,  certLab: "IGI", status: "Available" },
  { id: "DIA-10429", shape: "Round",     carat: 0.50, color: "J",  clarity: "VS2",   cut: "Very Good", origin: "Natural",   price: 1200,  certLab: "AGS", status: "Available" },
  { id: "DIA-10430", shape: "Oval",      carat: 1.80, color: "G",  clarity: "VVS1",  cut: "Excellent", origin: "Lab Grown", price: 7500,  certLab: "IGI", status: "Sold"      },
];

const shapes = ["All Shapes", "Round", "Oval", "Emerald", "Cushion", "Pear", "Princess", "Marquise", "Radiant"];
const origins = ["All Origins", "Natural", "Lab Grown"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const statusColor: Record<DiamondStatus, string> = {
  Available: "bg-emerald-100 text-emerald-800",
  Reserved:  "bg-amber-100 text-amber-800",
  Sold:      "bg-red-100 text-red-800",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function DiamondInventoryPage() {
  const [shapeFilter, setShapeFilter] = useState("All Shapes");
  const [originFilter, setOriginFilter] = useState("All Origins");
  const [search, setSearch] = useState("");
  const [currentPage] = useState(1);

  const filtered = diamonds.filter((d) => {
    if (shapeFilter !== "All Shapes" && d.shape !== shapeFilter) return false;
    if (originFilter !== "All Origins" && d.origin !== originFilter) return false;
    if (search && !d.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <section className="min-h-screen bg-cream px-6 py-10 lg:px-12">
      <div className="mx-auto max-w-8xl">
        {/* ---- Header ---- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-charcoal">
            Diamond Inventory
          </h1>
          <div className="flex gap-3">
            <button className="btn-primary flex items-center gap-2 !px-5 !py-2.5 text-xs">
              <Download className="h-4 w-4" />
              Sync from RapNet
            </button>
            <button className="btn-primary flex items-center gap-2 !px-5 !py-2.5 text-xs">
              <Plus className="h-4 w-4" />
              Add Diamond
            </button>
          </div>
        </div>

        {/* ---- Stats ---- */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Diamonds", value: "200" },
            { label: "Natural",        value: "120" },
            { label: "Lab Grown",      value: "80" },
            { label: "Average Price",  value: "$4,250" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-warm-border bg-white p-5 shadow-luxury-sm"
            >
              <p className="label-caps text-warm-gray">{s.label}</p>
              <p className="mt-1 font-display text-2xl font-semibold text-charcoal">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ---- Filters ---- */}
        <div className="mt-8 flex flex-col gap-3 rounded-lg border border-warm-border bg-white p-4 shadow-luxury-sm sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="label-caps mb-1 block text-warm-gray">Shape</label>
            <select
              value={shapeFilter}
              onChange={(e) => setShapeFilter(e.target.value)}
              className="input-luxury"
            >
              {shapes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="label-caps mb-1 block text-warm-gray">Origin</label>
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="input-luxury"
            >
              {origins.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="label-caps mb-1 block text-warm-gray">Price Range</label>
            <div className="flex gap-2">
              <input type="text" placeholder="Min" className="input-luxury" />
              <input type="text" placeholder="Max" className="input-luxury" />
            </div>
          </div>

          <div className="flex-1">
            <label className="label-caps mb-1 block text-warm-gray">Search Cert #</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. DIA-10421"
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
                <th className="label-caps px-4 py-3 text-warm-gray">ID</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Shape</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Carat</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Color</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Clarity</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Cut</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Origin</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Price</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Cert Lab</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Status</th>
                <th className="label-caps px-4 py-3 text-warm-gray">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-warm-border transition-colors last:border-0 hover:bg-cream/60"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-charcoal">{d.id}</td>
                  <td className="px-4 py-3 text-charcoal">{d.shape}</td>
                  <td className="px-4 py-3 font-display text-charcoal">{d.carat.toFixed(2)}</td>
                  <td className="px-4 py-3 text-charcoal">{d.color}</td>
                  <td className="px-4 py-3 text-charcoal">{d.clarity}</td>
                  <td className="px-4 py-3 text-charcoal">{d.cut}</td>
                  <td className="px-4 py-3 text-charcoal">{d.origin}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-display font-semibold text-charcoal">
                    {fmt(d.price)}
                  </td>
                  <td className="px-4 py-3 text-charcoal">{d.certLab}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[d.status]}`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded p-1 text-warm-gray transition-colors hover:bg-cream hover:text-charcoal" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-warm-gray transition-colors hover:bg-cream hover:text-charcoal" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-warm-gray transition-colors hover:bg-red-50 hover:text-red-600" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-warm-gray">
                    No diamonds match your filters.
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
            <span className="font-medium text-charcoal">200</span> diamonds
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
              20
            </button>
            <button className="rounded border border-warm-border p-2 transition-colors hover:bg-cream">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
