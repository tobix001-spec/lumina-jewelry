"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Trash2,
  Eye,
  Image,
  Plus,
  X,
  Copy,
  ChevronDown,
  DollarSign,
  Tag,
  Globe,
  Calendar,
  Sparkles,
  ArrowLeft,
  Check,
  GripVertical,
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Engagement Ring",
  "Wedding Band",
  "Necklace",
  "Earring",
  "Bracelet",
  "Pendant",
];

const SUBCATEGORIES = [
  "Solitaire",
  "Halo",
  "Three Stone",
  "Hidden Halo",
  "Vintage",
  "Bezel",
  "Nature-Inspired",
  "Cathedral",
  "Eternity",
  "Pavé",
  "Tennis",
  "Stud",
  "Hoop",
  "Drop",
  "Bangle",
];

const METAL_TYPES = [
  "14K White Gold",
  "14K Yellow Gold",
  "14K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "18K Rose Gold",
  "Platinum",
  "Palladium",
];

const DIAMOND_SHAPES = [
  "Round",
  "Oval",
  "Emerald",
  "Cushion",
  "Pear",
  "Marquise",
  "Princess",
  "Radiant",
  "Asscher",
  "Heart",
];

const SHAPE_ICONS: Record<string, string> = {
  Round: "●",
  Oval: "⬮",
  Emerald: "▬",
  Cushion: "▢",
  Pear: "◈",
  Marquise: "◇",
  Princess: "■",
  Radiant: "◆",
  Asscher: "□",
  Heart: "♥",
};

const STONE_TYPES = [
  "Natural Diamond",
  "Lab Diamond",
  "Moissanite",
  "Sapphire",
  "Ruby",
  "Emerald",
  "Morganite",
];

const SETTING_TYPES = ["Prong", "Bezel", "Channel", "Pavé", "Tension", "Bar"];

const CERTIFICATIONS = ["GIA", "IGI", "AGS", "None"];

const PRODUCTION_TIMES = [
  "3-5 days",
  "1-2 weeks",
  "2-3 weeks",
  "4-6 weeks",
];

const COLLECTIONS = [
  "Signature",
  "Anniversary",
  "Jane Goodall",
  "Pacific Green",
  "Best Sellers",
  "New Arrivals",
  "Ready to Ship",
];

// ─── Shape price offsets ────────────────────────────────────────────────────

const SHAPE_OFFSETS: Record<string, number> = {
  Round: 0,
  Oval: -50,
  Emerald: 50,
  Cushion: -100,
  Pear: -30,
  Marquise: -70,
  Princess: -20,
  Radiant: 30,
  Asscher: 80,
  Heart: -40,
};

const METAL_MARKUPS: Record<string, number> = {
  "14K White Gold": 0,
  "14K Yellow Gold": 0,
  "14K Rose Gold": 0,
  "18K White Gold": 200,
  "18K Yellow Gold": 200,
  "18K Rose Gold": 200,
  Platinum: 400,
  Palladium: 150,
};

// ─── Generate default variant prices ────────────────────────────────────────

