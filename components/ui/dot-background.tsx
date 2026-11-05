"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DotBackgroundProps {
  className?: string;
  dotSize?: "sm" | "md" | "xl";
  showGradient?: boolean;
}

export function DotBackground({ 
  className, 
  dotSize = "md",
  showGradient = true 
}: DotBackgroundProps) {
  const getGridClass = () => {
    switch(dotSize) {
      case "sm": return "bg-dot-grid-sm";
      case "xl": return "bg-dot-grid-xl";
      default: return "bg-dot-grid";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={cn(
        "pointer-events-none fixed inset-0 z-[-1] overflow-hidden",
        getGridClass(),
        className
      )}
    >
      {showGradient && (
        <div 
          className="absolute inset-0 bg-background/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" 
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}
