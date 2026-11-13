from __future__ import annotations

import json
import re
import warnings
from pathlib import Path

from PIL import ExifTags, Image


ROOT = Path(__file__).resolve().parents[1]
GALLERY = ROOT / "public" / "images" / "gallery"
OUTPUT = ROOT / "lib" / "photography.ts"
warnings.simplefilter("ignore", Image.DecompressionBombWarning)


def rational(value: object) -> float | None:
    try:
        return float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError, ZeroDivisionError):
        return None


def gps_coordinate(values: object, reference: object) -> float | None:
    if not isinstance(values, (tuple, list)) or len(values) != 3:
        return None
    parts = [rational(part) for part in values]
    if any(part is None for part in parts):
        return None
    result = parts[0] + parts[1] / 60 + parts[2] / 3600  # type: ignore[operator]
    return -result if str(reference).upper() in {"S", "W"} else result


def photograph(path: Path) -> dict[str, object]:
    with Image.open(path) as image:
        exif = image.getexif()
        details = exif.get_ifd(0x8769) if exif else {}
        gps = exif.get_ifd(0x8825) if exif else {}
        raw_date = details.get(0x9003) or details.get(0x9004) or exif.get(0x0132)
        capture_date = str(raw_date or "").replace(":", "-", 2).replace(" ", "T", 1)
        orientation = exif.get(0x0112, 1)
        width, height = image.size
        if orientation in {5, 6, 7, 8}:
            width, height = height, width

        make = str(exif.get(0x010f, "")).strip()
        make = {"samsung": "Samsung", "sony": "Sony"}.get(make.lower(), make)
        model = str(exif.get(0x0110, "")).strip()
        camera = model if make and make.lower() in model.lower() else " ".join(part for part in (make, model) if part) or model or make
        lens = str(details.get(0xa434, "")).strip()
        focal_length = rational(details.get(0x920a))
        aperture = rational(details.get(0x829d))
        exposure = rational(details.get(0x829a))
        iso = details.get(0x8827) or details.get(0x8833)
        latitude = gps_coordinate(gps.get(2), gps.get(1))
        longitude = gps_coordinate(gps.get(4), gps.get(3))

    shutter = None
    if exposure:
        shutter = f"1/{round(1 / exposure)}s" if exposure < 1 else f"{exposure:g}s"
    location = f"{latitude:.5f}, {longitude:.5f}" if latitude is not None and longitude is not None else None
    sort_date = capture_date or path.stem
    display_date = capture_date[:10] if len(capture_date) >= 10 else ""
    alt = f"Nature photograph captured on {display_date}" if display_date else "Nature photograph"

    return {
        "path": path,
        "sort_date": sort_date,
        "captureDate": capture_date or None,
        "width": width,
        "height": height,
        "fileSize": path.stat().st_size,
        "camera": camera or None,
        "lens": lens or None,
        "focalLength": f"{focal_length:g} mm" if focal_length is not None else None,
        "aperture": f"f/{aperture:g}" if aperture is not None else None,
        "shutterSpeed": shutter,
        "iso": str(iso) if iso is not None else None,
        "location": location,
        "alt": alt,
    }


def ts_string(value: object) -> str:
    return json.dumps(value, ensure_ascii=False)


def main() -> None:
    entries = [photograph(path) for path in GALLERY.iterdir() if path.suffix.lower() in {".jpg", ".jpeg"}]
    entries.sort(key=lambda item: (str(item["sort_date"]), str(item["path"]).lower()))

    targets = [GALLERY / f"{index:02d}{entry['path'].suffix.lower()}" for index, entry in enumerate(entries, 1)]
    target_names = [target.name.lower() for target in targets]
    if len(target_names) != len(set(target_names)):
        raise RuntimeError("Numbered photo names would collide.")

    staged: list[tuple[Path, Path]] = []
    for index, entry in enumerate(entries, 1):
        source = entry["path"]
        temporary = GALLERY / f".rename-{index:03d}{source.suffix.lower()}"
        if source != temporary:
            source.rename(temporary)
        staged.append((temporary, targets[index - 1]))
    for temporary, target in staged:
        if temporary != target:
            temporary.rename(target)

    lines = [
        "export type Photograph = {",
        "  src: string; thumbnail?: string; title: string; alt: string; description?: string; collection?: string;",
        "  captureDate?: string; camera?: string; lens?: string; focalLength?: string; aperture?: string;",
        "  shutterSpeed?: string; iso?: string; location?: string; aspectRatio?: number; width?: number; height?: number; fileSize?: number; exifProcessed?: boolean;",
        "};",
        "",
        "export const photographs: Photograph[] = [",
    ]
    for index, entry in enumerate(entries, 1):
        filename = f"{index:02d}{entry['path'].suffix.lower()}"
        values = [
            f"src: {ts_string(f'/images/gallery/{filename}')}",
            f"title: {ts_string('Nature study')}",
            f"alt: {ts_string(entry['alt'])}",
            'collection: "Nature"',
            f"width: {entry['width']}",
            f"height: {entry['height']}",
            f"fileSize: {entry['fileSize']}",
            f"aspectRatio: {entry['width']} / {entry['height']}",
        ]
        for key in ("captureDate", "camera", "lens", "focalLength", "aperture", "shutterSpeed", "iso", "location"):
            if entry[key]:
                values.append(f"{key}: {ts_string(entry[key])}")
        lines.append("  { " + ", ".join(values) + " },")
    lines.extend(["]", ""])
    OUTPUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Renamed and indexed {len(entries)} photos by EXIF capture time.")


if __name__ == "__main__":
    main()
