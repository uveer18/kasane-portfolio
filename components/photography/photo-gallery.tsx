"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  buildGalleryCollection,
  galleryIndex,
  mergeGalleryImages,
  metaFieldsFor,
  neighbourIds,
  type GalleryImage,
} from "@/lib/gallery";
import {
  GALLERY_GAP,
  layoutFocusDesktop,
  layoutFocusMobile,
  layoutGallery,
  type Rect,
} from "@/lib/gallery-layout";
import { photographs } from "@/lib/photography";

const TRANSITION_MS = 620;
const COOLDOWN_MS = 140;
const EASING = "cubic-bezier(0.32, 0.72, 0, 1)";
const MOBILE_BREAKPOINT = 640;

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type GalleryFrame = {
  image: GalleryImage;
  index: number;
  rect?: Rect;
  highResolution: boolean;
};

/**
 * One frame renders an optimised thumbnail and, when it is the focused
 * photograph, the full resolution original on top of it. The two layers ask
 * the optimiser for very different widths, so they are genuinely different
 * assets rather than the same file twice.
 */

function GalleryImageView({
  image,
  highResolution,
  transitionDone,
  className,
  sizes,
  onLoad,
}: {
  image: GalleryImage;
  highResolution: boolean;
  transitionDone: boolean;
  className?: string;
  sizes: string;
  onLoad?: (width: number, height: number) => void;
}) {
  const [loadedOriginalSrc, setLoadedOriginalSrc] = useState<string | null>(null);

  // Original is visible only when BOTH loading and animation have finished.
  const originalVisible =
    highResolution &&
    transitionDone &&
    loadedOriginalSrc === image.src;

  return (
    <>
      {/* Every frame always retains its lightweight thumbnail. */}
      <Image
        src={image.thumbnail || image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className={`spatial-image spatial-thumb${className ? ` ${className}` : ""}`}
        onLoad={(event) => {
          const element = event.currentTarget;
          onLoad?.(element.naturalWidth, element.naturalHeight);
        }}
      />

      {/* The original exists only for the currently focused photograph. */}
      {highResolution && (
        <Image
          key={image.id}
          src={image.src}
          alt=""
          fill
          sizes={sizes}
          loading="eager"
          className={`spatial-image spatial-original${originalVisible ? " is-ready" : ""}`}
          onLoad={() => setLoadedOriginalSrc(image.src)}
        />
      )}
    </>
  );
}



/** Height of the small viewport (100svh): stable while mobile browser chrome slides. */
function measureSmallViewportHeight() {
  if (typeof window === "undefined") return 0;
  if (typeof CSS === "undefined" || !CSS.supports("height", "100svh")) return window.innerHeight;
  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none;";
  document.body.appendChild(probe);
  const height = probe.getBoundingClientRect().height;
  probe.remove();
  return height || window.innerHeight;
}

/** Thumbnail request width, bucketed so small resizes do not refetch. */
function thumbnailSizes(rect?: Rect) {
  if (!rect) return "(max-width: 639px) 100vw, 40vw";
  return `${Math.ceil(rect.width / 160) * 160}px`;
}

/** Native scrollbar width, measured independently of the current overflow state. */
function measureScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;top:-9999px;left:-9999px;width:100px;height:100px;overflow:scroll;visibility:hidden;";
  document.body.appendChild(probe);
  const width = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return width;
}

