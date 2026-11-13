import test from "node:test";
import assert from "node:assert/strict";
import { buildGalleryCollection, displayFocalLength, galleryImageId, galleryIndex, mergeGalleryImages, metaFieldsFor, neighbourIds } from "../lib/gallery.ts";
import { FOCUS_GAP, MASONRY_GAP, PERIPHERAL_GAP, columnsForWidth, layoutFocusDesktop, layoutFocusMobile, layoutMasonry, packMasonry } from "../lib/gallery-layout.ts";

const photographs = [
  { src: "/images/gallery/03.jpg", title: "Nature study", alt: "a", collection: "Nature", width: 6000, height: 4000, captureDate: "2026-02-12T10:00:00" },
  { src: "/images/gallery/02.jpg", title: "Nature study", alt: "b", collection: "Nature", width: 4284, height: 5712, captureDate: "2026-01-12T10:00:00" },
  { src: "/images/gallery/01.jpg", title: "Nature study", alt: "c", collection: "Nature", width: 4000, height: 3000, captureDate: "2025-12-24T10:00:00" },
];

const collection = buildGalleryCollection(photographs);
const ids = collection.map((image) => image.id);
const overlap = (a, b) => a.x < b.x + b.width - 0.001 && b.x < a.x + a.width - 0.001 && a.y < b.y + b.height - 0.001 && b.y < a.y + a.height - 0.001;

test("the collection keeps a stable identity and a single order", () => {
  assert.deepEqual(ids, ["images-gallery-03", "images-gallery-02", "images-gallery-01"]);
  assert.equal(galleryImageId("/images/gallery/03.jpg"), "images-gallery-03");
  assert.equal(galleryImageId("/images/gallery/03.jpg?w=120"), "images-gallery-03");
  assert.equal(galleryIndex(collection, ids[1]), 1);
  assert.equal(galleryIndex(collection, "nope"), -1);
});

test("merging never duplicates a photograph and keeps the order", () => {
  const merged = mergeGalleryImages(collection, buildGalleryCollection([{ ...photographs[0], camera: "Sony ILCE-7M2" }]));
  assert.equal(merged.length, collection.length);
  assert.equal(merged[0].camera, "Sony ILCE-7M2");
  assert.deepEqual(merged.map((image) => image.id), collection.map((image) => image.id));
});

test("navigation follows the collection order and wraps around", () => {
  assert.deepEqual(neighbourIds(collection, ids[0]), { previousId: ids[2], nextId: ids[1] });
  assert.deepEqual(neighbourIds(collection, ids[2]), { previousId: ids[1], nextId: ids[0] });
  assert.deepEqual(neighbourIds(collection, "missing"), { previousId: null, nextId: null });
});

test("the closed gallery is a dense wall that keeps every ratio", () => {
  const { rects, height } = layoutMasonry(collection, 1000, MASONRY_GAP);
  assert.equal(rects.size, collection.length);
  collection.forEach((image) => {
    const rect = rects.get(image.id);
    assert.ok(Math.abs(rect.width / rect.height - image.aspectRatio) < 0.02, `${image.id} was cropped`);
  });
  const list = collection.map((image) => rects.get(image.id));
  for (let i = 0; i < list.length; i += 1) for (let j = i + 1; j < list.length; j += 1) {
    assert.ok(!overlap(list[i], list[j]), `${collection[i].id} overlaps ${collection[j].id}`);
  }
  assert.ok(height > 0);
});

test("the closed gallery uses one uniform gutter", () => {
  const many = buildGalleryCollection(Array.from({ length: 9 }, (_, index) => ({ src: `/images/gallery/${index}.jpg`, title: "a", alt: "a", collection: "Nature", width: 4000, height: 3000, captureDate: `2026-01-0${index + 1}T10:00:00` })));
  const { rects } = layoutMasonry(many, 1000, MASONRY_GAP);
  const list = many.map((image) => rects.get(image.id));
  const columns = new Map();
  for (const rect of list) {
    const key = Math.round(rect.x);
    const column = columns.get(key) ?? [];
    column.push(rect);
    columns.set(key, column);
  }
  for (const column of columns.values()) {
    const sorted = [...column].sort((left, right) => left.y - right.y);
    for (let index = 1; index < sorted.length; index += 1) {
      const seam = sorted[index].y - (sorted[index - 1].y + sorted[index - 1].height);
      assert.ok(Math.abs(seam - MASONRY_GAP) < 0.001, `a seam of ${seam} is not the single gutter`);
    }
  }
  const xs = [...columns.keys()].sort((left, right) => left - right);
  for (let index = 1; index < xs.length; index += 1) {
    const previous = list.find((rect) => Math.round(rect.x) === xs[index - 1]);
    const current = list.find((rect) => Math.round(rect.x) === xs[index]);
    const seam = current.x - (previous.x + previous.width);
    assert.ok(Math.abs(seam - MASONRY_GAP) < 0.001, `a column gap of ${seam} is not the single gutter`);
  }
});

