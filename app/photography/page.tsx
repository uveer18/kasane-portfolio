import type { Metadata } from "next";
import { Instagram } from "lucide-react";
import { PhotoGallery } from "@/components/photography/photo-gallery";
import { PhotoUploadLogin } from "@/components/photography/photo-upload-login";
import { PhotographerQuote } from "@/components/photography/photographer-quote";
import { SiteFrame } from "@/components/layout/site-frame";

export const metadata: Metadata = {
  title: "Photography — Udayveer Singh",
  description: "A visual journal of nature and macro photography by Udayveer Singh.",
};

export default function PhotographyPage() {
  return (
    <SiteFrame>
      <main className="px-[var(--page-gutter)] pb-12 pt-28 sm:pt-32">
        <div className="page-shell">
          <header className="photography-intro-header">
            <p className="meta-label text-seiji-ink">Visual journal / 02</p>
            <h1 className="editorial-title photography-title">A way of paying attention.</h1>
          </header>
          <div className="photography-intro">
            <div className="photography-intro-text">
              <p className="photography-lede">
                A curated collection of nature and macro photography capturing the beauty and intricacy of the natural world.
              </p>
              <a
                href="https://instagram.com/soltragrv"
                target="_blank"
                rel="noreferrer noopener"
                className="instagram-link"
              >
                <Instagram size={15} aria-hidden="true" />
                <span>@soltragrv</span>
              </a>
            </div>
            <div className="photography-intro-quote">
              <PhotographerQuote />
            </div>
          </div>
          <PhotoGallery />
          <PhotoUploadLogin />
        </div>
      </main>
    </SiteFrame>
  );
}