export function PhotoGallery({ preview = false }: { preview?: boolean }) {
  /* The one canonical collection. Both layouts read from it. */
  const [images, setImages] = useState<GalleryImage[]>(() => buildGalleryCollection(photographs));
  const [focusedImageId, setFocusedImageId] = useState<string | null>(null);
  const [collection, setCollection] = useState("All photographs");
  const [stageWidth, setStageWidth] = useState(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0, smallHeight: 0 });
  const [locked, setLocked] = useState(false);
  const [focusTransitionDone, setFocusTransitionDone] = useState(false);

  const focusTransitionTokenRef = useRef(0);
  const focusTransitionPendingRef = useRef(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef(new Map<string, HTMLButtonElement>());
  const flipFromRef = useRef<Map<string, DOMRect> | null>(null);
  const panelFromRef = useRef<DOMRect | null>(null);
  const panelSeenRef = useRef(false);
  const lockedRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anchorRef = useRef<{ id: string; offset: number } | null>(null);
  const resizeAnchorRef = useRef<{ id: string; offset: number } | null>(null);
  const restoreRef = useRef(false);
  const mobileTouchRef = useRef<{ x: number; y: number } | null>(null);

  /* Keep the collection in step with the server. */
  useEffect(() => {
    let active = true;
    fetch("/api/photography/photos").then((response) => response.json()).then((result: { photos?: Parameters<typeof buildGalleryCollection>[0] }) => {
      if (active && result.photos?.length) setImages((current) => mergeGalleryImages(current, buildGalleryCollection(result.photos!)));
    }).catch(() => undefined);
    const onAdded = (event: Event) => {
      const photo = (event as CustomEvent<Parameters<typeof buildGalleryCollection>[0][number]>).detail;
      if (photo) setImages((current) => mergeGalleryImages(current, buildGalleryCollection([photo])));
    };
    const onDeleted = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string; src?: string }>).detail;
      if (!detail) return;
      setImages((current) => current.filter((image) => image.id !== detail.id && image.src !== detail.src));
    };
    window.addEventListener("photograph-added", onAdded);
    window.addEventListener("photograph-deleted", onDeleted);
    return () => { active = false; window.removeEventListener("photograph-added", onAdded); window.removeEventListener("photograph-deleted", onDeleted); };
  }, []);

  const collections = useMemo(() => ["All photographs", ...Array.from(new Set(images.map((image) => image.collection).filter(Boolean)))], [images]);

  const visibleImages = useMemo(() => {
    const filtered = collection === "All photographs" ? images : images.filter((image) => image.collection === collection);
    return filtered.map((image, index) => ({ ...image, title: `Nature study ${String(index + 1).padStart(2, "0")}` }));
  }, [images, collection]);

  const focusedIndex = galleryIndex(visibleImages, focusedImageId);
  const focused = focusedIndex >= 0 ? visibleImages[focusedIndex] : null;
  const isMobile = viewport.width > 0 && viewport.width < MOBILE_BREAKPOINT;
  const mobileFocus = focused !== null && isMobile;

  /* If the focused photograph is removed, step to the neighbour that took its place. */
  const lastFocusedIndex = useRef(0);
  useEffect(() => { if (focusedIndex >= 0) lastFocusedIndex.current = focusedIndex; }, [focusedIndex]);
  useEffect(() => {
    if (!focusedImageId) return;
    if (visibleImages.some((image) => image.id === focusedImageId)) return;
    const fallback = visibleImages[Math.min(lastFocusedIndex.current, visibleImages.length - 1)];
    setFocusedImageId(fallback ? fallback.id : null);
  }, [visibleImages, focusedImageId]);

  useIsomorphicLayoutEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const update = () => setStageWidth(element.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useIsomorphicLayoutEffect(() => {
    const update = () => {
      const next = { width: window.innerWidth, height: window.innerHeight, smallHeight: measureSmallViewportHeight() };
      setViewport((current) => current.width === next.width && current.height === next.height && Math.abs(current.smallHeight - next.smallHeight) < 0.5 ? current : next);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => { window.removeEventListener("resize", update); window.removeEventListener("orientationchange", update); };
  }, []);

  /* The overview: optimal justified rows. Mobile proportions follow the
     viewport, and the 70svh ceiling follows the small viewport height. */
  const overview = useMemo(() => {
    if (!stageWidth || !visibleImages.length) return null;
    return layoutGallery(visibleImages, {
      width: stageWidth,
      gap: GALLERY_GAP,
      viewportHeight: viewport.smallHeight || undefined,
      profile: isMobile ? "mobile" : "desktop",
    });
  }, [visibleImages, stageWidth, viewport.smallHeight, isMobile]);

  const focusLayout = useMemo(() => {
    if (!focused || !viewport.width || !viewport.height) return null;
    return layoutFocusDesktop(visibleImages, focused.id, { width: viewport.width, height: viewport.height });
  }, [visibleImages, focused, viewport]);

  const mobileLayout = useMemo(() => {
    if (!focused || !viewport.width) return null;
    return layoutFocusMobile(visibleImages, focused.id, { width: viewport.width, height: viewport.height, gap: 8, rowCount: 3 });
  }, [visibleImages, focused, viewport]);

  /*
   * Keep every moving frame on its thumbnail during FLIP. Promote only the
   * settled hero to the original after the spatial transition has completed.
   */

  const highResolutionIds = useMemo(
    () => new Set(
      focused && focusTransitionDone ? [focused.id] : []
    ),
    [focused?.id, focusTransitionDone],
  );

  /* The neighbours are prefetched at full resolution without changing them. */

  /* Preload neighbouring thumbnails only. */
  useEffect(() => {
    if (!focused) return;

    const { previousId, nextId } = neighbourIds(
      visibleImages,
      focused.id
    );

    for (const id of [previousId, nextId]) {
      if (!id) continue;

      const image = visibleImages.find((item) => item.id === id);
      if (!image) continue;

      const preload = new window.Image();
      preload.decoding = "async";
      preload.src = image.thumbnail || image.src;
    }
  }, [focused, visibleImages]);


  const captureFrames = useCallback(() => {
    const measured = new Map<string, DOMRect>();
    framesRef.current.forEach((element, key) => measured.set(key, element.getBoundingClientRect()));
    return measured;
  }, []);

  /** The topmost visible photograph. */
  const topmostVisibleFrame = useCallback(() => {
    let anchor: { id: string; offset: number } | null = null;
    framesRef.current.forEach((element, key) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight || rect.height <= 0) return;
      if (!anchor || rect.top < anchor.offset) anchor = { id: key, offset: rect.top };
    });
    return anchor as { id: string; offset: number } | null;
  }, []);

  /** The topmost visible photograph is the anchor the exit restores. */
  const captureAnchor = useCallback(() => {
    anchorRef.current = topmostVisibleFrame();
  }, [topmostVisibleFrame]);

  const lock = useCallback(() => {
    lockedRef.current = true;
    setLocked(true);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => { lockedRef.current = false; setLocked(false); }, TRANSITION_MS + COOLDOWN_MS);
  }, []);

  /** Enter the focused gallery, remembering where the reader was. */
  const focusImage = useCallback((id: string) => {
    if (lockedRef.current) return;
    if (!visibleImages.some((image) => image.id === id)) return;
    if (focusedImageId === null) captureAnchor();
    flipFromRef.current = captureFrames();
    panelFromRef.current = panelRef.current?.getBoundingClientRect() ?? null;
    lock();
    focusTransitionTokenRef.current += 1;
    focusTransitionPendingRef.current = !isMobile;
    setFocusTransitionDone(isMobile);
    setFocusedImageId(id);
  }, [captureAnchor, captureFrames, focusedImageId, lock, visibleImages, isMobile]);

  /** Move to the previous or next photograph, wrapping around the ends. */
  const stepFocus = useCallback((direction: -1 | 1) => {
    if (!focused) return;
    const { previousId, nextId } = neighbourIds(visibleImages, focused.id);
    const target = direction === -1 ? previousId : nextId;
    if (!target) return;
    if (lockedRef.current) return;
    flipFromRef.current = captureFrames();
    panelFromRef.current = panelRef.current?.getBoundingClientRect() ?? null;
    lock();
    focusTransitionTokenRef.current += 1;
    focusTransitionPendingRef.current = !isMobile;
    setFocusTransitionDone(isMobile);
    setFocusedImageId(target);
  }, [captureFrames, focused, lock, visibleImages, isMobile]);

  /** Leave the focused gallery and return to the closed one where it was. */
  const release = useCallback(() => {
    if (lockedRef.current) return;
    flipFromRef.current = captureFrames();
    panelFromRef.current = panelRef.current?.getBoundingClientRect() ?? null;
    restoreRef.current = true;
    lock();
    focusTransitionTokenRef.current += 1;
    focusTransitionPendingRef.current = false;
    setFocusTransitionDone(false);
    setFocusedImageId(null);
  }, [captureFrames, lock]);

  useEffect(() => () => { if (lockTimerRef.current) clearTimeout(lockTimerRef.current); }, []);

  /* On desktop the composition covers the page, so the document is held still
     and the scrollbar width is compensated so nothing shifts. */
  useEffect(() => {
    if (!focused || mobileFocus) return;
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    root.style.setProperty("--lightbox-scrollbar-width", `${measureScrollbarWidth()}px`);
    root.setAttribute("data-lightbox-open", "true");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      root.removeAttribute("data-lightbox-open");
      root.style.removeProperty("--lightbox-scrollbar-width");
    };
  }, [focused, mobileFocus]);

  /* The destination of the current composition, whether that is the closed
     gallery or the focused one. Both transitions derive from this. */
  const destinationRects = useMemo(() => {
    if (focused && !mobileFocus) return focusLayout?.rects ?? null;
    return overview?.rects ?? null;
  }, [focused, mobileFocus, focusLayout, overview]);

  /* FLIP: the frames travel from where they are to where the new layout wants them. */
  useIsomorphicLayoutEffect(() => {
    if (restoreRef.current) {
      restoreRef.current = false;
      const anchor = anchorRef.current;
      const element = anchor ? framesRef.current.get(anchor.id) : null;
      if (anchor && element) {
        for (let attempt = 0; attempt < 3; attempt += 1) {
          const delta = element.getBoundingClientRect().top - anchor.offset;
          if (Math.abs(delta) < 0.5) break;
          window.scrollBy(0, delta);
        }
      }
    }


    const shouldCompleteFocus =
      focusTransitionPendingRef.current && !!focused && !mobileFocus;

    const transitionToken = focusTransitionTokenRef.current;
    focusTransitionPendingRef.current = false;

    const from = flipFromRef.current;
    flipFromRef.current = null;

    if (!from) {
      if (shouldCompleteFocus) setFocusTransitionDone(true);
      return;
    }

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const duration = reduce ? 0 : TRANSITION_MS;
    const leaving = !focused;


    const frameAnimations: Array<{
      element: HTMLButtonElement;
      animation: Animation;
    }> = [];

    framesRef.current.forEach((element, key) => {
      const before = from.get(key);
      if (!before) return;

      const after = element.getBoundingClientRect();
      if (after.width < 1 || after.height < 1) return;

      const dx = before.left - after.left;
      const dy = before.top - after.top;
      const scale = before.width / after.width;

      if (
        Math.abs(dx) < 0.5 &&
        Math.abs(dy) < 0.5 &&
        Math.abs(scale - 1) < 0.002
      ) return;

      // Promote only while this particular frame is moving.
      element.style.willChange = "transform";

      const animation = element.animate(
        [
          {
            transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
          },
          {
            transform: "translate(0px, 0px) scale(1)",
          },
        ],
        {
          duration,
          easing: EASING,
          fill: "both",
        }
      );

      frameAnimations.push({ element, animation });
    });

    // Always release animations and temporary GPU hints when finished.
    void Promise.all(
      frameAnimations.map(({ animation }) =>
        animation.finished.catch(() => undefined)
      )
    ).then(() => {
      for (const { element, animation } of frameAnimations) {
        animation.cancel();
        element.style.willChange = "";
      }

      if (
        shouldCompleteFocus &&
        focusTransitionTokenRef.current === transitionToken
      ) {
        setFocusTransitionDone(true);
      }
    });


    const panel = panelRef.current;
    const panelBefore = panelFromRef.current;
    panelFromRef.current = null;
    if (panel) {
      const entering = !panelSeenRef.current && !leaving;
      panelSeenRef.current = !leaving;
      const after = panel.getBoundingClientRect();
      const dx = panelBefore ? panelBefore.left - after.left : 0;
      const dy = panelBefore ? panelBefore.top - after.top : 0;
      const panelAnimation = panel.animate(
        leaving
          ? [{ opacity: 1, transform: `translate(${dx}px, ${dy}px)` }, { opacity: 0, transform: "translate(0px, 0px)" }]
          : [{ opacity: entering ? 0 : 0.6, transform: `translate(${dx}px, ${dy + (entering ? 12 : 6)}px)` }, { opacity: 1, transform: "translate(0px, 0px)" }],
        { duration: reduce ? 0 : Math.round(duration * 0.7), easing: EASING, fill: "backwards" },
      );
      void panelAnimation.finished
        .then(() => panelAnimation.cancel())
        .catch(() => undefined);
    } else {
      panelSeenRef.current = false;
    }
  }, [destinationRects, focused, mobileFocus]);

  /* While reading the overview, remember the topmost photograph so a resize
     can reflow the rows without moving the reader. Only once the gallery has
     scrolled past the top of the viewport; above it, nothing needs holding. */
  useEffect(() => {
    if (focused) return;
    let frame = 0;
    const record = () => {
      frame = 0;
      const stage = stageRef.current;
      resizeAnchorRef.current = stage && stage.getBoundingClientRect().top < 0 ? topmostVisibleFrame() : null;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(record); };
    record();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [focused, overview, topmostVisibleFrame]);

  /* A new overview geometry (resize, filter, upload) keeps that photograph
     where it was. Focus transitions restore their own anchor instead. */
  useIsomorphicLayoutEffect(() => {
    if (focused || flipFromRef.current || restoreRef.current) return;
    const anchor = resizeAnchorRef.current;
    const element = anchor ? framesRef.current.get(anchor.id) : null;
    if (!anchor || !element) return;
    const delta = element.getBoundingClientRect().top - anchor.offset;
    if (Math.abs(delta) >= 0.5) window.scrollBy(0, delta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overview]);

  /* Keyboard: the gallery loops back to the other end. */
  useEffect(() => {
    if (!focused) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); release(); return; }
      if (event.key === "ArrowLeft") { event.preventDefault(); stepFocus(-1); return; }
      if (event.key === "ArrowRight") { event.preventDefault(); stepFocus(1); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focused, release, stepFocus]);

  /* Swipe navigation, without stealing the vertical page scroll. */
  const onTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    mobileTouchRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  }, []);
  const onTouchEnd = useCallback((event: React.TouchEvent) => {
    const start = mobileTouchRef.current;
    mobileTouchRef.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy)) return;
    stepFocus(dx > 0 ? -1 : 1);
  }, [stepFocus]);

  const fields = focused ? metaFieldsFor(focused) : [];
  const panelPlacement = focusLayout && !mobileFocus ? focusLayout.panelPlacement : "below";
  const panelRect = focusLayout && !mobileFocus ? focusLayout.panel : null;

  const renderFrame = (image: GalleryImage, rect?: Rect) => (
    <button
      key={image.id}
      ref={(element) => { if (element) framesRef.current.set(image.id, element); else framesRef.current.delete(image.id); }}
      type="button"
      className="spatial-frame"
      data-key={image.id}
      data-focused={focusedImageId === image.id ? "true" : "false"}
      style={rect ? ({ left: rect.x, top: rect.y, width: rect.width, height: rect.height } as CSSProperties) : undefined}
      onClick={(event) => { event.stopPropagation(); focusImage(image.id); }}
      aria-label={`Open photograph: ${image.title}`}
    >
      <GalleryImageView
        image={image}
        highResolution={highResolutionIds.has(image.id)}
        transitionDone={focusTransitionDone}
        sizes={thumbnailSizes(rect)}
      />
    </button>
  );

  return <>
    {!preview && collections.length > 2 && <div className="filter-lit mb-5 inline-flex flex-wrap gap-1 rounded-full p-1" role="group" aria-label="Filter photographs by collection">{collections.map((item) => <button key={item} onClick={() => { setCollection(item); setFocusedImageId(null); }} aria-pressed={collection === item} className={`rounded-full px-4 py-2 text-xs transition ${collection === item ? "bg-highlight text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{item}</button>)}</div>}

    <div ref={stageRef} className="spatial-gallery-stage" style={overview ? { height: `${overview.height}px` } : undefined}>
      {mobileFocus ? <MobileFocus
        images={visibleImages}
        focused={focused!}
        layout={mobileLayout!}
        highResolutionIds={highResolutionIds}
        onSelect={focusImage}
        onClose={release}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      /> : <div
        ref={galleryRef}
        className="spatial-gallery"
        data-mode={focused ? "focus" : "grid"}
        data-ready={overview ? "true" : "false"}
        onClick={focused ? (event) => { if (event.target === event.currentTarget) release(); } : undefined}
      >
        {visibleImages.map((image) => renderFrame(image, focused && focusLayout && !mobileFocus ? focusLayout.rects.get(image.id) : overview?.rects.get(image.id)))}

        {focused && !mobileFocus && panelRect && <aside
          ref={panelRef}
          className="spatial-panel surface-lit"
          data-placement={panelPlacement}
          style={{ left: panelRect.x, top: panelRect.y, width: panelRect.width, height: panelRect.height }}
        >
          <div className="spatial-panel-head">
            <p className="meta-label text-muted-foreground">{focused?.collection} · <span className="spatial-counter" aria-live="polite">{String(focusedIndex + 1).padStart(2, "0")} / {String(visibleImages.length).padStart(2, "0")}</span></p>
            <h2 className="spatial-panel-title font-display leading-tight">{focused?.title}</h2>
          </div>
          <div className="photo-exif-grid grid gap-x-3 gap-y-1.5 text-[11px] leading-snug text-muted-foreground">
            {fields.map((field) => <div key={field.label} className="min-w-0"><p className="meta-label mb-0.5 text-muted-foreground">{field.label}</p><p className="spatial-panel-value text-foreground">{field.value}</p></div>)}
          </div>
        </aside>}

        {focused && !mobileFocus && <>
          <button type="button" onClick={() => stepFocus(-1)} disabled={locked} aria-label="Previous photograph" className="spatial-nav spatial-nav-previous surface-lit"><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => stepFocus(1)} disabled={locked} aria-label="Next photograph" className="spatial-nav spatial-nav-next surface-lit"><ArrowRight size={18} /></button>
          <button type="button" onClick={release} aria-label="Close photograph" className="spatial-close surface-lit"><X size={20} /></button>
        </>}
      </div>}
    </div>

    {preview && <div className="mt-7 flex justify-end"><a href="/photography" className="meta-label text-accent transition-colors hover:text-foreground">Enter the photography journal ↗</a></div>}
  </>;
}

function MobileFocus({ images, focused, layout, highResolutionIds, onSelect, onClose, onTouchStart, onTouchEnd }: {
  images: GalleryImage[];
  focused: GalleryImage;
  layout: ReturnType<typeof layoutFocusMobile>;
  highResolutionIds: Set<string>;
  onSelect: (id: string) => void;
  onClose: () => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
}) {
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  const stageRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(false);
  const fields = metaFieldsFor(focused);

  /* Bring the composition into view the first time it opens. */
  useEffect(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    stageRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  /* Bring the focused thumbnail into view without moving the document. */
  useEffect(() => {
    for (const row of layout.rows) {
      const element = rowRefs.current.get(row.id);
      if (!element) continue;
      const target = row.items.find((item) => item.id === focused.id);
      if (!target) continue;
      const offset = element.scrollLeft;
      const position = element.querySelector<HTMLElement>(`[data-thumb="${target.id}"]`);
      if (position) element.scrollTo({ left: offset + position.offsetLeft - element.clientWidth / 2 + position.clientWidth / 2, behavior: "smooth" });
    }
  }, [focused.id, layout.rows]);

  return <div className="spatial-mobile">
    <nav className="spatial-navigator" aria-label="Photograph navigator">
      {layout.rows.map((row) => <div key={row.id} className="spatial-navigator-row" ref={(element) => { if (element) rowRefs.current.set(row.id, element); else rowRefs.current.delete(row.id); }}>
        {row.items.map((item) => <button
          key={item.id}
          type="button"
          data-thumb={item.id}
          className="spatial-thumb-frame"
          data-focused={item.id === focused.id ? "true" : "false"}
          style={{ height: `${row.height}px`, width: `${Math.round(row.height * item.aspectRatio)}px` }}
          onClick={() => onSelect(item.id)}
          aria-label={`Open photograph: ${item.title}`}
        >
          <Image src={item.thumbnail} alt="" fill sizes="120px" className="spatial-image spatial-thumb" />
        </button>)}
      </div>)}
    </nav>

    <div className="spatial-mobile-stage" ref={stageRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {layout.previews.map((preview) => {
        const image = images.find((item) => item.id === preview.id);
        if (!image) return null;
        return <div key={preview.id} className="spatial-edge-preview" style={{ left: preview.rect.x, top: preview.rect.y, width: preview.rect.width, height: preview.rect.height }}>
          <Image src={image.thumbnail} alt="" fill sizes="200px" className="spatial-image spatial-thumb" />
        </div>;
      })}
      <div className="spatial-mobile-main" style={{ height: layout.main.height }}>
        <GalleryImageView
          image={focused}
          highResolution={highResolutionIds.has(focused.id)}
          transitionDone={true}
          sizes="100vw"
          className="object-contain"
        />
      </div>
    </div>

    <aside className="spatial-panel spatial-panel-mobile">
      <div className="spatial-panel-head">
        <p className="meta-label text-muted-foreground">{focused.collection} · <span className="spatial-counter" aria-live="polite">{String(galleryIndex(images, focused.id) + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span></p>
        <h2 className="spatial-panel-title font-display leading-tight">{focused.title}</h2>
      </div>
      <div className="photo-exif-grid grid gap-x-3 gap-y-1.5 text-[11px] leading-snug text-muted-foreground">
        {fields.map((field) => <div key={field.label} className="min-w-0"><p className="meta-label mb-0.5 text-muted-foreground">{field.label}</p><p className="spatial-panel-value text-foreground">{field.value}</p></div>)}
      </div>
    </aside>

    <button type="button" onClick={() => onSelect(neighbourIds(images, focused.id).previousId ?? focused.id)} aria-label="Previous photograph" className="spatial-nav spatial-nav-previous surface-lit"><ArrowLeft size={18} /></button>
    <button type="button" onClick={() => onSelect(neighbourIds(images, focused.id).nextId ?? focused.id)} aria-label="Next photograph" className="spatial-nav spatial-nav-next surface-lit"><ArrowRight size={18} /></button>
    <button type="button" onClick={onClose} aria-label="Close photograph" className="spatial-close surface-lit"><X size={20} /></button>
  </div>;
}
