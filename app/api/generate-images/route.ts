/**
 * POST /api/generate-images
 *
 * Generates a single AI image via Gemini API.
 * Body: { prompt: string, name: string }
 * Returns: { success: boolean, path: string }
 */

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not set in .env.local" }, { status: 500 });
  }

  const { prompt, name } = await req.json();
  if (!prompt || !name) {
    return NextResponse.json({ error: "Missing prompt or name" }, { status: 400 });
  }

  const outputDir = path.join(process.cwd(), "public", "generated");
  fs.mkdirSync(outputDir, { recursive: true });

  // Try Imagen first, fall back to Gemini Flash
  let imageBuffer: Buffer | null = null;

  // Attempt 1: Imagen 3
  try {
    const imagenRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, safetyFilterLevel: "BLOCK_ONLY_HIGH" },
        }),
      }
    );
    const imagenData = await imagenRes.json();
    const b64 = imagenData.predictions?.[0]?.bytesBase64Encoded;
    if (b64) {
      imageBuffer = Buffer.from(b64, "base64");
    }
  } catch {}

  // Attempt 2: Gemini Flash with image output
  if (!imageBuffer) {
    try {
      const flashRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Generate a high-quality image: ${prompt}` }] }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
          }),
        }
      );
      const flashData = await flashRes.json();
      const parts = flashData.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));
      if (imgPart) {
        imageBuffer = Buffer.from(imgPart.inlineData.data, "base64");
      }
    } catch {}
  }

  if (!imageBuffer) {
    return NextResponse.json({ error: "Failed to generate image. Check API key and billing." }, { status: 502 });
  }

  const outPath = path.join(outputDir, name);
  fs.writeFileSync(outPath, imageBuffer);

  return NextResponse.json({
    success: true,
    path: `/generated/${name}`,
    size: `${(imageBuffer.length / 1024).toFixed(0)}KB`,
  });
}
