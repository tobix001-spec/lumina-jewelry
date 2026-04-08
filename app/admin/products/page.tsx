"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Image,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

/* ─── Dummy Data ──────────────────────────────────────────────────────────── */

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Out of Stock";
  image: string;
}

const products: Product[] = [
  { id: 1,  name: "Eternal Brilliance Solitaire Ring",    sku: "ER-1001", category: "Engagement Rings", price: 5200,  stock: 12, status: "Active",       image: "/generated/ring-1.jpg" },
  { id: 2,  name: "Royal Halo Diamond Ring",              sku: "ER-1002", category: "Engagement Rings", price: 8500,  stock: 4,  status: "Active",       image: "/generated/ring-2.jpg" },
  { id: 3,  name: "Grace Pavé Engagement Ring",           sku: "ER-1003", category: "Engagement Rings", price: 3750,  stock: 0,  status: "Out of Stock", image: "/generated/ring-3.jpg" },
  { id: 4,  name: "Infinity Twist Engagement Ring",       sku: "ER-1004", category: "Engagement Rings", price: 1200,  stock: 22, status: "Active",       image: "/generated/ring-4.jpg" },
  { id: 5,  name: "Classic Platinum Wedding Band",        sku: "WB-2001", category: "Wedding Bands",    price: 1800,  stock: 30, status: "Active",       image: "/generated/ring-5.jpg" },
  { id: 6,  name: "Diamond Eternity Wedding Band",        sku: "WB-2002", category: "Wedding Bands",    price: 3500,  stock: 8,  status: "Active",       image: "/generated/ring-6.jpg" },
  { id: 7,  name: "Milgrain Gold Wedding Band",           sku: "WB-2003", category: "Wedding Bands",    price: 400,   stock: 0,  status: "Draft",        image: "/generated/ring-7.jpg" },
  { id: 8,  name: "Comfort Fit Rose Gold Band",           sku: "WB-2004", category: "Wedding Bands",    price: 950,   stock: 15, status: "Active",       image: "/generated/ring-8.jpg" },
  { id: 9,  name: "Cascading Diamond Pendant Necklace",   sku: "NK-3001", category: "Necklaces",        price: 4200,  stock: 6,  status: "Active",       image: "/generated/necklace-1.jpg" },
  { id: 10, name: "Pearl & Gold Station Necklace",        sku: "NK-3002", category: "Necklaces",        price: 800,   stock: 18, status: "Active",       image: "/generated/necklace-1.jpg" },
  { id: 11, name: "Sapphire Halo Drop Necklace",          sku: "NK-3003", category: "Necklaces",        price: 5000,  stock: 0,  status: "Out of Stock", image: "/generated/necklace-1.jpg" },
  { id: 12, name: "Diamond Stud Earrings",                sku: "EA-4001", category: "Earrings",         price: 2500,  stock: 20, status: "Active",       image: "/generated/earring-1.jpg" },
  { id: 13, name: "Gold Huggie Hoop Earrings",            sku: "EA-4002", category: "Earrings",         price: 300,   stock: 0,  status: "Draft",        image: "/generated/earring-1.jpg" },
  { id: 14, name: "Tennis Diamond Bracelet",               sku: "BR-5001", category: "Bracelets",        price: 4000,  stock: 3,  status: "Active",       image: "/generated/bracelet-1.jpg" },
  { id: 15, name: "Woven Gold Chain Bracelet",             sku: "BR-5002", category: "Bracelets",        price: 500,   stock: 25, status: "Active",       image: "/generated/bracelet-1.jpg" },
];

const categories = ["All", "Engagement Rings", "Wedding Bands", "Necklaces", "Earrings", "Bracelets"];
const statuses   = ["All", "Active", "Draft", "Out of Stock"];
const metalTypes = ["18K White Gold", "18K Yellow Gold", "18K Rose Gold", "Platinum", "Sterling Silver"];

