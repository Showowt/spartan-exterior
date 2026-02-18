"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {},
): [React.RefObject<T | null>, boolean] {
  const {
    threshold = 0.15,
    rootMargin = "-50px",
    triggerOnce = true,
  } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

// Hook for staggered children reveals
export function useStaggerReveal(
  parentVisible: boolean,
  childCount: number,
  delayMs: number = 100,
): boolean[] {
  const [visibleChildren, setVisibleChildren] = useState<boolean[]>(
    Array(childCount).fill(false),
  );

  useEffect(() => {
    if (!parentVisible) {
      setVisibleChildren(Array(childCount).fill(false));
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    for (let i = 0; i < childCount; i++) {
      const timeout = setTimeout(() => {
        setVisibleChildren((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * delayMs);
      timeouts.push(timeout);
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [parentVisible, childCount, delayMs]);

  return visibleChildren;
}
