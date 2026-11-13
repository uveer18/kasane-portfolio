import type { GalleryImage } from "@/lib/gallery";

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PanelPlacement = "below" | "right";

export const PERIPHERAL_GAP = 1;
export const FOCUS_GAP = 20;
export const GALLERY_PADDING = 1;

/** One gutter between the photographs of the overview gallery. */
export const GALLERY_GAP = 3;

/** A photograph may never be taller than this share of the (small) viewport. */
export const MAX_IMAGE_HEIGHT_RATIO = 0.7;
const FOCUS_PANEL_HEIGHT = 140;
const FOCUS_PANEL_SIDE_WIDTH = 268;

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

function ratioOf(item: { aspectRatio: number }) {
  return item.aspectRatio > 0 && Number.isFinite(item.aspectRatio)
    ? item.aspectRatio
    : 1;
}

/* ─────────────────────────────────────────────
   OVERVIEW: ADAPTIVE JUSTIFIED ROWS
   ─────────────────────────────────────────────

   Every row spans the full container width. A row holding images with
   aspect ratios r1…rn is exactly

       rowHeight  = (width − gap·(n − 1)) / Σr
       imageWidth = rowHeight · r

   so no photograph is cropped or distorted, and every row has its own
   height. Row breaks are chosen by dynamic programming over the whole,
   ordered collection: each candidate row is scored against the target
   height, the transition from the row before it is scored for rhythm, and
   the partition with the lowest total cost wins. Earlier breaks therefore
   account for what remains, and the final row is optimised with the rest
   instead of being whatever is left over. */

export type JustifiedProfileName = "desktop" | "mobile";

export type JustifiedProfile = {
  /** Target row height is containerWidth / divisor. */
  divisor: number;
  /** Preferred band, as multiples of the target height. */
  preferredMin: number;
  preferredMax: number;
  /** Cost of a row holding a single photograph. */
  singleImagePenalty: number;
};

export const JUSTIFIED_PROFILES: Record<JustifiedProfileName, JustifiedProfile> = {
  desktop: { divisor: 4.8, preferredMin: 0.7, preferredMax: 1.45, singleImagePenalty: 6 },
  mobile: { divisor: 2.2, preferredMin: 0.7, preferredMax: 1.35, singleImagePenalty: 0.8 },
};

/** Below this container width the mobile profile applies. */
export const MOBILE_GALLERY_WIDTH = 640;

export type JustifiedItem = {
  key: string;
  aspectRatio: number;
};

export type JustifiedOptions = {
  width: number;
  gap?: number;
  /** Height of the small viewport (100svh). Rows never exceed 70% of it. */
  viewportHeight?: number;
  profile?: JustifiedProfileName;
};

export type JustifiedRow = {
  /** Index range [start, end) into the ordered collection. */
  start: number;
  end: number;
  keys: string[];
  y: number;
  /** Rendered height in whole pixels. */
  height: number;
  /** Unrounded justified height. */
  exactHeight: number;
  /** Width actually occupied, including gutters. Equals the container width
      unless no partition could satisfy the hard height limit. */
  occupiedWidth: number;
  /** True only in the degenerate case where the hard limit forced the row
      to be narrower than the container (e.g. a single portrait). */
  constrained: boolean;
};

export type JustifiedLayout = {
  rects: Map<string, Rect>;
  rows: JustifiedRow[];
  height: number;
  width: number;
  gap: number;
  profile: JustifiedProfileName;
  targetHeight: number;
  maxImageHeight: number;
};

/* Cost weights. The band step dominates every other term, so an
   in-band partition always beats one that leaves the preferred band,
   whatever else it gains. Alternatives are therefore exhausted before a
   preference is relaxed. */
const COST_DEVIATION = 10;
const COST_BAND_STEP = 40;
const COST_BAND_SLOPE = 160;
const COST_RHYTHM = 8;
const RHYTHM_TOLERANCE = 0.18;
const COST_LAST_ROW_WEIGHT = 1.5;
const COST_LAST_SINGLE = 4;
const COST_OVERFLOW = 1e6;
const MAX_ROW_LENGTH = 24;

