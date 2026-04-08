/**
 * lib/rapnet.ts
 * RapNet API wrapper for virtual diamond inventory.
 *
 * Handles:
 *  - OAuth token acquisition & refresh
 *  - Paginated diamond search with full 4Cs + advanced filter support
 *  - Delta sync (fetch only diamonds updated since lastSyncedAt)
 *  - Availability spot-check before checkout
 *
 * RapNet credentials are stored in environment variables.
 * In production, tokens should be stored in Redis with TTL to avoid
 * re-authenticating on every request.
 */

import axios, { type AxiosInstance } from "axios";
import { redis, CACHE_TTL } from "@/lib/redis";
import type { Diamond, DiamondShape, DiamondOrigin } from "@/types";

const RAPNET_BASE_URL = "https://technet.rapaport.com/api/rpxfeed/v2";
const RAPNET_AUTH_URL = "https://authws.rapaport.com/nusoap/authuser_ws.asmx";
const RAPNET_TOKEN_KEY = "rapnet:access_token";

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const cached = await redis.get(RAPNET_TOKEN_KEY);
  if (cached) return cached;

  // RapNet uses SOAP/XML for auth; simplified to a fetch here
  const response = await fetch(RAPNET_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "text/xml" },
    body: buildAuthSoapEnvelope(
      process.env.RAPNET_USERNAME!,
      process.env.RAPNET_PASSWORD!
    ),
  });

  if (!response.ok) {
    throw new Error(`RapNet auth failed: ${response.statusText}`);
  }

  const xml = await response.text();
  const token = extractTokenFromXml(xml);

  // Cache for 55 minutes (token expires at 60 min)
  await redis.setex(RAPNET_TOKEN_KEY, 60 * 55, token);
  return token;
}

