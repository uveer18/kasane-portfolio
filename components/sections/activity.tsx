"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FadeIn, ViewportFadeSection } from "@/components/ui/motion";

type Day = {
  date: string;
  count: number;
};

type HeatmapState = {
  data: Day[];
  loading: boolean;
  error: string | null;
  total?: number;
  breakdown?: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
  };
};

type HeatmapLoadResult = {
  entries: Day[];
  total?: number;
  breakdown?: HeatmapState["breakdown"];
};

type MonthBlock = {
  name: string;
  key: string;
  days: (Day | null)[];
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

// --- Caching Utility ---
async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cacheKey = `heatmap_cache_${key}`;
  
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          return data;
        }
      }
    } catch (e) {
      console.warn("Failed to read from cache", e);
    }
  }

  const data = await fetcher();

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (e) {
      console.warn("Failed to write to cache", e);
    }
  }

  return data;
}

// --- Date Utils ---
function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildCalendarDays(entries: Day[]) {
  const map = new Map(entries.map((e) => [e.date, e.count]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = startOfWeek(new Date(today));
  start.setDate(start.getDate() - 51 * 7 - 5);

  const days: Day[] = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const key = formatDateKey(d);
    days.push({
      date: key,
      count: map.get(key) ?? 0,
    });
  }
  return days;
}

function buildMonthBlocks(days: Day[]) {
  const blocks: MonthBlock[] = [];
  if (!days.length) return blocks;

  let currentMonth = "";
  let currentBlock: MonthBlock | null = null;

  for (const day of days) {
    const [y, m, d] = day.date.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const monthKey = `${y}-${m}`;

    if (monthKey !== currentMonth) {
      currentMonth = monthKey;
      const monthName = dateObj.toLocaleString("default", { month: "short" });
      currentBlock = { name: monthName, key: monthKey, days: [] };
      blocks.push(currentBlock);

      const dayOfWeek = dateObj.getDay();
      for (let i = 0; i < dayOfWeek; i++) {
        currentBlock.days.push(null);
      }
    }
    currentBlock!.days.push(day);
  }
  return blocks;
}

function getStreak(days: Day[]) {
  if (!days.length) return 0;
  let s = 0;
  const lastIndex = days.length - 1;
  let i = days[lastIndex]?.count === 0 ? lastIndex - 1 : lastIndex;

  for (; i >= 0; i--) {
    if (days[i]?.count > 0) s++;
    else break;
  }
  return s;
}

function getMaxStreak(days: Day[]) {
  if (!days.length) return 0;
  let max = 0;
  let current = 0;
  for (const day of days) {
    if (day.count > 0) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
}

function getTotal(days: Day[]) {
  return days.reduce((a, b) => a + b.count, 0);
}

function getActiveDays(days: Day[]) {
  return days.filter((d) => d.count > 0).length;
}

function getColor(count: number) {
  if (count === 0) return "bg-muted";
  if (count < 2) return "bg-accent/20";
  if (count < 5) return "bg-accent/40";
  if (count < 10) return "bg-accent/70";
  return "bg-accent";
}

const DayCell = React.memo(function DayCell({
  day,
  isToday,
  onHover,
}: {
  day: Day | null;
  isToday: boolean;
  onHover: React.Dispatch<React.SetStateAction<Day | null>>;
}) {
  const baseClasses = "h-[10px] w-[10px] sm:h-[11px] sm:w-[11px] md:h-[13px] md:w-[13px] rounded-[8px]";

  if (!day) {
    return <div className={`${baseClasses} bg-transparent`} />;
  }

  return (
    <div
      className={`${baseClasses} ${getColor(day.count)}
      ${isToday ? "ring-1 ring-accent ring-offset-0 ring-offset-card" : ""}
      transition-[transform,box-shadow] duration-200 ease-out will-change-transform
      hover:scale-[1.2] hover:z-10 hover:shadow-[0_0_6px_var(--color-accent)]`}
      onMouseEnter={() => onHover(day)}
      onMouseLeave={() => onHover((prev) => (prev?.date === day.date ? null : prev))}
    />
  );
});

const HeatmapCard = React.memo(function HeatmapCard({
  title,
  description,
  state,
  meta,
  link,
}: {
  title: string;
  description: string;
  state: HeatmapState;
  meta?: {
    label: string;
    value: string | number;
    color?: string;
  }[];
  link?: string;
}) {
  const calendarDays = useMemo(() => buildCalendarDays(state.data), [state.data]);
  const monthBlocks = useMemo(() => buildMonthBlocks(calendarDays), [calendarDays]);
  const streak = useMemo(() => getStreak(calendarDays), [calendarDays]);
  const maxStreak = useMemo(() => getMaxStreak(calendarDays), [calendarDays]);
  const activeDays = useMemo(() => getActiveDays(calendarDays), [calendarDays]);
  const total = useMemo(() => state.total ?? getTotal(calendarDays), [state.total, calendarDays]);
  const statsUnavailable = state.loading || state.error !== null;

  const [hoveredDay, setHoveredDay] = useState<Day | null>(null);
  const today = formatDateKey(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && !state.loading) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [state.loading]);
  
  const isLeetCode = title.includes("LeetCode");
  const getUnit = (count: number) => {
    if (isLeetCode) return count === 1 ? "question" : "questions";
    return count === 1 ? "contribution" : "contributions";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="card-lit rounded-xl p-4 sm:p-6 md:p-8 transition-[transform,box-shadow,border-color] duration-300"
    >
      <div className="mb-3 flex flex-col gap-4  pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold text-foreground hover:underline">
              {title}
            </a>
          ) : (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm sm:flex sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tighter text-accent transition-all duration-300 hover:text-glow tabular-nums">{statsUnavailable ? "—" : streak}</span>
              <span className="text-muted-foreground font-semibold uppercase tracking-[0.15em] text-[9px] sm:text-[10px]">current streak</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tighter text-accent transition-all duration-300 hover:text-glow tabular-nums">{statsUnavailable ? "—" : maxStreak}</span>
              <span className="text-muted-foreground font-semibold uppercase tracking-[0.15em] text-[9px] sm:text-[10px]">max streak</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tighter text-accent transition-all duration-300 hover:text-glow tabular-nums">{statsUnavailable ? "—" : activeDays}</span>
              <span className="text-muted-foreground font-semibold uppercase tracking-[0.15em] text-[9px] sm:text-[10px]">active days</span>
            </div>
          
          <div className="flex flex-col gap-0.5 border-t pt-4 sm:border-0 sm:pt-0">
            <span className="text-xl sm:text-2xl font-bold tracking-tighter text-foreground tabular-nums">{statsUnavailable ? "—" : total}</span>
            <span className="text-muted-foreground/60 font-semibold uppercase tracking-[0.15em] text-[9px] sm:text-[10px]">total {getUnit(total)}</span>
          </div>
        </div>
      </div>

      {meta && (
        <div className="mb-4 flex flex-wrap gap-2 text-sm sm:gap-3">
          {meta.map((m) => (
            <div key={m.label} className={`flex items-baseline gap-1.5 rounded-lg border px-2 py-1 sm:px-3 sm:py-1.5 ${m.color ?? "bg-muted border-border"}`}>
              <span className="text-[10px] sm:text-xs font-medium opacity-90">{m.label}</span>
              <span className="text-xs sm:text-sm font-bold">{m.value}</span>
            </div>
          ))}
        </div>
      )}

      {state.loading ? (
        <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
          Loading data...
        </div>
      ) : state.error ? (
        <div className="flex h-[180px] items-center justify-center text-sm text-destructive">
          Failed to load data.
        </div>
      ) : (
        <>
          <div 
            ref={scrollRef}
            className="flex w-full gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent sm:gap-3"
          >
            <div className="mt-[20px] flex flex-col gap-[2px] text-[10px] text-muted-foreground">
              {WEEKDAY_LABELS.map((d, i) => (
                <div key={d} className="flex h-[10px] w-6 items-center justify-end pr-1 sm:h-[11px] md:h-[12px]">
                  {i % 2 === 1 ? d : ""}
                </div>
              ))}
            </div>

            <div className="flex gap-2 sm:gap-3">
              {monthBlocks.map((block) => (
                <div key={block.key} className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">{block.name}</span>
                  <div className="grid grid-rows-7 grid-flow-col gap-[2px]">
                    {block.days.map((day, i) => (
                      <DayCell
                        key={day?.date ?? `empty-${block.key}-${i}`}
                        day={day}
                        isToday={day?.date === today}
                        onHover={setHoveredDay}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-[20px] items-center justify-between pt-2">
            <div className="relative h-[34px] flex-1">
              <div 
                className={`absolute left-0 top-0 flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm shadow-sm transition-opacity duration-150 ${
                  hoveredDay ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <span className="font-medium text-foreground">{hoveredDay?.date || ""}</span>
                <span className="h-3 w-px bg-border" />
                <span className="font-semibold text-accent">{hoveredDay?.count ?? 0} {getUnit(hoveredDay?.count ?? 0)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 3, 6, 10].map((v) => (
                  <div key={v} className={`h-3 w-3 sm:h-4 sm:w-4 rounded-[12px] ${getColor(v)}`} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
});

function useHeatmapData(source: "github" | "leetcode") {
  const [state, setState] = useState<HeatmapState>({
    data: [],
    loading: true, 
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const fetcher = source === "github" 
          ? () => loadGithub(controller.signal)
          : () => loadLeetcode(controller.signal);

        const data = await fetchWithCache(source, fetcher);

        setState({
          data: data.entries.sort((a, b) => a.date.localeCompare(b.date)),
          loading: false,
          error: null,
          total: data.total,
          breakdown: data.breakdown,
        });
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setState({ data: [], loading: false, error: err.message || "error" });
      }
    }

    load();
    return () => controller.abort();
  }, [source]);

  return state;
}

async function loadGithub(signal: AbortSignal): Promise<HeatmapLoadResult> {
  const res = await fetch("https://github-contributions-api.jogruber.de/v4/uveer18?y=last", { signal });
  if (!res.ok) throw new Error("Failed to load GitHub data");

  const json = await res.json();
  if (!json?.contributions) throw new Error("Invalid GitHub data format");

  return {
    entries: json.contributions.map((d: any) => ({ date: d.date, count: d.count })),
    total: json.total?.lastYear,
  };
}

async function loadLeetcode(signal: AbortSignal): Promise<HeatmapLoadResult> {
  const res = await fetch("https://leetcode-api-faisalshohag.vercel.app/udayveersiingh", { signal });
  if (!res.ok) throw new Error("Failed to load LeetCode data");

  const json = await res.json();
  if (!json || json.errors) throw new Error("Invalid LeetCode data format");

  const calendar = typeof json.submissionCalendar === "string"
      ? JSON.parse(json.submissionCalendar)
      : json.submissionCalendar || {};

  const entries = Object.entries(calendar).map(([t, c]) => ({
    date: formatDateKey(new Date(Number(t) * 1000)),
    count: c as number,
  }));

  return {
    entries,
    total: json.totalSolved,
    breakdown: {
      totalSolved: json.totalSolved,
      easySolved: json.easySolved,
      mediumSolved: json.mediumSolved,
      hardSolved: json.hardSolved,
    },
  };
}

function GithubHeatmap() {
  const state = useHeatmapData("github");
  return <HeatmapCard title="GitHub Contributions" description="Recent coding consistency, commits, and contribution rhythm." state={state} link="https://github.com/uveer18" />;
}

function LeetcodeHeatmap() {
  const state = useHeatmapData("leetcode");
  
  const meta = state.breakdown ? [
    { label: "Total Solved", value: state.breakdown.totalSolved, color: "text-ruri bg-highlight border-highlight-border" },
    { label: "Easy", value: state.breakdown.easySolved, color: "text-matcha bg-highlight border-highlight-border" },
    { label: "Medium", value: state.breakdown.mediumSolved, color: "text-kohaku bg-highlight border-highlight-border" },
    { label: "Hard", value: state.breakdown.hardSolved, color: "text-bengara bg-highlight border-highlight-border" },
  ] : undefined;

  return <HeatmapCard title="LeetCode Activity" description="Daily problem-solving reps and algorithm practice visualized over time." state={state} meta={meta} link="https://leetcode.com/u/udayveersiingh/" />;
}

export function Activity() {
  return (
    <ViewportFadeSection id="activity" className="px-[var(--page-gutter)] py-24 md:py-32 overflow-hidden">
      <div className="page-shell">
        <FadeIn>
          <div className="mb-16 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Activity
            </h2>
            <span className="h-px flex-1 bg-border" />
          </div>
        </FadeIn>

        <FadeIn>
          <p className="mx-auto mb-16 max-w-2xl text-center text-base sm:text-lg text-muted-foreground">
            Consistent work over time through code, systems thinking, and daily problem-solving reps.
          </p>
        </FadeIn>

        <div className="flex flex-col gap-8 w-full">
          <GithubHeatmap />
          <LeetcodeHeatmap />
        </div>
      </div>
    </ViewportFadeSection>
  );
}
