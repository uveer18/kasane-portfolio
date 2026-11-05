import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { SiteFrame } from "@/components/layout/site-frame";

export const metadata: Metadata = { title: "Contact — Udayveer Singh", description: "Get in touch with Udayveer Singh." };

export default function ContactPage() { return <SiteFrame><main className="pt-24"><header className="px-[var(--page-gutter)] pt-12"><div className="page-shell"><p className="meta-label mb-4 text-seiji-ink">Contact / 05</p><h1 className="editorial-title text-[clamp(3rem,7vw,5.5rem)]">Have something in mind?</h1><p className="mt-4 max-w-xl text-muted-foreground">A short note is a good place to start.</p></div></header><Contact /></main></SiteFrame>; }
