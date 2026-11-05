"use client";

import { createContext, useContext, useState } from "react";

interface HeroContextType {
  isHeroVisible: boolean;
  setIsHeroVisible: (visible: boolean) => void;
}

const HeroContext = createContext<HeroContextType | null>(null);

export function HeroProvider({ children }: { children: React.ReactNode }) {
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  return (
    <HeroContext.Provider value={{ isHeroVisible, setIsHeroVisible }}>
      {children}
    </HeroContext.Provider>
  );
}

export function useHero() {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error("useHero must be used within a HeroProvider");
  }
  return context;
}