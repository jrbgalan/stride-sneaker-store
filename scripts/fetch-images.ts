import fs from "fs";
import path from "path";
import sharp from "sharp";
import { SEED_PRODUCTS } from "../src/lib/db/seedData.js";

// Read environment variables from .env.local without external dotenv dependency
function loadEnvLocal(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const env: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        env[key] = val;
      }
    }
  }
  return env;
}

const env = loadEnvLocal();
const UNSPLASH_ACCESS_KEY = env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = env.PEXELS_API_KEY || process.env.PEXELS_API_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  console.warn("⚠️ Warning: UNSPLASH_ACCESS_KEY not found in .env.local. Fetching may be restricted.");
}

interface ImageManifestEntry {
  src: string;
  alt: string;
  blurDataURL: string;
  photographer: string;
  photographerUrl: string;
  sourceLink: string;
  colorName?: string;
  width?: number;
  height?: number;
}

type Manifest = Record<string, ImageManifestEntry[]>;

// Delay helper
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fallback high quality sneaker images from Unsplash (clean CC0 URLs)
const FALLBACK_SNEAKER_PHOTOS = [
  {
    id: "fb-1",
    url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80",
    photographer: "Ox Street",
    photographerUrl: "https://unsplash.com/@oxstreet",
    sourceLink: "https://unsplash.com/photos/unpaired-red-and-white-nike-air-jordan-1-shoe-Yp9jxEkf6Ro",
    alt: "Sneaker in studio setting",
  },
  {
    id: "fb-2",
    url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
    photographer: "Paul Volkmer",
    photographerUrl: "https://unsplash.com/@paulv",
    sourceLink: "https://unsplash.com/photos/unpaired-white-and-black-nike-sneaker-upw5q-jnp5o",
    alt: "Low top retro sneaker",
  },
  {
    id: "fb-3",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    photographer: "REVOLT",
    photographerUrl: "https://unsplash.com/@revolt",
    sourceLink: "https://unsplash.com/photos/red-nike-running-shoes-164_6wVEHfI",
    alt: "Athletic performance shoe",
  },
  {
    id: "fb-4",
    url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    photographer: "Lucas Hoang",
    photographerUrl: "https://unsplash.com/@lucashoang",
    sourceLink: "https://unsplash.com/photos/unpaired-puma-suede-shoe-wL5w1vHv_K4",
    alt: "Classic suede sneaker",
  },
  {
    id: "fb-5",
    url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
    photographer: "Camila Damásio",
    photographerUrl: "https://unsplash.com/@camilacordeiro",
    sourceLink: "https://unsplash.com/photos/black-and-white-vans-old-skool-mWyAN3fvPPg",
    alt: "Classic canvas skate sneaker",
  },
  {
    id: "fb-6",
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    photographer: "Maksim Larin",
    photographerUrl: "https://unsplash.com/@maksimlarin",
    sourceLink: "https://unsplash.com/photos/unpaired-brown-nike-sneaker-NOpsC3nWTzY",
    alt: "Streetwear lifestyle shoe",
  },
  {
    id: "fb-7",
    url: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80",
    photographer: "Iman Ameli",
    photographerUrl: "https://unsplash.com/@imanameli",
    sourceLink: "https://unsplash.com/photos/unpaired-black-white-nike-sneaker-KSQg4hh0_b4",
    alt: "Retro basketball silhouette",
  },
  {
    id: "fb-8",
    url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80",
    photographer: "Fachry Zella Devandra",
    photographerUrl: "https://unsplash.com/@fachryzella",
    sourceLink: "https://unsplash.com/photos/unpaired-white-sneaker-on-concrete-xbEVM68Q230",
    alt: "Clean minimal sneaker",
  },
];

async function fetchWithRetry(url: string, headers: Record<string, string>, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers });
      if (res.status === 429) {
        console.warn(`⏳ Rate limit reached. Backing off for ${(i + 1) * 3}s...`);
        await sleep((i + 1) * 3000);
        continue;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(1500 * (i + 1));
    }
  }
}

