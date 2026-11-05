"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { photographs, type Photograph } from "@/lib/photography";

function PhotoLightbox({ photos, photoIndex, onClose, onChange }: { photos: Photograph[]; photoIndex: number; onClose: () => void; onChange: (index: number) => void }) {
  const photo = photos[photoIndex];
  const [zoomed, setZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const change = useCallback((direction: number) => { setZoomed(false); onChange((photoIndex + direction + photos.length) % photos.length); }, [onChange, photoIndex, photos.length]);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") change(-1);
      if (event.key === "ArrowRight") change(1);
      if (event.key === "+" || event.key === "=") setZoomed(true);
      if (event.key === "-") setZoomed(false);
      if (event.key === "Tab") {
        const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex='-1'])") ?? []).filter((element) => element.getClientRects().length > 0);
        if (!focusable.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener("keydown", keydown); previousFocus.current?.focus(); };
  }, [change, onClose]);

  return <motion.div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`Photograph: ${photo.title}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/88 p-3 backdrop-blur-md sm:p-7" onClick={onClose} onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)} onTouchEnd={(event) => { if (touchStart === null) return; const distance = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart; if (Math.abs(distance) > 55) change(distance > 0 ? -1 : 1); setTouchStart(null); }}>
    <div className="lightbox-blur pointer-events-none fixed inset-0 opacity-30"/>
    <button ref={closeRef} onClick={onClose} aria-label="Close photograph" className="glass absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full text-foreground sm:right-7 sm:top-7"><X size={20}/></button>
    <button onClick={(event) => { event.stopPropagation(); change(-1); }} aria-label="Previous photograph" className="glass absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-foreground md:flex"><ArrowLeft size={18}/></button>
    <div className="relative flex h-full w-full max-w-7xl flex-col items-center justify-center gap-3 sm:gap-5" onClick={(event) => event.stopPropagation()}>
      <div className="relative min-h-0 flex-1 w-full overflow-auto">
        <Image src={photo.src} alt={photo.alt} width={photo.width ?? 1600} height={photo.height ?? 1200} priority sizes="100vw" onClick={() => setZoomed((value) => !value)} className={`mx-auto h-auto max-h-full w-auto max-w-full cursor-zoom-in object-contain transition-transform duration-300 ${zoomed ? "scale-[1.35] cursor-zoom-out" : ""}`}/>
      </div>
      <aside className="lightbox-metadata glass z-10 max-h-40 w-full max-w-3xl rounded-t-2xl px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 text-foreground sm:max-h-[65vh] sm:rounded-xl sm:p-4 sm:absolute sm:bottom-5 sm:left-5 sm:w-[min(350px,calc(100%-2.5rem))]">
        <p className="meta-label text-muted-foreground">{photo.collection ?? "[ADD PHOTO COLLECTION]"} · {String(photoIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</p>
        <h2 className="mt-2 font-display text-2xl leading-tight">{photo.title}</h2>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-muted-foreground"><span>Camera · {photo.camera ?? "[ADD CAMERA]"}</span><span>Lens · {photo.lens ?? "[ADD LENS]"}</span><span>Exposure · {[photo.focalLength ?? "[ADD FOCAL LENGTH]", photo.aperture ?? "[ADD APERTURE]"].join(" · ")}</span><span>ISO · {photo.iso ?? "[ADD ISO]"}</span><span>Date · {photo.captureDate ?? "[ADD CAPTURE DATE]"}</span><span>Location · {photo.location ?? "[ADD LOCATION]"}</span></div>
        <p className="mt-3 border-t border-border pt-2 text-[11px] text-muted-foreground">Use ← → to browse · Esc to close · tap image to zoom</p>
      </aside>
      <button onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? "Fit photograph to screen" : "Zoom photograph"} className="glass absolute bottom-[calc(env(safe-area-inset-bottom)+10.5rem)] right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full text-foreground sm:bottom-6 sm:right-6"><Expand size={17}/></button>
    </div>
    <button onClick={(event) => { event.stopPropagation(); change(1); }} aria-label="Next photograph" className="glass absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-foreground md:flex"><ArrowRight size={18}/></button>
  </motion.div>;
}

function PhotoItem({ photo, index, onSelect }: { photo: Photograph; index: number; onSelect: () => void }) {
  const spans = [7, 5, 5, 4, 4, 4];
  return <motion.button layout onClick={onSelect} aria-label={`Open photograph: ${photo.title}`} style={{ gridColumn: `span ${spans[index] ?? 6}` }} className="edge-fade group relative block w-full overflow-hidden bg-[var(--page-alt)] text-left">
    <Image src={photo.thumbnail ?? photo.src} alt={photo.alt} width={photo.width ?? 1600} height={photo.height ?? 1200} sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 60vw" className="relative z-0 block h-auto w-full object-contain"/>
    <div className="image-caption absolute inset-x-3 bottom-3 translate-y-2 px-3 py-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:inset-x-4 sm:bottom-4"><span className="meta-label text-accent">{photo.collection ?? "[ADD PHOTO COLLECTION]"}</span><p className="mt-1 font-display text-lg text-foreground">{photo.title}</p></div>
    <span className="floating-control absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] text-foreground">{String(index + 1).padStart(2, "0")}</span>
  </motion.button>;
}

export function PhotoGallery({ preview = false }: { preview?: boolean }) {
  const [photos, setPhotos] = useState(photographs);
  const [selected, setSelected] = useState<number | null>(null);
  const [collection, setCollection] = useState("All photographs");
  const close = useCallback(() => setSelected(null), []);
  const change = useCallback((index: number) => setSelected(index), []);
  useEffect(() => {
    let active = true;
    fetch("/api/photography/photos").then((response) => response.json()).then((result: { photos?: Photograph[] }) => { if (active && result.photos?.length) setPhotos((current) => [...current, ...result.photos!]); }).catch(() => undefined);
    const onAdded = (event: Event) => { const photo = (event as CustomEvent<Photograph>).detail; if (photo) setPhotos((current) => [photo, ...current]); };
    window.addEventListener("photograph-added", onAdded);
    return () => { active = false; window.removeEventListener("photograph-added", onAdded); };
  }, []);
  const collections = ["All photographs", ...Array.from(new Set(photos.map((photo) => photo.collection).filter((value): value is string => Boolean(value))))];
  const visiblePhotos = collection === "All photographs" ? photos : photos.filter((photo) => photo.collection === collection);
  return <>
    {!preview && collections.length > 2 && <div className="project-filter-glass mb-5 inline-flex flex-wrap gap-1 rounded-full p-1" role="group" aria-label="Filter photographs by collection">{collections.map((item) => <button key={item} onClick={() => { setCollection(item); setSelected(null); }} aria-pressed={collection === item} className={`rounded-full px-4 py-2 text-xs transition ${collection === item ? "bg-highlight text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{item}</button>)}</div>}
    <div className="photo-grid grid grid-cols-1 items-start gap-4 sm:grid-cols-2 md:grid-cols-12 md:gap-5">{visiblePhotos.map((photo, index) => <PhotoItem key={`${photo.src}-${index}`} photo={photo} index={index} onSelect={() => setSelected(index)}/>)}</div>
    {preview && <div className="mt-7 flex justify-end"><a href="/photography" className="meta-label text-accent transition-colors hover:text-foreground">Enter the photography journal ↗</a></div>}
    <AnimatePresence>{selected !== null && <PhotoLightbox key={selected} photos={visiblePhotos} photoIndex={selected} onClose={close} onChange={change}/>}</AnimatePresence>
  </>;
}
