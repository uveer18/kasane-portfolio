import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { photographs, type Photograph } from "@/lib/photography";
import { readPhotoExif } from "@/lib/photo-exif";
import { hasPhotoAdminSession } from "@/lib/photo-admin";
import { takeRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if ((!url || !serviceKey) && process.env.NODE_ENV !== "production") {
    const galleryDirectory = path.join(process.cwd(), "public", "images", "gallery");
    const metadataDirectory = path.join(process.cwd(), "data", "photography");
    try {
      const files = (await readdir(galleryDirectory)).filter((file) => /\.(jpe?g|png|webp|avif)$/i.test(file));
      const known = new Map(photographs.map((photo) => [photo.src, photo]));
      const photos = await Promise.all(files.map(async (filename) => {
        const src = `/images/gallery/${filename}`;
        let metadata: Partial<Photograph> = known.get(src) ?? {};
        const sidecar = path.join(metadataDirectory, `${filename}.json`);
        try { metadata = { ...metadata, ...JSON.parse(await readFile(sidecar, "utf8")) }; }
        catch { /* create metadata for unindexed images below */ }
        if (!known.has(src) && metadata.exifProcessed !== true && (!metadata.captureDate || !metadata.camera)) {
          const exif = Object.fromEntries(Object.entries(readPhotoExif(new Uint8Array(await readFile(path.join(galleryDirectory, filename))))).filter(([, value]) => value !== undefined));
          metadata = { ...metadata, ...exif, title: metadata.title || "Nature study", alt: metadata.alt || "Nature photograph", collection: metadata.collection || "Nature", exifProcessed: true };
          await mkdir(metadataDirectory, { recursive: true });
          await writeFile(sidecar, JSON.stringify(metadata, null, 2), "utf8").catch(() => undefined);
        }
        return { ...metadata, src, thumbnail: src } as Photograph;
      }));
      photos.sort((left, right) => (left.captureDate ?? "9999").localeCompare(right.captureDate ?? "9999") || left.src.localeCompare(right.src));
      return NextResponse.json({ photos });
    } catch { return NextResponse.json({ photos: [] }); }
  }
  if (!url || !serviceKey) return NextResponse.json({ photos: [] });
  const bucket = process.env.PHOTOGRAPHY_STORAGE_BUCKET || "photography";
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: files, error } = await supabase.storage.from(bucket).list("gallery", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) return NextResponse.json({ photos: [] });
  const photos = await Promise.all((files ?? []).filter((file) => !file.name.endsWith(".json") && /\.(jpe?g|png|webp|avif)$/i.test(file.name)).map(async (file) => {
    const path = `gallery/${file.name}`;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    const detailResult = await supabase.storage.from(bucket).download(`${path}.json`);
    let metadata: Partial<Photograph> = detailResult.data ? await detailResult.data.text().then((text) => JSON.parse(text)).catch(() => ({})) : {};
    if (metadata.exifProcessed !== true && (!metadata.captureDate || !metadata.camera || !detailResult.data)) {
      const imageResult = await supabase.storage.from(bucket).download(path);
      if (imageResult.data) {
        const exif = Object.fromEntries(Object.entries(readPhotoExif(new Uint8Array(await imageResult.data.arrayBuffer()))).filter(([, value]) => value !== undefined));
        metadata = { ...metadata, ...exif, title: metadata.title || "Nature study", alt: metadata.alt || "Nature photograph", collection: metadata.collection || "Nature", exifProcessed: true };
        await supabase.storage.from(bucket).upload(`${path}.json`, JSON.stringify(metadata), { contentType: "application/json", cacheControl: "31536000", upsert: true });
      }
    }
    const listedSize = Number(file.metadata?.size);
    return { ...metadata, fileSize: Number.isFinite(listedSize) && listedSize > 0 ? listedSize : metadata.fileSize, src: data.publicUrl, thumbnail: data.publicUrl };
  }));
  photos.sort((left, right) => (left.captureDate ?? "9999").localeCompare(right.captureDate ?? "9999") || left.src.localeCompare(right.src));
  return NextResponse.json({ photos });
}

/** Remove one photograph and its metadata from the gallery. */
export async function DELETE(request: Request) {
  if (!(await hasPhotoAdminSession())) return NextResponse.json({ error: "Sign in before removing a photograph." }, { status: 401 });
  const rate = takeRateLimit(request, "photo-delete", 40, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
  const body = await request.json().catch(() => null);
  const src = String(body?.src ?? "").trim();
  if (!src) return NextResponse.json({ error: "Tell the gallery which photograph to remove." }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const fileName = src.split("/").pop()?.split("?")[0] ?? "";
  if (!/^[\w.-]+\.(jpe?g|png|webp|avif)$/i.test(fileName)) return NextResponse.json({ error: "That photograph cannot be removed." }, { status: 400 });

  if ((!url || !serviceKey) && process.env.NODE_ENV !== "production") {
    const galleryDirectory = path.join(process.cwd(), "public", "images", "gallery");
    const metadataDirectory = path.join(process.cwd(), "data", "photography");
    try {
      await rm(path.join(galleryDirectory, fileName), { force: true });
      await rm(path.join(metadataDirectory, `${fileName}.json`), { force: true });
    } catch { /* the record may already be gone */ }
    return NextResponse.json({ ok: true, src: `/images/gallery/${fileName}` });
  }

  if (!url || !serviceKey) return NextResponse.json({ error: "Photo storage is not configured on this deployment." }, { status: 503 });
  const bucket = process.env.PHOTOGRAPHY_STORAGE_BUCKET || "photography";
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const removal = await supabase.storage.from(bucket).remove([`gallery/${fileName}`, `gallery/${fileName}.json`]);
  if (removal.error) return NextResponse.json({ error: `Could not remove the photograph: ${removal.error.message}` }, { status: 502 });
  return NextResponse.json({ ok: true, src: `/images/gallery/${fileName}` });
}
