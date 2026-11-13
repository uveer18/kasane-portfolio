"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHero } from "@/components/hero-context";
import { photographs } from "@/lib/photography";

const focusLines = [
  "Not just models, complete AI pipelines.",
  "Agentic AI systems with real-world utility.",
  "Computer vision meets creative expression.",
  "From raw data to aesthetic intelligence.",
  "Tools that critique, enhance, and create images.",
];

export function Hero() {
  const { setIsHeroVisible } = useHero();
  const photo = photographs[1];

  useEffect(() => {
    const onScroll = () => setIsHeroVisible((document.getElementById("home")?.getBoundingClientRect().bottom ?? 0) > 90);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [setIsHeroVisible]);

  return <section id="home" className="home-hero lum-field" style={{ "--lum-field-x": "16%", "--lum-field-y": "6%" } as React.CSSProperties}>
    <div className="page-shell home-hero-layout grid items-center gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-12">
      <div className="home-hero-copy relative z-10">
        <p className="meta-label mb-5 text-seiji-ink">Udayveer Singh <span className="mx-1 text-muted-foreground">/</span> IT &apos;28 @ NIT Jalandhar</p>
        <h1 className="editorial-title home-hero-title text-foreground">
          Building systems.<br/><span className="text-bengara-ink italic">Seeing things</span><br/>differently.
        </h1>
        <p className="home-hero-intro mt-5 max-w-[39rem] text-base leading-relaxed text-muted-foreground sm:text-[17px]">
          I&apos;m an Information Technology student at NIT Jalandhar, interested in AI systems, backend infrastructure and the engineering behind reliable software. Photography, music and curiosity keep me exploring beyond the screen.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href="/work" className="btn-lit inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Explore Work <ArrowUpRight size={16}/></Link>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-lit inline-flex min-h-12 items-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:border-seiji-ink hover:bg-highlight">Résumé</a>
        </div>
      </div>

      <div className="home-hero-visual relative mx-auto" role="group" aria-label="Misty Himalayan peaks framed by dark pine trees">
        <span className="hero-geometry hero-geometry-bengara" aria-hidden="true"/>
        <span className="hero-geometry hero-geometry-seiji" aria-hidden="true"/>
        <span className="hero-geometry hero-geometry-kohaku" aria-hidden="true"/>
        <div className="hero-photo-frame">
          <Image src={photo.src} alt={photo.alt} fill priority sizes="(max-width: 1023px) 90vw, 42vw" className="object-cover" />
        </div>
        <div className="hero-image-caption surface-lit"><p className="meta-label text-muted-foreground">KASANE / 01</p><p className="mt-2 font-display text-xl leading-tight text-foreground sm:text-2xl">Build with care.<br/>Look a little closer.</p></div>
      </div>
    </div>
  </section>;
}

export function CurrentlyExploring() {
  const [focusText, setFocusText] = useState(focusLines[0]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let timer: number | undefined;
    let currentIndex = 0;
    let currentText = focusLines[0];
    const wait = (duration: number) => new Promise<void>((resolve) => { timer = window.setTimeout(resolve, duration); });
    const typeNextLine = async () => {
      await wait(3600);
      if (cancelled) return;
      const nextIndex = (currentIndex + 1) % focusLines.length;
      const nextText = focusLines[nextIndex];
      let sharedLength = 0;
      while (sharedLength < currentText.length && sharedLength < nextText.length && currentText[sharedLength] === nextText[sharedLength]) sharedLength += 1;
      setIsTyping(true);
      while (currentText.length > sharedLength) { if (cancelled) return; currentText = currentText.slice(0, -1); setFocusText(currentText); await wait(12); }
      while (currentText.length < nextText.length) { if (cancelled) return; currentText = nextText.slice(0, currentText.length + 1); setFocusText(currentText); await wait(26); }
      currentIndex = nextIndex;
      setIsTyping(false);
      void typeNextLine();
    };
    void typeNextLine();
    return () => { cancelled = true; if (timer) window.clearTimeout(timer); };
  }, []);

  return <section className="home-currently" aria-label="Currently exploring">
    <div className="page-shell home-currently-inner">
      <p className="meta-label text-muted-foreground">Currently exploring</p>
      <p aria-live="off" className="home-currently-focus font-display text-xl text-foreground sm:text-2xl">{focusText}{isTyping && <motion.span aria-hidden="true" className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-seiji" animate={{ opacity: [.25, 1, .25] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}/>}</p>
      <p className="home-currently-tags meta-label text-muted-foreground">AI systems <span>/</span> Backend infrastructure <span>/</span> Visual tools</p>
    </div>
  </section>;
}