export function justifiedProfileFor(width: number): JustifiedProfileName {
  return width < MOBILE_GALLERY_WIDTH ? "mobile" : "desktop";
}

/**
 * Optimal justified rows for an ordered collection.
 *
 * Every item is placed exactly once and in order. Rows always fill the full
 * width; the only exception is a collection so small that no partition can
 * stay under the hard height limit, where the offending row is scaled down
 * and centred rather than allowed past 70svh.
 */
export function layoutJustified(
  items: JustifiedItem[],
  options: JustifiedOptions,
): JustifiedLayout {
  const width = Math.max(0, options.width);
  const gap = Math.max(0, Math.round(options.gap ?? GALLERY_GAP));
  const profileName = options.profile ?? justifiedProfileFor(width);
  const profile = JUSTIFIED_PROFILES[profileName];
  const targetHeight = width / profile.divisor;
  const maxImageHeight =
    options.viewportHeight && options.viewportHeight > 0
      ? options.viewportHeight * MAX_IMAGE_HEIGHT_RATIO
      : Number.POSITIVE_INFINITY;

  const empty: JustifiedLayout = {
    rects: new Map(),
    rows: [],
    height: 0,
    width,
    gap,
    profile: profileName,
    targetHeight,
    maxImageHeight,
  };

  const count = items.length;
  if (!count || width <= 0) return empty;

  const ratios = items.map(ratioOf);
  const prefix = [0];
  for (const ratio of ratios) prefix.push(prefix[prefix.length - 1] + ratio);

  /** Justified height of the row [start, end). */
  const heightOf = (start: number, end: number) =>
    (width - gap * (end - start - 1)) / (prefix[end] - prefix[start]);

  const preferredMin = targetHeight * profile.preferredMin;
  const preferredMax = targetHeight * profile.preferredMax;
  /* Rows are only extended while they stay plausibly visible; past this the
     photographs would be slivers. A row is always allowed to grow until it
     first satisfies the hard limit, so a valid partition is never cut off. */
  const searchFloor = Math.min(targetHeight * 0.3, maxImageHeight * 0.5);

  const rowCost = (start: number, end: number, allowOverflow: boolean) => {
    const n = end - start;
    const height = heightOf(start, end);
    if (!(height > 0)) return Number.POSITIVE_INFINITY;

    let cost = 0;
    if (height > maxImageHeight) {
      if (!allowOverflow) return Number.POSITIVE_INFINITY;
      cost += COST_OVERFLOW * (1 + Math.log(height / maxImageHeight));
    }

    const deviation = Math.log(height / targetHeight);
    const isLast = end === count;
    cost += COST_DEVIATION * deviation * deviation * (isLast ? COST_LAST_ROW_WEIGHT : 1);

    if (height < preferredMin) {
      const excess = Math.log(preferredMin / height);
      cost += COST_BAND_STEP + COST_BAND_SLOPE * excess * excess;
    } else if (height > preferredMax) {
      const excess = Math.log(height / preferredMax);
      cost += COST_BAND_STEP + COST_BAND_SLOPE * excess * excess;
    }

    if (n === 1 && count > 1) {
      cost += profile.singleImagePenalty + (isLast ? COST_LAST_SINGLE : 0);
    }

    return cost;
  };

  const rhythmCost = (previousHeight: number, height: number) => {
    const jump = Math.abs(Math.log(height / previousHeight)) - RHYTHM_TOLERANCE;
    return jump > 0 ? COST_RHYTHM * jump * jump : 0;
  };

  /**
   * dp[end][n] is the cheapest layout of [0, end) whose last row holds the
   * final n items. Keeping the last row in the state lets the rhythm term
   * compare neighbouring rows while the optimum stays global.
   */
  const solve = (allowOverflow: boolean) => {
    const dp: Float64Array[] = [];
    const parent: Int32Array[] = [];
    for (let end = 0; end <= count; end++) {
      dp.push(new Float64Array(MAX_ROW_LENGTH + 1).fill(Number.POSITIVE_INFINITY));
      parent.push(new Int32Array(MAX_ROW_LENGTH + 1).fill(-1));
    }

    for (let end = 1; end <= count; end++) {
      for (let n = 1; n <= Math.min(MAX_ROW_LENGTH, end); n++) {
        const start = end - n;
        const height = heightOf(start, end);
        /* Rows only get shorter as they grow, so once a row is both legal
           and thinner than the search floor, longer rows are pointless. */
        if (n > 1 && height < searchFloor && heightOf(start + 1, end) <= maxImageHeight) break;

        const cost = rowCost(start, end, allowOverflow);
        if (!Number.isFinite(cost)) continue;

        if (start === 0) {
          dp[end][n] = cost;
          parent[end][n] = 0;
          continue;
        }

        let best = Number.POSITIVE_INFINITY;
        let bestPrevious = -1;
        for (let m = 1; m <= Math.min(MAX_ROW_LENGTH, start); m++) {
          const previous = dp[start][m];
          if (!Number.isFinite(previous)) continue;
          const total = previous + rhythmCost(heightOf(start - m, start), height);
          if (total < best) {
            best = total;
            bestPrevious = m;
          }
        }
        if (bestPrevious < 0) continue;
        dp[end][n] = best + cost;
        parent[end][n] = bestPrevious;
      }
    }

    let bestLast = -1;
    let bestTotal = Number.POSITIVE_INFINITY;
    for (let n = 1; n <= Math.min(MAX_ROW_LENGTH, count); n++) {
      if (dp[count][n] < bestTotal) {
        bestTotal = dp[count][n];
        bestLast = n;
      }
    }
    if (bestLast < 0) return null;

    const breaks: [number, number][] = [];
    let end = count;
    let n = bestLast;
    while (end > 0) {
      const start = end - n;
      breaks.push([start, end]);
      const previous = parent[end][n];
      end = start;
      n = previous;
    }
    return breaks.reverse();
  };

  /* The overflow pass only runs when the strict pass finds nothing, which
     needs a collection too small to share any row (e.g. one portrait). */
  const breaks = solve(false) ?? solve(true);
  if (!breaks) return empty;

  const rects = new Map<string, Rect>();
  const rows: JustifiedRow[] = [];
  let y = 0;

  for (const [start, end] of breaks) {
    const exactHeight = heightOf(start, end);
    const constrained = exactHeight > maxImageHeight;
    const rowExact = constrained ? maxImageHeight : exactHeight;
    const rowHeight = Math.max(1, Math.round(rowExact));

    /* Exact widths sum to the available width. Edges are snapped to whole
       pixels so every gutter is precisely `gap` and the last edge lands on
       the container edge; each frame stays within a pixel of its ratio. */
    const occupied = constrained
      ? rowExact * (prefix[end] - prefix[start]) + gap * (end - start - 1)
      : width;
    const offset = constrained ? (width - occupied) / 2 : 0;
    let exactLeft = offset;
    let left = Math.round(exactLeft);

    for (let index = start; index < end; index++) {
      const exactWidth = rowExact * ratios[index];
      const isLastInRow = index === end - 1;
      const right = isLastInRow && !constrained
        ? width
        : Math.round(exactLeft + exactWidth);
      rects.set(items[index].key, {
        x: left,
        y,
        width: right - left,
        height: rowHeight,
      });
      exactLeft += exactWidth + gap;
      left = right + gap;
    }

    rows.push({
      start,
      end,
      keys: items.slice(start, end).map((item) => item.key),
      y,
      height: rowHeight,
      exactHeight,
      occupiedWidth: occupied,
      constrained,
    });

    y += rowHeight + gap;
  }

  return {
    rects,
    rows,
    height: Math.max(0, y - gap),
    width,
    gap,
    profile: profileName,
    targetHeight,
    maxImageHeight,
  };
}

