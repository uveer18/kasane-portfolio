"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHero } from "@/components/hero-context";

const focusLines = ["Agentic AI systems with real-world utility", "Computer vision meets creative expression", "From raw data to aesthetic intelligence", "Tools that critique, enhance, and create images", "Not just models, complete AI pipelines"];
const rotatingItems = ["Building AI That Thinks & Acts", "IT '28 @ NIT Jalandhar", "View Projects"];

export function Hero() {
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [focusText, setFocusText] = useState(focusLines[0]);
  const [isTyping, setIsTyping] = useState(false);
  const { setIsHeroVisible } = useHero();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rotate = reduced ? undefined : window.setInterval(() => setRotatingIndex((index) => (index + 1) % rotatingItems.length), 4000);
    const onScroll = () => setIsHeroVisible((document.getElementById("home")?.getBoundingClientRect().bottom ?? 0) > 90);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => { if (rotate) window.clearInterval(rotate); window.removeEventListener("scroll", onScroll); };
  }, [setIsHeroVisible]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let timer: number | undefined;
    let currentIndex = 0;
    let currentText = focusLines[0];
    const wait = (duration: number) => new Promise<void>((resolve) => { timer = window.setTimeout(resolve, duration); });
    const typeNextLine = async () => {
      await wait(3500);
      if (cancelled) return;
      const nextIndex = (currentIndex + 1) % focusLines.length;
      const nextText = focusLines[nextIndex];
      let commonLength = 0;
      while (commonLength < currentText.length && commonLength < nextText.length && currentText[commonLength] === nextText[commonLength]) commonLength += 1;
      setIsTyping(true);
      while (currentText.length > commonLength) { if (cancelled) return; currentText = currentText.slice(0, -1); setFocusText(currentText); await wait(14); }
      while (currentText.length < nextText.length) { if (cancelled) return; currentText = nextText.slice(0, currentText.length + 1); setFocusText(currentText); await wait(30); }
      currentIndex = nextIndex;
      setIsTyping(false);
      void typeNextLine();
    };
    void typeNextLine();
    return () => { cancelled = true; if (timer) window.clearTimeout(timer); };
  }, []);

  return <section id="home" className="relative flex min-h-[82svh] items-center overflow-hidden px-[var(--page-gutter)] pb-16 pt-28 sm:pt-32">
    <div className="page-shell grid w-full items-center gap-8 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
      <div className="relative z-10 max-w-3xl">
        <div className="meta-label mb-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-seiji-ink"><span>Udayveer Singh</span><span aria-hidden="true">/</span><AnimatePresence mode="wait"><motion.span key={rotatingIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .2 }}>{rotatingIndex === 2 ? <Link href="/work" className="inline-flex items-center gap-1 underline underline-offset-4">{rotatingItems[rotatingIndex]} <ArrowUpRight size={12}/></Link> : rotatingItems[rotatingIndex]}</motion.span></AnimatePresence></div>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="meta-label mb-5 flex items-center gap-3 text-ruri"><span className="h-px w-8 bg-ruri"/>Aspiring Agentic AI Systems Engineer / Information Technology / NIT Jalandhar / Class of 2028</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }} className="editorial-title text-[clamp(3.5rem,8.5vw,7.8rem)] leading-[.9] text-foreground">Building systems.<br/><span className="text-bengara-ink">Seeing things</span><br/>differently.</motion.h1>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }} className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">I&apos;m an Information Technology student at NIT Jalandhar, interested in AI systems, backend infrastructure and the engineering behind reliable software. Photography, music and curiosity keep me exploring beyond the screen.</motion.p>
        <div className="mt-7 flex min-h-7 items-center gap-3 text-sm text-foreground/80"><span className="meta-label shrink-0 text-muted-foreground">Currently exploring</span><span aria-live="off" className="border-b border-seiji-ink/50 pb-1">{focusText}{isTyping && <motion.span aria-hidden="true" className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-foreground" animate={{ opacity: [.3, 1, .3] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}/>}</span></div>
        <div className="mt-9 flex flex-wrap items-center gap-3"><Link href="/work" className="inline-flex items-center gap-2 rounded-full bg-seiji-ink px-5 py-3 text-sm font-medium text-on-accent transition hover:bg-bengara-ink">Work <ArrowUpRight size={16}/></Link><Link href="/photography" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm transition hover:border-seiji-ink hover:text-seiji-ink">Photography <ArrowUpRight size={16}/></Link><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="px-3 py-3 text-sm text-muted-foreground underline decoration-border underline-offset-4 transition hover:text-foreground">Resume</a></div>
        <div className="mt-12 flex flex-wrap gap-x-7 gap-y-2 text-xs text-muted-foreground"><span className="text-foreground">AI systems meet visual storytelling.</span><span><span className="text-foreground">Engineering focus</span> / Agentic AI, backend systems</span><span><span className="text-foreground">Personal practice</span> / Photography, guitar</span></div>
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .2 }} className="hero-colorfield relative hidden min-h-[360px] lg:block" aria-hidden="true"><span className="hero-field hero-field-seiji"/><span className="hero-field hero-field-bengara"/><span className="hero-field hero-field-kohaku"/><div className="hero-field-note"><p className="meta-label">KASANE / 01</p><p className="mt-2 font-display text-2xl">Build with care.<br/>Look a little closer.</p></div></motion.div>
    </div>
    <a href="#work" className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[.18em] text-muted-foreground transition-colors hover:text-seiji-ink"><span>Scroll to explore</span><ArrowDown size={13} className="animate-bounce"/></a>
  </section>;
}
