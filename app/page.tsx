import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { CurrentlyExploring, Hero } from "@/components/sections/hero";
import { StatusBar } from "@/components/status-bar";
import { Footer } from "@/components/sections/footer";
import { photographs } from "@/lib/photography";
import { games, getGamingStats } from "@/lib/games";

function FeaturedWork() {
  return <section id="work" className="home-featured-work" aria-labelledby="featured-work-title">
    <div className="page-shell home-featured-layout">
      <div className="home-featured-copy">
        <p className="meta-label text-ruri-ink">Selected work / 01</p>
        <h2 id="featured-work-title" className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Winder</h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">Semantic desktop search Raycast extension powered by Gemini embeddings and ChromaDB. Supports text and image query modes across multimodal files using a two-phase hybrid search (BM25 + RRF).</p>
        <p className="mt-5 max-w-lg font-mono text-[11px] leading-6 text-muted-foreground">Node.js / Gemini API / ChromaDB / Raycast / TypeScript</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href="https://github.com/uveer18/winder" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-seiji-ink transition-colors hover:text-bengara-ink">GitHub <ArrowUpRight size={15}/></a>
          <Link href="/work" className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">All engineering work <ArrowUpRight size={15}/></Link>
        </div>
      </div>
      <div className="home-featured-image">
        <Image src="/images/projects/winder.webp" alt="Winder project interface" fill sizes="(max-width: 767px) 100vw, 58vw" className="object-contain object-center" />
      </div>
    </div>
  </section>;
}

function HomeFeatures() {
  return <section className="home-features" aria-label="Explore the portfolio">
    <div className="page-shell home-features-grid">
      <Link href="/work" className="home-feature home-feature-engineering group" aria-label="Explore Engineering: Systems built to hold up">
        <span className="home-feature-index meta-label">01 / Engineering</span>
        <h2 className="home-feature-heading">Systems built to hold up.</h2>
        <p className="home-feature-description">SAAB Doors · conversion-focused platform<br/>Winder · semantic desktop search</p>
        <span className="home-feature-link">Explore the work <ArrowUpRight size={16}/></span>
      </Link>
      <Link id="photography" href="/photography" className="home-feature home-feature-photography group" aria-label="Explore Photography: A way of paying attention">
        <span className="home-feature-index meta-label">02 / Photography</span>
        <h2 className="home-feature-heading">A way of paying attention.</h2>
        <p className="home-feature-description">Nature, light and the small details worth staying with.</p>
        <span className="home-feature-link">Open the journal <ArrowDownRight size={16}/></span>
      </Link>
      <Link id="games" href="/games" className="home-feature home-feature-games group" aria-label="Explore Games: Worlds worth staying in">
        <span className="home-feature-index meta-label">03 / Games</span>
        <h2 className="home-feature-heading">Worlds worth staying in.</h2>
        <p className="home-feature-description">{games.length} titles in the journal<br/>{getGamingStats().completed} completed playthroughs</p>
        <span className="home-feature-link">Visit Games <ArrowUpRight size={16}/></span>
      </Link>
    </div>
  </section>;
}

function HomeLinks() {
  return <section className="home-links" aria-label="More about Udayveer">
    <div className="page-shell home-links-inner">
      <div id="about-preview" className="home-link-item">
        <p className="meta-label text-matcha-ink">Currently</p>
        <p className="mt-2 font-display text-2xl">AI systems, backend, visual tools.</p>
        <p className="mt-2 text-sm text-muted-foreground">A short view of what I am exploring now.</p>
        <Link href="/about" className="launch-link">More about me <ArrowUpRight size={16}/></Link>
      </div>
      <div className="home-link-item">
        <p className="meta-label text-seiji-ink">A note, a project, a question</p>
        <p className="mt-2 font-display text-2xl">Let’s make something useful.</p>
        <Link href="/contact" className="launch-link">Get in touch <ArrowUpRight size={16}/></Link>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="ml-5 text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground">View résumé</a>
      </div>
    </div>
  </section>;
}

export default function Home() {
  return <><Navigation/><main className="relative min-h-screen"><Hero/><CurrentlyExploring/><FeaturedWork/><HomeFeatures/><HomeLinks/><div className="home-status"><div className="page-shell"><StatusBar/></div></div></main><Footer/></>;
}
