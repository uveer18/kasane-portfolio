"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "./theme-provider";

const navLinks = [
  { name: "Home", href: "/", section: "home" },
  { name: "Work", href: "/work", section: "work" },
  { name: "Photography", href: "/photography", section: "photography" },
  { name: "Games", href: "/games", section: "games" },
  { name: "About", href: "/about", section: "about-preview" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = navLinks.map((link) => link.section);
    const update = () => {
      let active = "home";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.35) active = section;
      }
      setActiveSection(active);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  const isActive = (section: string, href: string) => pathname === "/" ? activeSection === section : pathname === href;
  const currentState = (section: string, href: string): "page" | "location" | undefined => pathname === href ? "page" : pathname === "/" && activeSection === section ? "location" : undefined;

  return (
    <header id="navbar" className="fixed inset-x-0 top-4 z-40 px-[var(--page-gutter)] sm:top-5">
      <nav aria-label="Main navigation" className="nav-lit lum-halo mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-full px-4 sm:px-6">
        <Link href="/#home" className="font-display text-lg text-foreground" onClick={() => setOpen(false)}>
          Udayveer Singh<span className="ml-2 text-accent">.</span>
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} aria-current={currentState(link.section, link.href)} className={`relative rounded-full px-3 py-2 text-[13px] transition-colors hover:text-foreground ${isActive(link.section, link.href) ? "text-foreground" : "text-muted-foreground"}`}>
                {isActive(link.section, link.href) && <motion.span layoutId="navbar-highlight" transition={{ type: "spring", stiffness: 420, damping: 32 }} className="nav-active-indicator" />}
                <span className="relative z-10">{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <Link href="/contact" className="btn-lit hidden rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:bg-accent hover:text-white sm:inline-flex">Contact</Link>
          <button onClick={(event) => toggleTheme(event.currentTarget)} className="floating-control rounded-full p-2 text-foreground transition hover:text-bengara" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button onClick={() => setOpen(!open)} className="rounded-full p-2 text-muted-foreground md:hidden" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.nav aria-label="Mobile navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="nav-lit lum-halo mx-auto mt-2 w-full max-w-6xl rounded-2xl p-3 md:hidden">
            {navLinks.map((link) => <Link key={link.name} href={link.href} onClick={() => setOpen(false)} aria-current={currentState(link.section, link.href)} className={`block rounded-xl px-4 py-3 text-sm hover:bg-highlight hover:text-foreground ${isActive(link.section, link.href) ? "bg-highlight text-foreground" : "text-muted-foreground"}`}>{link.name}</Link>)}
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-1 block rounded-xl px-4 py-3 text-sm text-accent">Contact ↗</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