function buildAuthSoapEnvelope(username: string, password: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Login xmlns="http://www.rapaport.com/technet/">
      <Username>${username}</Username>
      <Password>${password}</Password>
    </Login>
  </soap:Body>
</soap:Envelope>`;
}

function extractTokenFromXml(xml: string): string {
  const match = xml.match(/<LoginResult>(.*?)<\/LoginResult>/);
  if (!match) throw new Error("Could not extract RapNet auth token from response");
  return match[1];
}

// ─── API Client ───────────────────────────────────────────────────────────────

async function createRapNetClient(): Promise<AxiosInstance> {
  const token = await getAccessToken();
  return axios.create({
    baseURL: RAPNET_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    timeout: 15_000,
  });
}

// ─── Raw RapNet Response Shape ────────────────────────────────────────────────

interface RapNetDiamondRaw {
  lot_num: string;
  shape: string;
  weight: number;
  color: string;
  clarity: string;
  cut: string;
  rap_avg_price_pct: number; // Percentage of Rap price
  calc_price: number;        // Calculated dollar price
  origin: string;
  lab: string;
  cert_num: string;
  cert_url: string;
  polish: string;
  symmetry: string;
  table: number;
  depth: number;
  culet: string;
  fluorescence_intensity: string;
  eye_clean: string;
  pic_url: string;
  video_url: string;
  v360_url: string;
  carbon_capture: boolean;
  renewable_energy: boolean;
  tracr_id?: string;
}

// ─── Transform ────────────────────────────────────────────────────────────────

/**
 * Maps a RapNet raw response to our internal Diamond model.
 * Shape names, cut grades, and clarity codes are normalized here.
 */
function transformRapNetDiamond(raw: RapNetDiamondRaw): Omit<Diamond, "id" | "lastSyncedAt"> {
  return {
    supplierStockId: raw.lot_num,
    shape: normalizeShape(raw.shape),
    caratWeight: raw.weight,
    color: raw.color,
    clarity: raw.clarity,
    cutGrade: raw.cut,
    price: raw.calc_price,
    origin: normalizeOrigin(raw.origin),
    polish: raw.polish || undefined,
    symmetry: raw.symmetry || undefined,
    tablePercent: raw.table || undefined,
    depthPercent: raw.depth || undefined,
    culetSize: raw.culet || undefined,
    fluorescence: raw.fluorescence_intensity || undefined,
    eyeClean: raw.eye_clean === "Yes" ? true : raw.eye_clean === "No" ? false : undefined,
    certificationLab: raw.lab || undefined,
    certificateNo: raw.cert_num || undefined,
    certificateUrl: raw.cert_url || undefined,
    imageUrl: raw.pic_url || undefined,
    videoUrl: raw.video_url || undefined,
    v360Url: raw.v360_url || undefined,
    blockchainId: raw.tracr_id || undefined,
    renewableEnergy: raw.renewable_energy ?? false,
    carbonCapture: raw.carbon_capture ?? false,
    isAvailable: true,
  };
}

function normalizeShape(shape: string): DiamondShape {
  const map: Record<string, DiamondShape> = {
    RD: "ROUND",
    OV: "OVAL",
    EM: "EMERALD",
    MQ: "MARQUISE",
    RA: "RADIANT",
    PE: "PEAR",
    EC: "ELONGATED_CUSHION",
    CU: "CUSHION",
    PR: "PRINCESS",
    AS: "ASSCHER",
    HS: "HEART",
    AC: "ANTIQUE_CUSHION",
  };
  return (map[shape.toUpperCase()] ?? "ROUND") as DiamondShape;
}

function normalizeOrigin(origin: string): DiamondOrigin {
  const lower = origin.toLowerCase();
  if (lower.includes("lab")) return "LAB_GROWN";
  if (lower.includes("color")) return "COLORED";
  return "NATURAL";
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface RapNetSearchParams {
  shapes?: string[];
  minWeight?: number;
  maxWeight?: number;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  clarities?: string[];
  cuts?: string[];
  labs?: string[];
  page?: number;
  pageSize?: number;
  includeLabGrown?: boolean;
}

export interface RapNetSearchResult {
  diamonds: Array<Omit<Diamond, "id" | "lastSyncedAt">>;
  total: number;
}

/**
 * Search RapNet inventory with filters.
 * Results are NOT cached here — caching is handled by the API route layer.
 */
export async function searchRapNetDiamonds(
  params: RapNetSearchParams
): Promise<RapNetSearchResult> {
  const client = await createRapNetClient();

  const response = await client.post<{ data: RapNetDiamondRaw[]; total: number }>(
    "/stones/search",
    {
      shapes: params.shapes,
      weight_range: { min: params.minWeight, max: params.maxWeight },
      price_range: { min: params.minPrice, max: params.maxPrice },
      colors: params.colors,
      clarities: params.clarities,
      cuts: params.cuts,
      labs: params.labs,
      include_lab_grown: params.includeLabGrown ?? true,
      page: params.page ?? 1,
      per_page: params.pageSize ?? 24,
    }
  );

  return {
    diamonds: response.data.data.map(transformRapNetDiamond),
    total: response.data.total,
  };
}

/**
 * Fetch a single diamond by RapNet lot number.
 * Used for real-time availability check at checkout.
 */
export async function getRapNetDiamond(
  lotNum: string
): Promise<Omit<Diamond, "id" | "lastSyncedAt"> | null> {
  try {
    const client = await createRapNetClient();
    const response = await client.get<RapNetDiamondRaw>(`/stones/${lotNum}`);
    return transformRapNetDiamond(response.data);
  } catch {
    return null; // Diamond no longer available
  }
}

/**
 * Fetch diamonds updated since a given timestamp for delta sync.
 * Called by the background inventory sync job every 15 minutes.
 */
export async function fetchDeltaInventory(
  since: Date,
  page = 1,
  pageSize = 500
): Promise<RapNetSearchResult> {
  const client = await createRapNetClient();
  const response = await client.get<{ data: RapNetDiamondRaw[]; total: number }>(
    "/stones/updated",
    {
      params: {
        since: since.toISOString(),
        page,
        per_page: pageSize,
      },
    }
  );

  return {
    diamonds: response.data.data.map(transformRapNetDiamond),
    total: response.data.total,
  };
}
