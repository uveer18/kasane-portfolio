import type { Metadata } from "next";
import { Gamepad2 } from "lucide-react";
import { SiteFrame } from "@/components/layout/site-frame";
import { currentlyPlaying, favouriteGames, recentlyPlayed } from "@/lib/games";

export const metadata: Metadata = { title: "Games — Udayveer Singh", description: "A personal journal of games, stories, and mechanics that stay with Udayveer Singh." };

export default function GamesPage() {
  return <SiteFrame><main className="px-[var(--page-gutter)] pb-12 pt-32 sm:pt-40"><div className="page-shell">
    <p className="meta-label mb-5 text-bengara">Personal journal / 03</p><h1 className="editorial-title max-w-4xl text-[clamp(3.5rem,8vw,7rem)]">Worlds worth staying in.</h1><p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">A place for the worlds I return to, the stories that linger and the small details of play worth remembering.</p>
    <section className="section-ruri relative mt-16 overflow-hidden p-6 sm:p-10"><span className="absolute -right-8 -top-12 h-64 w-64 rounded-full bg-kohaku/20 blur-3xl"/><div className="relative grid items-end gap-8 md:grid-cols-[1fr_auto]"><div><span className="glass inline-flex h-12 w-12 items-center justify-center rounded-full text-foreground"><Gamepad2 size={21}/></span><p className="meta-label mt-7 text-kohaku">Currently playing / 01</p><h2 className="mt-3 font-display text-4xl sm:text-6xl">{currentlyPlaying.title}</h2><p className="mt-4 max-w-lg text-sm text-muted-foreground">{currentlyPlaying.note}</p></div><dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:min-w-56"><div><dt className="meta-label text-muted-foreground">Platform</dt><dd className="mt-1">{currentlyPlaying.platform}</dd></div><div><dt className="meta-label text-muted-foreground">Status</dt><dd className="mt-1">{currentlyPlaying.status}</dd></div></dl></div></section>
    <section className="mt-16 grid gap-14 border-t border-border pt-7 md:grid-cols-2">
      <div><div className="mb-6 flex items-center justify-between"><h2 className="section-heading text-3xl sm:text-4xl">All-time favourites</h2><span className="meta-label text-kohaku">Collection</span></div><ol>{favouriteGames.map((game, index) => <li key={`${game.title}-${index}`} className="flex items-center gap-4 border-b border-border py-5"><span className="font-display text-3xl text-bengara">0{index + 1}</span><div><p className="font-medium">{game.title}</p><p className="mt-1 text-xs text-muted-foreground">{game.platform} | {game.note}</p></div></li>)}</ol></div>
      <div><div className="mb-6 flex items-center justify-between"><h2 className="section-heading text-3xl sm:text-4xl">Recently played</h2><span className="meta-label text-ruri">Journal</span></div><ol>{recentlyPlayed.map((game, index) => <li key={`${game.title}-${index}`} className="grid grid-cols-[4rem_1fr_auto] items-center gap-4 border-b border-border py-5"><span className="meta-label text-muted-foreground">{game.playedAt}</span><div><p className="font-medium">{game.title}</p><p className="mt-1 text-xs text-muted-foreground">{game.platform}</p></div><span className="text-xs text-muted-foreground">{game.completion}</span></li>)}</ol></div>
    </section>
    <section className="mt-16 border-t border-border py-8"><p className="meta-label text-matcha">Notes</p><h2 className="mt-3 font-display text-3xl">Moments to remember</h2><p className="mt-3 max-w-lg text-sm text-muted-foreground">{currentlyPlaying.note}</p></section>
  </div></main></SiteFrame>;
}
