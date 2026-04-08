/**
 * types/index.ts
 * Centralized TypeScript type definitions for Lumina Jewelry Platform.
 * All enums mirror the Prisma schema to guarantee runtime-schema alignment.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum DiamondShape {
  ROUND = "ROUND",
  OVAL = "OVAL",
  EMERALD = "EMERALD",
  MARQUISE = "MARQUISE",
  RADIANT = "RADIANT",
  PEAR = "PEAR",
  ELONGATED_CUSHION = "ELONGATED_CUSHION",
  CUSHION = "CUSHION",
  PRINCESS = "PRINCESS",
  ASSCHER = "ASSCHER",
  HEART = "HEART",
  ANTIQUE_CUSHION = "ANTIQUE_CUSHION",
}

export enum DiamondOrigin {
  NATURAL = "NATURAL",
  LAB_GROWN = "LAB_GROWN",
  COLORED = "COLORED",
  LAB_GROWN_COLORED = "LAB_GROWN_COLORED",
}

export enum MetalType {
  EIGHTEEN_K_YELLOW_GOLD = "EIGHTEEN_K_YELLOW_GOLD",
  EIGHTEEN_K_WHITE_GOLD = "EIGHTEEN_K_WHITE_GOLD",
  FOURTEEN_K_YELLOW_GOLD = "FOURTEEN_K_YELLOW_GOLD",
  FOURTEEN_K_WHITE_GOLD = "FOURTEEN_K_WHITE_GOLD",
  ROSE_GOLD = "ROSE_GOLD",
  PLATINUM = "PLATINUM",
  TUNGSTEN = "TUNGSTEN",
  TANTALUM = "TANTALUM",
  METEORITE = "METEORITE",
}

export enum SettingStyle {
  SOLITAIRE = "SOLITAIRE",
  HALO = "HALO",
  HIDDEN_HALO = "HIDDEN_HALO",
  THREE_STONE = "THREE_STONE",
  BEZEL = "BEZEL",
  PAVE = "PAVE",
  CHANNEL = "CHANNEL",
  VINTAGE = "VINTAGE",
  NATURE_INSPIRED = "NATURE_INSPIRED",
}

export enum DiamondCutGrade {
  EXCELLENT = "Excellent",
  VERY_GOOD = "Very Good",
  GOOD = "Good",
  FAIR = "Fair",
  POOR = "Poor",
}

export enum DiamondColor {
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
  K = "K",
  L = "L",
  M = "M",
  N = "N",
}

export enum DiamondClarity {
  FL = "FL",
  IF = "IF",
  VVS1 = "VVS1",
  VVS2 = "VVS2",
  VS1 = "VS1",
  VS2 = "VS2",
  SI1 = "SI1",
  SI2 = "SI2",
  I1 = "I1",
  I2 = "I2",
  I3 = "I3",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}

export enum AppointmentType {
  VIRTUAL = "VIRTUAL",
  IN_PERSON = "IN_PERSON",
  PHONE = "PHONE",
}

export enum JewelryCategory {
  EARRINGS = "EARRINGS",
  NECKLACES = "NECKLACES",
  RINGS = "RINGS",
  BRACELETS = "BRACELETS",
}

// ─── Core Domain Models ───────────────────────────────────────────────────────

/** Loose diamond from virtual inventory (RapNet sync). */
export interface Diamond {
  id: string;
  supplierStockId: string;
  shape: DiamondShape;
  caratWeight: number;
  color: string;       // D-Z
  clarity: string;     // FL-I3
  cutGrade: string;
  price: number;
  origin: DiamondOrigin;

  // Advanced grading
  polish?: string;
  symmetry?: string;
  tablePercent?: number;
  depthPercent?: number;
  culetSize?: string;
  fluorescence?: string;
  eyeClean?: boolean;
  bgmStatus?: string;
  lwRatio?: number;

  // Certification
  certificationLab?: string;
  certificateNo?: string;
  certificateUrl?: string;

  // Media
  imageUrl?: string;
  videoUrl?: string;
  v360Url?: string;

  // Ethical attributes
  blockchainId?: string;
  renewableEnergy: boolean;
  carbonCapture: boolean;

  isAvailable: boolean;
  lastSyncedAt: string;   // ISO date string
}

/** Ring mounting / setting catalog item. */
export interface Setting {
  id: string;
  sku: string;
  name: string;
  description?: string;
  metalType: MetalType;
  basePrice: number;
  imageUrl?: string;
  galleryUrls: string[];
  style: SettingStyle;
  allowedShapes: DiamondShape[];
  isActive: boolean;
}

