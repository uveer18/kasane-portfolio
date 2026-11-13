import type { GalleryImage } from "@/lib/gallery";

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PanelPlacement = "below" | "right";

/** Tight gutters for the overview and focus compositions. */
export const GALLERY_GAP = 3;
export const MASONRY_GAP = GALLERY_GAP; // Backwards-compatible alias.
export const PERIPHERAL_GAP = 2;
export const FOCUS_GAP = 10;
export const GALLERY_PADDING = 16;
export const MAX_IMAGE_HEIGHT_RATIO = 0.7;

export const FOCUS_PANEL_HEIGHT = 140;
export const FOCUS_PANEL_SIDE_WIDTH = 268;
const FOCUS_RIBBON_MAX_HEIGHT = 104;
const FOCUS_RIBBON_MIN_HEIGHT = 34;
export const FOCUS_TOP_ROW_MIN = FOCUS_RIBBON_MIN_HEIGHT;
export const FOCUS_TOP_ROW_RATIO = 0.065;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function ratioOf(item: { aspectRatio: number }): number {
  return item.aspectRatio > 0 && Number.isFinite(item.aspectRatio)
    ? item.aspectRatio
    : 1;
}

/* -------------------------------------------------------------------------- */
/*                         OVERVIEW: JUSTIFIED ROWS                          */
/* -------------------------------------------------------------------------- */

export type JustifiedProfileName = "desktop" | "mobile";

export type JustifiedProfile = {
  divisor: number;
  preferredMin: number;
  preferredMax: number;
  singleImagePenalty: number;
};

export const JUSTIFIED_PROFILES: Record<JustifiedProfileName, JustifiedProfile> = {
  desktop: {
    divisor: 4.8,
    preferredMin: 0.7,
    preferredMax: 1.45,
    singleImagePenalty: 42,
  },
  mobile: {
    divisor: 2.2,
    preferredMin: 0.7,
    preferredMax: 1.35,
    singleImagePenalty: 42,
  },
};

export type JustifiedItem = {
  key: string;
  aspectRatio: number;
};

export type JustifiedOptions = {
  width: number;
  gap?: number;
  /** Height of the stable small viewport (100svh), not the changing visual viewport. */
  viewportHeight?: number;
  profile?: JustifiedProfileName;
};

