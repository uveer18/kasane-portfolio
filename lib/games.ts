// ---------------------------------------------------------------------------
// Gaming Journal — Data Layer
// ---------------------------------------------------------------------------

// ── Status & Sort types ─────────────────────────────────────────────────────

export const GAME_STATUSES = [
  "Completed",
  "Currently Playing",
  "On Hold",
  "Dropped",
] as const;

export type GameStatus = (typeof GAME_STATUSES)[number];

export type SortOption =
  | "newest"
  | "oldest"
  | "highest-rated"
  | "lowest-rated"
  | "alphabetical";

// ── Sub-record types ────────────────────────────────────────────────────────

export type HardestBoss = {
  name: string;
  difficultyRating: number; // 1–10
  explanation: string | null;
};

export type MostDeaths = {
  encounter: string;
  deaths: number;
  notes: string | null;
};

export type FavouriteBoss = {
  name: string;
  explanation: string | null;
};

export type MemorableMoment = {
  image: string | null; // user-uploaded path
  title: string;
  description: string | null;
  order: number | null; // chronological / progression order
};

// ── Game entry ──────────────────────────────────────────────────────────────

export type GameEntry = {
  id: string;
  title: string;
  rating: number | null;
  startDate: string; // ISO-ish human date, stored as YYYY-MM-DD
  endDate: string | null;
  status: GameStatus;
  artwork: string;
  /** Official key art / store artwork, served locally from /public/games. */
  artworkPosition: string; // object-position used to keep the subject in frame
  accent: string; // colour sampled from the artwork
  developer: string;
  publisher: string | null;
  genre: string;
  hardestBosses: HardestBoss[];
  mostDeaths: MostDeaths[];
  favouriteBoss: FavouriteBoss | null;
  memorableMoments: MemorableMoment[];
  favouriteWeapon: string | null;
  favouriteLocation: string | null;
  mostFrustratingEncounter: string | null;
  favouriteSoundtrack: string | null;
  difficulty: number | null; // 1–10
  replayability: number | null; // 1–10
  personalReview: string | null;
};

// ── Game library ────────────────────────────────────────────────────────────

