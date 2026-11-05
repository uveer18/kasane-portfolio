import type { Metadata } from "next";
import { Projects } from "@/components/sections/projects";
import { Activity } from "@/components/sections/activity";
import { Blog } from "@/components/sections/blog";
import { SiteFrame } from "@/components/layout/site-frame";

export const metadata: Metadata = { title: "Engineering Work — Udayveer Singh", description: "Selected engineering projects by Udayveer Singh." };

export default function WorkPage() { return <SiteFrame><main className="pt-20"><header className="px-[var(--page-gutter)] pb-8 pt-16"><div className="page-shell"><p className="meta-label mb-4 text-ruri">Engineering / 01</p><h1 className="editorial-title text-[clamp(3rem,7vw,5.5rem)]">Engineering, made tangible.</h1><p className="mt-5 max-w-2xl text-muted-foreground">Projects, experiments, and notes from building useful systems.</p></div></header><Projects /><Activity /><Blog /></main></SiteFrame>; }
