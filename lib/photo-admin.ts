import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const photoAdminCookie = "kasane-photo-admin";

export function isValidPhotoAdminKey(value: unknown) {
  const key = process.env.PHOTOGRAPHY_UPLOAD_KEY;
  if (typeof value !== "string" || !key) return false;
  const candidate = Buffer.from(value);
  const expected = Buffer.from(key);
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function sessionValue() {
  const key = process.env.PHOTOGRAPHY_UPLOAD_KEY;
  if (!key) return "";
  return createHmac("sha256", key).update("kasane:photo-admin:v1").digest("hex");
}

export async function hasPhotoAdminSession() {
  const jar = await cookies();
  const actual = jar.get(photoAdminCookie)?.value;
  const expected = sessionValue();
  if (!actual || !expected) return false;
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function createPhotoAdminSession() {
  return sessionValue();
}
