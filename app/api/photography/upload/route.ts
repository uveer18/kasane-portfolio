
import { createClient } from "@supabase/supabase-js";
import {
  mkdir,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { hasPhotoAdminSession } from "@/lib/photo-admin";
import { takeRateLimit } from "@/lib/rate-limit";
import {
  hasImageSignature,
  validImageDimensions,
} from "@/lib/image-validation";
import { readPhotoExif } from "@/lib/photo-exif";
import { photographs } from "@/lib/photography";
import { generatePhotoMetadata } from "@/lib/photo-metadata";

export const runtime = "nodejs";

const acceptedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const maxSize = 15 * 1024 * 1024;

function nextNumberedFilename(existing: string[], extension: string) {
  const imageFiles = existing.filter((filename) =>
    /\.(jpe?g|png|webp|avif)$/i.test(filename)
  );

  const highest = imageFiles.reduce(
    (max, filename) =>
      Math.max(
        max,
        Number(filename.match(/^(\d+)\./)?.[1] ?? 0)
      ),
    imageFiles.length
  );

  return `${String(highest + 1).padStart(2, "0")}.${extension}`;
}

function uniqueCollections(values: unknown[]): string[] {
  return [
    ...new Set(
      values
        .filter(
          (value): value is string =>
            typeof value === "string" && Boolean(value.trim())
        )
        .map((value) => value.trim())
    ),
  ];
}

async function readLocalCollections(): Promise<string[]> {
  const metadataDirectory = path.join(
    process.cwd(),
    "data",
    "photography"
  );

  try {
    const files = await readdir(metadataDirectory);

    const metadata = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          try {
            const content = await readFile(
              path.join(metadataDirectory, file),
              "utf8"
            );

            return JSON.parse(content) as { collection?: string };
          } catch {
            return null;
          }
        })
    );

    return uniqueCollections(
      metadata.map((item) => item?.collection)
    );
  } catch {
    return [];
  }
}

async function readSupabaseCollections(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  existingFiles: { name: string }[]
): Promise<string[]> {
  const metadataFiles = existingFiles.filter((file) =>
    file.name.endsWith(".json")
  );

  const metadata = await Promise.all(
    metadataFiles.map(async (file) => {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .download(`gallery/${file.name}`);

        if (error || !data) return null;

        return JSON.parse(await data.text()) as { collection?: string };
      } catch {
        return null;
      }
    })
  );

  return uniqueCollections(
    metadata.map((item) => item?.collection)
  );
}

