const signatures: Record<string, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => b[index] === value),
  "image/webp": (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP",
  "image/avif": (b) => {
    const brands = [b.slice(4, 8), b.slice(8, 12), b.slice(12, 16)].map((brand) => String.fromCharCode(...brand));
    return brands.includes("avif") || brands.includes("avis");
  },
};

export function hasImageSignature(type: string, bytes: Uint8Array) {
  return signatures[type]?.(bytes) ?? false;
}

export function validImageDimensions(width: number, height: number) {
  return Number.isInteger(width) && Number.isInteger(height) && width > 0 && height > 0 && width <= 20000 && height <= 20000 && width * height <= 100_000_000;
}