/** The overview gallery for the canonical collection. */
export function layoutGallery(
  images: GalleryImage[],
  options: JustifiedOptions,
): JustifiedLayout {
  return layoutJustified(
    images.map((image) => ({ key: image.id, aspectRatio: image.aspectRatio })),
    options,
  );
}

/* ─────────────────────────────────────────────
   FOCUS PERIPHERY PACKER
   ─────────────────────────────────────────────

   Used only by the desktop focus composition to fill the narrow walls on
   either side of the focused photograph. The overview gallery does not use
   it. */

type PackItem = {
  key: string;
  aspectRatio: number;
};

type PackResult = {
  rects: Map<string, Rect>;
  overflow: string[];
};

/** Earliest collision-free y for a rectangle at x. */
function findPosition(
  width: number,
  height: number,
  x: number,
  placed: Rect[],
  gap: number,
  maxHeight?: number,
): number | null {
  let y = 0;

  for (let iteration = 0; iteration <= placed.length + 1; iteration++) {
    if (maxHeight !== undefined && y + height > maxHeight + 0.01) {
      return null;
    }

    const collision = placed.find((other) => {
      const overlapsX =
        x < other.x + other.width + gap - 0.01 &&
        x + width + gap > other.x + 0.01;

      const overlapsY =
        y < other.y + other.height + gap - 0.01 &&
        y + height + gap > other.y + 0.01;

      return overlapsX && overlapsY;
    });

    if (!collision) return y;

    y = collision.y + collision.height + gap;
  }

  return null;
}

