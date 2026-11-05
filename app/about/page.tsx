import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { SiteFrame } from "@/components/layout/site-frame";

export const metadata: Metadata = { title: "About — Udayveer Singh", description: "About Udayveer Singh, an Information Technology student at NIT Jalandhar interested in AI systems and photography." };

export default function AboutPage() { return <SiteFrame><main className="pt-20"><header className="px-[var(--page-gutter)] pb-2 pt-16"><div className="page-shell"><p className="meta-label mb-4 text-matcha">About / 04</p><h1 className="editorial-title text-[clamp(3rem,7vw,5.5rem)]">A little beyond the work.</h1></div></header><About /><Experience /></main></SiteFrame>; }