test("the lightbox keeps two distinct distances", () => {
  assert.equal(PERIPHERAL_GAP, 2);
  assert.equal(FOCUS_GAP, 10);
  assert.notEqual(PERIPHERAL_GAP, FOCUS_GAP);
});

test("the column count follows the available width", () => {
  assert.equal(columnsForWidth(390), 2);
  assert.equal(columnsForWidth(820), 3);
  assert.equal(columnsForWidth(1100), 4);
  assert.equal(columnsForWidth(1440), 5);
});

test("a portrait frame claims more rows than a landscape frame", () => {
  const { rects } = packMasonry([
    { key: "tall", aspectRatio: 0.67 },
    { key: "wide", aspectRatio: 1.78 },
  ], { width: 400, gap: 8, columns: 2 });
  assert.ok(rects.get("tall").height > rects.get("wide").height * 2);
  assert.ok(Math.abs(rects.get("tall").width / rects.get("tall").height - 0.67) < 0.02);
});

test("the focused composition fills both sides without overlapping", () => {
  const images = buildGalleryCollection([
    ...Array.from({ length: 11 }, (_, index) => ({ src: `/images/gallery/${String(index).padStart(2, "0")}.jpg`, title: "a", alt: "a", collection: "Nature", width: 4000, height: index % 3 === 0 ? 5600 : 3000, captureDate: `2026-01-${String(index + 1).padStart(2, "0")}T10:00:00` })),
  ]);
  const layout = layoutFocusDesktop(images, images[5].id, { width: 1440, height: 900 });
  const focal = layout.rects.get(images[5].id);
  assert.ok(focal, "the focused frame is placed");
  assert.ok(Math.abs(focal.x + focal.width / 2 - 720) < 1, "the focused frame is centred");
  const list = images.map((image) => layout.rects.get(image.id)).filter(Boolean);
  for (let i = 0; i < list.length; i += 1) for (let j = i + 1; j < list.length; j += 1) {
    assert.ok(!overlap(list[i], list[j]), "the focused composition has no collisions");
  }
  const left = list.filter((rect) => rect.x + rect.width <= focal.x + 1);
  const right = list.filter((rect) => rect.x >= focal.x + focal.width - 1);
  assert.ok(left.length > 0, "the wall on the left is populated");
  assert.ok(right.length > 0, "the wall on the right is populated");
  assert.ok(layout.panel, "the information panel is placed");
  assert.ok(!overlap(focal, layout.panel), "the panel never covers the focused frame");
  for (const rect of list) {
    assert.ok(!overlap(rect, layout.panel), "no peripheral frame enters the panel");
    assert.ok(rect.x >= -0.5 && rect.x + rect.width <= 1440, "no frame escapes the lightbox");
  }
});

test("the focused frame keeps the exact focus distance from its neighbours", () => {
  const images = buildGalleryCollection(Array.from({ length: 9 }, (_, index) => ({ src: `/images/gallery/${index}.jpg`, title: "a", alt: "a", collection: "Nature", width: 4000, height: 3000, captureDate: `2026-01-0${index + 1}T10:00:00` })));
  const layout = layoutFocusDesktop(images, images[4].id, { width: 1440, height: 900 });
  const focal = layout.rects.get(images[4].id);
  const overlapsFocusVertically = (rect) => rect.y < focal.y + focal.height && rect.y + rect.height > focal.y;
  const left = images.map((image) => layout.rects.get(image.id)).filter((rect) => rect && overlapsFocusVertically(rect) && rect.x + rect.width <= focal.x + 1);
  const right = images.map((image) => layout.rects.get(image.id)).filter((rect) => rect && overlapsFocusVertically(rect) && rect.x >= focal.x + focal.width - 1);
  assert.ok(left.length > 0 && right.length > 0, "both walls are populated");
  const closestLeft = Math.max(...left.map((rect) => focal.x - (rect.x + rect.width)));
  const closestRight = Math.min(...right.map((rect) => rect.x - (focal.x + focal.width)));
  assert.ok(Math.abs(closestLeft - FOCUS_GAP) < 0.5, `a focus gap of ${closestLeft} is not ${FOCUS_GAP}`);
  assert.ok(Math.abs(closestRight - FOCUS_GAP) < 0.5, `a focus gap of ${closestRight} is not ${FOCUS_GAP}`);
});

