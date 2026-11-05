import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if ((!url || !serviceKey) && process.env.NODE_ENV !== "production") {
    const galleryDirectory = path.join(process.cwd(), "public", "images", "gallery");
    const metadataDirectory = path.join(process.cwd(), "data", "photography");
    try {
      const metadataFiles = await readdir(metadataDirectory);
      const photos = await Promise.all(metadataFiles.filter((file) => file.endsWith(".json")).map(async (file) => {
        const filename = file.slice(0, -5);
        const metadata = JSON.parse(await readFile(path.join(metadataDirectory, file), "utf8"));
        return { ...metadata, src: `/images/gallery/${filename}`, thumbnail: `/images/gallery/${filename}` };
      }));
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
    const metadata = detailResult.data ? await detailResult.data.text().then((text) => JSON.parse(text)).catch(() => ({})) : {};
    return { ...metadata, src: data.publicUrl, thumbnail: data.publicUrl };
  }));
  return NextResponse.json({ photos });
}
