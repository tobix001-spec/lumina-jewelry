/**
 * scripts/generate-images.ts
 *
 * Generates all site images using Google Gemini Imagen API.
 * Run: npx tsx scripts/generate-images.ts
 *
 * Requires GEMINI_API_KEY in .env.local
 */

import fs from "fs";
import path from "path";
import https from "https";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in .env.local");
  process.exit(1);
}

const OUTPUT_DIR = path.join(process.cwd(), "public", "generated");

// ─── Image Prompts ───────────────────────────────────────────────────────────

const IMAGES: { name: string; prompt: string; width: number; height: number }[] = [
  // Hero slides
  {
    name: "hero-1.png",
    prompt: "Stunning close-up of an oval diamond engagement ring on soft white silk fabric, warm golden hour lighting, shallow depth of field, luxury jewelry product photography, 4K, ultra sharp, editorial style",
    width: 1920, height: 1080,
  },
  {
    name: "hero-2.png",
    prompt: "Brilliant lab-grown diamond under magnifying loupe showing facets and fire, dramatic black background with prismatic light reflections, ultra-sharp macro photography, luxury jewelry campaign, 4K",
    width: 1920, height: 1080,
  },
  {
    name: "hero-3.png",
    prompt: "Nature-inspired sapphire and diamond ring placed on green moss with small flowers, soft natural light, romantic dreamy bokeh background, fine jewelry editorial photography, 4K",
    width: 1920, height: 1080,
  },

  // Category cards
  {
    name: "cat-engagement.png",
    prompt: "Single solitaire diamond engagement ring on white marble, soft shadows, top-down angle, minimal luxury product photo, warm neutral tones, 4K",
    width: 700, height: 933,
  },
  {
    name: "cat-wedding.png",
    prompt: "Pair of matching platinum wedding bands interlinked on cream satin fabric, warm studio lighting, luxury jewelry product photography, soft focus background, 4K",
    width: 700, height: 933,
  },
  {
    name: "cat-fine-jewelry.png",
    prompt: "Elegant diamond pendant necklace draped on a woman's collarbone, warm skin tones, soft studio lighting, luxury fashion photography, close crop, 4K",
    width: 700, height: 933,
  },
  {
    name: "cat-lab-diamonds.png",
    prompt: "Single brilliant-cut lab diamond floating on reflective black surface with rainbow light dispersion, dramatic lighting, product photography, 4K",
    width: 700, height: 933,
  },
  {
    name: "cat-best-sellers.png",
    prompt: "Curated flat lay of luxury jewelry pieces - ring, earrings, bracelet - on cream linen, gold accents, overhead shot, editorial styling, warm tones, 4K",
    width: 700, height: 933,
  },

  // Popular style collections
  {
    name: "style-solitaire.png",
    prompt: "Classic round solitaire diamond ring on thin platinum band, soft white background, elegant shadow, luxury product photography, sharp focus on diamond, 4K",
    width: 600, height: 750,
  },
  {
    name: "style-hidden-halo.png",
    prompt: "Hidden halo engagement ring showing the delicate diamond halo under the center stone, macro close-up, white background, luxury jewelry photography, 4K",
    width: 600, height: 750,
  },
  {
    name: "style-nature.png",
    prompt: "Organic nature-inspired engagement ring with vine details and small diamonds set in rose gold, placed among fresh flowers, soft natural light, 4K",
    width: 600, height: 750,
  },
  {
    name: "style-ready.png",
    prompt: "Elegant engagement ring in a luxury navy blue ring box with gold trim, white silk background, gift-ready presentation, luxury product photography, 4K",
    width: 600, height: 750,
  },

  // Trend report
  {
    name: "trend-fine-jewelry.png",
    prompt: "Fashion editorial photo of model wearing layered gold necklaces and diamond earrings, soft warm studio lighting, cream background, luxury fashion magazine style, 4K",
    width: 900, height: 1125,
  },
  {
    name: "trend-engagement.png",
    prompt: "Close-up of a hand wearing multiple stacked engagement and wedding rings, soft bokeh, golden hour lighting, romantic mood, luxury bridal editorial, 4K",
    width: 900, height: 1125,
  },
  {
    name: "trend-wedding.png",
    prompt: "Hands of a couple exchanging wedding bands, close-up, soft backlight, emotional intimate moment, fine art wedding photography, warm tones, 4K",
    width: 900, height: 1125,
  },

  // Omnichannel showroom
  {
    name: "showroom.png",
    prompt: "Luxury jewelry showroom interior with glass display cases showing rings and necklaces, warm ambient lighting, modern minimalist design with cream marble and gold accents, a jeweler consulting with a couple, 4K",
    width: 900, height: 1125,
  },

  // Mission
  {
    name: "mission.png",
    prompt: "Aerial view of an ethical diamond mine with green landscape and sustainable practices, golden hour lighting, documentary photography style, wide cinematic shot, 4K",
    width: 1600, height: 900,
  },

  // Collections carousel
  {
    name: "col-anniversary.png",
    prompt: "Anniversary diamond jewelry collection on dark velvet, multiple pieces including ring, earrings and pendant arranged artistically, dramatic lighting, 4K",
    width: 900, height: 1200,
  },
  {
    name: "col-signature.png",
    prompt: "Iconic signature diamond solitaire ring lit by a single spotlight on black background, creating dramatic shadows and diamond fire, luxury campaign photo, 4K",
    width: 900, height: 1200,
  },
  {
    name: "col-pacific.png",
    prompt: "Stunning Colombian emerald ring surrounded by small diamonds, on a natural stone surface with green botanical elements, luxury editorial style, 4K",
    width: 900, height: 1200,
  },
  {
    name: "col-nature.png",
    prompt: "Nature-inspired jewelry collection flat lay on moss and bark, rings and earrings with organic vine motifs in rose gold, soft diffused forest light, 4K",
    width: 900, height: 1200,
  },
];