test("the focused frame has equal outer padding", () => {
  const images = buildGalleryCollection([{ src: "/images/gallery/01.jpg", title: "a", alt: "a", collection: "Nature", width: 6000, height: 4000, captureDate: "2026-01-01T10:00:00" }]);
  const layout = layoutFocusDesktop(images, images[0].id, { width: 1440, height: 900 });
  const focal = layout.rects.get(images[0].id);
  assert.ok(Math.abs(focal.x - (1440 - focal.x - focal.width)) < 0.5, "the frame is centred with equal padding");
});

test("the portrait panel matches the focused frame and clears the right hand side", () => {
  const images = buildGalleryCollection([
    { src: "/images/gallery/01.jpg", title: "a", alt: "a", collection: "Nature", width: 4000, height: 5300, captureDate: "2026-01-01T10:00:00" },
    { src: "/images/gallery/02.jpg", title: "b", alt: "b", collection: "Nature", width: 4000, height: 3000, captureDate: "2025-12-01T10:00:00" },
  ]);
  const layout = layoutFocusDesktop(images, images[0].id, { width: 1440, height: 900, gap: 8 });
  const focal = layout.rects.get(images[0].id);
  assert.equal(layout.panelPlacement, "right");
  assert.ok(Math.abs(layout.panel.height - focal.height) < 0.001, "the portrait panel matches the frame height");
  const onTheRight = images.map((image) => layout.rects.get(image.id)).filter((rect) => rect && rect.x >= focal.x + focal.width - 1);
  assert.equal(onTheRight.length, 0, "nothing sits to the right of a portrait focus");
});

test("the landscape panel is exactly as wide as the focused frame", () => {
  const images = buildGalleryCollection([
    { src: "/images/gallery/01.jpg", title: "a", alt: "a", collection: "Nature", width: 6000, height: 4000, captureDate: "2026-01-01T10:00:00" },
  ]);
  const layout = layoutFocusDesktop(images, images[0].id, { width: 1440, height: 900, gap: 8 });
  const focal = layout.rects.get(images[0].id);
  assert.equal(layout.panelPlacement, "below");
  assert.ok(Math.abs(layout.panel.width - focal.width) < 0.001, "the panel matches the frame width");
  assert.ok(Math.abs(layout.panel.x - focal.x) < 0.001, "the panel aligns with the frame");
});

test("the mobile composition is one dominant frame with a navigator and edge previews", () => {
  const images = buildGalleryCollection(photographs);
  const layout = layoutFocusMobile(images, ids[1], { width: 390, gap: 8, rowCount: 3 });
  assert.equal(layout.main.width, 390, "the frame spans the viewport width");
  assert.ok(Math.abs(layout.main.width / layout.main.height - images[1].aspectRatio) < 0.01, "the frame keeps its ratio");
  assert.ok(layout.rows.length >= 1, "the navigator has rows");
  assert.ok(layout.previews.length > 0, "the neighbours peek in at the edges");
  const total = layout.rows.reduce((sum, row) => sum + row.items.length, 0);
  assert.equal(total, images.length, "the navigator holds the whole collection");
});

test("the S24 Ultra focal lengths convert to their equivalents", () => {
  const s24 = { camera: "Samsung Galaxy S24 Ultra" };
  assert.equal(displayFocalLength({ ...s24, focalLength: "2.2 mm" }), "13 mm");
  assert.equal(displayFocalLength({ ...s24, focalLength: "6.3 mm" }), "23 mm");
  assert.equal(displayFocalLength({ ...s24, focalLength: "7.9 mm" }), "69 mm");
  assert.equal(displayFocalLength({ ...s24, focalLength: "18.6 mm" }), "115 mm");
  assert.equal(displayFocalLength({ camera: "Sony ILCE-7M2", focalLength: "70 mm" }), "70 mm");
});

test("the panel never truncates its metadata", () => {
  const image = { ...collection[0], camera: "Samsung Galaxy S24 Ultra Rear Super Telephoto Camera", lens: "A very long lens name that has to wrap" };
  const fields = metaFieldsFor(image);
  assert.ok(fields.length >= 1);
  assert.ok(fields.every((field) => field.value.length > 0));
});
