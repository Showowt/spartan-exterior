"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const percentage = Math.min((scrolled / scrollHeight) * 100, 100);

      setProgress(percentage);
      setIsVisible(scrolled > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:block"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      {/* Spear shaft */}
      <div className="relative w-2 h-48">
        {/* Background track */}
        <div className="absolute inset-0 bg-spartan-gold/20 border border-spartan-gold/30" />

        {/* Progress fill */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-spartan-gold via-spartan-gold-light to-spartan-gold transition-all duration-150"
          style={{ height: `${progress}%` }}
        />

        {/* Spearhead at top */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 transition-all duration-300"
          style={{
            filter: progress > 95 ? "drop-shadow(0 0 8px #d4af37)" : "none",
          }}
        >
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            className="text-spartan-gold"
          >
            <path d="M8 0L16 16H12V24H4V16H0L8 0Z" fill="currentColor" />
          </svg>
        </div>

        {/* Spear base */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-spartan-bronze border border-spartan-gold" />
      </div>

      {/* Percentage indicator */}
      <div
        className="absolute -left-8 text-xs font-cinzel text-spartan-gold/70 transition-opacity duration-300"
        style={{
          top: `${100 - progress}%`,
          opacity: progress > 5 ? 1 : 0,
        }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
}