// ─── Gemini Imagen API ───────────────────────────────────────────────────────

async function generateImage(prompt: string, name: string): Promise<void> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;

  const body = JSON.stringify({
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: "1:1",
      safetyFilterLevel: "BLOCK_ONLY_HIGH",
    },
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);

          if (json.error) {
            // Try fallback to gemini-2.0-flash with image generation
            console.log(`  ⚠ Imagen failed for ${name}, trying Gemini Flash...`);
            generateWithGeminiFlash(prompt, name).then(resolve).catch(reject);
            return;
          }

          const b64 = json.predictions?.[0]?.bytesBase64Encoded;
          if (!b64) {
            console.log(`  ⚠ No image data for ${name}, trying Gemini Flash...`);
            generateWithGeminiFlash(prompt, name).then(resolve).catch(reject);
            return;
          }

          const buffer = Buffer.from(b64, "base64");
          const outPath = path.join(OUTPUT_DIR, name);
          fs.writeFileSync(outPath, buffer);
          console.log(`  ✅ ${name} (${(buffer.length / 1024).toFixed(0)}KB)`);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function generateWithGeminiFlash(prompt: string, name: string): Promise<void> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

  const body = JSON.stringify({
    contents: [{
      parts: [{
        text: `Generate a high-quality image: ${prompt}`
      }]
    }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);

          if (json.error) {
            console.log(`  ❌ ${name}: ${json.error.message}`);
            resolve(); // Don't fail the whole batch
            return;
          }

          // Look for inline image data in response
          const parts = json.candidates?.[0]?.content?.parts || [];
          const imgPart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));

          if (!imgPart) {
            console.log(`  ❌ ${name}: No image in response`);
            resolve();
            return;
          }

          const buffer = Buffer.from(imgPart.inlineData.data, "base64");
          const outPath = path.join(OUTPUT_DIR, name);
          fs.writeFileSync(outPath, buffer);
          console.log(`  ✅ ${name} (${(buffer.length / 1024).toFixed(0)}KB) [via Flash]`);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🎨 Lumina Jewelry — AI Image Generator\n");
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log(`  Images: ${IMAGES.length}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate in batches of 3 to avoid rate limits
  for (let i = 0; i < IMAGES.length; i += 3) {
    const batch = IMAGES.slice(i, i + 3);
    console.log(`\n📦 Batch ${Math.floor(i / 3) + 1}/${Math.ceil(IMAGES.length / 3)}`);

    await Promise.all(
      batch.map(({ name, prompt }) => generateImage(prompt, name))
    );

    // Small delay between batches
    if (i + 3 < IMAGES.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // Print summary
  const generated = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".png"));
  console.log(`\n✨ Done! Generated ${generated.length}/${IMAGES.length} images.`);

  if (generated.length < IMAGES.length) {
    console.log("⚠  Some images failed. Check your API key and billing at https://aistudio.google.com");
  }
}

main().catch(console.error);
