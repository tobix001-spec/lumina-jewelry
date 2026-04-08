/**
 * prisma/seed.ts
 * Development seed data. Run with: npm run db:seed
 *
 * Seeds:
 *  - 10 ring settings (various metals & styles)
 *  - 50 mock diamonds (covering multiple shapes, 4Cs combos, and origins)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Settings Seed ────────────────────────────────────────────────────────────

const SETTINGS_SEED = [
  {
    sku: "SET-SOL-18KW-001",
    name: "Classic Solitaire",
    description: "Timeless six-prong solitaire in 18K white gold.",
    metalType: "EIGHTEEN_K_WHITE_GOLD",
    basePrice: 995,
    style: "SOLITAIRE",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    allowedShapes: ["ROUND", "OVAL", "CUSHION", "PRINCESS", "RADIANT"],
  },
  {
    sku: "SET-HAL-PLT-001",
    name: "Diamond Halo Setting",
    description: "Brilliant halo of pavé diamonds in platinum.",
    metalType: "PLATINUM",
    basePrice: 1850,
    style: "HALO",
    imageUrl: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400",
    allowedShapes: ["ROUND", "OVAL", "CUSHION", "PEAR", "MARQUISE"],
  },
  {
    sku: "SET-HH-18KY-001",
    name: "Hidden Halo",
    description: "Delicate pavé halo tucked beneath the center stone. 18K yellow gold.",
    metalType: "EIGHTEEN_K_YELLOW_GOLD",
    basePrice: 1495,
    style: "HIDDEN_HALO",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
    allowedShapes: ["OVAL", "ROUND", "CUSHION", "ELONGATED_CUSHION", "PEAR"],
  },
  {
    sku: "SET-3ST-RG-001",
    name: "Three Stone Setting",
    description: "Elegant three-stone design with side trillion diamonds. Rose gold.",
    metalType: "ROSE_GOLD",
    basePrice: 1295,
    style: "THREE_STONE",
    imageUrl: "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=400",
    allowedShapes: ["ROUND", "OVAL", "EMERALD", "RADIANT", "CUSHION"],
  },
  {
    sku: "SET-BEZ-PLT-001",
    name: "Modern Bezel",
    description: "Full-bezel contemporary design in polished platinum.",
    metalType: "PLATINUM",
    basePrice: 1150,
    style: "BEZEL",
    imageUrl: "https://images.unsplash.com/photo-1573408301185-9519f94fce70?w=400",
    allowedShapes: ["ROUND", "OVAL", "MARQUISE", "PEAR", "EMERALD"],
  },
  {
    sku: "SET-VIN-18KW-001",
    name: "Vintage Milgrain",
    description: "Art Deco-inspired milgrain edges with intricate filigree.",
    metalType: "EIGHTEEN_K_WHITE_GOLD",
    basePrice: 1750,
    style: "VINTAGE",
    imageUrl: "https://images.unsplash.com/photo-1548691717-5e48df8d44db?w=400",
    allowedShapes: ["ROUND", "CUSHION", "ASSCHER", "ANTIQUE_CUSHION", "EMERALD"],
  },
  {
    sku: "SET-NAT-18KY-001",
    name: "Blossom Nature Setting",
    description: "Organic petal-inspired prongs evoke a floral motif.",
    metalType: "EIGHTEEN_K_YELLOW_GOLD",
    basePrice: 1395,
    style: "NATURE_INSPIRED",
    imageUrl: "https://images.unsplash.com/photo-1532453288672-3a17f2e980ae?w=400",
    allowedShapes: ["ROUND", "OVAL", "PEAR", "MARQUISE", "HEART"],
  },
  {
    sku: "SET-PAV-RG-001",
    name: "Pavé Band",
    description: "Full French-set pavé diamonds along the band. Rose gold.",
    metalType: "ROSE_GOLD",
    basePrice: 2250,
    style: "PAVE",
    imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400",
    allowedShapes: ["ROUND", "OVAL", "CUSHION", "RADIANT", "PRINCESS"],
  },
  {
    sku: "SET-SOL-14KY-001",
    name: "Petite Solitaire",
    description: "Slim, minimalist four-prong solitaire in 14K yellow gold.",
    metalType: "FOURTEEN_K_YELLOW_GOLD",
    basePrice: 595,
    style: "SOLITAIRE",
    imageUrl: "https://images.unsplash.com/photo-1589394942756-28de60a7dd5c?w=400",
    allowedShapes: ["ROUND", "OVAL", "PEAR", "MARQUISE", "EMERALD", "ASSCHER", "PRINCESS"],
  },
  {
    sku: "SET-HH-PLT-002",
    name: "Emerald Cut Hidden Halo",
    description: "Cathedral-set emerald cut center, hidden halo, platinum.",
    metalType: "PLATINUM",
    basePrice: 2100,
    style: "HIDDEN_HALO",
    imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400",
    allowedShapes: ["EMERALD", "ASSCHER", "RADIANT", "CUSHION"],
  },
] as const;

// ─── Diamond Seed ─────────────────────────────────────────────────────────────

function makeDiamond(
  idx: number,
  override: Partial<{
    shape: string;
    caratWeight: number;
    color: string;
    clarity: string;
    cutGrade: string;
    price: number;
    origin: string;
    renewableEnergy: boolean;
    carbonCapture: boolean;
  }>
) {
  const shapes = ["ROUND", "OVAL", "EMERALD", "CUSHION", "PEAR", "RADIANT", "MARQUISE", "PRINCESS"];
  const colors = ["D", "E", "F", "G", "H", "I", "J"];
  const clarities = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
  const cuts = ["Excellent", "Very Good", "Good"];
  const labs = ["GIA", "IGI", "GCAL"];

  return {
    supplierStockId: `RPN-${100000 + idx}`,
    shape: override.shape ?? shapes[idx % shapes.length],
    caratWeight: override.caratWeight ?? parseFloat((0.5 + (idx % 30) * 0.15).toFixed(2)),
    color: override.color ?? colors[idx % colors.length],
    clarity: override.clarity ?? clarities[idx % clarities.length],
    cutGrade: override.cutGrade ?? cuts[idx % cuts.length],
    price: override.price ?? Math.round(2000 + idx * 350 + Math.random() * 500),
    origin: override.origin ?? (idx % 3 === 0 ? "LAB_GROWN" : "NATURAL"),
    polish: "Excellent",
    symmetry: "Excellent",
    tablePercent: 57 + (idx % 8),
    depthPercent: 61 + (idx % 6),
    fluorescence: idx % 5 === 0 ? "Faint" : "None",
    eyeClean: true,
    certificationLab: labs[idx % labs.length],
    certificateNo: `CERT-${200000 + idx}`,
    renewableEnergy: override.renewableEnergy ?? idx % 7 === 0,
    carbonCapture: override.carbonCapture ?? idx % 11 === 0,
    isAvailable: true,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing seed data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.diamond.deleteMany();
  await prisma.settingShape.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  // Seed settings
  for (const setting of SETTINGS_SEED) {
    const { allowedShapes, ...settingData } = setting;
    await prisma.setting.create({
      data: {
        ...settingData,
        metalType: settingData.metalType as never,
        style: settingData.style as never,
        galleryUrls: [],
        allowedShapes: {
          create: allowedShapes.map((shape) => ({
            allowedShape: shape as never,
          })),
        },
      },
    });
  }
  console.log(`✓ Created ${SETTINGS_SEED.length} settings`);

  // Seed diamonds
  const DIAMOND_COUNT = 50;
  const diamonds = Array.from({ length: DIAMOND_COUNT }, (_, i) => makeDiamond(i, {}));

  // Add some special cases
  diamonds[0] = makeDiamond(0, { shape: "OVAL", caratWeight: 2.1, color: "D", clarity: "VVS1", price: 18500, origin: "NATURAL" });
  diamonds[1] = makeDiamond(1, { shape: "ROUND", caratWeight: 1.5, color: "E", clarity: "VS1", price: 9200, origin: "LAB_GROWN", renewableEnergy: true });
  diamonds[2] = makeDiamond(2, { shape: "EMERALD", caratWeight: 3.02, color: "F", clarity: "VS2", price: 24000, origin: "NATURAL" });
  diamonds[3] = makeDiamond(3, { shape: "PEAR", caratWeight: 1.25, color: "G", clarity: "SI1", price: 5800, origin: "LAB_GROWN", carbonCapture: true });

  await prisma.diamond.createMany({ data: diamonds as never[] });
  console.log(`✓ Created ${DIAMOND_COUNT} diamonds`);

  // Seed a demo admin user (password hashing omitted for seed; use bcrypt in production)
  await prisma.user.create({
    data: {
      email: "admin@luminajewelry.com",
      firstName: "Lumina",
      lastName: "Admin",
      role: "ADMIN",
    },
  });
  console.log("✓ Created admin user");

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
