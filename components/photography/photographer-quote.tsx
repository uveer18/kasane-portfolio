"use client";

import { useEffect, useState } from "react";

type Quotation = { quote: string; attribution: string };

/** Short, attributed remarks from photographers whose work shaped the medium. */
const QUOTATIONS: Quotation[] = [
  {
    quote: "You don’t make a photograph just with a camera.\nYou bring to the act of photography all the-\n\t-pictures you have seen,\nthe books you have read,\nthe music you have heard,\nthe people you have loved.",
    attribution: "Ansel Adams",
  },
  {
    quote: "The decisive moment.",
    attribution: "Henri Cartier-Bresson",
  },
  {
    quote: "The picture must be capable of digging into the viewer.\nAnd that is the reason I work with children.",
    attribution: "Dorothea Lange",
  },
];

function formatQuote(raw: string): string {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");
}

const longestQuotation = QUOTATIONS.reduce((longest, item) => {
  const itemLines = item.quote.split("\n").length;
  const longestLines = longest.quote.split("\n").length;
  if (itemLines > longestLines) return item;
  if (itemLines === longestLines && item.quote.length > longest.quote.length) return item;
  return longest;
}, QUOTATIONS[0]);

const longestFormattedQuote = formatQuote(longestQuotation.quote);

export function PhotographerQuote({ interval = 10000 }: { interval?: number }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timeout: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setPhase("out");
      timeout = setTimeout(() => {
        setIndex((current) => (current + 1) % QUOTATIONS.length);
        setPhase("in");
      }, 800);
    };
    const intervalHandle = setInterval(cycle, interval);
    return () => { clearInterval(intervalHandle); clearTimeout(timeout); };
  }, [interval]);

  const current = QUOTATIONS[index];
  const formattedQuote = formatQuote(current.quote);

  return (
    <figure className="quote-figure" data-phase={phase}>
      {/* Sizer keeps the height fixed based on the longest quote lines */}
      <div className="quote-sizer" aria-hidden="true">
        <blockquote className="quote-text">{longestFormattedQuote}</blockquote>
        <figcaption className="quote-attribution meta-label">{longestQuotation.attribution}</figcaption>
      </div>
      <div className="quote-content">
        <blockquote className="quote-text">{formattedQuote}</blockquote>
        <figcaption className="quote-attribution meta-label">{current.attribution}</figcaption>
      </div>
    </figure>
  );
}
