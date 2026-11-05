import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { hasPhotoAdminSession } from "@/lib/photo-admin";
import { takeRateLimit } from "@/lib/rate-limit";
import { hasImageSignature, validImageDimensions } from "@/lib/image-validation";

export const runtime = "nodejs";

const acceptedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const maxSize = 15 * 1024 * 1024;

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
  const title = value("title");
  if (!title) return NextResponse.json({ error: "Add a title for this photograph." }, { status: 400 });
  const width = Number(form.get("width"));
  const height = Number(form.get("height"));
  if (!validImageDimensions(width, height)) return NextResponse.json({ error: "Could not read a valid image size. Choose the image again." }, { status: 400 });
  const metadata = {
    title,
    width,
    height,
    aspectRatio: width / height,
    alt: value("description") || title,
    description: value("description"),
    collection: value("collection") || "[ADD COLLECTION]",
    captureDate: value("captureDate"),
    camera: value("camera"),
    lens: value("lens"),
    focalLength: value("focalLength"),
    aperture: value("aperture"),
    shutterSpeed: value("shutterSpeed"),
    iso: value("iso"),
    location: value("location"),
  };
  const slug = title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "photograph";
  const extension = acceptedTypes[image.type];
  const filename = `${Date.now()}-${slug}.${extension}`;
  if (process.env.NODE_ENV !== "production" && (!url || !serviceKey)) {
    const galleryDirectory = path.join(process.cwd(), "public", "images", "gallery");
    const metadataDirectory = path.join(process.cwd(), "data", "photography");
    await Promise.all([mkdir(galleryDirectory, { recursive: true }), mkdir(metadataDirectory, { recursive: true })]);
    await Promise.all([
      writeFile(path.join(galleryDirectory, filename), Buffer.from(await image.arrayBuffer())),
      writeFile(path.join(metadataDirectory, `${filename}.json`), JSON.stringify(metadata, null, 2), "utf8"),
    ]);
    return NextResponse.json({ ok: true, photo: { ...metadata, src: `/images/gallery/${filename}`, thumbnail: `/images/gallery/${filename}` } });
  }
  if (!url || !serviceKey) return NextResponse.json({ error: "Photo storage is not configured. Add SUPABASE_SERVICE_ROLE_KEY and a public photography bucket to the deployment environment." }, { status: 503 });
  const bucket = process.env.PHOTOGRAPHY_STORAGE_BUCKET || "photography";
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
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
