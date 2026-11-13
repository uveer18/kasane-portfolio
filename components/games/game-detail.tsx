"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ArcImage } from "./arc-image";
import {
  formatDate,
  formatRating,
  getArchiveStatusTone,
  getDurationDays,
  type GameEntry,
} from "@/lib/games";

type GameDetailProps = {
  game: GameEntry | null;
  onClose: () => void;
};

function RecordRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="arc-record-row">
      <dt className="arc-label">{label}</dt>
      <dd className="arc-record-value">{value ?? "Not recorded"}</dd>
    </div>
  );
}

function JournalSection({
  title,
  open,
  children,
}: {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="arc-journal-section" open={open}>
      <summary className="arc-journal-heading font-display">{title}</summary>
      <div className="arc-journal-body">{children}</div>
    </details>
  );
}

export function GameDetail({ game, onClose }: GameDetailProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !game) return;
    if (!dialog.open) dialog.showModal();

    const handleCancel = (event: Event) => {
      // Intercept Escape so the panel can animate out before it unmounts.
      event.preventDefault();
      requestClose();
    };
    const handleClose = () => onCloseRef.current();

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      dialogRef.current?.close();
      onCloseRef.current();
    }, 220);
  };

  if (!game) return null;

  const tone = getArchiveStatusTone(game.status);
  const duration = getDurationDays(game);

  const handleBackdrop = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) requestClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="arc-detail"
      data-closing={closing ? "true" : undefined}
      onClick={handleBackdrop}
      aria-label={`${game.title} — gaming journal`}
    >
      <div className="arc-detail-panel">
        <button
          type="button"
          className="arc-detail-close"
          onClick={requestClose}
          aria-label="Close journal"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="arc-detail-art">
          <ArcImage
            src={game.artwork}
            alt={`${game.title} — official key art`}
            fill
            eager
            sizes="(max-width: 899px) 100vw, 60vw"
            className="arc-detail-art-img"
            style={{ objectPosition: game.artworkPosition }}
          />
          <div className="arc-detail-art-scrim" aria-hidden="true" />
          <div className="arc-detail-art-caption">
            <p className="arc-eyebrow">
              <span className="arc-eyebrow-mark" aria-hidden="true" />
              Entry / {game.id}
            </p>
            <h2 className="arc-detail-title font-display">{game.title}</h2>
            <div className="arc-detail-art-meta">
              <span className={`arc-pill arc-pill--${tone}`}>{game.status}</span>
              <span className="arc-tile-rating">
                <span aria-hidden="true">★</span> {formatRating(game.rating)}
              </span>
            </div>
          </div>
        </div>

        <div className="arc-detail-body">
          <div className="arc-detail-column">
            <h3 className="arc-label arc-detail-column-title">Record</h3>
            <dl className="arc-records">
              <RecordRow label="Developer" value={game.developer} />
              <RecordRow label="Publisher" value={game.publisher} />
              <RecordRow label="Genre" value={game.genre} />
              <RecordRow label="Personal rating" value={formatRating(game.rating)} />
              <RecordRow label="Status" value={game.status} />
              <RecordRow label="Started" value={formatDate(game.startDate)} />
              <RecordRow
                label="Finished"
                value={game.endDate ? formatDate(game.endDate) : null}
              />
              <RecordRow
                label="Playthrough"
                value={
                  duration === null
                    ? null
                    : `${duration} calendar day${duration === 1 ? "" : "s"}`
                }
              />
            </dl>
          </div>

          <div className="arc-detail-column">
            <h3 className="arc-label arc-detail-column-title">Personal journal</h3>
            <p className="arc-detail-note">
              Notes written during play. Nothing here is generated — each entry
              is added by hand as the playthrough develops.
            </p>

            <JournalSection
              title="Hardest bosses"
              open={game.hardestBosses.length > 0}
            >
              {game.hardestBosses.length ? (
                <ul className="arc-journal-list">
                  {game.hardestBosses.map((boss, index) => (
                    <li key={`${boss.name}-${index}`}>
                      <p className="arc-journal-primary">
                        {boss.name}{" "}
                        <span className="arc-journal-muted">
                          · {boss.difficultyRating}/10
                        </span>
                      </p>
                      {boss.explanation && (
                        <p className="arc-journal-secondary">
                          {boss.explanation}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="arc-journal-empty">
                  No hardest bosses recorded.
                </p>
              )}
            </JournalSection>

            <JournalSection
              title="Most deaths"
              open={game.mostDeaths.length > 0}
            >
              {game.mostDeaths.length ? (
                <ul className="arc-journal-list">
                  {game.mostDeaths.map((record, index) => (
                    <li key={`${record.encounter}-${index}`}>
                      <p className="arc-journal-primary">
                        {record.encounter}{" "}
                        <span className="arc-journal-muted">
                          · {record.deaths} deaths
                        </span>
                      </p>
                      {record.notes && (
                        <p className="arc-journal-secondary">{record.notes}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="arc-journal-empty">No death counts recorded.</p>
              )}
            </JournalSection>

            <JournalSection title="Favourite boss" open={Boolean(game.favouriteBoss)}>
              {game.favouriteBoss ? (
                <div>
                  <p className="arc-journal-primary">{game.favouriteBoss.name}</p>
                  {game.favouriteBoss.explanation && (
                    <p className="arc-journal-secondary">
                      {game.favouriteBoss.explanation}
                    </p>
                  )}
                </div>
              ) : (
                <p className="arc-journal-empty">No favourite boss recorded.</p>
              )}
            </JournalSection>

            <JournalSection
              title="Memorable moments"
              open={game.memorableMoments.length > 0}
            >
              {game.memorableMoments.length ? (
                <div className="arc-moments">
                  {game.memorableMoments.map((moment, index) => (
                    <figure key={`${moment.title}-${index}`} className="arc-moment">
                      {moment.image ? (
                        <img
                          src={moment.image}
                          alt={moment.title || `${game.title} screenshot`}
                          loading="lazy"
                        />
                      ) : (
                        <div className="arc-moment-placeholder">
                          No image attached
                        </div>
                      )}
                      <figcaption>
                        <p className="arc-journal-primary">
                          {moment.title || "Untitled moment"}
                        </p>
                        {moment.order !== null && (
                          <p className="arc-journal-muted">
                            Moment {moment.order}
                          </p>
                        )}
                        {moment.description && (
                          <p className="arc-journal-secondary">
                            {moment.description}
                          </p>
                        )}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <p className="arc-journal-empty">
                  No moments recorded yet. Personal screenshots can be added to
                  the internal game data.
                </p>
              )}
            </JournalSection>

            <JournalSection
              title="Personal notes"
              open={
                Boolean(
                  game.favouriteWeapon ||
                    game.favouriteLocation ||
                    game.mostFrustratingEncounter ||
                    game.favouriteSoundtrack ||
                    game.difficulty !== null ||
                    game.replayability !== null ||
                    game.personalReview
                )
              }
            >
              <dl className="arc-records arc-records--notes">
                <RecordRow
                  label="Favourite weapon or build"
                  value={game.favouriteWeapon}
                />
                <RecordRow label="Favourite location" value={game.favouriteLocation} />
                <RecordRow
                  label="Most frustrating encounter"
                  value={game.mostFrustratingEncounter}
                />
                <RecordRow
                  label="Favourite soundtrack"
                  value={game.favouriteSoundtrack}
                />
                <RecordRow
                  label="Overall difficulty"
                  value={game.difficulty === null ? null : `${game.difficulty}/10`}
                />
                <RecordRow
                  label="Replayability"
                  value={game.replayability === null ? null : `${game.replayability}/10`}
                />
              </dl>
              {game.personalReview && (
                <div className="arc-journal-review">
                  <p className="arc-label">Personal review</p>
                  <p className="arc-journal-secondary">
                    {game.personalReview}
                  </p>
                </div>
              )}
            </JournalSection>
          </div>
        </div>
      </div>
    </dialog>
  );
}
