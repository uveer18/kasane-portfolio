"use client";

import { useState } from "react";
import { FadeIn, FadeInStagger, FadeInStaggerItem, ViewportFadeSection } from "@/components/ui/motion";
import { ExternalLink, Github, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    title: "SAAB Doors",
    description:
      "A high-performance, conversion-optimised digital platform for custom entrance and internal doors. Features an interactive Quote Estimator, dynamic catalog, and a frictionless WhatsApp-first customer acquisition flow.",
    tech: ["React 19", "Vite", "Tailwind v4", "Framer Motion", "Zustand"],
    link: "https://saabdoors.vercel.app",
    image: "/images/projects/saabdoors.webp",
  },
  {
    title: "Winder",
    description:
      "Semantic desktop search Raycast extension powered by Gemini embeddings and ChromaDB. Supports text and image query modes across multimodal files using a two-phase hybrid search (BM25 + RRF).",
    tech: ["Node.js", "Gemini API", "ChromaDB", "Raycast", "TypeScript"],
    link: "https://github.com/uveer18/winder",
    image: "/images/projects/winder.webp",
  },
  {
    title: "RogNidhi",
    description:
      "AI-powered health treasury that centralizes medical histories into structured timelines. Finalist at HackMol 7.0. Features a multi-stage cRAG pipeline (FAISS + LLMs) for clinical data extraction from scans and prescriptions.",
    tech: ["React", "Django", "FAISS", "LLMs", "cRAG", "TypeScript"],
    link: "https://github.com/royalmaddy07/RogNidhi",
    image: "/images/projects/rognidhi.webp",
  },
  {
    title: "Portfolio Site",
    description:
      "Personal portfolio built with Next.js 15 and React 19. Features an animated typewriter hero, live GitHub & LeetCode heatmaps via API, a photography lightbox gallery, Lenis smooth scrolling, dark/light theming, and Framer Motion micro-interactions throughout.",
    tech: ["Next.js 15", "React 19", "Tailwind v4", "Framer Motion", "Supabase"],
    link: "/",
    image: "/images/projects/portfolio.webp",
  },
  {
    title: "EXIF EV Predictor",
    description:
      "Machine-learning-powered exposure prediction tool that analyzes scene lighting and recommends optimal camera settings for perfect shots.",
    tech: ["Python", "OpenCV", "Scikit-learn", "Pandas", "Numpy", "PiEXIF"],
    link: "https://github.com/uveer18/lensiq-1-ev-predictor",
    image: "/images/projects/exif-ev.webp",
  },
  {
    title: "ColorFlow",
    description:
      "Image mood classification tool that analyzes color palettes and emotional tones in photographs using machine learning.",
    tech: ["Python", "Scikit-learn", "Pandas", "Numpy", "Matplotlib", "Google Colab"],
    link: "https://github.com/uveer18/lensiq-3-colorflow",
    image: "/images/projects/colorflow.webp",
  },
  {
    title: "Infeared",
    description: "[ADD PROJECT DESCRIPTION]",
    tech: ["[ADD TECH STACK]"],
    link: "#",
    image: "#",
  },
  {
    title: "Relyed",
    description: "[ADD PROJECT DESCRIPTION]",
    tech: ["[ADD TECH STACK]"],
    link: "#",
    image: "#",
  },
  {
    title: "AutoQA",
    description:
      "Automated website testing for AI-generated and E-commerce websites",
    tech: ["TypeSript", "Next.js", "FastAPI", "LangChain"],
    link: "#",
    image: "#",
  },
  {
    title: "PhotoCompAI",
    description:
      "Composition analysis AI that evaluates framing, rule of thirds, and visual balance to help photographers improve their shots.",
    tech: ["PyTorch", "CNN", "CLIP", "React", "Node.js"],
    link: "#",
    image: "#",
  },
  {
    title: "NoiseSense",
    description:
      "Advanced AI image denoising tool that preserves detail while removing noise from high ISO and low-light photographs.",
    tech: ["PyTorch", "U-Net", "Python", "CUDA"],
    link: "#",
    image: "#",
  },
  {
    title: "StyleLens",
    description:
      "Neural style transfer system that applies artistic styles to photographs while maintaining photorealistic quality.",
    tech: ["Python", "GANs", "PyTorch", "Docker"],
    link: "#",
    image: "#",
  },
];

