import type { Metadata } from "next";
import { PhotoGallery } from "@/components/photography/photo-gallery";
import { PhotoUploadLogin } from "@/components/photography/photo-upload-login";
import { SiteFrame } from "@/components/layout/site-frame";

export const metadata: Metadata = { title: "Photography — Udayveer Singh", description: "A visual journal of nature and macro photography by Udayveer Singh." };

export default function PhotographyPage() {
  return <SiteFrame><main className="px-[var(--page-gutter)] pb-12 pt-32 sm:pt-40"><div className="page-shell">
    <p className="meta-label mb-5 text-seiji-ink">Visual journal / 02</p>
    <div className="mb-10"><h1 className="editorial-title text-[clamp(3.5rem,8vw,7rem)]">A way of paying attention.</h1><p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">A curated collection of nature and macro photography capturing the beauty and intricacy of the natural world.</p></div>
    <PhotoGallery />
    <PhotoUploadLogin />
  </div></main></SiteFrame>;
}