export async function POST(request: Request) {
  if (!(await hasPhotoAdminSession())) {
    return NextResponse.json(
      { error: "Sign in before uploading." },
      { status: 401 }
    );
  }

  const rate = takeRateLimit(
    request,
    "photo-upload",
    20,
    60 * 60 * 1000
  );

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Upload limit reached. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfter),
        },
      }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const form = await request.formData().catch(() => null);

  if (!form) {
    return NextResponse.json(
      { error: "Send the image as a multipart form upload." },
      { status: 400 }
    );
  }

  const image = form.get("image");

  if (!(image instanceof File)) {
    return NextResponse.json(
      { error: "Choose an image to upload." },
      { status: 400 }
    );
  }

  if (!acceptedTypes[image.type]) {
    return NextResponse.json(
      { error: "Use a JPG, PNG, WebP, or AVIF image." },
      { status: 415 }
    );
  }

  if (image.size > maxSize) {
    return NextResponse.json(
      { error: "Images must be 15 MB or smaller." },
      { status: 413 }
    );
  }

  const signatureBytes = new Uint8Array(
    await image.slice(0, 16).arrayBuffer()
  );

  if (!hasImageSignature(image.type, signatureBytes)) {
    return NextResponse.json(
      {
        error:
          "The file contents do not match the selected image type.",
      },
      { status: 415 }
    );
  }

  const value = (key: string) =>
    String(form.get(key) ?? "").trim().slice(0, 500);

  const imageBytes = new Uint8Array(await image.arrayBuffer());
  const exif = readPhotoExif(imageBytes);

  const width = exif.width ?? Number(form.get("width"));
  const height = exif.height ?? Number(form.get("height"));

  if (!validImageDimensions(width, height)) {
    return NextResponse.json(
      {
        error:
          "Could not read a valid image size. Choose the image again.",
      },
      { status: 400 }
    );
  }

  // Keep missing fields empty so Groq can generate them.
  const suppliedTitle = value("title");
  const suppliedCollection = value("collection");
  const suppliedDescription = value("description");

  const captureDate = exif.captureDate || value("captureDate");

  const bucket =
    process.env.PHOTOGRAPHY_STORAGE_BUCKET || "photography";

  const isLocalDevelopment =
    process.env.NODE_ENV !== "production" && (!url || !serviceKey);

  let supabase:
    | ReturnType<typeof createClient>
    | null = null;

  let existingFiles: { name: string }[] = [];

  if (!isLocalDevelopment) {
    if (!url || !serviceKey) {
      return NextResponse.json(
        {
          error:
            "Photo storage is not configured. Add SUPABASE_SERVICE_ROLE_KEY and a public photography bucket to the deployment environment.",
        },
        { status: 503 }
      );
    }

    supabase = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase.storage
      .from(bucket)
      .list("gallery", { limit: 200 });

    if (error) {
      return NextResponse.json(
        {
          error: `Could not prepare the photo sequence: ${error.message}`,
        },
        { status: 502 }
      );
    }

    existingFiles = data ?? [];
  }

  // Gather collections from local photographs and stored metadata.
  const localCollections = uniqueCollections(
    photographs.map((photo) => photo.collection)
  );

  const localStoredCollections = await readLocalCollections();

  let remoteCollections: string[] = [];

  if (supabase) {
    remoteCollections = await readSupabaseCollections(
      supabase,
      bucket,
      existingFiles
    );
  }

  const existingCollections = uniqueCollections([
    ...localCollections,
    ...localStoredCollections,
    ...remoteCollections,
  ]);

  // Generate only fields the user has not supplied.
  let generated;

  try {
    generated = await generatePhotoMetadata({
      image: Buffer.from(imageBytes),
      mimeType: image.type,
      title: suppliedTitle || undefined,
      collection: suppliedCollection || undefined,
      description: suppliedDescription || undefined,
      existingCollections,
    });
  } catch (error) {
    console.error("Photo metadata generation failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `AI metadata generation failed: ${error.message}`
            : "AI metadata generation failed.",
      },
      { status: 502 }
    );
  }

  // User-provided values always take precedence.
  const title =
    suppliedTitle || generated.title || "Nature study";

  const collection =
    suppliedCollection || generated.collection || "Nature";

  const description =
    suppliedDescription || generated.description || "";

  const metadata = {
    title,
    width,
    height,
    fileSize: image.size,
    aspectRatio: width / height,
    alt:
      description ||
      (captureDate
        ? `Nature photograph captured on ${captureDate.slice(0, 10)}`
        : "Nature photograph"),
    description,
    collection,
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

  // Local development fallback.
  if (isLocalDevelopment) {
    const galleryDirectory = path.join(
      process.cwd(),
      "public",
      "images",
      "gallery"
    );

    const metadataDirectory = path.join(
      process.cwd(),
      "data",
      "photography"
    );

    await Promise.all([
      mkdir(galleryDirectory, { recursive: true }),
      mkdir(metadataDirectory, { recursive: true }),
    ]);

    const filename = nextNumberedFilename(
      await readdir(galleryDirectory),
      extension
    );

    await Promise.all([
      writeFile(
        path.join(galleryDirectory, filename),
        Buffer.from(imageBytes)
      ),
      writeFile(
        path.join(metadataDirectory, `${filename}.json`),
        JSON.stringify(metadata, null, 2),
        "utf8"
      ),
    ]);

    return NextResponse.json({
      ok: true,
      photo: {
        ...metadata,
        src: `/images/gallery/${filename}`,
        thumbnail: `/images/gallery/${filename}`,
      },
    });
  }

  if (!supabase) {
    return NextResponse.json(
      { error: "Photo storage is unavailable." },
      { status: 503 }
    );
  }

  const filename = nextNumberedFilename(
    existingFiles.map((file) => file.name),
    extension
  );

  const imagePath = `gallery/${filename}`;

  const imageUpload = await supabase.storage
    .from(bucket)
    .upload(imagePath, image, {
      contentType: image.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (imageUpload.error) {
    return NextResponse.json(
      {
        error: `Image upload failed: ${imageUpload.error.message}`,
      },
      { status: 502 }
    );
  }

  const metadataUpload = await supabase.storage
    .from(bucket)
    .upload(
      `${imagePath}.json`,
      JSON.stringify(metadata),
      {
        contentType: "application/json",
        cacheControl: "3600",
        upsert: false,
      }
    );

  if (metadataUpload.error) {
    await supabase.storage.from(bucket).remove([imagePath]);

    return NextResponse.json(
      {
        error: `Photo details could not be saved: ${metadataUpload.error.message}`,
      },
      { status: 502 }
    );
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(imagePath);

  return NextResponse.json({
    ok: true,
    photo: {
      ...metadata,
      src: data.publicUrl,
      thumbnail: data.publicUrl,
    },
  });
}