export const games: GameEntry[] = [
  {
    id: "sekiro",
    title: "Sekiro: Shadows Die Twice",
    rating: 9.5,
    startDate: "2025-10-15",
    endDate: "2025-12-17",
    status: "Completed",
    artwork: "/games/sekiro.jpg",
    artworkPosition: "38% 42%",
    accent: "#B4633F",
    developer: "FromSoftware",
    publisher: "Activision",
    genre: "Action adventure",
    hardestBosses: [],
    mostDeaths: [],
    favouriteBoss: null,
    memorableMoments: [],
    favouriteWeapon: null,
    favouriteLocation: null,
    mostFrustratingEncounter: null,
    favouriteSoundtrack: null,
    difficulty: null,
    replayability: null,
    personalReview: null,
  },
  {
    id: "ghost-of-tsushima",
    title: "Ghost of Tsushima",
    rating: 9,
    startDate: "2026-04-17",
    endDate: "2026-05-17",
    status: "Completed",
    artwork: "/games/ghost.jpg",
    artworkPosition: "48% 38%",
    accent: "#A58B62",
    developer: "Sucker Punch Productions",
    publisher: "Sony Interactive Entertainment / PlayStation Studios",
    genre: "Open-world action adventure",
    hardestBosses: [],
    mostDeaths: [],
    favouriteBoss: null,
    memorableMoments: [],
    favouriteWeapon: null,
    favouriteLocation: null,
    mostFrustratingEncounter: null,
    favouriteSoundtrack: null,
    difficulty: null,
    replayability: null,
    personalReview: null,
  },
  {
    id: "black-myth-wukong",
    title: "Black Myth: Wukong",
    rating: 9.2,
    startDate: "2026-05-20",
    endDate: "2026-07-27",
    status: "Completed",
    artwork: "/games/wukong.jpg",
    artworkPosition: "70% 28%",
    accent: "#A58B62",
    developer: "Game Science",
    publisher: "Tencent Games / Hero Games",
    genre: "Mythological action RPG",
    hardestBosses: [],
    mostDeaths: [],
    favouriteBoss: null,
    memorableMoments: [],
    favouriteWeapon: null,
    favouriteLocation: null,
    mostFrustratingEncounter: null,
    favouriteSoundtrack: null,
    difficulty: null,
    replayability: null,
    personalReview: null,
  },
  {
    id: "cyberpunk-2077-phantom-liberty",
    title: "Cyberpunk 2077: Phantom Liberty",
    rating: null,
    startDate: "2026-02-23",
    endDate: null,
    status: "On Hold",
    artwork: "/games/cyberpunk.jpg",
    artworkPosition: "76% 50%",
    accent: "#4E9AA6",
    developer: "CD Projekt Red",
    publisher: "CD PROJEKT RED",
    genre: "Spy-thriller RPG expansion",
    hardestBosses: [],
    mostDeaths: [],
    favouriteBoss: null,
    memorableMoments: [],
    favouriteWeapon: null,
    favouriteLocation: null,
    mostFrustratingEncounter: null,
    favouriteSoundtrack: null,
    difficulty: null,
    replayability: null,
    personalReview: null,
  },
  {
    id: "elden-ring-nightreign",
    title: "Elden Ring: Nightreign",
    rating: 8.5,
    startDate: "2026-08-03",
    endDate: null,
    status: "On Hold",
    artwork: "/games/nightreign.jpg",
    artworkPosition: "50% 42%",
    accent: "#6E7BB5",
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    genre: "Co-op action survival",
    hardestBosses: [],
    mostDeaths: [],
    favouriteBoss: null,
    memorableMoments: [],
    favouriteWeapon: null,
    favouriteLocation: null,
    mostFrustratingEncounter: null,
    favouriteSoundtrack: null,
    difficulty: null,
    replayability: null,
    personalReview: null,
  },
  {
    id: "mortal-shell-2",
    title: "Mortal Shell 2",
    rating: 7,
    startDate: "2026-09-19",
    endDate: null,
    status: "Dropped",
    artwork: "/games/mortalshell.jpg",
    artworkPosition: "50% 50%",
    accent: "#6F7F63",
    developer: "Cold Symmetry",
    publisher: "Playstack",
    genre: "Soulslike action RPG",
    hardestBosses: [],
    mostDeaths: [],
    favouriteBoss: null,
    memorableMoments: [],
    favouriteWeapon: null,
    favouriteLocation: null,
    mostFrustratingEncounter: null,
    favouriteSoundtrack: null,
    difficulty: null,
    replayability: null,
    personalReview: null,
  },
  {
    id: "cod-mw4",
    title: "Call of Duty: Modern Warfare 4",
    rating: 8.5,
    startDate: "2026-10-25",
    endDate: null,
    status: "On Hold",
    artwork: "/games/cod.jpg",
    artworkPosition: "48% 42%",
    accent: "#8C8578",
    developer: "Infinity Ward",
    publisher: "Activision",
    genre: "First-person shooter",
    hardestBosses: [],
    mostDeaths: [],
    favouriteBoss: null,
    memorableMoments: [],
    favouriteWeapon: null,
    favouriteLocation: null,
    mostFrustratingEncounter: null,
    favouriteSoundtrack: null,
    difficulty: null,
    replayability: null,
    personalReview: null,
  },
  {
    id: "onimusha-way-of-the-sword",
    title: "Onimusha: Way of the Sword",
    rating: 10,
    startDate: "2026-11-01",
    endDate: "2026-11-12",
    status: "Completed",
    artwork: "/games/onimusha.jpg",
    artworkPosition: "40% 45%",
    accent: "#A44735",
    developer: "Capcom",
    publisher: "Capcom",
    genre: "Dark fantasy action, sword combat",
    hardestBosses: [],
    mostDeaths: [],
    favouriteBoss: null,
    memorableMoments: [],
    favouriteWeapon: null,
    favouriteLocation: null,
    mostFrustratingEncounter: null,
    favouriteSoundtrack: null,
    difficulty: null,
    replayability: null,
    personalReview: null,
  },
];

// ── Helper functions ────────────────────────────────────────────────────────

