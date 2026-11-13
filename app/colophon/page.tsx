import type { Metadata } from "next";
import Image from "next/image";
import { ColorLab, TypographyLab } from "@/components/colophon/labs";
import { SiteFrame } from "@/components/layout/site-frame";
import { placeholders } from "@/lib/placeholders";

export const metadata: Metadata = { title: "Colophon — Udayveer Singh", description: "A study in colour, light and structure: notes on the design decisions behind this portfolio." };

const stages = [
  ["Observation", "Collecting references and noticing what holds attention."],
  ["Colour", "Building a palette with clear interface roles and cultural inspiration."],
  ["Typography", "Giving editorial, engineering, metadata, and Japanese text their own voices."],
  ["Composition", "Letting actual image proportions and whitespace set the rhythm."],
  ["Layering", "Using light at boundaries to create depth while leaving text clear."],
  ["Implementation", "Bringing the system into React and reusable CSS tokens."],
  ["Iteration", "Refining contrast, motion, content flow, and responsive behaviour."],
];
const references = [
  { name: "Nuevo.Tokyo", href: "https://www.nuevo.tokyo/photo", note: "Image-first pacing, varied image proportions, and quiet captions." },
  { name: "Anup Tiwari", href: "https://www.anuptiwari.me/", note: "Simple navigation and direct project presentation." },
  { name: "Xevrion", href: "https://xevrion.dev/", note: "Distinct personal identity and grounded technical detail." },
  { name: "Mohith", href: "https://www.mohith.xyz/#top", note: "Professional engineering hierarchy and case-study direction." },
  { name: "Rishi Ahuja", href: "https://rishia.in/", note: "Clear structure for academic and engineering information." },
];

export default function ColophonPage() {
  return <SiteFrame><main className="pb-12 pt-32 sm:pt-40">
    <section className="px-[var(--page-gutter)]"><div className="page-shell grid items-end gap-9 md:grid-cols-[1.2fr_.8fr]">
      <div><p className="meta-label mb-5 text-bengara">KASANE / design notes</p><h1 className="editorial-title max-w-4xl text-[clamp(3rem,7.2vw,6.8rem)] leading-[.92]">A study in colour,<br/>light and structure.</h1><p className="mt-6 max-w-xl text-base text-muted-foreground">An exploration of the decisions, references and processes behind this digital space.</p></div>
      <div className="relative"><Image src="/images/gallery/10.jpg" alt="Nature photograph captured on December 28, 2025" width={4000} height={6000} sizes="(max-width: 768px) 90vw, 35vw" className="h-auto w-full object-contain"/></div>
    </div></section>

    <section className="section-transition section-paper mt-24 px-[var(--page-gutter)] py-16"><div className="page-shell grid gap-8 md:grid-cols-[.7fr_1.3fr]"><p className="meta-label text-seiji-ink">01 / Design philosophy</p><div><h2 className="font-display text-4xl sm:text-5xl">KASANE <span className="font-japanese text-3xl text-seiji-ink">{"重ね"}</span></h2><div className="mt-5 grid gap-5 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2"><p>Kasane means layering. Here it describes how a photograph, a field of colour, and the interface can sit together without flattening into one surface. Light falls at edges and transitions; text stays clear.</p><p>Engineering and photography have different rhythms. Engineering uses Geist, precise labels, and structured information. Photography uses large image fields, Newsreader, and open spacing. A shared palette connects them.</p><p>Japanese colour names are a source of tonal inspiration. Their cultural history is distinct from the digital contrast calculations used for this interface.</p><p>{placeholders.personalNote}</p></div></div></div></section>

    <section className="px-[var(--page-gutter)] py-16"><div className="page-shell"><p className="meta-label mb-4 text-bengara">02 / Colour laboratory</p><h2 className="section-heading mb-8">Nine tones, one atmosphere.</h2><ColorLab/></div></section>

    <section className="section-transition section-matcha px-[var(--page-gutter)] py-16"><div className="page-shell"><p className="meta-label mb-4 text-matcha">03 / Typography laboratory</p><h2 className="section-heading mb-8">Four voices.</h2><TypographyLab/></div></section>

    <section className="px-[var(--page-gutter)] py-16"><div className="page-shell grid gap-8 md:grid-cols-[.7fr_1.3fr]"><div><p className="meta-label mb-4 text-kohaku">04 / Photography process</p><h2 className="section-heading">Making the frame.</h2><p className="mt-5 text-sm leading-relaxed text-muted-foreground">The camera and lenses below are part of the current kit. Per-image settings, locations, and editing notes will be added from capture records rather than guessed.</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="border-t border-border py-4"><p className="meta-label text-muted-foreground">Camera</p><p className="mt-2 font-display text-2xl">Sony A7 II</p></div><div className="border-t border-border py-4"><p className="meta-label text-muted-foreground">Lenses</p><p className="mt-2 font-display text-2xl">Sony FE 28–70mm<br/>Tamron 70–300mm</p></div><div className="border-t border-border py-4"><p className="meta-label text-muted-foreground">Composition, exposure, colour grading, post-processing</p><p className="mt-2 text-sm text-muted-foreground">{placeholders.photoWorkflow}</p></div><div className="border-t border-border py-4"><p className="meta-label text-muted-foreground">Astrophotography stacking</p><p className="mt-2 text-sm text-muted-foreground">{placeholders.astroWorkflow}</p></div></div></div></section>

    <section className="section-transition section-ruri px-[var(--page-gutter)] py-16"><div className="page-shell"><p className="meta-label mb-4 text-kohaku">05 / Design process</p><h2 className="section-heading mb-9">From looking to making.</h2><ol className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">{stages.map(([stage, description], index) => <li key={stage} className="bg-background p-5"><span className="meta-label text-bengara-ink">0{index + 1}</span><h3 className="mt-5 font-display text-2xl">{stage}</h3><p className="mt-2 text-xs text-muted-foreground">{description}</p></li>)}</ol></div></section>

    <section className="px-[var(--page-gutter)] py-16"><div className="page-shell"><p className="meta-label mb-4 text-seiji-ink">06 / Reference wall</p><h2 className="section-heading mb-8">Useful points of view.</h2><div className="grid gap-x-8 md:grid-cols-2">{references.map((reference, index) => <a key={reference.name} href={reference.href} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-5 border-t border-border py-5"><span className="meta-label pt-1 text-muted-foreground">0{index + 1}</span><span className="flex-1"><span className="font-display text-2xl group-hover:text-seiji-ink">{reference.name}</span><span className="mt-1 block text-sm text-muted-foreground">{reference.note}</span></span><span aria-hidden="true" className="text-muted-foreground transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-seiji-ink">↗</span></a>)}</div></div></section>
  </main></SiteFrame>;
}
