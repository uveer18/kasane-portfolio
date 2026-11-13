"use client";

import { FadeIn, FadeInStagger, FadeInStaggerItem, ViewportFadeSection } from "@/components/ui/motion";
import { Brain, Camera, Code, Sparkles, GraduationCap, School, Database, Cpu, Layers, Palette } from "lucide-react";
import { motion } from "framer-motion";

const education = [
  {
    icon: GraduationCap,
    institution: "National Institute of Technology, Jalandhar",
    degree: "B.Tech in Information Technology",
    period: "2024 - Present",
    grade: "Current CGPA: 8.07/10",
    description: "Focused on Agentic AI systems and LLMs while maintaining my interests in photography and creative projects.",
  },
  {
    icon: School,
    institution: "Police DAV Public School, Jalandhar",
    degree: "Grade 12, Science Stream",
    period: "2022 - 2024",
    grade: "Percentage: 93.4%",
    description: "School foundation built through mathematics, physics, chemistry, and analytical problem solving.",
  },
];

const skills = [
  {
    category: "AI & ML",
    items: ["RAG", "Vector Embeddings", "LangChain", "LangGraph", "Ollama", "LLMs", "scikit-learn", "OpenCV"],
  },
  {
    category: "Backend & Persistence",
    items: ["Python", "FastAPI", "Supabase", "ChromaDB", "FAISS"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
  },
  {
    category: "Tools & Platforms",
    items: ["Git", "Linux", "Docker", "Codex", "Vercel", "Render", "Kaggle", "Raycast"],
  },
  {
    category: "Coursework",
    items: ["DSA", "OS", "DBMS", "CSA", "CN"],
  },
];

export function About() {
  return (
    <ViewportFadeSection id="about" className="relative px-[var(--page-gutter)] py-24 md:py-20 overflow-hidden">
      <div className="page-shell">
        <FadeIn>
          <div className="mb-12 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">About Me</h2>
            <span className="h-px flex-1 bg-border" />
          </div>
        </FadeIn>

        <FadeIn className="mb-8">
          <h3 className="font-outfit text-2xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.2]">
            Building <span className="text-accent">agentic systems</span> <span className="text-gradient">for a visual world.</span>
          </h3>
        </FadeIn>

        <div className="grid gap-16 lg:grid-cols-12">
          {/* Main Content Column */}
          <div className="lg:col-span-7 space-y-12">
            <FadeIn>
              <div className="space-y-6 text-md text-muted-foreground leading-relaxed">
                <p>
                  I&apos;m an <span className="text-foreground font-medium">Information Technology</span> student at{" "}
                  <span className="text-foreground font-medium">NIT Jalandhar</span> (Class of <span className="text-foreground font-medium">2028</span>),
                  focused on building intelligent systems that can reason, retrieve, and act on information.
                </p>

                <p>
                  I&apos;m particularly interested in agentic AI systems and multimodal workflows of LLMs. I focus on how systems are structured, orchestration, retrieval, memory, and performance;
                  ensuring they are reliable, scalable, and actually useful beyond demos.
                </p>

                <p>
                  Outside of engineering, photography shapes how I think about perception and detail.
                  It influences how I approach visual data and system design focused on clarity, structure,
                  and extracting meaningful signals from complex inputs.
                </p>
              </div>
            </FadeIn>

            {/* Skills Grid */}
            <FadeIn className="pt-8">
              <h4 className="mb-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground/60">Technical Arsenal</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {skills.map((group) => (
                  <div key={group.category} className="space-y-3">
                    <h5 className="text-sm font-medium text-foreground/80">{group.category}</h5>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Sidebar / Education Column */}
          <div className="lg:col-span-5 space-y-12">
            <FadeIn>
              <h3 className="mb-8 text-lg font-semibold text-foreground flex items-center gap-3">
                Education
              </h3>
              <div className="space-y-10 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border/50">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.institution}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="group relative pl-12"
                  >
                    <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors group-hover:border-accent">
                      <edu.icon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <div className="card-lit space-y-2 rounded-2xl border p-5 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-md font-semibold text-foreground">{edu.institution}</h4>
                        <span className="text-xs font-medium text-bengara bg-bengara/10 px-2 py-0.5 -translate-x-[4px] rounded-full">{edu.period}</span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{edu.degree}</p>
                      <p className="text-xs text-accent/80 font-mono">{edu.grade}</p>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed">{edu.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </ViewportFadeSection>
  );
}
