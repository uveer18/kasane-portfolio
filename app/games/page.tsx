import type { Metadata } from "next";
import { SiteFrame } from "@/components/layout/site-frame";
import { GamesJournal } from "@/components/games/games-journal";

export const metadata: Metadata = {
  title: "Games — Udayveer Singh",
  description:
    "A personal gaming archive of playthroughs, ratings, and moments worth keeping.",
};

export default function GamesPage() {
  return <SiteFrame><GamesJournal /></SiteFrame>;
}
