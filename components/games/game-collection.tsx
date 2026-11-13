"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { GameTile } from "./game-tile";
import {
  games as allGames,
  type GameEntry,
  type GameStatus,
  type SortOption,
} from "@/lib/games";

type Slot = {
  /** Desktop column span, out of twelve. */
  cols: number;
  /** Tablet column span, out of six. */
  colsSm: number;
  /** Row span on the desktop grid. */
  rows: number;
};

const filters: Array<{ label: string; value: GameStatus | "All games" }> = [
  { label: "All games", value: "All games" },
  { label: "Completed", value: "Completed" },
  { label: "Currently playing", value: "Currently Playing" },
  { label: "On hold", value: "On Hold" },
  { label: "Dropped", value: "Dropped" },
];

/**
 * Bento composition. The grid is laid out so every row closes cleanly at
 * twelve columns, whatever the collection is filtered down to: a wide
 * featured plate first, then alternating three-up rows, with the remainder
 * handled so no row is left with a hole.
 */
function buildLayout(count: number): Slot[] {
  if (count <= 0) return [];
  if (count === 1) return [{ cols: 12, colsSm: 6, rows: 6 }];

  const slots: Slot[] = [];
  let remaining = count;
  const take = (row: Slot[]) => {
    row.forEach((slot) => slots.push(slot));
    remaining -= row.length;
  };

  take([
    { cols: 7, colsSm: 3, rows: 6 },
    { cols: 5, colsSm: 3, rows: 6 },
  ]);

  const shapes: Slot[][] = [
    [
      { cols: 5, colsSm: 2, rows: 5 },
      { cols: 4, colsSm: 2, rows: 5 },
      { cols: 3, colsSm: 2, rows: 5 },
    ],
    [
      { cols: 3, colsSm: 2, rows: 5 },
      { cols: 4, colsSm: 2, rows: 5 },
      { cols: 5, colsSm: 2, rows: 5 },
    ],
  ];

  let shapeIndex = 0;
  while (remaining > 0) {
    if (remaining >= 3) {
      take(shapes[shapeIndex % shapes.length]);
      shapeIndex += 1;
    } else if (remaining === 2) {
      take([
        { cols: 6, colsSm: 3, rows: 6 },
        { cols: 6, colsSm: 3, rows: 6 },
      ]);
    } else {
      take([{ cols: 12, colsSm: 6, rows: 6 }]);
    }
  }

  return slots;
}

function sortCollection(list: GameEntry[], sort: SortOption): GameEntry[] {
  const date = (game: GameEntry) => Date.parse(`${game.startDate}T00:00:00`);
  return [...list].sort((a, b) => {
    if (sort === "newest") return date(b) - date(a);
    if (sort === "oldest") return date(a) - date(b);
    if (sort === "highest-rated") return (b.rating ?? -1) - (a.rating ?? -1);
    if (sort === "lowest-rated") return (a.rating ?? 11) - (b.rating ?? 11);
    return a.title.localeCompare(b.title);
  });
}

type GameCollectionProps = {
  onOpen: (game: GameEntry) => void;
};

export function GameCollection({ onOpen }: GameCollectionProps) {
  const [filter, setFilter] = useState<GameStatus | "All games">("All games");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const visibleGames = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = allGames.filter(
      (game) =>
        (filter === "All games" || game.status === filter) &&
        (!needle || game.title.toLowerCase().includes(needle))
    );
    return sortCollection(filtered, sort);
  }, [filter, query, sort]);

  const layout = useMemo(() => buildLayout(visibleGames.length), [visibleGames.length]);

  const countFor = (value: GameStatus | "All games") =>
    value === "All games"
      ? allGames.length
      : allGames.filter((game) => game.status === value).length;

  return (
    <section id="library" className="arc-collection" aria-labelledby="library-title">
      <div className="page-shell">
        <div className="arc-collection-head">
          <div>
            <p className="arc-eyebrow">
              <span className="arc-eyebrow-mark" aria-hidden="true" />
              The collection / {String(allGames.length).padStart(2, "0")}
            </p>
            <h2 id="library-title" className="arc-section-title">
              Game library
            </h2>
          </div>

          <div className="arc-controls">
            <label className="arc-search">
              <span className="sr-only">Search games</span>
              <Search size={15} strokeWidth={1.6} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search titles"
                type="search"
              />
            </label>

            <label className="sr-only" htmlFor="games-sort">
              Sort games
            </label>
            <select
              id="games-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="arc-select"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest-rated">Highest rated</option>
              <option value="lowest-rated">Lowest rated</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        <div
          className="arc-filters"
          role="group"
          aria-label="Filter by status"
        >
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className="arc-filter"
              data-active={filter === item.value}
            >
              {item.label}
              <span className="arc-filter-count">{countFor(item.value)}</span>
            </button>
          ))}
        </div>

        {visibleGames.length ? (
          <div
            className="arc-grid"
            key={`${filter}|${sort}`}
            style={{ "--arc-count": visibleGames.length } as React.CSSProperties}
          >
            {visibleGames.map((game, index) => (
              <GameTile
                key={game.id}
                game={game}
                number={index + 1}
                cols={layout[index]?.cols ?? 4}
                colsSm={layout[index]?.colsSm ?? 2}
                rows={layout[index]?.rows ?? 6}
                onOpen={onOpen}
              />
            ))}
          </div>
        ) : (
          <p className="arc-empty">
            No titles match this search and filter.
          </p>
        )}
      </div>
    </section>
  );
}