/** Fill a bounded region with equal-width columns; items that do not fit overflow. */
function packColumns(
  items: PackItem[],
  options: {
    width: number;
    gap: number;
    columns: number;
    maxHeight?: number;
  },
): PackResult {
  const rects = new Map<string, Rect>();
  const overflow: string[] = [];

  const columns = Math.max(1, Math.floor(options.columns));
  const gap = Math.max(0, options.gap);
  const columnWidth = (options.width - gap * (columns - 1)) / columns;

  if (columnWidth <= 0) {
    return { rects, overflow: items.map((i) => i.key) };
  }

  const placed: Rect[] = [];
  const columnHeights: number[] = Array(columns).fill(0);

  for (const item of items) {
    const frameHeight = columnWidth / ratioOf(item);
    let best: { column: number; x: number; y: number; score: number } | null = null;

    for (let column = 0; column < columns; column++) {
      const x = column * (columnWidth + gap);
      const y = findPosition(columnWidth, frameHeight, x, placed, gap, options.maxHeight);
      if (y === null) continue;
      /* Compact first, with a light preference for the emptier column. */
      const score = y + columnHeights[column] * 0.12;
      if (!best || score < best.score) best = { column, x, y, score };
    }

    if (!best) {
      overflow.push(item.key);
      continue;
    }

    const rect: Rect = { x: best.x, y: best.y, width: columnWidth, height: frameHeight };
    placed.push(rect);
    rects.set(item.key, rect);
    columnHeights[best.column] = Math.max(columnHeights[best.column], rect.y + rect.height + gap);
  }

  return { rects, overflow };
}

/* ─────────────────────────────────────────────
   DESKTOP FOCUS COMPOSITION
   ───────────────────────────────────────────── */

export type FocusOptions = {
  width: number;
  height: number;
};

export type FocusLayout = {
  rects: Map<string, Rect>;
  panel: Rect | null;
  panelPlacement: PanelPlacement;
  focalId: string;
};