export function getGameById(id: string): GameEntry | undefined {
  return games.find((g) => g.id === id);
}

export function getGamesByStatus(status: GameStatus): GameEntry[] {
  return games.filter((g) => g.status === status);
}

export function searchGames(query: string): GameEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return games;
  return games.filter((g) => g.title.toLowerCase().includes(q));
}

export function sortGames(list: GameEntry[], sortBy: SortOption): GameEntry[] {
  const sorted = [...list];
  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    case "highest-rated":
      return sorted.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    case "lowest-rated":
      return sorted.sort((a, b) => (a.rating ?? 11) - (b.rating ?? 11));
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

// ── Stats ───────────────────────────────────────────────────────────────────

export type GamingStats = {
  totalGames: number;
  completed: number;
  onHold: number;
  currentlyPlaying: number;
  dropped: number;
  averageRating: number | null;
  highestRatedGame: GameEntry | null;
  totalCompletedDurationDays: number;
};

export function getGamingStats(): GamingStats {
  const completed = games.filter((g) => g.status === "Completed");
  const onHold = games.filter((g) => g.status === "On Hold");
  const currentlyPlaying = games.filter(
    (g) => g.status === "Currently Playing"
  );
  const dropped = games.filter((g) => g.status === "Dropped");

  const ratedGames = games.filter((g) => g.rating !== null);
  const averageRating =
    ratedGames.length > 0
      ? Math.round(
          (ratedGames.reduce((sum, g) => sum + (g.rating as number), 0) /
            ratedGames.length) *
            10
        ) / 10
      : null;

  const highestRatedGame =
    ratedGames.length > 0
      ? ratedGames.reduce((best, g) =>
          (g.rating as number) > (best.rating as number) ? g : best
        )
      : null;

  // Calendar duration of completed playthroughs (days)
  const totalCompletedDurationDays = completed.reduce((total, g) => {
    if (g.startDate && g.endDate) {
      const start = new Date(g.startDate);
      const end = new Date(g.endDate);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return total + Math.max(diffDays, 0);
    }
    return total;
  }, 0);

  return {
    totalGames: games.length,
    completed: completed.length,
    onHold: onHold.length,
    currentlyPlaying: currentlyPlaying.length,
    dropped: dropped.length,
    averageRating,
    highestRatedGame,
    totalCompletedDurationDays,
  };
}

// ── Date formatting helpers ─────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRating(rating: number | null): string {
  if (rating === null) return "Not rated";
  return `${rating}/10`;
}

/** Calendar days between the recorded start and finish dates. */
export function getDurationDays(game: GameEntry): number | null {
  if (!game.endDate) return null;
  const start = Date.parse(`${game.startDate}T00:00:00Z`);
  const end = Date.parse(`${game.endDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

/**
 * Status tones for the dark archive surface. Deliberately muted: brass for
 * finished titles, vermilion for the one in progress, steel and umber for the
 * titles that are paused and set aside.
 */
export type ArchiveStatusTone = "brass" | "vermilion" | "steel" | "umber";

export function getArchiveStatusTone(status: GameStatus): ArchiveStatusTone {
  switch (status) {
    case "Completed":
      return "brass";
    case "Currently Playing":
      return "vermilion";
    case "On Hold":
      return "steel";
    case "Dropped":
      return "umber";
    default:
      return "umber";
  }
}

// ── Status colour mapping ───────────────────────────────────────────────────

export function getStatusColor(status: GameStatus): string {
  switch (status) {
    case "Completed":
      return "text-matcha";
    case "Currently Playing":
      return "text-kohaku";
    case "On Hold":
      return "text-ruri";
    case "Dropped":
      return "text-bengara";
    default:
      return "text-muted-foreground";
  }
}

export function getStatusBgColor(status: GameStatus): string {
  switch (status) {
    case "Completed":
      return "bg-matcha-surface/20";
    case "Currently Playing":
      return "bg-kohaku-surface/20";
    case "On Hold":
      return "bg-ruri-surface/20";
    case "Dropped":
      return "bg-bengara-surface/20";
    default:
      return "bg-surface-raised/20";
  }
}