function generateDefaultPrices(basePrice: number): Record<string, number> {
  const prices: Record<string, number> = {};
  METAL_TYPES.forEach((metal) => {
    DIAMOND_SHAPES.forEach((shape) => {
      const key = `${metal}|${shape}`;
      prices[key] =
        basePrice + (METAL_MARKUPS[metal] || 0) + (SHAPE_OFFSETS[shape] || 0);
    });
  });
  return prices;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ProductEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  // ─── Basic Information ────────────────────────────────────────────────────
  const [name, setName] = useState(
    isNew ? "" : "Petite Pavé Diamond Engagement Ring"
  );
  const [sku, setSku] = useState(isNew ? "" : "LUM-ENG-PP-001");
  const [category, setCategory] = useState(isNew ? "" : "Engagement Ring");
  const [subcategory, setSubcategory] = useState(isNew ? "" : "Pavé");
  const [description, setDescription] = useState(
    isNew
      ? ""
      : "A timeless engagement ring featuring a delicate pavé band encrusted with brilliant-cut diamonds. The center stone sits in a classic four-prong setting, elevated to catch maximum light. Handcrafted with meticulous attention to detail for the modern bride."
  );
  const [shortDescription, setShortDescription] = useState(
    isNew
      ? ""
      : "Delicate pavé diamond engagement ring with a brilliant center stone."
  );

  // ─── Images ───────────────────────────────────────────────────────────────
  const [images, setImages] = useState<string[]>(
    isNew
      ? []
      : [
          "/generated/ring-1.jpg",
          "/generated/ring-2.jpg",
          "/generated/ring-3.jpg",
          "/generated/ring-4.jpg",
          "/generated/ring-5.jpg",
          "/generated/ring-6.jpg",
        ]
  );

  // ─── Variant Pricing ─────────────────────────────────────────────────────
  const [basePrice, setBasePrice] = useState(isNew ? 0 : 1890);
  const [variantPrices, setVariantPrices] = useState<Record<string, number>>(
    isNew ? {} : generateDefaultPrices(1890)
  );
  const [modifiedCells, setModifiedCells] = useState<Set<string>>(new Set());
  const [copyFromMetal, setCopyFromMetal] = useState("");

  // ─── Stone Details ────────────────────────────────────────────────────────
  const [minCarat, setMinCarat] = useState(isNew ? "" : "0.5");
  const [maxCarat, setMaxCarat] = useState(isNew ? "" : "3.0");
  const [compatibleStones, setCompatibleStones] = useState<string[]>(
    isNew ? [] : ["Natural Diamond", "Lab Diamond", "Moissanite"]
  );
  const [settingType, setSettingType] = useState(isNew ? "" : "Pavé");
  const [sideStones, setSideStones] = useState(isNew ? "" : "24");
  const [minTotalCarat, setMinTotalCarat] = useState(isNew ? "" : "0.8");
  const [maxTotalCarat, setMaxTotalCarat] = useState(isNew ? "" : "3.5");

  // ─── Product Details ──────────────────────────────────────────────────────
  const [ringWidth, setRingWidth] = useState(isNew ? "" : "2.0");
  const [ringThickness, setRingThickness] = useState(isNew ? "" : "1.6");
  const [weight, setWeight] = useState(isNew ? "" : "3.2");
  const [resizable, setResizable] = useState(true);
  const [engravingAvailable, setEngravingAvailable] = useState(true);
  const [certification, setCertification] = useState(isNew ? "None" : "GIA");
  const [productionTime, setProductionTime] = useState(
    isNew ? "2-3 weeks" : "2-3 weeks"
  );

  // ─── Status & Visibility ─────────────────────────────────────────────────
  const [status, setStatus] = useState(isNew ? "Draft" : "Active");
  const [visibility, setVisibility] = useState("Public");
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(!isNew);
  const [bestSeller, setBestSeller] = useState(false);
  const [publishDate, setPublishDate] = useState(
    isNew ? "" : "2026-03-15"
  );

  // ─── SEO ──────────────────────────────────────────────────────────────────
  const [metaTitle, setMetaTitle] = useState(
    isNew ? "" : "Petite Pavé Diamond Engagement Ring | Lumina"
  );
  const [metaDescription, setMetaDescription] = useState(
    isNew
      ? ""
      : "Shop the Petite Pavé Diamond Engagement Ring. A delicate pavé band with brilliant center stone. Available in 14K, 18K gold and platinum."
  );
  const [slug, setSlug] = useState(
    isNew ? "" : "petite-pave-diamond-engagement-ring"
  );

  // ─── Tags & Collections ───────────────────────────────────────────────────
  const [tagsInput, setTagsInput] = useState(
    isNew ? "" : "engagement, pavé, diamond, solitaire, delicate"
  );
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    isNew ? [] : ["Signature", "New Arrivals"]
  );

  // ─── UI State ─────────────────────────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  // ─── Computed pricing summary ─────────────────────────────────────────────
  const pricingSummary = useMemo(() => {
    const values = Object.values(variantPrices).filter((v) => v > 0);
    if (values.length === 0)
      return { lowest: 0, highest: 0, average: 0, count: 0 };
    return {
      lowest: Math.min(...values),
      highest: Math.max(...values),
      average: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      count: values.length,
    };
  }, [variantPrices]);

  // ─── Tags as chips ────────────────────────────────────────────────────────
  const tags = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [tagsInput]
  );

  // ─── Auto-generate slug from name ─────────────────────────────────────────
  const handleNameChange = useCallback(
    (val: string) => {
      setName(val);
      if (!slug || slug === slugify(name)) {
        setSlug(slugify(val));
      }
    },
    [slug, name]
  );

  // ─── Variant price handlers ───────────────────────────────────────────────
  const handleVariantPriceChange = (key: string, value: string) => {
    const num = parseFloat(value) || 0;
    setVariantPrices((prev) => ({ ...prev, [key]: num }));
    setModifiedCells((prev) => new Set(prev).add(key));
  };

  const applyBasePriceToEmpty = () => {
    const updated = { ...variantPrices };
    METAL_TYPES.forEach((metal) => {
      DIAMOND_SHAPES.forEach((shape) => {
        const key = `${metal}|${shape}`;
        if (!updated[key] || updated[key] === 0) {
          updated[key] =
            basePrice +
            (METAL_MARKUPS[metal] || 0) +
            (SHAPE_OFFSETS[shape] || 0);
        }
      });
    });
    setVariantPrices(updated);
  };

  const applyMetalMarkup = (metal: string) => {
    const markup = METAL_MARKUPS[metal] || 0;
    const updated = { ...variantPrices };
    DIAMOND_SHAPES.forEach((shape) => {
      const key = `${metal}|${shape}`;
      updated[key] =
        basePrice + markup + (SHAPE_OFFSETS[shape] || 0);
    });
    setVariantPrices(updated);
  };

  const copyPricesFrom = (sourceMetal: string, targetMetal: string) => {
    if (!sourceMetal) return;
    const updated = { ...variantPrices };
    DIAMOND_SHAPES.forEach((shape) => {
      const sourceKey = `${sourceMetal}|${shape}`;
      const targetKey = `${targetMetal}|${shape}`;
      if (updated[sourceKey]) {
        updated[targetKey] = updated[sourceKey];
      }
    });
    setVariantPrices(updated);
  };

  // ─── Image handlers ───────────────────────────────────────────────────────
  const addImage = () => {
    if (newImageUrl && images.length < 10) {
      setImages((prev) => [...prev, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // ─── Save / Publish ───────────────────────────────────────────────────────
  const handleSave = (asPublish: boolean) => {
    setSaveMessage(asPublish ? "Product published!" : "Draft saved!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  // ─── Section wrapper ─────────────────────────────────────────────────────
  const Section = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white border border-warm-border p-6 lg:p-8 relative overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gold-dark" />
        </div>
        <h2
          className="font-display text-xl tracking-wide text-charcoal"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
      </div>
      {children}
    </motion.div>
  );

  // ─── Toggle switch component ──────────────────────────────────────────────
  const Toggle = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-charcoal">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          value ? "bg-gold" : "bg-warm-border"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-9xl mx-auto">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-warm-border hover:border-warm-border-dark hover:bg-cream transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 text-charcoal" />
          </Link>
          <div>
            <h1
              className="font-display text-2xl lg:text-3xl text-charcoal tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {isNew ? "New Product" : "Edit Product"}
            </h1>
            {!isNew && (
              <p className="text-sm text-warm-gray mt-0.5">
                SKU: {sku}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <Link
              href={`/jewelry/${slug}`}
              className="btn-outline py-2 px-4 text-xs flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </Link>
          )}
        </div>
      </div>

      {/* ─── Save Message Toast ──────────────────────────────────────────── */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 flex items-center gap-2 px-5 py-3 bg-charcoal text-white text-sm rounded-lg shadow-luxury"
          >
            <Check className="w-4 h-4 text-gold" />
            {saveMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Two Column Layout ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* ─── LEFT COLUMN (2/3) ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* ── 1. Basic Information ─────────────────────────────────────── */}
          <Section title="Basic Information" icon={Tag}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="label-caps text-warm-gray block mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="input-luxury"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="input-luxury"
                  placeholder="Auto-generated"
                />
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-luxury appearance-none pr-10"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Subcategory / Style
                </label>
                <div className="relative">
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="input-luxury appearance-none pr-10"
                  >
                    <option value="">Select style</option>
                    {SUBCATEGORIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray pointer-events-none" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="label-caps text-warm-gray block mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="input-luxury resize-none"
                  placeholder="Full product description"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label-caps text-warm-gray block mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="input-luxury"
                  placeholder="One-line summary"
                />
              </div>
            </div>
          </Section>

          {/* ── 2. Image Gallery Manager ─────────────────────────────────── */}
          <Section title="Image Gallery" icon={Image}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {images.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square border border-warm-border bg-cream rounded overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-cream/70">
                    <Image className="w-8 h-8 text-warm-gray/40" />
                  </div>
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-2xs font-semibold tracking-wider uppercase bg-gold text-white rounded-sm">
                      Primary
                    </span>
                  )}
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-charcoal/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-60 transition-opacity">
                    <GripVertical className="w-4 h-4 text-charcoal" />
                  </div>
                </div>
              ))}
              {images.length < 10 && (
                <div className="aspect-square border-2 border-dashed border-warm-border rounded flex flex-col items-center justify-center text-warm-gray hover:border-gold hover:text-gold transition-colors cursor-pointer group">
                  <Plus className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-2xs font-medium">Add Image</span>
                </div>
              )}
            </div>
            <p className="text-xs text-warm-gray mb-4">
              Drag to reorder. First image is used as the primary product photo.
              Max 10 images.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="input-luxury flex-1"
                placeholder="Enter image URL"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addImage();
                }}
              />
              <button
                onClick={addImage}
                disabled={!newImageUrl || images.length >= 10}
                className="btn-outline py-2 px-4 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </Section>

          {/* ── 3. Variant Pricing Matrix ────────────────────────────────── */}
          <Section title="Variant Pricing Matrix" icon={DollarSign}>
            {/* Base price + auto-fill */}
            <div className="flex flex-wrap items-end gap-4 mb-6 pb-6 border-b border-warm-border">
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Base Price ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                  <input
                    type="number"
                    value={basePrice || ""}
                    onChange={(e) =>
                      setBasePrice(parseFloat(e.target.value) || 0)
                    }
                    className="input-luxury pl-9 w-40"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <button
                onClick={applyBasePriceToEmpty}
                className="btn-gold py-2.5 px-5 text-xs"
              >
                Auto-fill Empty Cells
              </button>
              <div className="ml-auto">
                <span className="text-sm text-warm-gray">
                  <strong className="text-charcoal">
                    {pricingSummary.count}
                  </strong>{" "}
                  variants configured
                </span>
              </div>
            </div>

            {/* Scrollable pricing matrix */}
            <div className="overflow-x-auto -mx-6 lg:-mx-8 px-6 lg:px-8 scrollbar-hide">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-white text-left p-2 min-w-[160px]">
                      <span className="label-caps text-warm-gray text-2xs">
                        Metal / Shape
                      </span>
                    </th>
                    {DIAMOND_SHAPES.map((shape) => (
                      <th key={shape} className="p-2 text-center min-w-[90px]">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-base leading-none opacity-50">
                            {SHAPE_ICONS[shape]}
                          </span>
                          <span className="label-caps text-warm-gray text-2xs">
                            {shape}
                          </span>
                        </div>
                      </th>
                    ))}
                    <th className="p-2 text-center min-w-[90px]">
                      <span className="label-caps text-warm-gray text-2xs">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {METAL_TYPES.map((metal, metalIdx) => (
                    <tr
                      key={metal}
                      className={
                        metalIdx % 2 === 0 ? "bg-white" : "bg-cream/50"
                      }
                    >
                      <td className="sticky left-0 z-10 p-2 text-sm font-medium text-charcoal whitespace-nowrap bg-inherit border-r border-warm-border">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-warm-border flex-shrink-0"
                            style={{
                              background: metal.includes("Yellow")
                                ? "#F5D54A"
                                : metal.includes("Rose")
                                ? "#E8B4B4"
                                : metal.includes("Platinum")
                                ? "#E0E0E0"
                                : metal.includes("Palladium")
                                ? "#D0D0D0"
                                : "#F0F0F0",
                            }}
                          />
                          {metal}
                        </div>
                      </td>
                      {DIAMOND_SHAPES.map((shape) => {
                        const key = `${metal}|${shape}`;
                        const val = variantPrices[key];
                        const isModified = modifiedCells.has(key);
                        const isEmpty = !val || val === 0;
                        return (
                          <td key={shape} className="p-1">
                            <input
                              type="number"
                              value={val || ""}
                              onChange={(e) =>
                                handleVariantPriceChange(key, e.target.value)
                              }
                              className={`w-full px-2 py-1.5 text-xs text-center border transition-colors duration-150 outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 ${
                                isEmpty
                                  ? "bg-stone-100 border-stone-200 text-stone-400"
                                  : isModified
                                  ? "bg-amber-50 border-amber-200 text-charcoal"
                                  : "bg-white border-warm-border text-charcoal"
                              }`}
                              placeholder="$"
                            />
                          </td>
                        );
                      })}
                      <td className="p-1">
                        <button
                          onClick={() => applyMetalMarkup(metal)}
                          className="w-full px-2 py-1.5 text-2xs font-medium text-gold-dark bg-gold/10 border border-gold/20 hover:bg-gold/20 transition-colors rounded-sm whitespace-nowrap"
                          title={`Apply markup: +$${METAL_MARKUPS[metal] || 0}`}
                        >
                          +${METAL_MARKUPS[metal] || 0}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Copy prices from */}
            <div className="flex items-center gap-3 mt-5 pt-5 border-t border-warm-border">
              <Copy className="w-4 h-4 text-warm-gray" />
              <span className="text-sm text-warm-gray">Copy prices from:</span>
              <div className="relative">
                <select
                  value={copyFromMetal}
                  onChange={(e) => setCopyFromMetal(e.target.value)}
                  className="input-luxury appearance-none pr-8 py-2 text-xs w-48"
                >
                  <option value="">Select metal type</option>
                  {METAL_TYPES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray pointer-events-none" />
              </div>
              <span className="text-sm text-warm-gray">to:</span>
              <div className="flex flex-wrap gap-2">
                {METAL_TYPES.filter((m) => m !== copyFromMetal).map((m) => (
                  <button
                    key={m}
                    onClick={() => copyPricesFrom(copyFromMetal, m)}
                    disabled={!copyFromMetal}
                    className="px-2 py-1 text-2xs font-medium border border-warm-border text-warm-gray hover:border-gold hover:text-gold-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-sm"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* ── 4. Stone Details ──────────────────────────────────────────── */}
          <Section title="Stone Details" icon={Sparkles}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Center Stone Size Range (ct)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={minCarat}
                    onChange={(e) => setMinCarat(e.target.value)}
                    className="input-luxury w-24 text-center"
                    placeholder="Min"
                  />
                  <span className="text-warm-gray text-sm">to</span>
                  <input
                    type="number"
                    step="0.1"
                    value={maxCarat}
                    onChange={(e) => setMaxCarat(e.target.value)}
                    className="input-luxury w-24 text-center"
                    placeholder="Max"
                  />
                  <span className="text-xs text-warm-gray">ct</span>
                </div>
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Setting Type
                </label>
                <div className="relative">
                  <select
                    value={settingType}
                    onChange={(e) => setSettingType(e.target.value)}
                    className="input-luxury appearance-none pr-10"
                  >
                    <option value="">Select setting</option>
                    {SETTING_TYPES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray pointer-events-none" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="label-caps text-warm-gray block mb-3">
                  Compatible Stone Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {STONE_TYPES.map((stone) => {
                    const isActive = compatibleStones.includes(stone);
                    return (
                      <button
                        key={stone}
                        type="button"
                        onClick={() =>
                          setCompatibleStones((prev) =>
                            isActive
                              ? prev.filter((s) => s !== stone)
                              : [...prev, stone]
                          )
                        }
                        className={`chip ${isActive ? "active" : ""}`}
                      >
                        {isActive && <Check className="w-3 h-3 mr-1 inline" />}
                        {stone}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Number of Side Stones
                </label>
                <input
                  type="number"
                  value={sideStones}
                  onChange={(e) => setSideStones(e.target.value)}
                  className="input-luxury w-32"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Total Carat Weight Range
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={minTotalCarat}
                    onChange={(e) => setMinTotalCarat(e.target.value)}
                    className="input-luxury w-24 text-center"
                    placeholder="Min"
                  />
                  <span className="text-warm-gray text-sm">to</span>
                  <input
                    type="number"
                    step="0.1"
                    value={maxTotalCarat}
                    onChange={(e) => setMaxTotalCarat(e.target.value)}
                    className="input-luxury w-24 text-center"
                    placeholder="Max"
                  />
                  <span className="text-xs text-warm-gray">ct</span>
                </div>
              </div>
            </div>
          </Section>

          {/* ── 5. Product Details ────────────────────────────────────────── */}
          <Section title="Product Details" icon={Tag}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Ring Width (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={ringWidth}
                  onChange={(e) => setRingWidth(e.target.value)}
                  className="input-luxury"
                  placeholder="mm"
                />
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Ring Thickness (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={ringThickness}
                  onChange={(e) => setRingThickness(e.target.value)}
                  className="input-luxury"
                  placeholder="mm"
                />
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Weight (grams)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="input-luxury"
                  placeholder="g"
                />
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-warm-border space-y-1">
              <Toggle
                label="Resizable"
                value={resizable}
                onChange={setResizable}
              />
              <Toggle
                label="Engraving Available"
                value={engravingAvailable}
                onChange={setEngravingAvailable}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 pt-5 border-t border-warm-border">
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Certification
                </label>
                <div className="relative">
                  <select
                    value={certification}
                    onChange={(e) => setCertification(e.target.value)}
                    className="input-luxury appearance-none pr-10"
                  >
                    {CERTIFICATIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Production Time
                </label>
                <div className="relative">
                  <select
                    value={productionTime}
                    onChange={(e) => setProductionTime(e.target.value)}
                    className="input-luxury appearance-none pr-10"
                  >
                    {PRODUCTION_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray pointer-events-none" />
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* ─── RIGHT COLUMN (1/3 Sidebar) ────────────────────────────────── */}
        <div className="space-y-6">
          {/* ── 1. Status & Visibility ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-warm-border p-6"
          >
            <h3
              className="font-display text-lg tracking-wide text-charcoal mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Status & Visibility
            </h3>
            <div className="space-y-4">
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input-luxury appearance-none pr-10"
                  >
                    {["Draft", "Active", "Out of Stock", "Discontinued"].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      )
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Visibility
                </label>
                <div className="relative">
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="input-luxury appearance-none pr-10"
                  >
                    {["Public", "Hidden", "VIP Only"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray pointer-events-none" />
                </div>
              </div>
              <div className="pt-2 border-t border-warm-border space-y-1">
                <Toggle
                  label="Featured"
                  value={featured}
                  onChange={setFeatured}
                />
                <Toggle
                  label="New Arrival"
                  value={newArrival}
                  onChange={setNewArrival}
                />
                <Toggle
                  label="Best Seller"
                  value={bestSeller}
                  onChange={setBestSeller}
                />
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Publish Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray pointer-events-none" />
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="input-luxury pl-10"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── 2. Pricing Summary ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white border border-warm-border p-6"
          >
            <h3
              className="font-display text-lg tracking-wide text-charcoal mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pricing Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-warm-gray">Base Price</span>
                <span className="text-sm font-semibold text-charcoal">
                  ${basePrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-warm-gray">Lowest Variant</span>
                <span className="text-sm font-semibold text-green-700">
                  ${pricingSummary.lowest.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-warm-gray">Highest Variant</span>
                <span className="text-sm font-semibold text-charcoal">
                  ${pricingSummary.highest.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-warm-border">
                <span className="text-sm text-warm-gray">Average Price</span>
                <span className="text-sm font-semibold text-charcoal">
                  ${pricingSummary.average.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-warm-gray">Total Variants</span>
                <span className="text-sm font-bold text-gold-dark">
                  {pricingSummary.count}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── 3. SEO ────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-warm-border p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Globe className="w-4 h-4 text-warm-gray" />
              <h3
                className="font-display text-lg tracking-wide text-charcoal"
                style={{ fontFamily: "var(--font-display)" }}
              >
                SEO
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="input-luxury"
                  placeholder="Page title"
                />
                <p className="text-2xs text-warm-gray mt-1">
                  {metaTitle.length}/60 characters
                </p>
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  className="input-luxury resize-none"
                  placeholder="Search engine description"
                />
                <p className="text-2xs text-warm-gray mt-1">
                  {metaDescription.length}/160 characters
                </p>
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="input-luxury"
                  placeholder="product-url-slug"
                />
                <p className="text-2xs text-warm-gray mt-1">
                  /jewelry/{slug || "..."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── 4. Tags & Collections ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-white border border-warm-border p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Tag className="w-4 h-4 text-warm-gray" />
              <h3
                className="font-display text-lg tracking-wide text-charcoal"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tags & Collections
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label-caps text-warm-gray block mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="input-luxury"
                  placeholder="Comma-separated tags"
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-2xs font-medium bg-cream border border-warm-border text-charcoal rounded-sm"
                      >
                        {tag}
                        <button
                          onClick={() => {
                            const newTags = tags.filter((_, idx) => idx !== i);
                            setTagsInput(newTags.join(", "));
                          }}
                          className="text-warm-gray hover:text-charcoal transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="label-caps text-warm-gray block mb-3">
                  Collections
                </label>
                <div className="space-y-2">
                  {COLLECTIONS.map((col) => {
                    const isSelected = selectedCollections.includes(col);
                    return (
                      <label
                        key={col}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <span
                          className={`w-4.5 h-4.5 rounded-sm border flex items-center justify-center transition-all duration-150 ${
                            isSelected
                              ? "bg-charcoal border-charcoal"
                              : "border-warm-border group-hover:border-warm-border-dark"
                          }`}
                          style={{ width: 18, height: 18 }}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </span>
                        <span className="text-sm text-charcoal">{col}</span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isSelected}
                          onChange={() =>
                            setSelectedCollections((prev) =>
                              isSelected
                                ? prev.filter((c) => c !== col)
                                : [...prev, col]
                            )
                          }
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── 5. Action Buttons (sticky) ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="sticky bottom-4 bg-white border border-warm-border p-5 shadow-luxury"
          >
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleSave(true)}
                className="btn-primary w-full py-3 text-xs"
              >
                <Save className="w-4 h-4" />
                Publish
              </button>
              <button
                onClick={() => handleSave(false)}
                className="btn-outline w-full py-3 text-xs"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              {!isNew && (
                <>
                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-warm-border">
                      <span className="text-xs text-red-600 flex-1">
                        Are you sure?
                      </span>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          router.push("/admin/products");
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 text-xs font-semibold text-warm-gray border border-warm-border hover:bg-cream transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Product
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
