"use client";

import { ArcImage } from "./arc-image";
import {
  formatDate,
  formatRating,
  getArchiveStatusTone,
  getDurationDays,
  type GameEntry,
} from "@/lib/games";

type GameTileProps = {
  game: GameEntry;
  /** Position in the collection, 1-based — rendered as the catalogue number. */
  number: number;
  /** Desktop column span, out of twelve. */
  cols: number;
  /** Tablet column span, out of six. */
  colsSm: number;
  /** Row span on the desktop grid. */
  rows: number;
  onOpen: (game: GameEntry) => void;
};

function roleFor(cols: number) {
  if (cols >= 12) return "plate";
  if (cols >= 7) return "feature";
  if (cols >= 5) return "wide";
  if (cols >= 4) return "std";
  return "narrow";
}

export function GameTile({
  game,
  number,
  cols,
  colsSm,
  rows,
  onOpen,
}: GameTileProps) {
  const tone = getArchiveStatusTone(game.status);
  const duration = getDurationDays(game);

  return (
    <article
      className="arc-tile"
      data-role={roleFor(cols)}
      style={
        {
          "--cols": cols,
          "--cols-sm": colsSm,
          "--rows": rows,
          "--arc-index": number - 1,
          "--tile-accent": game.accent,
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        className="arc-tile-frame"
        onClick={() => onOpen(game)}
        aria-label={`Open the journal for ${game.title}`}
      >
        <ArcImage
          src={game.artwork}
          alt={`${game.title} — official key art`}
          fill
          sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 40vw"
          className="arc-tile-art"
          style={{ objectPosition: game.artworkPosition }}
        />

        <span className="arc-tile-veil" aria-hidden="true" />
        <span className="arc-tile-number meta-label" aria-hidden="true">
          {String(number).padStart(2, "0")}
        </span>

        <span className="arc-tile-caption">
          <span className="arc-tile-topline">
            <span className={`arc-pill arc-pill--${tone}`}>{game.status}</span>
            <span className="arc-tile-rating">
              <span aria-hidden="true">★</span> {formatRating(game.rating)}
            </span>
          </span>

          <span className="arc-tile-title font-display">{game.title}</span>

          <span className="arc-tile-byline">
            <span className="arc-tile-developer">{game.developer}</span>
            <span className="arc-tile-genre">{game.genre}</span>
          </span>

          <span className="arc-tile-foot">
            <span>
              Started {formatDate(game.startDate)}
              {game.endDate ? ` · Finished ${formatDate(game.endDate)}` : ""}
            </span>
          </span>

          <span className="arc-tile-reveal">
            {game.publisher ? (
              <span>
                <span className="arc-tile-reveal-key">Publisher</span>
                {game.publisher}
              </span>
            ) : null}
            <span>
              <span className="arc-tile-reveal-key">Playthrough</span>
              {duration === null
                ? "In progress"
                : `${duration} calendar day${duration === 1 ? "" : "s"}`}
            </span>
            <span className="arc-tile-reveal-cta">Open journal</span>
          </span>
        </span>
      </button>
    </article>
  );
}