/** Fully built ring configuration, ready for cart. */
export interface RingConfiguration {
  diamond: Diamond;
  setting: Setting;
  ringSize: string;
  engraving?: string;
  engraveLocation?: string;
  giftMessage?: string;
  rushShipping: boolean;

  // Derived at selection time
  totalPrice: number;
  configurationId: string; // Local ephemeral ID for wishlist serialization
}

// ─── API Request / Response Shapes ───────────────────────────────────────────

/** Query params for /api/inventory/diamonds */
export interface DiamondSearchParams {
  // 4Cs
  shape?: DiamondShape | DiamondShape[];
  minCarat?: number;
  maxCarat?: number;
  color?: string | string[];
  clarity?: string | string[];
  cutGrade?: string | string[];

  // Advanced
  polish?: string | string[];
  symmetry?: string | string[];
  minTable?: number;
  maxTable?: number;
  minDepth?: number;
  maxDepth?: number;
  fluorescence?: string | string[];
  eyeClean?: boolean;

  // Origin & ethics
  origin?: DiamondOrigin | DiamondOrigin[];
  renewableEnergy?: boolean;
  carbonCapture?: boolean;
  blockchainEnabled?: boolean;

  // Pricing
  minPrice?: number;
  maxPrice?: number;

  // Pagination
  page?: number;
  pageSize?: number;

  // Sorting
  sortBy?: "price" | "caratWeight" | "color" | "clarity";
  sortOrder?: "asc" | "desc";
}