export type JustifiedRow = {
  /** Index range [start, end) in the original ordered collection. */
  start: number;
  end: number;
  keys: string[];
  y: number;
  height: number;
  exactHeight: number;
  occupiedWidth: number;
  /** True when the row is intentionally ragged or constrained. */
  constrained: boolean;
  /** False for the deliberately ragged one/two-image final row. */
  justified: boolean;
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

const MAX_ROW_LENGTH = 12;
const COST_DEVIATION = 24;
const COST_BAND = 34;
const COST_BAND_CURVE = 110;
const COST_RHYTHM = 9;
const RHYTHM_TOLERANCE = 0.2;
const COST_LAST_ROW = 1.15;
const COST_LAST_SINGLE = 28;
const COST_LAST_UNDERFILLED = 1.5;

export function justifiedProfileFor(width: number): JustifiedProfileName {
  return width < 640 ? "mobile" : "desktop";
}

/**
 * Globally partitions an ordered collection into justified rows.
 *
 * Dynamic programming evaluates every candidate row up to MAX_ROW_LENGTH.
 * The state remembers the previous row length so adjacent row heights can be
 * balanced. The final one/two-image row is deliberately left-aligned at a
 * restrained height instead of being enlarged to fill the entire container.
 */
export function layoutJustified(
  items: JustifiedItem[],
  options: JustifiedOptions,
): JustifiedLayout {
  const width = Math.max(0, options.width);
  const gap = Math.max(0, options.gap ?? GALLERY_GAP);
  const profileName = options.profile ?? justifiedProfileFor(width);
  const profile = JUSTIFIED_PROFILES[profileName];
  const targetHeight = width / profile.divisor;
  const maxImageHeight =
    options.viewportHeight !== undefined && options.viewportHeight > 0
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
  if (count === 0 || width <= 0 || targetHeight <= 0) return empty;

  const ratios = items.map(ratioOf);
  const prefix = new Array<number>(count + 1).fill(0);
  for (let i = 0; i < count; i += 1) {
    prefix[i + 1] = prefix[i] + ratios[i];
  }

  const sumRatio = (start: number, end: number) => prefix[end] - prefix[start];
  const filledHeight = (start: number, end: number) => {
    const itemCount = end - start;
    const usableWidth = width - gap * (itemCount - 1);
    return usableWidth > 0 ? usableWidth / sumRatio(start, end) : 0;
  };

  /**
   * A normal row fills the width. A final row with one or two images uses the
   * target height (or the height needed to fit) and leaves its remaining space
   * empty; this avoids comically enlarged last photographs.
   */
  const rowHeight = (start: number, end: number, isFinal: boolean) => {
    const filled = filledHeight(start, end);
    if (isFinal && end - start <= 2) {
      return Math.min(targetHeight, maxImageHeight, filled);
    }
    return filled;
  };

  const rowCost = (start: number, end: number, isFinal: boolean): number => {
    const n = end - start;
    const height = rowHeight(start, end, isFinal);
    if (!Number.isFinite(height) || height <= 0 || height > maxImageHeight + 0.001) {
      return Number.POSITIVE_INFINITY;
    }

    const deviation = Math.log(height / targetHeight);
    let cost = COST_DEVIATION * deviation * deviation;

    const preferredMin = targetHeight * profile.preferredMin;
    const preferredMax = targetHeight * profile.preferredMax;
    if (height < preferredMin) {
      const excess = Math.log(preferredMin / height);
      cost += COST_BAND + COST_BAND_CURVE * excess * excess;
    } else if (height > preferredMax) {
      const excess = Math.log(height / preferredMax);
      cost += COST_BAND + COST_BAND_CURVE * excess * excess;
    }

    if (n === 1 && count > 1) {
      cost += profile.singleImagePenalty;
      if (isFinal) cost += COST_LAST_SINGLE;
    }

    if (isFinal && n <= 2) {
      const occupied = height * sumRatio(start, end) + gap * (n - 1);
      const unusedFraction = Math.max(0, (width - occupied) / width);
      cost += unusedFraction * unusedFraction * COST_LAST_UNDERFILLED;
      cost *= COST_LAST_ROW;
    }

    return cost;
  };

  const rhythmCost = (previous: number, current: number) => {
    const jump = Math.abs(Math.log(current / previous)) - RHYTHM_TOLERANCE;
    return jump > 0 ? COST_RHYTHM * jump * jump : 0;
  };

  // dp[end][n] = lowest cost for items [0,end) when its final row has n items.
  const maxN = Math.min(MAX_ROW_LENGTH, count);
  const dp: Float64Array[] = [];
  const parent: Int16Array[] = [];
  for (let end = 0; end <= count; end += 1) {
    dp.push(new Float64Array(maxN + 1).fill(Number.POSITIVE_INFINITY));
    parent.push(new Int16Array(maxN + 1).fill(-1));
  }

  for (let end = 1; end <= count; end += 1) {
    for (let n = 1; n <= Math.min(maxN, end); n += 1) {
      const start = end - n;
      const final = end === count;
      const currentHeight = rowHeight(start, end, final);
      const currentCost = rowCost(start, end, final);
      if (!Number.isFinite(currentCost)) continue;

      if (start === 0) {
        dp[end][n] = currentCost;
        parent[end][n] = 0;
        continue;
      }

      let best = Number.POSITIVE_INFINITY;
      let bestPreviousLength = -1;
      for (let previousLength = 1; previousLength <= Math.min(maxN, start); previousLength += 1) {
        const previousCost = dp[start][previousLength];
        if (!Number.isFinite(previousCost)) continue;

        const previousStart = start - previousLength;
        // Since another row follows, the previous row is a normal full-width row.
        const previousHeight = rowHeight(previousStart, start, false);
        const candidate = previousCost + rhythmCost(previousHeight, currentHeight);
        if (candidate < best) {
          best = candidate;
          bestPreviousLength = previousLength;
        }
      }

      if (bestPreviousLength >= 0) {
        dp[end][n] = best + currentCost;
        parent[end][n] = bestPreviousLength;
      }
    }
  }

  let bestLastLength = -1;
  let bestCost = Number.POSITIVE_INFINITY;
  for (let n = 1; n <= maxN; n += 1) {
    if (dp[count][n] < bestCost) {
      bestCost = dp[count][n];
      bestLastLength = n;
    }
  }

  let partitions: Array<[number, number]> = [];
  if (bestLastLength >= 0) {
    let end = count;
    let n = bestLastLength;
    while (end > 0 && n > 0) {
      const start = end - n;
      partitions.push([start, end]);
      const previousLength = parent[end][n];
      end = start;
      n = previousLength;
    }
    partitions.reverse();
  }

  /*
   * Degenerate fallback: normally only a single extremely tall portrait can
   * reach this path. Keep its proportions, cap its height, and centre it.
   */
  if (partitions.length === 0) {
    partitions = items.map((_, index) => [index, index + 1] as [number, number]);
  }

  const rects = new Map<string, Rect>();
  const rows: JustifiedRow[] = [];
  let y = 0;

  for (let rowIndex = 0; rowIndex < partitions.length; rowIndex += 1) {
    const [start, end] = partitions[rowIndex];
    const n = end - start;
    const isFinal = rowIndex === partitions.length - 1;
    let height = rowHeight(start, end, isFinal);
    if (!Number.isFinite(height) || height <= 0) height = Math.min(targetHeight, maxImageHeight);
    if (height > maxImageHeight) height = maxImageHeight;
    height = Math.max(1, height);

    const rowWidth = height * sumRatio(start, end) + gap * (n - 1);
    const constrained = rowWidth < width - 0.5;
    const justified = !constrained;
    let x = 0;

    for (let index = start; index < end; index += 1) {
      const imageWidth = height * ratios[index];
      rects.set(items[index].key, {
        x,
        y,
        width: imageWidth,
        height,
      });
      x += imageWidth + gap;
    }

    rows.push({
      start,
      end,
      keys: items.slice(start, end).map((item) => item.key),
      y,
      height,
      exactHeight: height,
      occupiedWidth: Math.max(0, rowWidth),
      constrained,
      justified,
    });

    y += height + gap;
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

/** Main overview API consumed by PhotoGallery.tsx. */
export function layoutGallery(
  images: GalleryImage[],
  options: JustifiedOptions,
): JustifiedLayout {
  return layoutJustified(
    images.map((image) => ({ key: image.id, aspectRatio: image.aspectRatio })),
    options,
  );
}

/* Compatibility exports for any older callers still using the masonry API. */
export function columnsForWidth(width: number): number {
  if (width < 560) return 2;
  if (width < 900) return 3;
  if (width < 1200) return 4;
  return 5;
}

export function spanForImage(_image: GalleryImage, _index: number, _columns: number): number {
  return 1;
}

export function layoutMasonry(
  images: GalleryImage[],
  width: number,
  gap = GALLERY_GAP,
): { rects: Map<string, Rect>; height: number; columns: number } {
  const layout = layoutGallery(images, { width, gap });
  return { rects: layout.rects, height: layout.height, columns: columnsForWidth(width) };
}

/* -------------------------------------------------------------------------- */
/*                        DESKTOP FOCUS COMPOSITION                           */
/* -------------------------------------------------------------------------- */

export type FocusOptions = {
  width: number;
  height: number;
  gap?: number;
};

export type FocusLayout = {
  rects: Map<string, Rect>;
  panel: Rect | null;
  panelPlacement: PanelPlacement;
  focalId: string;
};


type SideColumn = {
  items: GalleryImage[];
  load: number;
};

/**
 * Split a directional sequence into two columns by projected geometric height.
 * The nearest image is assigned first; ties go to the column nearest the hero.
 */
function splitIntoBalancedColumns(
  images: GalleryImage[],
  columnWidth: number,
  heightLimit: number,
): [SideColumn, SideColumn] {
  const columns: [SideColumn, SideColumn] = [
    { items: [], load: 0 },
    { items: [], load: 0 },
  ];

  for (const image of images) {
    const projectedHeight = columnWidth / ratioOf(image);
    const target = columns[0].load <= columns[1].load ? 0 : 1;
    columns[target].items.push(image);
    columns[target].load += projectedHeight;
  }

  // Scale both columns independently only when their natural stack exceeds
  // the viewport. The image ratio is retained because width and height scale together.
  for (const column of columns) {
    const naturalHeight = column.items.reduce(
      (sum, image) => sum + columnWidth / ratioOf(image),
      0,
    );
    if (naturalHeight > heightLimit && naturalHeight > 0) {
      const scale = heightLimit / naturalHeight;
      column.load = column.items.reduce(
        (sum, image) => sum + (columnWidth * scale) / ratioOf(image),
        0,
      );
    } else {
      column.load = naturalHeight;
    }
  }

  return columns;
}

function placeSideColumns(
  images: GalleryImage[],
  options: {
    side: "left" | "right";
    x: number;
    y: number;
    width: number;
    height: number;
    gap: number;
  },
): Map<string, Rect> {
  const rects = new Map<string, Rect>();
  if (!images.length || options.width <= 0 || options.height <= 0) return rects;

  const columnGap = options.gap;
  const columnWidth = Math.max(1, (options.width - columnGap) / 2);
  const [first, second] = splitIntoBalancedColumns(images, columnWidth, options.height);

  // On the left, column 1 is nearest the hero. On the right, column 0 is.
  const orderedColumns =
    options.side === "left" ? [first, second] : [first, second];

  orderedColumns.forEach((column, columnIndex) => {
    const visualColumn =
      options.side === "left" ? 1 - columnIndex : columnIndex;
    const columnX =
      options.x + visualColumn * (columnWidth + columnGap);

    const naturalHeight = column.items.reduce(
      (sum, image) => sum + columnWidth / ratioOf(image),
      0,
    );
    const scale = naturalHeight > options.height
      ? options.height / naturalHeight
      : 1;
    const renderedWidth = columnWidth * scale;
    const renderedHeight = naturalHeight * scale;
    const freeHeight = Math.max(0, options.height - renderedHeight);
    const itemGap = column.items.length > 1
      ? Math.min(16, freeHeight / (column.items.length + 1))
      : freeHeight / 2;
    let y = options.y + (freeHeight - itemGap * Math.max(0, column.items.length - 1)) / 2;

    for (const image of column.items) {
      const imageWidth = renderedWidth;
      const imageHeight = imageWidth / ratioOf(image);
      const centeredX = columnX + (columnWidth - imageWidth) / 2;
      rects.set(image.id, {
        x: centeredX,
        y,
        width: imageWidth,
        height: imageHeight,
      });
      y += imageHeight + itemGap;
    }
  });

  return rects;
}

/**
 * Circular side-wall composition:
 * - two geometrically balanced columns on the left,
 * - the focused image in the centre,
 * - two geometrically balanced columns on the right.
 *
 * The left wall is populated by walking backwards from the focused image;
 * the right wall walks forwards. Both directions wrap around the collection,
 * so neither side becomes empty at either end of the sequence.
 */
export function layoutFocusDesktop(
  images: GalleryImage[],
  focalId: string,
  options: FocusOptions,
): FocusLayout {
  const width = Math.max(0, options.width);
  const height = Math.max(0, options.height);
  const rects = new Map<string, Rect>();
  const focalIndex = images.findIndex((image) => image.id === focalId);

  if (focalIndex < 0 || width <= 0 || height <= 0) {
    return { rects, panel: null, panelPlacement: "right", focalId };
  }

  const focal = images[focalIndex];
  const count = images.length;
  const gap = Math.max(2, options.gap ?? PERIPHERAL_GAP);
  const outerPadding = Math.min(8, width * 0.006);
  const wallGap = Math.max(FOCUS_GAP, width * 0.008);

  // Reserve a central hero lane and two equal peripheral walls.
  const wallWidth = Math.max(1, width * 0.225);
  const heroLaneWidth = Math.max(1, width - wallWidth * 2 - wallGap * 2);
  const heroMaxWidth = Math.min(heroLaneWidth, width * 0.50);
  const heroHeight = Math.max(1, height);

  // The frame always spans the viewport height. object-fit: cover on the
  // focused frame makes the photograph fill that frame during presentation.
  const heroWidth = Math.max(1, heroMaxWidth);
  const heroX = (width - heroWidth) / 2;
  const focalRect: Rect = {
    x: heroX,
    y: 0,
    width: heroWidth,
    height: heroHeight,
  };
  rects.set(focal.id, focalRect);

  const leftItems: GalleryImage[] = [];
  const rightItems: GalleryImage[] = [];

  for (let distance = 1; distance < count; distance += 1) {
    const previous = images[(focalIndex - distance + count) % count];
    const next = images[(focalIndex + distance) % count];
    if (leftItems.length < Math.ceil((count - 1) / 2)) leftItems.push(previous);
    if (rightItems.length < Math.floor((count - 1) / 2)) rightItems.push(next);
  }

  const availableWallWidth = Math.max(
    1,
    (width - heroWidth - wallGap * 2 - outerPadding * 2) / 2,
  );
  const leftX = outerPadding;
  const rightX = width - outerPadding - availableWallWidth;

  placeSideColumns(leftItems, {
    side: "left",
    x: leftX,
    y: outerPadding,
    width: availableWallWidth,
    height: Math.max(1, height - outerPadding * 2),
    gap,
  }).forEach((rect, id) => rects.set(id, rect));

  placeSideColumns(rightItems, {
    side: "right",
    x: rightX,
    y: outerPadding,
    width: availableWallWidth,
    height: Math.max(1, height - outerPadding * 2),
    gap,
  }).forEach((rect, id) => rects.set(id, rect));

  // Metadata is a fixed-size card over the lower-right portion of the hero.
  // It no longer steals height from the photograph or changes with EXIF count.
  const panelWidth = Math.min(286, Math.max(224, heroWidth * 0.34));
  const panelHeight = Math.min(420, Math.max(260, height * 0.48));
  const panel: Rect = {
    x: clamp(heroX + heroWidth - panelWidth - 18, heroX + 12, width - panelWidth - 12),
    y: Math.max(12, height - panelHeight - 18),
    width: panelWidth,
    height: panelHeight,
  };

  return { rects, panel, panelPlacement: "right", focalId };
}

/* -------------------------------------------------------------------------- */
/*                         MOBILE FOCUS COMPOSITION                           */
/* -------------------------------------------------------------------------- */

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

export type MobileFocusOptions = {
  width: number;
  height?: number;
  gap: number;
  rowCount: number;
};

/** Full-width primary image plus scrollable thumbnail rows and edge previews. */
export function layoutFocusMobile(
  images: GalleryImage[],
  focalId: string,
  options: MobileFocusOptions,
): MobileLayout {
  const width = Math.max(0, options.width);
  const viewportHeight = options.height && options.height > 0 ? options.height : 800;
  const gap = Math.max(0, options.gap);
  const index = images.findIndex((image) => image.id === focalId);
  const empty: MobileLayout = {
    main: { x: 0, y: 0, width, height: 0 },
    previews: [],
    rows: [],
    panelPlacement: "below",
  };
  if (index < 0 || images.length === 0 || width <= 0) return empty;

  const focal = images[index];
  const ratio = ratioOf(focal);
  const maxMainHeight = viewportHeight;
  const mainHeight = Math.max(1, maxMainHeight);

  const requestedRows = Math.max(1, Math.floor(options.rowCount || 3));
  const rowCount = Math.min(requestedRows, images.length);
  const perRow = Math.ceil(images.length / rowCount);
  const rows: MobileNavigatorRow[] = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const rowItems = images.slice(rowIndex * perRow, (rowIndex + 1) * perRow);
    if (!rowItems.length) continue;
    const height = Math.round(clamp(width * 0.065 + rowIndex * 3, 40, 64));
    rows.push({ id: `row-${rowIndex}`, items: rowItems, height });
  }

  const previews: { id: string; rect: Rect }[] = [];
  const previewHeight = Math.min(mainHeight * 0.9, maxMainHeight * 0.9);
  const peek = Math.min(18, width * 0.045);
  const previous = images[(index - 1 + images.length) % images.length];
  const next = images[(index + 1) % images.length];

  if (images.length > 1 && previous.id !== focal.id) {
    const previewWidth = previewHeight * ratioOf(previous);
    previews.push({
      id: previous.id,
      rect: { x: -previewWidth + peek, y: 0, width: previewWidth, height: previewHeight },
    });
  }
  if (images.length > 1 && next.id !== focal.id) {
    const previewWidth = previewHeight * ratioOf(next);
    previews.push({
      id: next.id,
      rect: { x: width - peek, y: 0, width: previewWidth, height: previewHeight },
    });
  }

  return {
    main: { x: 0, y: 0, width, height: mainHeight },
    previews,
    rows,
    panelPlacement: "below",
  };
}
