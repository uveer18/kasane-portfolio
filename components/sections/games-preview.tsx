import Link from "next/link";
import { ArrowUpRight, Gamepad2 } from "lucide-react";

export function GamesPreview() {
  return (
    <section id="games" className="px-[var(--page-gutter)] py-24 md:py-32">
      <div className="page-shell grid gap-8 border-y border-border py-10 md:grid-cols-[.75fr_1.25fr] md:items-center md:py-14">
        <div>
          <p className="meta-label mb-4 text-accent">Off the clock · 03</p>
          <h2 className="editorial-title text-4xl sm:text-5xl">A shelf for games.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">A personal gaming journal for the worlds, stories and mechanics that stay with me.</p>
        </div>
        <Link href="/games" className="card-lit group relative flex min-h-48 items-center justify-between overflow-hidden rounded-2xl border px-7 py-8 transition-colors hover:border-accent/60 sm:px-10">
          <div className="absolute -right-8 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,var(--lum-glow),transparent_72%)]" />
          <div className="relative flex items-center gap-5">
            <span className="surface-lit flex h-14 w-14 items-center justify-center rounded-full text-accent"><Gamepad2 size={24} /></span>
            <div>
              <p className="meta-label text-muted-foreground">Currently playing</p>
              <p className="mt-1 font-display text-2xl">[Add a game]</p>
              <p className="mt-1 text-xs text-muted-foreground">Platform and your note can be added later</p>
            </div>
          </div>
          <ArrowUpRight className="relative text-muted-foreground transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
        </Link>
      </div>
    </section>
  );
}
