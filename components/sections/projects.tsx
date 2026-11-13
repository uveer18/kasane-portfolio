
"use client";

import { useState } from "react";
import {
  FadeIn,
  FadeInStagger,
  FadeInStaggerItem,
  ViewportFadeSection,
} from "@/components/ui/motion";
import { ExternalLink, Github, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

/**
 * One canonical record per project.
 * Keep project metadata and presentation data together.
 */
const projects = [
  {
    title: "SAAB Doors",
    description:
      "A high-performance, conversion-focused digital platform for custom entrance and internal doors. Features an interactive quote estimator, dynamic product catalog, and a WhatsApp-first customer acquisition flow.",
    tech: ["React 19", "Vite", "Tailwind v4", "Framer Motion", "Zustand"],
    link: "https://saabdoors.vercel.app",
    image: "/images/projects/saabdoors.webp",
  },
  {
    title: "Winder",
    description:
      "A semantic desktop search engine built as a Raycast extension. Combines Gemini multimodal embeddings, ChromaDB, BM25 and Reciprocal Rank Fusion to retrieve relevant information across local documents and images.",
    tech: [
      "TypeScript",
      "Node.js",
      "Gemini API",
      "ChromaDB",
      "BM25",
      "RRF",
    ],
    link: "https://github.com/uveer18/winder",
    image: "/images/projects/winder.webp",
  },
  {
    title: "RogNidhi",
    description:
      "An AI-powered medical information management platform that transforms scattered medical records into structured health timelines. Finalist at HackMol 7.0. Uses a multi-stage clinical RAG pipeline for extracting information from prescriptions and medical documents.",
    tech: ["React", "Django", "FAISS", "LLMs", "cRAG", "TypeScript"],
    link: "https://github.com/royalmaddy07/RogNidhi",
    image: "/images/projects/rognidhi.webp",
  },
  {
    title: "Portfolio Site",
    description:
      "A personal portfolio built with Next.js and React, combining an editorial Japanese-inspired design system with interactive photography galleries, live GitHub and LeetCode integrations, and carefully crafted motion.",
    tech: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Framer Motion",
    ],
    link: "/",
    image: "/images/projects/portfolio.webp",
  },
  {
    title: "EXIF EV Predictor",
    description:
      "An experimental machine learning tool that predicts exposure compensation from photographic EXIF metadata and scene characteristics, exploring the relationship between camera settings and exposure outcomes.",
    tech: [
      "Python",
      "OpenCV",
      "Scikit-learn",
      "Pandas",
      "NumPy",
    ],
    link: "https://github.com/uveer18/lensiq-1-ev-predictor",
    image: "/images/projects/exif-ev.webp",
  },
  {
    title: "ColorFlow",
    description:
      "A machine learning experiment in photographic mood classification. Analyzes image color distributions and visual characteristics to identify emotional tones and aesthetic patterns.",
    tech: [
      "Python",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
    ],
    link: "https://github.com/uveer18/lensiq-3-colorflow",
    image: "/images/projects/colorflow.webp",
  },
  {
    title: "Infeared",
    description:
      "A benchmark-driven AI inference serving platform focused on high-throughput model execution. Building a C++ inference engine with bounded request queues, worker pools, batching and resource management, alongside a Python control plane and real-time observability stack.",
    tech: [
      "C++17",
      "ONNX Runtime",
      "Boost.Beast",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Prometheus",
      "Grafana",
      "Docker",
    ],
    link: "#",
    image: "#",
  },
  {
    title: "Relyed",
    description:
      "A reliable event-delivery backend built around the transactional outbox pattern. Designed to ensure database transactions and asynchronous event publishing remain consistent, with persistent event storage, Redis Streams-based delivery and failure handling.",
    tech: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis Streams",
      "Docker",
    ],
    link: "#",
    image: "#",
  },
  {
    title: "AutoQA",
    description:
      "An automated website testing system for AI-generated and e-commerce websites, exploring intelligent test generation, browser automation and validation of dynamically generated interfaces.",
    tech: ["TypeScript", "Next.js", "FastAPI", "LangChain"],
    link: "#",
    image: "#",
  },
  {
    title: "PhotoCompAI",
    description:
      "An experimental computer vision system for photographic composition analysis. Explores framing, visual balance, subject placement and compositional principles to provide actionable feedback to photographers.",
    tech: ["Python", "PyTorch", "CNN", "CLIP"],
    link: "#",
    image: "#",
  },
  {
    title: "NoiseSense",
    description:
      "An image restoration experiment focused on removing high-ISO and low-light noise while preserving fine details, textures and natural image characteristics.",
    tech: ["Python", "PyTorch", "U-Net", "CUDA"],
    link: "#",
    image: "#",
  },
  {
    title: "StyleLens",
    description:
      "An exploration of neural style transfer, applying artistic visual characteristics to photographs while attempting to preserve their original composition, structure and photographic detail.",
    tech: ["Python", "PyTorch", "GANs", "Docker"],
    link: "#",
    image: "#",
  },
];

type Project = (typeof projects)[number];

function getProjectTone(title: string) {
  const tones: Record<string, string> = {
    "SAAB Doors": "var(--bengara-surface)",
    Winder: "var(--ruri-text)",
    RogNidhi: "var(--seiji-surface)",
    "Portfolio Site": "var(--kohaku-surface)",
    "EXIF EV Predictor": "var(--matcha-surface)",
    ColorFlow: "var(--matcha-surface)",
    Infeared: "var(--ruri-text)",
    Relyed: "var(--seiji-surface)",
    AutoQA: "var(--kohaku-surface)",
    PhotoCompAI: "var(--matcha-surface)",
    NoiseSense: "var(--ruri-text)",
    StyleLens: "var(--bengara-surface)",
  };

  return tones[title] ?? "var(--bengara-surface)";
}