function ProjectCard({
  project,
  disabled = false,
}: {
  project: (typeof projects)[number];
  disabled?: boolean;
}) {
  const projectTone = project.title === "SAAB Doors" ? "var(--bengara-surface)"
    : project.title === "Winder" ? "var(--ruri-text)"
      : project.title === "RogNidhi" ? "var(--seiji-surface)"
        : project.title === "Portfolio Site" ? "var(--kohaku-surface)"
          : project.title === "ColorFlow" || project.title === "EXIF EV Predictor" ? "var(--matcha-surface)"
            : "var(--bengara-surface)";
  return (
    <motion.div
      whileHover={disabled ? undefined : { y: -4 }}
      transition={{ duration: 0.2 }}
      style={{ borderTop: `3px solid ${projectTone}` }}
      className={`relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors ${disabled ? "pointer-events-none" : "group hover:bg-muted"
        }`}
    >
      <a
        href={project.link}
        target={project.link === "/" ? "_self" : "_blank"}
        rel={project.link === "/" ? undefined : "noopener noreferrer"}
        className="absolute inset-0 z-10"
        aria-label={`Open ${project.title} project`}
      />

      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-muted/30">
        {project.image === "#" ? (
          <div className="flex h-full w-full items-center justify-center bg-muted/20">
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground/40">
              Concept Phase
            </span>
          </div>
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={90}
            className="object-contain object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            priority={project.title === "SAAB Doors"}
          />
        )}
        <div className="progressive-blur opacity-60" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-foreground">
              {project.title}
            </h3>
            {project.link === "#" && (
              <span className="w-fit -translate-x-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                Coming Soon
              </span>
            )}
          </div>
      {project.link !== "#" && (
            <a
              href={project.link}
              target={project.link === "/" ? "_self" : "_blank"}
              rel={project.link === "/" ? undefined : "noopener noreferrer"}
              className="relative z-20 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`View ${project.title}`}
            >
              {project.link.includes("github.com") ? (
                <Github className="h-[18px] w-[18px] text-accent transition-colors group-hover:text-foreground" />
              ) : (
                <Globe className="h-[18px] w-[18px] text-accent transition-colors group-hover:text-foreground" />
              )}
            </a>
          )}
        </div>

        <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <p className="mb-4 text-xs text-muted-foreground/80">[ADD PROJECT CONTRIBUTIONS / OUTCOMES]</p>

        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-secondary px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-secondary-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.link !== "#" && (
            <ExternalLink className="h-[18px] w-[18px] shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<"all" | "current" | "soon">("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "soon") return project.link === "#";
    if (filter === "current") return project.link !== "#";
    return true;
  });

  const MOBILE_INITIAL_COUNT = 3;
  const DESKTOP_INITIAL_COUNT = 6;
  const hasMore =
    filter === "all" && filteredProjects.length > MOBILE_INITIAL_COUNT;

  const mobileFirstProjects = filteredProjects.slice(
    0,
    filter === "all" ? MOBILE_INITIAL_COUNT : undefined
  );
  const desktopPreviewProjects =
    filter === "all"
      ? filteredProjects.slice(MOBILE_INITIAL_COUNT, DESKTOP_INITIAL_COUNT)
      : [];
  const mobileRemainingProjects =
    filter === "all" ? filteredProjects.slice(MOBILE_INITIAL_COUNT) : [];
  const desktopRemainingProjects =
    filter === "all" ? filteredProjects.slice(DESKTOP_INITIAL_COUNT) : [];

  return (
    <ViewportFadeSection id="projects" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-14 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Projects
            </h2>
            <span className="h-px flex-1 bg-border" />
          </div>
        </FadeIn>

        <FadeIn>
          <p className="mx-auto mb-14 max-w-2xl text-center text-lg text-muted-foreground">
            A collection of projects and tools designed towards building Agentic Systems that can reason, retrieve, and act on information.
          </p>
        </FadeIn>

        <FadeIn className="mb-10 flex justify-center">
          <div className="project-filter-glass flex rounded-full p-1">
            {(["all", "current", "soon"] as const).map((f) => {
              const isActive = filter === f;
              const showHighlight = hovered === f || (!hovered && isActive);

              return (
                <motion.button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    if (f !== "all") setShowAll(false);
                  }}
                  onHoverStart={() => setHovered(f)}
                  onHoverEnd={() => setHovered(null)}
                  aria-pressed={isActive}
                  className="relative rounded-full px-6 py-2 text-sm font-medium"
                >
                  {showHighlight && (
                    <motion.span
                      layoutId="filterHighlight"
                      className="project-filter-active absolute inset-0 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors duration-200 ${isActive
                      ? "text-foreground"
                      : hovered === f
                        ? "text-accent-foreground"
                        : "text-muted-foreground"
                      }`}
                  >
                    {f === "all" ? "All" : f === "current" ? "Current" : "Soon"}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </FadeIn>

        {/* First projects: 3 on mobile, 6 on wider screens */}
        <FadeInStagger
          key={filter}
          className="project-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {mobileFirstProjects.map((project) => (
            <FadeInStaggerItem key={project.title}>
              <ProjectCard project={project} />
            </FadeInStaggerItem>
          ))}
          {desktopPreviewProjects.map((project) => (
            <FadeInStaggerItem key={project.title} className="hidden sm:block">
              <ProjectCard project={project} />
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>

        {/* Remaining projects — collapsible with peek */}
        {(mobileRemainingProjects.length > 0 ||
          desktopRemainingProjects.length > 0) && (
            <div className="relative mt-6">
              <motion.div
                initial={false}
                animate={{ height: showAll ? "auto" : 120 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="grid gap-6 px-1 pt-2 sm:hidden">
                  {mobileRemainingProjects.map((project) => (
                    <ProjectCard key={project.title} project={project} disabled={!showAll} />
                  ))}
                </div>
                <div className="hidden gap-6 px-1 pt-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                  {desktopRemainingProjects.map((project) => (
                    <ProjectCard key={project.title} project={project} disabled={!showAll} />
                  ))}
                </div>
              </motion.div>

              {/* Gradient fade over peeked content */}
              <motion.div
                initial={false}
                animate={{ opacity: showAll ? 0 : 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-background via-background/80 to-transparent"
              />
            </div>
          )}

        {/* See All / Show Less button */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <motion.button
              onClick={() => setShowAll(!showAll)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-border bg-card px-8 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showAll ? "Show Less" : "See All"}
            </motion.button>
          </div>
        )}
      </div>
    </ViewportFadeSection>
  );
}
