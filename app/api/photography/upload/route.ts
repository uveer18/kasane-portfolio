import { createClient } from "@supabase/supabase-js";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { hasPhotoAdminSession } from "@/lib/photo-admin";
import { takeRateLimit } from "@/lib/rate-limit";
import { hasImageSignature, validImageDimensions } from "@/lib/image-validation";
import { readPhotoExif } from "@/lib/photo-exif";

export const runtime = "nodejs";

const acceptedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const maxSize = 15 * 1024 * 1024;

function nextNumberedFilename(existing: string[], extension: string) {
  const imageFiles = existing.filter((filename) => /\.(jpe?g|png|webp|avif)$/i.test(filename));
  const highest = imageFiles.reduce((max, filename) => Math.max(max, Number(filename.match(/^(\d+)\./)?.[1] ?? 0)), imageFiles.length);
  return `${String(highest + 1).padStart(2, "0")}.${extension}`;
}

export async function POST(request: Request) {
  if (!(await hasPhotoAdminSession())) return NextResponse.json({ error: "Sign in before uploading." }, { status: 401 });
  const rate = takeRateLimit(request, "photo-upload", 20, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: "Upload limit reached. Try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Send the image as a multipart form upload." }, { status: 400 });
  const image = form.get("image");
  if (!(image instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  if (!acceptedTypes[image.type]) return NextResponse.json({ error: "Use a JPG, PNG, WebP, or AVIF image." }, { status: 415 });
  if (image.size > maxSize) return NextResponse.json({ error: "Images must be 15 MB or smaller." }, { status: 413 });
  const bytes = new Uint8Array(await image.slice(0, 16).arrayBuffer());
  if (!hasImageSignature(image.type, bytes)) return NextResponse.json({ error: "The file contents do not match the selected image type." }, { status: 415 });

  const value = (key: string) => String(form.get(key) ?? "").trim().slice(0, 500);
  const imageBytes = new Uint8Array(await image.arrayBuffer());
  const exif = readPhotoExif(imageBytes);
  const width = exif.width ?? Number(form.get("width"));
  const height = exif.height ?? Number(form.get("height"));
  if (!validImageDimensions(width, height)) return NextResponse.json({ error: "Could not read a valid image size. Choose the image again." }, { status: 400 });
  const title = value("title") || "Nature study";
  const captureDate = exif.captureDate || value("captureDate");
  const description = value("description");
  const metadata = {
    title,
    width,
    height,
    fileSize: image.size,
    aspectRatio: width / height,
    alt: description || (captureDate ? `Nature photograph captured on ${captureDate.slice(0, 10)}` : "Nature photograph"),
    description,
    collection: value("collection") || "Nature",
    captureDate,
    camera: exif.camera || value("camera"),
    lens: exif.lens || value("lens"),
    focalLength: exif.focalLength || value("focalLength"),
    aperture: exif.aperture || value("aperture"),
    shutterSpeed: exif.shutterSpeed || value("shutterSpeed"),
    iso: exif.iso || value("iso"),
    location: exif.location || value("location"),
    exifProcessed: true,
  };
  const extension = acceptedTypes[image.type];
  if (process.env.NODE_ENV !== "production" && (!url || !serviceKey)) {
    const galleryDirectory = path.join(process.cwd(), "public", "images", "gallery");
    const metadataDirectory = path.join(process.cwd(), "data", "photography");
    await Promise.all([mkdir(galleryDirectory, { recursive: true }), mkdir(metadataDirectory, { recursive: true })]);
    const filename = nextNumberedFilename(await readdir(galleryDirectory), extension);
    await Promise.all([
      writeFile(path.join(galleryDirectory, filename), Buffer.from(imageBytes)),
      writeFile(path.join(metadataDirectory, `${filename}.json`), JSON.stringify(metadata, null, 2), "utf8"),
    ]);
    return NextResponse.json({ ok: true, photo: { ...metadata, src: `/images/gallery/${filename}`, thumbnail: `/images/gallery/${filename}` } });
  }
  if (!url || !serviceKey) return NextResponse.json({ error: "Photo storage is not configured. Add SUPABASE_SERVICE_ROLE_KEY and a public photography bucket to the deployment environment." }, { status: 503 });
  const bucket = process.env.PHOTOGRAPHY_STORAGE_BUCKET || "photography";
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: existingFiles, error: listError } = await supabase.storage.from(bucket).list("gallery", { limit: 200 });
  if (listError) return NextResponse.json({ error: `Could not prepare the photo sequence: ${listError.message}` }, { status: 502 });
  const filename = nextNumberedFilename((existingFiles ?? []).map((file) => file.name), extension);
  const imagePath = `gallery/${filename}`;
  const imageUpload = await supabase.storage.from(bucket).upload(imagePath, image, { contentType: image.type, cacheControl: "31536000", upsert: false });
  if (imageUpload.error) return NextResponse.json({ error: `Image upload failed: ${imageUpload.error.message}` }, { status: 502 });
  const metadataUpload = await supabase.storage.from(bucket).upload(`${imagePath}.json`, JSON.stringify(metadata), { contentType: "application/json", cacheControl: "3600", upsert: false });
  if (metadataUpload.error) {
    await supabase.storage.from(bucket).remove([imagePath]);
    return NextResponse.json({ error: `Photo details could not be saved: ${metadataUpload.error.message}` }, { status: 502 });
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(imagePath);
  return NextResponse.json({ ok: true, photo: { ...metadata, src: data.publicUrl, thumbnail: data.publicUrl } });
}
