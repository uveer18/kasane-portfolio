import type { Photograph } from "@/lib/photography";

/**
 * One canonical record per photograph. Both gallery modes read from this
 * collection, so identity, metadata and ordering live in exactly one place.
 */
export type GalleryImage = {
  id: string;
  src: string;
  thumbnail: string;
  alt: string;
  title: string;
  description?: string;
  collection: string;
  width: number;
  height: number;
  aspectRatio: number;
  captureDate?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  location?: string;
};

export type MetaField = { label: string; value: string; optional: boolean };

/** Stable identity derived from the asset itself, so it survives any reordering. */
/**
 * Stable identity across local and Supabase Storage URLs.
 * Both /images/gallery/01.jpg and a Supabase URL ending
 * in /gallery/01.jpg resolve to the same identity.
 */
export function galleryImageId(src: string): string {
  try {
    const url = new URL(src, "http://localhost");

    // Keep the full path so local and Supabase assets
    // cannot collide just because their filenames match.
    const identity = `${url.host}${url.pathname}`;

    return identity
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "image";
  } catch {
    return src
      .replace(/[?#].*$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "image";
  }
}

/** Newest capture first; uploads without an EXIF date lead the list. */
export function sortNewestFirst(photos: Photograph[]): Photograph[] {
  return [...photos].sort((left, right) => {
    if (!left.captureDate && !right.captureDate) return left.src.localeCompare(right.src);
    if (!left.captureDate) return -1;
    if (!right.captureDate) return 1;
    return right.captureDate.localeCompare(left.captureDate);
  });
}

export function buildGalleryCollection(photos: Photograph[]): GalleryImage[] {
  return sortNewestFirst(photos).map((photo, index) => ({
    id: galleryImageId(photo.src),
    src: photo.src,
    thumbnail: photo.thumbnail ?? photo.src,
    alt: photo.alt,
    title:
      photo.title?.trim() ||
      `Nature study ${String(index + 1).padStart(2, "0")}`,
    description: photo.description?.trim() || undefined,
    collection: photo.collection ?? "Nature",
    width: photo.width ?? 0,
    height: photo.height ?? 0,
    aspectRatio:
      photo.width && photo.height
        ? photo.width / photo.height
        : photo.aspectRatio ?? 1,
    captureDate: photo.captureDate,
    camera: photo.camera,
    lens: photo.lens,
    focalLength: photo.focalLength,
    aperture: photo.aperture,
    shutterSpeed: photo.shutterSpeed,
    iso: photo.iso,
    location: photo.location,
  }));
}

export function mergeGalleryImages(current: GalleryImage[], incoming: GalleryImage[]): GalleryImage[] {
  const merged = new Map(current.map((image) => [image.id, image]));
  for (const image of incoming) {
    const existing = merged.get(image.id);
    merged.set(image.id, existing ? { ...existing, ...image } : image);
  }
  return [...merged.values()].sort((left, right) => {
    if (!left.captureDate && !right.captureDate) return left.id.localeCompare(right.id);
    if (!left.captureDate) return -1;
    if (!right.captureDate) return 1;
    return right.captureDate.localeCompare(left.captureDate);
  });
}

/** Circular neighbours in the canonical order. */
export function neighbourIds(images: GalleryImage[], focusedId: string): { previousId: string | null; nextId: string | null } {
  const index = images.findIndex((image) => image.id === focusedId);
  if (index < 0 || images.length === 0) return { previousId: null, nextId: null };
  if (images.length === 1) return { previousId: images[0].id, nextId: images[0].id };
  return {
    previousId: images[(index - 1 + images.length) % images.length].id,
    nextId: images[(index + 1) % images.length].id,
  };
}

/** Index of a photograph in the canonical order, or -1. */
export function galleryIndex(images: GalleryImage[], id: string | null): number {
  if (!id) return -1;
  return images.findIndex((image) => image.id === id);
}

/** The S24 Ultra reports physical focal lengths; these are their equivalents. */
const S24_ULTRA_FOCAL_LENGTHS: Record<string, string> = {
  "2.2": "13",
  "6.3": "23",
  "7.9": "69",
  "18.6": "115",
};

export function displayFocalLength(image: GalleryImage): string | undefined {
  const value = image.focalLength;
  if (!value) return undefined;
  if (!/s24\s*ultra/i.test(image.camera ?? "")) return value;
  const match = value.match(/\d+(?:\.\d+)?/);
  if (!match) return value;
  const converted = S24_ULTRA_FOCAL_LENGTHS[match[0]];
  return converted ? `${converted} mm` : value;
}

/** Metadata rows for the information panel. */
export function metaFieldsFor(image: GalleryImage): MetaField[] {
  const entries: [string, string | undefined, boolean][] = [
    ["Captured", image.captureDate?.replace("T", " "), false],
    ["Camera", image.camera, false],
    ["Lens", image.lens, false],
    ["Focal length", displayFocalLength(image), false],
    ["Aperture", image.aperture, true],
    ["Shutter", image.shutterSpeed, true],
    ["ISO", image.iso, true],
    ["Location", image.location, false],
  ];
  return entries
    .filter((entry): entry is [string, string, boolean] => Boolean(entry[1]))
    .map(([label, value, optional]) => ({ label, value, optional }));
}
