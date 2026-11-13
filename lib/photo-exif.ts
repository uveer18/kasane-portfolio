export type PhotoExif = {
  captureDate?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  location?: string;
  width?: number;
  height?: number;
};

type ExifValue = string | number | number[] | undefined;

const ascii = (bytes: Uint8Array, start: number, length: number) => String.fromCharCode(...bytes.subarray(start, start + length));

function parseTiff(bytes: Uint8Array, start: number): PhotoExif {
  const byteOrder = ascii(bytes, start, 2);
  if (byteOrder !== "II" && byteOrder !== "MM") return {};
  const littleEndian = byteOrder === "II";
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const u16 = (offset: number) => offset + 2 <= bytes.length ? view.getUint16(offset, littleEndian) : 0;
  const u32 = (offset: number) => offset + 4 <= bytes.length ? view.getUint32(offset, littleEndian) : 0;
  if (u16(start + 2) !== 42) return {};

  const readIfd = (relativeOffset: number): Map<number, ExifValue> => {
    const offset = start + relativeOffset;
    const count = Math.min(u16(offset), 512);
    const entries = new Map<number, ExifValue>();
    for (let index = 0; index < count; index += 1) {
      const entry = offset + 2 + index * 12;
      if (entry + 12 > bytes.length) break;
      const tag = u16(entry);
      const type = u16(entry + 2);
      const valueCount = u32(entry + 4);
      const unitSize = type === 1 || type === 2 || type === 7 ? 1 : type === 3 ? 2 : type === 4 || type === 9 ? 4 : type === 5 || type === 10 ? 8 : 0;
      if (!unitSize || valueCount > 4096) continue;
      const valueOffset = valueCount * unitSize <= 4 ? entry + 8 : start + u32(entry + 8);
      if (valueOffset < 0 || valueOffset + valueCount * unitSize > bytes.length) continue;
      if (type === 2) {
        entries.set(tag, ascii(bytes, valueOffset, valueCount).replace(/\0+$/, "").trim());
      } else if (type === 5 || type === 10) {
        const values = Array.from({ length: valueCount }, (_, item) => {
          const numerator = type === 5 ? u32(valueOffset + item * 8) : view.getInt32(valueOffset + item * 8, littleEndian);
          const denominator = type === 5 ? u32(valueOffset + item * 8 + 4) : view.getInt32(valueOffset + item * 8 + 4, littleEndian);
          return denominator === 0 ? 0 : numerator / denominator;
        });
        entries.set(tag, valueCount === 1 ? values[0] : values);
      } else {
        const readValue = (item: number) => type === 1 || type === 7 ? bytes[valueOffset + item] : type === 3 ? u16(valueOffset + item * 2) : type === 9 ? view.getInt32(valueOffset + item * 4, littleEndian) : u32(valueOffset + item * 4);
        const values = Array.from({ length: valueCount }, (_, item) => readValue(item));
        entries.set(tag, valueCount === 1 ? values[0] : values);
      }
    }
    return entries;
  };

  const main = readIfd(u32(start + 4));
  const exifOffset = main.get(0x8769);
  const details = typeof exifOffset === "number" ? readIfd(exifOffset) : new Map<number, ExifValue>();
  const gpsOffset = main.get(0x8825);
  const gps = typeof gpsOffset === "number" ? readIfd(gpsOffset) : new Map<number, ExifValue>();
  const getString = (entries: Map<number, ExifValue>, tag: number) => typeof entries.get(tag) === "string" ? entries.get(tag) as string : "";
  const getNumber = (entries: Map<number, ExifValue>, tag: number) => {
    const value = entries.get(tag);
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
  };
  const rawMake = getString(main, 0x010f);
  const make = ({ samsung: "Samsung", sony: "Sony" } as Record<string, string>)[rawMake.toLowerCase()] ?? rawMake;
  const model = getString(main, 0x0110);
  const camera = [make, model].filter(Boolean).filter((value, index, values) => index === 0 || !value.toLowerCase().includes(values[0].toLowerCase())).join(" ");
  const rawDate = getString(details, 0x9003) || getString(details, 0x9004) || getString(main, 0x0132);
  const captureDate = rawDate.replace(/^(\d{4}):(\d{2}):(\d{2})\s+/, "$1-$2-$3T");
  const coordinates = (values: ExifValue, ref: ExifValue) => {
    if (!Array.isArray(values) || values.length < 3) return undefined;
    const decimal = values[0] + values[1] / 60 + values[2] / 3600;
    return typeof ref === "string" && /[SW]/i.test(ref) ? -decimal : decimal;
  };
  const lat = coordinates(gps.get(2), gps.get(1));
  const lon = coordinates(gps.get(4), gps.get(3));
  const focalLength = getNumber(details, 0x920a);
  const fNumber = getNumber(details, 0x829d);
  const exposure = getNumber(details, 0x829a);
  const iso = getNumber(details, 0x8827) ?? getNumber(details, 0x8833);
  const lens = getString(details, 0xa434) || getString(details, 0xa432);
  let width = getNumber(details, 0xa002);
  let height = getNumber(details, 0xa003);
  if (width && height && [5, 6, 7, 8].includes(getNumber(main, 0x0112) ?? 1)) [width, height] = [height, width];
  return {
    captureDate: captureDate || undefined,
    camera: camera || undefined,
    lens: lens || undefined,
    focalLength: focalLength === undefined ? undefined : `${Number(focalLength.toFixed(1))} mm`,
    aperture: fNumber === undefined ? undefined : `f/${Number(fNumber.toFixed(1))}`,
    shutterSpeed: exposure === undefined ? undefined : exposure < 1 ? `1/${Math.round(1 / exposure)}s` : `${Number(exposure.toFixed(2))}s`,
    iso: iso === undefined ? undefined : String(iso),
    location: lat === undefined || lon === undefined ? undefined : `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
    width,
    height,
  };
}

function findTiff(bytes: Uint8Array): number | undefined {
  if ((bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0) || (bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0 && bytes[3] === 0x2a)) return 0;
  const exif = [0x45, 0x78, 0x69, 0x66, 0, 0];
  for (let index = 0; index <= bytes.length - exif.length - 4; index += 1) {
    if (exif.every((value, offset) => bytes[index + offset] === value)) return index + exif.length;
  }
  return undefined;
}

export function readPhotoExif(input: Uint8Array): PhotoExif {
  const bytes = input;
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 4 < bytes.length && bytes[offset] === 0xff) {
      const marker = bytes[offset + 1];
      const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
      if (length < 2 || offset + 2 + length > bytes.length) break;
      if (marker === 0xe1) {
        const payload = bytes.subarray(offset + 4, offset + 2 + length);
        const tiffStart = findTiff(payload);
        if (tiffStart !== undefined) return parseTiff(payload, tiffStart);
      }
      if (marker === 0xda || marker === 0xd9) break;
      offset += 2 + length;
    }
    return {};
  }

  if (bytes.length >= 12 && ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP") {
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const name = ascii(bytes, offset, 4);
      const length = new DataView(bytes.buffer, bytes.byteOffset + offset + 4, 4).getUint32(0, true);
      const chunk = bytes.subarray(offset + 8, Math.min(bytes.length, offset + 8 + length));
      if (name === "EXIF") {
        const tiffStart = findTiff(chunk);
        if (tiffStart !== undefined) return parseTiff(chunk, tiffStart);
      }
      offset += 8 + length + (length % 2);
    }
    return {};
  }

  if (bytes.length >= 8 && bytes[0] === 0x89 && ascii(bytes, 1, 3) === "PNG") {
    let offset = 8;
    while (offset + 12 <= bytes.length) {
      const length = new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0, false);
      const name = ascii(bytes, offset + 4, 4);
      if (name === "eXIf") return parseTiff(bytes.subarray(offset + 8, offset + 8 + length), 0);
      offset += 12 + length;
      if (name === "IEND") break;
    }
    return {};
  }

  const avifTiffStart = findTiff(bytes);
  return avifTiffStart === undefined ? {} : parseTiff(bytes, avifTiffStart);
}
