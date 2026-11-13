import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("the gallery keeps one collection and one focused identity", async () => {
  const gallery = await read("../components/photography/photo-gallery.tsx");
  assert.match(gallery, /focusedImageId/);
  assert.match(gallery, /buildGalleryCollection/);
  assert.match(gallery, /neighbourIds\(visibleImages, focused\.id\)/);
  assert.doesNotMatch(gallery, /setFocusIndex/);
});

test("the closed gallery carries no numbers, the counter lives in the panel", async () => {
  const gallery = await read("../components/photography/photo-gallery.tsx");
  assert.doesNotMatch(gallery, /floating-control/);
  assert.match(gallery, /spatial-counter/);
  assert.match(gallery, /aria-live="polite"/);
});

test("transitions use a shared element flip rather than remounting", async () => {
  const gallery = await read("../components/photography/photo-gallery.tsx");
  assert.match(gallery, /element\.animate\(/);
  assert.match(gallery, /translate\(\$\{dx\}px, \$\{dy\}px\) scale\(\$\{scale\}\)/);
  assert.match(gallery, /captureFrames/);
});

test("the scroll anchor is only captured when entering the focused gallery", async () => {
  const gallery = await read("../components/photography/photo-gallery.tsx");
  assert.match(gallery, /if \(focusedImageId === null\) captureAnchor\(\);/);
  assert.match(gallery, /window\.scrollBy\(0, delta\)/);
  assert.match(gallery, /anchorRef/);
});

test("the focused frame and its neighbours are served at full resolution", async () => {
  const gallery = await read("../components/photography/photo-gallery.tsx");
  assert.match(gallery, /spatial-thumb/);
  assert.match(gallery, /spatial-original/);
  assert.match(gallery, /is-ready/);
  assert.match(gallery, /sizes="100vw"/);
  assert.match(gallery, /optimisedUrl\(image\.src, 1920\)/);
});

test("the thumbnail and the original are genuinely different assets", async () => {
  const gallery = await read("../components/photography/photo-gallery.tsx");
  const thumbnail = gallery.match(/<Image\s+src=\{image\.src\}[\s\S]*?sizes=\{sizes\}[\s\S]*?spatial-thumb/);
  const original = gallery.match(/<Image\s+src=\{image\.src\}[\s\S]*?sizes="100vw"[\s\S]*?spatial-original/);
  assert.ok(thumbnail, "the thumbnail asks for its own width");
  assert.ok(original, "the original asks for the full width");
  assert.ok(!/sizes=\{sizes\}[\s\S]{0,200}spatial-original/.test(gallery), "the original must not reuse the thumbnail sizes");
});

test("the loading state resets when the image identity changes", async () => {
  const gallery = await read("../components/photography/photo-gallery.tsx");
  assert.match(gallery, /useEffect\(\(\) => \{ setOriginalReady\(false\); \}, \[image\.src\]\)/);
});

test("the flip effect supports both the entry and the exit", async () => {
  const gallery = await read("../components/photography/photo-gallery.tsx");
  assert.match(gallery, /destinationRects/);
  assert.doesNotMatch(gallery, /!from \|\| !focusLayout \|\| mobileFocus/);
  assert.match(gallery, /const leaving = !focused;/);
});

test("the scroll anchor is the topmost visible photograph", async () => {
  const gallery = await read("../components/photography/photo-gallery.tsx");
  assert.match(gallery, /rect\.top >= window\.innerHeight/);
  assert.match(gallery, /rect\.top < anchor\.offset/);
});

test("the mobile composition has its own layout with a scrolling navigator", async () => {
  const gallery = await read("../components/photography/photo-gallery.tsx");
  assert.match(gallery, /layoutFocusMobile/);
  assert.match(gallery, /spatial-navigator-row/);
  assert.match(gallery, /spatial-mobile-main/);
  assert.match(gallery, /stepFocus\(dx > 0 \? -1 : 1\)/);
});

test("the photography page links the instagram journal", async () => {
  const page = await read("../app/photography/page.tsx");
  assert.match(page, /href="https:\/\/instagram\.com\/soltragrv"/);
  assert.match(page, /@soltragrv/);
  assert.match(page, /rel="noreferrer noopener"/);
});

test("the photography page introduces the journal with rotating quotations", async () => {
  const page = await read("../app/photography/page.tsx");
  assert.match(page, /PhotographerQuote/);
  assert.match(page, /quote/);
});

test("the packed layout positions frames absolutely and clips at the boundary", async () => {
  const css = await read("../app/globals.css");
  assert.match(css, /\.spatial-gallery\[data-mode="focus"\]\s*\{[^}]*position:\s*fixed/);
  assert.match(css, /\.spatial-frame\s*\{[^}]*position:\s*absolute/);
  assert.match(css, /\.spatial-frame:focus[^{]*\{[^}]*outline:\s*none/);
});

test("frames use a single gutter and never crop their images", async () => {
  const css = await read("../app/globals.css");
  assert.match(css, /\.spatial-image\s*\{[^}]*object-fit:\s*contain/);
  assert.match(css, /\.spatial-frame\s*\{[^}]*transform-origin:\s*top left/);
});

test("panel text wraps instead of being clipped", async () => {
  const css = await read("../app/globals.css");
  assert.match(css, /\.spatial-panel-value\s*\{[^}]*overflow-wrap:\s*anywhere/);
  assert.match(css, /\.spatial-panel \.photo-exif-grid\s*\{[^}]*overflow-y:\s*auto/);
  const gallery = await read("../components/photography/photo-gallery.tsx");
  assert.doesNotMatch(gallery, /truncate/);
  assert.doesNotMatch(gallery, /line-clamp/);
});

test("the photo controls are reduced to a lock and can delete a photograph", async () => {
  const admin = await read("../components/photography/photo-upload-login.tsx");
  assert.doesNotMatch(admin, /Add Photos/);
  assert.doesNotMatch(admin, /ArrowUpRight/);
  assert.match(admin, /LockKeyhole/);
  assert.match(admin, /Delete/);
  assert.match(admin, /photograph-deleted/);
});
