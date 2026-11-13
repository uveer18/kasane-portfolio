import { ArcImage } from "./arc-image";
import type { GamingStats } from "@/lib/games";

type GamingHeroProps = {
  stats: GamingStats;
  averageLabel: string;
};

/**
 * The archive masthead. Aged-paper typography on sumi charcoal, a cinematic
 * key-art band, the collection figures folded into the composition, and a
 * slowly turning enso standing in for the ROG slash motif. The record itself
 * sits directly beneath, closing the transition into the collection.
 */
export function GamingHero({ stats, averageLabel }: GamingHeroProps) {
  const figures: Array<[string, string]> = [
    ["Completed", String(stats.completed)],
    ["On hold", String(stats.onHold)],
    ["Currently playing", String(stats.currentlyPlaying)],
    ["Dropped", String(stats.dropped)],
    ["Average rating", averageLabel],
    [
      "Highest rated",
      stats.highestRatedGame ? `${stats.highestRatedGame.rating}/10` : "—",
    ],
    ["Top title", stats.highestRatedGame?.title ?? "—"],
    ["Completed duration", `${stats.totalCompletedDurationDays} days`],
  ];

  return (
    <header className="arc-hero">
      <div className="arc-hero-art" aria-hidden="true">
        <ArcImage
          src="/games/hero.jpg"
          alt=""
          fill
          eager
          sizes="100vw"
          className="arc-hero-art-img"
          style={{ objectPosition: "52% 45%" }}
        />
      </div>

      <div className="arc-hero-enso" aria-hidden="true">
        <span className="arc-enso-ring" />
        <span className="arc-slash" />
      </div>

      <div className="page-shell arc-hero-inner">
        <div className="arc-hero-copy">
          <p className="arc-eyebrow">
            <span className="arc-eyebrow-mark" aria-hidden="true" />
            Personal archive / 03
          </p>

          <h1 className="arc-hero-title">Worlds worth staying in.</h1>

          <p className="arc-hero-intro">
            A record of the games played, the time spent, and the details worth
            carrying forward.
          </p>

          <dl className="arc-hero-figures">
            <div className="arc-hero-figure">
              <dt className="arc-label">Library</dt>
              <dd>
                <span className="arc-hero-figure-value">{stats.totalGames}</span>
                <span className="arc-hero-figure-unit">titles</span>
              </dd>
            </div>
            <div className="arc-hero-figure">
              <dt className="arc-label">Completed</dt>
              <dd>
                <span className="arc-hero-figure-value">{stats.completed}</span>
                <span className="arc-hero-figure-unit">playthroughs</span>
              </dd>
            </div>
            <div className="arc-hero-figure">
              <dt className="arc-label">Average rating</dt>
              <dd>
                <span className="arc-hero-figure-value">{averageLabel}</span>
                <span className="arc-hero-figure-unit">across rated titles</span>
              </dd>
            </div>
          </dl>
        </div>

        <p className="arc-hero-kanji" aria-hidden="true">
          <span>遊</span>
          <span>戯</span>
          <span>録</span>
        </p>
      </div>

      <section className="arc-figures" aria-labelledby="arc-figures-title">
        <div className="page-shell">
          <div className="arc-figures-head">
            <div>
              <p className="arc-eyebrow">
                <span className="arc-eyebrow-mark" aria-hidden="true" />
                The record so far
              </p>
              <h2 id="arc-figures-title" className="arc-figures-title">
                By the numbers
              </h2>
            </div>
            <span className="arc-label arc-figures-note">
              Calendar days · not hours played
            </span>
          </div>
          <dl className="arc-figures-grid">
            {figures.map(([label, value]) => (
              <div key={label} className="arc-figure">
                <dt className="arc-label">{label}</dt>
                <dd className="arc-figure-value font-display">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </header>
  );
}