export interface DiamondSearchResult {
  diamonds: Diamond[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Query params for /api/catalog/settings */
export interface SettingSearchParams {
  metalType?: MetalType | MetalType[];
  style?: SettingStyle | SettingStyle[];
  compatibleShape?: DiamondShape;  // Filter to settings that accept this shape
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

/** Price breakdown returned by /api/configurator/calculate-price */
export interface PriceBreakdown {
  diamondPrice: number;
  settingPrice: number;
  customizationFee: number;   // Engraving, rush shipping, etc.
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
}

/** Configurator validation result */
export interface ConfigurationValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  isCompatible: boolean;        // Shape compatibility check
}

// ─── Cart & Checkout ──────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  configuration: RingConfiguration;
  quantity: number;   // Always 1 for bespoke jewelry
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavSubItem {
  label: string;
  href: string;
  description?: string;
  isNew?: boolean;
  badge?: string;
}

export interface NavGroup {
  heading: string;
  items: NavSubItem[];
}

export interface NavItem {
  label: string;
  href?: string;
  groups?: NavGroup[];
  featured?: NavSubItem[];
  isHighlighted?: boolean;
}

// ─── Filter UI State ─────────────────────────────────────────────────────────

/** Client-side filter state for the diamond PLP. */
export interface DiamondFilters {
  shapes: DiamondShape[];
  caratRange: [number, number];
  colors: string[];
  clarities: string[];
  cutGrades: string[];
  polish: string[];
  symmetry: string[];
  tableRange: [number, number];
  depthRange: [number, number];
  fluorescence: string[];
  eyeClean: boolean | null;
  origins: DiamondOrigin[];
  renewableEnergy: boolean;
  carbonCapture: boolean;
  blockchainEnabled: boolean;
  priceRange: [number, number];
  preset: "MOST_SPARKLE" | "BEST_BALANCE" | "BEST_VALUE" | null;
}

/** Client-side filter state for the settings PLP. */
export interface SettingFilters {
  metalTypes: MetalType[];
  styles: SettingStyle[];
  priceRange: [number, number];
}

// ─── User / Auth ──────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: "CUSTOMER" | "ADMIN" | "CONSULTANT";
}

export interface WishlistItem {
  id: string;
  userId: string;
  diamondId?: string;
  settingId?: string;
  configuration?: Partial<RingConfiguration>;
  diamond?: Diamond;
  setting?: Setting;
  createdAt: string;
}

// ─── Content / CMS ───────────────────────────────────────────────────────────

/** Homepage hero slide */
export interface HeroSlide {
  id: string;
  imageUrl: string;
  mobileImageUrl?: string;
  headline: string;
  subheadline?: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  altText: string;
}

/** Category grid card */
export interface CategoryCard {
  id: string;
  label: string;
  href: string;
  imageUrl: string;
  altText: string;
}

/** Curated collection card */
export interface CollectionCard {
  id: string;
  label: string;
  subtitle?: string;
  href: string;
  imageUrl: string;
  altText: string;
}

/** Diamond shape icon for the shapes carousel */
export interface DiamondShapeItem {
  shape: DiamondShape;
  label: string;
  iconUrl: string;
  href: string;
}

// ─── Appointment / Omnichannel ────────────────────────────────────────────────

export interface AppointmentSlot {
  datetime: string;   // ISO string
  available: boolean;
  consultantId?: string;
}

export interface AppointmentRequest {
  type: AppointmentType;
  storeLocation?: string;
  scheduledDate: string;
  notes?: string;
}

// ─── 3D Visualizer ────────────────────────────────────────────────────────────

export interface RingVisualizerProps {
  diamond: Diamond | null;
  setting: Setting | null;
  environment?: "studio" | "sunset" | "warehouse" | "city" | "dawn";
  interactive?: boolean;
  className?: string;
  style?: import("react").CSSProperties;
}

// ─── Utility Types ────────────────────────────────────────────────────────────

/** Generic paginated response wrapper. */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Standard API error shape. */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

/** Standard API success envelope. */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

export type ApiResult<T> = ApiResponse<T> | { success: false; error: ApiError };

// ─── Diamond Preset Config ────────────────────────────────────────────────────

/**
 * Curated filter presets for common buyer archetypes.
 * Applied server-side when `preset` is included in DiamondSearchParams.
 */
export const DIAMOND_PRESETS: Record<
  "MOST_SPARKLE" | "BEST_BALANCE" | "BEST_VALUE",
  Partial<DiamondSearchParams>
> = {
  MOST_SPARKLE: {
    cutGrade: ["Excellent"],
    polish: ["Excellent"],
    symmetry: ["Excellent"],
    fluorescence: ["None"],
    eyeClean: true,
  },
  BEST_BALANCE: {
    cutGrade: ["Excellent", "Very Good"],
    color: ["D", "E", "F", "G", "H"],
    clarity: ["VS1", "VS2", "SI1"],
    eyeClean: true,
  },
  BEST_VALUE: {
    cutGrade: ["Good", "Very Good"],
    color: ["G", "H", "I", "J"],
    clarity: ["SI1", "SI2"],
  },
};

// ─── Display Helpers ──────────────────────────────────────────────────────────

export const METAL_TYPE_LABELS: Record<MetalType, string> = {
  [MetalType.EIGHTEEN_K_YELLOW_GOLD]: "18K Yellow Gold",
  [MetalType.EIGHTEEN_K_WHITE_GOLD]: "18K White Gold",
  [MetalType.FOURTEEN_K_YELLOW_GOLD]: "14K Yellow Gold",
  [MetalType.FOURTEEN_K_WHITE_GOLD]: "14K White Gold",
  [MetalType.ROSE_GOLD]: "Rose Gold",
  [MetalType.PLATINUM]: "Platinum",
  [MetalType.TUNGSTEN]: "Tungsten",
  [MetalType.TANTALUM]: "Tantalum",
  [MetalType.METEORITE]: "Meteorite",
};

export const SETTING_STYLE_LABELS: Record<SettingStyle, string> = {
  [SettingStyle.SOLITAIRE]: "Solitaire",
  [SettingStyle.HALO]: "Halo",
  [SettingStyle.HIDDEN_HALO]: "Hidden Halo",
  [SettingStyle.THREE_STONE]: "Three Stone",
  [SettingStyle.BEZEL]: "Bezel",
  [SettingStyle.PAVE]: "Pavé",
  [SettingStyle.CHANNEL]: "Channel",
  [SettingStyle.VINTAGE]: "Antique & Vintage",
  [SettingStyle.NATURE_INSPIRED]: "Nature-Inspired",
};

export const DIAMOND_SHAPE_LABELS: Record<DiamondShape, string> = {
  [DiamondShape.ROUND]: "Round",
  [DiamondShape.OVAL]: "Oval",
  [DiamondShape.EMERALD]: "Emerald",
  [DiamondShape.MARQUISE]: "Marquise",
  [DiamondShape.RADIANT]: "Radiant",
  [DiamondShape.PEAR]: "Pear",
  [DiamondShape.ELONGATED_CUSHION]: "Elongated Cushion",
  [DiamondShape.CUSHION]: "Cushion",
  [DiamondShape.PRINCESS]: "Princess",
  [DiamondShape.ASSCHER]: "Asscher",
  [DiamondShape.HEART]: "Heart",
  [DiamondShape.ANTIQUE_CUSHION]: "Antique Cushion",
};

export const RING_SIZES = [
  "5", "5.5", "6", "6.5", "7", "7.5",
  "8", "8.5", "9", "9.5", "10", "10.5",
  "11", "11.5", "12", "12.5", "13",
];

export const CLARITY_ORDER: string[] = [
  "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3",
];

export const COLOR_ORDER: string[] = [
  "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
];