function packFocusSide(
  images: GalleryImage[],
  x: number,
  width: number,
  height: number,
  gap: number,
  rects: Map<string, Rect>,
  mirror = false,
) {
  if (!images.length || width < 20 || height < 20) return;

  const columns = Math.max(
    1,
    Math.floor((width + gap) / 105),
  );

  const items = images.map((image) => ({
    key: image.id,
    aspectRatio: ratioOf(image),
  }));

  const result = packColumns(items, {
    width,
    gap,
    columns,
    maxHeight: height,
  });

  result.rects.forEach((rect, id) => {
    rects.set(id, {
      ...rect,
      x: x + (mirror ? width - rect.x - rect.width : rect.x),
    });
  });

  return result.overflow;
}

/**
 * Circular spatial slot ordering for the conveyor:
 * 
 * Slots are numbered in visual traversal order from bottom-right through
 * right columns, across to left columns, and wrapping back. This creates
 * the appearance of continuous flow: right → focus → left → right.
 * 
 * When a new photo becomes focused:
 * - The previous focus moves to the nearest left slot
 * - All side images advance through the slot sequence
 * - The image at the top-left wraps to the bottom-right
 */
function buildConveyorSequence(
  images: GalleryImage[],
  focusedId: string,
  options: {
    rightSlots: number;
    leftSlots: number;
  },
): {
  focusedIndex: number;
  rightSequence: string[];
  leftSequence: string[];
  allIds: string[];
} {
  const focusedIndex = images.findIndex((img) => img.id === focusedId);
  if (focusedIndex < 0) {
    return {
      focusedIndex: -1,
      rightSequence: [],
      leftSequence: [],
      allIds: images.map((img) => img.id),
    };
  }

  const totalSideSlots = options.rightSlots + options.leftSlots;
  const count = images.length;

  // Build a circular sequence starting from the focused image
  const sequence: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = (focusedIndex + 1 + i) % count;
    sequence.push(images[idx].id);
  }

  // Split into right and left sequences
  const rightSequence = sequence.slice(0, options.rightSlots);
  const leftSequence = sequence.slice(options.rightSlots, totalSideSlots);

  return {
    focusedIndex,
    rightSequence,
    leftSequence,
    allIds: sequence,
  };
}

/**
 * Pack images into left and right columns using actual dimensions,
 * respecting the specified sequence order.
 */
function packConveyorSide(
  sequenceIds: string[],
  imageMap: Map<string, GalleryImage>,
  x: number,
  width: number,
  height: number,
  gap: number,
  columns: number,
  mirror: boolean,
): Map<string, Rect> {
  const rects = new Map<string, Rect>();
  if (!sequenceIds.length || width < 20 || height < 20) return rects;

  const columnCount = Math.max(1, Math.min(columns, sequenceIds.length));
  const perColumn = Array.from({ length: columnCount }, () => [] as string[]);
  const remaining = [...sequenceIds];
  const columnRatios: number[] = Array(columnCount).fill(0);
  for (const id of remaining) {
    const image = imageMap.get(id);
    if (!image) continue;
    let targetColumn = 0;
    for (let column = 1; column < columnCount; column++) {
      if (columnRatios[column] < columnRatios[targetColumn]) targetColumn = column;
    }
    perColumn[targetColumn].push(id);
    columnRatios[targetColumn] += 1 / ratioOf(image);
  }

  const columnWidths = perColumn.map((ids) => {
    const ratioSum = ids.reduce((sum, id) => {
      const image = imageMap.get(id);
      return sum + (image ? 1 / ratioOf(image) : 0);
    }, 0);
    const heightLimitedWidth = ratioSum > 0
      ? Math.max(1, (height - gap * Math.max(0, ids.length - 1)) / ratioSum)
      : 1;
    return Math.min((width - gap * (columnCount - 1)) / columnCount, heightLimitedWidth);
  });

  let columnX = 0;
  perColumn.forEach((ids, column) => {
    const columnWidth = columnWidths[column];
    let columnY = 0;
    ids.forEach((id) => {
      const image = imageMap.get(id);
      if (!image) return;
      const frameHeight = columnWidth / ratioOf(image);
      rects.set(id, {
        x: columnX,
        y: columnY,
        width: columnWidth,
        height: frameHeight,
      });
      columnY += frameHeight + gap;
    });
    columnX += columnWidth + gap;
  });

  rects.forEach((rect) => {
    rect.x = mirror ? x + width - rect.x - rect.width : x + rect.x;
  });

  return rects;
}

