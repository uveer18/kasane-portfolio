"use client";

import { useMemo, useState } from "react";
import { GamingHero } from "./gaming-hero";
import { GameCollection } from "./game-collection";
import { GameDetail } from "./game-detail";
import { getGamingStats, type GameEntry } from "@/lib/games";

export function GamesJournal() {
  const stats = useMemo(() => getGamingStats(), []);
  const [selected, setSelected] = useState<GameEntry | null>(null);

  const averageLabel =
    stats.averageRating !== null ? `${stats.averageRating.toFixed(1)}/10` : "—";

  return (
    <main className="arc-surface">
      <GamingHero stats={stats} averageLabel={averageLabel} />

      <GameCollection onOpen={setSelected} />

      <GameDetail game={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
