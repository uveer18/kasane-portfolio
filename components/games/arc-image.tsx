"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ArcImageProps = Omit<ImageProps, "onLoad"> & {
  /** Skip the fade-in when the image is the LCP candidate. */
  eager?: boolean;
};

/**
 * Artwork wrapper that fades the frame in once the bytes have arrived, so the
 * archive never flashes an empty graphite rectangle while it loads.
 */
export function ArcImage({ eager, className, alt, ...props }: ArcImageProps) {
  const [loaded, setLoaded] = useState(false);

  if (eager) {
    return <Image {...props} alt={alt} className={className} priority />;
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={cn("arc-img", loaded && "is-loaded", className)}
      onLoad={() => setLoaded(true)}
    />
  );
}
