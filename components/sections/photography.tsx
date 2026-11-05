import { FadeIn, ViewportFadeSection } from "@/components/ui/motion";
import { PhotoGallery } from "@/components/photography/photo-gallery";

export function Photography() {
  return (
    <ViewportFadeSection id="photography" className="px-[var(--page-gutter)] py-24 md:py-32">
      <div className="page-shell">
        <FadeIn>
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div><p className="meta-label mb-4 text-accent">A visual journal · 02</p><h2 className="section-heading">Photography</h2></div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">A curated collection of nature and macro photography capturing the beauty and intricacy of the natural world.</p>
          </div>
        </FadeIn>
        <PhotoGallery preview />
      </div>
    </ViewportFadeSection>
  );
}
