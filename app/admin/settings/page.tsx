"use client";

import React, { useState } from "react";
import { Save, Globe, Mail, CreditCard, Truck, Shield, Bell, Palette } from "lucide-react";

const TABS = [
  { id: "general", label: "General", icon: Globe },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-charcoal" style={{ fontWeight: 400 }}>Settings</h1>
          <p className="text-warm-gray text-sm mt-1">Manage your store configuration</p>
        </div>
        <button onClick={handleSave} className="btn-primary">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Tabs */}
        <div className="w-48 shrink-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? "bg-charcoal text-white"
                  : "text-warm-gray hover:text-charcoal hover:bg-cream-dark"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white border border-warm-border p-8">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "payments" && <PaymentSettings />}
          {activeTab === "shipping" && <ShippingSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-charcoal" style={{ fontWeight: 400 }}>General Settings</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="label-caps text-warm-gray mb-2 block">Store Name</label>
          <input type="text" defaultValue="Lumina Jewelry" className="input-luxury" />
        </div>
        <div>
          <label className="label-caps text-warm-gray mb-2 block">Store URL</label>
          <input type="text" defaultValue="https://luminajewelry.com" className="input-luxury" />
        </div>
        <div>
          <label className="label-caps text-warm-gray mb-2 block">Support Email</label>
          <input type="email" defaultValue="support@luminajewelry.com" className="input-luxury" />
        </div>
        <div>
          <label className="label-caps text-warm-gray mb-2 block">Phone</label>
          <input type="tel" defaultValue="+1 (800) 555-0199" className="input-luxury" />
        </div>
        <div className="col-span-2">
          <label className="label-caps text-warm-gray mb-2 block">Store Description</label>
          <textarea rows={3} defaultValue="Ethically sourced fine jewelry, engagement rings, and certified diamonds. Free lifetime warranty, 30-day returns." className="input-luxury" />
        </div>
        <div>
          <label className="label-caps text-warm-gray mb-2 block">Currency</label>
          <select defaultValue="USD" className="input-luxury">
            <option value="USD">USD ($)</option>
            <option value="CAD">CAD (CA$)</option>
            <option value="GBP">GBP (£)</option>
            <option value="EUR">EUR (€)</option>
            <option value="AUD">AUD (A$)</option>
          </select>
        </div>
        <div>
          <label className="label-caps text-warm-gray mb-2 block">Timezone</label>
          <select defaultValue="America/New_York" className="input-luxury">
            <option value="America/New_York">Eastern (ET)</option>
            <option value="America/Chicago">Central (CT)</option>
            <option value="America/Denver">Mountain (MT)</option>
            <option value="America/Los_Angeles">Pacific (PT)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function PaymentSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-charcoal" style={{ fontWeight: 400 }}>Payment Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-warm-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#635BFF] rounded flex items-center justify-center text-white text-xs font-bold">S</div>
            <div>
              <p className="text-sm font-medium text-charcoal">Stripe</p>
              <p className="text-xs text-warm-gray">Credit cards, Apple Pay, Google Pay</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700">Connected</span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="label-caps text-warm-gray mb-2 block">Stripe Public Key</label>
            <input type="text" defaultValue="pk_live_••••••••••••4242" className="input-luxury" />
          </div>
          <div>
            <label className="label-caps text-warm-gray mb-2 block">Stripe Secret Key</label>
            <input type="password" defaultValue="sk_live_••••••••••••" className="input-luxury" />
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border border-warm-border">
          <input type="checkbox" id="financing" defaultChecked className="w-4 h-4" />
          <label htmlFor="financing" className="text-sm text-charcoal">Enable Affirm financing (0% APR for 12 months on orders over $1,000)</label>
        </div>
      </div>
    </div>
  );
}

function ShippingSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-charcoal" style={{ fontWeight: 400 }}>Shipping Settings</h2>
      <div className="space-y-4">
        {[
          { method: "Free Insured Shipping", price: "Free", time: "5-7 business days", enabled: true },
          { method: "Express Shipping", price: "$25.00", time: "2-3 business days", enabled: true },
          { method: "Overnight Shipping", price: "$50.00", time: "Next business day", enabled: true },
          { method: "International Shipping", price: "$75.00", time: "7-14 business days", enabled: false },
        ].map((s) => (
          <div key={s.method} className="flex items-center justify-between p-4 border border-warm-border">
            <div>
              <p className="text-sm font-medium text-charcoal">{s.method}</p>
              <p className="text-xs text-warm-gray">{s.time}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-charcoal">{s.price}</span>
              <input type="checkbox" defaultChecked={s.enabled} className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-charcoal" style={{ fontWeight: 400 }}>Notification Settings</h2>
      <div className="space-y-4">
        {[
          { label: "New order received", email: true, push: true },
          { label: "Order status updated", email: true, push: false },
          { label: "Low stock alert (< 5 units)", email: true, push: true },
          { label: "New customer registration", email: false, push: false },
          { label: "Review submitted", email: true, push: false },
          { label: "Return request", email: true, push: true },
          { label: "Daily sales summary", email: true, push: false },
        ].map((n) => (
          <div key={n.label} className="flex items-center justify-between p-4 border border-warm-border">
            <span className="text-sm text-charcoal">{n.label}</span>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs text-warm-gray">
                <input type="checkbox" defaultChecked={n.email} className="w-4 h-4" /> Email
              </label>
              <label className="flex items-center gap-2 text-xs text-warm-gray">
                <input type="checkbox" defaultChecked={n.push} className="w-4 h-4" /> Push
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-charcoal" style={{ fontWeight: 400 }}>Appearance</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="label-caps text-warm-gray mb-2 block">Primary Color</label>
          <div className="flex items-center gap-3">
            <input type="color" defaultValue="#C9A84C" className="w-10 h-10 border border-warm-border cursor-pointer" />
            <input type="text" defaultValue="#C9A84C" className="input-luxury flex-1" />
          </div>
        </div>
        <div>
          <label className="label-caps text-warm-gray mb-2 block">Background Color</label>
          <div className="flex items-center gap-3">
            <input type="color" defaultValue="#FAF8F5" className="w-10 h-10 border border-warm-border cursor-pointer" />
            <input type="text" defaultValue="#FAF8F5" className="input-luxury flex-1" />
          </div>
        </div>
        <div>
          <label className="label-caps text-warm-gray mb-2 block">Logo</label>
          <div className="border-2 border-dashed border-warm-border p-8 text-center">
            <p className="font-display text-2xl text-charcoal tracking-[0.25em]">LUMINA</p>
            <p className="text-xs text-warm-gray mt-2">Click to upload new logo</p>
          </div>
        </div>
        <div>
          <label className="label-caps text-warm-gray mb-2 block">Favicon</label>
          <div className="border-2 border-dashed border-warm-border p-8 text-center">
            <div className="w-8 h-8 bg-charcoal mx-auto mb-2" />
            <p className="text-xs text-warm-gray">Click to upload favicon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-charcoal" style={{ fontWeight: 400 }}>Security</h2>
      <div className="space-y-4">
        <div className="p-4 border border-warm-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-charcoal">Admin Password</p>
            <button className="text-xs text-gold-dark font-semibold hover:text-gold transition-colors">Change Password</button>
          </div>
          <p className="text-xs text-warm-gray">Last changed 14 days ago</p>
        </div>
        <div className="p-4 border border-warm-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">Two-Factor Authentication</p>
              <p className="text-xs text-warm-gray mt-1">Add an extra layer of security</p>
            </div>
            <button className="btn-outline text-xs px-4 py-2">Enable 2FA</button>
          </div>
        </div>
        <div className="p-4 border border-warm-border">
          <p className="text-sm font-medium text-charcoal mb-3">API Keys</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-warm-gray">RapNet API</span>
              <span className="font-mono text-charcoal">rn_••••••••4a2f</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-warm-gray">Stripe Secret</span>
              <span className="font-mono text-charcoal">sk_••••••••9x1d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
