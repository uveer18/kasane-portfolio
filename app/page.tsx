import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/sections/hero";
import { StatusBar } from "@/components/status-bar";
import { Footer } from "@/components/sections/footer";
import { photographs } from "@/lib/photography";
import { currentlyPlaying, favouriteGames } from "@/lib/games";

function BentoLaunchpad() {
  const photo = photographs[1];
  return <section className="home-launchpad section-transition px-[var(--page-gutter)] pb-24" aria-label="Explore the portfolio">
    <div className="page-shell grid gap-4 md:grid-cols-12 md:gap-5">
      <Link id="work" href="/work" className="launch-tile group min-h-64 md:col-span-7 md:row-span-2">
        <div className="launch-copy"><span className="meta-label text-ruri-ink">01 / Engineering</span><h2 className="mt-5 max-w-lg font-display text-4xl leading-tight sm:text-5xl">Systems built to hold up.</h2><p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">SAAB Doors · conversion-focused platform<br/>Winder · semantic desktop search</p><span className="launch-link"><span>Explore the work</span><ArrowUpRight size={16}/></span></div>
        <span className="launch-rail" aria-hidden="true" />
      </Link>
      <Link id="photography" href="/photography" className="launch-photo group md:col-span-5 md:row-span-2" aria-label="Explore photography">
        <Image src={photo.src} alt={photo.alt} width={photo.width ?? 5605} height={photo.height ?? 3153} sizes="(max-width: 767px) 100vw, 42vw" className="h-auto w-full object-contain transition-opacity duration-700 group-hover:opacity-95" />
        <div className="image-caption absolute inset-x-4 bottom-4 px-4 py-3"><span className="meta-label text-kohaku-ink">02 / Photography</span><p className="mt-1 font-display text-2xl">A way of paying attention.</p><span className="mt-3 inline-flex items-center gap-2 text-xs">Open the journal <ArrowDownRight size={14}/></span></div>
      </Link>
      <div id="about-preview" className="launch-tile launch-focus md:col-span-4"><span className="meta-label text-matcha-ink">Currently</span><h2 className="mt-4 font-display text-3xl">AI systems, backend, visual tools.</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">A short view of what I am exploring now.</p><Link href="/about" className="launch-link"><span>More about me</span><ArrowUpRight size={16}/></Link></div>
      <Link id="games" href="/games" className="launch-tile launch-games group md:col-span-4"><span className="meta-label text-bengara-ink">03 / Games</span><h2 className="mt-4 font-display text-3xl">Worlds worth staying in.</h2><p className="mt-3 text-sm text-muted-foreground">Now playing: {currentlyPlaying.title}<br/>Favourite: {favouriteGames[0].title}</p><span className="launch-link"><span>Visit Games</span><ArrowUpRight size={16}/></span></Link>
      <div className="launch-tile launch-contact md:col-span-4"><span className="meta-label text-seiji-ink">A note, a project, a question</span><h2 className="mt-4 font-display text-3xl">Let’s make something useful.</h2><Link href="/contact" className="launch-link"><span>Get in touch</span><ArrowUpRight size={16}/></Link><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground">View résumé</a></div>
    </div>
  </section>;
}

export default function Home() {
  return <><Navigation/><main className="relative min-h-screen"><Hero/><BentoLaunchpad/><div className="px-[var(--page-gutter)] pb-10"><div className="page-shell"><StatusBar/></div></div></main><Footer/></>;
}