export function layoutFocusDesktop(
  images: GalleryImage[],
  focalId: string,
  options: FocusOptions,
): FocusLayout {
  const { width, height } = options;
  const rects = new Map<string, Rect>();

  const index = images.findIndex((image) => image.id === focalId);

  if (index < 0 || !images.length) {
    return {
      rects,
      panel: null,
      panelPlacement: "below",
      focalId,
    };
  }

  const focal = images[index];
  const ratio = ratioOf(focal);
  const portrait = ratio < 1;

  const padding = GALLERY_PADDING;
  const gap = FOCUS_GAP;

  const availableWidth = width - padding * 2;
  const availableHeight = Math.max(1, height - padding * 2);
  const panelHeight = FOCUS_PANEL_HEIGHT;

  // Landscape: reserve room for the information panel below.
  // Portrait: image and information panel sit side by side.

  const panelWidth = Math.min(
    FOCUS_PANEL_SIDE_WIDTH,
    availableWidth * 0.28,
  );

  const panelOnRight =
    portrait &&
    availableWidth >= 600 &&
    availableHeight * ratio + panelWidth + gap <= availableWidth;


  const maxImageHeight = panelOnRight
    ? availableHeight
    : Math.max(1, availableHeight - panelHeight - gap);

  const panelSpace = panelOnRight ? panelWidth + gap : 0;

  // Main image gets a modest enlargement relative to a normal fit.
  const desiredHeight = maxImageHeight;

  const desiredWidth = desiredHeight * ratio;

  const maxFocalWidth = availableWidth - panelSpace;

  const focalWidth = Math.min(
    desiredWidth * 1.10,
    maxFocalWidth,
    maxImageHeight * ratio,
  );

  const focalHeight = focalWidth / ratio;

  const compositionWidth = focalWidth + panelSpace;

  const focalX =
    padding + (availableWidth - compositionWidth) / 2;

  const focalY = Math.max(
    padding,
    Math.min(
      (height - focalHeight - (panelOnRight ? 0 : panelHeight + gap)) / 2,
      height - padding - focalHeight -
      (panelOnRight ? 0 : panelHeight + gap),
    ),
  );

  const focalRect: Rect = {
    x: focalX,
    y: focalY,
    width: focalWidth,
    height: focalHeight,
  };

  rects.set(focal.id, focalRect);

  const panel: Rect = panelOnRight
    ? {
      x: focalX + focalWidth + gap,
      y: focalY,
      width: panelWidth,
      height: focalHeight,
    }
    : {
      x: focalX,
      y: focalY + focalHeight + gap,
      width: focalWidth,
      height: panelHeight,
    };

  const leftWidth = Math.max(
    0,
    focalX - padding - gap,
  );

  const rightX = panelOnRight
    ? panel.x + panel.width + gap
    : focalX + focalWidth + gap;

  const rightWidth = Math.max(
    0,
    width - padding - rightX,
  );

  // Keep the photographic walls to two columns maximum, allocating the full
  // circular sequence proportionally to the space available on each side.
  const MIN_SIDE_COLUMN_WIDTH = 64;

const columnsForSide = (sideWidth: number) =>
  sideWidth >= MIN_SIDE_COLUMN_WIDTH * 2 + PERIPHERAL_GAP
    ? 2
    : 1;

const rightColumns = columnsForSide(rightWidth);
const leftColumns = columnsForSide(leftWidth);
  const sideCount = images.length - 1;
  const rightSlots = Math.round(sideCount * rightWidth / Math.max(1, rightWidth + leftWidth));
  const leftSlots = sideCount - rightSlots;

  // Build the circular conveyor sequence
  const conveyor = buildConveyorSequence(images, focalId, {
    rightSlots,
    leftSlots,
  });

  // Create a map for quick lookup
  const imageMap = new Map(images.map((img) => [img.id, img]));

  // Pack right side (nearest image goes to top-right, sequence flows down)
  const rightRects = packConveyorSide(
    conveyor.rightSequence,
    imageMap,
    rightX,
    rightWidth,
    height,
    PERIPHERAL_GAP,
    rightColumns,
    false,
  );
  rightRects.forEach((rect, id) => rects.set(id, rect));

  // Pack left side (nearest image goes to top-left, sequence flows down and mirrors)
  const leftRects = packConveyorSide(
    conveyor.leftSequence,
    imageMap,
    padding,
    leftWidth,
    height + 20,
    PERIPHERAL_GAP,
    leftColumns,
    true,
  );
  leftRects.forEach((rect, id) => rects.set(id, rect));

  return {
    rects,
    panel,
    panelPlacement: panelOnRight ? "right" : "below",
    focalId,
  };
}

