"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, MapPin, ArrowUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";


export function StatusBar() {
  const [time, setTime] = useState<string>("");
  const [views, setViews] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      const istTime = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);

      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const seconds = istTime.getSeconds();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;

      setTime(`${displayHours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const incrementViews = async () => {
      try {
        const { data, error } = await supabase.rpc("increment_views", {
          row_label: "page_views",
        });
        
        if (error) {
          console.error("Supabase RPC error (StatusBar):", error);
        }
        
        if (data !== null && data !== undefined) {
          setViews(data);
        }
      } catch (err) {
        console.error("Error syncing views:", err);
      }
    };

    incrementViews();
  }, [mounted]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return null;

  return (
    <div id="status-bar-container" className="sticky bottom-1 z-50 mt-auto flex w-full justify-end px-3 pb-2 pointer-events-none transition-opacity duration-300 sm:px-6">
      <div className="flex items-center gap-2 pointer-events-auto">
        <AnimatePresence>
          {showScroll && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={scrollToTop}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/40 bg-background/70 shadow-2xl backdrop-blur-md transition-colors hover:bg-background/85 sm:h-10 sm:w-10 sm:bg-background/60 sm:backdrop-blur-sm"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4 text-foreground/80 transition-transform group-hover:-translate-y-0.5" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 50
          }}
          onClick={() => setIsStatusExpanded((current) => !current)}
          className={cn(
            "flex h-11 items-center justify-center overflow-hidden rounded-full border border-border/40 bg-background/70 shadow-2xl backdrop-blur-md transition-all hover:bg-background/85 sm:h-auto sm:w-auto sm:justify-start sm:gap-1.5 sm:bg-background/60 sm:p-1 sm:backdrop-blur-sm sm:hover:bg-background/80",
            isStatusExpanded ? "w-auto gap-1.5 p-1" : "w-11 p-0"
          )}
          aria-label={`Status: ${time} IST, ${views === null ? "visit count unavailable" : `${views.toLocaleString()} visits`}`}
          aria-expanded={isStatusExpanded}
        >
          <div
            className={cn(
              "relative h-3 w-3 items-center justify-center sm:hidden",
              isStatusExpanded ? "hidden" : "flex"
            )}
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-40" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--success)] shadow-[0_0_12px_color-mix(in_srgb,var(--success)_70%,transparent)]" />
          </div>

          <div
            className={cn(
              "items-center gap-2.5 px-3 py-1.5 text-[11px] font-medium tracking-tight text-foreground/90 sm:flex",
              isStatusExpanded ? "flex" : "hidden"
            )}
          >
            <div className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]" />
            </div>

            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted-foreground/70">
                <MapPin className="h-2.5 w-2.5" />
                <span>IST (UTC+5:30)</span>
              </div>
              <span className="mt-0.5 tabular-nums">{time}</span>
            </div>
          </div>

          <div
            className={cn(
              "h-6 w-px bg-border/40 sm:block",
              isStatusExpanded ? "block" : "hidden"
            )}
          />

          <div
            className={cn(
              "group items-center gap-2 px-3 py-1.5 text-[11px] font-medium tracking-tight text-foreground/90 sm:flex",
              isStatusExpanded ? "flex" : "hidden"
            )}
          >
            <div className="flex flex-col items-end leading-none">
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted-foreground/70">
                <Eye className="h-2.5 w-2.5 transition-transform group-hover:scale-110" />
                <span>Visits</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={views ?? "unavailable"}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-0.5 tabular-nums"
                >
                  {views === null ? "—" : views.toLocaleString()}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