/* ─── Status Badge ────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: Product["status"] }) {
  const styles: Record<Product["status"], string> = {
    Active:       "bg-green-50 text-green-700 border-green-200",
    Draft:        "bg-stone-100 text-stone-500 border-stone-200",
    "Out of Stock": "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ─── Page Component ──────────────────────────────────────────────────────── */

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  /* Filtered list */
  const filtered = products.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesStatus   = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold text-charcoal tracking-tight">
            Products
          </h1>
          <a
            href="/admin/products/new"
            className="btn-primary gap-2"
          >
            <Plus size={16} />
            Add Product
          </a>
        </div>

        {/* ── Filters / Search ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-luxury pl-10"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-luxury sm:w-52"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-luxury sm:w-44"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <div className="bg-white border border-warm-border rounded-lg overflow-x-auto shadow-luxury-sm">
          <table className="w-full text-sm text-charcoal">
            <thead>
              <tr className="border-b border-warm-border bg-cream-dark">
                <th className="label-caps px-4 py-3 text-left">Image</th>
                <th className="label-caps px-4 py-3 text-left">Name</th>
                <th className="label-caps px-4 py-3 text-left">SKU</th>
                <th className="label-caps px-4 py-3 text-left">Category</th>
                <th className="label-caps px-4 py-3 text-right">Price</th>
                <th className="label-caps px-4 py-3 text-right">Stock</th>
                <th className="label-caps px-4 py-3 text-left">Status</th>
                <th className="label-caps px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-warm-border last:border-b-0 hover:bg-cream/60 transition-colors"
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded overflow-hidden bg-cream-dark flex items-center justify-center border border-warm-border">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).parentElement!.innerHTML =
                            '<span class="text-warm-gray"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></span>';
                        }}
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3 font-medium">{product.name}</td>

                  {/* SKU */}
                  <td className="px-4 py-3 text-warm-gray font-mono text-xs">
                    {product.sku}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">{product.category}</td>

                  {/* Price */}
                  <td className="px-4 py-3 text-right font-medium">
                    ${product.price.toLocaleString()}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3 text-right">{product.stock}</td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={product.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/admin/products/${product.sku}`}
                        className="p-2 rounded hover:bg-cream-dark transition-colors text-charcoal"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit size={15} />
                      </a>
                      <button
                        className="p-2 rounded hover:bg-red-50 transition-colors text-red-500"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-warm-gray">
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-warm-gray">
            Showing <span className="font-medium text-charcoal">1-15</span> of{" "}
            <span className="font-medium text-charcoal">186</span> products
          </p>
          <div className="flex items-center gap-1">
            <button className="btn-outline px-3 py-2 text-xs" disabled>
              <ChevronLeft size={14} />
              Previous
            </button>
            <button className="btn-outline px-3 py-2 text-xs">
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Add Product Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white w-full max-w-lg mx-4 p-8 shadow-luxury-lg animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-cream-dark rounded transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
              Add New Product
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowModal(false);
              }}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label className="label-caps block mb-1.5 text-charcoal">Name</label>
                <input type="text" className="input-luxury" placeholder="e.g. Eternal Diamond Ring" required />
              </div>

              {/* SKU */}
              <div>
                <label className="label-caps block mb-1.5 text-charcoal">SKU</label>
                <input type="text" className="input-luxury" placeholder="e.g. ER-1005" required />
              </div>

              {/* Category & Metal Type row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-caps block mb-1.5 text-charcoal">Category</label>
                  <select className="input-luxury" required>
                    <option value="">Select category</option>
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-caps block mb-1.5 text-charcoal">Metal Type</label>
                  <select className="input-luxury" required>
                    <option value="">Select metal</option>
                    {metalTypes.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-caps block mb-1.5 text-charcoal">Price ($)</label>
                  <input type="number" className="input-luxury" placeholder="0.00" min="0" step="0.01" required />
                </div>
                <div>
                  <label className="label-caps block mb-1.5 text-charcoal">Stock</label>
                  <input type="number" className="input-luxury" placeholder="0" min="0" required />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label-caps block mb-1.5 text-charcoal">Description</label>
                <textarea
                  className="input-luxury min-h-[100px] resize-y"
                  placeholder="Describe the product..."
                  rows={3}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="label-caps block mb-1.5 text-charcoal">Image URL</label>
                <div className="relative">
                  <Image
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none"
                  />
                  <input
                    type="text"
                    className="input-luxury pl-10"
                    placeholder="/generated/ring-1.jpg"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline px-6 py-2.5 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2.5 text-xs">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
