import test from "node:test";
import assert from "node:assert/strict";
import { hasImageSignature, validImageDimensions } from "../lib/image-validation.ts";

test("accepts an AVIF compatible brand after the generic ISO BMFF brand", () => {
  const bytes = new TextEncoder().encode("....ftypmif1avif");
  assert.equal(hasImageSignature("image/avif", bytes), true);
});

test("rejects dimensions above the pixel budget", () => {
  assert.equal(validImageDimensions(10001, 10000), false);
});

test("accepts a real PNG signature", () => {
  assert.equal(hasImageSignature("image/png", Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), true);
});