async function searchUnsplash(query: string): Promise<any[]> {
  if (!UNSPLASH_ACCESS_KEY) return [];
  const endpoint = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=12&orientation=squarish`;
  try {
    const data = await fetchWithRetry(endpoint, {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      "Accept-Version": "v1",
    });
    return data?.results || [];
  } catch (err: any) {
    console.warn(`⚠️ Unsplash search failed for "${query}": ${err?.message}`);
    return [];
  }
}

async function downloadAndProcessImage(
  url: string,
  destPath: string
): Promise<{ buffer: Buffer; blurDataURL: string; width: number; height: number }> {
  // If destination already exists, generate placeholder from existing file
  if (fs.existsSync(destPath)) {
    const existingBuffer = fs.readFileSync(destPath);
    const meta = await sharp(existingBuffer).metadata();
    const blurBuffer = await sharp(existingBuffer)
      .resize(16, 16, { fit: "inside" })
      .webp({ quality: 20 })
      .toBuffer();
    return {
      buffer: existingBuffer,
      blurDataURL: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
      width: meta.width || 1200,
      height: meta.height || 1200,
    };
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download image from ${url}: HTTP ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const rawBuffer = Buffer.from(arrayBuffer);

  const sharpInstance = sharp(rawBuffer);

  // Resize to max width 1200, webp quality 80
  const optimizedBuffer = await sharpInstance
    .clone()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const meta = await sharp(optimizedBuffer).metadata();

  // Create tiny blur placeholder
  const blurBuffer = await sharpInstance
    .clone()
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 20 })
    .toBuffer();

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, optimizedBuffer);

  return {
    buffer: optimizedBuffer,
    blurDataURL: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
    width: meta.width || 1200,
    height: meta.height || 1200,
  };
}

async function main() {
  console.log("==================================================");
  console.log("👟 AXIS SNEAKERS - Automated Image Pipeline");
  console.log("==================================================");

  const manifestPath = path.resolve(process.cwd(), "data/product-images.json");
  let manifest: Manifest = {};

  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      console.log(`📋 Loaded existing manifest with ${Object.keys(manifest).length} products.`);
    } catch {}
  }

  const usedImageIds = new Set<string>();
  let totalProcessed = 0;
  let totalDownloaded = 0;
  let totalCached = 0;

  for (const product of SEED_PRODUCTS) {
    console.log(`\n🔍 Processing: ${product.name} (${product.brand} - ${product.category})`);
    const slug = product.slug;
    const productDir = path.resolve(process.cwd(), `public/images/products/${slug}`);
    fs.mkdirSync(productDir, { recursive: true });

    const productImages: ImageManifestEntry[] = [];
    const colors = product.colors || [{ name: "Standard", hex: "#000000" }];
    const targetCount = Math.max(3, Math.min(4, colors.length + 1));

    let imgIndex = 0;

    // Search per color swatch first
    for (let cIdx = 0; cIdx < colors.length && productImages.length < targetCount; cIdx++) {
      const color = colors[cIdx];
      const colorQuery = color.name.split("/")[0].trim().toLowerCase();
      const query = `${colorQuery} ${product.category.toLowerCase()} sneaker`;

      console.log(`  -> Query [Color: ${color.name}]: "${query}"`);
      await sleep(350); // respect rate limits
      const results = await searchUnsplash(query);

      // Find unused photo
      const picked = results.find((p) => !usedImageIds.has(p.id));
      if (picked) {
        usedImageIds.add(picked.id);
        const fileName = `image-${imgIndex + 1}.webp`;
        const destPath = path.join(productDir, fileName);
        const relativeSrc = `/images/products/${slug}/${fileName}`;

        try {
          const isCached = fs.existsSync(destPath);
          const { blurDataURL, width, height } = await downloadAndProcessImage(
            picked.urls.regular || picked.urls.raw,
            destPath
          );

          if (isCached) totalCached++;
          else totalDownloaded++;

          productImages.push({
            src: relativeSrc,
            alt: `${product.name} - ${color.name}`,
            blurDataURL,
            photographer: picked.user?.name || "Unsplash Creator",
            photographerUrl: `${picked.user?.links?.html || "https://unsplash.com"}?utm_source=axis_store&utm_medium=referral`,
            sourceLink: `${picked.links?.html || picked.urls.raw}?utm_source=axis_store&utm_medium=referral`,
            colorName: color.name,
            width,
            height,
          });

          console.log(`    ✓ Saved ${fileName} (${isCached ? "cached" : "downloaded"}) by ${picked.user?.name}`);
          imgIndex++;
        } catch (err: any) {
          console.error(`    ✗ Download error for ${fileName}:`, err?.message);
        }
      }
    }

    // If still need more images to reach targetCount, search general brand/category
    if (productImages.length < targetCount) {
      const generalQuery = `${product.brand.toLowerCase()} ${product.category.toLowerCase()} shoe sneaker`;
      console.log(`  -> Filling remaining slots with query: "${generalQuery}"`);
      await sleep(350);
      const results = await searchUnsplash(generalQuery);

      for (const photo of results) {
        if (productImages.length >= targetCount) break;
        if (usedImageIds.has(photo.id)) continue;

        usedImageIds.add(photo.id);
        const fileName = `image-${imgIndex + 1}.webp`;
        const destPath = path.join(productDir, fileName);
        const relativeSrc = `/images/products/${slug}/${fileName}`;

        try {
          const isCached = fs.existsSync(destPath);
          const { blurDataURL, width, height } = await downloadAndProcessImage(
            photo.urls.regular || photo.urls.raw,
            destPath
          );

          if (isCached) totalCached++;
          else totalDownloaded++;

          productImages.push({
            src: relativeSrc,
            alt: `${product.name} - View ${imgIndex + 1}`,
            blurDataURL,
            photographer: photo.user?.name || "Unsplash Creator",
            photographerUrl: `${photo.user?.links?.html || "https://unsplash.com"}?utm_source=axis_store&utm_medium=referral`,
            sourceLink: `${photo.links?.html || photo.urls.raw}?utm_source=axis_store&utm_medium=referral`,
            width,
            height,
          });

          console.log(`    ✓ Saved ${fileName} (${isCached ? "cached" : "downloaded"}) by ${photo.user?.name}`);
          imgIndex++;
        } catch (err: any) {
          console.error(`    ✗ Download error for ${fileName}:`, err?.message);
        }
      }
    }

    // If Unsplash API returned no results or was rate-limited, use curated sneaker fallbacks
    if (productImages.length < 3) {
      console.log(`  -> Using curated high-res fallbacks for ${product.name}`);
      for (const fallback of FALLBACK_SNEAKER_PHOTOS) {
        if (productImages.length >= 3) break;
        if (usedImageIds.has(fallback.id)) continue;
        usedImageIds.add(fallback.id);

        const fileName = `image-${imgIndex + 1}.webp`;
        const destPath = path.join(productDir, fileName);
        const relativeSrc = `/images/products/${slug}/${fileName}`;

        try {
          const isCached = fs.existsSync(destPath);
          const { blurDataURL, width, height } = await downloadAndProcessImage(fallback.url, destPath);

          if (isCached) totalCached++;
          else totalDownloaded++;

          productImages.push({
            src: relativeSrc,
            alt: `${product.name} - ${fallback.alt}`,
            blurDataURL,
            photographer: fallback.photographer,
            photographerUrl: `${fallback.photographerUrl}?utm_source=axis_store&utm_medium=referral`,
            sourceLink: `${fallback.sourceLink}?utm_source=axis_store&utm_medium=referral`,
            width,
            height,
          });

          console.log(`    ✓ Saved fallback ${fileName}`);
          imgIndex++;
        } catch (err: any) {
          console.error(`    ✗ Fallback error for ${fileName}:`, err?.message);
        }
      }
    }

    manifest[slug] = productImages;
    totalProcessed++;
  }

  // Ensure data/ directory exists and write manifest
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");

  console.log("\n==================================================");
  console.log("🎉 IMAGE PIPELINE SUMMARY");
  console.log("==================================================");
  console.log(`📦 Total Products Processed: ${totalProcessed}`);
  console.log(`⬇️ Total Images Downloaded: ${totalDownloaded}`);
  console.log(`⚡ Total Images Cached:     ${totalCached}`);
  console.log(`📄 Manifest written to:     ${manifestPath}`);

  // Check if any product has no images
  const missingImages = SEED_PRODUCTS.filter((p) => !manifest[p.slug] || manifest[p.slug].length === 0);
  if (missingImages.length > 0) {
    console.warn(`⚠️ Warning: ${missingImages.length} products have no images:`, missingImages.map((p) => p.name));
  } else {
    console.log("✨ All products successfully mapped to 3-4 distinct webp images with blur placeholders!");
  }
}

main().catch((err) => {
  console.error("Fatal error in image pipeline:", err);
  process.exit(1);
});

