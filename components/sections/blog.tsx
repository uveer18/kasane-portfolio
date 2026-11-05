"use client";

import { FadeIn, FadeInStagger, FadeInStaggerItem, ViewportFadeSection } from "@/components/ui/motion";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const posts = [
  {
    title: "Building Better Exposure Models with Deep Learning",
    description:
      "Exploring how convolutional neural networks can predict optimal camera settings from scene analysis.",
    date: "Coming Soon",
    category: "Machine Learning",
  },
  {
    title: "The Art of Macro Photography",
    description:
      "Tips and techniques for capturing stunning close-up shots of nature's smallest details.",
    date: "Coming Soon",
    category: "Photography",
  },
  {
    title: "Understanding Neural Style Transfer",
    description:
      "A deep dive into how AI can apply artistic styles to photographs while maintaining realism.",
    date: "Coming Soon",
    category: "AI & Art",
  },
  {
    title: "Color Theory for Photographers",
    description:
      "How understanding color palettes can improve your photography and post-processing workflow.",
    date: "Coming Soon",
    category: "Photography",
  },
];

function BlogCard({ post }: { post: (typeof posts)[number] }) {
  return (
    <motion.article
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group flex items-start justify-between gap-4 border-b border-border py-6 last:border-0"
    >
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-3">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>
        <h3 className="mb-2 text-lg font-medium text-foreground transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>
      </div>
      <ArrowUpRight className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.article>
  );
}

export function Blog() {
  return (
    <ViewportFadeSection id="blog" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <div className="mb-16 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Blog
            </h2>
            <span className="h-px flex-1 bg-border" />
          </div>
        </FadeIn>

        <FadeIn>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-muted-foreground">
            Thoughts and explorations at the intersection of AI, machine
            learning, and photography.
          </p>
        </FadeIn>

        <FadeInStagger className="divide-y divide-border rounded-xl border border-border bg-card p-2">
          {posts.map((post) => (
            <FadeInStaggerItem key={post.title} className="px-4">
              <BlogCard post={post} />
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
      </div>
    </ViewportFadeSection>
  );
}
