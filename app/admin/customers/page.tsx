"use client";

import React, { useState } from "react";
import { Search, Download, Mail, Eye, ChevronLeft, ChevronRight, Users, UserPlus, ShoppingBag, DollarSign } from "lucide-react";

const CUSTOMERS = [
  { id: "CUS-001", name: "Emily Thompson", email: "emily.t@gmail.com", phone: "+1 (212) 555-0101", orders: 5, spent: 24500, joined: "2025-08-14", status: "VIP" },
  { id: "CUS-002", name: "Michael Chen", email: "m.chen@outlook.com", phone: "+1 (415) 555-0202", orders: 3, spent: 12800, joined: "2025-11-02", status: "Active" },
  { id: "CUS-003", name: "Sarah Williams", email: "sarah.w@yahoo.com", phone: "+1 (310) 555-0303", orders: 7, spent: 38200, joined: "2024-06-18", status: "VIP" },
  { id: "CUS-004", name: "James Rodriguez", email: "j.rodriguez@gmail.com", phone: "+1 (773) 555-0404", orders: 1, spent: 3400, joined: "2026-01-22", status: "Active" },
  { id: "CUS-005", name: "Aisha Patel", email: "aisha.p@hotmail.com", phone: "+1 (617) 555-0505", orders: 4, spent: 18900, joined: "2025-04-10", status: "Active" },
  { id: "CUS-006", name: "David Kim", email: "d.kim@gmail.com", phone: "+1 (206) 555-0606", orders: 2, spent: 7600, joined: "2025-12-05", status: "Active" },
  { id: "CUS-007", name: "Olivia Martinez", email: "olivia.m@icloud.com", phone: "+1 (305) 555-0707", orders: 6, spent: 29100, joined: "2025-02-28", status: "VIP" },
  { id: "CUS-008", name: "Alexander Brown", email: "a.brown@gmail.com", phone: "+1 (202) 555-0808", orders: 1, spent: 2100, joined: "2026-03-15", status: "New" },
  { id: "CUS-009", name: "Priya Sharma", email: "priya.s@gmail.com", phone: "+1 (469) 555-0909", orders: 3, spent: 15400, joined: "2025-09-20", status: "Active" },
  { id: "CUS-010", name: "Lucas Wilson", email: "l.wilson@outlook.com", phone: "+1 (503) 555-1010", orders: 0, spent: 0, joined: "2026-04-01", status: "New" },
];

const STATS = [
  { label: "Total Customers", value: "3,284", icon: Users, change: "+12%", up: true },
  { label: "New This Month", value: "127", icon: UserPlus, change: "+8%", up: true },
  { label: "Avg Order Value", value: "$3,420", icon: ShoppingBag, change: "+5%", up: true },
  { label: "Lifetime Value", value: "$8,750", icon: DollarSign, change: "+15%", up: true },
];

function formatCurrency(n: number) {
  return "$" + n.toLocaleString();
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-charcoal" style={{ fontWeight: 400 }}>Customers</h1>
          <p className="text-warm-gray text-sm mt-1">Manage your customer base</p>
        </div>
        <button className="btn-outline flex items-center gap-2 text-xs">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, change, up }) => (
          <div key={label} className="bg-white border border-warm-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-cream flex items-center justify-center">
                <Icon className="w-4 h-4 text-warm-gray" />
              </div>
              <span className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>{change}</span>
            </div>
            <p className="font-display text-2xl text-charcoal" style={{ fontWeight: 400 }}>{value}</p>
            <p className="text-xs text-warm-gray mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-luxury pl-10"
          />
        </div>
        <select className="input-luxury w-40">
          <option value="">All Status</option>
          <option value="VIP">VIP</option>
          <option value="Active">Active</option>
          <option value="New">New</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-warm-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-warm-border bg-cream">
              <th className="text-left label-caps text-warm-gray px-5 py-3">Customer</th>
              <th className="text-left label-caps text-warm-gray px-5 py-3">Email</th>
              <th className="text-left label-caps text-warm-gray px-5 py-3">Orders</th>
              <th className="text-left label-caps text-warm-gray px-5 py-3">Total Spent</th>
              <th className="text-left label-caps text-warm-gray px-5 py-3">Status</th>
              <th className="text-left label-caps text-warm-gray px-5 py-3">Joined</th>
              <th className="text-left label-caps text-warm-gray px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-warm-border/50 hover:bg-cream/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-charcoal text-white flex items-center justify-center text-xs font-semibold">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm font-medium text-charcoal">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-warm-gray">{c.email}</td>
                <td className="px-5 py-4 text-sm text-charcoal">{c.orders}</td>
                <td className="px-5 py-4 text-sm font-medium text-charcoal">{formatCurrency(c.spent)}</td>
                <td className="px-5 py-4">
                  <span className={`text-2xs font-semibold px-2 py-0.5 ${
                    c.status === "VIP" ? "bg-gold/15 text-gold-dark" :
                    c.status === "New" ? "bg-sky-50 text-sky-700" :
                    "bg-emerald-50 text-emerald-700"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-warm-gray">{c.joined}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-warm-gray hover:text-charcoal transition-colors" title="View">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-warm-gray hover:text-charcoal transition-colors" title="Email">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-warm-gray">Showing 1-10 of 3,284 customers</p>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-warm-border text-warm-gray hover:text-charcoal transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-2 border border-warm-border text-warm-gray hover:text-charcoal transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
