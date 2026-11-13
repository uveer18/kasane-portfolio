"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (origin?: HTMLElement | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/* Keep in sync with --page and .theme-wave[data-theme="dark"] in globals.css. */
const PAGE_COLOR: Record<Theme, string> = { light: "#EAE5D9", dark: "#131718" };
const WAVE_MS = 1000;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [wave, setWave] = useState<{ x: number; y: number; size: number; theme: Theme; id: number } | null>(null);
  const themeRef = useRef<Theme>("light");
  const waveTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial: Theme = saved === "dark" ? "dark" : "light";
    themeRef.current = initial;
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", PAGE_COLOR[initial]);
  }, []);

  const applyTheme = (next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", PAGE_COLOR[next]);
    localStorage.setItem("theme", next);
  };

  const toggleTheme = (origin?: HTMLElement | null) => {
    const next: Theme = themeRef.current === "dark" ? "light" : "dark";
    themeRef.current = next;
    setTheme(next);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!origin || reduced) {
      applyTheme(next);
      return;
    }

    /* The new theme blooms out of the switcher as a soft sphere of light. */
    const rect = origin.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const reach = Math.max(
      Math.hypot(x, y),
      Math.hypot(window.innerWidth - x, y),
      Math.hypot(x, window.innerHeight - y),
      Math.hypot(window.innerWidth - x, window.innerHeight - y),
    );

    applyTheme(next);
    setWave({ x, y, size: reach * 4.2, theme: next, id: Date.now() });
    window.clearTimeout(waveTimer.current);
    waveTimer.current = window.setTimeout(() => setWave(null), WAVE_MS + 80);
  };

  useEffect(() => () => window.clearTimeout(waveTimer.current), []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      {wave && (
        <div
          key={wave.id}
          className="theme-wave"
          data-theme={wave.theme}
          style={{ left: wave.x, top: wave.y, width: wave.size, height: wave.size }}
          aria-hidden="true"
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
