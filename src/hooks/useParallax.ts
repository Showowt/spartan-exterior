"use client";

import { useEffect, useState } from "react";

interface ParallaxValues {
  layer1: number;
  layer2: number;
  layer3: number;
}

export function useParallax(maxScroll: number = 800): ParallaxValues {
  const [values, setValues] = useState<ParallaxValues>({
    layer1: 0,
    layer2: 0,
    layer3: 0,
  });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = Math.min(window.scrollY, maxScroll);
          setValues({
            layer1: scrollY * 0.1,
            layer2: scrollY * 0.2,
            layer3: scrollY * 0.3,
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [maxScroll]);

  return values;
}
