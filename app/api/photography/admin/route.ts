import { NextResponse } from "next/server";
import { createPhotoAdminSession, hasPhotoAdminSession, isValidPhotoAdminKey, photoAdminCookie } from "@/lib/photo-admin";
import { takeRateLimit } from "@/lib/rate-limit";

export async function GET() {
  return NextResponse.json({ authenticated: await hasPhotoAdminSession() });
}

export async function POST(request: Request) {
  const rate = takeRateLimit(request, "photo-login", 6, 15 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: "Too many sign-in attempts. Try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
  const body = await request.json().catch(() => null);
  if (!process.env.PHOTOGRAPHY_UPLOAD_KEY) {
    return NextResponse.json({ error: "Photo admin access is not configured on this deployment." }, { status: 503 });
  }
  if (!isValidPhotoAdminKey(body?.key)) {
    return NextResponse.json({ error: "That access key is not valid." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(photoAdminCookie, createPhotoAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 6,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(photoAdminCookie, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
