import manifestData from "../../data/product-images.json";

export interface ProductImageMeta {
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

export const productImagesManifest: Record<string, ProductImageMeta[]> = manifestData as Record<
  string,
  ProductImageMeta[]
>;

/**
 * Get all images for a product slug from the manifest, with fallback
 */
export function getProductImages(slug: string, fallbackImages: string[] = []): ProductImageMeta[] {
  const images = productImagesManifest[slug];
  if (images && images.length > 0) {
    return images;
  }
  return fallbackImages.map((src, i) => ({
    src,
    alt: `Product photo ${i + 1}`,
    blurDataURL: "",
    photographer: "Unsplash Contributor",
    photographerUrl: "https://unsplash.com",
    sourceLink: src,
  }));
}

/**
 * Get the main image for a product slug, optionally matching a specific color
 */
export function getProductMainImage(
  slug: string,
  colorName?: string,
  fallbackSrc?: string
): ProductImageMeta {
  const list = getProductImages(slug, fallbackSrc ? [fallbackSrc] : []);
  if (!list.length) {
    return {
      src: fallbackSrc || "/images/placeholder-shoe.webp",
      alt: "Product Image",
      blurDataURL: "",
      photographer: "AXIS",
      photographerUrl: "/",
      sourceLink: "#",
    };
  }

  if (colorName) {
    const cNorm = colorName.toLowerCase();
    const matched = list.find((img) => {
      if (!img.colorName) return false;
      const imgCNorm = img.colorName.toLowerCase();
      return (
        imgCNorm === cNorm ||
        cNorm.includes(imgCNorm) ||
        imgCNorm.includes(cNorm) ||
        cNorm.split("/").some((part) => imgCNorm.includes(part.trim()))
      );
    });
    if (matched) return matched;
  }

  return list[0];
}

/**
 * Find matching image for a color swatch
 */
export function getSwatchMatchingImage(
  slug: string,
  colorName: string
): string | undefined {
  const meta = getProductMainImage(slug, colorName);
  return meta?.src;
}