/* ─────────────────────────────────────────────
   MOBILE FOCUS COMPOSITION
   ───────────────────────────────────────────── */

export type MobileNavigatorRow = {
  id: string;
  items: GalleryImage[];
  height: number;
};

export type MobileLayout = {
  main: Rect;
  previews: { id: string; rect: Rect }[];
  rows: MobileNavigatorRow[];
  panelPlacement: PanelPlacement;
};

export function layoutFocusMobile(
  images: GalleryImage[],
  focalId: string,
  options: {
    width: number;
    gap: number;
    rowCount: number;
    height?: number;
  },
): MobileLayout {
  const {
    width,
    gap,
    rowCount,
    height = 844,
  } = options;

  const index = images.findIndex(
    (image) => image.id === focalId,
  );

  const empty: MobileLayout = {
    main: { x: 0, y: 0, width, height: 0 },
    previews: [],
    rows: [],
    panelPlacement: "below",
  };

  if (index < 0 || !images.length) return empty;

  const focal = images[index];
  const ratio = ratioOf(focal);

  const maxHeight = height * MAX_IMAGE_HEIGHT_RATIO;

  // Full-width until the 70vh limit is reached.
  const mainHeight = Math.min(
    width / ratio,
    maxHeight,
  );

  const mainWidth = mainHeight * ratio;

  const main: Rect = {
    x: (width - mainWidth) / 2,
    y: 0,
    width: mainWidth,
    height: mainHeight,
  };

  const perRow = Math.ceil(
    images.length / Math.max(1, rowCount),
  );

  const rows: MobileNavigatorRow[] = [];

  for (let row = 0; row < rowCount; row++) {
    const items = images.slice(
      row * perRow,
      (row + 1) * perRow,
    );

    if (!items.length) continue;

    rows.push({
      id: `row-${row}`,
      items,
      height: clamp(width * 0.105, 40, 64),
    });
  }

  const previews: MobileLayout["previews"] = [];

  const peek = 16;
  const previous =
    images[(index - 1 + images.length) % images.length];

  const next =
    images[(index + 1) % images.length];

  if (images.length > 1) {
    for (const [image, side] of [
      [previous, -1],
      [next, 1],
    ] as const) {
      if (image.id === focal.id) continue;

      const previewRatio = ratioOf(image);
      const previewHeight = Math.min(
        mainHeight * 0.9,
        maxHeight,
      );

      const previewWidth = previewHeight * previewRatio;

      previews.push({
        id: image.id,
        rect: {
          x:
            side < 0
              ? -previewWidth + peek
              : width - peek,
          y: 0,
          width: previewWidth,
          height: previewHeight,
        },
      });
    }
  }

  return {
    main,
    previews,
    rows,
    panelPlacement: "below",
  };
}