function ProjectCard({
  project,
  disabled = false,
}: {
  project: Project;
  disabled?: boolean;
}) {
  const projectTone = getProjectTone(project.title);
  const isConcept = project.link === "#";
  const isGithub = project.link.includes("github.com");

  return (
    <motion.div
      whileHover={disabled ? undefined : { y: -4 }}
      transition={{ duration: 0.2 }}
      style={{ borderTop: `3px solid ${projectTone}` }}
      className={`card-lit relative flex h-full flex-col overflow-hidden rounded-xl border ${
        disabled ? "pointer-events-none" : "group"
      }`}
    >
      {/* Main clickable surface */}
      {!isConcept && (
        <a
          href={project.link}
          target={project.link === "/" ? "_self" : "_blank"}
          rel={
            project.link === "/" ? undefined : "noopener noreferrer"
          }
          className="absolute inset-0 z-10"
          aria-label={`Open ${project.title} project`}
        />
      )}

      {/* Project preview */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-lum-sunken">
        {project.image === "#" ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-lum-sunken">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground/40">
              Concept Phase
            </span>
            <span
              className="h-px w-12"
              style={{ backgroundColor: projectTone }}
            />
          </div>
        ) : (
          <Image
            src={project.image}
            alt={`${project.title} project preview`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={90}
            className="object-contain object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            priority={project.title === "SAAB Doors"}
          />
        )}

        <div className="image-fade opacity-60" />
      </div>

      {/* Project information */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-foreground">
              {project.title}
            </h3>

            {isConcept && (
              <span className="w-fit -translate-x-1 rounded-full bg-bengara/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-bengara">
                Coming Soon
              </span>
            )}
          </div>

          {!isConcept && (
            <a
              href={project.link}
              target={project.link === "/" ? "_self" : "_blank"}
              rel={
                project.link === "/" ? undefined : "noopener noreferrer"
              }
              className="relative z-20 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`View ${project.title}`}
            >
              {isGithub ? (
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

        {/* Technology stack */}
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

          {!isConcept && (
            <ExternalLink className="h-[18px] w-[18px] shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<
    "all" | "current" | "soon"
  >("all");

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
    filter === "all" &&
    filteredProjects.length > MOBILE_INITIAL_COUNT;

  // First three projects are visible on all screen sizes.
  const mobileFirstProjects =
    filteredProjects.slice(0, MOBILE_INITIAL_COUNT);

  // Projects four through six are additionally visible on desktop.
  const desktopPreviewProjects =
    filter === "all"
      ? filteredProjects.slice(
          MOBILE_INITIAL_COUNT,
          DESKTOP_INITIAL_COUNT
        )
      : [];

  // Remaining projects are revealed by See All.
  const mobileRemainingProjects =
    filter === "all"
      ? filteredProjects.slice(MOBILE_INITIAL_COUNT)
      : [];

  const desktopRemainingProjects =
    filter === "all"
      ? filteredProjects.slice(DESKTOP_INITIAL_COUNT)
      : [];

  return (
    <ViewportFadeSection
      id="projects"
      className="px-[var(--page-gutter)] py-24 md:py-32"
    >
      <div className="page-shell">
        {/* Section heading */}
        <FadeIn>
          <div className="mb-14 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />

            <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Projects
            </h2>

            <span className="h-px flex-1 bg-border" />
          </div>
        </FadeIn>

        {/* Introduction */}
        <FadeIn>
          <p className="mx-auto mb-14 max-w-2xl text-center text-lg text-muted-foreground">
            From low-level systems and reliable backend infrastructure
            to machine learning, developer tools and computational
            photography. A collection of things I&apos;ve built,
            explored and experimented with.
          </p>
        </FadeIn>

        {/* Filters */}
        <FadeIn className="mb-10 flex justify-center">
          <div className="filter-lit flex rounded-full p-1">
            {(["all", "current", "soon"] as const).map((f) => {
              const isActive = filter === f;
              const showHighlight =
                hovered === f || (!hovered && isActive);

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
                    className={`relative z-10 transition-colors duration-200 ${
                      showHighlight ? "text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {f === "all"
                      ? "All"
                      : f === "current"
                        ? "Current"
                        : "Soon"}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </FadeIn>

        {/* Initial projects: 3 on mobile, 6 on desktop */}
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
            <FadeInStaggerItem
              key={project.title}
              className="hidden sm:block"
            >
              <ProjectCard project={project} />
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>

        {/* Remaining projects — collapsible */}
        {(mobileRemainingProjects.length > 0 ||
          desktopRemainingProjects.length > 0) && (
          <div className="relative mt-6">
            <motion.div
              initial={false}
              animate={{
                height: showAll ? "auto" : 120,
              }}
              transition={{
                duration: 0.7,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden"
            >
              {/* Mobile remaining projects */}
              <div className="grid gap-6 px-1 pt-2 sm:hidden">
                {mobileRemainingProjects.map((project) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    disabled={!showAll}
                  />
                ))}
              </div>

              {/* Desktop remaining projects */}
              <div className="hidden gap-6 px-1 pt-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                {desktopRemainingProjects.map((project) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    disabled={!showAll}
                  />
                ))}
              </div>
            </motion.div>

            {/* Gradient fade */}
            <motion.div
              initial={false}
              animate={{
                opacity: showAll ? 0 : 1,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-background via-background/80 to-transparent"
            />
          </div>
        )}

        {/* See All / Show Less */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <motion.button
              onClick={() => setShowAll(!showAll)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="card-lit btn-lit rounded-full border px-8 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {showAll ? "Show Less" : "See All"}
            </motion.button>
          </div>
        )}
      </div>
    </ViewportFadeSection>
  );
}
